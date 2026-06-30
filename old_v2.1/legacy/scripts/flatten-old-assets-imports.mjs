#!/usr/bin/env node
/**
 * Flatten active old_assets paths (max depth 4) — imports + village-mirror.
 * Usage: node scripts/flatten-old-assets-imports.mjs [--execute]
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const DRY = !process.argv.includes('--execute')
const moves = []

function rel(full) {
  return full.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function plan(from, to) {
  if (from === to || !existsSync(join(ROOT, from))) return
  moves.push({ from, to })
}

function walk(d, handler) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name)
    if (e.isDirectory()) walk(f, handler)
    else handler(f)
  }
}

// village-mirror/village/buildings-map → village-mirror/buildings-map
walk(join(OLD, 'Background/village-mirror/village'), (full) => {
  const r = rel(full)
  const sub = r.replace('old_assets/Background/village-mirror/village/', '')
  plan(r, `old_assets/Background/village-mirror/${sub}`)
})

// Myrions: myrions-import/myrions_biomes_v2/{biome}/myrions/file → imports/biomes-v2/{biome}/myrions/file
walk(join(OLD, 'Myrions/imports/myrions-import/myrions_biomes_v2'), (full) => {
  const r = rel(full)
  const m = /myrions_biomes_v2\/([^/]+)\/(?:myrions|backgrounds)\/(.+)$/.exec(r)
  if (!m) return
  plan(r, `old_assets/Myrions/imports/biomes-v2/${m[1]}/${m[2]}`)
})

// Talia: myrions_chibis_individuels/{biome}/file → chibis-individuels/{biome}/file
walk(join(OLD, 'Compagnons/imports/talia-import/myrions_chibis_individuels'), (full) => {
  const r = rel(full)
  const sub = r.replace('old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/', '')
  plan(r, `old_assets/Compagnons/imports/chibis-individuels/${sub}`)
})

console.log(`${DRY ? 'DRY-RUN' : 'EXECUTE'}: ${moves.length} moves`)
if (DRY) {
  moves.slice(0, 8).forEach((m) => console.log(`  ${m.from}\n    → ${m.to}`))
  if (moves.length > 8) console.log(`  … +${moves.length - 8}`)
} else {
  let ok = 0
  for (const { from, to } of [...moves].sort((a, b) => b.from.length - a.from.length)) {
    const fromP = join(ROOT, from)
    const toP = join(ROOT, to)
    mkdirSync(dirname(toP), { recursive: true })
    try {
      const fromRel = from.replace(/\\/g, '/')
      const toRel = to.replace(/\\/g, '/')
      execSync(`git mv -f "${fromRel}" "${toRel}"`, { cwd: ROOT, stdio: 'pipe' })
      ok++
    } catch {
      renameSync(fromP, toP)
      ok++
    }
  }
  console.log(JSON.stringify({ ok }))
}
