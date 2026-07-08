#!/usr/bin/env node

/**

 * Havre des Brumes — lanceur dev local.

 * Démarre Vite, ouvre le jeu, expose un petit tableau de bord de monitoring.

 */



import { spawn, exec, execFile } from 'node:child_process'

import { createHash } from 'node:crypto'

import { createServer } from 'node:http'

import { networkInterfaces } from 'node:os'

import {

  appendFileSync,

  existsSync,

  mkdirSync,

  openSync,

  readFileSync,

  statSync,

  unlinkSync,

  watchFile,

  writeFileSync,

} from 'node:fs'

import { dirname, join } from 'node:path'

import { fileURLToPath, pathToFileURL } from 'node:url'

import { findPortListenerPid, findAllPortListenerPids, killProcessByPid } from '../windows-shell.mjs'

import { LAUNCHER_LABEL, LAUNCHER_VERSION } from './launcher-version.mjs'
import {
  formatLogStamp,
  LOG_RETENTION_MS,
  pruneLogLinesByAge,
  runLogRetention,
} from './log-retention.mjs'
import {
  channelLineCounts,
  createEmptyLogChannels,
  LOG_CHANNEL_IDS,
  MAX_LOG_CHANNEL_LINES,
  migrateStateLogChannels,
  normalizeLogChannel,
  totalChannelLineCount,
  viteLogChannel,
} from './log-channels.mjs'
import { getAppVersionChangelogPage } from './app-version-changelog.mjs'
import { getProductChangelog, compileProductChangelog } from './product-changelog.mjs'
import { getGameState, compileGameState } from './game-state.mjs'
import {
  BACKLOG_CATEGORIES,
  BACKLOG_STATUS_PRESETS,
  createBacklogItem,
  deleteBacklogItem,
  loadBacklog,
  migrateBacklogTaxonomy,
  reorderBacklogItems,
  updateBacklogItem,
} from './backlog-store.mjs'

import {
  collectMonitoringSnapshot,
  collectProcessInventory,
  invalidateProcessInventoryCache,
  killInventoryProcess,
  runFreezeAudit,
} from './diagnostics.mjs'

import {
  VITE_SERVER_DEFS,
  VITE_DEV_PORTS,
  buildViteSlotStatusPayload,
  createViteSlots,
  resolveViteServerId,
  restoreViteSlotsFromSession,
  serializeViteSlots,
} from './vite-dev-slots.mjs'

import {
  advanceOperation,
  beginOperation,
  completeOperation,
  failOperation,
  getOperation,
  listOperations,
} from './operations.mjs'



const __dirname = dirname(fileURLToPath(import.meta.url))

const REPO_ROOT = join(__dirname, '..', '..')

const DASHBOARD_PORT = Number.parseInt(process.env.HAVRE_DEV_DASHBOARD_PORT ?? '9221', 10)

const MAX_LOG_LINES = 1500

const DASHBOARD_PATH = join(__dirname, 'dashboard.html')

const LAUNCHER_ICON_PATH = join(__dirname, 'launcher-icon.png')

const SESSION_DIR = join(__dirname, '.dev-session')

const SESSION_STATE_FILE = join(SESSION_DIR, 'state.json')

const LAUNCHER_LOCK_FILE = join(SESSION_DIR, 'launcher.lock')

const VITE_LOG_FILE = join(SESSION_DIR, 'vite.log')

const SPAWN_AUDIT_FILE = join(SESSION_DIR, 'spawn-audit.log')

const CONSOLE_LOG_FILE = join(SESSION_DIR, 'console.log')

const REATTACH_ARG = '--reattach'

const CLEANUP_GHOSTS_ARG = '--cleanup-ghosts'

const SESSION_VERSION = 1

const LOG_RETENTION_INTERVAL_MS = 60 * 60 * 1000

const SESSION_AUTOSAVE_MS = 2 * 60 * 1000



/** @type {ReturnType<typeof setInterval> | null} */
let sessionAutosaveTimer = null

/** Verrou acquis — autorise la persistance session sur exit. */
let launcherLockHeld = false

/** @type {ReturnType<typeof createViteSlots>} */
const viteSlots = createViteSlots()

function getViteSlot(serverId = 'game') {
  const id = resolveViteServerId(serverId)
  return viteSlots[id]
}

function gameSlot() {
  return viteSlots.game
}

/** @type {import('node:child_process').ChildProcess | null} */
let buildProcess = null

/** @type {import('node:http').Server | null} */

let dashboardServer = null



/** Exposer Vite sur le LAN (--host) pour accès téléphone */
let devHostExposure = process.env.HAVRE_DEV_LAN === '1'

/** Jeu :5173 volontairement arrêté — ne pas relancer au démarrage du lanceur. */
let gameDevSuppressed = false

let launcherStartedAt = Date.now()

/** Compteur de redémarrages « Mettre à jour le lanceur » — détecté par le dashboard. */
let launcherRestartGeneration = 0

/** Empreinte disque au démarrage du processus Node (détecte modifs sans redémarrage). */
let launcherProcessFingerprint = ''

let openedDashboardOnce = false

let launcherReattached = false

/** @type {string[]} */

let logLines = []

/** @type {Record<string, string[]>} */
let logChannels = createEmptyLogChannels()

/** @type {ReturnType<typeof runLogRetention> & { ranAt?: number } | null} */
let lastLogRetentionInfo = null

let lastViteOutputAt = 0

let viteLogOffset = 0

let viteLogWatchStarted = false

let buildInfoWatchStarted = false



/** @type {Record<string, unknown> | null} */

let lastBuildInfoSnapshot = null

/** @type {string | null} */

let lastBuildInfoKey = null

/** @type {ReturnType<typeof setTimeout> | null} */

let buildInfoWatchTimer = null



const BACKGROUND_ARG = '--background'

const DASHBOARD_IDLE_SHUTDOWN_MS = 20_000

const DASHBOARD_IDLE_CHECK_MS = 5_000

const CONSOLE_HIDE_DELAY_MS = 1_500

const SHUTDOWN_GRACE_MS = 4_000



let backgroundMode = process.argv.includes(BACKGROUND_ARG)

let consoleHidden = false

/** @type {ReturnType<typeof setTimeout> | null} */

let consoleHideTimer = null

/** @type {ReturnType<typeof setInterval> | null} */

let dashboardIdleTimer = null

let lastDashboardPingAt = 0

let dashboardEverConnected = false

/** @type {number} */

let pendingShutdownAt = 0

let shuttingDown = false



function ensureSessionDir() {

  mkdirSync(SESSION_DIR, { recursive: true })

}



/** Trace toute commande système — utile pour diagnostiquer les rafales cmd. */

function auditSpawn(label, detail = '') {

  try {

    ensureSessionDir()

    const stamp = new Date().toISOString()

    appendFileSync(

      SPAWN_AUDIT_FILE,

      `[${stamp}] ${label}${detail ? ` | ${detail}` : ''}\n`,

      'utf8',

    )

  } catch {

    /* ignore */

  }

}



function spawnHidden(command, args, options = {}) {

  auditSpawn('spawn', `${command} ${(args ?? []).join(' ')}`.trim())

  return spawn(command, args, {

    shell: false,

    windowsHide: process.platform === 'win32',

    ...options,

  })

}



function killProcessPid(pid) {

  if (!pid || pid === process.pid) return { ok: false, error: 'PID invalide' }

  auditSpawn('taskkill', `pid=${pid}`)

  return killProcessByPid(pid, true)

}



function releaseLauncherLock() {

  try {

    if (!existsSync(LAUNCHER_LOCK_FILE)) return

    const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

    if (owner === process.pid) unlinkSync(LAUNCHER_LOCK_FILE)

  } catch {

    /* ignore */

  }

}



function tryAcquireLauncherLock() {

  ensureSessionDir()

  if (existsSync(LAUNCHER_LOCK_FILE)) {

    try {

      const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

      if (owner && owner !== process.pid && isProcessAlive(owner)) return false

    } catch {

      /* lock corrompu — on remplace */

    }

    try {

      unlinkSync(LAUNCHER_LOCK_FILE)

    } catch {

      return false

    }

  }

  try {

    writeFileSync(LAUNCHER_LOCK_FILE, String(process.pid), { flag: 'wx' })

    return true

  } catch {

    return false

  }

}



function buildInfoFingerprint(info) {

  if (!info || typeof info !== 'object') return null

  return `${info.versionLabel ?? '?'}|${info.revision ?? '?'}|${info.subRevision ?? '?'}|${info.builtAt ?? '?'}`

}



function formatBuildInfoCapture(previous, next) {

  if (!next || typeof next !== 'object') {

    return 'build-info.json mis à jour (contenu illisible)'

  }



  const label = next.versionLabel ?? '?'

  const commit = next.commitHash ?? '?'

  const dirty = next.dirty ? ' · working tree sale' : ''



  if (!previous) {

    return `Version captée : ${label} (${commit})${dirty}`

  }



  if (previous.versionLabel !== next.versionLabel) {

    return `Version captée : ${previous.versionLabel ?? '?'} → ${label} (${commit})${dirty}`

  }



  if (previous.revision !== next.revision) {

    return `Version captée : ${label} · révision ${previous.revision ?? '?'} → ${next.revision ?? '?'} (${commit})${dirty}`

  }



  if (previous.subRevision !== next.subRevision) {

    return `Version captée : ${label} · sous-révision .${previous.subRevision ?? '?'} → .${next.subRevision ?? '?'} (${commit})${dirty}`

  }



  if (previous.commitHash !== next.commitHash) {

    return `Version captée : ${label} · commit ${previous.commitHash} → ${commit}${dirty}`

  }



  return `Version captée : ${label} (${commit})${dirty}`

}



function handleBuildInfoDiskUpdate() {

  const buildInfoPath = join(REPO_ROOT, 'public', 'build-info.json')

  const next = readJson(buildInfoPath)

  const fingerprint = buildInfoFingerprint(next)



  if (!fingerprint) {

    pushLog('build-info.json touché mais illisible', 'launcher')

    return

  }



  if (fingerprint === lastBuildInfoKey) {

    return

  }



  pushLog(formatBuildInfoCapture(lastBuildInfoSnapshot, next), 'launcher')

  lastBuildInfoSnapshot = next

  lastBuildInfoKey = fingerprint

}



function watchBuildInfoFile() {

  if (buildInfoWatchStarted) return

  buildInfoWatchStarted = true

  const buildInfoPath = join(REPO_ROOT, 'public', 'build-info.json')

  if (!existsSync(buildInfoPath)) {

    return

  }



  const initial = readJson(buildInfoPath)

  if (initial) {

    lastBuildInfoSnapshot = initial

    lastBuildInfoKey = buildInfoFingerprint(initial)

  }



  watchFile(buildInfoPath, { interval: 1500 }, () => {

    if (buildInfoWatchTimer) {

      clearTimeout(buildInfoWatchTimer)

    }

    buildInfoWatchTimer = setTimeout(() => {

      buildInfoWatchTimer = null

      handleBuildInfoDiskUpdate()

    }, 250)

  })

}



