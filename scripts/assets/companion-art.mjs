import { LEVELS } from './data.mjs'

export const escape = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

function bgLayer(level, [a, b, c]) {
  const meta = LEVELS[level]
  const props = {
    day: `<circle cx="420" cy="120" r="70" fill="#fff8d0" opacity="0.9"/>
      <circle cx="450" cy="95" r="55" fill="#ffe880" opacity="0.5"/>`,
    warm: `<circle cx="380" cy="100" r="50" fill="#ffd080" opacity="0.45"/>
      ${Array.from({ length: 6 }, (_, i) => `<circle cx="${80 + i * 70}" cy="${600 + (i % 2) * 20}" r="8" fill="#ff88aa" opacity="0.35"/>`).join('')}`,
    moon: `<circle cx="400" cy="110" r="48" fill="#fff8f0" opacity="0.92"/>
      <circle cx="418" cy="98" r="42" fill="${b}" opacity="0.85"/>
      ${Array.from({ length: 12 }, (_, i) => `<circle cx="${40 + i * 38}" cy="${30 + (i % 3) * 18}" r="1.5" fill="#fff" opacity="0.8"/>`).join('')}`,
    candle: `<rect width="512" height="704" fill="url(#bg)"/>
      <ellipse cx="256" cy="680" rx="220" ry="80" fill="#000" opacity="0.35"/>
      ${[120, 256, 392].map((x) => `<ellipse cx="${x}" cy="620" rx="28" ry="12" fill="#ffb060" opacity="0.25"/>
        <rect x="${x - 4}" y="560" width="8" height="60" fill="#ffd080" opacity="0.5"/>
        <ellipse cx="${x}" cy="558" rx="10" ry="14" fill="#fff8c0" opacity="0.85"/>`).join('')}`,
    ember: `<rect width="512" height="704" fill="url(#bg)"/>
      ${Array.from({ length: 18 }, (_, i) => `<circle cx="${60 + (i * 27) % 400}" cy="${500 + (i * 13) % 180}" r="${2 + (i % 3)}" fill="#ff88aa" opacity="${0.2 + (i % 4) * 0.12}"/>`).join('')}
      <ellipse cx="256" cy="690" rx="240" ry="90" fill="#000" opacity="0.42"/>`,
  }

  const sceneHints = {
    1: `<path d="M0 520 Q128 480 256 500 T512 520 L512 704 L0 704 Z" fill="#88c878" opacity="0.5"/>
      <rect x="40" y="420" width="80" height="100" rx="8" fill="#a87848" opacity="0.35"/>
      <polygon points="40,420 80,360 120,420" fill="#885838" opacity="0.4"/>`,
    2: `<rect x="0" y="480" width="512" height="224" fill="#f8e0c8" opacity="0.55"/>
      <ellipse cx="256" cy="520" rx="180" ry="40" fill="#fff" opacity="0.25"/>
      ${Array.from({ length: 5 }, (_, i) => `<circle cx="${100 + i * 80}" cy="470" r="16" fill="#ff98b8" opacity="0.45"/>`).join('')}`,
    3: `<rect x="0" y="400" width="512" height="304" fill="#281838" opacity="0.35"/>
      <rect x="60" y="320" width="392" height="24" rx="4" fill="#584868" opacity="0.5"/>
      <rect x="80" y="344" width="352" height="8" fill="#786888" opacity="0.35"/>`,
    4: `<rect x="0" y="380" width="512" height="324" fill="#180818" opacity="0.55"/>
      <rect x="40" y="430" width="432" height="180" rx="28" fill="#3a2040" opacity="0.65"/>
      <path d="M40 520 Q256 480 472 520" fill="#fff" opacity="0.08"/>`,
    5: `<rect x="0" y="360" width="512" height="344" fill="#100810" opacity="0.62"/>
      <rect x="30" y="410" width="452" height="200" rx="32" fill="#401830" opacity="0.7"/>
      <path d="M30 500 C120 470 392 470 482 500 L482 610 L30 610 Z" fill="#fff8f8" opacity="0.12"/>
      ${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${70 + i * 55}" cy="${560 + (i % 2) * 8}" rx="10" ry="5" fill="#ff6088" opacity="0.35"/>`).join('')}`,
  }

  return `
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="${a}"/>
      <stop offset="0.55" stop-color="${b}"/>
      <stop offset="1" stop-color="${c}"/>
    </linearGradient>
    <rect width="512" height="704" fill="url(#bg)"/>
    ${sceneHints[level]}
    ${props[meta.mood] ?? ''}`
}

function hairPath(style, hairA, hairB) {
  const base = `url(#hair)`
  const styles = {
    long: `<path d="M148 250 C120 160 170 70 256 62 C350 54 396 140 372 260 C340 210 300 188 256 186 C210 184 176 208 148 250 Z" fill="${base}"/>
      <path d="M152 260 C130 340 128 420 168 480 C188 380 192 300 178 248 Z" fill="${base}"/>
      <path d="M360 248 C382 320 386 400 348 478 C332 378 328 298 342 246 Z" fill="${base}"/>`,
    wavy: `<path d="M155 248 C130 150 190 75 258 68 C338 60 390 150 365 255 C330 205 290 182 256 180 C218 178 182 200 155 248 Z" fill="${base}"/>
      <path d="M160 255 C145 330 150 410 185 460 C195 360 188 290 172 250 Z" fill="${base}"/>
      <path d="M352 250 C368 325 362 405 328 458 C318 358 325 288 340 248 Z" fill="${base}"/>`,
    bob: `<path d="M160 250 C145 170 195 80 256 74 C318 68 368 170 352 252 C320 210 290 192 256 190 C222 188 188 210 160 250 Z" fill="${base}"/>
      <path d="M162 252 C155 310 158 360 175 390 C182 330 180 280 172 250 Z" fill="${base}"/>
      <path d="M350 250 C358 308 355 358 338 388 C332 328 334 278 342 248 Z" fill="${base}"/>`,
    ponytail: `<path d="M158 248 C135 165 188 78 256 72 C328 66 378 160 358 248 C325 205 292 186 256 184 C220 182 186 205 158 248 Z" fill="${base}"/>
      <path d="M300 120 C340 80 380 90 392 140 C400 180 370 220 340 200 C360 160 350 120 300 120 Z" fill="${base}"/>`,
    braid: `<path d="M156 246 C132 158 184 74 256 68 C332 62 382 152 360 248 C328 206 294 186 256 184 C216 182 182 204 156 246 Z" fill="${base}"/>
      <path d="M248 200 C238 280 242 360 256 440 C270 360 274 280 264 200 Z" fill="${base}" opacity="0.9"/>`,
    medium: `<path d="M162 252 C140 168 198 82 256 76 C318 70 372 168 352 254 C318 212 288 194 256 192 C224 190 192 212 162 252 Z" fill="${base}"/>`,
    short: `<path d="M168 252 C152 180 200 88 256 82 C314 76 360 178 344 254 C312 218 286 202 256 200 C226 198 198 218 168 252 Z" fill="${base}"/>`,
    messy: `<path d="M150 250 C125 155 185 68 256 62 C335 56 395 145 368 258 C335 208 298 184 256 182 C212 180 178 205 150 250 Z" fill="${base}"/>
      <path d="M140 230 C110 200 120 160 150 140" fill="none" stroke="${hairB}" stroke-width="12" stroke-linecap="round"/>
      <path d="M372 228 C400 195 388 155 358 138" fill="none" stroke="${hairB}" stroke-width="12" stroke-linecap="round"/>`,
    curly: `<path d="M154 248 C128 155 182 70 256 64 C338 58 394 148 366 256 C332 204 296 182 256 180 C214 178 180 202 154 248 Z" fill="${base}"/>
      ${[180, 210, 240, 272, 304, 334].map((x) => `<circle cx="${x}" cy="130" r="18" fill="${base}"/>`).join('')}`,
    elf: `<path d="M152 248 C128 158 178 72 256 66 C340 60 392 150 368 252 C334 208 298 186 256 184 C212 182 178 204 152 248 Z" fill="${base}"/>
      <path d="M170 100 L158 40 L188 88 Z" fill="${base}"/>
      <path d="M342 100 L354 40 L324 88 Z" fill="${base}"/>`,
    twintail: `<path d="M160 248 C138 165 192 78 256 72 C322 66 374 162 354 248 C322 206 290 186 256 184 C222 182 188 204 160 248 Z" fill="${base}"/>
      <path d="M180 130 C150 80 120 100 130 160 C145 130 165 120 180 130 Z" fill="${base}"/>
      <path d="M332 130 C362 80 392 100 382 160 C367 130 347 120 332 130 Z" fill="${base}"/>`,
    side: `<path d="M158 250 C136 168 192 76 256 70 C322 64 376 168 356 252 C322 210 290 190 256 188 C222 186 188 208 158 250 Z" fill="${base}"/>
      <path d="M330 140 C370 100 400 130 385 200 C360 160 345 145 330 140 Z" fill="${base}"/>`,
    elegant: `<path d="M152 246 C128 152 182 68 256 62 C338 56 390 148 366 250 C332 206 296 184 256 182 C216 180 182 202 152 246 Z" fill="${base}"/>
      <path d="M256 62 C256 120 256 180 256 240" fill="none" stroke="${hairB}" stroke-width="3" opacity="0.3"/>`,
  }
  return styles[style] ?? styles.long
}

