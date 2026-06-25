/**
 * Carte de placement pour l IA — 8 emplacements vides alignés sur le layout 6400×1080.
 * Usage: node scripts/build-village-layout-guide.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  BUILDING_SLOTS,
  PANORAMA_HEIGHT,
  PANORAMA_WIDTH,
  SECTION_WIDTH,
} from './assets/village-map-layout.mjs'

import { pipelineReferencesRoot } from './minigame-asset-paths.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(pipelineReferencesRoot, 'village-layout')
mkdirSync(outDir, { recursive: true })

const padW = Math.round(SECTION_WIDTH * 0.62)
const padH = Math.round(PANORAMA_HEIGHT * 0.22)

const rects = BUILDING_SLOTS.map((slot) => {
  const x = slot.centerX - padW / 2
  const y = slot.groundY - padH
  return `
  <rect x="${x}" y="${y}" width="${padW}" height="${padH}" rx="18"
    fill="#7ec850" fill-opacity="0.55" stroke="#3a7828" stroke-width="4" stroke-dasharray="16 10"/>`
}).join('\n')

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${PANORAMA_WIDTH}" height="${PANORAMA_HEIGHT}" viewBox="0 0 ${PANORAMA_WIDTH} ${PANORAMA_HEIGHT}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2840"/>
      <stop offset="45%" stop-color="#4a6888"/>
      <stop offset="100%" stop-color="#8a6848"/>
    </linearGradient>
  </defs>
  <rect width="${PANORAMA_WIDTH}" height="${PANORAMA_HEIGHT}" fill="url(#sky)"/>
  <rect x="0" y="${PANORAMA_HEIGHT * 0.55}" width="${PANORAMA_WIDTH}" height="${PANORAMA_HEIGHT * 0.45}" fill="#3a5028"/>
  <path d="M0 ${PANORAMA_HEIGHT * 0.72} Q${PANORAMA_WIDTH * 0.25} ${PANORAMA_HEIGHT * 0.68} ${PANORAMA_WIDTH * 0.5} ${PANORAMA_HEIGHT * 0.74} T${PANORAMA_WIDTH} ${PANORAMA_HEIGHT * 0.7} L${PANORAMA_WIDTH} ${PANORAMA_HEIGHT} L0 ${PANORAMA_HEIGHT} Z" fill="#2a4018" opacity="0.6"/>
  ${rects}
</svg>`

const fullPath = join(outDir, 'layout-guide-6400.png')
const refPath = join(outDir, 'layout-guide-ref.png')

await sharp(Buffer.from(svg)).png().toFile(fullPath)
await sharp(Buffer.from(svg)).resize({ width: 2048 }).png().toFile(refPath)

writeFileSync(
  join(outDir, 'slots.json'),
  JSON.stringify({ PANORAMA_WIDTH, PANORAMA_HEIGHT, BUILDING_SLOTS }, null, 2),
)

console.log(`Layout guide: ${fullPath}`)
console.log(`AI reference: ${refPath} (2048px wide)`)
