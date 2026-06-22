/**
 * Retire un fond uni (chroma key) et produit cutout + silhouette.
 * Usage: node scripts/chroma-cutout.mjs <input.png> [output-cutout.png] [output-silhouette.png]
 */
import { mkdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function sampleKeyColor(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
  ]
  const samples = pts.map(([x, y]) => {
    const i = (y * w + x) * 4
    return [data[i], data[i + 1], data[i + 2]]
  })
  return samples[0]
}

function chromaMask(data, w, h, key, tolerance) {
  const mask = new Uint8Array(w * h)
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    const dist = Math.max(Math.abs(r - key[0]), Math.abs(g - key[1]), Math.abs(b - key[2]))
    mask[pi] = a >= 8 && dist > tolerance ? 1 : 0
  }
  return mask
}

async function chromaCutout(inputPath, cutoutPath, silhouettePath, tolerance = 50) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const key = sampleKeyColor(rgba, info.width, info.height)
  const mask = chromaMask(rgba, info.width, info.height, key, tolerance)

  const cut = new Uint8ClampedArray(rgba.length)
  const sil = new Uint8ClampedArray(rgba.length)
  for (let pi = 0; pi < info.width * info.height; pi += 1) {
    const i = pi * 4
    if (mask[pi]) {
      cut[i] = rgba[i]
      cut[i + 1] = rgba[i + 1]
      cut[i + 2] = rgba[i + 2]
      cut[i + 3] = 255
      sil[i] = 18
      sil[i + 1] = 18
      sil[i + 2] = 28
      sil[i + 3] = 255
    }
  }

  mkdirSync(dirname(cutoutPath), { recursive: true })
  await sharp(Buffer.from(cut), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(cutoutPath)

  await sharp(Buffer.from(sil), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(silhouettePath)

  console.log(`Key: rgb(${key.join(', ')}) tolerance=${tolerance}`)
  console.log(`Cutout: ${cutoutPath}`)
  console.log(`Silhouette: ${silhouettePath}`)
}

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/chroma-cutout.mjs <input.png>')
  process.exit(1)
}

const base = input.replace(/\.[^.]+$/, '')
const cutout = process.argv[3] ?? `${base}-cutout.png`
const silhouette = process.argv[4] ?? `${base}-silhouette.png`

await chromaCutout(input, cutout, silhouette)
