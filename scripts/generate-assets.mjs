import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()

const companions = [
  ['lyra', 'Lyra', 'Mage', '#bba4ff', '#7c56d9'],
  ['maeve', 'Maeve', 'Merchant', '#d98a4a', '#8d4a28'],
  ['seren', 'Seren', 'Knight', '#d7dce8', '#8d99b2'],
  ['nami', 'Nami', 'Cook', '#ff8f7d', '#d05262'],
  ['iris', 'Iris', 'Herbalist', '#8ee2c0', '#4aa982'],
  ['kael', 'Kael', 'Bard', '#7f91f2', '#4a57b8'],
  ['runa', 'Runa', 'Smith', '#d68b6f', '#854c3b'],
  ['solene', 'Solene', 'Priestess', '#f0e2a2', '#b49a42'],
  ['talia', 'Talia', 'Explorer', '#c49a62', '#7a5730'],
  ['mira', 'Mira', 'Tailor', '#f0a6d7', '#b94f95'],
  ['asha', 'Asha', 'Guardian', '#87d7ef', '#3c91ad'],
  ['elwen', 'Elwen', 'Archivist', '#bfdc8a', '#75914b'],
  ['noa', 'Noa', 'Alchemist', '#9ee0ff', '#487fd0'],
  ['sora', 'Sora', 'Tamer', '#ffc37a', '#d68132'],
  ['zelie', 'Zelie', 'Duchess', '#d28bd9', '#743f80'],
]

const levelMeta = {
  1: ['First meeting', '#fff7dd', '#a8dfff'],
  2: ['First date', '#ffe5f1', '#ffd18a'],
  3: ['Private talk', '#e9ddff', '#ffabc9'],
  4: ['Adult trust', '#3b2148', '#c55a97'],
  5: ['Max bond', '#24152e', '#f18ab9'],
}

