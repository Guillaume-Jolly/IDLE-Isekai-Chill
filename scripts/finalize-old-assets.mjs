#!/usr/bin/env node
/**
 * Finalize old_assets/ after flatten + dedup:
 * - Promote nested Autres/event-disagrea/_archive → Compagnons/_archive/
 * - Move Autres README stubs → Compagnons/_archive/stubs/
 * - Remove empty directory trees (never delete files)
 *
 * Usage: node scripts/finalize-old-assets.mjs [--dry-run] [--execute]
 */
import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const DRY = !process.argv.includes('--execute')
const LOG = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')

/** @type {Array<{from: string, to: string}>} */
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

function plan(fromRel, toRel) {
  if (fromRel === toRel || !existsSync(join(ROOT, fromRel))) return
  moves.push({ from: fromRel, to: toRel })
}

function walkFiles(dir, handler) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(full, handler)
    else handler(full)
  }
}

function planPromoteNestedArchives() {
  walkFiles(join(OLD, 'Compagnons/Autres/event-disagrea/_archive'), (full) => {
    const r = rel(full)
    const m = /old_assets\/Compagnons\/Autres\/event-disagrea\/_archive\/([^/]+)\/(.+)$/.exec(r)
    if (!m) return
    plan(r, `old_assets/Compagnons/_archive/${m[1]}/${m[2]}`)
  })
}

function planStubMoves() {
  for (const name of ['README-event-disagrea.md', 'README-layered-legacy.md']) {
    plan(`old_assets/Compagnons/Autres/${name}`, `old_assets/Compagnons/_archive/stubs/${name}`)
  }
  plan(
    'old_assets/Compagnons/Autres/event-disagrea/nsfw-replaced/README.md',
    'old_assets/Compagnons/_archive/stubs/nsfw-replaced-README.md',
  )
}

function pruneEmptyDirs(dir) {
  if (!existsSync(dir)) return 0
  let removed = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removed += pruneEmptyDirs(join(dir, entry.name))
  }
  if (dir !== OLD && readdirSync(dir).length === 0) {
    if (!DRY) {
      try {
        rmdirSync(dir)
        removed++
      } catch {
        /* locked or race */
      }
    } else {
      removed++
    }
  }
  return removed
}

planPromoteNestedArchives()
planStubMoves()

const byDest = new Map()
for (const m of moves) byDest.set(m.to, m.from)
const finalMoves = [...byDest.entries()].map(([to, from]) => ({ from, to }))

console.log(`${DRY ? 'DRY-RUN' : 'EXECUTE'}: ${finalMoves.length} file moves`)

if (DRY) {
  for (const m of finalMoves.slice(0, 8)) console.log(`  ${m.from}\n    → ${m.to}`)
  if (finalMoves.length > 8) console.log(`  … +${finalMoves.length - 8}`)
  const empty = pruneEmptyDirs(OLD)
  console.log(`Would remove ${empty} empty dirs`)
} else {
  let ok = 0
  let err = 0
  const sorted = [...finalMoves].sort((a, b) => b.from.length - a.from.length)
  for (const { from, to } of sorted) {
    const fromPath = join(ROOT, from)
    const toPath = join(ROOT, to)
    if (!existsSync(fromPath)) continue
    mkdirSync(dirname(toPath), { recursive: true })
    try {
      if (isTracked(from)) execSync(`git mv -f "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
      else renameSync(fromPath, toPath)
      ok++
    } catch (e) {
      err++
      console.error(`FAIL ${from} → ${to}: ${e.message}`)
    }
  }
  const pruned = pruneEmptyDirs(OLD)
  writeFileSync(
    LOG,
    `\n---\n\n## Session 2026-06-25 — finalize old_assets\n\nMoves: **${ok}** (${err} errors). Empty dirs removed: **${pruned}**.\n`,
    { flag: 'a' },
  )
  console.log(JSON.stringify({ moves: ok, errors: err, pruned }))
}
