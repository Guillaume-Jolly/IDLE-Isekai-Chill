/**
 * Importe les backgrounds portrait d'enclos Myrions vers public/assets/minigames/dressage/enclosures/.
 * Usage: node scripts/import-enclosure-portraits.mjs [dossier-zip-extrait]
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { publicMinigamePaths, repoRoot } from './minigame-asset-paths.mjs'

const importRoot = process.argv[2] ?? join(repoRoot, '.tmp/enclos-import')
const outDir = publicMinigamePaths.dressageEnclosures

const BIOME_FOLDERS = {
  '01_Prairie_Solaire': 'prairie-solaire',
  '01_Prairie_solaire': 'prairie-solaire',
  '02_Foret_Ancienne': 'foret-ancienne',
  '02_Foret_ancienne': 'foret-ancienne',
  '03_Marais_Brumeux': 'marais-brumeux',
  '03_Marais_brumeux': 'marais-brumeux',
  '04_Montagnes_Cristallines': 'montagnes-cristallines',
  '04_Montagnes_cristallines': 'montagnes-cristallines',
  '05_Desert_Rouge': 'desert-rouge',
  '05_Desert_rouge': 'desert-rouge',
  '06_Rivage_Corallien': 'rivage-corallien',
  '06_Rivage_corallien': 'rivage-corallien',
  '07_Volcan_Noir': 'volcan-noir',
  '07_Volcan_noir': 'volcan-noir',
  '08_Ruines_Astrales': 'ruines-astrales',
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

function findPortraitFile(dir, folderName) {
  const candidates = []

  if (existsSync(dir)) {
    for (const file of readdirSync(dir)) {
      if (file.toLowerCase().endsWith('.png')) {
        candidates.push(join(dir, file))
      }
    }
  }

  const rootFile = join(importRoot, `${folderName}_background.png`)
  if (existsSync(rootFile)) candidates.push(rootFile)

  return candidates[0] ?? null
}

mkdirSync(outDir, { recursive: true })

const manifestPath = join(importRoot, 'manifest.json')
const manifestEntries = existsSync(manifestPath)
  ? JSON.parse(readFileSync(manifestPath, 'utf8'))
  : []

const foldersFromManifest = manifestEntries.map((entry) => entry.folder)
const foldersFromFs = readdirSync(importRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)

const folders = [...new Set([...foldersFromManifest, ...foldersFromFs])].sort()

let copied = 0
let portraitWidth = 0
let portraitHeight = 0

for (const folder of folders) {
  const biomeId = resolveBiomeId(folder)
  if (!biomeId) continue

  const source = findPortraitFile(join(importRoot, folder), folder)
  if (!source) {
    console.warn(`Skip ${biomeId}: no portrait PNG in ${folder}`)
    continue
  }

  const outPath = join(outDir, `${biomeId}-portrait.png`)
  copyFileSync(source, outPath)

  const meta = await sharp(outPath).metadata()
  portraitWidth = meta.width ?? portraitWidth
  portraitHeight = meta.height ?? portraitHeight

  console.log(`OK ${biomeId}-portrait.png ← ${basename(source)} (${meta.width}x${meta.height})`)
  copied += 1
}

if (portraitWidth > 0 && portraitHeight > 0) {
  const ratio = portraitWidth / portraitHeight
  console.log(`Portrait ratio: ${portraitWidth}x${portraitHeight} (${ratio.toFixed(6)})`)
}

console.log(`Done: ${copied} portrait enclosure(s) → ${outDir}`)
