import { BUILDINGS } from './data.mjs'
import { escape } from './companion-art.mjs'
import {
  BUILDING_SLOTS,
  PANORAMA_HEIGHT,
  PANORAMA_WIDTH,
} from './village-map-layout.mjs'

const BUILDING_BY_ID = Object.fromEntries(BUILDINGS.map((b) => [b.id, b]))

function tierScale(tier) {
  if (tier >= 3) return 1.18
  if (tier >= 2) return 1.06
  return 0.92
}

function detailedHouse(x, y, w, h, roof, wall, accent, label, extra = '', tier = 2) {
  const scale = tierScale(tier)
  const bw = w * scale
  const bh = h * scale
  const bx = x - (bw - w) / 2
  const by = y - (bh - h)
  const roofY = by - bh * 0.34
  const tierGlow =
    tier >= 3
      ? `<ellipse cx="${x}" cy="${by + bh * 0.5}" rx="${bw * 0.7}" ry="${bh * 0.55}" fill="#ffd878" opacity="0.12"/>`
      : tier >= 2
        ? `<rect x="${bx - bw * 0.05}" y="${by - bh * 0.05}" width="${bw * 1.1}" height="${bh * 1.12}" rx="12" fill="none" stroke="#ffd878" stroke-width="2" opacity="0.35"/>`
        : ''

  return `
  <g filter="url(#soft)">
    ${tierGlow}
    <ellipse cx="${x}" cy="${by + bh + 18}" rx="${bw * 0.55}" ry="14" fill="#000" opacity="0.12"/>
    <path d="M${bx - bw * 0.62} ${by} L${x} ${roofY} L${bx + bw * 0.62} ${by} Z" fill="${roof}" stroke="#5a4030" stroke-width="3"/>
    <rect x="${bx - bw * 0.48}" y="${by}" width="${bw * 0.96}" height="${bh}" rx="8" fill="${wall}" stroke="#7a5840" stroke-width="3"/>
    <rect x="${x - 14}" y="${by + bh * 0.42}" width="28" height="${bh * 0.58}" rx="5" fill="#6a4830"/>
    <rect x="${bx - bw * 0.3}" y="${by + bh * 0.2}" width="26" height="26" rx="4" fill="#ffe898" opacity="0.85"/>
    <rect x="${bx + bw * 0.08}" y="${by + bh * 0.2}" width="26" height="26" rx="4" fill="#ffe898" opacity="0.85"/>
    <rect x="${bx - bw * 0.12}" y="${by + bh * 0.08}" width="${bw * 0.24}" height="12" rx="3" fill="${accent}" opacity="0.55"/>
    ${extra}
    <text x="${x}" y="${by + bh + 38}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="900" fill="#3a2820">${escape(label)}</text>
  </g>`
}

function constructionPlot(x, y, label) {
  return `
  <g opacity="0.72">
    <rect x="${x - 70}" y="${y - 20}" width="140" height="90" rx="6" fill="#c8a878" stroke="#8a6848" stroke-width="2" stroke-dasharray="8 6"/>
    <line x1="${x - 50}" y1="${y - 20}" x2="${x - 50}" y2="${y - 70}" stroke="#8a6848" stroke-width="4"/>
    <line x1="${x + 50}" y1="${y - 20}" x2="${x + 50}" y2="${y - 70}" stroke="#8a6848" stroke-width="4"/>
    <line x1="${x - 50}" y1="${y - 70}" x2="${x + 50}" y2="${y - 70}" stroke="#8a6848" stroke-width="4"/>
    <text x="${x}" y="${y + 95}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#6a5040" opacity="0.8">${escape(label)} — bientot</text>
  </g>`
}

