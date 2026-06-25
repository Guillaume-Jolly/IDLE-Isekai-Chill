#!/usr/bin/env node
/**
 * Finish assets/ tree cleanup — archive stubs, relocate meta, stage git.
 * Never deletes asset data: moves to old_assets/ or docs/traceability/.
 *
 * Usage: node scripts/finish-assets-tree-cleanup.mjs [--dry-run]
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
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const ASSETS = join(ROOT, 'assets')
const ARCHIVE = join(ROOT, 'old_assets', 'archive', '2026-06-25-assets-stubs')
const DOCS_DISAGREA = join(ROOT, 'docs', 'traceability', 'assets', 'disagrea-integrated')
const DRY = process.argv.includes('--dry-run')

const STUB_TOP_LEVEL = [
  'event-disagrea',
  'minigames',
  'myrions-import',
  'talia-import',
  'link-corpus-import',
  'integrated-portraits',
  'village-layout',
  'gacha-frames',
]

/** Tracked redirect READMEs already removed from disk — stage git rm. */
const REDUNDANT_READMES_GIT = [
  'assets/Gacha/cinema/README.md',
  'assets/Gacha/cinema/disagrea/README.md',
  'assets/minigames/README.md',
]

/** On-disk READMEs to archive (not runtime docs). */
const REDUNDANT_READMES_ARCHIVE = ['assets/UI/README.md', 'assets/References/README.md']

const COMPAGNONS_AUTRES_STUB = 'assets/Compagnons/Autres/disagrea-integrated'

const stats = {
  stubsArchived: 0,
  metaRelocated: 0,
  readmesStaged: 0,
  readmesArchived: 0,
  emptyDirsRemoved: 0,
  gitAdds: 0,
  errors: [],
}

function log(msg) {
  console.log(DRY ? `[dry-run] ${msg}` : msg)
}

function gitTracked(rel) {
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

function moveFile(fromRel, toRel) {
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)
  if (!existsSync(from)) return false
  const fromGit = fromRel.replace(/\\/g, '/')
  const toGit = toRel.replace(/\\/g, '/')
  log(`mv ${fromGit} → ${toGit}`)
  if (DRY) return true
  mkdirSync(dirname(to), { recursive: true })
  try {
    if (gitTracked(fromGit)) {
      execSync(`git mv "${fromGit}" "${toGit}"`, { cwd: ROOT, stdio: 'inherit' })
    } else {
      renameSync(from, to)
    }
    return true
  } catch (e) {
    stats.errors.push(`${fromGit}: ${e.message}`)
    return false
  }
}

function archivePath(relPath) {
  const full = join(ROOT, relPath)
  if (!existsSync(full)) return
  const dest = join(ARCHIVE, relPath.replace(/^assets[/\\]/, ''))
  const destRel = dest.replace(/\\/g, '/').replace(`${ROOT.replace(/\\/g, '/')}/`, '')
  log(`archive ${relPath} → ${destRel}`)
  if (DRY) {
    stats.stubsArchived++
    return
  }
  mkdirSync(dirname(dest), { recursive: true })
  const gitPath = relPath.replace(/\\/g, '/')
  try {
    if (gitTracked(gitPath)) {
      execSync(`git mv "${gitPath}" "${destRel}"`, { cwd: ROOT, stdio: 'inherit' })
    } else {
      renameSync(full, dest)
    }
    stats.stubsArchived++
  } catch (e) {
    stats.errors.push(`${gitPath}: ${e.message}`)
  }
}

function stageGitRm(relPath) {
  const gitPath = relPath.replace(/\\/g, '/')
  if (!gitTracked(gitPath)) return
  log(`git rm (staged delete) ${gitPath}`)
  if (DRY) {
    stats.readmesStaged++
    return
  }
  try {
    execSync(`git rm "${gitPath}"`, { cwd: ROOT, stdio: 'inherit' })
    stats.readmesStaged++
  } catch (e) {
    stats.errors.push(`${gitPath}: ${e.message}`)
  }
}