function outfitLayer(level, accent, build) {
  const isNeutral = build === 'n'
  const meta = LEVELS[level].outfit

  const outfits = {
    travel: `<path d="M88 420 C130 340 190 320 256 320 C322 320 382 340 424 420 L448 704 L72 704 Z" fill="#fff8f4" filter="url(#shadow)"/>
      <path d="M108 415 C150 350 200 335 256 335 C312 335 362 350 404 415 C360 450 310 468 256 468 C202 468 152 450 108 415 Z" fill="${accent}" opacity="0.55"/>
      <path d="M180 320 L256 280 L332 320 L332 380 L180 380 Z" fill="${accent}" opacity="0.35"/>
      <rect x="220" y="290" width="72" height="40" rx="12" fill="#fff" opacity="0.5"/>`,
    date: `<path d="M98 430 C138 360 195 345 256 345 C317 345 374 360 414 430 L436 704 L78 704 Z" fill="#fff4f8" filter="url(#shadow)"/>
      <path d="M118 425 C158 365 205 352 256 352 C307 352 354 365 394 425 C348 458 302 472 256 472 C210 472 164 458 118 425 Z" fill="${accent}" opacity="0.72"/>
      <path d="M200 345 C220 310 232 295 256 295 C280 295 292 310 312 345" fill="none" stroke="${accent}" stroke-width="14" opacity="0.45"/>`,
    gown: `<path d="M110 435 C150 365 200 350 256 350 C312 350 362 365 402 435 L422 704 L90 704 Z" fill="#1a1028" filter="url(#shadow)"/>
      <path d="M130 430 C168 372 210 358 256 358 C302 358 344 372 382 430 C340 462 298 476 256 476 C214 476 172 462 130 430 Z" fill="${accent}" opacity="0.88"/>
      <path d="M210 350 C228 300 240 278 256 268 C272 278 284 300 302 350" fill="${accent}" opacity="0.65"/>
      <ellipse cx="256" cy="318" rx="52" ry="18" fill="#ffd8e8" opacity="0.35"/>`,
    robe: `<path d="M100 440 C145 380 200 365 256 365 C312 365 367 380 412 440 L430 704 L82 704 Z" fill="#fff0f8" opacity="0.92" filter="url(#shadow)"/>
      <path d="M130 438 C172 395 215 382 256 382 C297 382 340 395 382 438 C342 468 300 482 256 482 C212 482 170 468 130 438 Z" fill="${accent}" opacity="0.45"/>
      <path d="M195 365 C215 320 235 300 256 292 C277 300 297 320 317 365" fill="none" stroke="#fff" stroke-width="10" opacity="0.55"/>
      <path d="M80 520 Q256 480 432 520" fill="#fff" opacity="0.18"/>`,
    chemise: `<path d="M95 445 C140 390 195 375 256 375 C317 375 372 390 417 445 L432 704 L80 704 Z" fill="#fff8fc" opacity="0.95" filter="url(#shadow)"/>
      <path d="M125 442 C168 402 210 388 256 388 C302 388 344 402 387 442 C345 472 302 486 256 486 C210 486 167 472 125 442 Z" fill="${accent}" opacity="0.38"/>
      <path d="M200 375 C218 330 236 308 256 300 C276 308 294 330 312 375" fill="#fff4f8" opacity="0.85"/>
      <path d="M228 300 L256 268 L284 300" fill="none" stroke="#ffd0e0" stroke-width="6" opacity="0.65"/>
      <path d="M70 530 Q256 495 442 530" fill="#fff" opacity="0.22"/>
      <ellipse cx="256" cy="540" rx="140" ry="30" fill="#fff" opacity="0.12"/>`,
  }

  if (isNeutral && level >= 3) {
    return `<path d="M100 420 C140 350 200 335 256 335 C312 335 372 350 412 420 L430 704 L86 704 Z" fill="#2a2848" filter="url(#shadow)"/>
      <path d="M130 415 C170 365 210 352 256 352 C302 352 342 365 382 415 C342 448 300 462 256 462 C212 462 170 448 130 415 Z" fill="${accent}" opacity="0.65"/>
      ${level >= 4 ? `<path d="M200 335 L256 300 L312 335" fill="none" stroke="#fff" stroke-width="8" opacity="0.35"/>` : ''}`
  }

  return outfits[meta] ?? outfits.travel
}

