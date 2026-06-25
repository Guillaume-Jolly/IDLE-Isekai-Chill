/**
 * Importe les chibis Myrions individuels : détourage propre + export PNG transparent.
 * Usage: node scripts/import-myrions-chibis.mjs [dossier-import]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { myrionAssetPaths, repoRoot, sourceMinigamePaths } from './minigame-asset-paths.mjs'

const importRoot = process.argv[2] ?? sourceMinigamePaths.dressageChibi
const catalogPath = join(repoRoot, 'src/data/myrionsCatalog.generated.ts')
const PADDING = 12

const BIOME_FOLDERS = {
  '01_Prairie_Solaire': 'prairie-solaire',
  '02_Foret_Ancienne': 'foret-ancienne',
  '03_Marais_Brumeux': 'marais-brumeux',
  '04_Montagnes_Cristallines': 'montagnes-cristallines',
  '05_Desert_Rouge': 'desert-rouge',
  '06_Rivage_Corallien': 'rivage-corallien',
  '07_Volcan_Noir': 'volcan-noir',
  '08_Ruines_Astrales': 'ruines-astrales',
}

function loadSpeciesCatalog() {
  const raw = readFileSync(catalogPath, 'utf8')
  const block = raw.match(/export const MYRIONS_SPECIES = (\[[\s\S]*?\]) as const/)?.[1]
  if (!block) throw new Error('MYRIONS_SPECIES introuvable dans le catalogue')
  return JSON.parse(block.replace(/(\w+):/g, '"$1":').replace(/'/g, "'"))
}

function normalizeKey(value) {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/_/g, ' ')
    .toLowerCase()
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/_/g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function colorDist(r, g, b, r2, g2, b2) {
  return Math.max(Math.abs(r - r2), Math.abs(g - g2), Math.abs(b - b2))
}

function sampleBorderPalette(data, w, h, border = 6) {
  const counts = new Map()
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (x >= border && x < w - border && y >= border && y < h - border) continue
      const i = (y * w + x) * 4
      const a = data[i + 3]
      if (a < 8) continue
      const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 48)
    .map(([key]) => key.split(',').map(Number))
}

function matchesPalette(r, g, b, palette, tolerance) {
  for (const [pr, pg, pb] of palette) {
    if (colorDist(r, g, b, pr, pg, pb) <= tolerance) return true
  }
  return false
}

function isCyanScreen(r, g, b) {
  return r <= 48 && g >= 188 && b >= 188
}

function isLightNeutral(r, g, b) {
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  return min >= 188 && max - min <= 18
}

function isBackgroundPixel(r, g, b, a, palette, paletteTol) {
  if (a < 20) return true
  if (matchesPalette(r, g, b, palette, paletteTol)) return true
  if (isCyanScreen(r, g, b)) return true
  if (isLightNeutral(r, g, b)) return true
  return false
}

function floodBackgroundMask(data, w, h, palette, paletteTol) {
  const bg = new Uint8Array(w * h)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const pi = y * w + x
    if (bg[pi]) return
    const i = pi * 4
    if (!isBackgroundPixel(data[i], data[i + 1], data[i + 2], data[i + 3], palette, paletteTol)) {
      return
    }
    bg[pi] = 1
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
    const x = pi % w
    const y = (pi - x) / w
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }

  return bg
}

function chromaKeyPalette(data, w, h, palette, tolerance) {
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    if (data[i + 3] < 8) continue
    if (matchesPalette(data[i], data[i + 1], data[i + 2], palette, tolerance)) {
      data[i + 3] = 0
    }
  }
}

function applyBackgroundMask(data, w, h, bg) {
  for (let pi = 0; pi < w * h; pi += 1) {
    if (!bg[pi]) continue
    const i = pi * 4
    data[i] = 0
    data[i + 1] = 0
    data[i + 2] = 0
    data[i + 3] = 0
  }
}

function foregroundMask(data, w, h) {
  const fg = new Uint8Array(w * h)
  for (let pi = 0; pi < w * h; pi += 1) {
    if (data[pi * 4 + 3] >= 24) fg[pi] = 1
  }
  return fg
}

/** Retire les poussières isolées et comble les micro-trous internes. */
function cleanForegroundMask(fg, w, h) {
  const out = Uint8Array.from(fg)

  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const pi = y * w + x
      if (!out[pi]) continue
      let neighbors = 0
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (dx === 0 && dy === 0) continue
          if (out[(y + dy) * w + (x + dx)]) neighbors += 1
        }
      }
      if (neighbors <= 1) out[pi] = 0
    }
  }

  for (let pass = 0; pass < 2; pass += 1) {
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const pi = y * w + x
        if (out[pi]) continue
        let fgNeighbors = 0
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          if (out[(y + dy) * w + (x + dx)]) fgNeighbors += 1
        }
        if (fgNeighbors >= 4) out[pi] = 1
      }
    }
  }

  return out
}