function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) removeEmptyDirs(full)
  }
  if (dir === ASSETS) return
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return
  }
  if (entries.length !== 0) return

  const rel = dir.replace(/\\/g, '/').replace(`${ROOT.replace(/\\/g, '/')}/`, '')
  log(`rmdir empty: ${rel}`)
  if (DRY) {
    stats.emptyDirsRemoved++
    return
  }
  try {
    if (gitTracked(rel)) {
      execSync(`git rm -r "${rel}"`, { cwd: ROOT, stdio: 'pipe' })
    } else {
      renameSync(dir, join(ARCHIVE, 'empty-dirs', rel.replace(/^assets[/\\]/, '')))
    }
    stats.emptyDirsRemoved++
  } catch {
    /* locked or not empty */
  }
}

function relocateDisagreaIntegratedStub() {
  const stub = join(ROOT, COMPAGNONS_AUTRES_STUB)
  if (!existsSync(stub)) return

  const metaFiles = ['VALIDATED_MANIFEST.json', 'README.md']
  let moved = 0
  for (const file of metaFiles) {
    const src = `${COMPAGNONS_AUTRES_STUB}/${file}`
    if (!existsSync(join(ROOT, src))) continue
    if (moveFile(src, `docs/traceability/assets/disagrea-integrated/${file}`)) {
      moved++
    }
  }
  stats.metaRelocated += moved

  const remaining = existsSync(stub) ? readdirSync(stub) : []
  if (remaining.length === 0) {
    archivePath(`${COMPAGNONS_AUTRES_STUB}`)
    removeEmptyDirs(join(ROOT, 'assets/Compagnons/Autres'))
  }
}

function updateDisagreaIntegratedReadme() {
  const readmePath = join(DOCS_DISAGREA, 'README.md')
  if (!existsSync(readmePath)) return
  let content = readFileSync(readmePath, 'utf8')
  content = content.replace(
    /assets\/event-disagrea\/integrated\/companions\/<id>\//g,
    'assets/Compagnons/<id>/Autres/disagrea-integrated/',
  )
  content = content.replace(
    /`\.\.\/\.\.\/docs\/BACKLOG\.md`/g,
    '`../../../BACKLOG.md`',
  )
  content += `\n\nManifest canonique : \`docs/traceability/assets/disagrea-integrated/VALIDATED_MANIFEST.json\`\n`
  if (!DRY) writeFileSync(readmePath, content, 'utf8')
  log('update docs/traceability/assets/disagrea-integrated/README.md paths')
}

function ensureGachaEventManifest() {
  const manifestRel = 'assets/Gacha/event/disagrea/manifest.json'
  const manifestPath = join(ROOT, manifestRel)
  if (!existsSync(manifestPath)) {
    log(`warn: missing ${manifestRel} — run import-disagrea-gacha-cinema.mjs if needed`)
    return
  }
  log(`ok: ${manifestRel} (cinema frames → assets/Gacha/cinema/disagrea/)`)
}

function gitStagePromptsTree() {
  const paths = [
    'assets/Prompts',
    'assets/README.md',
    'assets/UI',
    'assets/References',
    'docs/traceability/assets/disagrea-integrated',
    'old_assets/archive/2026-06-25-assets-stubs',
  ]
  for (const rel of paths) {
    const full = join(ROOT, rel)
    if (!existsSync(full)) continue
    log(`git add ${rel}`)
    if (DRY) {
      stats.gitAdds++
      continue
    }
    try {
      execSync(`git add "${rel.replace(/\\/g, '/')}"`, { cwd: ROOT, stdio: 'inherit' })
      stats.gitAdds++
    } catch (e) {
      stats.errors.push(`git add ${rel}: ${e.message}`)
    }
  }
  if (!DRY) {
    try {
      execSync('git add -u assets/', { cwd: ROOT, stdio: 'inherit' })
    } catch {
      /* nothing to update */
    }
  }
}

