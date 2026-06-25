#!/usr/bin/env node
/**
 * Archive legacy emotion cutouts from old_assets Compagnons cutouts folders
 * to old_assets/archive/2026-06-25-cutouts-emotion-legacy/ (never delete).
 *
 * Usage: node scripts/archive-legacy-emotion-cutouts.mjs [--dry-run]
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const DRY = process.argv.includes('--dry-run')
const ARCHIVE_DATE = '2026-06-25-cutouts-emotion-legacy'
const MANIFEST = join(ROOT, 'To check manually/old-assets-dedup-conflicts/manifest.json')
const LOG = join(ROOT, 'docs/traceability/assets/old-assets-cleanup-log.md')

function isTracked(rel) {
  try {
    execSync(`git ls-files --error-unmatch "${rel}"`, { cwd: ROOT, stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const entries = manifest.filter((e) => e.oldAssets.includes('/cutouts/emotion-'))

let moved = 0
let skipped = 0
let errors = 0

console.log(`${DRY ? 'dry-run' : 'execute'}: archive ${entries.length} legacy emotion cutouts`)

for (const entry of entries) {
  const fromRel = entry.oldAssets
  const idMatch = /old_assets\/Compagnons\/([^/]+)\//.exec(entry.oldAssets)
  const id = idMatch?.[1]
  const file = entry.basename
  const toRel = id
    ? `old_assets/Compagnons/${id}/cutouts-legacy/${file}`
    : `old_assets/Compagnons/_archive/${ARCHIVE_DATE}/${fromRel.replace(/^old_assets\//, '')}`
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)

  if (!existsSync(from)) {
    skipped++
    continue
  }

  if (DRY) {
    console.log(`  ${fromRel} → ${toRel}`)
    moved++
    continue
  }

  mkdirSync(dirname(to), { recursive: true })
  try {
    if (isTracked(fromRel)) {
      execSync(`git mv -f "${fromRel}" "${toRel}"`, { cwd: ROOT, stdio: 'pipe' })
    } else {
      renameSync(from, to)
    }
    moved++
  } catch (e) {
    errors++
    console.error(`Error: ${fromRel}: ${e.message}`)
  }
}

if (!DRY && moved > 0) {
  appendFileSync(
    LOG,
    [
      '',
      '---',
      '',
      '## Session 2026-06-25 — archivage cutouts émotion legacy (go user)',
      '',
      `Déplacement de **${moved}** fichiers \`old_assets/Compagnons/*/cutouts/emotion-*.png\` → \`old_assets/archive/${ARCHIVE_DATE}/Compagnons/…\``,
      '',
      'Décision : prod \`assets/\` = cutouts v3 corrects ; legacy (dont Maeve/Etna mix public/) en cold storage.',
      '',
      `Skipped: ${skipped}, errors: ${errors}`,
      '',
    ].join('\n'),
  )
}

console.log(JSON.stringify({ total: entries.length, moved, skipped, errors, dryRun: DRY }))
