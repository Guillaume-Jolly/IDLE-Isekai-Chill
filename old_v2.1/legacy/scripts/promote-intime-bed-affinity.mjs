#!/usr/bin/env node
/**
 * Promote intime-bed-batch v2 → affinity-4, v3 → affinity-5 (village companions).
 * Archives previous prod PNG to old_assets/Compagnons/{id}/affinite-replaced/.
 *
 * Usage: node scripts/promote-intime-bed-affinity.mjs [--execute]
 */
import { execSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const STAGING = join(ROOT, 'staging/companion-visual-pack/intime-bed-batch')
const DRY = !process.argv.includes('--execute')
const STAMP = new Date().toISOString().slice(0, 10)

const VILLAGE_IDS = [
  'lyra', 'maeve', 'seren', 'nami', 'iris', 'kael', 'runa', 'solene', 'talia',
  'mira', 'asha', 'elwen', 'noa', 'sora', 'zelie',
]

function rel(full) {
  return full.slice(ROOT.length + 1).replace(/\\/g, '/')
}

function gitMv(from, to) {
  mkdirSync(dirname(to), { recursive: true })
  execSync(`git mv -f "${rel(from)}" "${rel(to)}"`, { cwd: ROOT, stdio: 'pipe' })
}

function archiveProd(id, level) {
  const prod = join(ROOT, 'assets/Compagnons', id, 'affinite', `affinity-${level}.png`)
  if (!existsSync(prod)) return
  const archive = join(
    ROOT,
    'old_assets/Compagnons',
    id,
    'affinite-replaced',
    `affinity-${level}-pre-bed-${STAMP}.png`,
  )
  if (DRY) {
    console.log(`  archive → ${rel(archive)}`)
    return
  }
  gitMv(prod, archive)
}

function promote(id, version, level) {
  const src = join(STAGING, `companion-${id}-intime-bed-${version}.png`)
  const dest = join(ROOT, 'assets/Compagnons', id, 'affinite', `affinity-${level}.png`)
  if (!existsSync(src)) {
    console.warn(`SKIP missing companion-${id}-intime-bed-${version}.png`)
    return
  }
  console.log(`${id}: bed-${version} → affinity-${level}.png`)
  archiveProd(id, level)
  if (DRY) return
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(src, dest)
  execSync(`git add -f "${rel(dest)}"`, { cwd: ROOT, stdio: 'pipe' })
}

console.log(DRY ? 'DRY-RUN' : 'EXECUTE', 'promote intime-bed → affinite')
for (const id of VILLAGE_IDS) {
  promote(id, 'v2', 4)
  promote(id, 'v3', 5)
}
