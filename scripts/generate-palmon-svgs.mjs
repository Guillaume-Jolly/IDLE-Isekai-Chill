/**
 * Genere les SVG palmons (fond transparent) pour le mini-jeu capture + refuge.
 * Usage: node scripts/generate-palmon-svgs.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outFull = join(root, 'public/minigames/palmons')
const outChibi = join(root, 'public/minigames/palmons/chibi')

mkdirSync(outFull, { recursive: true })
mkdirSync(outChibi, { recursive: true })

/** @type {Record<string, { body: string; accent: string; dark: string; motif: string; rarity: string }>} */
const SPECIES = {
  'moon-sprout': { body: '#f5edd6', accent: '#8ecf7a', dark: '#3a6a48', motif: 'sprout', rarity: 'N' },
  'moon-hop': { body: '#e8eef8', accent: '#9bb8ff', dark: '#4a5888', motif: 'rabbit', rarity: 'R' },
  'moon-glow': { body: '#fff8e8', accent: '#ffe08a', dark: '#886a20', motif: 'star', rarity: 'SR' },
  'moon-queen': { body: '#f0e8ff', accent: '#c8a8ff', dark: '#5a4088', motif: 'crown', rarity: 'SSR' },
  'mist-wisp': { body: '#e8f4f4', accent: '#88c8c8', dark: '#3a6868', motif: 'wisp', rarity: 'N' },
  'mist-fox': { body: '#dfe8f0', accent: '#7aa8c8', dark: '#3a5068', motif: 'fox', rarity: 'R' },
  'mist-owl': { body: '#ece4d8', accent: '#a89878', dark: '#4a4030', motif: 'owl', rarity: 'SR' },
  'mist-spirit': { body: '#e8f0ff', accent: '#a8c8ff', dark: '#506888', motif: 'ghost', rarity: 'UR' },
  'spring-drop': { body: '#e8f8ff', accent: '#68c8f0', dark: '#2878a8', motif: 'drop', rarity: 'N' },
  'spring-koi': { body: '#ffe8e0', accent: '#ff9878', dark: '#984838', motif: 'koi', rarity: 'R' },
  'spring-pearl': { body: '#f8f0ff', accent: '#d8b8ff', dark: '#6858a8', motif: 'pearl', rarity: 'SSR' },
  'spring-angel': { body: '#fff8fc', accent: '#ffd8f0', dark: '#886878', motif: 'angel', rarity: 'LR' },
  'ember-puff': { body: '#ffe8d8', accent: '#ff9868', dark: '#884828', motif: 'puff', rarity: 'N' },
  'ember-salam': { body: '#f0e0d0', accent: '#e87848', dark: '#683018', motif: 'salamander', rarity: 'R' },
  'ember-phoenix': { body: '#fff0d8', accent: '#ffb848', dark: '#985818', motif: 'phoenix', rarity: 'SSR' },
  'star-shell': { body: '#fff0e8', accent: '#ffb8a8', dark: '#885848', motif: 'shell', rarity: 'N' },
  'star-crab': { body: '#ffe8e8', accent: '#ff7878', dark: '#883838', motif: 'crab', rarity: 'R' },
  'star-dolphin': { body: '#e8f4ff', accent: '#68b8ff', dark: '#2868a8', motif: 'dolphin', rarity: 'SR' },
  'star-leviathan': { body: '#d8e8ff', accent: '#4888ff', dark: '#184888', motif: 'leviathan', rarity: 'UR' },
  'snow-puff': { body: '#f4f8ff', accent: '#c8e0ff', dark: '#5878a8', motif: 'snowball', rarity: 'N' },
  'snow-bear': { body: '#eef4fc', accent: '#98b8d8', dark: '#405870', motif: 'bear', rarity: 'R' },
  'snow-yeti': { body: '#f0f4f8', accent: '#b0c8e0', dark: '#485868', motif: 'yeti', rarity: 'SR' },
  'snow-dragon': { body: '#e8f0ff', accent: '#88a8ff', dark: '#384878', motif: 'dragon', rarity: 'LR' },
}

const RARITY_GLOW = {
  N: '',
  R: '<circle cx="100" cy="118" r="88" fill="none" stroke="#5a9fd4" stroke-width="2" opacity="0.35"/>',
  SR: '<circle cx="100" cy="118" r="90" fill="none" stroke="#b49bff" stroke-width="3" opacity="0.45"/>',
  SSR: '<circle cx="100" cy="118" r="92" fill="none" stroke="#ffb347" stroke-width="3" opacity="0.55"/><circle cx="100" cy="118" r="86" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.4"/>',
  UR: '<circle cx="100" cy="118" r="94" fill="none" stroke="#ff6eb4" stroke-width="4" opacity="0.5"/>',
  LR: '<circle cx="100" cy="118" r="96" fill="none" stroke="#ffd700" stroke-width="4" opacity="0.65"/><circle cx="100" cy="118" r="88" fill="none" stroke="#fff" stroke-width="1" opacity="0.35"/>',
}

