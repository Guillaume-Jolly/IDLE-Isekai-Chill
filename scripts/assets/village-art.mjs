import { BUILDINGS } from './data.mjs'
import { escape } from './companion-art.mjs'

function detailedHouse(x, y, w, h, roof, wall, accent, label, extra = '') {
  const roofY = y - h * 0.34
  return `
  <g filter="url(#soft)">
    <ellipse cx="${x}" cy="${y + h + 18}" rx="${w * 0.55}" ry="14" fill="#000" opacity="0.12"/>
    <path d="M${x - w * 0.62} ${y} L${x} ${roofY} L${x + w * 0.62} ${y} Z" fill="${roof}" stroke="#5a4030" stroke-width="3"/>
    <rect x="${x - w * 0.48}" y="${y}" width="${w * 0.96}" height="${h}" rx="8" fill="${wall}" stroke="#7a5840" stroke-width="3"/>
    <rect x="${x - 14}" y="${y + h * 0.42}" width="28" height="${h * 0.58}" rx="5" fill="#6a4830"/>
    <rect x="${x - w * 0.3}" y="${y + h * 0.2}" width="26" height="26" rx="4" fill="#ffe898" opacity="0.85"/>
    <rect x="${x + w * 0.08}" y="${y + h * 0.2}" width="26" height="26" rx="4" fill="#ffe898" opacity="0.85"/>
    <rect x="${x - w * 0.12}" y="${y + h * 0.08}" width="${w * 0.24}" height="12" rx="3" fill="${accent}" opacity="0.55"/>
    ${extra}
    <text x="${x}" y="${y + h + 38}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" font-weight="900" fill="#3a2820">${escape(label)}</text>
  </g>`
}

export function villageSvg() {
  const extras = {
    inn: `<rect x="248" y="398" width="24" height="18" rx="3" fill="#ffd080" opacity="0.7"/>`,
    garden: `<circle cx="470" cy="210" r="28" fill="#78d868" opacity="0.55"/><circle cx="490" cy="198" r="22" fill="#98e888" opacity="0.45"/>`,
    workshop: `<rect x="848" y="318" width="18" height="28" fill="#888" opacity="0.45"/>`,
    spring: `<ellipse cx="710" cy="175" rx="36" ry="14" fill="#88e8ff" opacity="0.65"/>`,
    farm: `<rect x="250" y="668" width="80" height="40" fill="#d8c848" opacity="0.45"/>`,
    library: `<rect x="1080" y="188" width="8" height="50" fill="#684838"/><rect x="1095" y="175" width="8" height="63" fill="#684838"/>`,
    theater: `<path d="M755 640 Q790 600 825 640" fill="none" stroke="#ffd080" stroke-width="6" opacity="0.55"/>`,
    market: `<circle cx="1145" cy="510" r="12" fill="#ffd848"/><circle cx="1165" cy="520" r="10" fill="#ff8868"/>`,
  }

  const placements = [
    [280, 430, 200, 155, BUILDINGS[0], extras.inn],
    [470, 210, 160, 125, BUILDINGS[1], extras.garden],
    [860, 330, 170, 135, BUILDINGS[2], extras.workshop],
    [710, 145, 165, 115, BUILDINGS[3], extras.spring],
    [290, 690, 180, 120, BUILDINGS[4], extras.farm],
    [1085, 210, 175, 138, BUILDINGS[5], extras.library],
    [760, 650, 185, 140, BUILDINGS[6], extras.theater],
    [1145, 525, 175, 135, BUILDINGS[7], extras.market],
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
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
  <rect width="1920" height="1080" fill="url(#sky)"/>
  <ellipse cx="280" cy="180" rx="120" ry="120" fill="#fff8d0" opacity="0.85"/>
  <ellipse cx="310" cy="155" rx="95" ry="95" fill="#ffe880" opacity="0.45"/>
  ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${200 + i * 220}" cy="${120 + (i % 3) * 30}" rx="${80 + (i % 3) * 20}" ry="${30 + (i % 2) * 10}" fill="#fff" opacity="0.35" filter="url(#mist)"/>`).join('')}
  <path d="M0 680 C320 620 480 640 720 700 C920 750 1100 720 1400 680 C1600 655 1780 670 1920 690 L1920 1080 L0 1080 Z" fill="url(#grass)"/>
  <path d="M-40 920 C280 860 520 880 760 940 C980 990 1180 960 1480 910 C1680 875 1820 890 1960 920 L1960 1080 L-40 1080 Z" fill="#68c8e8" opacity="0.82"/>
  <path d="M-60 960 C200 930 420 945 640 980 C860 1015 1080 995 1320 965 C1560 935 1740 948 1980 970" fill="none" stroke="#88e8ff" stroke-width="4" opacity="0.35"/>
  <path d="M-40 720 C260 660 480 660 720 710 C940 755 1120 720 1400 670 C1580 640 1760 655 1960 680" fill="none" stroke="#b88858" stroke-width="88" stroke-linecap="round" opacity="0.42"/>
  <path d="M360 120 C480 280 600 420 760 560 C860 650 960 760 1080 880" fill="none" stroke="#b88858" stroke-width="58" stroke-linecap="round" opacity="0.32"/>
  <path d="M80 620 L340 580 L380 820 L110 850 Z" fill="#e8c858" opacity="0.88"/>
  ${Array.from({ length: 5 }, (_, i) => `<line x1="${100 + i * 55}" y1="650" x2="${130 + i * 55}" y2="780" stroke="#a88830" stroke-width="6" opacity="0.4"/>`).join('')}
  ${placements.map(([x, y, w, h, b, ex]) => detailedHouse(x, y, w, h, b.roof, b.wall, b.accent, b.label, ex)).join('')}
  <circle cx="690" cy="500" r="48" fill="#9ed9ff" stroke="#f8fff4" stroke-width="12"/>
  <circle cx="668" cy="482" r="10" fill="#fff"/>
  <path d="M610 545 C650 575 740 575 778 540" fill="none" stroke="#6f8d72" stroke-width="12" stroke-linecap="round"/>
  ${Array.from({ length: 12 }, (_, i) => `<circle cx="${140 + i * 150}" cy="${780 + (i % 2) * 20}" r="5" fill="#ffd878" opacity="0.65"/>`).join('')}
  <text x="960" y="80" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="900" fill="#fff" opacity="0.55">Havre des Brumes</text>
</svg>`
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

export { buildingIconSvg }
