#!/usr/bin/env node
/**
 * Migrate legacy public/ mirrors → old_assets/ with byte-hash dedup vs assets/ and old_assets/.
 * Post-migration: sort old_assets/companions/ → old_assets/Compagnons/ and write report.
 *
 * Skips runtime public/: village (3 actifs), PWA shell, build-info.json, README redirects.
 *
 * Usage:
 *   node scripts/migrate-public-to-old-assets.mjs [--dry-run] [--sort-only]
 */
import { createHash } from 'node:crypto'
import {
  createReadStream,
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
import { execSync } from 'node:child_process'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const CONFLICTS = join(ROOT, 'To check manually', 'public-migration-conflicts')
const DRY = process.argv.includes('--dry-run')
const SORT_ONLY = process.argv.includes('--sort-only')
const LOG_PATH = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')
const REPORT_JSON = join(OLD, 'public-migration-report.json')
const REPORT_MD = join(OLD, 'public-migration-report.md')
const SORT_DEDUP_ARCHIVE = join(OLD, 'archive/2026-06-25-sort-dedup/companions')
const SORT_CONFLICTS = join(ROOT, 'To check manually/old-assets-sort-conflicts/companions')

const IMAGE_EXT = /\.(png|webp|svg)$/i

/** Village files still referenced by src (keep in public/). */
const VILLAGE_KEEP = new Set(['panorama-base.webp', 'panorama-v1.png', 'hero-banner.png'])

/** @type {Array<{from: string, to: string, reason: string, status: string}>} */
const moves = []
/** @type {Array<{from: string, to: string, reason: string, status: string}>} */
const sortMoves = []

const stats = {
  moved: 0,
  'skip-dedup-assets': 0,
  'skip-dedup-old-assets': 0,
  'skip-dedup-remove-public': 0,
  'skip-dest-exists': 0,
  conflicts: 0,
  'skip-readme': 0,
  'skip-extension': 0,
  'skip-keep': 0,
  'skip-junction': 0,
  'sort-moved': 0,
  'sort-dedup': 0,
  'sort-conflicts': 0,
  errors: 0,
}

/** @type {Map<string, string>} sha256 → first repo-relative path */
let hashIndex = new Map()

function record(from, to, reason, status) {
  moves.push({
    from: from.replace(/\\/g, '/'),
    to: (to ?? '').replace(/\\/g, '/'),
    reason,
    status,
  })
  if (status in stats && status !== 'errors') {
    stats[status]++
  } else if (status === 'error') {
    stats.errors++
  }
}

function recordSort(from, to, reason, status) {
  sortMoves.push({
    from: from.replace(/\\/g, '/'),
    to: (to ?? '').replace(/\\/g, '/'),
    reason,
    status,
  })
  if (status in stats && status !== 'errors') {
    stats[status]++
  } else if (status === 'error') {
    stats.errors++
  }
}

function relPath(full) {
  return full.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function isReparsePoint(full) {
  try {
    return (statSync(full).mode & 0o170000) === 0o120000
  } catch {
    return false
  }
}

function shouldKeepPublic(publicRel) {
  const p = publicRel.replace(/\\/g, '/')
  if (p === 'public/favicon.svg' || p === 'public/icons.svg' || p === 'public/manifest.webmanifest') {
    return true
  }
  if (p === 'public/build-info.json') return true
  if (p === 'public/village/README.md') return true
  if (p.startsWith('public/village/')) {
    const name = basename(p)
    if (VILLAGE_KEEP.has(name) && !p.includes('buildings-map')) return true
  }
  if (basename(p) === 'README.md') return true
  if (basename(p) === '.gitkeep') return true
  return false
}

async function buildHashIndex() {
  /** @type {string[]} */
  const filePaths = []
  for (const rootName of ['assets', 'old_assets']) {
    const rootFull = join(ROOT, rootName)
    if (!existsSync(rootFull)) continue
    walkDir(rootFull, (full) => {
      filePaths.push(full)
    })
  }
  const index = new Map()
  for (const full of filePaths) {
    const rel = relPath(full)
    try {
      const hash = await sha256(full)
      if (!index.has(hash)) index.set(hash, rel)
    } catch {
      /* unreadable */
    }
  }
  return index
}

function findHashDuplicate(hash, excludeRel) {
  const hit = hashIndex.get(hash)
  if (!hit || hit === excludeRel) return null
  return hit
}

function sha256(path) {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256')
    createReadStream(path)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject)
  })
}

