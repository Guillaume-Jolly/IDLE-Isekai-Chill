#!/usr/bin/env node
/**
 * Inventaire read-only des assets image — manifest JSON pour phase 0 cleanup.
 * Usage: node scripts/inventory-assets-manifest.mjs [--out path]
 */
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const IMAGE_EXT = new Set(['.png', '.webp', '.jpg', '.jpeg', '.gif', '.svg'])
const SCAN_ROOTS = [
  'assets',
  'public',
  'old_assets',
  'staging',
  'Input chatgpt',
  'release',
]

function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue
    const full = join(dir, name)
    let st
    try {
      st = statSync(full)
    } catch {
      continue
    }
    if (st.isDirectory()) walk(full, out)
    else if (IMAGE_EXT.has(extname(name).toLowerCase())) out.push(full)
  }
  return out
}

function topBucket(rel) {
  const parts = rel.replace(/\\/g, '/').split('/')
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`
  return parts[0] ?? 'root'
}

function classify(rel) {
  const p = rel.replace(/\\/g, '/')
  if (p.startsWith('public/assets/companions/')) return 'runtime:companions'
  if (p.startsWith('public/assets/minigames/')) return 'runtime:minigames'
  if (p.startsWith('public/gacha/')) return 'runtime:gacha'
  if (p.startsWith('public/village/')) return 'runtime:village'
  if (p.startsWith('assets/event-disagrea/')) return 'source:disagrea'
  if (p.startsWith('assets/minigames/')) return 'source:minigames'
  if (p.startsWith('assets/gacha/')) return 'source:gacha'
  if (p.startsWith('old_assets/')) return 'archive'
  if (p.startsWith('staging/')) return 'staging'
  if (p.startsWith('Input chatgpt/')) return 'input-chatgpt'
  if (p.startsWith('public/companions/')) return 'runtime:legacy-companions'
  return 'other'
}

function sha256File(path) {
  const buf = readFileSync(path)
  return createHash('sha256').update(buf).digest('hex')
}

const outArg = process.argv.indexOf('--out')
const outPath =
  outArg >= 0 && process.argv[outArg + 1]
    ? process.argv[outArg + 1]
    : join(ROOT, 'staging/planning/asset-manifest.json')

const files = []
for (const root of SCAN_ROOTS) {
  files.push(...walk(join(ROOT, root)))
}

const byClass = {}
const byBucket = {}
const byExt = {}
/** @type {Map<string, string[]>} */
const hashGroups = new Map()

for (const full of files.sort()) {
  const rel = relative(ROOT, full).replace(/\\/g, '/')
  const ext = extname(full).toLowerCase()
  const st = statSync(full)
  const cls = classify(rel)
  const bucket = topBucket(rel)
  byClass[cls] = (byClass[cls] ?? 0) + 1
  byBucket[bucket] = (byBucket[bucket] ?? 0) + 1
  byExt[ext] = (byExt[ext] ?? 0) + 1

  let hash = null
  if (st.size <= 8 * 1024 * 1024) {
    try {
      hash = sha256File(full)
      if (!hashGroups.has(hash)) hashGroups.set(hash, [])
      hashGroups.get(hash).push(rel)
    } catch {
      hash = 'read-error'
    }
  } else {
    hash = 'skipped-large'
  }
}

const duplicates = [...hashGroups.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([hash, paths]) => ({ hash: hash.slice(0, 16), count: paths.length, paths }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 80)

const manifest = {
  generatedAt: new Date().toISOString(),
  repoRoot: ROOT.replace(/\\/g, '/'),
  phase: 0,
  totals: {
    imageFiles: files.length,
    byExtension: byExt,
    byClass,
    byTopBucket: byBucket,
    duplicateHashGroups: duplicates.length,
  },
  scanRoots: SCAN_ROOTS,
  duplicateSamples: duplicates,
  targetLayout: {
    assets: [
      'Compagnons/{id}/affinite',
      'Compagnons/{id}/cutouts',
      'Compagnons/{id}/chibis',
      'Compagnons/{id}/NSFW',
      'Compagnons/{id}/Autres/{batch}',
      'Background/{biomeId}',
      'Myrions/{biomeId}',
      'Gacha',
      'UI',
      'References',
      'Prompts',
    ],
    preserve: ['staging', 'Input chatgpt', 'old_assets'],
  },
  notes: [
    'Read-only inventory — no files moved.',
    'Hashes computed for files <= 8MB only.',
    'Phase 1+ will map each class to target paths.',
  ],
}

writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8')
console.log(`Wrote ${relative(ROOT, outPath)} (${files.length} images)`)
console.log('By class:', JSON.stringify(byClass))
