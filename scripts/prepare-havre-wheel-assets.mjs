/**
 * Roue Havre — import assets pack (détourage fond noir + trou segments).
 *
 * Usage:
 *   npm run prepare:havre-wheel-assets
 *   node scripts/prepare-havre-wheel-assets.mjs [dossier_sources]
 *
 * Sorties (public/assets/destiny-wheel/havre/) :
 *   frame.png, pointer_fixed.png, pointer_mobile.png, tick_normal.webp, tick_thin.webp
 */
import { homedir } from 'node:os'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { chromaKeyPng } from './chroma-key-png.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public/assets/destiny-wheel/havre')
const SOURCE_DIR = join(OUT_DIR, 'sources')

const CURSOR_ASSETS = join(homedir(), '.cursor/projects/c-Dev-Project-IDLE-Isekai-Chill/assets')

/** Fichiers sources attendus (noms après copie dans sources/). */
const SOURCE_NAMES = {
  frame: 'frame_raw.png',
  pointerFixed: 'pointer_fixed_raw.png',
  pointerMobile: 'pointer_mobile_raw.png',
  tickNormal: 'tick_normal_raw.png',
  tickThin: 'tick_thin_raw.png',
}

const CURSOR_GLOBS = {
  frame: 'frame-',
  pointerFixed: 'pointer_fixed-',
  pointerMobile: 'pointer_mobile-',
  tickNormal: 'tick_normal-',
  tickThin: 'tick_thin-',
}

const VIEWBOX_R = 182
const VIEWBOX_HALF = 200

function findCursorAsset(prefix) {
  if (!existsSync(CURSOR_ASSETS)) return null
  const hit = readdirSync(CURSOR_ASSETS).find((name) => name.includes(prefix) && name.endsWith('.png'))
  return hit ? join(CURSOR_ASSETS, hit) : null
}

function ensureSources(customDir) {
  mkdirSync(SOURCE_DIR, { recursive: true })
  const fromDir = customDir ? join(process.cwd(), customDir) : null

  for (const [key, destName] of Object.entries(SOURCE_NAMES)) {
    const dest = join(SOURCE_DIR, destName)
    if (existsSync(dest)) continue

    const direct = fromDir ? join(fromDir, destName.replace('_raw', '')) : null
    const cursor = findCursorAsset(CURSOR_GLOBS[key])
    const src = direct && existsSync(direct) ? direct : cursor
    if (!src || !existsSync(src)) {
      throw new Error(`Source introuvable pour ${key} (${destName})`)
    }
    copyFileSync(src, dest)
    console.log(`[prepare-havre-wheel] source ${key} ← ${src}`)
  }
}

function keyInteriorSegmentHole(data, width, height, cx, cy, half) {
  const discOuterR = (VIEWBOX_R / VIEWBOX_HALF) * half

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (data[i + 3] < 8) continue
      const dist = Math.hypot(x - cx + 0.5, y - cy + 0.5)
      if (dist >= discOuterR * 0.99) continue

      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const sum = r + g + b
      const sat = Math.max(r, g, b) - Math.min(r, g, b)
      /** Composite source : disque noir/gris entre hub et segments — retirer sur tout le trou. */
      const isHoleFill = sum < 52 || (sum < 96 && sat < 34)

      if (isHoleFill) {
        data[i + 3] = 0
      }
    }
  }
}

async function processFrame(inputPath, outPath) {
  const tmp = join(OUT_DIR, '_frame_key_tmp.png')
  await chromaKeyPng(inputPath, tmp)

  const { data, info } = await sharp(tmp).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const cx = info.width / 2
  const cy = info.height / 2
  const half = Math.min(cx, cy)
  const rgba = Buffer.from(data)
  keyInteriorSegmentHole(rgba, info.width, info.height, cx, cy, half)

  const square = Math.max(info.width, info.height)
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extend({
      top: Math.floor((square - info.height) / 2),
      bottom: Math.ceil((square - info.height) / 2),
      left: Math.floor((square - info.width) / 2),
      right: Math.ceil((square - info.width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath)

  return { width: square, height: square, discOuterR: (VIEWBOX_R / VIEWBOX_HALF) * half }
}

async function processCutout(inputPath, outPath, asWebp = false) {
  const tmp = join(OUT_DIR, `_tmp_${outPath.split(/[/\\]/).pop()}`)
  await chromaKeyPng(inputPath, tmp)
  const img = sharp(tmp).trim()
  if (asWebp) {
    await img.webp({ quality: 92 }).toFile(outPath)
  } else {
    await img.png().toFile(outPath)
  }
  const meta = await sharp(outPath).metadata()
  return { width: meta.width ?? 0, height: meta.height ?? 0 }
}

export async function prepareHavreWheelAssets(sourceDir = SOURCE_DIR, outDir = OUT_DIR) {
  mkdirSync(outDir, { recursive: true })

  const frameMeta = await processFrame(join(sourceDir, SOURCE_NAMES.frame), join(outDir, 'frame.png'))
  const pointerFixedMeta = await processCutout(
    join(sourceDir, SOURCE_NAMES.pointerFixed),
    join(outDir, 'pointer_fixed.png'),
  )
  const pointerMobileMeta = await processCutout(
    join(sourceDir, SOURCE_NAMES.pointerMobile),
    join(outDir, 'pointer_mobile.png'),
  )
  const tickNormalMeta = await processCutout(
    join(sourceDir, SOURCE_NAMES.tickNormal),
    join(outDir, 'tick_normal.webp'),
    true,
  )
  const tickThinMeta = await processCutout(
    join(sourceDir, SOURCE_NAMES.tickThin),
    join(outDir, 'tick_thin.webp'),
    true,
  )

  return {
    frame: frameMeta,
    pointerFixed: pointerFixedMeta,
    pointerMobile: pointerMobileMeta,
    tickNormal: tickNormalMeta,
    tickThin: tickThinMeta,
  }
}

const customDir = process.argv[2]
try {
  ensureSources(customDir)
  const result = await prepareHavreWheelAssets()
  console.log('[prepare-havre-wheel] OK')
  console.log(JSON.stringify(result, null, 2))
} catch (err) {
  console.error(`[prepare-havre-wheel] ${err.message}`)
  process.exit(1)
}
