#!/usr/bin/env node
/**
 * Consolidate old_assets/ to 5 top-level folders (mirror assets/):
 *   Compagnons/, Background/, Myrions/, Gacha/, Live2D/
 *
 * Never delete — move only. Reports → docs/traceability/assets/old-assets-reports/
 *
 * Usage: node scripts/sort-old-assets-five-folders.mjs [--dry-run] [--execute]
 */
import { createReadStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const REPORTS = join(ROOT, 'docs/traceability/assets/old-assets-reports')
const LOG = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')
const DRY = !process.argv.includes('--execute')

const FIVE = ['Compagnons', 'Background', 'Myrions', 'Gacha', 'Live2D']

/** @type {Array<{from: string, to: string, reason: string}>} */
const moves = []

function rel(full) {
  return full.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function isTracked(r) {
  try {
    execSync(`git ls-files --error-unmatch "${r}"`, { cwd: ROOT, stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

function planMove(fromRel, toRel, reason) {
  if (fromRel === toRel) return
  const from = join(ROOT, fromRel)
  if (!existsSync(from)) return
  moves.push({ from: fromRel, to: toRel, reason })
}

function moveDirContents(fromRel, toRel, reason) {
  const from = join(ROOT, fromRel)
  if (!existsSync(from)) return
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = `${fromRel}/${entry.name}`.replace(/\/+/g, '/')
    const dst = `${toRel}/${entry.name}`.replace(/\/+/g, '/')
    if (entry.isDirectory()) planMove(src, dst, reason)
    else planMove(src, dst, reason)
  }
}

function routeArchivePath(archiveRel) {
  // archive/2026-06-25-*/...
  const tail = archiveRel.replace(/^old_assets\/archive\//, '')
  const parts = tail.split('/')
  const batch = parts[0]

  if (tail.includes('/Compagnons/')) {
    const idx = tail.indexOf('/Compagnons/')
    const sub = tail.slice(idx + '/Compagnons/'.length)
    return `old_assets/Compagnons/_archive/${batch}/${sub}`
  }
  if (tail.includes('/Background/')) {
    const idx = tail.indexOf('/Background/')
    const sub = tail.slice(idx + '/Background/'.length)
    return `old_assets/Background/_archive/${batch}/${sub}`
  }
  if (tail.includes('/Myrions/')) {
    const idx = tail.indexOf('/Myrions/')
    const sub = tail.slice(idx + '/Myrions/'.length)
    return `old_assets/Myrions/_archive/${batch}/${sub}`
  }
  if (tail.includes('/Gacha/') || tail.includes('gacha-event') || tail.includes('gacha/')) {
    const sub = parts.slice(1).join('/')
    return `old_assets/Gacha/_archive/${batch}/${sub}`
  }
  if (tail.includes('event-disagrea')) {
    const sub = parts.slice(1).join('/')
    return `old_assets/Compagnons/Autres/event-disagrea/_archive/${batch}/${sub}`
  }
  if (tail.includes('prompts-archive/')) {
    const pa = tail.slice(tail.indexOf('prompts-archive/') + 'prompts-archive/'.length)
    if (pa.startsWith('minigames/')) {
      return `old_assets/Background/Autres/prompts/${pa}`
    }
    if (pa.startsWith('disagrea/')) {
      return `old_assets/Compagnons/Autres/prompts/${pa}`
    }
    if (pa.startsWith('imports/myrions')) {
      return `old_assets/Myrions/Autres/${pa.replace(/^imports\//, 'imports/')}`
    }
    if (pa.startsWith('imports/talia')) {
      return `old_assets/Compagnons/Autres/${pa.replace(/^imports\//, 'imports/')}`
    }
    return `old_assets/Compagnons/Autres/prompts/${pa}`
  }
  if (batch.includes('empty-stubs')) {
    return `old_assets/Compagnons/_archive/${tail}`
  }
  if (tail.includes('Compagnons')) {
    return `old_assets/Compagnons/_archive/${tail}`
  }
  return `old_assets/Compagnons/_archive/${tail}`
}

function walkFiles(dir, handler) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, handler)
    else handler(full)
  }
}

function planTopLevelConsolidation() {
  // Parasite dirs → 5 buckets
  moveDirContents('old_assets/companion-chibis-replaced', 'old_assets/Compagnons/Autres/chibis-replaced', 'chibis regen archive')
  moveDirContents('old_assets/event-disagrea', 'old_assets/Compagnons/Autres/event-disagrea', 'event snapshot')
  moveDirContents(
    'old_assets/pack_event_invocation/01_compagnons',
    'old_assets/Compagnons/Autres/pack-event-invocation',
    'pack invocation compagnons',
  )
  moveDirContents(
    'old_assets/pack_event_invocation/02_myrions',
    'old_assets/Myrions/Autres/pack-event-invocation',
    'pack invocation myrions',
  )
  moveDirContents(
    'old_assets/pack_event_invocation/03_promo',
    'old_assets/Gacha/Autres/pack-event-invocation/promo',
    'pack invocation promo',
  )
  planMove(
    'old_assets/pack_event_invocation/README.md',
    'old_assets/Compagnons/Autres/pack-event-invocation/README.md',
    'pack invocation readme',
  )
  moveDirContents(
    'old_assets/gacha-event-disagrea-source-2026-06-25',
    'old_assets/Gacha/Autres/event-disagrea-source-2026-06-25',
    'gacha snapshot index',
  )
  moveDirContents('old_assets/public-mirror', 'old_assets/Background/Autres/public-mirror', 'public village mirror')
  moveDirContents('old_assets/public-references', 'old_assets/Background/Autres/public-references', 'public references txt')

  // prompts-archive → split by domain
  moveDirContents('old_assets/prompts-archive/disagrea', 'old_assets/Compagnons/Autres/prompts/disagrea', 'IA disagrea prompts')
  moveDirContents('old_assets/prompts-archive/minigames', 'old_assets/Background/Autres/prompts/minigames', 'IA minigame prompts')
  moveDirContents(
    'old_assets/prompts-archive/imports/myrions-import',
    'old_assets/Myrions/Autres/imports/myrions-import',
    'myrions import',
  )
  moveDirContents(
    'old_assets/prompts-archive/imports/talia-import',
    'old_assets/Compagnons/Autres/imports/talia-import',
    'talia import',
  )
  moveDirContents(
    'old_assets/prompts-archive/link-corpus-import',
    'old_assets/Compagnons/Autres/imports/link-corpus-import',
    'link corpus zip',
  )
  moveDirContents(
    'old_assets/prompts-archive/village-layout',
    'old_assets/Background/Autres/village-layout',
    'village layout',
  )
  planMove('old_assets/prompts-archive/README.md', 'old_assets/Compagnons/Autres/prompts/README.md', 'prompts readme')

  planMove('old_assets/companions/README.md', 'old_assets/Compagnons/Autres/stubs/companions-legacy-README.md', 'legacy stub')

  // Reports out of old_assets root
  for (const f of ['dedup-report.json', 'dedup-report.md', 'public-migration-report.json', 'public-migration-report.md']) {
    planMove(`old_assets/${f}`, `docs/traceability/assets/old-assets-reports/${f}`, 'reports')
  }

  // archive/ → distribute into _archive under each bucket
  walkFiles(join(OLD, 'archive'), (full) => {
    const fromRel = rel(full)
    const toRel = routeArchivePath(fromRel)
    if (fromRel !== toRel) planMove(fromRel, toRel, 'archive redistribution')
  })
}

function executeMoves() {
  let ok = 0
  let err = 0
  // deepest paths first to avoid moving parents before children
  const sorted = [...moves].sort((a, b) => b.from.length - a.from.length)
  for (const { from, to } of sorted) {
    const fromPath = join(ROOT, from)
    const toPath = join(ROOT, to)
    if (!existsSync(fromPath)) continue
    mkdirSync(dirname(toPath), { recursive: true })
    try {
      if (DRY) {
        ok++
        continue
      }
      if (isTracked(from)) execSync(`git mv -f "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
      else renameSync(fromPath, toPath)
      ok++
    } catch (e) {
      err++
      console.error(`FAIL ${from} → ${to}: ${e.message}`)
    }
  }
  return { ok, err }
}

function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(join(dir, entry.name))
  }
  if (dir === OLD) return
  try {
    if (readdirSync(dir).length === 0 && dir !== OLD) {
      if (!DRY) rmSync(dir, { recursive: true, force: true })
    }
  } catch {
    /* non-empty */
  }
}

function writeLive2DStub() {
  const readme = join(OLD, 'Live2D/README.md')
  if (existsSync(readme)) return
  const content = `# Live2D (old_assets)

Cold storage Live2D legacy — vide pour l'instant. Runtime : \`assets/Live2D/\`.
`
  if (!DRY) {
    mkdirSync(dirname(readme), { recursive: true })
    writeFileSync(readme, content, 'utf8')
  }
}

planTopLevelConsolidation()

console.log(`${DRY ? 'DRY-RUN' : 'EXECUTE'}: ${moves.length} planned moves`)

if (DRY) {
  const byReason = {}
  for (const m of moves) {
    byReason[m.reason] = (byReason[m.reason] ?? 0) + 1
  }
  console.log('By reason:', byReason)
  console.log('Sample:')
  for (const m of moves.slice(0, 8)) console.log(`  ${m.from}\n    → ${m.to}`)
  if (moves.length > 8) console.log(`  … +${moves.length - 8} more`)
} else {
  const { ok, err } = executeMoves()
  // Remove emptied parasite top-level dirs
  for (const d of [
    'archive',
    'companion-chibis-replaced',
    'companions',
    'event-disagrea',
    'gacha-event-disagrea-source-2026-06-25',
    'pack_event_invocation',
    'prompts-archive',
    'public-mirror',
    'public-references',
  ]) {
    removeEmptyDirs(join(OLD, d))
  }
  writeLive2DStub()
  const top = readdirSync(OLD, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  const append = [
    '',
    '---',
    '',
    '## Session 2026-06-25 — consolidation 5 dossiers old_assets',
    '',
    `Moves: **${ok}** (${err} errors). Top-level dirs: ${top.join(', ')}`,
    '',
  ].join('\n')
  writeFileSync(LOG, append, { flag: 'a' })
  console.log(JSON.stringify({ ok, err, topLevel: top }))
}
