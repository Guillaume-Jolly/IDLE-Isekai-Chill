/**
 * Rétention journaux lanceur — 1 jour.
 * Fichiers .dev-session obsolètes → move vers old_2_2/launcher-logs/ (pas de suppression disque).
 */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, join } from 'node:path'
import { LOG_CHANNEL_IDS } from './log-channels.mjs'

export const LOG_RETENTION_MS = 86_400_000

const PROTECTED_SESSION_FILES = new Set(['state.json', 'launcher.lock'])

export function formatLogStamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function parseLogLineMs(line) {
  const text = String(line)
  const dated = text.match(/^\[(\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2})/)
  if (dated) {
    const ms = Date.parse(dated[1].replace(' ', 'T'))
    if (Number.isFinite(ms)) return ms
  }
  const iso = text.match(/^\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?)\]/)
  if (iso) {
    const ms = Date.parse(iso[1])
    if (Number.isFinite(ms)) return ms
  }
  const legacy = text.match(/^\[(\d{2}:\d{2}:\d{2})\]/)
  if (legacy) {
    const d = new Date()
    const [h, m, s] = legacy[1].split(':').map(Number)
    d.setHours(h, m, s, 0)
    return d.getTime()
  }
  return null
}

export function pruneLogLinesByAge(lines, maxAgeMs = LOG_RETENTION_MS, now = Date.now()) {
  const cutoff = now - maxAgeMs
  return lines.filter((line) => {
    const ms = parseLogLineMs(line)
    if (ms == null) return true
    return ms >= cutoff
  })
}

function moveFileToArchive(src, archiveDir) {
  const base = basename(src)
  let dest = join(archiveDir, base)
  if (existsSync(dest)) {
    const ext = base.includes('.') ? base.slice(base.lastIndexOf('.')) : ''
    const stem = ext ? base.slice(0, -ext.length) : base
    dest = join(archiveDir, `${stem}-${Date.now()}${ext}`)
  }
  renameSync(src, dest)
  return dest
}

function archiveDateFolder(now = Date.now()) {
  const d = new Date(now)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * Fichiers .log / restart-gen-* dont mtime &lt; cutoff → old_2_2/launcher-logs/YYYY-MM-DD/
 */
export function archiveStaleSessionFiles(sessionDir, repoRoot, maxAgeMs = LOG_RETENTION_MS, now = Date.now()) {
  if (!existsSync(sessionDir)) return { moved: 0, paths: [] }
  const cutoff = now - maxAgeMs
  const archiveDir = join(repoRoot, 'old_2_2', 'launcher-logs', archiveDateFolder(now))
  mkdirSync(archiveDir, { recursive: true })
  const moved = []
  for (const name of readdirSync(sessionDir)) {
    if (PROTECTED_SESSION_FILES.has(name)) continue
    const isLog = /\.log$/i.test(name) || /^restart-gen-\d+\.log$/i.test(name)
    if (!isLog) continue
    const full = join(sessionDir, name)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (!st.isFile() || st.mtimeMs >= cutoff) continue
    try {
      moved.push(moveFileToArchive(full, archiveDir))
    } catch {
      /* fichier verrouillé — prochain passage */
    }
  }
  return { moved: moved.length, paths: moved, archiveDir }
}

/**
 * Réécrit un fichier ligne à ligne en ne gardant que les entrées &lt; maxAge.
 */
export function pruneTimestampedLogFile(filePath, maxAgeMs = LOG_RETENTION_MS, now = Date.now()) {
  if (!existsSync(filePath)) return { kept: 0, removed: 0 }
  let text
  try {
    text = readFileSync(filePath, 'utf8')
  } catch {
    return { kept: 0, removed: 0, error: 'read' }
  }
  const lines = text.split(/\r?\n/).filter(Boolean)
  const cutoff = now - maxAgeMs
  const kept = []
  let removed = 0
  for (const line of lines) {
    const bracket = line.match(/^\[([^\]]+)\]/)
    const ms = parseLogLineMs(line) ?? (bracket ? Date.parse(bracket[1]) : null)
    if (ms != null && Number.isFinite(ms) && ms < cutoff) {
      removed += 1
      continue
    }
    kept.push(line)
  }
  try {
    writeFileSync(filePath, kept.length ? `${kept.join('\n')}\n` : '', 'utf8')
  } catch {
    return { kept: kept.length, removed, error: 'write' }
  }
  return { kept: kept.length, removed }
}

/** Fichier sans horodatage fiable — garde les N dernières lignes. */
export function trimTailLogFile(filePath, maxLines = 8000) {
  if (!existsSync(filePath)) return { kept: 0, trimmed: 0 }
  let text
  try {
    text = readFileSync(filePath, 'utf8')
  } catch {
    return { kept: 0, trimmed: 0 }
  }
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length <= maxLines) return { kept: lines.length, trimmed: 0 }
  const kept = lines.slice(-maxLines)
  try {
    writeFileSync(filePath, `${kept.join('\n')}\n`, 'utf8')
  } catch {
    return { kept: kept.length, trimmed: lines.length - kept.length, error: 'write' }
  }
  return { kept: kept.length, trimmed: lines.length - kept.length }
}

/**
 * @param {object} opts
 * @param {string} opts.sessionDir
 * @param {string} opts.repoRoot
 * @param {string[]} opts.logLines
 * @param {Record<string, string[]>} opts.logChannels
 * @param {string} [opts.viteLogFile]
 * @param {string} [opts.spawnAuditFile]
 * @param {string} [opts.consoleLogFile]
 */
export function runLogRetention({
  sessionDir,
  repoRoot,
  logLines,
  logChannels,
  viteLogFile,
  spawnAuditFile,
  consoleLogFile,
  maxAgeMs = LOG_RETENTION_MS,
  now = Date.now(),
}) {
  const beforeUser = logLines.length
  const beforeChannels = LOG_CHANNEL_IDS.reduce((sum, id) => sum + (logChannels[id]?.length ?? 0), 0)
  const prunedUser = pruneLogLinesByAge(logLines, maxAgeMs, now)
  logLines.splice(0, logLines.length, ...prunedUser)
  let channelsRemoved = 0
  for (const id of LOG_CHANNEL_IDS) {
    const before = logChannels[id]?.length ?? 0
    const pruned = pruneLogLinesByAge(logChannels[id] ?? [], maxAgeMs, now)
    logChannels[id] = pruned
    channelsRemoved += before - pruned.length
  }

  const fileResults = {}
  if (spawnAuditFile) fileResults.spawnAudit = pruneTimestampedLogFile(spawnAuditFile, maxAgeMs, now)
  if (viteLogFile) fileResults.vite = pruneTimestampedLogFile(viteLogFile, maxAgeMs, now)
  if (consoleLogFile) fileResults.console = trimTailLogFile(consoleLogFile, 12_000)

  const archived = archiveStaleSessionFiles(sessionDir, repoRoot, maxAgeMs, now)

  return {
    retentionHours: maxAgeMs / 3_600_000,
    memory: {
      userRemoved: beforeUser - logLines.length,
      channelsRemoved,
      channelsBefore: beforeChannels,
    },
    files: fileResults,
    archived,
  }
}
