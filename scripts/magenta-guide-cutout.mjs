/**
 * Détourage guidé par contour magenta : le magenta bloque le flood depuis les bords.
 * Usage: node scripts/magenta-guide-cutout.mjs <input.png> [output.png]
 */
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import sharp from 'sharp'

function isMagenta(r, g, b, a) {
  if (a < 16) return false
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  if (max - min < 35) return false
  // Vrai magenta guide : fort rouge ET fort bleu, peu de vert (pas l'orange des cheveux)
  return r >= 140 && b >= 110 && g <= 120 && r > g + 35 && b > g + 35 && b >= r * 0.45
}

function sampleCorners(data, w, h) {
  const pts = [
    [2, 2],
    [w - 3, 2],
    [2, h - 3],
    [w - 3, h - 3],
    [Math.floor(w / 2), 2],
  ]
  return pts.map(([x, y]) => {
    const i = (y * w + x) * 4
    return [data[i], data[i + 1], data[i + 2]]
  })
}

function distRgb(r, g, b, sample) {
  return Math.max(
    Math.abs(r - sample[0]),
    Math.abs(g - sample[1]),
    Math.abs(b - sample[2]),
  )
}

function isForestBg(r, g, b, a, cornerSamples) {
  if (a < 8) return true
  for (const sample of cornerSamples) {
    if (distRgb(r, g, b, sample) <= 48) return true
  }
  return false
}

function dilateMask(mask, w, h, radius) {
  const out = Uint8Array.from(mask)
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const pi = y * w + x
      if (!mask[pi]) continue
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (dx * dx + dy * dy > radius * radius) continue
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          out[ny * w + nx] = 1
        }
      }
    }
  }
  return out
}

function floodOutside(wall, w, h) {
  const outside = new Uint8Array(w * h)
  const queue = []

  const tryPush = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const pi = y * w + x
    if (outside[pi] || wall[pi]) return
    outside[pi] = 1
    queue.push(pi)
  }

  for (let x = 0; x < w; x += 1) {
    tryPush(x, 0)
    tryPush(x, h - 1)
  }
  for (let y = 0; y < h; y += 1) {
    tryPush(0, y)
    tryPush(w - 1, y)
  }

  while (queue.length) {
    const pi = queue.pop()
    const x = pi % w
    const y = (pi - x) / w
    tryPush(x + 1, y)
    tryPush(x - 1, y)
    tryPush(x, y + 1)
    tryPush(x, y - 1)
  }

  return outside
}

function floodEnclosedForest(data, wall, outside, w, h, cornerSamples) {
  const remove = new Uint8Array(w * h)
  const queue = []

  for (let pi = 0; pi < w * h; pi += 1) {
    if (!wall[pi]) continue
    const x = pi % w
    const y = (pi - x) / w
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const npi = ny * w + nx
      if (outside[npi] || wall[npi] || remove[npi]) continue
      const ni = npi * 4
      if (isForestBg(data[ni], data[ni + 1], data[ni + 2], data[ni + 3], cornerSamples)) {
        remove[npi] = 1
        queue.push(npi)
      }
    }
  }

  while (queue.length) {
    const pi = queue.pop()
    const x = pi % w
    const y = (pi - x) / w
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx
      const ny = y + dy
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
      const npi = ny * w + nx
      if (outside[npi] || wall[npi] || remove[npi]) continue
      const ni = npi * 4
      if (isForestBg(data[ni], data[ni + 1], data[ni + 2], data[ni + 3], cornerSamples)) {
        remove[npi] = 1
        queue.push(npi)
      }
    }
  }

  return remove
}

function peelEdge(rgba, w, h, passes) {
  for (let iter = 0; iter < passes; iter += 1) {
    const copy = Uint8ClampedArray.from(rgba)
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const pi = y * w + x
        const i = pi * 4
        if (copy[i + 3] === 0) continue
        const r = copy[i]
        const g = copy[i + 1]
        const b = copy[i + 2]
        if (!isMagenta(r, g, b, copy[i + 3])) continue
        let nearTransparent = false
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ni = ((y + dy) * w + (x + dx)) * 4
          if (copy[ni + 3] < 32) nearTransparent = true
        }
        if (nearTransparent) rgba[i + 3] = 0
      }
    }
  }
}

async function cutout(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const corners = sampleCorners(rgba, w, h)

  const magenta = new Uint8Array(w * h)
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    if (isMagenta(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3])) {
      magenta[pi] = 1
    }
  }

  const wall = dilateMask(magenta, w, h, 3)
  const outside = floodOutside(wall, w, h)
  const enclosed = floodEnclosedForest(rgba, wall, outside, w, h, corners)

  for (let pi = 0; pi < w * h; pi += 1) {
    if (outside[pi] || wall[pi] || enclosed[pi]) {
      rgba[pi * 4 + 3] = 0
    }
  }

  peelEdge(rgba, w, h, 4)

  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(rgba), {
    raw: { width: w, height: h, channels: 4 },
  })
    .png()
    .toFile(outputPath)

  let kept = 0
  for (let pi = 0; pi < w * h; pi += 1) {
    if (rgba[pi * 4 + 3] > 0) kept += 1
  }
  console.log(`Output: ${outputPath}`)
  console.log(`Kept ${((kept / (w * h)) * 100).toFixed(1)}% of pixels`)
}

const input = process.argv[2]
const output = process.argv[3]
if (!input || !output) {
  console.error('Usage: node scripts/magenta-guide-cutout.mjs <input.png> <output.png>')
  process.exit(1)
}

await cutout(input, output)
