/**
 * Importe le pack Event Disagrea vers public/assets/.
 * - Compagnons : cutout + background par palier + chibi
 * - Myrions event : cutout capture + chibi dressage (+ chimerelle LR)
 * - Fonds mini-jeux event : chasse + enclos dressage (mobile + PC)
 *
 * Usage: node scripts/import-disagrea-assets.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import sharp from 'sharp'
import { publicMinigamePaths, repoRoot } from './minigame-asset-paths.mjs'

const eventRoot = join(repoRoot, 'assets', 'event-disagrea')
const generatedRoot = join(eventRoot, 'generated')
const backgroundsRoot = join(eventRoot, 'backgrounds')

const companionsPublic = publicMinigamePaths.companions
const captureCutout = publicMinigamePaths.captureCutout
const dressageChibi = publicMinigamePaths.dressageChibi
const captureBiomes = publicMinigamePaths.captureBiomes
const dressageEnclosures = publicMinigamePaths.dressageEnclosures

const DISAGREA_COMPANIONS = ['etna', 'flonne', 'laharl', 'pleinair']

const AFFINITY_FOLDER = {
  etna: 'Etna',
  flonne: 'Flonne',
  laharl: 'Laharl',
  pleinair: 'Pleinair',
}

const MYRION_IDS = [
  'prinnettenoire',
  'chirodemon',
  'cranexplose',
  'explosia',
  'prinnetteblanche',
  'cupichoc',
  'palabielle',
  'archanielle',
  'chiroscarf',
  'flammecaille',
  'royalet',
  'supremarc',
  'lapichon',
  'noeudino',
  'dormille',
  'dreamille',
  'chimerelle',
]

function sampleKeyColor(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  const counts = new Map()
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4
    if (data[i + 3] < 8) continue
    const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  let best = [207, 207, 207]
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = key.split(',').map(Number)
    }
  }
  return best
}

function isMagentaKey(key) {
  return (
    key[0] >= 130 &&
    key[2] >= 100 &&
    key[1] <= 130 &&
    key[0] > key[1] + 28 &&
    key[2] > key[1] + 28
  )
}

function isNeutral(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b) < 32
}

function lightness(r, g, b) {
  return (r + g + b) / 3
}

function colorDist(r, g, b, r2, g2, b2) {
  return Math.max(Math.abs(r - r2), Math.abs(g - g2), Math.abs(b - b2))
}

function sampleEdgeColors(data, w, h) {
  const pts = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
    [Math.floor(w / 2), 0],
    [Math.floor(w / 2), h - 1],
    [0, Math.floor(h / 2)],
    [w - 1, Math.floor(h / 2)],
  ]
  const samples = []
  for (const [x, y] of pts) {
    const i = (y * w + x) * 4
    if (data[i + 3] >= 8) {
      samples.push([data[i], data[i + 1], data[i + 2]])
    }
  }
  return samples
}

function isEdgeBg(r, g, b, a, samples) {
  if (a < 8) return true
  if (isNeutral(r, g, b) && lightness(r, g, b) >= 176) return true
  for (const [sr, sg, sb] of samples) {
    if (colorDist(r, g, b, sr, sg, sb) > 40) continue
    const sl = lightness(sr, sg, sb)
    const pl = lightness(r, g, b)
    if (sl >= 145 && pl >= 145) return true
    if (sl <= 55 && pl <= 72) return true
  }
  return false
}

function floodEdges(data, w, h) {
  const samples = sampleEdgeColors(data, w, h)
  const visited = new Uint8Array(w * h)
  const queue = []

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return
    const pi = y * w + x
    if (visited[pi]) return
    const i = pi * 4
    if (!isEdgeBg(data[i], data[i + 1], data[i + 2], data[i + 3], samples)) return
    visited[pi] = 1
    queue.push(pi)
  }

  for (let x = 0; x < w; x += 1) {
    push(x, 0)
    push(x, h - 1)
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y)
    push(w - 1, y)
  }

  while (queue.length) {
    const pi = queue.pop()
    const i = pi * 4
    data[i + 3] = 0
    const x = pi % w
    const y = (pi - x) / w
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
}

function sampleBorderPalette(data, w, h, border = 8, minCount = 80) {
  const counts = new Map()
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (x >= border && x < w - border && y >= border && y < h - border) continue
      const i = (y * w + x) * 4
      if (data[i + 3] < 8) continue
      const key = `${data[i]},${data[i + 1]},${data[i + 2]}`
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => key.split(',').map(Number))
}

function matchesBorderPalette(r, g, b, palette, tolerance) {
  for (const [pr, pg, pb] of palette) {
    if (colorDist(r, g, b, pr, pg, pb) <= tolerance) return true
  }
  return false
}

function chromaKeyBorderPalette(rgba, w, h, palette, tolerance = 6) {
  for (let pi = 0; pi < w * h; pi += 1) {
    const i = pi * 4
    if (rgba[i + 3] < 8) continue
    if (matchesBorderPalette(rgba[i], rgba[i + 1], rgba[i + 2], palette, tolerance)) {
      rgba[i + 3] = 0
    }
  }
}

async function cutoutPng(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .rotate()
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const rgba = new Uint8ClampedArray(data)
  const { width: w, height: h } = info
  const key = sampleKeyColor(rgba, w, h)

  if (isMagentaKey(key)) {
    const palette = sampleBorderPalette(rgba, w, h)
    chromaKeyBorderPalette(rgba, w, h, palette, 6)
  } else {
    floodEdges(rgba, w, h)
  }

  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(rgba), {
    raw: { width: w, height: h, channels: 4 },
  })
    .trim()
    .png()
    .toFile(outputPath)
}

function copyPng(inputPath, outputPath) {
  if (!existsSync(inputPath)) {
    console.warn(`Missing ${inputPath}`)
    return false
  }
  mkdirSync(dirname(outputPath), { recursive: true })
  copyFileSync(inputPath, outputPath)
  return true
}

let imported = 0
let missing = 0

async function importCompanionCutouts() {
  for (const id of DISAGREA_COMPANIONS) {
    const srcDir = join(generatedRoot, 'companions', id)
    const destDir = join(companionsPublic, id)
    mkdirSync(destDir, { recursive: true })

    for (let level = 1; level <= 5; level += 1) {
      const src = join(srcDir, `cutout-${level}.png`)
      const dest = join(destDir, `cutout-${level}.png`)
      if (!existsSync(src)) {
        console.warn(`Missing ${src}`)
        missing += 1
        continue
      }
      console.log(`Cutout ${id} L${level}`)
      await cutoutPng(src, dest)
      imported += 1
    }

    const chibiSrc = join(srcDir, 'chibi.png')
    const chibiDest = join(destDir, 'chibi.png')
    if (existsSync(chibiSrc)) {
      console.log(`Chibi ${id}`)
      await cutoutPng(chibiSrc, chibiDest)
      imported += 1
    } else {
      console.warn(`Missing ${chibiSrc}`)
      missing += 1
    }
  }
}

function importCompanionBackgrounds() {
  for (const id of DISAGREA_COMPANIONS) {
    const folder = AFFINITY_FOLDER[id]
    const srcDir = join(backgroundsRoot, 'affinity', folder)
    const destDir = join(companionsPublic, id)
    mkdirSync(destDir, { recursive: true })

    const mobileEarly = join(srcDir, `${folder}_affinity_01_03_mobile.png`)
    const mobileLate = join(srcDir, `${folder}_affinity_04_05_mobile.png`)
    const pcEarly = join(srcDir, `${folder}_affinity_01_03_pc.png`)
    const pcLate = join(srcDir, `${folder}_affinity_04_05_pc.png`)

    for (const level of [1, 2, 3]) {
      const dest = join(destDir, `background-${level}.png`)
      if (copyPng(mobileEarly, dest)) {
        console.log(`Background ${id} L${level} (mobile 01-03)`)
        imported += 1
      } else {
        missing += 1
      }
      const destWide = join(destDir, `background-${level}-wide.png`)
      if (copyPng(pcEarly, destWide)) {
        console.log(`Background ${id} L${level} (pc 01-03)`)
        imported += 1
      } else {
        missing += 1
      }
    }

    for (const level of [4, 5]) {
      const dest = join(destDir, `background-${level}.png`)
      if (copyPng(mobileLate, dest)) {
        console.log(`Background ${id} L${level} (mobile 04-05)`)
        imported += 1
      } else {
        missing += 1
      }
      const destWide = join(destDir, `background-${level}-wide.png`)
      if (copyPng(pcLate, destWide)) {
        console.log(`Background ${id} L${level} (pc 04-05)`)
        imported += 1
      } else {
        missing += 1
      }
    }
  }
}

async function importMyrions() {
  for (const id of MYRION_IDS) {
    const cutoutSrc = join(generatedRoot, 'myrions', 'cutout', `${id}.png`)
    const cutoutDest = join(captureCutout, `${id}.png`)
    if (existsSync(cutoutSrc)) {
      console.log(`Myrion cutout ${id}`)
      await cutoutPng(cutoutSrc, cutoutDest)
      imported += 1
    } else {
      console.warn(`Missing ${cutoutSrc}`)
      missing += 1
    }

    const chibiSrc = join(generatedRoot, 'myrions', 'chibi', `${id}.png`)
    const chibiDest = join(dressageChibi, `${id}.png`)
    if (existsSync(chibiSrc)) {
      console.log(`Myrion chibi ${id}`)
      await cutoutPng(chibiSrc, chibiDest)
      imported += 1
    } else {
      console.warn(`Missing ${chibiSrc}`)
      missing += 1
    }
  }
}

function importMinigameBackgrounds() {
  const minigameDir = join(backgroundsRoot, 'minigame')
  const mappings = [
    {
      src: 'myrion_hunt_mobile.png',
      dest: join(captureBiomes, 'disagrea-event-portrait.png'),
      label: 'chasse mobile',
    },
    {
      src: 'myrion_hunt_pc.png',
      dest: join(captureBiomes, 'disagrea-event.png'),
      label: 'chasse pc',
    },
    {
      src: 'myrion_training_enclosure_mobile.png',
      dest: join(dressageEnclosures, 'disagrea-event-portrait.png'),
      label: 'dressage mobile',
    },
    {
      src: 'myrion_training_enclosure_pc.png',
      dest: join(dressageEnclosures, 'disagrea-event.png'),
      label: 'dressage pc',
    },
  ]

  for (const { src, dest, label } of mappings) {
    if (copyPng(join(minigameDir, src), dest)) {
      console.log(`Minigame BG ${label}`)
      imported += 1
    } else {
      missing += 1
    }
  }
}

console.log('Import Event Disagrea → public/assets/')
await importCompanionCutouts()
importCompanionBackgrounds()
await importMyrions()
importMinigameBackgrounds()

console.log(`Done — ${imported} fichiers importés, ${missing} manquants.`)
