/**
 * Valide les portraits intégrés scene-originale-v1 et archive le reste dans old_assets/.
 *
 * Usage: node scripts/organize-disagrea-validated.mjs
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
const eventRoot = join(repoRoot, 'assets', 'event-disagrea')
const oldRoot = join(repoRoot, 'old_assets', 'event-disagrea')
const validatedRoot = join(eventRoot, 'integrated', 'companions')

const VALIDATED_PATTERN = /-scene-originale-v1\.png$/

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

function movePath(src, dest) {
  if (!existsSync(src)) return false
  ensureDir(dirname(dest))
  renameSync(src, dest)
  return true
}

function moveTree(srcDir, destDir) {
  if (!existsSync(srcDir)) return 0
  let count = 0
  for (const entry of readdirSync(srcDir, { withFileTypes: true })) {
    const src = join(srcDir, entry.name)
    const dest = join(destDir, entry.name)
    if (entry.isDirectory()) {
      count += moveTree(src, dest)
    } else {
      ensureDir(dirname(dest))
      renameSync(src, dest)
      count += 1
    }
  }
  return count
}

// 1) Anciens intégrés (collage / v2) hors scene-originale-v1
const integratedArchive = join(oldRoot, 'integrated-brouillons')
let archivedIntegrated = 0
if (existsSync(validatedRoot)) {
  for (const companion of readdirSync(validatedRoot, { withFileTypes: true })) {
    if (!companion.isDirectory()) continue
    const dir = join(validatedRoot, companion.name)
    for (const file of readdirSync(dir)) {
      if (VALIDATED_PATTERN.test(file)) continue
      if (!file.endsWith('.png')) continue
      const dest = join(integratedArchive, companion.name, file)
      if (movePath(join(dir, file), dest)) archivedIntegrated += 1
    }
  }
}

// 2) Dossiers pipeline non validés
const toArchive = [
  ['composites', join(oldRoot, 'composites')],
  ['generated', join(oldRoot, 'generated')],
  ['catalog', join(oldRoot, 'catalog')],
  ['sources', join(oldRoot, 'sources')],
]

let archivedDirs = 0
for (const [rel, dest] of toArchive) {
  const src = join(eventRoot, rel)
  if (existsSync(src)) {
    archivedDirs += moveTree(src, dest)
  }
}

// 3) Manifest validated list
const validated = []
if (existsSync(validatedRoot)) {
  for (const companion of readdirSync(validatedRoot, { withFileTypes: true })) {
    if (!companion.isDirectory()) continue
    for (const file of readdirSync(join(validatedRoot, companion.name)).sort()) {
      if (VALIDATED_PATTERN.test(file)) {
        validated.push(`integrated/companions/${companion.name}/${file}`)
      }
    }
  }
}

const manifestPath = join(eventRoot, 'integrated', 'VALIDATED_MANIFEST.json')
ensureDir(dirname(manifestPath))
const manifest = {
  event: 'disagrea',
  validatedAt: new Date().toISOString().slice(0, 10),
  pipeline: 'integrated-scene-originale-v1',
  count: validated.length,
  files: validated,
  notes: {
    pleinair:
      'TODO: Pleinair est une enfant — paliers 2-5 à repenser en proximité parentale / confiance enfant, pas intimité adulte.',
  },
}
import { writeFileSync } from 'node:fs'
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')

console.log(`Validated portraits kept: ${validated.length}`)
console.log(`Archived integrated brouillons: ${archivedIntegrated}`)
console.log(`Archived files (dirs): ${archivedDirs}`)
console.log(`Manifest: ${manifestPath}`)