function buildingExtras(id, x, y, w, h) {
  const map = {
    inn: `<rect x="${x - 30}" y="${y + h * 0.15}" width="24" height="18" rx="3" fill="#ffd080" opacity="0.7"/><circle cx="${x + 55}" cy="${y + h * 0.7}" r="14" fill="#ffe8d0" opacity="0.5"/>`,
    'mist-garden': `<circle cx="${x - 40}" cy="${y + 20}" r="28" fill="#78d868" opacity="0.55"/><circle cx="${x - 20}" cy="${y + 8}" r="22" fill="#98e888" opacity="0.45"/>`,
    'ribbon-workshop': `<rect x="${x + 35}" y="${y + 30}" width="18" height="28" fill="#888" opacity="0.45"/>`,
    'clear-spring': `<ellipse cx="${x}" cy="${y - 15}" rx="36" ry="14" fill="#88e8ff" opacity="0.65"/>`,
    'moon-farm': `<rect x="${x - 50}" y="${y + h * 0.55}" width="80" height="40" fill="#d8c848" opacity="0.45"/>`,
    'arcane-library': `<rect x="${x - 25}" y="${y - 35}" width="8" height="50" fill="#684838"/><rect x="${x - 10}" y="${y - 48}" width="8" height="63" fill="#684838"/>`,
    'traveler-theater': `<path d="M${x - 35} ${y + h * 0.85} Q${x} ${y + h * 0.55} ${x + 35} ${y + h * 0.85}" fill="none" stroke="#ffd080" stroke-width="6" opacity="0.55"/>`,
    'star-market': `<circle cx="${x - 20}" cy="${y + h * 0.55}" r="12" fill="#ffd848"/><circle cx="${x}" cy="${y + h * 0.62}" r="10" fill="#ff8868"/>`,
  }
  return map[id] ?? ''
}

function companionAnnexes(id, x, y, h) {
  const annex = {
    inn: ['🍲', '🌹'],
    'mist-garden': ['🌿'],
    'ribbon-workshop': ['🧵', '🔨'],
    'clear-spring': ['💧', '🫧'],
    'moon-farm': ['🌾', '🐾'],
    'arcane-library': ['📚', '🧪', '📜'],
    'traveler-theater': ['🎵'],
    'star-market': ['✨'],
  }[id] ?? []

  return annex
    .map(
      (emoji, i) =>
        `<text x="${x + 58 + i * 22}" y="${y + h * 0.35 + i * 4}" font-size="20" opacity="0.85">${emoji}</text>`,
    )
    .join('')
}

function stageDecor(stage) {
  const w = PANORAMA_WIDTH
  const roadOpacity = 0.28 + stage * 0.04
  const roadWidth = 48 + stage * 12

  let decor = `
  <path d="M0 720 C${w * 0.15} 680 ${w * 0.35} 690 ${w * 0.5} 710 C${w * 0.65} 730 ${w * 0.85} 700 ${w} 720" fill="none" stroke="#b88858" stroke-width="${roadWidth}" stroke-linecap="round" opacity="${roadOpacity}"/>
  `

  if (stage >= 0) {
    decor += `
    <ellipse cx="180" cy="780" rx="55" ry="18" fill="#8a6848" opacity="0.35"/>
    <circle cx="160" cy="760" r="22" fill="#ff8868" opacity="0.45"/>
    <circle cx="175" cy="752" r="18" fill="#ffa868" opacity="0.35"/>
    `
  }
  if (stage >= 1) {
    decor += Array.from(
      { length: 12 },
      (_, i) =>
        `<rect x="${120 + i * 520}" y="760" width="8" height="48" fill="#8a6848" opacity="0.35"/><line x1="${116 + i * 520}" y1="772" x2="${132 + i * 520}" y2="772" stroke="#a88858" stroke-width="3" opacity="0.4"/>`,
    ).join('')
  }
  if (stage >= 2) {
    decor += `
    <circle cx="${w * 0.42}" cy="680" r="28" fill="#88c8e8" opacity="0.55" stroke="#e8ffff" stroke-width="4"/>
    ${Array.from({ length: 16 }, (_, i) => `<circle cx="${200 + i * 380}" cy="${820 + (i % 2) * 12}" r="4" fill="#ffd878" opacity="0.55"/>`).join('')}
    `
  }
  if (stage >= 3) {
    decor += Array.from(
      { length: 8 },
      (_, i) =>
        `<line x1="${400 + i * 760}" y1="640" x2="${400 + i * 760}" y2="720" stroke="#c8a858" stroke-width="3" opacity="0.45"/><circle cx="${400 + i * 760}" cy="632" r="10" fill="#ffe898" opacity="0.7"/>`,
    ).join('')
  }
  if (stage >= 4) {
    decor += `
    <ellipse cx="${w - 320}" cy="690" rx="80" ry="28" fill="#88d8ff" opacity="0.45"/>
    <path d="M${w - 420} 650 L${w - 380} 610 L${w - 340} 650 Z" fill="#ffd848" opacity="0.55"/>
    <path d="M${w - 360} 650 L${w - 320} 600 L${w - 280} 650 Z" fill="#ff8868" opacity="0.5"/>
    `
  }

  return decor
}

