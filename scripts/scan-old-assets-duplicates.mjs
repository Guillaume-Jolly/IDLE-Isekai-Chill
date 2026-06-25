#!/usr/bin/env node
/**
 * Find byte-identical duplicates between old_assets/ and assets/, and within old_assets/.
 * Moves redundant old_assets copies to archive/ (never delete).
 *
 * Usage:
 *   node scripts/scan-old-assets-duplicates.mjs [--dry-run] [--execute] [--json]
 *
 * Default: dry-run + write old_assets/dedup-report.json + old_assets/dedup-report.md
 */
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const ASSETS = join(ROOT, 'assets')
const DRY = !process.argv.includes('--execute')
const JSON_ONLY = process.argv.includes('--json')

const DATE = '2026-06-25'
const CONFLICTS_ROOT = join(ROOT, 'To check manually/old-assets-dedup-conflicts')
const REPORT_DIR = join(ROOT, 'docs/traceability/assets/old-assets-reports')
const REPORT_JSON = join(REPORT_DIR, 'dedup-report.json')
const REPORT_MD = join(REPORT_DIR, 'dedup-report.md')
const LOG_PATH = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')

const FILE_EXT = /\.(png|webp|svg|jpe?g|gif|zip|md|txt|json)$/i
const SKIP_OLD_PREFIXES = []

/** @type {Array<{from: string, to: string, reason: string, kind: string}>} */
const actions = []
/** @type {Array<Record<string, unknown>>} */
const conflicts = []

const stats = {
  scannedAssets: 0,
  scannedOldAssets: 0,
  movedVsAssets: 0,
  movedInternal: 0,
  conflicts: 0,
  skipped: 0,
  errors: 0,
}

function relPath(full) {
  return full.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function sha256(path) {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256')
    createReadStream(path)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject)
  })
}

function isTracked(rel) {
  try {
    execSync(`git ls-files --error-unmatch "${rel.replace(/\\/g, '/')}"`, {
      cwd: ROOT,
      stdio: 'pipe',
    })
    return true
  } catch {
    return false
  }
}

