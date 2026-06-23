/**
 * Génère des fonds biome portrait 9:16 depuis les PNG paysage existants.
 * Usage: node scripts/generate-biome-portraits.mjs
 */
import { existsSync, readdirSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { publicMinigamePaths } from './minigame-asset-paths.mjs'

const biomeDir = publicMinigamePaths.captureBiomes
const PORTRAIT_RATIO = 9 / 16

async function cropPortraitFromLandscape(inputPath, outputPath) {
  const meta = await sharp(inputPath).metadata()
  const width = meta.width ?? 0
  const height = meta.height ?? 1

  if (width <= height) {
    await sharp(inputPath).png().toFile(outputPath)
    console.log(`OK ${basename(outputPath)} ← already portrait (${width}x${height})`)
    return
  }

  const cropWidth = Math.min(width, Math.max(1, Math.round(height * PORTRAIT_RATIO)))
  const left = Math.max(0, Math.round((width - cropWidth) / 2))

  await sharp(inputPath)
    .extract({ left, top: 0, width: cropWidth, height })
    .png()
    .toFile(outputPath)

  console.log(
    `OK ${basename(outputPath)} ← center crop ${cropWidth}x${height} from ${basename(inputPath)} (${width}x${height})`,
  )
}

const files = readdirSync(biomeDir).filter(
  (file) => file.endsWith('.png') && !file.endsWith('-portrait.png'),
)

let generated = 0

for (const file of files) {
  const inputPath = join(biomeDir, file)
  const biomeId = file.replace(/\.png$/, '')
  const outputPath = join(biomeDir, `${biomeId}-portrait.png`)
  await cropPortraitFromLandscape(inputPath, outputPath)
  generated += 1
}

console.log(`Done: ${generated} portrait biome background(s).`)