function applyForegroundMask(data, w, h, fg) {
  for (let pi = 0; pi < w * h; pi += 1) {
    if (fg[pi]) continue
    const i = pi * 4
    data[i] = 0
    data[i + 1] = 0
    data[i + 2] = 0
    data[i + 3] = 0
  }
}

function featherAlpha(data, w, h) {
  const alpha = new Float32Array(w * h)
  for (let pi = 0; pi < w * h; pi += 1) {
    alpha[pi] = data[pi * 4 + 3]
  }

  const blurred = new Float32Array(w * h)
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      let sum = 0
      let count = 0
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          sum += alpha[ny * w + nx]
          count += 1
        }
      }
      blurred[y * w + x] = sum / count
    }
  }

  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    const mixed = alpha[pi] * 0.65 + blurred[pi] * 0.35
    data[i + 3] = Math.round(Math.min(255, Math.max(0, mixed)))
    if (data[i + 3] === 0) {
      data[i] = 0
      data[i + 1] = 0
      data[i + 2] = 0
    }
  }
}

function bboxOpaque(data, w, h, threshold = 8) {
  let minX = w
  let minY = h
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (data[(y * w + x) * 4 + 3] <= threshold) continue
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
  }
  if (maxX < minX || maxY < minY) return null
  return { minX, minY, maxX, maxY }
}

function peelBackgroundFringe(data, w, h, palette, paletteTol) {
  for (let iter = 0; iter < 2; iter += 1) {
    const copy = Uint8ClampedArray.from(data)
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const pi = y * w + x
        const i = pi * 4
        if (copy[i + 3] < 16) continue
        const r = copy[i]
        const g = copy[i + 1]
        const b = copy[i + 2]
        const bgLike =
          isCyanScreen(r, g, b) ||
          isLightNeutral(r, g, b) ||
          matchesPalette(r, g, b, palette, paletteTol)
        if (!bgLike) continue
        let nearTransparent = false
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          if (copy[((y + dy) * w + (x + dx)) * 4 + 3] < 32) {
            nearTransparent = true
            break
          }
        }
        if (nearTransparent) {
          data[i] = 0
          data[i + 1] = 0
          data[i + 2] = 0
          data[i + 3] = 0
        }
      }
    }
  }
}