function isTracked(rel) {
  try {
    execSync(`git ls-files --error-unmatch "${rel.replace(/\\/g, '/')}"`, {
      cwd: ROOT,
      stdio: 'pipe',
    })
    return true
  } catch {
    return false
  }
}

function gitRm(rel) {
  const norm = rel.replace(/\\/g, '/')
  if (!DRY && isTracked(norm)) {
    execSync(`git rm -f "${norm}"`, { cwd: ROOT, stdio: 'pipe' })
  }
}

function gitMv(fromRel, toRel) {
  const from = fromRel.replace(/\\/g, '/')
  const to = toRel.replace(/\\/g, '/')
  if (DRY) return
  mkdirSync(dirname(join(ROOT, to)), { recursive: true })
  if (isTracked(from)) {
    execSync(`git mv -f "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
  } else {
    renameSync(join(ROOT, from), join(ROOT, to))
  }
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true })
}

/** Parse MYRIONS_SPECIES biomeId from generated catalog. */
function loadSpeciesBiomeMap() {
  const catalogPath = join(ROOT, 'src/data/myrionsCatalog.generated.ts')
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

function mapCompanionOldAssets(companionId, fileName) {
  const base = join(OLD, 'Compagnons', companionId)
  if (fileName === 'chibi.png') {
    return join(base, 'chibis', fileName)
  }
  if (/^affinity-\d+-nsfw\.png$/.test(fileName)) {
    return join(base, 'NSFW', fileName)
  }
  if (/^affinity-\d+\.png$/.test(fileName)) {
    return join(base, 'affinite', fileName)
  }
  if (/^emotion-.+\.png$/.test(fileName)) {
    return join(base, 'cutouts', fileName)
  }
  return join(base, 'Autres', fileName)
}

function mapBiomeBackgroundOld(srcPath, fileName) {
  const isCapture =
    srcPath.includes('capture/biomes') || srcPath.includes('capture\\biomes')
  const isDressage =
    srcPath.includes('dressage/enclosures') || srcPath.includes('dressage\\enclosures')
  if (!isCapture && !isDressage) return null

  if (fileName === 'disagrea-event-portrait.png') {
    return join(OLD, 'Background', 'disagrea-event', 'dressage-portrait.png')
  }

  const biomeId = fileName.replace(/-portrait\.png$/, '').replace(/\.png$/, '')
  const base = join(OLD, 'Background', biomeId)

  if (isCapture) {
    if (fileName.endsWith('-portrait.png')) {
      return join(base, 'capture-portrait.png')
    }
    return join(base, 'capture-wide.png')
  }
  if (fileName.endsWith('-portrait.png')) {
    return join(base, 'dressage-portrait.png')
  }
  return join(base, 'dressage-wide.png')
}

function mapMyrionOld(srcPath, fileName, speciesBiome) {
  const speciesId = fileName.replace(/\.png$/, '')
  const biomeId = speciesBiome.get(speciesId) ?? '_unknown-biome'
  let variant = 'cutout'
  if (srcPath.includes('chibi')) variant = 'chibi'
  else if (srcPath.includes('silhouette')) variant = 'silhouette'
  return join(OLD, 'Myrions', biomeId, variant, fileName)
}

/**
 * Map public relative path → expected assets/ path for dedup (mirrors vite.repo-assets.ts).
 * @param {string} publicRel e.g. public/assets/companions/asha/chibi.png
 * @returns {string | null} assets-relative path
 */
function resolveAssetsEquivalent(publicRel, speciesBiome) {
  const p = publicRel.replace(/\\/g, '/')

  const companionMatch = /^public\/assets\/companions\/([^/]+)\/([^/]+)$/.exec(p)
  if (companionMatch) {
    const companionId = companionMatch[1]
    const fileName = companionMatch[2]
    let subdir = null
    if (/^affinity-[1-5]\.png$/.test(fileName)) subdir = 'affinite'
    else if (fileName.startsWith('emotion-') && fileName.endsWith('.png')) subdir = 'cutouts'
    else if (fileName === 'chibi.png') subdir = 'chibis'
    else if (fileName === 'affinity-4-nsfw.png' || /^affinity-\d+-nsfw\.png$/.test(fileName))
      subdir = 'NSFW'
    if (subdir) return `assets/Compagnons/${companionId}/${subdir}/${fileName}`
    return null
  }

  const captureBiomeMatch = /^public\/assets\/minigames\/capture\/biomes\/(.+)$/.exec(p)
  if (captureBiomeMatch) {
    const remainder = captureBiomeMatch[1]
    if (remainder.endsWith('-portrait.png')) {
      const biomeId = remainder.slice(0, -'-portrait.png'.length)
      return `assets/Background/${biomeId}/capture-portrait.png`
    }
    if (remainder.endsWith('.png')) {
      const biomeId = remainder.slice(0, -'.png'.length)
      return `assets/Background/${biomeId}/capture-wide.png`
    }
    return null
  }

  const dressageEnclosureMatch = /^public\/assets\/minigames\/dressage\/enclosures\/(.+)$/.exec(p)
  if (dressageEnclosureMatch) {
    const remainder = dressageEnclosureMatch[1]
    if (remainder === 'disagrea-event-portrait.png') {
      return 'assets/Background/disagrea-event/dressage-portrait.png'
    }
    if (remainder.endsWith('-portrait.png')) {
      const biomeId = remainder.slice(0, -'-portrait.png'.length)
      return `assets/Background/${biomeId}/dressage-portrait.png`
    }
    if (remainder.endsWith('.png')) {
      const biomeId = remainder.slice(0, -'.png'.length)
      return `assets/Background/${biomeId}/dressage-wide.png`
    }
    return null
  }

  for (const [variant, urlSegment] of [
    ['cutout', 'capture/myrions/cutout'],
    ['chibi', 'dressage/myrions/chibi'],
    ['silhouette', 'capture/myrions/silhouette'],
  ]) {
    const re = new RegExp(`^public/assets/minigames/${urlSegment.replace('/', '\\/')}/([^/]+)$`)
    const m = re.exec(p)
    if (m) {
      const fileName = m[1]
      const speciesId = fileName.replace(/\.png$/, '')
      const biomeId = speciesBiome.get(speciesId) ?? null
      if (!biomeId) return null
      return `assets/Myrions/${biomeId}/${variant}/${fileName}`
    }
  }

  const guideMatch = /^public\/assets\/minigames\/capture\/companions\/([^/]+)\/(.+)$/.exec(p)
  if (guideMatch) {
    const companionId = guideMatch[1]
    const fileName = guideMatch[2]
    return `assets/Compagnons/${companionId}/Autres/guide/${fileName}`
  }

  const gachaMatch = /^public\/gacha\/(.+)$/.exec(p)
  if (gachaMatch) {
    return `assets/Gacha/${gachaMatch[1]}`
  }

  const backupMatch = /^public\/generated-backup\/([a-z]+)-affinity-(\d)\.png$/.exec(p)
  if (backupMatch) {
    return `assets/Compagnons/${backupMatch[1]}/affinite/affinity-${backupMatch[2]}.png`
  }

  return null
}

function mapOldAssetsDest(publicRel, speciesBiome) {
  const p = publicRel.replace(/\\/g, '/')
  const fullPath = join(ROOT, publicRel)

  const companionMatch = /^public\/assets\/companions\/([^/]+)\/([^/]+)$/.exec(p)
  if (companionMatch) {
    return mapCompanionOldAssets(companionMatch[1], companionMatch[2])
  }

  const captureBiomeMatch = /^public\/assets\/minigames\/capture\/biomes\/(.+)$/.exec(p)
  if (captureBiomeMatch) {
    return mapBiomeBackgroundOld(fullPath, captureBiomeMatch[1])
  }

  const dressageMatch = /^public\/assets\/minigames\/dressage\/enclosures\/(.+)$/.exec(p)
  if (dressageMatch) {
    return mapBiomeBackgroundOld(fullPath, dressageMatch[1])
  }

  for (const [variant, urlSegment] of [
    ['cutout', 'capture/myrions/cutout'],
    ['chibi', 'dressage/myrions/chibi'],
    ['silhouette', 'capture/myrions/silhouette'],
  ]) {
    const re = new RegExp(`^public/assets/minigames/${urlSegment.replace('/', '\\/')}/([^/]+)$`)
    const m = re.exec(p)
    if (m) {
      return mapMyrionOld(fullPath, m[1], speciesBiome)
    }
  }

  const guideMatch = /^public\/assets\/minigames\/capture\/companions\/([^/]+)\/(.+)$/.exec(p)
  if (guideMatch) {
    return join(OLD, 'Compagnons', guideMatch[1], 'Autres', 'guide', guideMatch[2])
  }

  const gachaMatch = /^public\/gacha\/(.+)$/.exec(p)
  if (gachaMatch) {
    return join(OLD, 'Gacha', gachaMatch[1])
  }

  const backupMatch = /^public\/generated-backup\/([a-z]+)-affinity-(\d)\.png$/.exec(p)
  if (backupMatch) {
    return join(OLD, 'Compagnons', backupMatch[1], 'affinite', `affinity-${backupMatch[2]}.png`)
  }

  // Unmatched → preserve public relative path under public-mirror/
  const afterPublic = p.replace(/^public\//, '')
  return join(OLD, 'public-mirror', afterPublic)
}

function walkDir(dir, handler, opts = {}) {
  if (!existsSync(dir)) return
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (opts.skipReparse && isReparsePoint(full)) continue
    if (entry.isDirectory()) {
      walkDir(full, handler, opts)
    } else if (entry.isFile()) {
      handler(full, entry.name)
    }
  }
}

function collectPublicMigratable() {
  /** @type {string[]} */
  const files = []
  const publicRoot = join(ROOT, 'public')
  if (!existsSync(publicRoot)) return files

  walkDir(publicRoot, (full) => {
    const rel = relPath(full)
    if (rel.startsWith('public/companions/') || rel === 'public/companions') return
    if (shouldKeepPublic(rel)) return
    files.push(rel)
  }, { skipReparse: true })

  return files
}

function inventoryPublicRemaining() {
  /** @type {Array<{path: string, reason: string}>} */
  const remaining = []
  const publicRoot = join(ROOT, 'public')
  if (!existsSync(publicRoot)) return remaining

  walkDir(publicRoot, (full) => {
    const rel = relPath(full)
    let reason = 'runtime asset'
    if (rel.startsWith('public/companions')) {
      reason = 'legacy junction → public/assets/companions (empty)'
    } else if (basename(rel) === 'README.md') {
      reason = 'post-migration redirect'
    } else if (basename(rel) === '.gitkeep') {
      reason = 'placeholder'
    } else if (rel.startsWith('public/live2d/')) {
      reason = 'redirect stub → assets/Live2D/'
    } else if (rel.startsWith('public/village/')) {
      reason = VILLAGE_KEEP.has(basename(rel)) ? 'village runtime (src)' : 'village orphan (should be archived)'
    } else if (
      rel === 'public/favicon.svg' ||
      rel === 'public/icons.svg' ||
      rel === 'public/manifest.webmanifest'
    ) {
      reason = 'PWA shell'
    } else if (rel === 'public/build-info.json') {
      reason = 'build version endpoint (useAppBuildVersion)'
    } else if (rel.startsWith('public/assets/') || rel.startsWith('public/gacha/')) {
      reason = 'redirect stub / legacy tree'
    }
    remaining.push({ path: rel, reason })
  }, { skipReparse: true })

  remaining.sort((a, b) => a.path.localeCompare(b.path))
  return remaining
}

async function processFile(publicRel) {
  const from = join(ROOT, publicRel)
  if (!existsSync(from) || !statSync(from).isFile()) return

  const fileName = basename(publicRel)
  const p = publicRel.replace(/\\/g, '/')

  if (fileName === 'README.md') {
    record(publicRel, '', 'README redirect', 'skip-readme')
    return
  }
  if (fileName === '.gitkeep') {
    record(publicRel, '', 'gitkeep placeholder', 'skip-extension')
    return
  }

  // public/references/* → old_assets/public-references/
  if (p.startsWith('public/references/')) {
    const destRel = `old_assets/public-references/${fileName}`
    const destFull = join(ROOT, destRel)
    try {
      const pubHash = await sha256(from)
      const dup = findHashDuplicate(pubHash, publicRel)
      if (dup) {
        record(publicRel, dup, `duplicate of ${dup}`, 'skip-dedup-old-assets')
        if (!DRY) {
          try {
            gitRm(publicRel)
            stats['skip-dedup-remove-public']++
          } catch (e) {
            record(publicRel, '', `git rm failed: ${e.message}`, 'error')
          }
        } else {
          stats['skip-dedup-remove-public']++
        }
        return
      }
      if (existsSync(destFull)) {
        record(publicRel, destRel, 'dest already exists', 'skip-dest-exists')
        return
      }
      record(publicRel, destRel, 'legacy reference txt', 'moved')
      if (!DRY) gitMv(publicRel, destRel)
      return
    } catch (e) {
      record(publicRel, destRel, `reference move failed: ${e.message}`, 'error')
      return
    }
  }

  if (!IMAGE_EXT.test(fileName)) {
    record(publicRel, '', 'non-image extension', 'skip-extension')
    return
  }

  let pubHash
  try {
    pubHash = await sha256(from)
  } catch (e) {
    record(publicRel, '', `hash failed: ${e.message}`, 'error')
    return
  }

  const globalDup = findHashDuplicate(pubHash, publicRel)
  if (globalDup) {
    const dupKind = globalDup.startsWith('assets/') ? 'skip-dedup-assets' : 'skip-dedup-old-assets'
    record(publicRel, globalDup, `byte-identical to ${globalDup}`, dupKind)
    if (!DRY) {
      try {
        gitRm(publicRel)
        stats['skip-dedup-remove-public']++
      } catch (e) {
        record(publicRel, '', `git rm failed: ${e.message}`, 'error')
      }
    } else {
      stats['skip-dedup-remove-public']++
    }
    return
  }

  const assetsEq = resolveAssetsEquivalent(publicRel, speciesBiome)
  if (assetsEq) {
    const assetsFull = join(ROOT, assetsEq)
    if (existsSync(assetsFull)) {
      try {
        const assetsHash = await sha256(assetsFull)
        if (pubHash === assetsHash) {
          record(publicRel, assetsEq, `duplicate of active assets file`, 'skip-dedup-assets')
          if (!DRY) {
            try {
              gitRm(publicRel)
              stats['skip-dedup-remove-public']++
            } catch (e) {
              record(publicRel, '', `git rm failed: ${e.message}`, 'error')
            }
          } else {
            stats['skip-dedup-remove-public']++
          }
          return
        }
      } catch (e) {
        record(publicRel, assetsEq, `dedup check failed: ${e.message}`, 'error')
        return
      }
    }
  }

  const destFull = mapOldAssetsDest(publicRel, speciesBiome)
  const destRel = destFull.replace(/\\/g, '/').replace(ROOT.replace(/\\/g, '/') + '/', '')

  if (existsSync(destFull)) {
    try {
      const destHash = await sha256(destFull)
      if (pubHash === destHash) {
        record(publicRel, destRel, 'old_assets dest already has same bytes', 'skip-dest-exists')
        if (!DRY) {
          try {
            gitRm(publicRel)
            stats['skip-dedup-remove-public']++
          } catch {
            /* leave public file if rm fails */
          }
        } else {
          stats['skip-dedup-remove-public']++
        }
        return
      }
      const conflictRel = `To check manually/public-migration-conflicts/${publicRel.replace(/^public\//, '')}`
      record(publicRel, conflictRel, 'dest exists with different bytes', 'conflicts')
      if (!DRY) {
        ensureDir(dirname(join(ROOT, conflictRel)))
        gitMv(publicRel, conflictRel)
      }
      return
    } catch (e) {
      record(publicRel, destRel, `dest compare failed: ${e.message}`, 'error')
      return
    }
  }

  record(publicRel, destRel, assetsEq ? `not identical to ${assetsEq}` : 'no assets equivalent', 'moved')
  if (!DRY) {
    try {
      gitMv(publicRel, destRel)
      hashIndex.set(pubHash, destRel)
    } catch (e) {
      record(publicRel, destRel, `move failed: ${e.message}`, 'error')
      stats.moved--
      stats.errors++
    }
  }
}

function writeRedirectReadmes() {
  const templates = [
    {
      path: join(ROOT, 'public/assets/README.md'),
      content:
        '# public/assets — legacy mirrors archived\n\n' +
        'Runtime source-of-truth: `assets/` (Compagnons, Background, Myrions, minigame paths).\n\n' +
        'Served via `vite.repo-assets.ts` at `/assets/...`. Do not re-add image files here.\n\n' +
        'Archived copies → `old_assets/` (see `old_assets/README.md`).\n',
    },
    {
      path: join(ROOT, 'public/gacha/README.md'),
      content:
        '# Gacha assets moved (Assets 2.0)\n\n' +
        'Runtime source-of-truth: `assets/Gacha/`\n\n' +
        'Served at `/gacha/*` via `vite.repo-assets.ts`.\n\n' +
        'Do not re-add files here — update `assets/Gacha/` instead.\n' +
        'Archived mirrors → `old_assets/Gacha/`.\n',
    },
    {
      path: join(ROOT, 'public/live2d/README.md'),
      content:
        '# Live2D demo assets moved (Assets 2.0)\n\n' +
        'Runtime source-of-truth: `assets/Live2D/`\n\n' +
        'Served at `/live2d/*` via `vite.repo-assets.ts`.\n\n' +
        'Do not re-add files here — update `assets/Live2D/` instead.\n' +
        'Run `node scripts/setup-live2d-demo.mjs` to refresh the Haru demo bundle.\n',
    },
    {
      path: join(ROOT, 'public/village/README.md'),
      content:
        '# Village runtime assets\n\n' +
        'Fichiers servis par Vite depuis `public/village/` (pas encore migrés vers `assets/`).\n\n' +
        '**Actifs (ne pas archiver) :**\n' +
        '- `panorama-base.webp` — panorama principal (`villageMap.ts`)\n' +
        '- `panorama-v1.png` — fallback legacy (`panoramaLegacyAsset`)\n' +
        '- `hero-banner.png` — bannière (`App.css`)\n\n' +
        'Orphelins → `old_assets/public-mirror/village/`\n\n' +
        'Voir `old_assets/public-migration-report.md`\n',
    },
  ]
  if (!DRY) {
    for (const { path, content } of templates) {
      ensureDir(dirname(path))
      writeFileSync(path, content, 'utf8')
    }
  }
}

function appendLog() {
  const ts = new Date().toISOString().slice(0, 10)
  const header = `\n\n---\n\n## Session ${ts} — migrate-public-to-old-assets${DRY ? ' (dry-run)' : ''}\n\n| From | To | Reason | Status |\n|------|-----|--------|--------|\n`
  const rows = moves.map((m) => `| \`${m.from}\` | \`${m.to}\` | ${m.reason} | ${m.status} |`).join('\n')
  const summary = `\n\n### Stats\n\n\`\`\`json\n${JSON.stringify(stats, null, 2)}\n\`\`\`\n`
  const footer = `\n\n### Reste légitime dans \`public/\`\n\n| Chemin | Pourquoi |\n|--------|----------|\n| \`public/village/\` (3 fichiers actifs) | Runtime village |\n| \`public/assets/**\` README | Redirects post-migration |\n| \`public/gacha/README.md\` | Redirect → \`assets/Gacha/\` |\n| \`public/live2d/README.md\` | Redirect → \`assets/Live2D/\` |\n| \`favicon.svg\`, \`icons.svg\`, \`manifest.webmanifest\` | Shell PWA |\n`

  const existing = existsSync(LOG_PATH)
    ? readFileSync(LOG_PATH, 'utf8')
    : '# old_assets cleanup log\n\nDedup rule: **never archive a mirror if the same bytes are the active file in `assets/`.**\n'

  if (!DRY) writeFileSync(LOG_PATH, existing + header + rows + summary + footer, 'utf8')
}

async function sortOldAssetsCompanions() {
  const legacyRoot = join(OLD, 'companions')
  if (!existsSync(legacyRoot)) return

  /** @type {string[]} */
  const files = []
  walkDir(legacyRoot, (full) => {
    files.push(full)
  })

  for (const full of files) {
    const tail = full.slice(legacyRoot.length + 1).replace(/\\/g, '/')
    const fromRel = `old_assets/companions/${tail}`
    const toRel = `old_assets/Compagnons/${tail}`
    const toFull = join(ROOT, toRel)

    let srcHash
    try {
      srcHash = await sha256(full)
    } catch (e) {
      recordSort(fromRel, toRel, `hash failed: ${e.message}`, 'error')
      continue
    }

    if (existsSync(toFull)) {
      try {
        const destHash = await sha256(toFull)
        if (srcHash === destHash) {
          const archiveRel = relPath(join(SORT_DEDUP_ARCHIVE, tail))
          recordSort(fromRel, archiveRel, `duplicate of ${toRel}`, 'sort-dedup')
          if (!DRY) {
            ensureDir(dirname(join(ROOT, archiveRel)))
            if (isTracked(fromRel)) {
              execSync(`git mv -f "${fromRel}" "${archiveRel}"`, { cwd: ROOT, stdio: 'pipe' })
            } else {
              renameSync(full, join(ROOT, archiveRel))
            }
          }
          continue
        }
        const conflictRel = relPath(join(SORT_CONFLICTS, tail))
        recordSort(fromRel, conflictRel, `dest exists with different bytes (${toRel})`, 'sort-conflicts')
        if (!DRY) {
          ensureDir(dirname(join(ROOT, conflictRel)))
          if (isTracked(fromRel)) {
            execSync(`git mv -f "${fromRel}" "${conflictRel}"`, { cwd: ROOT, stdio: 'pipe' })
          } else {
            renameSync(full, join(ROOT, conflictRel))
          }
        }
        continue
      } catch (e) {
        recordSort(fromRel, toRel, `compare failed: ${e.message}`, 'error')
        continue
      }
    }

    recordSort(fromRel, toRel, 'canonical taxonomy Compagnons/', 'sort-moved')
    if (!DRY) {
      ensureDir(dirname(toFull))
      if (isTracked(fromRel)) {
        execSync(`git mv -f "${fromRel}" "${toRel}"`, { cwd: ROOT, stdio: 'pipe' })
      } else {
        renameSync(full, toFull)
      }
      hashIndex.set(srcHash, toRel)
    }
  }

  const readmePath = join(legacyRoot, 'README.md')
  const readmeContent = `# companions/ (legacy lowercase)

Contenu déplacé vers \`old_assets/Compagnons/\` (taxonomie canonique).

Doublons byte-identiques → \`old_assets/archive/2026-06-25-sort-dedup/companions/\`
Conflits → \`To check manually/old-assets-sort-conflicts/companions/\`

Voir \`old_assets/public-migration-report.md\`
`
  if (!DRY) writeFileSync(readmePath, readmeContent, 'utf8')
}

function writeMigrationReport(remaining) {
  const ts = new Date().toISOString()
  const moved = moves.filter((m) => m.status === 'moved')
  const skippedDup = moves.filter((m) =>
    ['skip-dedup-assets', 'skip-dedup-old-assets', 'skip-dest-exists'].includes(m.status),
  )
  const skippedOther = moves.filter(
    (m) => !['moved', 'skip-dedup-assets', 'skip-dedup-old-assets', 'skip-dest-exists'].includes(m.status),
  )

  const report = {
    generatedAt: ts,
    dryRun: DRY,
    stats,
    moved,
    skippedDuplicates: skippedDup,
    skippedOther,
    sorted: sortMoves,
    remainingInPublic: remaining,
  }

  const md = `# public/ → old_assets/ migration report

Generated: ${ts}${DRY ? ' (dry-run)' : ''}

## Summary

| Metric | Count |
|--------|------:|
| Moved (public → old_assets) | ${stats.moved} |
| Skipped duplicate (assets/) | ${stats['skip-dedup-assets']} |
| Skipped duplicate (old_assets/) | ${stats['skip-dedup-old-assets']} |
| Skipped dest exists (same bytes) | ${stats['skip-dest-exists']} |
| Public mirrors removed (dedup) | ${stats['skip-dedup-remove-public']} |
| Conflicts | ${stats.conflicts} |
| Sorted companions → Compagnons | ${stats['sort-moved']} |
| Sort dedup archived | ${stats['sort-dedup']} |
| Sort conflicts | ${stats['sort-conflicts']} |
| Errors | ${stats.errors} |
| **Remaining in public/** | **${remaining.length}** |

## Moved (${moved.length})

${moved.length ? moved.map((m) => `- \`${m.from}\` → \`${m.to}\` — ${m.reason}`).join('\n') : '_none_'}

## Skipped duplicates (${skippedDup.length})

${skippedDup.length ? skippedDup.map((m) => `- \`${m.from}\` — ${m.reason} (${m.status})`).join('\n') : '_none_'}

## Sorted old_assets (${sortMoves.filter((m) => m.status === 'sort-moved').length} moved, ${sortMoves.filter((m) => m.status === 'sort-dedup').length} dedup)

${sortMoves.length ? sortMoves.map((m) => `- \`${m.from}\` → \`${m.to}\` — ${m.reason} (${m.status})`).join('\n') : '_none_'}

## Remaining in public/ (${remaining.length})

| Path | Reason |
|------|--------|
${remaining.map((r) => `| \`${r.path}\` | ${r.reason} |`).join('\n')}

See also \`docs/traceability/assets/old-assets-cleanup-log.md\`.
`

  if (!DRY) {
    ensureDir(OLD)
    writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), 'utf8')
    writeFileSync(REPORT_MD, md, 'utf8')
  }

  return report
}

const speciesBiome = loadSpeciesBiomeMap()

console.log(`migrate public → old_assets${DRY ? ' (dry-run)' : ''}${SORT_ONLY ? ' (sort-only)' : ''}\n`)

console.log('Building hash index (assets/ + old_assets/)…')
hashIndex = await buildHashIndex()
console.log(`  ${hashIndex.size} unique hashes indexed\n`)

if (!SORT_ONLY) {
  const files = collectPublicMigratable()
  console.log(`Processing ${files.length} migratable public/ files…`)
  for (const rel of files) {
    await processFile(rel)
  }
  writeRedirectReadmes()
  appendLog()
}

console.log('Sorting old_assets/companions/ → Compagnons/…')
await sortOldAssetsCompanions()

const remaining = inventoryPublicRemaining()
writeMigrationReport(remaining)

console.log('\n' + JSON.stringify(stats, null, 2))
console.log(`\nReport: old_assets/public-migration-report.json`)
console.log(`        old_assets/public-migration-report.md`)
console.log(`Remaining in public/: ${remaining.length} files`)
