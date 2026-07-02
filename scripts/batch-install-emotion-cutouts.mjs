#!/usr/bin/env node
/**
 * Installe tous les cutouts staging v3 manquants pour les émotions v2 (18).
 * Usage: node scripts/batch-install-emotion-cutouts.mjs [companionId ...]
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  ALL_CUTOUT_COMPANION_IDS,
  cutoutOutputPath,
  listEmotions,
} from './staging/companion-visual-pack-data.mjs'
import { companionAssetPaths, repoRoot } from './minigame-asset-paths.mjs'

const ids = process.argv.slice(2).length > 0 ? process.argv.slice(2) : ALL_CUTOUT_COMPANION_IDS
const emotions = listEmotions()
let installed = 0
let skipped = 0
let missing = 0

for (const companionId of ids) {
  console.log(`\n${companionId}`)
  for (const emotion of emotions) {
    const dest = companionAssetPaths.emotion(companionId, emotion.id)
    if (existsSync(dest)) {
      skipped += 1
      continue
    }
    const staging = join(repoRoot, cutoutOutputPath(companionId, emotion.id, 'v3'))
    if (!existsSync(staging)) {
      console.log(`  ○ missing staging ${emotion.id}`)
      missing += 1
      continue
    }
    const result = spawnSync(process.execPath, ['scripts/install-emotion-cutout.mjs', companionId, emotion.id, staging], {
      cwd: repoRoot,
      stdio: 'inherit',
    })
    if (result.status === 0) installed += 1
  }
}

console.log(`\n✓ installés ${installed}, déjà présents ${skipped}, staging manquant ${missing}`)
