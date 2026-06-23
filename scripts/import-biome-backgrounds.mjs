/**
 * Copie les backgrounds biome paysage (1672x941) vers public/assets/minigames/capture/biomes/.
 * Usage: node scripts/import-biome-backgrounds.mjs [dossier-Talia]
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { publicMinigamePaths } from './minigame-asset-paths.mjs'

const importRoot = process.argv[2] ?? 'C:/Users/guill/Downloads/Slow life isekai/Talia'
const outDir = publicMinigamePaths.captureBiomes

const BIOME_FOLDERS = {
  '01_Prairie_solaire': 'prairie-solaire',
  '02_Foret_ancienne': 'foret-ancienne',
  '03_Marais_brumeux': 'marais-brumeux',
  '04_Montagnes_cristallines': 'montagnes-cristallines',
  '05_Desert_rouge': 'desert-rouge',
  '06_Rivage_corallien': 'rivage-corallien',
  '07_Volcan_noir': 'volcan-noir',
  '08_Ruines_astrales': 'ruines-astrales',
}

function normalizeKey(name) {
  return name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/_/g, '_')
    .toLowerCase()
}

function resolveBiomeId(folderName) {
  if (BIOME_FOLDERS[folderName]) return BIOME_FOLDERS[folderName]
  const norm = normalizeKey(folderName)
  for (const [key, id] of Object.entries(BIOME_FOLDERS)) {
    if (normalizeKey(key) === norm) return id
  }
  return null
}

async function pickLandscapeBackground(bgDir) {
  const files = readdirSync(bgDir)
    .filter((file) => file.toLowerCase().endsWith('.png'))
    .map((file) => join(bgDir, file))

  let best = null
  for (const file of files) {
    const meta = await sharp(file).metadata()
    const width = meta.width ?? 0
    const height = meta.height ?? 1
    const ratio = width / height
    if (width >= height && (!best || ratio > best.ratio)) {
      best = { file, width, height, ratio }
    }
  }

  return best
}

mkdirSync(outDir, { recursive: true })

const entries = readdirSync(importRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

let copied = 0

for (const folder of entries) {
  const biomeId = resolveBiomeId(folder)
  if (!biomeId) continue

  const bgDir = join(importRoot, folder, 'backgrounds')
  if (!existsSync(bgDir)) {
    console.warn(`Skip ${biomeId}: no backgrounds/ folder`)
    continue
  }

  const picked = await pickLandscapeBackground(bgDir)
  if (!picked) {
    console.warn(`Skip ${biomeId}: no landscape PNG found`)
    continue
  }

  const dest = join(outDir, `${biomeId}.png`)
  await sharp(picked.file).png().toFile(dest)
  console.log(`OK ${biomeId} ← ${basename(picked.file)} (${picked.width}x${picked.height})`)

  const portraitDest = join(outDir, `${biomeId}-portrait.png`)
  const cropWidth = Math.min(
    picked.width,
    Math.max(1, Math.round(picked.height * (9 / 16))),
  )
  const left = Math.max(0, Math.round((picked.width - cropWidth) / 2))
  await sharp(picked.file)
    .extract({ left, top: 0, width: cropWidth, height: picked.height })
    .png()
    .toFile(portraitDest)
  console.log(`OK ${biomeId}-portrait ← center crop ${cropWidth}x${picked.height}`)
  copied += 1
}

console.log(`Done: ${copied} biome background(s).`)
