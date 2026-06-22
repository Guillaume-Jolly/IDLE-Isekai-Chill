import { access, mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { COMPANIONS, BUILDINGS } from './assets/data.mjs'
import { companionSvg } from './assets/companion-art.mjs'
import { scrollPanoramaSvg, heroBannerSvg, buildingIconSvg } from './assets/village-art.mjs'
import { villageSvgV1 } from './assets/village-art-v1.mjs'

const root = process.cwd()

async function renderPng(svg, outputPath, width) {
  await mkdir(path.dirname(outputPath), { recursive: true })
  await sharp(Buffer.from(svg)).resize({ width }).png().toFile(outputPath)
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

console.log('Generating companion affinity placeholders (levels 1-5, skip existing AI art)...')
let companionSkipped = 0
let companionGenerated = 0
for (const companion of COMPANIONS) {
  for (let level = 1; level <= 5; level += 1) {
    const file = path.join(root, 'public', 'companions', companion[0], `affinity-${level}.png`)
    if (await fileExists(file)) {
      companionSkipped += 1
      continue
    }
    await renderPng(companionSvg(companion, level), file, 768)
    companionGenerated += 1
  }
}
console.log(`  ${companionSkipped} existing portrait(s) kept, ${companionGenerated} placeholder(s) created.`)

console.log('Archiving village panorama v1...')
await renderPng(
  villageSvgV1(),
  path.join(root, 'public', 'village', 'panorama-v1.png'),
  1920,
)

console.log('Generating scroll panoramas by village stage (0-4)...')
for (let stage = 0; stage <= 4; stage += 1) {
  const file = path.join(root, 'public', 'village', `panorama-stage-${stage}.png`)
  await renderPng(scrollPanoramaSvg(stage), file, 6400)
}

console.log('Generating hero banner...')
await renderPng(heroBannerSvg(), path.join(root, 'public', 'village', 'hero-banner.png'), 1440)
await renderPng(heroBannerSvg(), path.join(root, 'public', 'assets', 'hero.png'), 1440)

console.log('Generating building icons...')
for (const building of BUILDINGS) {
  const file = path.join(root, 'public', 'buildings', `${building.id}.png`)
  await renderPng(buildingIconSvg(building), file, 256)
}

console.log('Done — companion, village scroll, v1 archive, and building assets.')