/**
 * Panorama horizontal scrollable — stade 0..4.
 * @param {number} villageStage — stade de population (batiments visibles si unlockStage <= stage)
 * @param {Record<string, number>} [buildingLevels] — niveaux pour taille visuelle (gen statique: tier 2)
 */
export function scrollPanoramaSvg(villageStage = 4, buildingLevels = {}) {
  const w = PANORAMA_WIDTH
  const h = PANORAMA_HEIGHT

  const buildingArt = BUILDING_SLOTS.map((slot) => {
    const b = BUILDING_BY_ID[slot.id]
    if (!b) return ''
    const bw = 175
    const bh = 135
    const x = slot.centerX
    const y = slot.groundY - bh

    if (slot.unlockStage > villageStage) {
      return constructionPlot(x, slot.groundY, b.label)
    }

    const level = buildingLevels[slot.id] ?? 2
    const tier = level >= 7 ? 3 : level >= 4 ? 2 : 1
    const extra = buildingExtras(slot.id, x, y, bw, bh) + companionAnnexes(slot.id, x, y, bh)
    return detailedHouse(x, y, bw, bh, b.roof, b.wall, b.accent, b.label, extra, tier)
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7ec8f8"/>
      <stop offset="0.45" stop-color="#c8e8ff"/>
      <stop offset="0.75" stop-color="#ffe8c8"/>
      <stop offset="1" stop-color="#f8d898"/>
    </linearGradient>
    <linearGradient id="grass" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#98e878"/>
      <stop offset="0.5" stop-color="#c8e878"/>
      <stop offset="1" stop-color="#88c868"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#3a3020" flood-opacity="0.22"/>
    </filter>
    <filter id="mist" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <ellipse cx="320" cy="180" rx="120" ry="120" fill="#fff8d0" opacity="0.85"/>
  <ellipse cx="350" cy="155" rx="95" ry="95" fill="#ffe880" opacity="0.45"/>
  ${Array.from({ length: 14 }, (_, i) => `<ellipse cx="${180 + i * 460}" cy="${110 + (i % 3) * 28}" rx="${70 + (i % 3) * 18}" ry="${28 + (i % 2) * 8}" fill="#fff" opacity="0.32" filter="url(#mist)"/>`).join('')}
  <path d="M0 680 C${w * 0.12} 640 ${w * 0.28} 650 ${w * 0.42} 690 C${w * 0.58} 720 ${w * 0.72} 680 ${w * 0.88} 700 L${w} 710 L${w} ${h} L0 ${h} Z" fill="url(#grass)"/>
  <path d="M-40 920 C${w * 0.12} 880 ${w * 0.35} 900 ${w * 0.55} 940 C${w * 0.72} 980 ${w * 0.88} 960 ${w + 40} 920 L${w + 40} ${h} L-40 ${h} Z" fill="#68c8e8" opacity="0.82"/>
  ${stageDecor(villageStage)}
  ${buildingArt}
  <text x="${w * 0.5}" y="72" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="900" fill="#fff" opacity="0.5">Havre des Brumes</text>
</svg>`
}

/** @deprecated Utiliser scrollPanoramaSvg — conservé pour compat generate */
export function villageSvg() {
  return scrollPanoramaSvg(4)
}

function buildingIconSvg(building) {
  const { roof, wall, accent, label, icon } = building
  const iconArt = {
    inn: `<rect x="88" y="108" width="24" height="16" rx="2" fill="#ffd080"/>`,
    garden: `<circle cx="128" cy="118" r="22" fill="#78d868" opacity="0.7"/><circle cx="140" cy="108" r="16" fill="#98e888" opacity="0.6"/>`,
    workshop: `<rect x="118" y="100" width="20" height="32" fill="#888" opacity="0.55"/>`,
    spring: `<ellipse cx="128" cy="118" rx="28" ry="10" fill="#88e8ff" opacity="0.75"/>`,
    farm: `<rect x="108" y="118" width="40" height="22" fill="#d8c848" opacity="0.65"/>`,
    library: `<rect x="118" y="92" width="6" height="48" fill="#684838"/><rect x="128" y="82" width="6" height="58" fill="#684838"/>`,
    theater: `<path d="M108 128 Q128 108 148 128" fill="none" stroke="#ffd080" stroke-width="5"/>`,
    market: `<circle cx="118" cy="118" r="10" fill="#ffd848"/><circle cx="136" cy="126" r="8" fill="#ff8868"/>`,
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff8fc"/>
      <stop offset="1" stop-color="#f0e8ff"/>
    </linearGradient>
    <filter id="s"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#503848" flood-opacity="0.25"/></filter>
  </defs>
  <rect width="256" height="256" rx="32" fill="url(#bg)"/>
  <g filter="url(#s)" transform="translate(0, 10)">
    <path d="M48 148 L128 68 L208 148 Z" fill="${roof}" stroke="#5a4030" stroke-width="4"/>
    <rect x="68" y="148" width="120" height="88" rx="8" fill="${wall}" stroke="#7a5840" stroke-width="4"/>
    <rect x="116" y="188" width="24" height="48" rx="4" fill="#6a4830"/>
    <rect x="84" y="168" width="22" height="22" rx="4" fill="#ffe898"/>
    <rect x="150" y="168" width="22" height="22" rx="4" fill="#ffe898"/>
    <rect x="108" y="156" width="40" height="10" rx="3" fill="${accent}" opacity="0.6"/>
    ${iconArt[icon] ?? ''}
  </g>
  <text x="128" y="238" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="900" fill="#4a3040">${escape(label)}</text>
</svg>`
}

export function heroBannerSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="420" viewBox="0 0 1440 420">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd4ec"/>
      <stop offset="0.45" stop-color="#e8c8ff"/>
      <stop offset="1" stop-color="#ffc888"/>
    </linearGradient>
    <filter id="g"><feGaussianBlur stdDeviation="12"/></filter>
  </defs>
  <rect width="1440" height="420" fill="url(#hero)"/>
  <ellipse cx="200" cy="120" rx="180" ry="100" fill="#fff" opacity="0.35" filter="url(#g)"/>
  <ellipse cx="1200" cy="80" rx="220" ry="120" fill="#fff" opacity="0.28" filter="url(#g)"/>
  <path d="M0 320 C240 280 420 300 620 340 C820 380 1020 350 1240 310 C1340 290 1400 300 1440 310 L1440 420 L0 420 Z" fill="#88c878" opacity="0.35"/>
  <path d="M80 300 L180 220 L280 300 Z" fill="#c85838" opacity="0.45"/>
  <rect x="110" y="300" width="140" height="80" rx="6" fill="#fff2d8" opacity="0.55"/>
  <path d="M1180 260 L1280 180 L1380 260 Z" fill="#7858b8" opacity="0.42"/>
  <rect x="1210" y="260" width="120" height="70" rx="6" fill="#f0e8ff" opacity="0.5"/>
  ${Array.from({ length: 20 }, (_, i) => `<circle cx="${60 + i * 68}" cy="${60 + (i % 4) * 18}" r="2" fill="#fff" opacity="0.6"/>`).join('')}
  <text x="720" y="180" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="900" fill="#fff" opacity="0.35">Havre des Brumes</text>
</svg>`
}

export { buildingIconSvg, PANORAMA_WIDTH, PANORAMA_HEIGHT }
