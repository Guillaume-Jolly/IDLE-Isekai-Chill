/**
 * PNG IA chibi-friendly → SVG simplifie (pipeline Pousselune / Talia / palmons).
 *
 * Usage:
 *   node scripts/vectorize-chibi.mjs <input.png> <output.svg> [--preview]
 *   node scripts/vectorize-chibi.mjs --demo   (Pousselune + Talia demo)
 */
import { mkdirSync, writeFileSync, copyFileSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import ImageTracer from 'imagetracerjs'
import { oldAssetPaths, publicMinigamePaths } from './minigame-asset-paths.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const previewDir = oldAssetPaths.vectorizePreview

const TRACE_OPTIONS = {
  ltres: 1.2,
  qtres: 1.2,
  pathomit: 24,
  colorsampling: 0,
  numberofcolors: 8,
  mincolorratio: 0.025,
  colorquantcycles: 5,
  scale: 1,
  strokewidth: 0,
  linefilter: true,
  roundcoords: 2,
  viewbox: true,
  desc: false,
  blurradius: 1,
  blurdelta: 12,
}

function stripWhiteBackground(rgba, width, height, threshold = 248) {
  const out = new Uint8ClampedArray(rgba.length)
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i]
    const g = rgba[i + 1]
    const b = rgba[i + 2]
    const isWhite = r >= threshold && g >= threshold && b >= threshold
    out[i] = r
    out[i + 1] = g
    out[i + 2] = b
    out[i + 3] = isWhite ? 0 : rgba[i + 3]
  }
  return out
}

async function loadImageData(inputPath, maxSize = 320) {
  const pipeline = sharp(inputPath)
    .rotate()
    .resize(maxSize, maxSize, { fit: 'inside', withoutEnlargement: false })
    .median(1)
    .ensureAlpha()

  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true })
  const cleaned = stripWhiteBackground(data, info.width, info.height)

  return {
    width: info.width,
    height: info.height,
    data: cleaned,
  }
}

function imageDataToSvg(imageData) {
  return ImageTracer.imagedataToSVG(
    {
      width: imageData.width,
      height: imageData.height,
      data: imageData.data,
    },
    TRACE_OPTIONS,
  )
}

async function vectorizeChibi(inputPath, outputPath) {
  const imageData = await loadImageData(inputPath)
  let svg = imageDataToSvg(imageData)

  const label = basename(outputPath, '.svg')
  svg = svg.replace(
    '<svg ',
    `<svg role="img" aria-label="${label}" `,
  )

  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, svg, 'utf8')
  return { width: imageData.width, height: imageData.height }
}

async function buildComparisonHtml(items) {
  const cards = items
    .map(
      ({ name, before, after }) => `
    <article class="card">
      <h2>${name}</h2>
      <div class="compare">
        <figure>
          <figcaption>Avant — PNG IA</figcaption>
          <img src="${before}" alt="${name} avant" />
        </figure>
        <figure>
          <figcaption>Apres — SVG chibi vectorise</figcaption>
          <img src="${after}" alt="${name} apres" />
        </figure>
      </div>
    </article>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pipeline chibi — avant / apres</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: #1a2030;
      color: #eef2ff;
      margin: 0;
      padding: 24px;
    }
    h1 { font-size: 1.35rem; margin: 0 0 8px; }
    p.lead { color: #9aa8c8; margin: 0 0 24px; max-width: 52rem; line-height: 1.5; }
    .card {
      background: #252d42;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .card h2 { margin: 0 0 16px; font-size: 1.1rem; }
    .compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    figure {
      margin: 0;
      background: linear-gradient(135deg, #3a5878 0%, #6a9888 100%);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
    }
    figcaption {
      font-size: 0.78rem;
      color: #c8d4ec;
      margin-bottom: 8px;
      font-weight: 600;
    }
    img {
      max-width: 100%;
      max-height: 320px;
      object-fit: contain;
      filter: drop-shadow(0 6px 16px rgba(0,0,0,0.35));
    }
    @media (max-width: 640px) {
      .compare { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <h1>Pipeline PNG IA → SVG chibi</h1>
  <p class="lead">
    A gauche : image generee par IA (fond blanc). A droite : meme sujet passe en SVG simplifie
    (10 couleurs max, fond transparent) — pret pour le mini-jeu sans detourage manuel.
  </p>
  ${cards}
</body>
</html>`
}

async function runDemo() {
  const sources = [
    {
      name: 'Pousselune (moon-sprout)',
      input: join(oldAssetPaths.sourcesScattered, 'source-moon-sprout-v2.png'),
      previewBefore: 'before-moon-sprout.png',
      previewAfter: 'after-moon-sprout.svg',
      gameOutput: join(oldAssetPaths.palmonSvgs, 'moon-sprout.svg'),
      chibiOutput: join(oldAssetPaths.palmonChibiSvgs, 'moon-sprout.svg'),
    },
    {
      name: 'Talia guide (point)',
      input: join(oldAssetPaths.sourcesScattered, 'source-talia-v2.png'),
      previewBefore: 'before-talia-point.png',
      previewAfter: 'after-talia-point.svg',
      gameOutput: join(publicMinigamePaths.captureCompanionTalia, 'point.svg'),
    },
  ]

  mkdirSync(previewDir, { recursive: true })
  const htmlItems = []

  for (const item of sources) {
    const beforePath = join(previewDir, item.previewBefore)
    copyFileSync(item.input, beforePath)

    const afterPreviewPath = join(previewDir, item.previewAfter)
    await vectorizeChibi(item.input, afterPreviewPath)
    await vectorizeChibi(item.input, item.gameOutput)

    if (item.chibiOutput) {
      await vectorizeChibi(item.input, item.chibiOutput)
    }

    htmlItems.push({
      name: item.name,
      before: item.previewBefore,
      after: item.previewAfter,
    })

    console.log(`OK ${item.name}`)
    console.log(`   avant  → ${beforePath}`)
    console.log(`   apres  → ${afterPreviewPath}`)
    console.log(`   in-game → ${item.gameOutput}`)
  }

  const html = await buildComparisonHtml(htmlItems)
  const htmlPath = join(previewDir, 'index.html')
  writeFileSync(htmlPath, html, 'utf8')
  console.log(`\nComparaison : old_assets/previews/vectorize-chibi/index.html`)
  console.log('Ouvre le fichier HTML localement (non servi en dev)')
}

const args = process.argv.slice(2)

if (args[0] === '--demo') {
  await runDemo()
} else if (args.length >= 2) {
  await vectorizeChibi(args[0], args[1])
  console.log(`OK → ${args[1]}`)
} else {
  console.log('Usage: node scripts/vectorize-chibi.mjs --demo')
  console.log('   ou: node scripts/vectorize-chibi.mjs input.png output.svg')
  process.exit(1)
}