function gitMv(fromRel, toRel) {
  const from = fromRel.replace(/\\/g, '/')
  const to = toRel.replace(/\\/g, '/')
  if (!existsSync(join(ROOT, from))) {
    stats.skipped++
    return false
  }
  if (DRY) {
    return true
  }
  mkdirSync(dirname(join(ROOT, to)), { recursive: true })
  try {
    if (isTracked(from)) {
      execSync(`git mv -f "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
    } else {
      renameSync(join(ROOT, from), join(ROOT, to))
    }
    return true
  } catch (e) {
    stats.errors++
    console.error(`Error moving ${from} → ${to}: ${e.message}`)
    return false
  }
}

function walkDir(dir, handler) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkDir(full, handler)
    else if (entry.isFile() && FILE_EXT.test(entry.name)) handler(full)
  }
}

function shouldSkipOld(rel) {
  if (SKIP_OLD_PREFIXES.some((p) => rel.startsWith(p))) return true
  if (rel.includes('/_archive/')) return true
  return false
}

function keeperScore(rel) {
  if (shouldSkipOld(rel)) return -1000
  if (rel.startsWith('old_assets/Compagnons/') && !rel.includes('/_archive/')) return 100
  if (rel.startsWith('old_assets/Background/') && !rel.includes('/_archive/')) return 90
  if (rel.startsWith('old_assets/Gacha/') && !rel.includes('/_archive/')) return 85
  if (rel.startsWith('old_assets/Myrions/') && !rel.includes('/_archive/')) return 80
  if (rel.startsWith('old_assets/Compagnons/prompts/')) return 54
  if (rel.startsWith('old_assets/Compagnons/imports/')) return 53
  if (rel.startsWith('old_assets/Background/prompts/')) return 40
  if (rel.includes('/chibis-replaced/')) return 25
  if (rel.startsWith('old_assets/Background/public-references/')) return 22
  if (rel.startsWith('old_assets/Background/village-mirror/')) return 20
  if (rel.includes('/layered-legacy/')) return 10
  if (rel.startsWith('old_assets/Compagnons/pack-event-invocation/')) return 10
  return 0
}

function pickKeeper(paths) {
  return [...paths].sort((a, b) => {
    const sa = keeperScore(a)
    const sb = keeperScore(b)
    if (sb !== sa) return sb - sa
    if (a.length !== b.length) return a.length - b.length
    return a.localeCompare(b)
  })[0]
}

function promptsArchiveSubfolder(rel) {
  const m =
    /^old_assets\/(?:Compagnons\/prompts|Background\/prompts|Compagnons\/imports|Myrions\/imports)\/([^/]+)/.exec(
      rel,
    )
  return m ? m[1] : null
}

function allowPromptsInternalDedup(paths) {
  const subs = new Set(paths.map(promptsArchiveSubfolder).filter(Boolean))
  return subs.size > 1
}

function archiveBucket(fromRel) {
  if (fromRel.startsWith('old_assets/Background/')) return 'Background'
  if (fromRel.startsWith('old_assets/Gacha/')) return 'Gacha'
  if (fromRel.startsWith('old_assets/Myrions/')) return 'Myrions'
  if (fromRel.startsWith('old_assets/Live2D/')) return 'Live2D'
  return 'Compagnons'
}

function archiveDest(fromRel, kind) {
  const bucket = archiveBucket(fromRel)
  const tail = fromRel.replace(/^old_assets\//, '')
  return relPath(join(OLD, bucket, `_archive/${DATE}-${kind}`, tail))
}

function semanticAssetsPath(oldRel) {
  const p = oldRel.replace(/\\/g, '/')
  if (p.startsWith('old_assets/Compagnons/')) {
    return p.replace(/^old_assets\//, 'assets/')
  }
  if (p.startsWith('old_assets/Background/')) {
    return p.replace(/^old_assets\//, 'assets/')
  }
  if (p.startsWith('old_assets/Gacha/')) {
    return p.replace(/^old_assets\//, 'assets/')
  }
  if (p.startsWith('old_assets/Myrions/')) {
    return p.replace(/^old_assets\//, 'assets/')
  }
  return null
}

async function buildIndex() {
  /** @type {Map<string, string[]>} */
  const assetsByHash = new Map()
  /** @type {Map<string, string[]>} */
  const oldByHash = new Map()
  /** @type {Map<string, string>} */
  const assetsPathIndex = new Map()

  const assetFiles = []
  walkDir(ASSETS, (full) => assetFiles.push(full))
  stats.scannedAssets = assetFiles.length
  for (const full of assetFiles) {
    const rel = relPath(full)
    try {
      const hash = await sha256(full)
      assetsPathIndex.set(rel, hash)
      if (!assetsByHash.has(hash)) assetsByHash.set(hash, [])
      assetsByHash.get(hash).push(rel)
    } catch {
      stats.errors++
    }
  }

  const oldFiles = []
  walkDir(OLD, (full) => {
    const rel = relPath(full)
    if (shouldSkipOld(rel)) return
    oldFiles.push(full)
  })
  stats.scannedOldAssets = oldFiles.length
  for (const full of oldFiles) {
    const rel = relPath(full)
    try {
      const hash = await sha256(full)
      if (!oldByHash.has(hash)) oldByHash.set(hash, [])
      oldByHash.get(hash).push(rel)
    } catch {
      stats.errors++
    }
  }

  return { assetsByHash, oldByHash, assetsPathIndex }
}

async function detectSemanticConflicts(assetsPathIndex) {
  /** @type {Array<Record<string, unknown>>} */
  const pathMirrors = []

  const oldFiles = []
  walkDir(OLD, (full) => {
    const rel = relPath(full)
    if (shouldSkipOld(rel)) return
    oldFiles.push(full)
  })

  for (const full of oldFiles) {
    const oldRel = relPath(full)
    const assetsRel = semanticAssetsPath(oldRel)
    if (!assetsRel) continue
    if (!existsSync(join(ROOT, assetsRel))) continue
    let oldHash
    let assetsHash
    try {
      oldHash = await sha256(full)
      assetsHash = assetsPathIndex.get(assetsRel) ?? (await sha256(join(ROOT, assetsRel)))
    } catch {
      continue
    }
    if (oldHash === assetsHash) continue
    const base = basename(oldRel)
    if (/archived|replaced|-v\d/i.test(base)) continue

    pathMirrors.push({
      oldAssets: oldRel,
      assets: assetsRel,
      oldHash: oldHash.slice(0, 16),
      assetsHash: assetsHash.slice(0, 16),
      basename: base,
      note: 'path mirror, different bytes — expected cold storage; review only',
    })
  }

  if (pathMirrors.length) {
    conflicts.push(...pathMirrors)
    stats.conflicts = pathMirrors.length
    mkdirSync(CONFLICTS_ROOT, { recursive: true })
    writeFileSync(join(CONFLICTS_ROOT, 'manifest.json'), JSON.stringify(pathMirrors, null, 2), 'utf8')
  }
}

async function dedupVsAssets(oldByHash, assetsByHash) {
  for (const [hash, oldPaths] of oldByHash) {
    const assetPaths = assetsByHash.get(hash)
    if (!assetPaths?.length) continue

    for (const oldRel of oldPaths) {
      if (shouldSkipOld(oldRel)) continue
      if (oldRel.includes('/prompts/') || oldRel.includes('/imports/')) continue

      const destRel = archiveDest(oldRel, 'dedup-vs-assets')
      if (gitMv(oldRel, destRel)) {
        stats.movedVsAssets++
        actions.push({
          from: oldRel,
          to: destRel,
          reason: `byte-identical to ${assetPaths[0]}`,
          kind: 'vs-assets',
          hash: hash.slice(0, 16),
          assetsKeep: assetPaths[0],
        })
      }
    }
  }
}

async function dedupInternal(oldByHash) {
  for (const [hash, paths] of oldByHash) {
    const active = paths.filter((p) => !shouldSkipOld(p) && existsSync(join(ROOT, p)))
    if (active.length < 2) continue

    const allPrompts = active.every(
      (p) => p.includes('/prompts/') || p.includes('/imports/'),
    )
    if (allPrompts && !allowPromptsInternalDedup(active)) continue

    const keeper = pickKeeper(active)
    for (const oldRel of active) {
      if (oldRel === keeper) continue
      const destRel = archiveDest(oldRel, 'dedup-internal')
      if (gitMv(oldRel, destRel)) {
        stats.movedInternal++
        actions.push({
          from: oldRel,
          to: destRel,
          reason: `internal duplicate of ${keeper}`,
          kind: 'internal',
          hash: hash.slice(0, 16),
          keeper,
        })
      }
    }
  }
}

function writeReports(inventory) {
  const report = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY,
    stats,
    inventory,
    actions,
    conflicts,
  }

  if (JSON_ONLY) {
    console.log(JSON.stringify(report, null, 2))
    return report
  }

  mkdirSync(REPORT_DIR, { recursive: true })

  const md = `# old_assets dedup report

Generated: ${report.generatedAt}${DRY ? ' (dry-run)' : ''}

## Summary

| Metric | Count |
|--------|------:|
| Scanned assets/ | ${stats.scannedAssets} |
| Scanned old_assets/ (excl. \`_archive/\`) | ${stats.scannedOldAssets} |
| Moved vs assets/ (byte-identical) | ${stats.movedVsAssets} |
| Moved internal duplicates | ${stats.movedInternal} |
| Semantic conflicts | ${stats.conflicts} |
| Skipped | ${stats.skipped} |
| Errors | ${stats.errors} |

## Inventory (top-level old_assets/)

${Object.entries(inventory.before ?? inventory)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `- \`${k}/\`: ${v} files`)
  .join('\n')}

${inventory.after ? `\n### After dedup\n\n${Object.entries(inventory.after)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([k, v]) => `- \`${k}/\`: ${v} files`)
  .join('\n')}\n` : ''}

## Actions (${actions.length})

${actions.length ? actions.map((a) => `- \`${a.from}\` → \`${a.to}\` — ${a.reason}`).join('\n') : '_none_'}