/** Conserve les couleurs ANSI ; retire seulement les caractères de contrôle nuisibles. */
function preserveAnsiLogLine(text) {
  return String(text)
    .replace(/(?<!\u001B)\[(\d{1,3}(?:;\d{1,3})*)m/g, '\u001B[$1m')
    .replace(/[\u0000-\u0009\u000b-\u001a\u001c-\u001f]/g, '')
    .trim()
}

function computeLauncherFingerprint() {
  const hash = createHash('sha256')
  for (const name of [
    'server.mjs',
    'dashboard.html',
    'launcher-version.mjs',
    'launcher-changelog.mjs',
    'app-version-changelog.mjs',
    'backlog-store.mjs',
    'product-changelog.mjs',
    'game-state.mjs',
    'game-state-shipped.mjs',
    'panel-export.mjs',
    'backlog-taxonomy.mjs',
    'diagnostics.mjs',
  ]) {
    const filePath = join(__dirname, name)
    if (!existsSync(filePath)) continue
    const st = statSync(filePath)
    hash.update(`${name}:${st.size}:${st.mtimeMs}`)
  }
  return hash.digest('hex').slice(0, 12)
}

function getLauncherSourcesInfo() {
  const files = [
    'server.mjs',
    'dashboard.html',
    'launcher-version.mjs',
    'launcher-changelog.mjs',
    'app-version-changelog.mjs',
    'backlog-store.mjs',
    'product-changelog.mjs',
    'game-state.mjs',
    'game-state-shipped.mjs',
    'panel-export.mjs',
    'backlog-taxonomy.mjs',
    'diagnostics.mjs',
  ]
  let lastModifiedMs = 0
  for (const name of files) {
    const filePath = join(__dirname, name)
    if (!existsSync(filePath)) continue
    lastModifiedMs = Math.max(lastModifiedMs, statSync(filePath).mtimeMs)
  }
  const fingerprintLive = computeLauncherFingerprint()
  const processStale =
    lastModifiedMs > launcherStartedAt + 500 ||
    (launcherProcessFingerprint && fingerprintLive !== launcherProcessFingerprint)
  return {
    version: LAUNCHER_VERSION,
    label: LAUNCHER_LABEL,
    fingerprintLive,
    fingerprintProcess: launcherProcessFingerprint || fingerprintLive,
    sourcesModifiedAt: lastModifiedMs ? new Date(lastModifiedMs).toISOString() : null,
    sourcesModifiedMs: lastModifiedMs,
    processStartedAt: new Date(launcherStartedAt).toISOString(),
    processStartedMs: launcherStartedAt,
    processStale,
  }
}

function getAppVersionLabel() {
  const info = readLocalBuildInfo()
  return info.buildInfo?.versionLabel ?? info.packageVersion ?? '?'
}

function trimLogBuffer(lines, max) {
  if (lines.length > max) return lines.slice(lines.length - max)
  return lines
}

function makeLogEntry(line, source = 'launcher') {
  const preserved = preserveAnsiLogLine(line)
  if (!preserved || !plainLogText(preserved)) return null
  const channel = normalizeLogChannel(source)
  return `[${formatLogStamp()}] [${channel}] ${preserved}`
}

function applyLogRetention({ quiet = false } = {}) {
  try {
    const result = runLogRetention({
      sessionDir: SESSION_DIR,
      repoRoot: REPO_ROOT,
      logLines,
      logChannels,
      viteLogFile: VITE_LOG_FILE,
      spawnAuditFile: SPAWN_AUDIT_FILE,
      consoleLogFile: CONSOLE_LOG_FILE,
    })
    lastLogRetentionInfo = { ...result, ranAt: Date.now() }
    const removed = result.memory.userRemoved + result.memory.channelsRemoved
    if (!quiet && (removed > 0 || result.archived.moved > 0)) {
      pushActionLog('Rétention logs (24 h)', {
        extra: `mémoire −${removed} · archives ${result.archived.moved} fichier(s)`,
        launcher: false,
      })
    }
    return result
  } catch (error) {
    pushVerboseLog(`Rétention logs échouée : ${error?.message ?? error}`, 'launcher')
    return null
  }
}

/** Journal brut par canal technique (onglets Lanceur / Vite / Build / Dashboard). */
function pushChannelLog(line, channel = 'launcher') {
  const normalized = normalizeLogChannel(channel)
  const entry = makeLogEntry(line, normalized)
  if (!entry) return
  logChannels[normalized] = trimLogBuffer([...(logChannels[normalized] ?? []), entry], MAX_LOG_CHANNEL_LINES)
}

/** @deprecated alias interne — préférer pushChannelLog */
function pushVerboseLog(line, source = 'launcher') {
  pushChannelLog(line, source)
}

/** Journal filtré — onglet Utilisateur. */
function pushUserLog(line, source = 'vite') {
  const preserved = preserveAnsiLogLine(line)
  if (!preserved || isNoiseLogMessage(preserved)) return
  const entry = makeLogEntry(preserved, source)
  if (!entry) return
  logLines = trimLogBuffer([...logLines, entry], MAX_LOG_LINES)
}

function pushLog(line, channel = 'launcher') {
  pushChannelLog(line, channel)
  pushUserLog(line, channel)
}

/** Journal action utilisateur / lanceur avec version app et détails debug. */
function pushActionLog(summary, details = {}) {
  const parts = [summary]
  if (details.appVersion !== false) {
    parts.push(`· app ${getAppVersionLabel()}`)
  }
  if (details.launcher !== false) {
    parts.push(`· lanceur v${LAUNCHER_VERSION}`)
  }
  if (details.extra) parts.push(`· ${details.extra}`)
  pushLog(parts.join(' '), 'launcher')
}

const VITE_OP_STEPS_START = [
  { id: 'spawn', label: 'Lancement npm / Vite', weight: 20 },
  { id: 'bundle', label: 'Compilation et dépendances', weight: 55 },
  { id: 'ready', label: 'Serveur prêt', weight: 25 },
]

const VITE_OP_STEPS_RESTART = [
  { id: 'stop', label: 'Arrêt du processus Vite', weight: 12 },
  { id: 'pause', label: 'Libération du port', weight: 8 },
  ...VITE_OP_STEPS_START,
]

const VITE_OP_STEPS_STOP = [
  { id: 'stop', label: 'Arrêt du processus', weight: 70 },
  { id: 'done', label: 'Port libéré', weight: 30 },
]

/** @type {Map<string, ReturnType<typeof setInterval>>} */
const operationWatchers = new Map()

/** @type {string | null} */
let buildOperationId = null

function pushOperationProgress(op, detail = '') {
  if (!op) return
  const blocker = op.blocker ? ` · blocage : ${op.blocker}` : ''
  const suffix = detail ? ` · ${detail}` : ''
  pushLog(
    `[progress] ${op.label} — ${op.currentStep} (${op.progress}%)${blocker}${suffix}`,
    'launcher',
  )
}

function stopOperationWatch(opId) {
  const timer = operationWatchers.get(opId)
  if (timer) clearInterval(timer)
  operationWatchers.delete(opId)
}

function startOperationWatch(opId, serverId) {
  if (operationWatchers.has(opId)) return
  let probeOkStreak = 0
  const timer = setInterval(async () => {
    const op = getOperation(opId)
    const slot = getViteSlot(serverId)
    if (!op || op.status !== 'running') {
      clearInterval(timer)
      operationWatchers.delete(opId)
      return
    }
    if (slot.status === 'starting') {
      const alive = await probeGameServer(slot.url)
      if (alive) {
        probeOkStreak += 1
        if (probeOkStreak >= 2) {
          slot.status = 'running'
          finishViteOperation(serverId, `${slot.url} (HTTP OK)`)
          clearInterval(timer)
          operationWatchers.delete(opId)
          pushLog(`Vite ${slot.def.label} détecté via HTTP — opération clôturée.`, 'launcher')
          return
        }
      } else {
        probeOkStreak = 0
      }
    }
    if (slot.status !== 'starting') return
    const elapsed = Date.now() - op.startedAt
    const silentMs = Date.now() - lastViteOutputAt
    let blocker = null
    const partialInStep = Math.min(0.92, elapsed / 90_000)
    if (silentMs > 12_000) {
      blocker = `aucune sortie Vite depuis ${Math.round(silentMs / 1000)}s — voir onglet Vite ${serverId === 'minigames' ? 'lab' : 'jeu'}`
    } else if (elapsed > 20_000) {
      blocker = `compilation longue (${Math.round(elapsed / 1000)}s) — normal au 1er démarrage`
    }
    if (elapsed > 240_000) {
      failViteOperation(
        serverId,
        `Démarrage Vite > ${Math.round(elapsed / 1000)}s`,
        blocker ?? 'timeout démarrage — redémarrer le lab ou voir logs Vite',
      )
      if (slot.status === 'starting') slot.status = 'stopped'
      clearInterval(timer)
      operationWatchers.delete(opId)
      return
    }
    advanceOperation(opId, 'bundle', { blocker, partialInStep })
    pushOperationProgress(getOperation(opId))
  }, 4000)
  operationWatchers.set(opId, timer)
}

function beginViteOperation(kind, serverId) {
  const slot = getViteSlot(serverId)
  const steps =
    kind === 'restart' ? VITE_OP_STEPS_RESTART : kind === 'stop' ? VITE_OP_STEPS_STOP : VITE_OP_STEPS_START
  const label =
    kind === 'restart'
      ? `Redémarrage — ${slot.def.label}`
      : kind === 'stop'
        ? `Arrêt — ${slot.def.label}`
        : `Démarrage — ${slot.def.label}`
  const opId = beginOperation({ kind: `vite-${kind}`, label, serverId, steps })
  slot.activeOperationId = opId
  pushOperationProgress(getOperation(opId), `port ${slot.def.port}`)
  return opId
}

function finishViteOperation(serverId, detail = '') {
  const slot = getViteSlot(serverId)
  const opId = slot.activeOperationId
  if (!opId) return
  advanceOperation(opId, 'ready', { partialInStep: 1 })
  const op = completeOperation(opId, { detail: detail || 'Serveur prêt' })
  pushOperationProgress(op)
  stopOperationWatch(opId)
  slot.activeOperationId = null
}

function failViteOperation(serverId, message, blocker = null) {
  const slot = getViteSlot(serverId)
  const opId = slot.activeOperationId
  if (!opId) return
  const op = failOperation(opId, message, blocker)
  pushOperationProgress(op)
  stopOperationWatch(opId)
  slot.activeOperationId = null
}

const VITE_NOISE_LINE =
  /^(vite|launcher|npm|node|local:|network:|\>|$|ready in \d|➜\s*$|undefined|null)$/i

function plainLogText(text) {
  return preserveAnsiLogLine(text).replace(/\u001B\[[0-9;]*m/g, '').trim()
}

function isNoiseLogMessage(text) {
  const plain = plainLogText(text)
  if (!plain) return true
  if (VITE_NOISE_LINE.test(plain)) return true
  if (/^> \S/.test(plain)) return true
  if (/^(vite|launcher|npm|node|build)$/i.test(plain)) return true
  return false
}

function isViteNoiseLine(line) {
  return isNoiseLogMessage(line)
}

function sanitizeStoredLogEntry(entry) {
  const text = String(entry)
  const match = text.match(/^(\[[^\]]+\]) (\[(?:launcher|vite:game|vite:minigames|build|dashboard|vite)\]) (.*)$/s)
  if (!match) return isNoiseLogMessage(text) ? null : text
  if (isNoiseLogMessage(match[3])) return null
  return text
}

function sanitizeStoredLogs(logs) {
  if (!Array.isArray(logs)) return []
  return logs.map(sanitizeStoredLogEntry).filter(Boolean).slice(-MAX_LOG_LINES)
}

function formatViteLogLine(line) {
  const plain = plainLogText(line)
  if (/ready in/i.test(plain)) return `Serveur dev prêt — ${plain}`
  if (/Local:/i.test(plain)) return `URL locale détectée — ${plain}`
  if (/Network:/i.test(plain)) return `URL réseau (téléphone) — ${plain}`
  if (/error/i.test(plain) || /failed/i.test(plain)) return `Erreur Vite — ${plain}`
  if (/hmr|updated|reload/i.test(plain)) return `HMR — ${plain}`
  if (/\[Havre des Brumes\]/i.test(plain)) return plain
  if (isNoiseLogMessage(plain)) return ''
  return plain
}

function getLanAddresses() {
  const nets = networkInterfaces()
  const ips = []
  for (const entries of Object.values(nets)) {
    if (!entries) continue
    for (const entry of entries) {
      if (entry.family !== 'IPv4' || entry.internal) continue
      ips.push(entry.address)
    }
  }
  return [...new Set(ips)]
}



function appendViteOutputLine(line, serverId = 'game') {
  const preserved = preserveAnsiLogLine(line)
  if (!preserved || !plainLogText(preserved)) return
  lastViteOutputAt = Date.now()
  const channel = viteLogChannel(serverId)
  pushChannelLog(preserved, channel)
  ensureSessionDir()
  appendFileSync(
    VITE_LOG_FILE,
    `[${new Date().toISOString()}] [${channel}] ${preserved}\n`,
    'utf8',
  )
  const formatted = formatViteLogLine(preserved)
  if (!formatted) return
  pushUserLog(formatted, channel)
}



function resetViteLogFile() {

  ensureSessionDir()

  writeFileSync(VITE_LOG_FILE, '', 'utf8')

  viteLogOffset = 0

}



function tailViteLogFile() {
  /* Ne réinjecte plus vite.log dans l’UI — source de doublons et lignes « vite » parasites. */
}



function initViteLogTail() {

  if (viteLogWatchStarted) return

  viteLogWatchStarted = true

  if (!existsSync(VITE_LOG_FILE)) {

    viteLogOffset = 0

    return

  }

  viteLogOffset = readFileSync(VITE_LOG_FILE, 'utf8').length

  watchFile(VITE_LOG_FILE, { interval: 500 }, () => {

    tailViteLogFile()

  })

}



function isProcessAlive(pid) {

  if (!pid || pid <= 0) return false

  try {

    process.kill(pid, 0)

    return true

  } catch {

    return false

  }

}



async function probeGameServer(url, timeoutMs = 4_000) {

  try {

    const controller = new AbortController()

    const timer = setTimeout(() => controller.abort(), timeoutMs)

    const res = await fetch(url, { cache: 'no-store', signal: controller.signal })

    clearTimeout(timer)

    return res.ok

  } catch {

    return false

  }

}



function saveSessionState({ pendingReattach = false, restartGeneration } = {}) {

  ensureSessionDir()

  const prev = loadSessionState()

  const game = gameSlot()

  const payload = {

    version: SESSION_VERSION,

    launcherVersion: LAUNCHER_VERSION,

    pendingReattach,

    restartGeneration: restartGeneration ?? prev?.restartGeneration ?? launcherRestartGeneration ?? 0,

    viteServers: serializeViteSlots(viteSlots),

    vitePid: game.process?.pid ?? game.attachedPid,

    gameUrl: game.url,

    networkGameUrl: game.networkUrl,

    devHostExposure,

    devStatus: game.status,

    startedAt: game.startedAt,

    openedGameOnce: game.openedOnce,

    openedDashboardOnce,

    gameDevSuppressed,

    logs: pruneLogLinesByAge(logLines),

    logChannels: Object.fromEntries(
      LOG_CHANNEL_IDS.map((id) => [id, pruneLogLinesByAge(logChannels[id] ?? [])]),
    ),

    lastBuildInfoSnapshot,

    lastBuildInfoKey,

    savedAt: Date.now(),

  }

  writeFileSync(SESSION_STATE_FILE, JSON.stringify(payload, null, 2), 'utf8')

  launcherRestartGeneration = payload.restartGeneration

}



function persistSessionSnapshot() {

  if (!launcherLockHeld) return false

  try {

    saveSessionState()

    return true

  } catch {

    return false

  }

}



function startSessionAutosave() {

  if (sessionAutosaveTimer) return

  sessionAutosaveTimer = setInterval(() => persistSessionSnapshot(), SESSION_AUTOSAVE_MS)

  if (typeof sessionAutosaveTimer.unref === 'function') sessionAutosaveTimer.unref()

}



function bumpRestartGeneration() {

  const prev = loadSessionState()

  const next = (prev?.restartGeneration ?? launcherRestartGeneration ?? 0) + 1

  saveSessionState({ pendingReattach: true, restartGeneration: next })

  return next

}



function loadSessionState() {

  if (!existsSync(SESSION_STATE_FILE)) return null

  try {

    return JSON.parse(readFileSync(SESSION_STATE_FILE, 'utf8'))

  } catch {

    return null

  }

}



function clearPendingReattachFlag() {

  const state = loadSessionState()

  if (!state) return

  saveSessionState({ pendingReattach: false })

}



function startAttachedVitePoll(serverId) {

  const slot = getViteSlot(serverId)

  if (slot.pollTimer) {

    clearInterval(slot.pollTimer)

  }

  slot.pollTimer = setInterval(async () => {

    if (!slot.attachedPid) return

    if (isProcessAlive(slot.attachedPid)) return

    slot.attachedPid = null

    const alive = await probeGameServer(slot.url)

    if (alive) {

      pushLog(`Processus Vite ${slot.def.label} introuvable, mais le serveur répond encore.`, 'launcher')

      slot.status = 'running'

      return

    }

    pushLog(`Session Vite ${slot.def.label} interrompue (processus terminé).`, 'launcher')

    slot.status = 'stopped'

  }, 3000)

}



function restoreLogsFromSession(state) {

  if (!state) return 0

  const rawLogs = Array.isArray(state.logs) ? state.logs : []

  const beforeCount = rawLogs.length

  logLines = pruneLogLinesByAge(sanitizeStoredLogs(rawLogs))

  const migrated = migrateStateLogChannels(state)

  for (const id of LOG_CHANNEL_IDS) {
    logChannels[id] = pruneLogLinesByAge(
      trimLogBuffer(
        (migrated[id] ?? []).map((entry) => String(entry)).filter((entry) => plainLogText(entry)),
        MAX_LOG_CHANNEL_LINES,
      ),
    )
  }

  return beforeCount

}



function importRestartGenLog(generation) {

  if (!generation) return

  const logPath = join(SESSION_DIR, `restart-gen-${generation}.log`)

  if (!existsSync(logPath)) return

  try {

    const lines = readFileSync(logPath, 'utf8').split(/\r?\n/).filter((line) => line.trim())

    if (!lines.length) return

    pushLog(`——— Journal processus remplaçant (gen ${generation}) ———`, 'launcher')

    for (const line of lines.slice(-120)) {

      pushVerboseLog(line.trim(), 'launcher')

    }

    pushLog(`——— Fin journal restart-gen-${generation}.log (${lines.length} lignes) ———`, 'launcher')

  } catch (error) {

    pushVerboseLog(`Lecture ${logPath} impossible : ${error?.message ?? error}`, 'launcher')

  }

}



async function tryReattachSession({ rawLogCountBeforeSanitize = 0 } = {}) {

  const state = loadSessionState()

  if (!state?.pendingReattach) {

    return false

  }



  restoreViteSlotsFromSession(viteSlots, state)

  devHostExposure = Boolean(state.devHostExposure)

  let anyAlive = false

  for (const slot of Object.values(viteSlots)) {

    const pid = slot.attachedPid

    const pidAlive = pid ? isProcessAlive(pid) : false

    const serverAlive = await probeGameServer(slot.url)

    if (!pidAlive && !serverAlive) {

      if (slot.status === 'starting') slot.status = 'stopped'

      continue

    }

    anyAlive = true

    slot.attachedPid = pidAlive ? pid : null

    slot.status = 'running'

    if (!slot.startedAt) slot.startedAt = state.startedAt ?? Date.now()

    startAttachedVitePoll(slot.id)

    if (!pidAlive && serverAlive) {

      pushLog(`Vite ${slot.def.label} répond sur ${slot.url} (PID d’origine perdu).`, 'launcher')

    } else if (pid) {

      pushLog(`Vite ${slot.def.label} toujours actif (PID ${pid}).`, 'launcher')

    }

  }

  if (!anyAlive) {

    pushLog('Reprise Vite impossible — Vite arrêté · journal session conservé.', 'launcher')

    clearPendingReattachFlag()

    return false

  }

  if (state.launcherVersion !== LAUNCHER_VERSION || rawLogCountBeforeSanitize !== logLines.length) {

    pushActionLog(`Journal nettoyé — lanceur v${LAUNCHER_VERSION}`, {

      extra: `${rawLogCountBeforeSanitize} archivées → ${logLines.length} utiles`,

    })

  }

  lastBuildInfoSnapshot = state.lastBuildInfoSnapshot ?? null

  lastBuildInfoKey = state.lastBuildInfoKey ?? null

  launcherReattached = true



  initViteLogTail()

  clearPendingReattachFlag()

  pushActionLog('Lanceur rechargé — sessions Vite et logs restaurés', {

    extra: `empreinte ${computeLauncherFingerprint()}`,

  })

  return true

}



function readJson(path) {

  if (!existsSync(path)) return null

  try {

    return JSON.parse(readFileSync(path, 'utf8'))

  } catch {

    return null

  }

}



function readLocalBuildInfo() {

  const pkg = readJson(join(REPO_ROOT, 'package.json')) ?? {}

  const buildInfo = readJson(join(REPO_ROOT, 'public', 'build-info.json'))

  const revision = readJson(join(REPO_ROOT, 'build-revision.json'))

  return {

    packageVersion: pkg.version ?? '?',

    buildInfo,

    revision,

    branch: buildInfo?.branch ?? '—',

    commit: buildInfo?.commitHash ?? '—',

    dirty: Boolean(buildInfo?.dirty),

  }

}



async function probeExistingDashboard() {

  try {

    const controller = new AbortController()

    const timer = setTimeout(() => controller.abort(), 1_500)

    const res = await fetch(`http://127.0.0.1:${DASHBOARD_PORT}/api/status`, {

      cache: 'no-store',

      signal: controller.signal,

    })

    clearTimeout(timer)

    if (!res.ok) return null

    const data = await res.json()

    if (!data || typeof data.devStatus !== 'string') return null

    if (data.devStatus === 'stopping' || data.devStatus === 'stopped' || data.devStatus === 'crashed') {

      return null

    }

    return data

  } catch {

    return null

  }

}



function findAllListeningPidsOnPort(port) {
  if (process.platform !== 'win32') return []
  auditSpawn('netstat', `port=${port}`)
  return findAllPortListenerPids(port)
}



function findListeningPidOnPort(port) {

  return findAllListeningPidsOnPort(port)[0] ?? null

}



function parseGameUrlPort(url) {

  try {

    const parsed = new URL(url)

    if (parsed.port) return Number.parseInt(parsed.port, 10)

    return parsed.protocol === 'https:' ? 443 : 80

  } catch {

    return 5173

  }

}



function clearStaleLauncherLock() {

  if (!existsSync(LAUNCHER_LOCK_FILE)) return false

  try {

    const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

    if (owner && isProcessAlive(owner) && owner !== process.pid) return false

    unlinkSync(LAUNCHER_LOCK_FILE)

    return true

  } catch {

    try {

      unlinkSync(LAUNCHER_LOCK_FILE)

      return true

    } catch {

      return false

    }

  }

}



async function cleanupGhostProcesses() {

  const killed = []

  const ourPid = process.pid

  for (const pid of findAllListeningPidsOnPort(DASHBOARD_PORT)) {

    if (pid === ourPid) continue

    killProcessPid(pid)

    killed.push({ pid, port: DASHBOARD_PORT, role: 'launcher' })

    pushLog(`Fantôme arrêté : PID ${pid} (lanceur, port ${DASHBOARD_PORT})`, 'launcher')

  }

  const lockCleared = clearStaleLauncherLock()

  if (lockCleared) {

    pushLog('Verrou launcher obsolète supprimé.', 'launcher')

  }

  const keepVitePids = new Set(

    Object.values(viteSlots)

      .map((slot) => slot.process?.pid ?? slot.attachedPid ?? null)

      .filter(Boolean),

  )

  for (const port of VITE_DEV_PORTS) {
    const slot = Object.values(viteSlots).find((entry) => entry.def.port === port)
    const slotAlive = slot && slot.status === 'running' && (await probeGameServer(slot.url))

    if (slotAlive) {
      pushLog(`Vite actif sur le port ${port} — conservé.`, 'launcher')
      continue
    }

    for (const pid of findAllListeningPidsOnPort(port)) {
      if (pid === ourPid) continue
      if (keepVitePids.has(pid)) continue
      killProcessPid(pid)
      killed.push({ pid, port, role: port === 5174 ? 'vite-lab' : 'vite' })
      pushLog(`Fantôme arrêté : PID ${pid} (Vite, port ${port})`, 'launcher')
    }
  }

  for (const slot of Object.values(viteSlots)) {
    if (slot.process && !isProcessAlive(slot.process.pid)) {
      slot.process = null
      slot.attachedPid = null
      if (slot.status !== 'stopping') slot.status = 'stopped'
    }
  }

  const gameAlive = gameSlot().status === 'running'

  return { killed, lockCleared, viteKept: gameAlive }
}



function killAllProcessesOnPort(port) {
  const killed = []
  for (const pid of findAllListeningPidsOnPort(port)) {
    if (pid === process.pid) continue
    killProcessPid(pid)
    killed.push(pid)
  }
  return killed
}



function killProcessOnPort(port) {

  const pid = findListeningPidOnPort(port)

  if (!pid || pid === process.pid) return false

  try {

    process.kill(pid, 0)

  } catch {

    return false

  }

  pushLog(`Port ${port} occupé par PID ${pid} — libération…`, 'launcher')

  killProcessPid(pid)

  return true

}



function clearLauncherLockIfStale() {

  if (!existsSync(LAUNCHER_LOCK_FILE)) return

  try {

    const owner = Number.parseInt(readFileSync(LAUNCHER_LOCK_FILE, 'utf8').trim(), 10)

    if (!owner || !isProcessAlive(owner)) unlinkSync(LAUNCHER_LOCK_FILE)

  } catch {

    try {

      unlinkSync(LAUNCHER_LOCK_FILE)

    } catch {

      /* ignore */

    }

  }

}



async function replaceStaleDashboardProcess(existing) {

  if (!existing?.launcherVersion || existing.launcherVersion === LAUNCHER_VERSION) {

    return false

  }

  console.log(

    `[Havre Dev Launcher] Remplacement lanceur v${existing.launcherVersion} → v${LAUNCHER_VERSION}…`,

  )

  const blockerPid = findListeningPidOnPort(DASHBOARD_PORT)

  if (blockerPid && blockerPid !== process.pid) {

    pushLog(`Arrêt lanceur obsolète v${existing.launcherVersion} (PID ${blockerPid})`, 'launcher')

    const killResult = killProcessPid(blockerPid)

    if (!killResult.ok) {

      console.warn(

        `[Havre Dev Launcher] taskkill PID ${blockerPid} échoué : ${killResult.error ?? killResult.status ?? '?'}`,

      )

    }

    for (let attempt = 0; attempt < 4; attempt += 1) {

      await new Promise((resolve) => setTimeout(resolve, 400))

      if (!findListeningPidOnPort(DASHBOARD_PORT)) break

      if (attempt === 3) {

        const lingering = findListeningPidOnPort(DASHBOARD_PORT)

        if (lingering) killProcessPid(lingering)

      }

    }

  }

  clearLauncherLockIfStale()

  return true

}



async function acquireLauncherLockWithRetry({ isReattach = false, maxWaitMs = 25_000 } = {}) {

  const deadline = Date.now() + (isReattach ? maxWaitMs : 2500)

  let attempt = 0

  while (Date.now() < deadline) {

    attempt += 1

    if (tryAcquireLauncherLock()) return true

    clearLauncherLockIfStale()

    const stale = await probeExistingDashboard()

    if (stale?.launcherVersion && stale.launcherVersion !== LAUNCHER_VERSION) {

      await replaceStaleDashboardProcess(stale)

      if (tryAcquireLauncherLock()) return true

    }

    if (!isReattach && stale?.launcherVersion === LAUNCHER_VERSION) {

      return false

    }

    await new Promise((resolve) => setTimeout(resolve, 350))

  }

  clearLauncherLockIfStale()

  return tryAcquireLauncherLock()

}



async function handOffToExistingDashboard() {

  const existing = await probeExistingDashboard()

  if (!existing) return false

  if (!existing.launcherVersion || existing.launcherVersion !== LAUNCHER_VERSION) {

    await replaceStaleDashboardProcess(existing)

    return false

  }

  const dashboardUrl = `http://127.0.0.1:${DASHBOARD_PORT}/`

  console.log('[Havre Dev Launcher] Lanceur déjà actif — ouverture du tableau de bord existant.')

  console.log(`[Havre Dev Launcher] Tableau de bord : ${dashboardUrl}`)

  openInBrowser(dashboardUrl)

  setTimeout(() => process.exit(0), 400)

  return true

}



function openInBrowser(url) {

  const safeUrl = url.replace(/"/g, '')

  if (process.platform === 'win32') {

    execFile('rundll32', ['url.dll,FileProtocolHandler', safeUrl], {

      windowsHide: true,

    })

    return

  }

  const command =

    process.platform === 'darwin'

      ? `open "${safeUrl}"`

      : `xdg-open "${safeUrl}"`

  exec(command, { windowsHide: true })

}



function scriptSpawnArgs(script, { exposeLan = devHostExposure } = {}) {

  if (script === 'dev' || script === 'dev:minigames') {

    const viteBin = join(REPO_ROOT, 'node_modules', 'vite', 'bin', 'vite.js')

    if (existsSync(viteBin)) {

      const args = [viteBin]

      if (script === 'dev:minigames') {
        args.push('--config', 'vite.minigames.config.ts')
      }

      if (exposeLan) args.push('--host')

      return { command: process.execPath, args }

    }

  }

  if (script === 'version:prompt') {

    const scriptPath = join(REPO_ROOT, 'scripts', 'bump-prompt.mjs')

    if (existsSync(scriptPath)) {

      return { command: process.execPath, args: [scriptPath] }

    }

  }

  const npmCli = join(REPO_ROOT, 'node_modules', 'npm', 'bin', 'npm-cli.js')

  if (existsSync(npmCli)) {

    return { command: process.execPath, args: [npmCli, 'run', script] }

  }

  if (process.platform === 'win32') {

    return {

      command: process.env.ComSpec || 'cmd.exe',

      args: ['/d', '/s', '/c', 'npm', 'run', script],

    }

  }

  return { command: 'npm', args: ['run', script] }

}



function touchDashboardActivity(fromDashboard) {

  if (!fromDashboard) return

  lastDashboardPingAt = Date.now()

  dashboardEverConnected = true

  pendingShutdownAt = 0

}



function startDashboardIdleWatch() {

  /* Désactivé — l’arrêt se fait via le bouton Quitter tout ou en relançant le .bat. */

}



function hideAttachedConsoleWindow() {

  if (process.platform !== 'win32' || consoleHidden || shuttingDown) return

  const psCommand = [

    "Add-Type @'",

    'using System;',

    'using System.Runtime.InteropServices;',

    'public class HavreConsole {',

    '  [DllImport("kernel32.dll", SetLastError=true)] public static extern bool AttachConsole(uint dwProcessId);',

    '  [DllImport("kernel32.dll", SetLastError=true)] public static extern bool FreeConsole();',

    '  [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();',

    '  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);',

    '}',

    "'@;",

    `if ([HavreConsole]::AttachConsole(${process.pid})) {`,

    '  $hwnd = [HavreConsole]::GetConsoleWindow();',

    '  if ($hwnd -ne [IntPtr]::Zero) { [void][HavreConsole]::ShowWindow($hwnd, 0) }',

    '  [void][HavreConsole]::FreeConsole()',

    '}',

  ].join('\n')



  execFile(

    'powershell.exe',

    ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', psCommand],

    { windowsHide: true },

    (error) => {

      if (error) {

        console.error('[Havre Dev Launcher] Impossible de masquer la console :', error.message)

        return

      }

      consoleHidden = true

      backgroundMode = true

      pushLog(

        'Console masquée — fermez l’onglet du tableau de bord pour tout arrêter.',

        'launcher',

      )

      startDashboardIdleWatch()

    },

  )

}



function scheduleConsoleHide() {

  if (process.env.HAVRE_HIDE_CONSOLE !== '1') return

  if (consoleHidden || consoleHideTimer || shuttingDown || backgroundMode) return

  consoleHideTimer = setTimeout(() => {

    consoleHideTimer = null

    if (shuttingDown || gameSlot().status === 'crashed') return

    hideAttachedConsoleWindow()

    if (process.platform !== 'win32') {

      consoleHidden = true

      backgroundMode = true

      pushLog(

        'Lanceur en arrière-plan — fermez l’onglet du tableau de bord pour tout arrêter.',

        'launcher',

      )

      startDashboardIdleWatch()

    }

  }, CONSOLE_HIDE_DELAY_MS)

}



function bindConsoleCloseShutdown() {

  if (process.platform !== 'win32') return

  process.stdin.resume()

  process.stdin.on('close', () => {

    if (!shuttingDown) shutdown()

  })

}



function markDevServerReady(sourceText, serverId) {

  const slot = getViteSlot(serverId)

  if (slot.status !== 'starting') return

  if (!/ready in/i.test(sourceText) && !/➜\s+Local:/i.test(sourceText)) return

  slot.status = 'running'

  finishViteOperation(serverId, slot.url)

  if (slot.openOnReady && slot.url) {
    slot.openOnReady = false
    pushActionLog(`Ouverture navigateur — ${slot.def.label}`, { extra: slot.url })
    openInBrowser(slot.url)
  }

  pushActionLog(`Serveur Vite opérationnel — ${slot.def.label}`, {

    extra: `${slot.url} · PID ${slot.process?.pid ?? slot.attachedPid ?? '?'}`,

  })

}



function parseDevUrlForSlot(chunk, serverId) {

  const slot = getViteSlot(serverId)

  const text = String(chunk)

  const localMatch =

    text.match(/Local:\s+(https?:\/\/[^\s]+)/i) ??

    text.match(/(https?:\/\/localhost:\d+\/?)/i) ??

    text.match(/(http:\/\/127\.0\.0\.1:\d+\/?)/i)

  if (localMatch?.[1]) {

    const nextUrl = localMatch[1].endsWith('/') ? localMatch[1] : `${localMatch[1]}/`

    if (parseGameUrlPort(nextUrl) === slot.def.port) slot.url = nextUrl

  }

  const networkMatch = text.match(/Network:\s+(https?:\/\/[^\s]+)/i)

  if (networkMatch?.[1]) {

    const nextUrl = networkMatch[1].endsWith('/') ? networkMatch[1] : `${networkMatch[1]}/`

    if (parseGameUrlPort(nextUrl) === slot.def.port) slot.networkUrl = nextUrl

  }

}



function stopProcessTree(child) {

  if (!child?.pid) return

  killProcessPid(child.pid)

}



function startViteServer(serverId = 'game', { operationId } = {}) {

  const slot = getViteSlot(serverId)

  if (slot.status === 'running' && slot.process?.pid && isProcessAlive(slot.process.pid)) {

    pushActionLog(`Démarrage Vite ignoré — ${slot.def.label} déjà actif`, {

      extra: `PID ${slot.process.pid} · ${slot.url}`,

    })

    if (slot.activeOperationId || operationId) {
      if (operationId && !slot.activeOperationId) slot.activeOperationId = operationId
      finishViteOperation(serverId, slot.url)
    }

    return slot.activeOperationId ?? operationId ?? null

  }

  if (slot.process) {

    stopProcessTree(slot.process)

    slot.process = null

  }

  slot.attachedPid = null

  if (slot.pollTimer) {

    clearInterval(slot.pollTimer)

    slot.pollTimer = null

  }

  slot.status = 'starting'

  slot.startedAt = Date.now()

  slot.openedOnce = false

  slot.networkUrl = null

  if (serverId === 'game') resetViteLogFile()

  slot.url = slot.def.defaultUrl

  const opId = operationId ?? beginViteOperation('start', serverId)

  slot.activeOperationId = opId

  if (serverId === 'game') {
    gameDevSuppressed = false
    saveSessionState()
  }

  advanceOperation(opId, 'spawn')

  pushOperationProgress(getOperation(opId))

  const hostLabel = devHostExposure ? 'LAN (--host, téléphone)' : 'localhost uniquement'

  pushActionLog(`Démarrage Vite — ${slot.def.label} · ${hostLabel}`, {

    extra: `port ${slot.def.port} · empreinte lanceur ${computeLauncherFingerprint()}`,

  })

  const devSpawn = scriptSpawnArgs(slot.def.npmScript, { exposeLan: devHostExposure })

  slot.process = spawnHidden(devSpawn.command, devSpawn.args, {

    cwd: REPO_ROOT,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },

  })

  advanceOperation(opId, 'bundle', { partialInStep: 0.05 })

  pushOperationProgress(getOperation(opId), `PID ${slot.process.pid ?? '?'}`)

  startOperationWatch(opId, serverId)

  slot.process.on('error', (error) => {

    if (consoleHideTimer) {

      clearTimeout(consoleHideTimer)

      consoleHideTimer = null

    }

    pushLog(`Impossible de lancer Vite (${slot.def.label}) : ${error.message}`, 'launcher')

    slot.status = 'crashed'

    slot.process = null

    failViteOperation(serverId, error.message, 'spawn npm / Vite')

  })

  const handleDevOutput = (chunk) => {

    const text = String(chunk)

    parseDevUrlForSlot(text, serverId)

    for (const line of text.split(/\r?\n/)) {

      appendViteOutputLine(line, serverId)

    }

    if (/transforming|optimizing|preparing|building/i.test(text)) {
      advanceOperation(opId, 'bundle', { partialInStep: 0.45 })
    }

    markDevServerReady(text, serverId)

  }

  slot.process.stdout?.on('data', handleDevOutput)

  slot.process.stderr?.on('data', handleDevOutput)

  slot.process.on('exit', (code, signal) => {

    pushLog(

      `Processus Vite ${slot.def.label} terminé (code ${code ?? 'null'}, signal ${signal ?? 'null'})`,

      'launcher',

    )

    slot.process = null

    slot.attachedPid = null

    if (slot.status !== 'stopping') {

      slot.status = code === 0 ? 'stopped' : 'crashed'

      if (code !== 0 && slot.activeOperationId) {
        failViteOperation(
          serverId,
          `Processus terminé (code ${code ?? 'null'})`,
          'voir onglet Vite jeu',
        )
      }

    } else {

      slot.status = 'stopped'

    }

  })

  return opId

}



function stopViteServer(serverId = 'game', { operationId = null, skipOpComplete = false } = {}) {

  const slot = getViteSlot(serverId)

  slot.status = 'stopping'

  let opId = operationId ?? slot.activeOperationId

  if (!opId && !skipOpComplete) {
    opId = beginViteOperation('stop', serverId)
  } else if (opId) {
    advanceOperation(opId, 'stop')
    pushOperationProgress(getOperation(opId))
  }

  pushActionLog(`Arrêt Vite — ${slot.def.label}`, {

    extra: `PID ${slot.process?.pid ?? slot.attachedPid ?? '—'}`,

  })

  stopProcessTree(slot.process)

  slot.process = null

  slot.attachedPid = null

  const portKilled = killAllProcessesOnPort(slot.def.port)
  if (portKilled.length > 0) {
    pushLog(
      `Port ${slot.def.port} — ${portKilled.length} processus arrêté(s) : ${portKilled.join(', ')}`,
      'launcher',
    )
  }

  if (slot.pollTimer) {

    clearInterval(slot.pollTimer)

    slot.pollTimer = null

  }

  slot.status = 'stopped'

  if (serverId === 'game' && !skipOpComplete) {
    gameDevSuppressed = true
    saveSessionState()
    pushActionLog('Jeu :5173 fermé — RAM libérée (lab et lanceur inchangés)', {
      extra: 'relance via Démarrer sur le tableau de bord',
    })
  }

  if (!skipOpComplete && opId) {
    advanceOperation(opId, 'done', {
      partialInStep: 1,
      detail:
        portKilled.length > 0
          ? `${portKilled.length} PID sur :${slot.def.port}`
          : `port ${slot.def.port} libre`,
    })
    const op = completeOperation(opId)
    pushOperationProgress(op)
    stopOperationWatch(opId)
    slot.activeOperationId = null
  }

  return opId

}



function restartViteServer(serverId = 'game') {

  const slot = getViteSlot(serverId)

  slot.openOnReady = true

  if (slot.status !== 'running' && slot.status !== 'starting') {
    pushActionLog(`Redémarrage (démarrage) — ${slot.def.label}`, {
      extra: 'serveur arrêté — lancement + ouverture navigateur',
    })
    return startViteServer(serverId)
  }

  const opId = beginViteOperation('restart', serverId)

  stopViteServer(serverId, { operationId: opId, skipOpComplete: true })

  advanceOperation(opId, 'pause', {
    blocker: `port ${getViteSlot(serverId).def.port}`,
    partialInStep: 0.35,
  })

  pushOperationProgress(getOperation(opId))

  setTimeout(() => startViteServer(serverId, { operationId: opId }), 800)

  return opId

}



function stopAllViteServers() {

  for (const id of Object.keys(viteSlots)) {

    if (viteSlots[id].process || viteSlots[id].status === 'running' || viteSlots[id].status === 'starting') {

      stopViteServer(id)

    }

  }

}



function startDevServer() {

  startViteServer('game')

}



function stopDevServer() {

  stopAllViteServers()

}



function restartDevServer() {

  restartViteServer('game')

}



function openReplacementLogFd(generation) {

  ensureSessionDir()

  const restartLog = join(SESSION_DIR, `restart-gen-${generation}.log`)

  try {

    return { fd: openSync(restartLog, 'a'), path: restartLog }

  } catch (error) {

    pushVerboseLog(

      `Journal remplaçant indisponible (${restartLog}) : ${error?.message ?? error} — stdio ignore`,

      'launcher',

    )

    return { fd: null, path: null }

  }

}



function restartLauncher() {

  openedDashboardOnce = true

  const generation = bumpRestartGeneration()

  pushActionLog('Mise à jour lanceur — lancement processus de remplacement', {

    extra: `v${LAUNCHER_VERSION} · gen ${generation} · PID actuel ${process.pid} · port ${DASHBOARD_PORT}`,

  })



  try {

    releaseLauncherLock()



    const scriptPath = join(__dirname, 'server.mjs')

    const args = [scriptPath, REATTACH_ARG]

    if (backgroundMode || consoleHidden) args.push(BACKGROUND_ARG)

    const { fd: logFd, path: logPath } = openReplacementLogFd(generation)

    const spawnOpts = {

      cwd: REPO_ROOT,

      detached: true,

      env: process.env,

    }

    if (logFd != null) {

      spawnOpts.stdio = ['ignore', logFd, logFd]

    } else {

      spawnOpts.stdio = 'ignore'

    }

    const child = spawnHidden(process.execPath, args, spawnOpts)

    child.unref()

    const replacementPid = child.pid ?? null

    pushActionLog('Processus de remplacement lancé', {

      extra: `gen ${generation} · enfant PID ${replacementPid ?? '?'} · --reattach${logPath ? ` · log ${logPath}` : ''}`,

    })



    if (!dashboardServer) {

      pushActionLog('Fin processus parent (sans serveur dashboard actif)', { extra: `gen ${generation}` })

      process.exit(0)

      return

    }



    dashboardServer.close(() => {

      saveSessionState({ pendingReattach: true, restartGeneration: generation })

      pushActionLog('Port dashboard libéré — arrêt processus parent', { extra: `gen ${generation}` })

      saveSessionState({ pendingReattach: true, restartGeneration: generation })

      releaseLauncherLock()

      process.exit(0)

    })

    setTimeout(() => {

      saveSessionState({ pendingReattach: true, restartGeneration: generation })

      pushActionLog('Arrêt forcé du processus parent (timeout fermeture port)', {

        extra: `gen ${generation} · PID ${process.pid} · remplaçant ${replacementPid ?? '?'}`,

      })

      releaseLauncherLock()

      process.exit(0)

    }, 4000)

  } catch (error) {

    const message = error?.message ?? String(error)

    pushActionLog('Échec lancement processus de remplacement — mise à jour annulée', {

      extra: message,

    })

    console.error('[Havre Dev Launcher] restartLauncher a échoué :', error)

  }

}



function runBuild() {

  if (buildProcess) {

    pushActionLog('Build production ignoré — build déjà en cours')

    return buildOperationId

  }

  buildOperationId = beginOperation({
    kind: 'build',
    label: 'Build production — npm run build',
    serverId: null,
    steps: [
      { id: 'tsc', label: 'TypeScript (tsc -b)', weight: 25 },
      { id: 'vite', label: 'Bundle Vite', weight: 60 },
      { id: 'done', label: 'Build terminé', weight: 15 },
    ],
  })

  pushOperationProgress(getOperation(buildOperationId))

  pushActionLog('Build production lancé — npm run build', {

    extra: `Node ${process.version} · ${process.platform}`,

  })

  const buildSpawn = scriptSpawnArgs('build')

  buildProcess = spawnHidden(buildSpawn.command, buildSpawn.args, {

    cwd: REPO_ROOT,

    stdio: ['ignore', 'pipe', 'pipe'],

    env: {
      ...process.env,
      FORCE_COLOR: '1',
    },

  })

  advanceOperation(buildOperationId, 'tsc', { partialInStep: 0.2 })

  const pipe = (chunk, level) => {
    for (const line of String(chunk).split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed) continue
      pushVerboseLog(trimmed, level)
      if (!isNoiseLogMessage(trimmed)) pushUserLog(trimmed, level)
      if (/vite v|building client|transforming/i.test(trimmed) && buildOperationId) {
        advanceOperation(buildOperationId, 'vite', { partialInStep: 0.5 })
      }
      if (/built in/i.test(trimmed) && buildOperationId) {
        advanceOperation(buildOperationId, 'done', { partialInStep: 0.8 })
      }
    }
  }

  buildProcess.stdout?.on('data', (c) => pipe(c, 'build'))

  buildProcess.stderr?.on('data', (c) => pipe(c, 'build'))

  buildProcess.on('exit', (code) => {

    const opId = buildOperationId

    if (opId) {
      if (code === 0) {
        advanceOperation(opId, 'done', { partialInStep: 1 })
        const op = completeOperation(opId, { detail: 'succès' })
        pushOperationProgress(op)
      } else {
        const op = failOperation(opId, `Build échoué (code ${code ?? 'null'})`, 'voir onglet Build')
        pushOperationProgress(op)
      }
      buildOperationId = null
    }

    pushActionLog(`Build production terminé — code ${code ?? 'null'}`, {

      extra: code === 0 ? 'succès' : 'échec — voir logs build',

    })

    buildProcess = null

  })

  return buildOperationId

}



