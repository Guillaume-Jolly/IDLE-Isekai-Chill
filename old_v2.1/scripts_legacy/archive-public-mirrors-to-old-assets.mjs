/**
 * One-shot archive: move orphaned public/assets mirrors → old_assets/ mirror structure.
 * Run once 2026-06-25. Keeps redirect README.md in public/.
 * @deprecated After run — kept for audit trail only.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const oldAssets = join(root, 'old_assets')

const counts = {
  companionsAffinite: 0,
  companionsCutouts: 0,
  companionsChibis: 0,
  companionsNsfw: 0,
  backgroundCapture: 0,
  backgroundDressage: 0,
  myrionsCutout: 0,
  myrionsChibi: 0,
  myrionsSilhouette: 0,
  guides: 0,
  gacha: 0,
  references: 0,
  skippedReadme: 0,
  errors: [],
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

function moveFile(src, dest) {
  if (!existsSync(src)) return false
  ensureDir(dirname(dest))
  if (existsSync(dest)) {
    counts.errors.push(`dest exists: ${dest}`)
    return false
  }
  renameSync(src, dest)
  return true
}

/** Parse MYRIONS_SPECIES biomeId from generated catalog. */
function loadSpeciesBiomeMap() {
  const catalogPath = join(root, 'src/data/myrionsCatalog.generated.ts')
  const text = readFileSync(catalogPath, 'utf8')
  const map = new Map()
  const blockRe = /\{\s*"id":\s*"([^"]+)"[\s\S]*?"biomeId":\s*"([^"]+)"/g
  let m
  while ((m = blockRe.exec(text)) !== null) {
    map.set(m[1], m[2])
  }
  map.set('moussprout', 'disagrea-event')
  map.set('prinnettenoire', 'disagrea-event')
  return map
}

function mapCompanionFile(companionId, fileName) {
  const base = join(oldAssets, 'Compagnons', companionId)
  if (fileName === 'chibi.png') {
    return { dest: join(base, 'chibis', fileName), key: 'companionsChibis' }
  }
  if (/^affinity-\d+-nsfw\.png$/.test(fileName)) {
    return { dest: join(base, 'NSFW', fileName), key: 'companionsNsfw' }
  }
  if (/^affinity-\d+\.png$/.test(fileName)) {
    return { dest: join(base, 'affinite', fileName), key: 'companionsAffinite' }
  }
  if (/^emotion-.+\.png$/.test(fileName)) {
    return { dest: join(base, 'cutouts', fileName), key: 'companionsCutouts' }
  }
  return { dest: join(base, 'Autres', fileName), key: 'companionsCutouts' }
}

function mapBiomeBackground(srcPath, fileName) {
  const isCapture = srcPath.includes('capture/biomes') || srcPath.includes('capture\\biomes')
  const isDressage =
    srcPath.includes('dressage/enclosures') || srcPath.includes('dressage\\enclosures')
  if (!isCapture && !isDressage) return null

  if (fileName === 'disagrea-event-portrait.png') {
    return {
      dest: join(oldAssets, 'Background', 'disagrea-event', 'dressage-portrait.png'),
      key: 'backgroundDressage',
    }
  }

  const biomeId = fileName.replace(/-portrait\.png$/, '').replace(/\.png$/, '')
  const base = join(oldAssets, 'Background', biomeId)

  if (isCapture) {
    if (fileName.endsWith('-portrait.png')) {
      return { dest: join(base, 'capture-portrait.png'), key: 'backgroundCapture' }
    }
    return { dest: join(base, 'capture-wide.png'), key: 'backgroundCapture' }
  }
  if (fileName.endsWith('-portrait.png')) {
    return { dest: join(base, 'dressage-portrait.png'), key: 'backgroundDressage' }
  }
  return { dest: join(base, 'dressage-wide.png'), key: 'backgroundDressage' }
}

function mapMyrion(srcPath, fileName, speciesBiome) {
  const speciesId = fileName.replace(/\.png$/, '')
  const biomeId = speciesBiome.get(speciesId) ?? '_unknown-biome'
  let variant = 'cutout'
  let key = 'myrionsCutout'
  if (srcPath.includes('chibi')) {
    variant = 'chibi'
    key = 'myrionsChibi'
  } else if (srcPath.includes('silhouette')) {
    variant = 'silhouette'
    key = 'myrionsSilhouette'
  }
  return {
    dest: join(oldAssets, 'Myrions', biomeId, variant, fileName),
    key,
  }
}

function walkDir(dir, handler) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      walkDir(full, handler)
    } else {
      handler(full, entry.name)
    }
  }
}

const speciesBiome = loadSpeciesBiomeMap()

walkDir(join(root, 'public/assets/companions'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const companionId = basename(dirname(src))
  if (companionId === 'companions') return
  const { dest, key } = mapCompanionFile(companionId, fileName)
  if (moveFile(src, dest)) counts[key]++
})

walkDir(join(root, 'public/assets/minigames/capture/biomes'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const mapped = mapBiomeBackground(src, fileName)
  if (mapped && moveFile(src, mapped.dest)) counts[mapped.key]++
})

walkDir(join(root, 'public/assets/minigames/dressage/enclosures'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const mapped = mapBiomeBackground(src, fileName)
  if (mapped && moveFile(src, mapped.dest)) counts[mapped.key]++
})

for (const sub of [
  'public/assets/minigames/capture/myrions/cutout',
  'public/assets/minigames/dressage/myrions/chibi',
  'public/assets/minigames/capture/myrions/silhouette',
]) {
  walkDir(join(root, sub), (src, fileName) => {
    if (fileName === 'README.md') {
      counts.skippedReadme++
      return
    }
    const { dest, key } = mapMyrion(src, fileName, speciesBiome)
    if (moveFile(src, dest)) counts[key]++
  })
}

walkDir(join(root, 'public/assets/minigames/capture/companions'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const companionId = basename(dirname(src))
  if (companionId === 'companions') return
  const dest = join(oldAssets, 'Compagnons', companionId, 'Autres', 'guide', fileName)
  if (moveFile(src, dest)) counts.guides++
})

walkDir(join(root, 'public/gacha'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const gachaRoot = join(root, 'public/gacha')
  const relativePath = src.slice(gachaRoot.length + 1)
  const destPath = join(oldAssets, 'Gacha', relativePath)
  if (moveFile(src, destPath)) counts.gacha++
})

walkDir(join(root, 'public/references'), (src, fileName) => {
  if (fileName === 'README.md') {
    counts.skippedReadme++
    return
  }
  const dest = join(oldAssets, 'public-references', fileName)
  if (moveFile(src, dest)) counts.references++
})

const totalMoved =
  counts.companionsAffinite +
  counts.companionsCutouts +
  counts.companionsChibis +
  counts.companionsNsfw +
  counts.backgroundCapture +
  counts.backgroundDressage +
  counts.myrionsCutout +
  counts.myrionsChibi +
  counts.myrionsSilhouette +
  counts.guides +
  counts.gacha +
  counts.references

console.log(JSON.stringify({ totalMoved, ...counts }, null, 2))
