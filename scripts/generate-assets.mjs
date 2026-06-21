import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { COMPANIONS, BUILDINGS } from './assets/data.mjs'
import { companionSvg } from './assets/companion-art.mjs'
import { villageSvg, heroBannerSvg, buildingIconSvg } from './assets/village-art.mjs'

const root = process.cwd()

async function renderPng(svg, outputPath, width) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(svg)).resize({ width }).png().toFile(outputPath)
}

console.log('Generating companion affinity art (levels 1-5)...')
for (const companion of COMPANIONS) {
  for (let level = 1; level <= 5; level += 1) {
    const file = path.join(root, 'public', 'companions', companion[0], `affinity-${level}.png`)
    await renderPng(companionSvg(companion, level), file, 768)
  }
}

console.log('Generating village panorama and hero banner...')
await renderPng(villageSvg(), path.join(root, 'public', 'village', 'panorama.png'), 1920)
await renderPng(heroBannerSvg(), path.join(root, 'public', 'village', 'hero-banner.png'), 1440)
await renderPng(heroBannerSvg(), path.join(root, 'public', 'assets', 'hero.png'), 1440)

console.log('Generating building icons...')
for (const building of BUILDINGS) {
  const file = path.join(root, 'public', 'buildings', `${building.id}.png`)
  await renderPng(buildingIconSvg(building), file, 256)
}

console.log('Done — generated companion, village, and building assets.')