const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function companionSvg([id, name, role, hairA, hairB], level) {
  const [title, bgA, bgB] = levelMeta[level]
  const dark = level >= 4
  const dress = dark ? '#fff0f7' : '#fff9fb'
  const accent = dark ? '#ffd0e5' : hairB
  const room = level === 1 ? 'Village gate' : level === 2 ? 'Cafe date' : level === 3 ? 'Moon room' : level === 4 ? 'Velvet room' : 'Star balcony'

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="704" viewBox="0 0 512 704">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${bgA}"/>
      <stop offset="1" stop-color="${bgB}"/>
    </linearGradient>
    <linearGradient id="hair" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${hairA}"/>
      <stop offset="1" stop-color="${hairB}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#3b2448" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="512" height="704" rx="44" fill="url(#bg)"/>
  <circle cx="78" cy="118" r="88" fill="#ffffff" opacity="0.32"/>
  <circle cx="436" cy="228" r="136" fill="#ffffff" opacity="0.18"/>
  <circle cx="260" cy="560" r="190" fill="#ffffff" opacity="0.18"/>
  <path d="M70 414 C120 340 180 320 256 320 C332 320 392 340 442 414 L474 704 H38 Z" fill="${dress}" filter="url(#shadow)"/>
  <path d="M112 408 C142 356 182 334 256 334 C330 334 370 356 400 408 C350 444 306 462 256 462 C206 462 162 444 112 408 Z" fill="${accent}" opacity="${dark ? '0.72' : '0.58'}"/>
  <ellipse cx="256" cy="264" rx="100" ry="116" fill="#ffd7c7" filter="url(#shadow)"/>
  <path d="M146 244 C132 154 184 90 260 88 C348 86 396 150 374 260 C342 226 308 200 256 198 C206 196 174 214 146 244 Z" fill="url(#hair)"/>
  <path d="M152 254 C132 300 132 360 160 404 C178 342 184 292 174 242 Z" fill="url(#hair)"/>
  <path d="M360 244 C386 298 386 358 352 406 C338 340 334 290 342 238 Z" fill="url(#hair)"/>
  <circle cx="220" cy="264" r="9" fill="#4d3144"/>
  <circle cx="292" cy="264" r="9" fill="#4d3144"/>
  <path d="M224 318 C246 336 270 336 292 318" fill="none" stroke="#9a5a69" stroke-width="8" stroke-linecap="round"/>
  <path d="M188 232 C210 218 232 218 246 230" fill="none" stroke="#4d3144" stroke-width="8" stroke-linecap="round" opacity="0.55"/>
  <path d="M266 230 C286 216 312 218 330 232" fill="none" stroke="#4d3144" stroke-width="8" stroke-linecap="round" opacity="0.55"/>
  <circle cx="154" cy="332" r="23" fill="${dark ? '#ffd0e5' : '#ffffff'}" opacity="0.42"/>
  <circle cx="358" cy="332" r="23" fill="${dark ? '#ffd0e5' : '#ffffff'}" opacity="0.42"/>
  <rect x="42" y="42" width="128" height="44" rx="22" fill="#ffffff" opacity="${dark ? '0.2' : '0.65'}"/>
  <text x="106" y="71" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="22" fill="${dark ? '#fff2f7' : '#6f3aa0'}">L${level}</text>
  <text x="256" y="586" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="${dark ? '#fff4f8' : '#33263a'}">${escape(name)}</text>
  <text x="256" y="626" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="${dark ? '#ffd7e9' : '#735d72'}">${escape(title)}</text>
  <text x="256" y="656" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="18" fill="${dark ? '#ffd7e9' : '#8c7488'}">${escape(role)} - ${escape(room)}</text>
</svg>`
}

function house(x, y, w, h, roof, wall, label) {
  const roofY = y - h * 0.32
  return `
  <g filter="url(#soft)">
    <path d="M${x - w * 0.58} ${y} L${x} ${roofY} L${x + w * 0.58} ${y} Z" fill="${roof}" stroke="#76543d" stroke-width="4"/>
    <rect x="${x - w * 0.45}" y="${y}" width="${w * 0.9}" height="${h}" rx="10" fill="${wall}" stroke="#87624a" stroke-width="4"/>
    <rect x="${x - 16}" y="${y + h * 0.44}" width="32" height="${h * 0.56}" rx="6" fill="#7f563d"/>
    <rect x="${x - w * 0.28}" y="${y + h * 0.22}" width="28" height="28" rx="6" fill="#9ed9ff"/>
    <rect x="${x + w * 0.16}" y="${y + h * 0.22}" width="28" height="28" rx="6" fill="#9ed9ff"/>
    <text x="${x}" y="${y + h + 34}" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="900" fill="#4f3b31">${escape(label)}</text>
  </g>`
}

function villageSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900" viewBox="0 0 1400 900">
  <defs>
    <linearGradient id="grass" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#bfe89d"/>
      <stop offset="0.52" stop-color="#f3df9b"/>
      <stop offset="1" stop-color="#a9db9c"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="180%">
      <feDropShadow dx="0" dy="16" stdDeviation="12" flood-color="#5c4a2d" flood-opacity="0.22"/>
    </filter>
  </defs>
  <rect width="1400" height="900" fill="url(#grass)"/>
  <circle cx="190" cy="730" r="220" fill="#f0cf75" opacity="0.55"/>
  <circle cx="1030" cy="120" r="250" fill="#77b96b" opacity="0.35"/>
  <circle cx="1040" cy="770" r="250" fill="#77b96b" opacity="0.28"/>
  <path d="M-80 820 C190 760 350 775 520 850 C650 910 760 950 950 885 C1100 835 1250 820 1480 870 L1480 930 L-80 930 Z" fill="#68c4d8" opacity="0.86"/>
  <path d="M-40 515 C230 420 455 420 680 470 C910 520 1090 472 1450 360" fill="none" stroke="#b78b58" stroke-width="92" stroke-linecap="round" opacity="0.5"/>
  <path d="M360 120 C455 265 555 400 695 520 C795 610 880 700 980 860" fill="none" stroke="#b78b58" stroke-width="62" stroke-linecap="round" opacity="0.38"/>
  <path d="M80 585 L320 545 L350 760 L95 785 Z" fill="#e7c45e" opacity="0.9"/>
  <path d="M88 614 L328 574 M96 646 L334 606 M104 678 L340 638 M112 710 L346 670" stroke="#ad8d2f" stroke-width="8" opacity="0.48"/>
  ${house(280, 430, 190, 150, '#d66b45', '#fff0cf', 'Auberge')}
  ${house(470, 210, 150, 118, '#8f6ed0', '#f2e6ff', 'Jardin')}
  ${house(860, 330, 160, 130, '#c65c8c', '#fff2d6', 'Atelier')}
  ${house(710, 145, 155, 110, '#72aee6', '#e5fbff', 'Source')}
  ${house(290, 690, 170, 115, '#d5a23e', '#fff4cf', 'Ferme')}
  ${house(1085, 210, 170, 132, '#8964c8', '#f3e8ff', 'Bibliotheque')}
  ${house(760, 650, 178, 135, '#df8f55', '#fff1df', 'Theatre')}
  ${house(1145, 525, 170, 130, '#df607e', '#fff4e8', 'Marche')}
  <circle cx="690" cy="480" r="40" fill="#9ed9ff" stroke="#f8fff4" stroke-width="10"/>
  <circle cx="668" cy="466" r="8" fill="#ffffff"/>
  <path d="M610 525 C640 555 725 555 762 520" fill="none" stroke="#6f8d72" stroke-width="10" stroke-linecap="round"/>
</svg>`
}

async function renderPng(svg, outputPath, width) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(svg)).resize({ width }).png().toFile(outputPath)
}

for (const companion of companions) {
  for (let level = 1; level <= 5; level += 1) {
    const file = path.join(root, 'public', 'companions', companion[0], `affinity-${level}.png`)
    await renderPng(companionSvg(companion, level), file, 512)
  }
}

await renderPng(villageSvg(), path.join(root, 'public', 'village', 'panorama.png'), 1400)

console.log('Generated companion and village PNG assets.')
