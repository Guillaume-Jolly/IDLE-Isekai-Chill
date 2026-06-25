#!/usr/bin/env node
/**
 * Remove duplicate Disagrea assets — keep canonical taxonomy paths.
 * Moves redundant copies to old_assets/ (never delete).
 *
 * Usage: node scripts/dedupe-disagrea-assets.mjs [--dry-run]
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const DRY = process.argv.includes('--dry-run')

const DISAGREA_IDS = ['etna', 'flonne', 'laharl', 'pleinair']

const INTEGRATED_FILES = [
  (id) => `companion-${id}-affinity-01-scene-originale-v1.png`,
  (id) => `companion-${id}-affinity-02-flirt-proche-scene-originale-v1.png`,
  (id) => `companion-${id}-affinity-03-vulnerable-complicite-scene-originale-v1.png`,
  (id) => `companion-${id}-affinity-04-intime-soft-scene-originale-v1.png`,
  (id) => `companion-${id}-affinity-05-peak-bond-scene-originale-v1.png`,
  (id) => `companion-${id}-affinity-04-nsfw-scene-v1.png`,
]

const MINIGAME_BG = [
  'myrion_hunt_mobile.png',
  'myrion_hunt_pc.png',
  'myrion_training_enclosure_mobile.png',
  'myrion_training_enclosure_pc.png',
]

const stats = { moved: 0, skipped: 0 }

function gitMv(fromRel, toRel) {
  const from = fromRel.replace(/\\/g, '/')
  const to = toRel.replace(/\\/g, '/')
  if (!existsSync(join(ROOT, from))) {
    stats.skipped++
    return
  }
  if (DRY) {
    console.log(`[dry-run] ${from} → ${to}`)
    stats.moved++
    return
  }
  mkdirSync(dirname(join(ROOT, to)), { recursive: true })
  try {
    execSync(`git mv -f "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
  } catch {
    renameSync(join(ROOT, from), join(ROOT, to))
  }
  stats.moved++
}

console.log(`Dedupe Disagrea assets${DRY ? ' (dry-run)' : ''}\n`)

for (const id of DISAGREA_IDS) {
  for (const fileFn of INTEGRATED_FILES) {
    const file = fileFn(id)
    const from = `assets/Compagnons/${id}/Autres/disagrea-integrated/${file}`
    const to = `old_assets/Compagnons/${id}/Autres/disagrea-integrated/${file}`
    gitMv(from, to)
  }
}

for (const file of MINIGAME_BG) {
  gitMv(
    `assets/Background/disagrea-event/minigame/${file}`,
    `old_assets/Background/disagrea-event/minigame/${file}`,
  )
}

console.log(JSON.stringify(stats, null, 2))
