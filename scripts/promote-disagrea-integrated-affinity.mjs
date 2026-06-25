#!/usr/bin/env node
/**
 * Remplace les anciens cutout+background Disagrea par les portraits intégrés L1–L5.
 *
 * Source : assets/event-disagrea/integrated/companions/{id}/
 * Cible  : public/assets/companions/{id}/affinity-{1-5}.png
 * Archive: old_assets/event-disagrea/public-layered-legacy/{id}/
 *
 * Usage: node scripts/promote-disagrea-integrated-affinity.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { oldAssetsRoot } from './minigame-asset-paths.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DISAGREA_IDS = ['etna', 'flonne', 'laharl', 'pleinair']

const AFFINITY_LEVELS = [
  { level: 1, integratedFilename: (id) => `companion-${id}-affinity-01-scene-originale-v1.png` },
  {
    level: 2,
    integratedFilename: (id) => `companion-${id}-affinity-02-flirt-proche-scene-originale-v1.png`,
  },
  {
    level: 3,
    integratedFilename: (id) =>
      `companion-${id}-affinity-03-vulnerable-complicite-scene-originale-v1.png`,
  },
  {
    level: 4,
    integratedFilename: (id) => `companion-${id}-affinity-04-intime-soft-scene-originale-v1.png`,
  },
  {
    level: 5,
    integratedFilename: (id) => `companion-${id}-affinity-05-peak-bond-scene-originale-v1.png`,
  },
]

const LEGACY_PATTERNS = [
  /^cutout-\d+\.png$/,
  /^background-\d+\.png$/,
  /^background-\d+-wide\.png$/,
]

const archiveRoot = join(oldAssetsRoot, 'event-disagrea', 'public-layered-legacy')
const integratedRoot = join(ROOT, 'assets', 'event-disagrea', 'integrated', 'companions')
const publicRoot = join(ROOT, 'public', 'assets', 'companions')

function archiveLegacyFiles(companionId) {
  const srcDir = join(publicRoot, companionId)
  const destDir = join(archiveRoot, companionId)
  if (!existsSync(srcDir)) return 0
  let moved = 0
  for (const file of readdirSync(srcDir)) {
    if (!LEGACY_PATTERNS.some((re) => re.test(file))) continue
    mkdirSync(destDir, { recursive: true })
    renameSync(join(srcDir, file), join(destDir, file))
    console.log(`  archive ${companionId}/${file}`)
    moved += 1
  }
  return moved
}

let promoted = 0
let archived = 0

for (const id of DISAGREA_IDS) {
  console.log(`\n${id}`)
  archived += archiveLegacyFiles(id)

  for (const { level, integratedFilename } of AFFINITY_LEVELS) {
    const src = join(integratedRoot, id, integratedFilename(id))
    const dest = join(publicRoot, id, `affinity-${level}.png`)
    if (!existsSync(src)) {
      console.warn(`  missing ${src}`)
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(src, dest)
    console.log(`  ✓ affinity-${level}.png`)
    promoted += 1
  }

  const nsfwSrc = join(integratedRoot, id, `companion-${id}-affinity-04-nsfw-scene-v1.png`)
  const nsfwDest = join(publicRoot, id, 'affinity-4-nsfw.png')
  if (existsSync(nsfwSrc)) {
    copyFileSync(nsfwSrc, nsfwDest)
    console.log('  ✓ affinity-4-nsfw.png')
    promoted += 1
  }
}

console.log(`\nDone — ${promoted} fichiers promus, ${archived} legacy archivés.`)