function eyes(dark) {
  return `
    <ellipse cx="82" cy="88" rx="10" ry="12" fill="#fff"/>
    <ellipse cx="118" cy="88" rx="10" ry="12" fill="#fff"/>
    <circle cx="84" cy="90" r="6" fill="${dark}"/>
    <circle cx="120" cy="90" r="6" fill="${dark}"/>
    <circle cx="86" cy="88" r="2" fill="#fff"/>
    <circle cx="122" cy="88" r="2" fill="#fff"/>
  `
}

function smile(dark) {
  return `<path d="M 88 108 Q 100 118 112 108" fill="none" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>`
}

function motifSvg(motif, accent, dark) {
  switch (motif) {
    case 'sprout':
      return `<path d="M 100 42 Q 88 58 100 72 Q 112 58 100 42" fill="${accent}"/><ellipse cx="100" cy="38" rx="14" ry="8" fill="${accent}" opacity="0.8"/>`
    case 'rabbit':
      return `<ellipse cx="78" cy="52" rx="10" ry="28" fill="${accent}"/><ellipse cx="122" cy="52" rx="10" ry="28" fill="${accent}"/>`
    case 'star':
      return `<polygon points="100,34 106,52 126,52 110,64 116,82 100,70 84,82 90,64 74,52 94,52" fill="${accent}"/>`
    case 'crown':
      return `<path d="M 72 58 L 80 42 L 100 52 L 120 42 L 128 58 Z" fill="${accent}"/><circle cx="100" cy="48" r="6" fill="#ffd700"/>`
    case 'wisp':
      return `<ellipse cx="100" cy="48" rx="24" ry="16" fill="${accent}" opacity="0.55"/>`
    case 'fox':
      return `<polygon points="68,72 78,38 88,68" fill="${accent}"/><polygon points="132,72 122,38 112,68" fill="${accent}"/>`
    case 'owl':
      return `<ellipse cx="78" cy="62" rx="14" ry="18" fill="${accent}"/><ellipse cx="122" cy="62" rx="14" ry="18" fill="${accent}"/>`
    case 'ghost':
      return `<path d="M 72 48 Q 100 28 128 48 L 128 72 Q 100 88 72 72 Z" fill="${accent}" opacity="0.5"/>`
    case 'drop':
      return `<path d="M 100 36 Q 84 58 100 78 Q 116 58 100 36" fill="${accent}"/>`
    case 'koi':
      return `<path d="M 60 100 Q 100 60 140 100 Q 100 80 60 100" fill="${accent}" opacity="0.7"/>`
    case 'pearl':
      return `<circle cx="100" cy="44" r="16" fill="${accent}"/><circle cx="94" cy="40" r="4" fill="#fff" opacity="0.7"/>`
    case 'angel':
      return `<ellipse cx="68" cy="90" rx="18" ry="28" fill="${accent}" opacity="0.45"/><ellipse cx="132" cy="90" rx="18" ry="28" fill="${accent}" opacity="0.45"/>`
    case 'puff':
      return `<circle cx="100" cy="44" r="14" fill="${accent}" opacity="0.6"/>`
    case 'salamander':
      return `<path d="M 140 130 Q 160 110 150 95" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>`
    case 'phoenix':
      return `<path d="M 52 110 Q 40 70 60 50 Q 80 70 52 110" fill="${accent}" opacity="0.7"/><path d="M 148 110 Q 160 70 140 50 Q 120 70 148 110" fill="${accent}" opacity="0.7"/>`
    case 'shell':
      return `<path d="M 76 48 Q 100 30 124 48 Q 100 62 76 48" fill="${accent}"/>`
    case 'crab':
      return `<path d="M 52 120 L 40 100 M 148 120 L 160 100" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`
    case 'dolphin':
      return `<path d="M 148 100 Q 130 80 110 90" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>`
    case 'leviathan':
      return `<path d="M 48 100 Q 30 80 40 60" fill="none" stroke="${accent}" stroke-width="5"/><path d="M 152 100 Q 170 80 160 60" fill="none" stroke="${accent}" stroke-width="5"/>`
    case 'snowball':
      return `<circle cx="88" cy="42" r="8" fill="#fff"/><circle cx="112" cy="46" r="6" fill="#fff"/>`
    case 'bear':
      return `<circle cx="72" cy="58" r="12" fill="${accent}"/><circle cx="128" cy="58" r="12" fill="${accent}"/>`
    case 'yeti':
      return `<ellipse cx="100" cy="50" rx="30" ry="20" fill="${accent}" opacity="0.35"/>`
    case 'dragon':
      return `<path d="M 52 95 Q 35 75 45 55" fill="none" stroke="${accent}" stroke-width="5"/><path d="M 148 95 Q 165 75 155 55" fill="none" stroke="${accent}" stroke-width="5"/><polygon points="100,32 94,48 106,48" fill="${accent}"/>`
    default:
      return `<circle cx="100" cy="44" r="10" fill="${accent}"/>`
  }
}

