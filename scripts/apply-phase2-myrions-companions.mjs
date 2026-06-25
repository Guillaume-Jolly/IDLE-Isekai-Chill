#!/usr/bin/env node
/**
 * Phase 2 lots Myrions + Compagnons + legacy cleanup — physical moves (git mv when tracked).
 * Usage: node scripts/apply-phase2-myrions-companions.mjs [--dry-run]
 */
import { execSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const DRY = process.argv.includes('--dry-run')

const stats = {
  myrions: { cutout: 0, chibi: 0, silhouette: 0, skipped: 0 },
  companions: { affinite: 0, cutouts: 0, chibis: 0, nsfw: 0, other: 0 },
  integrated: 0,
  legacyArchived: 0,
}

function log(msg) {
  console.log(DRY ? `[dry-run] ${msg}` : msg)
}

function gitTracked(relPath) {
  try {
    execSync(`git ls-files --error-unmatch "${relPath.replace(/\\/g, '/')}"`, {
      cwd: ROOT,
      stdio: 'pipe',
    })
    return true
  } catch {
    return false
  }
}

function moveFile(fromRel, toRel) {
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)
  if (!existsSync(from)) {
    log(`skip missing: ${fromRel}`)
    return false
  }
  if (existsSync(to)) {
    log(`skip exists: ${toRel}`)
    return false
  }
  mkdirSync(dirname(to), { recursive: true })
  const fromGit = fromRel.replace(/\\/g, '/')
  const toGit = toRel.replace(/\\/g, '/')
  if (DRY) {
    log(`mv ${fromGit} → ${toGit}`)
    return true
  }
  if (gitTracked(fromGit)) {
    execSync(`git mv "${fromGit}" "${toGit}"`, { cwd: ROOT, stdio: 'inherit' })
  } else {
    renameSync(from, to)
  }
  return true
}

function loadSpeciesBiomeMap() {
  const catalogPath = join(ROOT, 'src/data/myrionsCatalog.generated.ts')
  const raw = readFileSync(catalogPath, 'utf8')
  const block = raw.match(/export const MYRIONS_SPECIES = (\[[\s\S]*?\]) as const/)?.[1]
  if (!block) throw new Error('MYRIONS_SPECIES introuvable')
  const species = JSON.parse(block)
  const map = new Map(species.map((s) => [s.id, s.biomeId]))

  const packPath = join(ROOT, 'src/data/eventDisagreaPack.ts')
  const pack = readFileSync(packPath, 'utf8')
  for (const m of pack.matchAll(/id: '([^']+)'/g)) {
    const id = m[1]
    if (id === 'disagrea-event' || id === 'chimerelle') continue
    if (['etna', 'flonne', 'laharl', 'pleinair'].includes(id)) continue
    if (!map.has(id)) map.set(id, 'disagrea-event')
  }
  map.set('chimerelle', 'disagrea-event')
  return map
}

function classifyCompanionFile(filename) {
  if (/^affinity-[1-5]\.png$/.test(filename)) return 'affinite'
  if (filename.startsWith('emotion-') && filename.endsWith('.png')) return 'cutouts'
  if (filename === 'chibi.png') return 'chibis'
  if (filename === 'affinity-4-nsfw.png') return 'NSFW'
  return 'other'
}

function moveMyrions(speciesBiome) {
  const routes = [
    {
      key: 'cutout',
      from: 'public/assets/minigames/capture/myrions/cutout',
      sub: 'cutout',
    },
    {
      key: 'chibi',
      from: 'public/assets/minigames/dressage/myrions/chibi',
      sub: 'chibi',
    },
    {
      key: 'silhouette',
      from: 'public/assets/minigames/capture/myrions/silhouette',
      sub: 'silhouette',
    },
  ]

  for (const route of routes) {
    const srcDir = join(ROOT, route.from)
    if (!existsSync(srcDir)) continue
    for (const file of readdirSync(srcDir).filter((f) => f.endsWith('.png'))) {
      const speciesId = basename(file, '.png')
      const biomeId = speciesBiome.get(speciesId) ?? 'disagrea-event'
      const dest = `assets/Myrions/${biomeId}/${route.sub}/${file}`
      if (moveFile(`${route.from}/${file}`, dest)) stats.myrions[route.key] += 1
      else stats.myrions.skipped += 1
    }
  }
}

function moveCompanions() {
  const srcRoot = join(ROOT, 'public/assets/companions')
  if (!existsSync(srcRoot)) return
  for (const entry of readdirSync(srcRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const id = entry.name
    const dir = join(srcRoot, id)
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
      const kind = classifyCompanionFile(file)
      const folder = kind === 'other' ? 'Autres' : kind
      const dest = `assets/Compagnons/${id}/${folder}/${file}`
      if (moveFile(`public/assets/companions/${id}/${file}`, dest)) {
        const statKey = kind === 'NSFW' ? 'nsfw' : kind
        stats.companions[statKey] = (stats.companions[statKey] ?? 0) + 1
      }
    }
  }
}

