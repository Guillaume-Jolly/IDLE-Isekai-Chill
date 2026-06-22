/**
 * Redimensionne l image IA vers 6400×1080 exact et installe dans public/village/
 * Usage: node scripts/finalize-village-panorama.mjs <input.png>
 */
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { PANORAMA_HEIGHT, PANORAMA_WIDTH } from './assets/village-map-layout.mjs'

const input = process.argv[2]
if (!input) {
  console.error('Usage: node scripts/finalize-village-panorama.mjs <input.png>')
  process.exit(1)
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'public', 'village', 'panorama-base.webp')

const meta = await sharp(input).metadata()
console.log(`Source: ${meta.width}×${meta.height}`)

const targetRatio = PANORAMA_WIDTH / PANORAMA_HEIGHT
const cropHeight = Math.min(meta.height, Math.round(meta.width / targetRatio))
const top = Math.round((meta.height - cropHeight) * 0.62)

mkdirSync(dirname(out), { recursive: true })
await sharp(input)
  .extract({ left: 0, top, width: meta.width, height: cropHeight })
  .resize(PANORAMA_WIDTH, PANORAMA_HEIGHT, { kernel: sharp.kernel.lanczos3 })
  .webp({ quality: 85, effort: 6 })
  .toFile(out)

console.log(`Installed: ${out} (${PANORAMA_WIDTH}×${PANORAMA_HEIGHT})`)
