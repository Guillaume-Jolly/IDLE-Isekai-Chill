/**
 * Retire le fond blanc/noir connecte aux bords — sans toucher l interieur.
 * Usage: node scripts/prepare-cutout-png.mjs [fichier...]
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { guideCutoutAssetPaths, oldAssetPaths } from './minigame-asset-paths.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

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

async function prepareCutout(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  floodEdges(rgba, info.width, info.height)

  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(rgba), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(outputPath)

  console.log(`OK ${outputPath}`)
}

const defaults = [
  join(oldAssetPaths.sourcesScattered, 'source-talia-v2.png'),
  join(oldAssetPaths.sourcesScattered, 'source-moon-sprout-v2.png'),
]

const inputs = process.argv.length > 2 ? process.argv.slice(2) : defaults

for (const input of inputs) {
  let output = input
  if (input.includes('source-talia')) {
    output = guideCutoutAssetPaths.file('talia', 'point.png')
  }
  await prepareCutout(input, output)
}
