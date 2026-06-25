#!/usr/bin/env node
/**
 * Archive public/ files that are not runtime-served (mirrors already in assets/, or village orphans).
 * Dedup: skip if destination exists (same path under old_assets/) or byte-identical in assets/.
 *
 * Usage: node scripts/archive-public-orphans-to-old-assets.mjs [--dry-run]
 */
import { createHash } from 'node:crypto'
import { createReadStream, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const OLD = join(ROOT, 'old_assets')
const DRY = process.argv.includes('--dry-run')
const LOG_PATH = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')

/** @type {Array<{from: string, to: string, reason: string, status: string}>} */
const moves = []

function record(from, to, reason, status = 'done') {
  moves.push({
    from: from.replace(/\\/g, '/'),
    to: to.replace(/\\/g, '/'),
    reason,
    status,
  })
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

async function hashIfExists(rel) {
  const full = join(ROOT, rel)
  if (!existsSync(full) || !statSync(full).isFile()) return null
  return sha256(full)
}

/** Map public/village/foo → assets/... if ever mirrored (none today). */
function assetsRuntimeEquivalent(publicRel) {
  const p = publicRel.replace(/\\/g, '/')
  if (p.startsWith('public/village/')) {
    const name = basename(p)
    return `assets/Village/${name}`
  }
  return null
}

async function movePublicFile(fromRel, toRel, reason) {
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)
  if (!existsSync(from)) {
    record(fromRel, toRel, reason, 'skip-missing')
    return
  }
  if (!statSync(from).isFile()) return
  if (basename(from) === 'README.md') {
    record(fromRel, toRel, reason, 'skip-readme')
    return
  }

  const assetsEq = assetsRuntimeEquivalent(fromRel)
  if (assetsEq && existsSync(join(ROOT, assetsEq))) {
    try {
      const [a, b] = await Promise.all([sha256(from), hashIfExists(assetsEq)])
      if (a && b && a === b) {
        record(fromRel, toRel, `${reason} — duplicate of ${assetsEq}`, 'skip-dedup-assets')
        return
      }
    } catch {
      record(fromRel, toRel, reason, 'skip-dedup-check-failed')
      return
    }
  }

  if (existsSync(to)) {
    record(fromRel, toRel, reason, 'skip-dest-exists')
    return
  }

  if (DRY) {
    record(fromRel, toRel, reason)
    console.log(`[dry-run] ${fromRel} → ${toRel}`)
    return
  }

  mkdirSync(dirname(to), { recursive: true })
  renameSync(from, to)
  record(fromRel, toRel, reason)
}

/** Village files still referenced by src (keep in public/). */
const VILLAGE_KEEP = new Set([
  'panorama-base.webp',
  'panorama-v1.png',
  'hero-banner.png',
])

async function archiveVillageOrphans() {
  const villageRoot = join(ROOT, 'public/village')
  if (!existsSync(villageRoot)) return

  async function walk(dir, prefix = 'public/village') {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name)
      if (statSync(full).isDirectory()) {
        await walk(full, `${prefix}/${name}`)
        continue
      }
      const rel = `${prefix}/${name}`.replace(/\\/g, '/')
      if (VILLAGE_KEEP.has(name) && !rel.includes('buildings-map')) continue
      const destRel = rel.replace(/^public\//, 'old_assets/public-mirror/')
      await movePublicFile(rel, destRel, 'Village orphan — not referenced in src runtime')
    }
  }
  await walk(villageRoot)
}

function writePublicVillageReadme() {
  const path = join(ROOT, 'public/village/README.md')
  const content = `# Village runtime assets

Fichiers servis par Vite depuis \`public/village/\` (pas encore migrés vers \`assets/\`).

**Actifs (ne pas archiver) :**
- \`panorama-base.webp\` — panorama principal (\`villageMap.ts\`)
- \`panorama-v1.png\` — fallback legacy (\`panoramaLegacyAsset\`)
- \`hero-banner.png\` — bannière (\`App.css\`)

Orphelins (stages, buildings-map, etc.) → \`old_assets/public-mirror/village/\`

Voir \`docs/traceability/assets/old-assets-cleanup-log.md\`
`
  if (!DRY) writeFileSync(path, content, 'utf8')
}

function appendLog() {
  const ts = new Date().toISOString().slice(0, 10)
  const header = `\n\n---\n\n## Session ${ts}${DRY ? ' (dry-run)' : ''}\n\n| From | To | Reason | Status |\n|------|-----|--------|--------|\n`
  const rows = moves.map((m) => `| \`${m.from}\` | \`${m.to}\` | ${m.reason} | ${m.status} |`).join('\n')
  const footer = `\n\n### Reste légitime dans \`public/\`\n\n| Chemin | Pourquoi |\n|--------|----------|\n| \`public/village/\` (3 fichiers actifs) | Runtime village — pas de doublon dans \`assets/\` |\n| \`public/live2d/\` | Demo Live2D Haru |\n| \`public/assets/**\` README | Redirects post-migration |\n| \`public/gacha/README.md\` | Redirect → \`assets/Gacha/\` |\n| \`favicon.svg\`, \`icons.svg\`, \`manifest.webmanifest\` | Shell PWA |\n`

  const existing = existsSync(LOG_PATH)
    ? readFileSync(LOG_PATH, 'utf8')
    : '# old_assets cleanup log\n\nDedup rule: **never archive a mirror if the same bytes are the active file in `assets/`.**\n'

  if (!DRY) writeFileSync(LOG_PATH, existing + header + rows + footer, 'utf8')
}

console.log('Archive public orphans → old_assets\n')
await archiveVillageOrphans()
writePublicVillageReadme()

const stats = moves.reduce((acc, m) => {
  acc[m.status] = (acc[m.status] ?? 0) + 1
  return acc
}, {})
appendLog()
console.log(JSON.stringify({ total: moves.length, ...stats }, null, 2))