function fullSvg(id, art) {
  const { body, accent, dark, motif, rarity } = art
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" role="img" aria-label="${id}">
  ${RARITY_GLOW[rarity] ?? ''}
  <ellipse cx="100" cy="200" rx="52" ry="10" fill="#000" opacity="0.12"/>
  <ellipse cx="100" cy="138" rx="58" ry="62" fill="${body}"/>
  <ellipse cx="100" cy="138" rx="52" ry="56" fill="${body}" stroke="${accent}" stroke-width="2" opacity="0.35"/>
  <circle cx="100" cy="82" r="44" fill="${body}"/>
  ${motifSvg(motif, accent, dark)}
  ${eyes(dark)}
  ${smile(dark)}
  <ellipse cx="72" cy="148" rx="14" ry="20" fill="${body}" stroke="${accent}" stroke-width="1.5"/>
  <ellipse cx="128" cy="148" rx="14" ry="20" fill="${body}" stroke="${accent}" stroke-width="1.5"/>
  <ellipse cx="82" cy="188" rx="16" ry="10" fill="${accent}" opacity="0.55"/>
  <ellipse cx="118" cy="188" rx="16" ry="10" fill="${accent}" opacity="0.55"/>
</svg>`
}

function chibiSvg(id, art) {
  const { body, accent, dark, motif } = art
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${id} chibi">
  <ellipse cx="32" cy="56" rx="18" ry="4" fill="#000" opacity="0.1"/>
  <ellipse cx="32" cy="38" rx="22" ry="20" fill="${body}"/>
  <circle cx="32" cy="24" r="16" fill="${body}"/>
  <circle cx="26" cy="22" r="3" fill="#fff"/><circle cx="38" cy="22" r="3" fill="#fff"/>
  <circle cx="27" cy="23" r="1.8" fill="${dark}"/><circle cx="39" cy="23" r="1.8" fill="${dark}"/>
  <path d="M 26 30 Q 32 34 38 30" fill="none" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="32" cy="14" r="5" fill="${accent}"/>
</svg>`
}

for (const [id, art] of Object.entries(SPECIES)) {
  writeFileSync(join(outFull, `${id}.svg`), fullSvg(id, art), 'utf8')
  writeFileSync(join(outChibi, `${id}.svg`), chibiSvg(id, art), 'utf8')
  console.log(`OK ${id}`)
}

console.log(`Generated ${Object.keys(SPECIES).length * 2} SVG files.`)

const guidesDir = join(root, 'public/minigames/guides')
mkdirSync(guidesDir, { recursive: true })

const taliaPointSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 320" role="img" aria-label="Talia guide">
  <ellipse cx="120" cy="300" rx="70" ry="8" fill="#000" opacity="0.1"/>
  <ellipse cx="110" cy="200" rx="48" ry="55" fill="#c8a878"/>
  <ellipse cx="110" cy="130" r="42" fill="#f0c8a8"/>
  <path d="M 68 120 Q 55 180 62 240" fill="none" stroke="#d87848" stroke-width="14" stroke-linecap="round"/>
  <path d="M 152 120 Q 168 175 210 150 L 240 138" fill="none" stroke="#f0c8a8" stroke-width="12" stroke-linecap="round"/>
  <circle cx="240" cy="136" r="8" fill="#f0c8a8"/>
  <path d="M 88 88 Q 110 55 130 70 Q 150 85 145 110 Q 130 95 110 98 Q 90 95 88 88" fill="#e85828"/>
  <path d="M 130 70 Q 155 90 158 140 Q 145 130 130 125 Q 115 130 102 140 Q 105 90 130 70" fill="#e85828"/>
  <ellipse cx="98" cy="128" rx="8" ry="10" fill="#fff"/><ellipse cx="122" cy="128" rx="8" ry="10" fill="#fff"/>
  <circle cx="100" cy="130" r="5" fill="#3a8858"/><circle cx="124" cy="130" r="5" fill="#3a8858"/>
  <path d="M 104 142 Q 112 148 120 142" fill="none" stroke="#884838" stroke-width="2" stroke-linecap="round"/>
  <rect x="88" y="158" width="44" height="28" rx="6" fill="#586838"/>
  <rect x="92" y="186" width="36" height="22" rx="4" fill="#a89868"/>
  <path d="M 72 165 L 88 158 L 92 186 L 76 192 Z" fill="#c8a878" opacity="0.8"/>
</svg>`

writeFileSync(join(guidesDir, 'talia-point.svg'), taliaPointSvg, 'utf8')
console.log('OK talia-point.svg')