function moveIntegratedDisagrea() {
  const srcRoot = join(ROOT, 'assets/event-disagrea/integrated/companions')
  if (!existsSync(srcRoot)) return
  for (const entry of readdirSync(srcRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const id = entry.name
    const dir = join(srcRoot, id)
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
      const from = `assets/event-disagrea/integrated/companions/${id}/${file}`
      const to = `assets/Compagnons/${id}/Autres/disagrea-integrated/${file}`
      if (moveFile(from, to)) stats.integrated += 1
    }
  }
}

function archiveLegacyCompanions() {
  const srcRoot = join(ROOT, 'public/companions')
  const archiveRoot = join(ROOT, 'old_assets/public-companions-legacy')
  if (!existsSync(srcRoot)) return

  for (const entry of readdirSync(srcRoot, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const id = entry.name
      const dir = join(srcRoot, id)
      for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
        const from = `public/companions/${id}/${file}`
        const to = `old_assets/public-companions-legacy/${id}/${file}`
        if (moveFile(from, to)) stats.legacyArchived += 1
      }
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      const from = `public/companions/${entry.name}`
      const to = `old_assets/public-companions-legacy/${entry.name}`
      if (moveFile(from, to)) stats.legacyArchived += 1
    }
  }

  if (!DRY && existsSync(srcRoot)) {
    writeFileSync(
      join(srcRoot, 'README.md'),
      `# Legacy companions mirror archived (Assets 2.0 Phase 2)

Runtime source-of-truth: \`assets/Compagnons/{id}/\`

Served at \`/assets/companions/{id}/...\` via Vite plugin (\`repoCompanionAssetsPlugin\`).

Legacy mirror archived to \`old_assets/public-companions-legacy/\`.

Do not re-add files here — update \`assets/Compagnons/\` instead.
`,
      'utf8',
    )
  }
}

function writeRedirectReadmes() {
  const readmes = [
    {
      path: 'public/assets/minigames/capture/myrions/cutout/README.md',
      title: 'Myrion cutouts moved (Assets 2.0 Phase 2 — lot Myrions)',
      runtime: '/assets/minigames/capture/myrions/cutout/{speciesId}.png',
      source: 'assets/Myrions/{biomeId}/cutout/{speciesId}.png',
      plugin: 'repoMyrionAssetsPlugin',
    },
    {
      path: 'public/assets/minigames/dressage/myrions/chibi/README.md',
      title: 'Myrion chibis moved (Assets 2.0 Phase 2 — lot Myrions)',
      runtime: '/assets/minigames/dressage/myrions/chibi/{speciesId}.png',
      source: 'assets/Myrions/{biomeId}/chibi/{speciesId}.png',
      plugin: 'repoMyrionAssetsPlugin',
    },
    {
      path: 'public/assets/minigames/capture/myrions/silhouette/README.md',
      title: 'Myrion silhouettes moved (Assets 2.0 Phase 2 — lot Myrions)',
      runtime: '/assets/minigames/capture/myrions/silhouette/{speciesId}.png',
      source: 'assets/Myrions/{biomeId}/silhouette/{speciesId}.png',
      plugin: 'repoMyrionAssetsPlugin',
    },
    {
      path: 'public/assets/companions/README.md',
      title: 'Companion assets moved (Assets 2.0 Phase 2 — lot Compagnons)',
      runtime: '/assets/companions/{id}/affinity-{n}.png, emotion-*.png, chibi.png, affinity-4-nsfw.png',
      source: 'assets/Compagnons/{id}/affinite|cutouts|chibis|NSFW/',
      plugin: 'repoCompanionAssetsPlugin',
    },
  ]

  for (const { path, title, runtime, source, plugin } of readmes) {
    if (DRY) {
      log(`write ${path}`)
      continue
    }
    mkdirSync(dirname(join(ROOT, path)), { recursive: true })
    writeFileSync(
      join(ROOT, path),
      `# ${title}

Runtime source-of-truth: \`${source}\`

Served at \`${runtime}\` via Vite plugin (\`vite.config.ts\` → \`${plugin}\`).

Do not re-add files here — update \`assets/Compagnons/\` or \`assets/Myrions/\` instead.
`,
      'utf8',
    )
  }
}

console.log('Phase 2 — Myrions + Compagnons + legacy cleanup\n')
const speciesBiome = loadSpeciesBiomeMap()
moveMyrions(speciesBiome)
moveCompanions()
moveIntegratedDisagrea()
archiveLegacyCompanions()
writeRedirectReadmes()

console.log('\n--- Stats ---')
console.log(JSON.stringify(stats, null, 2))
