#!/usr/bin/env node
/**
 * Icône Havre Dev Launcher — Lyra chibi + badge DEV (coin haut-gauche, ~40 % du canvas).
 * Sorties : scripts/dev-launcher/launcher-icon.png · launcher-icon.ico
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')
const OUT_DIR = __dirname
const LYRA_CHIBI = join(REPO_ROOT, 'assets', 'Compagnons', 'lyra', 'chibis', 'chibi.png')

const SIZES = [256, 48, 32, 16]

/** Palette Havre (havreWheelTheme). */
const HAVRE = {
  bg: '#1a2428',
  teal: '#3a8f8a',
  mist: '#a8d4d0',
  brass: '#c9a227',
  label: '#f4efe6',
}

function havreBackgroundSvg(size) {
  const badge = Math.round(size * 0.4)
  const pad = Math.round(size * 0.03)
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="mist" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${HAVRE.teal}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#243238" stop-opacity="1"/>
      <stop offset="100%" stop-color="${HAVRE.bg}" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="brass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e8c45a"/>
      <stop offset="100%" stop-color="${HAVRE.brass}"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${Math.max(1, size * 0.01)}" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.14)}" fill="url(#mist)"/>
  <circle cx="${Math.round(size * 0.82)}" cy="${Math.round(size * 0.18)}" r="${Math.round(size * 0.04)}" fill="${HAVRE.mist}" opacity="0.35"/>
  <circle cx="${Math.round(size * 0.12)}" cy="${Math.round(size * 0.72)}" r="${Math.round(size * 0.03)}" fill="${HAVRE.mist}" opacity="0.25"/>
  <circle cx="${Math.round(size * 0.68)}" cy="${Math.round(size * 0.78)}" r="${Math.round(size * 0.025)}" fill="${HAVRE.brass}" opacity="0.4"/>
  <rect x="${pad}" y="${pad}" width="${badge}" height="${badge}" rx="${Math.round(badge * 0.18)}"
    fill="#0f1618" fill-opacity="0.82" stroke="url(#brass)" stroke-width="${Math.max(1, size * 0.012)}"/>
  <text x="${pad + badge / 2}" y="${pad + badge * 0.62}" text-anchor="middle"
    font-family="Segoe UI, Arial, sans-serif" font-weight="800"
    font-size="${Math.round(badge * 0.42)}" fill="url(#brass)" filter="url(#glow)">DEV</text>
</svg>`)
}

function buildIcoFromPngs(images) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(images.length, 4)

  let offset = 6 + images.length * 16
  const parts = [header]

  for (const img of images) {
    const entry = Buffer.alloc(16)
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0)
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1)
    entry.writeUInt8(0, 2)
    entry.writeUInt8(0, 3)
    entry.writeUInt16LE(1, 4)
    entry.writeUInt16LE(32, 6)
    entry.writeUInt32LE(img.png.length, 8)
    entry.writeUInt32LE(offset, 12)
    parts.push(entry)
    offset += img.png.length
  }

  for (const img of images) parts.push(img.png)
  return Buffer.concat(parts)
}

async function composeIcon(size) {
  const badge = Math.round(size * 0.4)
  const lyraMax = Math.round(size * 0.72)

  const lyra = await sharp(LYRA_CHIBI)
    .resize(lyraMax, lyraMax, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  const lyraMeta = await sharp(lyra).metadata()
  const lyraW = lyraMeta.width ?? lyraMax
  const lyraH = lyraMeta.height ?? lyraMax
  const lyraLeft = Math.round((size - lyraW) / 2 + size * 0.04)
  const lyraTop = Math.round(size * 0.1 + badge * 0.52)

  const bg = await sharp(havreBackgroundSvg(size)).png().toBuffer()

  return sharp(bg)
    .composite([
      { input: lyra, left: lyraLeft, top: lyraTop },
    ])
    .png()
    .toBuffer()
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  const png256 = await composeIcon(256)
  const pngPath = join(OUT_DIR, 'launcher-icon.png')
  writeFileSync(pngPath, png256)

  const icoImages = []
  for (const size of SIZES) {
    const png = size === 256 ? png256 : await composeIcon(size)
    icoImages.push({ width: size, height: size, png })
  }

  const icoPath = join(OUT_DIR, 'launcher-icon.ico')
  writeFileSync(icoPath, buildIcoFromPngs(icoImages))

  console.log(`[launcher-icon] ${pngPath}`)
  console.log(`[launcher-icon] ${icoPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
