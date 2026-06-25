#!/usr/bin/env node
/**
 * Importe les frames gacha Disagrea depuis Input chatgpt → assets + public.
 *
 * Usage: node scripts/import-disagrea-gacha-cinema.mjs
 */
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const INPUT_DIR = join(ROOT, 'Input chatgpt', 'etna_gacha_8_images_pack')
const ASSETS_DIR = join(ROOT, 'assets', 'Gacha', 'cinema', 'disagrea')
const PUBLIC_DIR = join(ROOT, 'assets', 'Gacha', 'cinema', 'disagrea')

/** Source ChatGPT → nom canonique */
const FRAME_MAP = [
  ['01_Etna_Invocation_Start_Alt.png', 'start.png'],
  ['02_Etna_Base_Start.png', 'intermediate.png'],
  ['03_Etna_Flash_N_Purple.png', 'reveal-n.png'],
  ['04_Etna_Flash_SR_Purple.png', 'reveal-sr.png'],
  ['05_Etna_Flash_SSR_Yellow.png', 'reveal-ssr.png'],
  ['06_Etna_Flash_UR_Red.png', 'reveal-ur.png'],
  ['07_Etna_Flash_LR_Gold.png', 'reveal-lr.png'],
  ['08_Etna_Flash_Multi_invoc_Rainbow.png', 'reveal-multi.png'],
]

async function normalizeCopy(src, dest) {
  mkdirSync(dirname(dest), { recursive: true })
  await sharp(src)
    .rotate()
    .resize(720, 960, { fit: 'cover' })
    .png({ compressionLevel: 8 })
    .toFile(dest)
}

mkdirSync(ASSETS_DIR, { recursive: true })
mkdirSync(PUBLIC_DIR, { recursive: true })

let imported = 0
for (const [sourceName, targetName] of FRAME_MAP) {
  const src = join(INPUT_DIR, sourceName)
  if (!existsSync(src)) {
    console.warn(`Missing ${src}`)
    continue
  }
  const assetDest = join(ASSETS_DIR, targetName)
  const publicDest = join(PUBLIC_DIR, targetName)
  await normalizeCopy(src, assetDest)
  await normalizeCopy(src, publicDest)
  console.log(`✓ ${targetName}`)
  imported += 1
}

const manifest = {
  event: 'disagrea',
  source: 'Input chatgpt/etna_gacha_8_images_pack',
  frames: {
    start: 'start.png',
    intermediate: 'intermediate.png',
    reveals: {
      N: 'reveal-n.png',
      SR: 'reveal-sr.png',
      SSR: 'reveal-ssr.png',
      UR: 'reveal-ur.png',
      LR: 'reveal-lr.png',
      multi: 'reveal-multi.png',
    },
  },
  sequence: ['start', 'intermediate', 'reveal'],
  note: 'Diaporama JS : départ → intermédiaire → flash rareté (ou multi). Vidéo plus tard via build:disagrea-gacha-video.',
}

writeFileSync(join(ROOT, 'assets', 'Gacha', 'event', 'disagrea', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`\n${imported}/${FRAME_MAP.length} frames → assets/Gacha/cinema/disagrea (+ manifest in assets/Gacha/event/disagrea/)`)