async function getStatusPayload() {

  const local = readLocalBuildInfo()

  const game = gameSlot()

  const lanIps = getLanAddresses()

  const viteServers = Object.fromEntries(

    Object.entries(viteSlots).map(([id, slot]) => [

      id,

      buildViteSlotStatusPayload(slot, { devHostExposure, lanAddresses: lanIps }),

    ]),

  )

  const liveBuildInfo =

    game.status === 'running' ? readJson(join(REPO_ROOT, 'public', 'build-info.json')) : null

  const launcherBuild = getLauncherSourcesInfo()



  return {

    viteServers,

    devStatus: game.status,

    gameUrl: game.url,

    networkGameUrl: viteServers.game?.networkGameUrl ?? null,

    devHostExposure,

    openGameLabel: VITE_SERVER_DEFS.game.openLabel,

    lanAddresses: lanIps,

    dashboardUrl: `http://127.0.0.1:${DASHBOARD_PORT}/`,

    uptimeMs: viteServers.game?.uptimeMs ?? 0,

    pid: viteServers.game?.pid ?? null,

    buildRunning: Boolean(buildProcess),

    packageVersion: local.packageVersion,

    branch: local.branch,

    commit: local.commit,

    dirty: local.dirty,

    buildInfo: liveBuildInfo ?? local.buildInfo,

    revisionUpdatedAt: local.revision?.updatedAt ?? null,

    logCount: logLines.length,

    logChannelCounts: channelLineCounts(logChannels),

    logRetention: {
      maxAgeMs: LOG_RETENTION_MS,
      maxAgeHours: LOG_RETENTION_MS / 3_600_000,
      lastRunAt: lastLogRetentionInfo?.ranAt ?? null,
      lastSummary: lastLogRetentionInfo
        ? {
            memoryRemoved:
              lastLogRetentionInfo.memory.userRemoved + lastLogRetentionInfo.memory.channelsRemoved,
            archivedFiles: lastLogRetentionInfo.archived.moved,
          }
        : null,
    },

    launcherReattached,

    launcherBuild,

    launcherVersion: LAUNCHER_VERSION,

    launcherLabel: LAUNCHER_LABEL,

    launcherFingerprint: launcherBuild.fingerprintLive,

    launcherStartedAt,

    launcherUptimeMs: Date.now() - launcherStartedAt,

    launcherRestartGeneration,

    gameDevSuppressed,

    nodeVersion: process.version,

    platform: process.platform,

    dashboardPort: DASHBOARD_PORT,

    vitePort: game.def.port,

    sessionDir: SESSION_DIR,

    repoRoot: REPO_ROOT,

    operations: listOperations(),

  }

}



