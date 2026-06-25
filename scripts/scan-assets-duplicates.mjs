#!/usr/bin/env node
/**
 * Find byte-identical images under assets/.
 * Usage: node scripts/scan-assets-duplicates.mjs [--json]
 */
import { createHash } from 'node:crypto'
import { createReadStream, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const ASSETS = join(ROOT, 'assets')
const IMAGE = /\.(png|webp|jpg|jpeg|gif|svg)$/i

function sha256(path) {
  return new Promise((resolve, reject) => {
    const h = createHash('sha256')
    createReadStream(path)
      .on('data', (d) => h.update(d))
      .on('end', () => resolve(h.digest('hex')))
      .on('error', reject)
  })
}

async function walk(dir, acc) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) await walk(full, acc)
    else if (IMAGE.test(name)) {
      const hash = await sha256(full)
      const rel = full.slice(ROOT.length + 1).replace(/\\/g, '/')
      if (!acc.has(hash)) acc.set(hash, [])
      acc.get(hash).push(rel)
    }
  }
}

const hashes = new Map()
await walk(ASSETS, hashes)

const groups = [...hashes.entries()]
  .filter(([, paths]) => paths.length > 1)
  .map(([hash, paths]) => ({ hash, count: paths.length, paths: paths.sort() }))
  .sort((a, b) => b.count - a.count)

const out = {
  totalImages: [...hashes.values()].reduce((n, p) => n + p.length, 0),
  uniqueHashes: hashes.size,
  duplicateGroups: groups.length,
  redundantCopies: groups.reduce((n, g) => n + g.count - 1, 0),
  groups,
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(out, null, 2))
} else {
  console.log(
    `Images: ${out.totalImages} | Unique: ${out.uniqueHashes} | Duplicate groups: ${out.duplicateGroups} | Redundant copies: ${out.redundantCopies}\n`,
  )
  for (const g of groups) {
    console.log(`--- ${g.count}x ${g.hash.slice(0, 12)}... ---`)
    for (const p of g.paths) console.log(`  ${p}`)
    console.log()
  }
}
