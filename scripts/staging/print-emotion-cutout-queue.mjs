#!/usr/bin/env node
/**
 * Jobs cutout v3 en attente.
 * Usage: node scripts/staging/print-emotion-cutout-queue.mjs [companionId]
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ALL_CUTOUT_COMPANION_IDS,
  cutoutOutputPath,
  cutoutPrompt,
  cutoutStyleAnchor,
} from '../staging/companion-visual-pack-data.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const EMOTIONS = JSON.parse(
  readFileSync(join(ROOT, 'staging/companion-visual-pack/data/emotions.json'), 'utf8'),
).emotions

const filter = process.argv[2]
const ids = filter ? [filter] : ALL_CUTOUT_COMPANION_IDS

for (const id of ids) {
  const pending = EMOTIONS.filter(
    (em) => !existsSync(join(ROOT, cutoutOutputPath(id, em.id, 'v3'))),
  )
  if (pending.length === 0) {
    console.log(`✓ ${id} — all v3 cutouts present`)
    continue
  }
  console.log(`\n${'='.repeat(60)}`)
  console.log(`${id.toUpperCase()} — ${pending.length} pending`)
  console.log(`Anchor: ${cutoutStyleAnchor(id)}`)
  console.log('='.repeat(60))
  for (const em of pending) {
    console.log(`\n--- ${em.id} ---`)
    console.log(cutoutPrompt(id, em.prompt))
  }
}
