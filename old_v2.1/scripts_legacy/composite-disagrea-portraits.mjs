/**
 * @deprecated One-shot Disagrea composite portraits (2026-03). Outputs in assets/Compagnons/*/Autres/.
 * Détoure cutouts Disagrea (#CFCFCF) + superpose sur backgrounds affinité → PNG composé.
 *
 * Usage:
 *   node scripts/composite-disagrea-portraits.mjs --premier-jet     # L1 × 4 compagnons
 *   node scripts/composite-disagrea-portraits.mjs --all             # L1–5 × 4 (20 images)
 *   node scripts/composite-disagrea-portraits.mjs etna 3            # un palier
 *   node scripts/composite-disagrea-portraits.mjs etna              # L1–5 Etna
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { repoRoot } from './minigame-asset-paths.mjs'

const eventRoot = join(repoRoot, 'assets', 'event-disagrea')
const generatedRoot = join(eventRoot, 'generated', 'companions')
const backgroundsRoot = join(eventRoot, 'backgrounds', 'affinity')
const outputRoot = join(eventRoot, 'composites')

const COMPANIONS = ['etna', 'flonne', 'laharl', 'pleinair']

const AFFINITY_FOLDER = {
  etna: 'Etna',
  flonne: 'Flonne',
  laharl: 'Laharl',
  pleinair: 'Pleinair',
}

const LEVEL_SLUG = {
  1: 'rencontre-tenue-base',
  2: 'rendez-vous-flirt',
  3: 'complicite-vulnerable',
  4: 'intime-soft',
  5: 'peak-bond',
}

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
  let best = [207, 207, 207]
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = key.split(',').map(Number)
    }
  }
  return best
}

function colorDist(r, g, b, r2, g2, b2) {
  return Math.max(Math.abs(r - r2), Math.abs(g - g2), Math.abs(b - b2))
}

function isNeutral(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b) < 32
}

function lightness(r, g, b) {
  return (r + g + b) / 3
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

async function cutoutBuffer(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const key = sampleKeyColor(rgba, w, h)

  // 1) Flood depuis les bords (fond connecté)
  floodEdges(rgba, w, h)

  // 2) Chroma key gris #CFCFCF résiduel (halo, trous dans cheveux)
  const tolerance = 36
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    if (rgba[i + 3] < 8) continue
    const r = rgba[i]
    const g = rgba[i + 1]
    const b = rgba[i + 2]
    if (isNeutral(r, g, b) && colorDist(r, g, b, key[0], key[1], key[2]) <= tolerance) {
      rgba[i + 3] = 0
    }
  }

  return sharp(Buffer.from(rgba), {
    raw: { width: w, height: h, channels: 4 },
  })
    .trim()
    .png()
    .toBuffer()
}

function backgroundPath(companionId, level, variant = 'mobile') {
  const folder = AFFINITY_FOLDER[companionId]
  const group = level <= 3 ? '01_03' : '04_05'
  const suffix = variant === 'pc' ? 'pc' : 'mobile'
  return join(backgroundsRoot, folder, `${folder}_affinity_${group}_${suffix}.png`)
}

function outputPath(companionId, level, variant, batchFolder) {
  const lv = String(level).padStart(2, '0')
  const slug = LEVEL_SLUG[level]
  const bgGroup = level <= 3 ? 'bg-affinite-01-03' : 'bg-affinite-04-05-intime'
  const format = variant === 'pc' ? 'pc-wide' : 'mobile-portrait'
  const name = `companion-${companionId}-affinity-${lv}-${slug}-${bgGroup}-${format}-composite.png`
  return join(outputRoot, batchFolder, companionId, name)
}

async function compositeOne(companionId, level, { variant = 'mobile', batchFolder = 'mobile' } = {}) {
  const cutoutSrc = join(generatedRoot, companionId, `cutout-${level}.png`)
  const bgSrc = backgroundPath(companionId, level, variant)
  const dest = outputPath(companionId, level, variant, batchFolder)

  if (!existsSync(cutoutSrc)) {
    console.warn(`Skip ${companionId} L${level}: missing cutout`)
    return false
  }
  if (!existsSync(bgSrc)) {
    console.warn(`Skip ${companionId} L${level}: missing background`)
    return false
  }

  const cutoutBuf = await cutoutBuffer(cutoutSrc)

  const bgMeta = await sharp(bgSrc).metadata()
  const bgW = bgMeta.width ?? 941
  const bgH = bgMeta.height ?? 1672

  const bottomPad = Math.round(bgH * 0.04)
  const maxCutH = bgH - bottomPad - Math.round(bgH * 0.08)

  let targetW = Math.round(bgW * 0.78)
  let scaledCutout = await sharp(cutoutBuf)
    .resize(targetW, null, { fit: 'inside' })
    .png()
    .toBuffer()

  let scaledMeta = await sharp(scaledCutout).metadata()
  let cutW = scaledMeta.width ?? targetW
  let cutH = scaledMeta.height ?? targetW

  if (cutH > maxCutH) {
    scaledCutout = await sharp(cutoutBuf)
      .resize(null, maxCutH, { fit: 'inside' })
      .png()
      .toBuffer()
    scaledMeta = await sharp(scaledCutout).metadata()
    cutW = scaledMeta.width ?? targetW
    cutH = scaledMeta.height ?? maxCutH
  }

  const left = Math.round((bgW - cutW) / 2)
  const top = Math.max(0, bgH - cutH - bottomPad)

  mkdirSync(dirname(dest), { recursive: true })

  await sharp(bgSrc)
    .composite([{ input: scaledCutout, left, top }])
    .png()
    .toFile(dest)

  console.log(`OK ${companionId} L${level} → ${dest.replace(repoRoot + '\\', '').replace(repoRoot + '/', '')}`)
  return true
}

const args = process.argv.slice(2)
let ok = 0

async function runBatch(companionIds, levels, options) {
  let count = 0
  for (const id of companionIds) {
    for (const level of levels) {
      if (await compositeOne(id, level, options)) count += 1
    }
  }
  return count
}

if (args[0] === '--premier-jet') {
  ok = await runBatch(COMPANIONS, [1], { batchFolder: 'premier-jet' })
} else if (args[0] === '--all') {
  ok = await runBatch(COMPANIONS, [1, 2, 3, 4, 5], { batchFolder: 'mobile' })
} else if (args.length >= 2) {
  if (await compositeOne(args[0], Number(args[1]))) ok += 1
} else if (args.length === 1 && COMPANIONS.includes(args[0])) {
  ok = await runBatch([args[0]], [1, 2, 3, 4, 5], { batchFolder: 'mobile' })
} else {
  console.error('Usage: --premier-jet | --all | <companion> [level]')
  process.exit(1)
}

console.log(`Done: ${ok} composite(s).`)
