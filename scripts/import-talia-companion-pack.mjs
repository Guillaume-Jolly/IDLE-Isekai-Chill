/**
 * Importe le pack Talia Myrion : detourage par biome + chibi miniature.
 * Usage: node scripts/import-talia-companion-pack.mjs [dossier-import]
 */
import { mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import {
  companionAssetPaths,
  guideCutoutAssetPaths,
  sourceMinigamePaths,
  taliaGuideFile,
} from './minigame-asset-paths.mjs'

const importRoot =
  process.argv[2] ?? sourceMinigamePaths.captureTaliaCompanionPack

const guidesDir = guideCutoutAssetPaths.root('talia')
const taliaChibiPath = companionAssetPaths.chibi('talia')

/** Fichiers du zip → ids biomes du jeu. */
const BIOME_POSES = {
  '01_marais.png': 'marais-brumeux',
  '02_prairie.png': 'prairie-solaire',
  '03_foret_enchantee.png': 'foret-ancienne',
  '04_montagne_cristal_glace.png': 'montagnes-cristallines',
  '05_desert_ruines.png': 'desert-rouge',
  '06_plage_tropicale.png': 'rivage-corallien',
  '07_volcan_lave.png': 'volcan-noir',
  '08_astral_celeste.png': 'ruines-astrales',
}

const CHIBI_FILE = '09_chibi.png'

function sampleKeyColor(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  const counts = new Map()
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4
    if (data[i + 3] < 8) continue
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  let best = [237, 11, 227]
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = key.split(',').map(Number)
    }
  }
  return best
}

function isMagentaKey(key) {
  return (
    key[0] >= 130 &&
    key[2] >= 100 &&
    key[1] <= 130 &&
    key[0] > key[1] + 28 &&
    key[2] > key[1] + 28
  )
}

function isNeutral(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b) < 32
}

function lightness(r, g, b) {
  return (r + g + b) / 3
}

function colorDist(r, g, b, r2, g2, b2) {
  return Math.max(Math.abs(r - r2), Math.abs(g - g2), Math.abs(b - b2))
}

function sampleEdgeColors(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  const samples = []
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4
    if (data[i + 3] >= 8) {
      samples.push([data[i], data[i + 1], data[i + 2]])
    }
  }
  return samples
}

function isEdgeBg(r, g, b, a, samples) {
  if (a < 8) return true
  if (isNeutral(r, g, b) && lightness(r, g, b) >= 176) return true
  for (const [sr, sg, sb] of samples) {
    if (colorDist(r, g, b, sr, sg, sb) > 40) continue
    const sl = lightness(sr, sg, sb)
    const pl = lightness(r, g, b)
    if (sl >= 145 && pl >= 145) return true
    if (sl <= 55 && pl <= 72) return true
  }
  return false
}

function floodEdges(data, w, h) {
  const samples = sampleEdgeColors(data, w, h)
  const visited = new Uint8Array(w * h)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const pi = y * w + x
    if (visited[pi]) return
    const i = pi * 4
    if (!isEdgeBg(data[i], data[i + 1], data[i + 2], data[i + 3], samples)) return
    visited[pi] = 1
    queue.push(pi)
  }

  for (let x = 0; x < w; x += 1) {
    push(x, 0)
    push(x, h - 1)
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y)
    push(w - 1, y)
  }

  while (queue.length) {
    const pi = queue.pop()
    const i = pi * 4
    data[i + 3] = 0
    const x = pi % w
    const y = (pi - x) / w
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
}

/** Echantillonne les hex reels du fond sur la bordure (pas une heuristique « magenta »). */
function sampleBorderPalette(data, w, h, border = 8, minCount = 80) {
  const counts = new Map()
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (x >= border && x < w - border && y >= border && y < h - border) continue
      const i = (y * w + x) * 4
      if (data[i + 3] < 8) continue
      const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(',').map(Number))
}

function matchesBorderPalette(r, g, b, palette, tolerance) {
  for (const [pr, pg, pb] of palette) {
    if (colorDist(r, g, b, pr, pg, pb) <= tolerance) return true
  }
  return false
}

/** Retire uniquement les pixels proches d'un hex present sur la bordure. */
function chromaKeyBorderPalette(rgba, w, h, palette, tolerance = 6) {
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    if (rgba[i + 3] < 8) continue
    if (matchesBorderPalette(rgba[i], rgba[i + 1], rgba[i + 2], palette, tolerance)) {
      rgba[i + 3] = 0
    }
  }
}

async function cutoutPng(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const key = sampleKeyColor(rgba, w, h)
  const hex = `#${key.map((v) => v.toString(16).padStart(2, '0')).join('')}`

  if (isMagentaKey(key)) {
    const palette = sampleBorderPalette(rgba, w, h)
    chromaKeyBorderPalette(rgba, w, h, palette, 6)
    const top = palette[0]?.map((v) => v.toString(16).padStart(2, '0')).join('') ?? '??????'
    console.log(`  border hex palette #${top} +${palette.length - 1} tol=6`)
  } else {
    floodEdges(rgba, w, h)
    console.log(`  flood bg ${hex}`)
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(rgba), {
    raw: { width: w, height: h, channels: 4 },
  })
    .trim()
    .png()
    .toFile(outputPath)
}

mkdirSync(guidesDir, { recursive: true })
mkdirSync(taliaDir, { recursive: true })

const files = readdirSync(importRoot).filter((name) => name.endsWith('.png'))
let defaultGuide = null

for (const [fileName, biomeId] of Object.entries(BIOME_POSES)) {
  if (!files.includes(fileName)) {
    console.warn(`Missing ${fileName}`)
    continue
  }
  const input = join(importRoot, fileName)
  const output = join(guidesDir, taliaGuideFile(biomeId))
  console.log(`Guide ${biomeId}`)
  await cutoutPng(input, output)
  if (biomeId === 'prairie-solaire') {
    defaultGuide = output
  }
}

if (defaultGuide) {
  const fallback = join(guidesDir, 'point.png')
  await sharp(defaultGuide).png().toFile(fallback)
  console.log('Default point.png')
}

const chibiInput = join(importRoot, CHIBI_FILE)
if (files.includes(CHIBI_FILE)) {
  console.log('Chibi')
  await cutoutPng(chibiInput, taliaChibiPath)
  console.log('  -> assets/Compagnons/talia/chibis/chibi.png')
} else {
  console.warn(`Missing ${CHIBI_FILE}`)
}

console.log('Done — Talia companion pack imported.')
