#!/usr/bin/env node
/**
 * Flatten old_assets/ to mirror assets/ depth (max 4 levels from old_assets root).
 *
 * Target patterns (same spirit as assets/Compagnons/{id}/{category}/file):
 *   Compagnons/{id}/cutouts-legacy/emotion-*.png
 *   Compagnons/{id}/layered-legacy/cutout-*.png
 *   Compagnons/{id}/chibis-replaced/*.png
 *   Compagnons/{id}/Autres/guide/*.png
 *   Compagnons/_archive/{batch}/…  (no redundant Compagnons/ in tail)
 *   Background/village-mirror/…
 *   Background/prompts/minigames/…
 *   Myrions/imports/…
 *   Gacha/event-disagrea-source/…
 *
 * Usage: node scripts/flatten-old-assets-architecture.mjs [--dry-run] [--execute]
 */
import { existsSync, mkdirSync, readdirSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
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
  if (fromRel === toRel) return
  if (!existsSync(join(ROOT, fromRel))) return
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

function routeEmotionLegacy(fromRel) {
  const m =
    /old_assets\/Compagnons\/_archive\/(?:2026-06-25-)?cutouts-emotion-legacy\/(?:Compagnons\/)?([^/]+)\/cutouts\/(emotion-[^/]+\.png)$/.exec(
      fromRel,
    )
  if (!m) return null
  return `old_assets/Compagnons/${m[1]}/cutouts-legacy/${m[2]}`
}

function flattenArchiveTail(fromRel) {
  const emotionDest = routeEmotionLegacy(fromRel)
  if (emotionDest) return emotionDest

  const m = /^old_assets\/(Compagnons|Background|Myrions|Gacha|Live2D)\/_archive\/([^/]+)\/(.+)$/.exec(
    fromRel,
  )
  if (!m) return null
  const [, bucket, batch, tail] = m
  if (batch.startsWith('2026-06-25-cutouts-emotion-legacy')) return null
  let shortBatch = batch.replace(/^2026-06-25-/, '')
  let newTail = tail
  const prefix = `${bucket}/`
  if (newTail.startsWith(prefix)) newTail = newTail.slice(prefix.length)
  newTail = newTail.replace(/^event-disagrea\/public-layered-legacy\//, '')
  newTail = newTail.replace(/^event-disagrea\//, '')
  return `old_assets/${bucket}/_archive/${shortBatch}/${newTail}`
}

function planReorganizeActive() {
  // layered legacy → per companion
  walkFiles(join(OLD, 'Compagnons/Autres/event-disagrea/public-layered-legacy'), (full) => {
    const r = rel(full)
    const m = /public-layered-legacy\/([^/]+)\/(.+)$/.exec(r)
    if (!m) return
    plan(r, `old_assets/Compagnons/${m[1]}/layered-legacy/${m[2]}`)
  })

  // nsfw backup etna
  walkFiles(join(OLD, 'Compagnons/Autres/event-disagrea/nsfw-replaced'), (full) => {
    const r = rel(full)
    if (r.endsWith('.png')) {
      plan(r, `old_assets/Compagnons/etna/NSFW-legacy/${r.split('/').pop()}`)
    }
  })

  // chibis replaced
  walkFiles(join(OLD, 'Compagnons/Autres/chibis-replaced'), (full) => {
    const r = rel(full)
    const m = /chibis-replaced\/([^/]+)\/(.+)$/.exec(r)
    if (!m) return
    plan(r, `old_assets/Compagnons/${m[1]}/chibis-replaced/${m[2]}`)
  })

  // README stubs event-disagrea
  for (const [from, to] of [
    [
      'old_assets/Compagnons/Autres/event-disagrea/README.md',
      'old_assets/Compagnons/Autres/README-event-disagrea.md',
    ],
    [
      'old_assets/Compagnons/Autres/event-disagrea/public-layered-legacy/README.md',
      'old_assets/Compagnons/Autres/README-layered-legacy.md',
    ],
  ]) {
    plan(from, to)
  }

  // Background flatten
  walkFiles(join(OLD, 'Background/Autres/public-mirror'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Background/Autres/public-mirror/', '')
    plan(r, `old_assets/Background/village-mirror/${sub}`)
  })
  walkFiles(join(OLD, 'Background/Autres/public-references'), (full) => {
    const r = rel(full)
    plan(r, `old_assets/Background/public-references/${r.split('/').pop()}`)
  })
  walkFiles(join(OLD, 'Background/Autres/village-layout'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Background/Autres/village-layout/', '')
    plan(r, `old_assets/Background/village-layout/${sub}`)
  })
  walkFiles(join(OLD, 'Background/Autres/prompts/minigames'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Background/Autres/prompts/minigames/', '')
    plan(r, `old_assets/Background/prompts/minigames/${sub}`)
  })
  plan(
    'old_assets/Compagnons/Autres/prompts/README.md',
    'old_assets/Background/prompts/README.md',
  )

  // Compagnons prompts / imports
  walkFiles(join(OLD, 'Compagnons/Autres/prompts/disagrea'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Compagnons/Autres/prompts/disagrea/', '')
    plan(r, `old_assets/Compagnons/prompts/disagrea/${sub}`)
  })
  walkFiles(join(OLD, 'Compagnons/Autres/imports'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Compagnons/Autres/imports/', '')
    plan(r, `old_assets/Compagnons/imports/${sub}`)
  })

  // pack invocation
  walkFiles(join(OLD, 'Compagnons/Autres/pack-event-invocation'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Compagnons/Autres/pack-event-invocation/', '')
    plan(r, `old_assets/Compagnons/pack-event-invocation/${sub}`)
  })
  walkFiles(join(OLD, 'Myrions/Autres/pack-event-invocation'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Myrions/Autres/pack-event-invocation/', '')
    plan(r, `old_assets/Myrions/pack-event-invocation/${sub}`)
  })
  walkFiles(join(OLD, 'Myrions/Autres/imports'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Myrions/Autres/imports/', '')
    plan(r, `old_assets/Myrions/imports/${sub}`)
  })
  walkFiles(join(OLD, 'Gacha/Autres'), (full) => {
    const r = rel(full)
    const sub = r.replace('old_assets/Gacha/Autres/', '')
    plan(r, `old_assets/Gacha/${sub}`)
  })

  // stubs
  plan(
    'old_assets/Compagnons/Autres/stubs/companions-legacy-README.md',
    'old_assets/Compagnons/_archive/stubs/companions-legacy-README.md',
  )
}

function planFlattenArchives() {
  for (const bucket of ['Compagnons', 'Background', 'Myrions', 'Gacha', 'Live2D']) {
    walkFiles(join(OLD, bucket, '_archive'), (full) => {
      const r = rel(full)
      const flat = flattenArchiveTail(r)
      if (flat && flat !== r) plan(r, flat)
    })
  }
}

planReorganizeActive()

// Resolve conflicts: later plans win — dedupe by destination
const byDest = new Map()
for (const m of moves) {
  byDest.set(m.to, m.from)
}
const finalMoves = [...byDest.entries()].map(([to, from]) => ({ from, to }))

console.log(`${DRY ? 'DRY-RUN' : 'EXECUTE'}: ${finalMoves.length} moves`)

function execute() {
  let ok = 0
  let err = 0
  const sorted = [...finalMoves].sort((a, b) => b.from.length - a.from.length)
  for (const { from, to } of sorted) {
    const fromPath = join(ROOT, from)
    const toPath = join(ROOT, to)
    if (!existsSync(fromPath)) continue
    if (DRY) {
      ok++
      continue
    }
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
  return { ok, err }
}

if (DRY) {
  console.log('Sample:')
  for (const m of finalMoves.slice(0, 6)) console.log(`  ${m.from}\n    → ${m.to}`)
  if (finalMoves.length > 6) console.log(`  … +${finalMoves.length - 6}`)
} else {
  const { ok, err } = execute()
  writeFileSync(
    LOG,
    `\n---\n\n## Session 2026-06-25 — flatten old_assets architecture\n\nMoves: **${ok}** (${err} errors). Cible profondeur ≤4.\n`,
    { flag: 'a' },
  )
  console.log(JSON.stringify({ ok, err }))
}
