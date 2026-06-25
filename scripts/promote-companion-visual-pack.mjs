#!/usr/bin/env node
/**
 * Promotion staging/companion-visual-pack → prod (assets/Compagnons/).
 *
 * Usage: node scripts/promote-companion-visual-pack.mjs
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromaKeyPng } from './chroma-key-png.mjs'
import { companionAssetPaths, repoRoot } from './minigame-asset-paths.mjs'
import { VILLAGE_CHIBI_IDS, VILLAGE_COMPANIONS } from './staging/companion-visual-pack-data.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = repoRoot
const STAGING = join(ROOT, 'staging/companion-visual-pack')
const ASSETS_BG = join(ROOT, 'assets/Background/disagrea-event')

const DISAGREA_IDS = ['etna', 'flonne', 'laharl', 'pleinair']
const VILLAGE_IDS = Object.keys(VILLAGE_COMPANIONS)
const ALL_COMPANION_IDS = [...VILLAGE_IDS, ...DISAGREA_IDS]

const EMOTIONS = JSON.parse(
  readFileSync(join(STAGING, 'data/emotions.json'), 'utf8'),
).emotions.map((e) => e.id)

const stats = { emotions: 0, chibis: 0, nsfwIntegrated: 0, backgroundsSynced: 0 }
const promoted = []
const leftovers = []

function rel(p) {
  return p.replace(/\\/g, '/').replace(`${ROOT.replace(/\\/g, '/')}/`, '')
}

function noteLeftover(path, reason) {
  leftovers.push({ path: rel(path), reason })
}

async function promoteEmotionCutouts() {
  for (const id of ALL_COMPANION_IDS) {
    const pack = DISAGREA_IDS.includes(id) ? 'disagrea' : 'village'
    for (const emotion of EMOTIONS) {
      const src = join(
        STAGING,
        pack,
        id,
        'cutouts',
        `companion-${id}-emotion-${emotion}-cutout-v2.png`,
      )
      const dest = companionAssetPaths.emotion(id, emotion)
      mkdirSync(dirname(dest), { recursive: true })
      if (!existsSync(src)) {
        noteLeftover(src, 'Cutout émotion manquant en staging')
        continue
      }
      await chromaKeyPng(src, dest)
      unlinkSync(src)
      promoted.push(rel(dest))
      stats.emotions += 1
    }
  }
}

async function promoteChibis() {
  for (const id of VILLAGE_CHIBI_IDS) {
    const src = join(STAGING, 'village', id, 'chibi', `companion-${id}-chibi-v1.png`)
    const dest = companionAssetPaths.chibi(id)
    mkdirSync(dirname(dest), { recursive: true })
    if (!existsSync(src)) {
      noteLeftover(src, 'Chibi manquant en staging')
      continue
    }
    await chromaKeyPng(src, dest)
    unlinkSync(src)
    promoted.push(rel(dest))
    stats.chibis += 1
  }
}

function nsfwStagingSource(id) {
  if (id === 'etna') {
    const litValidated = join(
      STAGING,
      'disagrea',
      'etna',
      'tests',
      'companion-etna-affinity-05-lit-batch5-v5-v4-final-tweak.png',
    )
    if (existsSync(litValidated)) return litValidated
  }
  return join(
    STAGING,
    'disagrea',
    id,
    'integrated',
    `companion-${id}-affinity-06-peak-plus-scene-v1.png`,
  )
}

function promoteNsfwIntegrated() {
  for (const id of DISAGREA_IDS) {
    const src = nsfwStagingSource(id)
    const dest = companionAssetPaths.disagreaIntegrated(
      id,
      `companion-${id}-affinity-04-nsfw-scene-v1.png`,
    )
    if (!existsSync(src)) {
      noteLeftover(src, 'Scène L6 / peak-plus manquante en staging')
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    copyFileSync(src, dest)
    unlinkSync(src)
    promoted.push(rel(dest))
    stats.nsfwIntegrated += 1
  }
}

const AFFINITY_FOLDER = {
  etna: 'Etna',
  flonne: 'Flonne',
  laharl: 'Laharl',
  pleinair: 'Pleinair',
}

function syncDisagreaBackgrounds() {
  for (const id of DISAGREA_IDS) {
    const folder = AFFINITY_FOLDER[id]
    const stagingDir = join(STAGING, 'disagrea', id, 'backgrounds')
    const assetDir = join(ASSETS_BG, 'affinity', folder)
    mkdirSync(assetDir, { recursive: true })

    for (const file of [
      `${folder}_affinity_01_03_mobile.png`,
      `${folder}_affinity_01_03_pc.png`,
      `${folder}_affinity_04_05_mobile.png`,
      `${folder}_affinity_04_05_pc.png`,
    ]) {
      const src = join(stagingDir, file)
      const dest = join(assetDir, file)
      if (!existsSync(src)) continue
      if (!existsSync(dest)) {
        copyFileSync(src, dest)
        stats.backgroundsSynced += 1
        promoted.push(rel(dest))
      }
      unlinkSync(src)
    }
  }

  const minigameStaging = join(STAGING, 'disagrea/_shared/minigame')
  const minigameAssets = join(ASSETS_BG, 'minigame')
  mkdirSync(minigameAssets, { recursive: true })
  for (const file of [
    'myrion_hunt_mobile.png',
    'myrion_hunt_pc.png',
    'myrion_training_enclosure_mobile.png',
    'myrion_training_enclosure_pc.png',
  ]) {
    const src = join(minigameStaging, file)
    const dest = join(minigameAssets, file)
    if (!existsSync(src)) continue
    if (!existsSync(dest)) {
      copyFileSync(src, dest)
      stats.backgroundsSynced += 1
      promoted.push(rel(dest))
    }
    unlinkSync(src)
  }
}

function scanEtnaTests() {
  const testsDir = join(STAGING, 'disagrea/etna/tests')
  if (!existsSync(testsDir)) return
  for (const file of readdirSafe(testsDir)) {
    if (!file.endsWith('.png')) continue
    noteLeftover(
      join(testsDir, file),
      'Itération L5 « lit » Etna — non validée pour prod (exploration / choix final batch5-v5 non promu)',
    )
  }
}

function readdirSafe(dir) {
  try {
    return readdirSync(dir)
  } catch {
    return []
  }
}

function updateValidatedManifest() {
  const manifestPath = join(ROOT, 'assets/event-disagrea/integrated/VALIDATED_MANIFEST.json')
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  for (const id of DISAGREA_IDS) {
    const entry = `Compagnons/${id}/Autres/disagrea-integrated/companion-${id}-affinity-04-nsfw-scene-v1.png`
    if (!manifest.files.includes(entry)) manifest.files.push(entry)
  }
  manifest.count = manifest.files.length
  manifest.nsfwNote =
    'affinity-04-nsfw = scènes intégrées peak-plus (ex-L6). Affichées uniquement si option NSFW activée.'
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
}

function writeLeftoversReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    promotedCount: promoted.length,
    stats,
    leftovers,
  }
  writeFileSync(
    join(STAGING, 'data/PROMOTION_LEFTOVERS.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  )
  return report
}

console.log('Promotion companion-visual-pack → prod\n')
await promoteEmotionCutouts()
await promoteChibis()
promoteNsfwIntegrated()
syncDisagreaBackgrounds()
scanEtnaTests()
updateValidatedManifest()

const report = writeLeftoversReport()
console.log(`✓ ${stats.emotions} cutouts émotion`)
console.log(`✓ ${stats.chibis} chibis village`)
console.log(`✓ ${stats.nsfwIntegrated} scènes affinity-04-nsfw (ex-L6)`)
console.log(`✓ ${stats.backgroundsSynced} backgrounds sync (si manquants)`)
console.log(`\n${leftovers.length} fichiers restants → staging/companion-visual-pack/data/PROMOTION_LEFTOVERS.json`)