function getDiagnosticsContext() {
  const game = gameSlot()
  return {
    repoRoot: REPO_ROOT,
    dashboardPort: DASHBOARD_PORT,
    vitePort: game.def.port,
    gameUrl: game.url,
    dashboardUrl: `http://127.0.0.1:${DASHBOARD_PORT}/api/status`,
    devStatus: game.status,
    startedAt: game.startedAt,
    launcherPid: process.pid,
    launcherStartedAt,
    devProcessPid: game.process?.pid ?? null,
    attachedVitePid: game.attachedPid,
    viteServers: Object.fromEntries(
      Object.entries(viteSlots).map(([id, slot]) => [
        id,
        { port: slot.def.port, url: slot.url, status: slot.status, pid: slot.process?.pid ?? slot.attachedPid },
      ]),
    ),
    buildProcessPid: buildProcess?.pid ?? null,
    buildRunning: Boolean(buildProcess),
    lastViteOutputAt,
    logLines,
    logChannels,
    viteLogFile: VITE_LOG_FILE,
    spawnAuditFile: SPAWN_AUDIT_FILE,
    lockFilePath: LAUNCHER_LOCK_FILE,
    isProcessAlive,
  }
}



function sendJson(res, statusCode, payload) {

  res.writeHead(statusCode, {

    'Content-Type': 'application/json; charset=utf-8',

    'Cache-Control': 'no-store',

  })

  res.end(JSON.stringify(payload))

}