function face(skin, eye, blush, level) {
  const blushOpacity = LEVELS[level].blush
  const eyeStyle = level >= 4 ? 'half' : level >= 2 ? 'soft' : 'bright'
  const mouth = level >= 5 ? 'open' : level >= 3 ? 'smile' : 'grin'

  const eyes = {
    bright: `<ellipse cx="220" cy="268" rx="14" ry="16" fill="#fff"/><ellipse cx="292" cy="268" rx="14" ry="16" fill="#fff"/>
      <circle cx="224" cy="270" r="9" fill="${eye}"/><circle cx="296" cy="270" r="9" fill="${eye}"/>
      <circle cx="227" cy="266" r="3" fill="#fff"/><circle cx="299" cy="266" r="3" fill="#fff"/>`,
    soft: `<ellipse cx="220" cy="270" rx="13" ry="14" fill="#fff"/><ellipse cx="292" cy="270" rx="13" ry="14" fill="#fff"/>
      <ellipse cx="224" cy="272" rx="8" ry="9" fill="${eye}"/><ellipse cx="296" cy="272" rx="8" ry="9" fill="${eye}"/>`,
    half: `<path d="M206 268 Q220 262 234 268" fill="none" stroke="${eye}" stroke-width="5" stroke-linecap="round"/>
      <path d="M278 268 Q292 262 306 268" fill="none" stroke="${eye}" stroke-width="5" stroke-linecap="round"/>`,
  }

  const mouths = {
    grin: `<path d="M228 318 Q256 338 284 318" fill="none" stroke="#c07080" stroke-width="6" stroke-linecap="round"/>`,
    smile: `<path d="M232 322 Q256 334 280 322" fill="none" stroke="#b86878" stroke-width="5" stroke-linecap="round"/>`,
    open: `<ellipse cx="256" cy="328" rx="12" ry="8" fill="#d87888" opacity="0.65"/>
      <path d="M244 322 Q256 318 268 322" fill="none" stroke="#b85868" stroke-width="4" stroke-linecap="round"/>`,
  }

  return `<ellipse cx="256" cy="278" rx="88" ry="98" fill="${skin}" filter="url(#shadow)"/>
    ${eyes[eyeStyle]}
    ${mouths[mouth]}
    <ellipse cx="188" cy="302" rx="22" ry="14" fill="#ff8898" opacity="${blushOpacity}"/>
    <ellipse cx="324" cy="302" rx="22" ry="14" fill="#ff8898" opacity="${blushOpacity}"/>`
}

