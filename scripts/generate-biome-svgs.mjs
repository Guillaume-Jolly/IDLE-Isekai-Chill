/**
 * Genere les fonds de biome SVG 16:9 (sans IA).
 * Usage: node scripts/generate-biome-svgs.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { oldAssetPaths } from './minigame-asset-paths.mjs'

const outDir = oldAssetPaths.biomesLegacy
mkdirSync(outDir, { recursive: true })

/** @type {Record<string, { sky: [string,string]; ground: [string,string]; accent: string; decor: string }>} */
const BIOMES = {
  'moon-meadow': {
    sky: ['#1a2848', '#3a5888'],
    ground: ['#5a9848', '#9ed56b'],
    accent: '#ffe878',
    decor: 'fireflies',
  },
  'mist-forest': {
    sky: ['#2a3840', '#5a7880'],
    ground: ['#3a5848', '#6a9880'],
    accent: '#a8d8c8',
    decor: 'mist',
  },
  'crystal-spring': {
    sky: ['#183858', '#68b8e8'],
    ground: ['#48a8c8', '#a8e8ff'],
    accent: '#d8f8ff',
    decor: 'water',
  },
  'ember-ruins': {
    sky: ['#281820', '#884830'],
    ground: ['#985838', '#ffb86b'],
    accent: '#ff7848',
    decor: 'ruins',
  },
  'star-shore': {
    sky: ['#182848', '#4888c8'],
    ground: ['#ffd56a', '#ffe8a8'],
    accent: '#fff8d0',
    decor: 'stars',
  },
  'snow-peaks': {
    sky: ['#384858', '#88a8c8'],
    ground: ['#d8e8f8', '#f8fcff'],
    accent: '#b8ffe8',
    decor: 'aurora',
  },
}

function decorLayer(type, accent) {
  switch (type) {
    case 'fireflies':
      return Array.from({ length: 24 }, (_, i) => {
        const x = 120 + (i * 73) % 1680
        const y = 520 + (i * 47) % 380
        return `<circle cx="${x}" cy="${y}" r="4" fill="${accent}" opacity="0.75"/>`
      }).join('')
    case 'mist':
      return `<ellipse cx="960" cy="680" rx="820" ry="180" fill="#fff" opacity="0.08"/><ellipse cx="600" cy="720" rx="500" ry="120" fill="#fff" opacity="0.06"/>`
    case 'water':
      return `<ellipse cx="960" cy="820" rx="700" ry="80" fill="#fff" opacity="0.15"/><path d="M 200 780 Q 960 720 1720 780" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>`
    case 'ruins':
      return `<rect x="140" y="520" width="80" height="160" fill="#584030" opacity="0.5"/><rect x="1680" y="480" width="100" height="200" fill="#584030" opacity="0.45"/><path d="M 1600 680 L 1700 580 L 1800 680 Z" fill="#684838" opacity="0.4"/>`
    case 'stars':
      return `<circle cx="960" cy="900" r="120" fill="${accent}" opacity="0.12"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${100 + (i * 61) % 1720}" cy="${80 + (i * 37) % 280}" r="2" fill="#fff" opacity="0.8"/>`).join('')}`
    case 'aurora':
      return `<path d="M 0 200 Q 480 120 960 180 Q 1440 240 1920 160 L 1920 400 Q 1440 320 960 380 Q 480 440 0 360 Z" fill="${accent}" opacity="0.18"/>`
    default:
      return ''
  }
}

function biomeSvg(id, theme) {
  const { sky, ground, accent, decor } = theme
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${id}">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${sky[0]}"/>
      <stop offset="100%" stop-color="${sky[1]}"/>
    </linearGradient>
    <linearGradient id="ground-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${ground[0]}"/>
      <stop offset="100%" stop-color="${ground[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#sky-${id})"/>
  <ellipse cx="960" cy="780" rx="980" ry="420" fill="url(#ground-${id})"/>
  <ellipse cx="200" cy="620" rx="280" ry="200" fill="${ground[0]}" opacity="0.55"/>
  <ellipse cx="1720" cy="640" rx="300" ry="220" fill="${ground[0]}" opacity="0.55"/>
  ${decorLayer(decor, accent)}
  <ellipse cx="960" cy="720" rx="520" ry="120" fill="${ground[1]}" opacity="0.35"/>
</svg>`
}

for (const [id, theme] of Object.entries(BIOMES)) {
  writeFileSync(join(outDir, `${id}.svg`), biomeSvg(id, theme), 'utf8')
  console.log(`OK biome ${id}`)
}

console.log(`Generated ${Object.keys(BIOMES).length} biome SVGs.`)