## Path mirrors — different bytes (${conflicts.length}, report-only)

${conflicts.length ? conflicts.slice(0, 50).map((c) => `- \`${c.oldAssets}\` vs \`${c.assets}\` (${c.basename})`).join('\n') + (conflicts.length > 50 ? `\n- … +${conflicts.length - 50} more in manifest.json` : '') : '_none_'}

See \`docs/traceability/assets/old-assets-cleanup-log.md\`.
`

  if (!JSON_ONLY) {
    writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8')
    writeFileSync(REPORT_MD, md, 'utf8')
  }

  return report
}

function appendLog() {
  if (DRY) return
  const ts = DATE
  const header = `\n\n---\n\n## Session ${ts} — scan-old-assets-duplicates\n\n`
  const statsBlock = `### Stats\n\n\`\`\`json\n${JSON.stringify(stats, null, 2)}\n\`\`\`\n\n`
  const rows = actions
    .slice(0, 200)
    .map((a) => `| \`${a.from}\` | \`${a.to}\` | ${a.reason} | ${a.kind} |`)
    .join('\n')
  const table = `| From | To | Reason | Kind |\n|------|-----|--------|------|\n${rows || '| _none_ | | | |'}\n`
  const conflictNote =
    conflicts.length > 0
      ? `\n### Conflicts → To check manually/old-assets-dedup-conflicts/\n\n${conflicts.map((c) => `- \`${c.oldAssets}\` vs \`${c.assets}\``).join('\n')}\n`
      : ''

  const existing = existsSync(LOG_PATH) ? readFileSync(LOG_PATH, 'utf8') : '# old_assets cleanup log\n\n'
  writeFileSync(LOG_PATH, existing + header + table + statsBlock + conflictNote, 'utf8')
}

function inventoryOldAssets() {
  /** @type {Record<string, number>} */
  const counts = {}
  if (!existsSync(OLD)) return counts
  for (const entry of readdirSync(OLD, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    let n = 0
    walkDir(join(OLD, entry.name), () => {
      n++
    })
    counts[entry.name] = n
  }
  return counts
}

console.log(`scan old_assets duplicates${DRY ? ' (dry-run)' : ''}\n`)

const inventory = inventoryOldAssets()
const { assetsByHash, oldByHash, assetsPathIndex } = await buildIndex()

console.log(`Indexed ${stats.scannedAssets} assets/ + ${stats.scannedOldAssets} old_assets/ files\n`)

await dedupVsAssets(oldByHash, assetsByHash)

const { oldByHash: oldByHash2 } = await buildIndex()
await dedupInternal(oldByHash2)

await detectSemanticConflicts(assetsPathIndex)

const finalInventory = inventoryOldAssets()
writeReports({ before: inventory, after: finalInventory })
appendLog()

console.log(JSON.stringify(stats, null, 2))
console.log(`\nReport: ${REPORT_JSON}`)
console.log(`        ${REPORT_MD}`)