function accessory(type, accent, level) {
  const items = {
    staff: `<rect x="340" y="200" width="8" height="220" rx="4" fill="#8a6848"/><circle cx="344" cy="190" r="16" fill="${accent}" opacity="0.85"/>`,
    coin: `<circle cx="360" cy="380" r="22" fill="#ffd848" stroke="#c89830" stroke-width="3"/>`,
    sword: `<rect x="350" y="240" width="6" height="160" fill="#b8c8d8"/><rect x="338" y="380" width="30" height="8" rx="2" fill="#886848"/>`,
    spice: `<circle cx="355" cy="370" r="18" fill="#e85848" opacity="0.8"/><circle cx="365" cy="360" r="8" fill="#ffd848"/>`,
    flower: `<circle cx="358" cy="365" r="14" fill="#ff98c8"/><circle cx="348" cy="358" r="10" fill="#ffb8d8"/>`,
    lute: `<ellipse cx="360" cy="390" rx="28" ry="38" fill="#c89858" opacity="0.85"/><circle cx="360" cy="340" r="6" fill="#886838"/>`,
    hammer: `<rect x="350" y="300" width="10" height="100" fill="#886848"/><rect x="332" y="300" width="46" height="22" rx="4" fill="#787878"/>`,
    moon: `<circle cx="360" cy="220" r="24" fill="#fff8d0" opacity="0.9"/><circle cx="372" cy="212" r="20" fill="${accent}" opacity="0.5"/>`,
    map: `<rect x="330" y="360" width="50" height="38" rx="4" fill="#f8e8c8" stroke="#a88858" stroke-width="2"/>`,
    needle: `<line x1="350" y1="320" x2="370" y2="400" stroke="#c0c0d8" stroke-width="3"/>`,
    pearl: `<circle cx="360" cy="370" r="16" fill="#e8f8ff" stroke="#88c8e8" stroke-width="2"/>`,
    book: `<rect x="332" y="350" width="44" height="34" rx="3" fill="#684838"/><rect x="338" y="356" width="32" height="4" fill="#ffd878"/>`,
    vial: `<path d="M350 340 L358 340 L362 380 L346 380 Z" fill="#88d8ff" opacity="0.75"/>`,
    bell: `<path d="M350 360 L370 360 L365 390 L355 390 Z" fill="#ffd848"/><circle cx="360" cy="355" r="5" fill="#c89830"/>`,
    rose: `<circle cx="358" cy="368" r="14" fill="#802848"/><circle cx="352" cy="362" r="8" fill="#a83858"/>`,
  }
  return level <= 2 ? (items[type] ?? '') : ''
}

