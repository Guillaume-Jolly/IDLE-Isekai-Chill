/**
 * Détourage du pack chibis_9_pack_cutout (damier blanc/gris simulé).
 * Usage: node scripts/import-chibis-9-pack.mjs [dossier-import]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { oldAssetsRoot, publicMinigamePaths, repoRoot, sourceMinigamePaths, taliaGuideFile } from './minigame-asset-paths.mjs'

const importRoot = process.argv[2] ?? sourceMinigamePaths.captureTaliaChibis9
const guidesDir = publicMinigamePaths.captureCompanionTalia
const taliaChibiPath = join(publicMinigamePaths.companions, 'talia', 'chibi.png')
const previewDir = join(oldAssetsRoot, 'previews', 'chibis-9-pack')
const PADDING = 12

const BIOME_OUTPUTS = [
  {
    biomeId: 'prairie-solaire',
    test: (name) => /herboriste|lapin/i.test(name),
    label: 'Prairie — Herboriste & lapin',
  },
  {
    biomeId: 'foret-ancienne',
    test: (name) => /for[^/\\]*t|renard/i.test(name),
    label: 'Forêt — Exploratrice & renard',
  },
  {
    biomeId: 'marais-brumeux',
    test: (name) => /aventureuse_magique_et_accueillante/i.test(name),
    label: 'Marais — Aventureuse accueillante',
  },
  {
    biomeId: 'montagnes-cristallines',
    test: (name) => /glacial|glace|cristal/i.test(name),
    label: 'Montagnes — Compagnon glacial',
  },
  {
    biomeId: 'desert-rouge',
    test: (name) => /d[^/\\]*sert/i.test(name),
    label: 'Désert — Aventurière & compagnon',
  },
  {
    biomeId: 'rivage-corallien',
    test: (name) => /tropicale|tortue|corall/i.test(name),
    label: 'Rivage — Exploratrice & tortue',
  },
  {
    biomeId: 'volcan-noir',
    test: (name) => /feu|volcan|lave|magicienne_de_feu/i.test(name),
    label: 'Volcan — Magicienne de feu',
  },
  {
    biomeId: 'ruines-astrales',
    test: (name) => /hibou|etoil|astral|mage_et/i.test(name),
    label: 'Ruines — Mage & hibou étoilé',
  },
]

function colorDist(r, g, b, r2, g2, b2) {
  return Math.max(Math.abs(r - r2), Math.abs(g - g2), Math.abs(b - b2))
}

function lightness(r, g, b) {
  return (r + g + b) / 3
}

function isNeutral(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b) <= 14
}

function sampleBorderPalette(data, w, h, border = 10) {
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
    .sort((a, b) => b[1] - a[1])
    .slice(0, 32)
    .map(([key]) => key.split(',').map(Number))
}

function matchesPalette(r, g, b, palette, tolerance) {
  for (const [pr, pg, pb] of palette) {
    if (colorDist(r, g, b, pr, pg, pb) <= tolerance) return true
  }
  return false
}

function isCheckerBackground(r, g, b, palette, paletteTol) {
  if (matchesPalette(r, g, b, palette, paletteTol)) return true
  if (!isNeutral(r, g, b)) return false
  const l = lightness(r, g, b)
  return l >= 118 && l <= 255
}

function isHaloPixel(r, g, b, a) {
  if (a < 8) return false
  if (!isNeutral(r, g, b)) return false
  return lightness(r, g, b) >= 168
}

function floodBackground(data, w, h, palette, paletteTol) {
  const bg = new Uint8Array(w * h)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const pi = y * w + x
    if (bg[pi]) return
    const i = pi * 4
    const a = data[i + 3]
    if (a < 20) {
      bg[pi] = 1
      queue.push(pi)
      return
    }
    if (!isCheckerBackground(data[i], data[i + 1], data[i + 2], palette, paletteTol)) return
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

function applyBackground(data, w, h, bg) {
  for (let pi = 0; pi < w * h; pi += 1) {
    if (!bg[pi]) continue
    const i = pi * 4
    data[i] = 0
    data[i + 1] = 0
    data[i + 2] = 0
    data[i + 3] = 0
  }
}

function peelLightFringe(data, w, h, passes = 4) {
  for (let iter = 0; iter < passes; iter += 1) {
    const copy = Uint8ClampedArray.from(data)
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const pi = y * w + x
        const i = pi * 4
        if (copy[i + 3] < 16) continue
        if (!isHaloPixel(copy[i], copy[i + 1], copy[i + 2], copy[i + 3])) continue
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
    const mixed = alpha[pi] * 0.7 + blurred[pi] * 0.3
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

function cropWithPadding(data, w, h, padding = PADDING) {
  const box = bboxOpaque(data, w, h)
  if (!box) throw new Error('Aucun pixel visible apres detourage')
  const left = Math.max(0, box.minX - padding)
  const top = Math.max(0, box.minY - padding)
  const right = Math.min(w - 1, box.maxX + padding)
  const bottom = Math.min(h - 1, box.maxY + padding)
  const cropW = right - left + 1
  const cropH = bottom - top + 1
  const cropped = new Uint8ClampedArray(cropW * cropH * 4)
  for (let y = 0; y < cropH; y += 1) {
    for (let x = 0; x < cropW; x += 1) {
      const srcPi = (top + y) * w + (left + x)
      const dstPi = y * cropW + x
      const si = srcPi * 4
      const di = dstPi * 4
      cropped[di] = data[si]
      cropped[di + 1] = data[si + 1]
      cropped[di + 2] = data[si + 2]
      cropped[di + 3] = data[si + 3]
    }
  }
  return { rgba: cropped, width: cropW, height: cropH }
}

async function cutoutCheckerboard(inputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const palette = sampleBorderPalette(rgba, w, h)
  const paletteTol = 12
  const bg = floodBackground(rgba, w, h, palette, paletteTol)
  applyBackground(rgba, w, h, bg)
  peelLightFringe(rgba, w, h)
  featherAlpha(rgba, w, h)
  return cropWithPadding(rgba, w, h)
}

async function writePng(rgba, width, height, outputPath) {
  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(rgba), {
    raw: { width, height, channels: 4 },
  })
    .png()
    .toFile(outputPath)
}

function listPngFiles(dir) {
  return readdirSync(dir)
    .filter((name) => name.toLowerCase().endsWith('.png'))
    .map((name) => join(dir, name))
}

function resolvePackEntry(filePath) {
  const name = basename(filePath)
  if (/clean_isolated|isolated_character/i.test(name)) {
    return { kind: 'chibi', label: 'Talia chibi (miniature)' }
  }
  const biome = BIOME_OUTPUTS.find((entry) => entry.test(name))
  if (biome) {
    return {
      kind: 'guide',
      biomeId: biome.biomeId,
      label: biome.label,
    }
  }
  return null
}

const files = listPngFiles(importRoot)
const exported = []
const unmatched = []

for (const inputPath of files) {
  const entry = resolvePackEntry(inputPath)
  if (!entry) {
    unmatched.push(basename(inputPath))
    continue
  }

  const { rgba, width, height } = await cutoutCheckerboard(inputPath)
  let outputPath
  if (entry.kind === 'chibi') {
    outputPath = taliaChibiPath
  } else {
    outputPath = join(guidesDir, taliaGuideFile(entry.biomeId))
  }

  await writePng(rgba, width, height, outputPath)
  const previewName = entry.kind === 'chibi' ? 'talia-chibi.png' : `talia-${entry.biomeId}.png`
  const previewPath = join(previewDir, previewName)
  await writePng(rgba, width, height, previewPath)

  exported.push({ ...entry, outputPath, previewPath, size: `${width}x${height}`, source: basename(inputPath) })
  console.log(`OK ${entry.label} -> ${outputPath} (${width}x${height})`)
}

const prairieGuide = join(guidesDir, taliaGuideFile('prairie-solaire'))
const fallbackGuide = join(guidesDir, 'point.png')
if (existsSync(prairieGuide)) {
  await sharp(prairieGuide).png().toFile(fallbackGuide)
  console.log(`Default ${fallbackGuide}`)
}

const previewHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Validation — chibis 9 pack détourés</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, sans-serif; background: #1a1a2e; color: #eee; }
    h1 { padding: 16px 20px 0; font-size: 1.2rem; }
    p { padding: 0 20px 12px; color: #aab; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; padding: 16px 20px 32px; }
    figure { margin: 0; background: repeating-conic-gradient(#808080 0% 25%, #c0c0c0 0% 50%) 50% / 24px 24px; border-radius: 12px; overflow: hidden; border: 1px solid #444; }
    img { display: block; width: 100%; height: auto; }
    figcaption { background: #12121f; padding: 10px 12px; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>Pack chibis 9 — détourage damier</h1>
  <p>Fond damier = transparence réelle. Ouvre ce fichier dans le navigateur pour valider les contours.</p>
  <div class="grid">
${exported
  .map(
    (item) => `    <figure>
      <img src="./${basename(item.previewPath)}" alt="${item.label}" />
      <figcaption><strong>${item.label}</strong><br />${item.size} · ${item.source}</figcaption>
    </figure>`,
  )
  .join('\n')}
  </div>
</body>
</html>
`

mkdirSync(previewDir, { recursive: true })
writeFileSync(join(previewDir, 'index.html'), previewHtml, 'utf8')

console.log(`\n${exported.length} images exportees`)
console.log(`Preview: old_assets/previews/chibis-9-pack/index.html`)
if (unmatched.length) {
  console.warn('Non mappees:', unmatched.join(', '))
}