async function cutoutChibi(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const palette = sampleBorderPalette(rgba, w, h)
  const paletteTol = palette.some(([r, g, b]) => isLightNeutral(r, g, b)) ? 10 : 8

  const bg = floodBackgroundMask(rgba, w, h, palette, paletteTol)
  applyBackgroundMask(rgba, w, h, bg)
  chromaKeyPalette(rgba, w, h, palette, paletteTol)
  peelBackgroundFringe(rgba, w, h, palette, paletteTol)

  let fg = foregroundMask(rgba, w, h)
  fg = cleanForegroundMask(fg, w, h)
  applyForegroundMask(rgba, w, h, fg)
  featherAlpha(rgba, w, h)

  const box = bboxOpaque(rgba, w, h)
  if (!box) {
    throw new Error('Aucun pixel visible apres detourage')
  }

  const left = Math.max(0, box.minX - PADDING)
  const top = Math.max(0, box.minY - PADDING)
  const right = Math.min(w - 1, box.maxX + PADDING)
  const bottom = Math.min(h - 1, box.maxY + PADDING)
  const cropW = right - left + 1
  const cropH = bottom - top + 1

  const cropped = new Uint8ClampedArray(cropW * cropH * 4)
  for (let y = 0; y < cropH; y += 1) {
    for (let x = 0; x < cropW; x += 1) {
      const srcPi = (top + y) * w + (left + x)
      const dstPi = y * cropW + x
      const si = srcPi * 4
      const di = dstPi * 4
      cropped[di] = rgba[si]
      cropped[di + 1] = rgba[si + 1]
      cropped[di + 2] = rgba[si + 2]
      cropped[di + 3] = rgba[si + 3]
    }
  }

  return { rgba: cropped, width: cropW, height: cropH }
}

function resolveBiomeId(folderName) {
  if (BIOME_FOLDERS[folderName]) return BIOME_FOLDERS[folderName]
  const norm = normalizeKey(folderName)
  for (const [folder, id] of Object.entries(BIOME_FOLDERS)) {
    if (normalizeKey(folder) === norm) return id
  }
  return null
}

function resolveSpeciesId(fileName, biomeId, speciesInBiome) {
  const stem = basename(fileName, '.png')
  const namePart = stem.replace(/^\d+_/, '')
  const slug = slugify(namePart)
  const first = slugify(namePart.split('_')[0])

  const candidates = [
    slug,
    first,
    slug.replace(/-sans-fond$/, ''),
    first.replace(/-sans-fond$/, ''),
  ]

  for (const candidate of candidates) {
    const hit = speciesInBiome.find((species) => species.id === candidate)
    if (hit) return hit.id
  }

  const byPrefix = speciesInBiome.find(
    (species) => slug.startsWith(`${species.id}-`) || slug === species.id,
  )
  if (byPrefix) return byPrefix.id

  const normStem = normalizeKey(namePart.replace(/_/g, ' '))
  const byName = speciesInBiome.find((species) => {
    const normName = normalizeKey(species.name)
    return normName.startsWith(normalizeKey(namePart.split('_')[0])) || normStem.includes(normName)
  })
  if (byName) return byName.id

  return null
}

function listChibiFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) return listChibiFiles(full)
      if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) return [full]
      return []
    })
    .sort((a, b) => a.localeCompare(b, 'fr'))
}

const catalog = loadSpeciesCatalog()
mkdirSync(myrionAssetPaths.root, { recursive: true })

const files = listChibiFiles(importRoot)
const results = []
const missing = []

for (const inputPath of files) {
  const folderName = basename(dirname(inputPath))
  const biomeId = resolveBiomeId(folderName)
  if (!biomeId) continue

  const speciesInBiome = catalog.filter((species) => species.biomeId === biomeId)
  const speciesId = resolveSpeciesId(inputPath, biomeId, speciesInBiome)
  if (!speciesId) {
    missing.push(inputPath)
    continue
  }

  const outputPath = myrionAssetPaths.chibi(biomeId, speciesId)
  mkdirSync(dirname(outputPath), { recursive: true })
  const { rgba, width, height } = await cutoutChibi(inputPath)

  await sharp(Buffer.from(rgba), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(outputPath)

  results.push({ speciesId, biomeId, outputPath, size: `${width}x${height}` })
  console.log(`OK ${speciesId} (${width}x${height})`)
}

console.log(`\n${results.length} chibis exportes -> ${myrionAssetPaths.root}`)
if (missing.length) {
  console.warn(`\n${missing.length} fichier(s) non mappe(s):`)
  for (const path of missing) console.warn(`  - ${path}`)
}