function poseOffset(level) {
  const pose = LEVELS[level].pose
  const map = {
    wave: 'translate(0, 0)',
    shy: 'translate(0, 8)',
    lean: 'translate(0, 18) scale(1.02)',
    recline: 'translate(0, 28) scale(1.05)',
    intimate: 'translate(0, 36) scale(1.08)',
  }
  return map[pose] ?? map.wave
}

function handGesture(level) {
  if (level === 1) {
    return `<ellipse cx="130" cy="360" rx="28" ry="22" fill="#ffe2d4" transform="rotate(-20 130 360)"/>
      <path d="M118 340 L128 320 M128 345 L138 325 M138 350 L148 330" stroke="#e8c8b8" stroke-width="4" stroke-linecap="round"/>`
  }
  if (level === 2) {
    return `<ellipse cx="145" cy="350" rx="24" ry="20" fill="#ffe2d4" transform="rotate(-8 145 350)"/>`
  }
  return ''
}

export function companionSvg(companion, level) {
  const [id, name, role, hairA, hairB, eye, skin, accent, acc, hairStyle, build] = companion
  const meta = LEVELS[level]
  const [bgA, bgB, bgC] = meta.bg

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="704" viewBox="0 0 512 704">
  <defs>
    <linearGradient id="hair" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="${hairA}"/>
      <stop offset="1" stop-color="${hairB}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#2a1838" flood-opacity="0.32"/>
    </filter>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="8" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${bgLayer(level, [bgA, bgB, bgC])}
  <g transform="${poseOffset(level)}">
    ${outfitLayer(level, accent, build)}
    ${face(skin, eye, meta.blush, level)}
    ${hairPath(hairStyle, hairA, hairB)}
    ${handGesture(level)}
    ${accessory(acc, accent, level)}
  </g>
  <rect x="0" y="620" width="512" height="84" fill="url(#footerFade)" opacity="0.92"/>
  <defs>
    <linearGradient id="footerFade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000" stop-opacity="${level >= 4 ? 0.55 : 0.38}"/>
    </linearGradient>
  </defs>
  <text x="256" y="648" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="28" fill="#fff">${escape(name)}</text>
  <text x="256" y="676" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="16" fill="#ffd8e8">${escape(meta.subtitle)} · Niv. ${level}</text>
  <rect x="24" y="24" width="72" height="32" rx="16" fill="#fff" opacity="${level >= 4 ? 0.18 : 0.55}"/>
  <text x="60" y="46" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-weight="800" font-size="16" fill="${level >= 4 ? '#ffd8e8' : '#6f3aa0'}">★${level}</text>
</svg>`
}