function writeAssetsReadme() {
  const content = `# assets/ — source-of-truth visuels

Runtime servi via \`vite.repo-assets.ts\`. URLs \`/assets/...\` et \`/gacha/...\` inchangées.

## Arborescence (top-level)

| Dossier | Rôle |
|---------|------|
| \`Compagnons/\` | Portraits, cutouts, chibis, NSFW, guides |
| \`Background/\` | Biomes capture + dressage |
| \`Myrions/\` | cutout / chibi / silhouette par biome |
| \`Gacha/\` | Icônes, cinéma, events (servi \`/gacha/\`) |
| \`Prompts/\` | Imports IA, sources brutes, corpus, layouts — **pas runtime** |
| \`UI/\` | Placeholder icônes/frames hors gacha |
| \`References/\` | Placeholder ancres style génération |

Index redirects : \`docs/traceability/REFERENCES.md\`

Disagrea integrated manifest : \`docs/traceability/assets/disagrea-integrated/VALIDATED_MANIFEST.json\`

## Anciens chemins (ne pas recréer)

| Ancien | Nouveau |
|--------|---------|
| \`assets/event-disagrea/\` | \`Compagnons/.../disagrea-integrated/\`, \`Background/disagrea-event/\`, \`Prompts/disagrea/\` |
| \`assets/minigames/\` | \`Prompts/minigames/\` |
| \`assets/myrions-import/\` | \`Prompts/imports/myrions-import/\` |
| \`assets/talia-import/\` | \`Prompts/imports/talia-import/\` |
| \`assets/link-corpus-import/\` | \`Prompts/link-corpus-import/\` |
| \`assets/integrated-portraits/\` | \`Prompts/integrated-portraits/\` |
| \`assets/village-layout/\` | \`Prompts/village-layout/\` |
| \`assets/gacha-frames/\` | \`Gacha/sources/frames/\` |
| \`Compagnons/Autres/disagrea-integrated/\` (meta seul) | \`docs/traceability/assets/disagrea-integrated/\` |

Scripts : \`scripts/minigame-asset-paths.mjs\` → \`promptsAssetRoot\`
`
  log('write assets/README.md')
  if (!DRY) writeFileSync(join(ASSETS, 'README.md'), content, 'utf8')
}

function ensurePlaceholder(dirName) {
  const dir = join(ASSETS, dirName)
  if (!existsSync(dir)) {
    log(`mkdir ${dirName}`)
    if (!DRY) mkdirSync(dir, { recursive: true })
  }
  const keep = join(dir, '.gitkeep')
  if (!existsSync(keep)) {
    log(`write ${dirName}/.gitkeep`)
    if (!DRY) writeFileSync(keep, '', 'utf8')
  }
}

console.log('Finish assets/ tree cleanup\n')

for (const stub of STUB_TOP_LEVEL) {
  const rel = `assets/${stub}`
  if (existsSync(join(ROOT, rel))) {
    archivePath(rel)
  }
}

relocateDisagreaIntegratedStub()
updateDisagreaIntegratedReadme()
ensureGachaEventManifest()

for (const rel of REDUNDANT_READMES_GIT) {
  if (gitTracked(rel) && !existsSync(join(ROOT, rel))) {
    stageGitRm(rel)
  } else if (existsSync(join(ROOT, rel))) {
    archivePath(rel)
    stats.readmesArchived++
  }
}

for (const rel of REDUNDANT_READMES_ARCHIVE) {
  if (existsSync(join(ROOT, rel))) {
    archivePath(rel)
    stats.readmesArchived++
  }
}

for (let i = 0; i < 10; i++) {
  const before = stats.emptyDirsRemoved
  removeEmptyDirs(ASSETS)
  if (stats.emptyDirsRemoved === before && i > 0) break
}

writeAssetsReadme()
ensurePlaceholder('UI')
ensurePlaceholder('References')
gitStagePromptsTree()

console.log('\n--- Stats ---')
console.log(JSON.stringify(stats, null, 2))