function readBody(req) {

  return new Promise((resolve) => {

    let body = ''

    req.on('data', (chunk) => {

      body += chunk

    })

    req.on('end', () => resolve(body))

  })

}



function readDashboardHtml() {

  let html = readFileSync(DASHBOARD_PATH, 'utf8')

  const fingerprint = computeLauncherFingerprint()

  const htmlServedAt = new Date().toISOString()

  return html

    .replaceAll('__LAUNCHER_VERSION__', LAUNCHER_VERSION)

    .replaceAll('__LAUNCHER_FINGERPRINT__', fingerprint)

    .replaceAll('__LAUNCHER_LABEL__', LAUNCHER_LABEL)

    .replaceAll('__LAUNCHER_HTML_SERVED_AT__', htmlServedAt)

}



async function readLauncherChangelogLive() {

  const path = join(__dirname, 'launcher-changelog.mjs')

  const mod = await import(`${pathToFileURL(path).href}?reload=${Date.now()}`)

  return mod.LAUNCHER_CHANGELOG ?? []

}



function parseViteServerIdFromBody(body) {

  try {

    const parsed = body ? JSON.parse(body) : {}

    return resolveViteServerId(parsed.server)

  } catch {

    return 'game'

  }

}



function createDashboardServer() {

  return createServer(async (req, res) => {

    try {

    const url = new URL(req.url ?? '/', `http://127.0.0.1:${DASHBOARD_PORT}`)

    const path = url.pathname



    if (path === '/' && (req.method === 'GET' || req.method === 'HEAD')) {

      res.writeHead(200, {

        'Content-Type': 'text/html; charset=utf-8',

        'Cache-Control': 'no-store, no-cache, must-revalidate',

        'Pragma': 'no-cache',

      })

      if (req.method === 'HEAD') {

        res.end()

      } else {

        res.end(readDashboardHtml())

      }

      return

    }



    if (path === '/launcher-icon.png' && (req.method === 'GET' || req.method === 'HEAD')) {

      if (!existsSync(LAUNCHER_ICON_PATH)) {

        res.writeHead(404)

        res.end()

        return

      }

      res.writeHead(200, {

        'Content-Type': 'image/png',

        'Cache-Control': 'public, max-age=3600',

      })

      if (req.method === 'HEAD') {

        res.end()

      } else {

        res.end(readFileSync(LAUNCHER_ICON_PATH))

      }

      return

    }



    if (path === '/api/health' && req.method === 'GET') {

      sendJson(res, 200, {

        ok: true,

        launcherVersion: LAUNCHER_VERSION,

        launcherFingerprint: computeLauncherFingerprint(),

        processStartedMs: launcherStartedAt,

        restartGeneration: launcherRestartGeneration,

      })

      return

    }



    if (path === '/api/client-log' && req.method === 'POST') {

      const body = await readBody(req)

      const lines = Array.isArray(body?.lines) ? body.lines : []

      let count = 0

      for (const line of lines.slice(-300)) {

        const text = String(line ?? '').trim()

        if (!text) continue

        pushChannelLog(text, 'dashboard')

        count += 1

      }

      sendJson(res, 200, { ok: true, count })

      return

    }



    if (path === '/api/app-version-changelog' && req.method === 'GET') {

      sendJson(res, 200, getAppVersionChangelogPage(REPO_ROOT, {

        segment: url.searchParams.get('segment') ?? 'X',

        offset: url.searchParams.get('offset') ?? '0',

        limit: url.searchParams.get('limit') ?? '10',

        goTo: url.searchParams.get('goTo') ?? '',

        includeUndocumented: url.searchParams.get('includeUndocumented') ?? '1',

      }))

      return

    }



    if (path === '/api/launcher-changelog' && req.method === 'GET') {

      sendJson(res, 200, {

        currentVersion: LAUNCHER_VERSION,

        entries: await readLauncherChangelogLive(),

        readAt: new Date().toISOString(),

      })

      return

    }



    if (path === '/api/status' && req.method === 'GET') {

      touchDashboardActivity(req.headers['x-havre-dashboard'] === '1')

      sendJson(res, 200, await getStatusPayload())

      return

    }



    if (path === '/api/logs' && req.method === 'GET') {

      const channel = url.searchParams.get('channel')

      const tailRaw = Number.parseInt(url.searchParams.get('tail') ?? '', 10)

      const tail = Number.isFinite(tailRaw) && tailRaw > 0 ? tailRaw : null

      const counts = channelLineCounts(logChannels)



      if (channel && LOG_CHANNEL_IDS.includes(channel)) {

        const buffer = logChannels[channel] ?? []

        const slice = tail

          ? buffer.slice(-Math.min(tail, MAX_LOG_CHANNEL_LINES))

          : buffer

        sendJson(res, 200, {

          channel,

          lines: slice,

          lineCount: buffer.length,

          channelCounts: counts,

        })

        return

      }



      const pollTail = tail ?? 300

      sendJson(res, 200, {

        lines: logLines.slice(-Math.min(pollTail, MAX_LOG_LINES)),

        lineCount: logLines.length,

        channelCounts: counts,

      })

      return

    }



    if (path === '/api/open-game' && req.method === 'POST') {

      const body = await readBody(req)

      const serverId = parseViteServerIdFromBody(body)

      const slot = getViteSlot(serverId)

      const openUrl = slot.url

      pushActionLog(`Ouverture navigateur — ${slot.def.label}`, { extra: openUrl })

      openInBrowser(openUrl)

      sendJson(res, 200, { ok: true, server: serverId, gameUrl: openUrl })

      return

    }



    if (path === '/api/open-phone' && req.method === 'POST') {

      const game = gameSlot()

      const lanUrl = game.networkUrl ?? null

      if (!lanUrl) {

        sendJson(res, 400, {

          ok: false,

          error: 'URL LAN indisponible — activez le LAN et démarrez le jeu :5173.',

        })

        return

      }

      pushActionLog('Ouverture navigateur — téléphone (LAN)', { extra: lanUrl })

      openInBrowser(lanUrl)

      sendJson(res, 200, { ok: true, gameUrl: lanUrl })

      return

    }



    if (path === '/api/start' && req.method === 'POST') {

      const body = await readBody(req)

      const serverId = parseViteServerIdFromBody(body)

      pushActionLog(`Action tableau de bord : démarrer Vite (${getViteSlot(serverId).def.label})`)

      const operationId = startViteServer(serverId)

      sendJson(res, 200, { ok: true, server: serverId, operationId })

      return

    }



    if (path === '/api/restart' && req.method === 'POST') {

      const body = await readBody(req)

      const serverId = parseViteServerIdFromBody(body)

      pushActionLog(`Action tableau de bord : redémarrer Vite (${getViteSlot(serverId).def.label})`)

      const operationId = restartViteServer(serverId)

      sendJson(res, 200, { ok: true, server: serverId, operationId })

      return

    }



    if (path === '/api/restart-launcher' && req.method === 'POST') {

      const prevGen = loadSessionState()?.restartGeneration ?? launcherRestartGeneration ?? 0

      const nextGen = prevGen + 1

      pushActionLog('Mise à jour lanceur — demande tableau de bord', {

        extra: `v${LAUNCHER_VERSION} · gen ${prevGen}→${nextGen} · PID ${process.pid} · empreinte ${computeLauncherFingerprint()}`,

      })

      sendJson(res, 200, {

        ok: true,

        message: 'Redémarrage du lanceur en cours…',

        launcherVersion: LAUNCHER_VERSION,

        launcherFingerprint: computeLauncherFingerprint(),

        restartGenerationBefore: prevGen,

        restartGenerationExpected: nextGen,

      })

      setTimeout(() => restartLauncher(), 150)

      return

    }



    if (path === '/api/stop' && req.method === 'POST') {

      const body = await readBody(req)

      const serverId = parseViteServerIdFromBody(body)

      pushActionLog(`Action tableau de bord : arrêter Vite (${getViteSlot(serverId).def.label})`)

      const operationId = stopViteServer(serverId)

      sendJson(res, 200, { ok: true, server: serverId, operationId })

      return

    }



    if (path === '/api/shutdown' && req.method === 'POST') {

      sendJson(res, 200, { ok: true })

      setTimeout(() => shutdown(), 100)

      return

    }



    if (path === '/api/quit-all' && req.method === 'POST') {

      sendJson(res, 200, { ok: true })

      setTimeout(() => shutdown(), 100)

      return

    }



    if (path === '/api/cleanup-ghosts' && req.method === 'POST') {

      pushActionLog('Nettoyage processus fantômes (ports 9221 / 5173 / 5174)')

      const operationId = beginOperation({
        kind: 'cleanup-ghosts',
        label: 'Nettoyage processus fantômes',
        serverId: null,
        steps: [
          { id: 'scan', label: 'Analyse des ports 9221 / 5173 / 5174', weight: 35 },
          { id: 'kill', label: 'Arrêt des processus bloquants', weight: 45 },
          { id: 'done', label: 'Nettoyage terminé', weight: 20 },
        ],
      })

      pushOperationProgress(getOperation(operationId))

      advanceOperation(operationId, 'scan', { partialInStep: 0.4 })

      const result = await cleanupGhostProcesses()

      advanceOperation(operationId, 'kill', { partialInStep: 1 })

      const op = completeOperation(operationId, {
        detail: `${result.killed?.length ?? 0} arrêté(s)`,
      })

      pushOperationProgress(op)

      invalidateProcessInventoryCache()

      pushActionLog('Nettoyage fantômes terminé', {

        extra: `${result.killed?.length ?? 0} arrêté(s) · verrou ${result.lockCleared ? 'levé' : 'ok'}`,

      })

      sendJson(res, 200, { ok: true, operationId, ...result })

      return

    }



    if (path === '/api/build' && req.method === 'POST') {

      pushActionLog('Action tableau de bord : npm run build')

      const operationId = runBuild()

      sendJson(res, 200, { ok: true, operationId })

      return

    }



    if (path === '/api/clear-logs' && req.method === 'POST') {

      logLines = []

      for (const id of LOG_CHANNEL_IDS) logChannels[id] = []

      pushActionLog('Journal vidé depuis le tableau de bord')

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/open-repo' && req.method === 'POST') {

      pushActionLog('Ouverture du dossier projet', { extra: REPO_ROOT })

      const folder = REPO_ROOT.replace(/"/g, '')

      if (process.platform === 'win32') {

        execFile('explorer.exe', [folder], { windowsHide: true })

      } else {

        const command =

          process.platform === 'darwin'

            ? `open "${folder}"`

            : `xdg-open "${folder}"`

        exec(command, { windowsHide: true })

      }

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/version-prompt' && req.method === 'POST') {

      pushActionLog('Bump version prompt (npm run version:prompt)')

      const versionSpawn = scriptSpawnArgs('version:prompt')

      spawnHidden(versionSpawn.command, versionSpawn.args, {

        cwd: REPO_ROOT,

        stdio: 'ignore',

      })

      sendJson(res, 200, { ok: true })

      return

    }



    if (path === '/api/dev-host' && req.method === 'POST') {

      const body = await readBody(req)

      let nextExposure = devHostExposure

      try {

        const parsed = body ? JSON.parse(body) : {}

        if (typeof parsed.exposeLan === 'boolean') nextExposure = parsed.exposeLan

        else if (parsed.toggle) nextExposure = !devHostExposure

      } catch {

        nextExposure = !devHostExposure

      }

      const changed = nextExposure !== devHostExposure

      devHostExposure = nextExposure

      pushActionLog(

        devHostExposure

          ? 'Serveur téléphone activé — Vite écoute sur le LAN (--host)'

          : 'Serveur téléphone désactivé — localhost uniquement',

        { extra: changed ? 'redémarrage Vite…' : 'inchangé' },

      )

      if (changed) {

        for (const slot of Object.values(viteSlots)) {

          if (slot.process || slot.status === 'running' || slot.status === 'starting' || slot.attachedPid) {

            restartViteServer(slot.id)

          }

        }

      }

      sendJson(res, 200, {

        ok: true,

        devHostExposure,

        networkGameUrl: gameSlot().networkUrl,

      })

      return

    }



    if (path === '/api/audit-freeze' && req.method === 'POST') {

      pushActionLog('Audit diagnostic — serveur dev')

      const report = await runFreezeAudit(getDiagnosticsContext())

      for (const finding of report.findings) {

        pushLog(`[audit/${finding.severity}] ${finding.message}`, 'launcher')

      }

      pushActionLog(`Audit terminé — ${report.summary}`, {

        extra: `${report.findings.length} finding(s) · gel=${report.frozen ? 'oui' : 'non'}`,

      })

      sendJson(res, 200, { ok: true, report })

      return

    }



    if (path === '/api/monitoring' && req.method === 'GET') {

      touchDashboardActivity(req.headers['x-havre-dashboard'] === '1')

      const snapshot = await collectMonitoringSnapshot(getDiagnosticsContext())

      sendJson(res, 200, snapshot)

      return

    }



    if (path === '/api/backlog' && req.method === 'GET') {

      sendJson(res, 200, {

        ...loadBacklog(REPO_ROOT),

        statusPresets: BACKLOG_STATUS_PRESETS,

        categories: BACKLOG_CATEGORIES,

      })

      return

    }



    if (path === '/api/backlog/refresh' && req.method === 'POST') {

      const data = loadBacklog(REPO_ROOT)

      sendJson(res, 200, {

        ...data,

        statusPresets: BACKLOG_STATUS_PRESETS,

        categories: BACKLOG_CATEGORIES,

        refreshed: true,

        message: data.ok

          ? `Backlog relu · ${data.itemCount ?? 0} entrées · docs/BACKLOG.md`

          : (data.error ?? 'Lecture impossible'),

      })

      return

    }



    if (path === '/api/product-changelog' && req.method === 'GET') {

      sendJson(res, 200, getProductChangelog(REPO_ROOT))

      return

    }



    if (path === '/api/product-changelog/compile' && req.method === 'POST') {

      sendJson(res, 200, compileProductChangelog(REPO_ROOT))

      return

    }



    if (path === '/api/game-state' && req.method === 'GET') {

      sendJson(res, 200, getGameState(REPO_ROOT))

      return

    }



    if (path === '/api/game-state/compile' && req.method === 'POST') {

      sendJson(res, 200, compileGameState(REPO_ROOT))

      return

    }



    if (path === '/api/backlog/items' && req.method === 'POST') {

      let payload = {}

      try {

        payload = JSON.parse((await readBody(req)) || '{}')

      } catch {

        sendJson(res, 400, { ok: false, error: 'Corps JSON invalide' })

        return

      }

      sendJson(res, 200, createBacklogItem(REPO_ROOT, payload))

      return

    }



    if (path === '/api/backlog/reorder' && req.method === 'POST') {

      let payload = {}

      try {

        payload = JSON.parse((await readBody(req)) || '{}')

      } catch {

        sendJson(res, 400, { ok: false, error: 'Corps JSON invalide' })

        return

      }

      sendJson(res, 200, reorderBacklogItems(REPO_ROOT, payload.order))

      return

    }



    const backlogItemMatch = path.match(/^\/api\/backlog\/items\/([^/]+)$/)

    if (backlogItemMatch) {

      const itemId = decodeURIComponent(backlogItemMatch[1])

      if (req.method === 'PUT') {

        let payload = {}

        try {

          payload = JSON.parse((await readBody(req)) || '{}')

        } catch {

          sendJson(res, 400, { ok: false, error: 'Corps JSON invalide' })

          return

        }

        sendJson(res, 200, updateBacklogItem(REPO_ROOT, itemId, payload))

        return

      }

      if (req.method === 'DELETE') {

        sendJson(res, 200, deleteBacklogItem(REPO_ROOT, itemId))

        return

      }

    }



    if (path === '/api/kill-process' && req.method === 'POST') {

      const body = await readBody(req)

      let pid = null

      try {

        const parsed = body ? JSON.parse(body) : {}

        pid = Number.parseInt(parsed.pid, 10)

      } catch {

        sendJson(res, 400, { ok: false, error: 'Corps JSON invalide' })

        return

      }

      if (!Number.isFinite(pid) || pid <= 0) {

        sendJson(res, 400, { ok: false, error: 'PID invalide' })

        return

      }

      const inventory = collectProcessInventory(getDiagnosticsContext())

      const entry = inventory.all.find((item) => item.pid === pid)

      if (!entry?.canKill) {

        sendJson(res, 403, {

          ok: false,

          error: 'Ce processus ne peut pas être tué (lanceur actif ou non listé).',

        })

        return

      }

      pushActionLog('Kill fantôme individuel', { extra: `PID ${pid} · ${entry.label ?? entry.role}` })

      const result = killInventoryProcess(pid, process.pid)

      if (result.ok) invalidateProcessInventoryCache()

      if (result.ok) {

        for (const slot of Object.values(viteSlots)) {

          if (slot.process?.pid === pid) slot.process = null

          if (slot.attachedPid === pid) slot.attachedPid = null

          if (

            ['vite-port', 'vite', 'vite-lab', 'node-orphan'].includes(entry.role) &&

            slot.status === 'running'

          ) {

            slot.status = 'stopped'

          }

        }

      }

      sendJson(res, 200, { ok: result.ok, ...result })

      return

    }



    if (path === '/api/copy-url' && req.method === 'POST') {

      const body = await readBody(req)

      let target = 'local'

      let serverId = 'game'

      try {

        const parsed = body ? JSON.parse(body) : {}

        if (parsed.target === 'network') target = 'network'

        serverId = resolveViteServerId(parsed.server)

      } catch {

        /* default local */

      }

      const slot = getViteSlot(serverId)

      const url = target === 'network' ? slot.networkUrl ?? slot.url : slot.url

      pushActionLog('Copie URL demandée', { extra: url })

      sendJson(res, 200, { ok: true, url, target })

      return

    }



    await readBody(req)

    sendJson(res, 404, { error: 'not-found' })

    } catch (error) {

      console.error('[Havre Dev Launcher] Erreur API dashboard :', error)

      if (!res.headersSent) {

        sendJson(res, 500, { ok: false, error: error?.message ?? String(error) })

      }

    }

  })

}



function shutdown() {

  if (shuttingDown) return

  shuttingDown = true

  pushActionLog('Fermeture du lanceur — arrêt Vite et build en cours')

  persistSessionSnapshot()

  releaseLauncherLock()

  if (consoleHideTimer) {

    clearTimeout(consoleHideTimer)

    consoleHideTimer = null

  }

  if (dashboardIdleTimer) {

    clearInterval(dashboardIdleTimer)

    dashboardIdleTimer = null

  }

  stopAllViteServers()

  stopProcessTree(buildProcess)

  for (const slot of Object.values(viteSlots)) {

    if (slot.pollTimer) clearInterval(slot.pollTimer)

  }

  const exitNow = () => process.exit(0)

  if (dashboardServer?.listening) {

    dashboardServer.close(exitNow)

    setTimeout(exitNow, 2000)

    return

  }

  exitNow()

}



function listenDashboard(server, { delayMs = 0, isReattach = false } = {}) {

  server.setMaxListeners(16)

  let listenAttempts = 0

  const MAX_LISTEN_ATTEMPTS = isReattach ? 30 : 2

  const dashboardUrl = `http://127.0.0.1:${DASHBOARD_PORT}/`



  const onListening = () => {

    listenAttempts = 0

    console.log(`[Havre Dev Launcher] Tableau de bord : ${dashboardUrl}`)

    pushActionLog(`${LAUNCHER_LABEL} prêt`, {

      extra: `gen ${launcherRestartGeneration} · empreinte ${computeLauncherFingerprint()} · dashboard :${DASHBOARD_PORT} · Node ${process.version}${isReattach ? ' · reattach' : ''}`,

      launcher: false,

    })

    if (!openedDashboardOnce && !isReattach) {

      openedDashboardOnce = true

      openInBrowser(dashboardUrl)

    } else if (!openedDashboardOnce) {

      openedDashboardOnce = true

    }

  }



  const scheduleListen = () => {

    server.removeAllListeners('error')

    server.removeAllListeners('listening')

    server.once('listening', onListening)



    server.once('error', (error) => {

      if (error?.code !== 'EADDRINUSE') {

        console.error(error)

        process.exit(1)

        return

      }



      void (async () => {

        if (isReattach) {

          listenAttempts += 1

          pushLog(

            `Mise à jour — port ${DASHBOARD_PORT} occupé par l’ancien processus (essai ${listenAttempts}/${MAX_LISTEN_ATTEMPTS})…`,

            'launcher',

          )

          if (listenAttempts >= MAX_LISTEN_ATTEMPTS) {

            const blockerPid = findListeningPidOnPort(DASHBOARD_PORT)

            pushActionLog('Échec mise à jour — port dashboard toujours occupé', {

              extra: blockerPid ? `PID ${blockerPid}` : 'PID inconnu',

            })

            console.error(

              `[Havre Dev Launcher] Mise à jour échouée — port ${DASHBOARD_PORT} toujours occupé après ${MAX_LISTEN_ATTEMPTS} essais.`,

            )

            process.exit(1)

            return

          }

          setTimeout(() => {

            if (server.listening) {

              server.close(() => scheduleListen())

              return

            }

            scheduleListen()

          }, 800)

          return

        }



        if (listenAttempts === 0) {

          const existing = await probeExistingDashboard()

          if (existing?.launcherVersion === LAUNCHER_VERSION) {

            console.log(

              '[Havre Dev Launcher] Lanceur déjà actif — ouverture du tableau de bord existant.',

            )

            openInBrowser(dashboardUrl)

            setTimeout(() => process.exit(0), 400)

            return

          }

          if (existing) {

            await replaceStaleDashboardProcess(existing)

          }

        }



        if (listenAttempts >= MAX_LISTEN_ATTEMPTS) {

          const blockerPid = findListeningPidOnPort(DASHBOARD_PORT)

          console.error(

            `[Havre Dev Launcher] Port ${DASHBOARD_PORT} occupé${

              blockerPid ? ` (PID ${blockerPid})` : ''

            }.`,

          )

          console.error(

            'Fermez l’onglet du tableau de bord précédent ou exécutez : taskkill /PID <pid> /F /T',

          )

          process.exit(1)

          return

        }



        listenAttempts += 1

        pushLog(

          `Port ${DASHBOARD_PORT} occupé — nouvel essai ${listenAttempts}/${MAX_LISTEN_ATTEMPTS} dans 800 ms…`,

          'launcher',

        )



        setTimeout(() => {

          if (server.listening) {

            server.close(() => scheduleListen())

            return

          }

          scheduleListen()

        }, 800)

      })()

    })



    server.listen(DASHBOARD_PORT, '127.0.0.1')

  }



  if (delayMs > 0) {

    setTimeout(scheduleListen, delayMs)

  } else {

    scheduleListen()

  }

}



async function main() {

  if (!existsSync(join(REPO_ROOT, 'package.json'))) {

    console.error('Erreur : package.json introuvable. Lancez depuis la racine du repo.')

    process.exit(1)

  }



  ensureSessionDir()

  applyLogRetention({ quiet: true })



  if (process.argv.includes(CLEANUP_GHOSTS_ARG)) {

    const result = await cleanupGhostProcesses()

    if (result.killed.length === 0 && !result.lockCleared) {

      console.log('[Havre Dev Launcher] Aucun fantôme détecté.')

    } else {

      console.log('[Havre Dev Launcher] Nettoyage terminé :')

      for (const item of result.killed) {

        console.log(`  - PID ${item.pid} (${item.role}, port ${item.port})`)

      }

      if (result.lockCleared) console.log('  - Verrou launcher supprimé')

      if (result.viteKept) console.log('  - Vite actif conservé')

    }

    process.exit(0)

  }



  const isReattach = process.argv.includes(REATTACH_ARG)



  if (!isReattach && (await handOffToExistingDashboard())) {

    return

  }



  const gotLock = await acquireLauncherLockWithRetry({ isReattach })

  if (!gotLock) {

    if (!isReattach && (await handOffToExistingDashboard())) return

    console.error(

      '[Havre Dev Launcher] Un lanceur démarre déjà. Attendez 5 secondes ou fermez l’onglet du tableau de bord.',

    )

    process.exit(1)

  }



  launcherLockHeld = true

  process.on('exit', () => {

    persistSessionSnapshot()

    releaseLauncherLock()

  })



  const sessionState = loadSessionState()

  launcherRestartGeneration = sessionState?.restartGeneration ?? 0

  gameDevSuppressed = Boolean(sessionState?.gameDevSuppressed)

  restoreViteSlotsFromSession(viteSlots, sessionState)



  let sessionLogsRawCount = 0

  if (sessionState) {

    sessionLogsRawCount = restoreLogsFromSession(sessionState)

    if (isReattach || sessionState.pendingReattach) {

      importRestartGenLog(sessionState.restartGeneration)

    }

  }



  let reattached = false

  if (isReattach) {

    openedDashboardOnce = sessionState?.openedDashboardOnce ?? true

    reattached = await tryReattachSession({ rawLogCountBeforeSanitize: sessionLogsRawCount })

    if (reattached) {

      pushActionLog('Reprise session après mise à jour', {

        extra: `gen ${launcherRestartGeneration} · jeu ${gameSlot().status} · lab ${getViteSlot('minigames').status}`,

      })

    } else {

      pushActionLog('Reprise session partielle — démarrage dashboard seul', {

        extra: `gen ${launcherRestartGeneration}`,

      })

    }

  } else if (sessionLogsRawCount > 0 || totalChannelLineCount(logChannels) > 0) {

    pushActionLog('Journal session restauré', {

      extra: `${logLines.length} utilisateur · ${totalChannelLineCount(logChannels)} techniques · rétention 24 h`,

      launcher: false,

    })

  }



  applyLogRetention({ quiet: true })

  launcherStartedAt = Date.now()

  launcherProcessFingerprint = computeLauncherFingerprint()

  setInterval(() => applyLogRetention({ quiet: true }), LOG_RETENTION_INTERVAL_MS)

  startSessionAutosave()

  pushActionLog(`Démarrage ${LAUNCHER_LABEL}`, {

    extra: `${reattached ? 'session reprise' : 'nouvelle session'} · PID ${process.pid} · app ${getAppVersionLabel()}`,

    launcher: false,

  })



  dashboardServer = createDashboardServer()

  listenDashboard(dashboardServer, { delayMs: isReattach ? 400 : 0, isReattach })



  watchBuildInfoFile()



  if (!reattached) {

    const game = gameSlot()

    game.status = 'stopped'

    game.process = null

    game.attachedPid = null

    pushActionLog('Jeu :5173 en attente — démarrage manuel', {

      extra: 'cliquez Démarrer sur le tableau de bord · lab :5174 optionnel',

    })

  }



  bindConsoleCloseShutdown()

  if (backgroundMode) {

    startDashboardIdleWatch()

  }



  process.on('SIGINT', shutdown)

  process.on('SIGTERM', shutdown)

}



main()


