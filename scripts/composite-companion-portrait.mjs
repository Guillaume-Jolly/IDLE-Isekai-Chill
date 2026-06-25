/**
 * Superpose cutout + background → affinity-{level}.png (export flat legacy).
 *
 * Usage:
 *   node scripts/composite-companion-portrait.mjs
 *   node scripts/composite-companion-portrait.mjs lyra 3
 *   node scripts/composite-companion-portrait.mjs --all
 */
import { existsSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { COMPANIONS } from './assets/data.mjs'
import { publicMinigamePaths } from './minigame-asset-paths.mjs'

const companionsRoot = publicMinigamePaths.companions
const PORTRAIT_WIDTH = 768

function pathsFor(companionId, level) {
  const dir = join(companionsRoot, companionId)
  return {
    dir,
    cutout: join(dir, `cutout-${level}.png`),
    background: join(dir, `background-${level}.png`),
    output: join(dir, `affinity-${level}.png`),
  }
}

async function compositeOne(companionId, level) {
  const { cutout, background, output } = pathsFor(companionId, level)
  if (!existsSync(cutout)) {
    console.warn(`Skip ${companionId} L${level}: missing ${cutout}`)
    return false
  }
  if (!existsSync(background)) {
    console.warn(`Skip ${companionId} L${level}: missing ${background}`)
    return false
  }

  mkdirSync(pathsFor(companionId, level).dir, { recursive: true })

  const bg = sharp(background).resize(PORTRAIT_WIDTH, null, { fit: 'inside' })
  const bgMeta = await bg.metadata()
  const height = bgMeta.height ?? Math.round(PORTRAIT_WIDTH * (704 / 512))

  const cutoutBuf = await sharp(cutout)
    .resize(PORTRAIT_WIDTH, height, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  await sharp(await bg.png().toBuffer())
    .composite([{ input: cutoutBuf, gravity: 'center' }])
    .png()
    .toFile(output)

  console.log(`OK ${companionId} affinity-${level}.png`)
  return true
}

const args = process.argv.slice(2)
let ok = 0

if (args[0] === '--all') {
  for (const companion of COMPANIONS) {
    for (let level = 1; level <= 5; level += 1) {
      if (await compositeOne(companion[0], level)) ok += 1
    }
  }
} else if (args.length >= 2) {
  if (await compositeOne(args[0], Number(args[1]))) ok += 1
} else if (args.length === 1) {
  for (let level = 1; level <= 5; level += 1) {
    if (await compositeOne(args[0], level)) ok += 1
  }
} else {
  for (const companion of COMPANIONS) {
    const dir = join(companionsRoot, companion[0])
    if (!existsSync(dir)) continue
    const levels = new Set(
      readdirSync(dir)
        .map((file) => file.match(/^cutout-(\d)\.png$/)?.[1])
        .filter(Boolean)
        .map(Number),
    )
    for (const level of levels) {
      if (await compositeOne(companion[0], level)) ok += 1
    }
  }
}

console.log(`Done: ${ok} composite(s).`)
