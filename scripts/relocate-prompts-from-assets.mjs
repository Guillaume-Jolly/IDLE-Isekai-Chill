#!/usr/bin/env node
/**
 * Move assets/Prompts → old_assets/prompts-archive + minimal scripts/references/.
 * Remove assets/UI, assets/References.
 * Usage: node scripts/relocate-prompts-from-assets.mjs [--dry-run]
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const PROMPTS = join(ROOT, 'assets/Prompts')
const ARCHIVE = join(ROOT, 'old_assets/prompts-archive')
const REFS = join(ROOT, 'scripts/references')
const DRY = process.argv.includes('--dry-run')

const KEEP = [
  ['integrated-portraits/GENERATION_JOBS.json', 'integrated-portraits/GENERATION_JOBS.json'],
  ['integrated-portraits/README.md', 'integrated-portraits/README.md'],
  ['disagrea/GENERATION_STYLE.md', 'disagrea/GENERATION_STYLE.md'],
  ['village-layout/slots.json', 'village-layout/slots.json'],
  ['village-layout/user-pack-meta.json', 'village-layout/user-pack-meta.json'],
  ['link-corpus-import/companion_link_conversations.v2.clean.jsonl', 'link-corpus/companion_link_conversations.v2.clean.jsonl'],
  ['link-corpus-import/manifest.json', 'link-corpus/manifest.json'],
  ['link-corpus-import/README.md', 'link-corpus/README.md'],
  ['link-corpus-import/README_IMPORT_CURSOR.md', 'link-corpus/README_IMPORT_CURSOR.md'],
  ['link-corpus-import/sample_lyra-aff1-001.json', 'link-corpus/sample_lyra-aff1-001.json'],
  ['link-corpus-import/sample_seren-aff4-037.json', 'link-corpus/sample_seren-aff4-037.json'],
  ['link-corpus-import/sample_sora-aff5-100.json', 'link-corpus/sample_sora-aff5-100.json'],
  ['link-corpus-import/sample_talia-aff2-044.json', 'link-corpus/sample_talia-aff2-044.json'],
  ['link-corpus-import/sample_zelie-aff5-088.json', 'link-corpus/sample_zelie-aff5-088.json'],
  ['link-corpus-import/summary_counts.csv', 'link-corpus/summary_counts.csv'],
  ['link-corpus-import/validation_issues_v2.csv', 'link-corpus/validation_issues_v2.csv'],
  ['link-corpus-import/validation_report_v2.md', 'link-corpus/validation_report_v2.md'],
  ['link-corpus-import/validate_companion_conversations_v2.py', 'link-corpus/validate_companion_conversations_v2.py'],
]

function gitMv(fromRel, toRel) {
  const from = fromRel.replace(/\\/g, '/')
  const to = toRel.replace(/\\/g, '/')
  if (DRY) {
    console.log(`[dry-run] ${from} → ${to}`)
    return
  }
  mkdirSync(dirname(join(ROOT, to)), { recursive: true })
  try {
    execSync(`git mv "${from}" "${to}"`, { cwd: ROOT, stdio: 'pipe' })
  } catch {
    renameSync(join(ROOT, from), join(ROOT, to))
  }
}

function removeDir(rel) {
  const full = join(ROOT, rel)
  if (!existsSync(full)) return
  if (DRY) {
    console.log(`[dry-run] rm ${rel}`)
    return
  }
  try {
    execSync(`git rm -rf "${rel.replace(/\\/g, '/')}"`, { cwd: ROOT, stdio: 'pipe' })
  } catch {
    rmSync(full, { recursive: true, force: true })
  }
}

console.log(`relocate assets/Prompts${DRY ? ' (dry-run)' : ''}\n`)

if (!existsSync(PROMPTS)) {
  console.log('assets/Prompts missing — skip archive move')
} else if (!DRY) {
  mkdirSync(dirname(ARCHIVE), { recursive: true })
  if (existsSync(ARCHIVE)) {
    console.error('old_assets/prompts-archive already exists — abort')
    process.exit(1)
  }
  gitMv('assets/Prompts', 'old_assets/prompts-archive')
}

mkdirSync(REFS, { recursive: true })

for (const [fromSuffix, toSuffix] of KEEP) {
  const from = `old_assets/prompts-archive/${fromSuffix}`
  const to = `scripts/references/${toSuffix}`
  if (!existsSync(join(ROOT, from))) {
    const alt = `assets/Prompts/${fromSuffix}`
    if (existsSync(join(ROOT, alt))) gitMv(alt, to)
    else console.warn(`skip missing: ${fromSuffix}`)
    continue
  }
  gitMv(from, to)
}

// Remove empty link-corpus-import dir if whole folder was moved then files extracted
for (const sub of ['link-corpus-import', 'integrated-portraits', 'disagrea', 'village-layout']) {
  const p = join(ARCHIVE, sub)
  if (existsSync(p) && statSync(p).isDirectory()) {
    try {
      if (readdirSync(p).length === 0) removeDir(`old_assets/prompts-archive/${sub}`)
    } catch {
      /* */
    }
  }
}

removeDir('assets/UI')
removeDir('assets/References')

// Remove empty assets/Prompts if anything left
removeDir('assets/Prompts')

console.log('\nDone.')
