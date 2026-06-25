#!/usr/bin/env node
/**
 * Assets cleanup — move legacy top-level folders to target architecture.
 * Usage: node scripts/apply-assets-cleanup.mjs [--dry-run]
 */
import { createHash } from 'node:crypto'
import { execSync } from 'node:child_process'
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')
const DRY = process.argv.includes('--dry-run')
const TO_CHECK = join(ROOT, 'To check manually')
const LOG_PATH = join(ROOT, 'docs/traceability/assets/assets-cleanup-log.md')

/** @type {Array<{from: string, to: string, reason: string, status: string}>} */
const moves = []

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

function record(fromRel, toRel, reason, status = 'done') {
  moves.push({ from: fromRel.replace(/\\/g, '/'), to: toRel.replace(/\\/g, '/'), reason, status })
}

function moveFile(fromRel, toRel, reason) {
  const from = join(ROOT, fromRel)
  const to = join(ROOT, toRel)
  if (!existsSync(from)) {
    record(fromRel, toRel, reason, 'skip-missing')
    return false
  }
  if (existsSync(to)) {
    record(fromRel, toRel, reason, 'skip-exists')
    log(`skip exists: ${toRel}`)
    return false
  }
  mkdirSync(dirname(to), { recursive: true })
  const fromGit = fromRel.replace(/\\/g, '/')
  const toGit = toRel.replace(/\\/g, '/')
  if (DRY) {
    log(`mv ${fromGit} → ${toGit}`)
    record(fromRel, toRel, reason)
    return true
  }
  if (gitTracked(fromGit)) {
    execSync(`git mv "${fromGit}" "${toGit}"`, { cwd: ROOT, stdio: 'inherit' })
  } else {
    renameSync(from, to)
  }
  record(fromRel, toRel, reason)
  return true
}

function moveDirContents(fromRel, toRel, reason, filter = () => true) {
  const from = join(ROOT, fromRel)
  if (!existsSync(from)) return 0
  let count = 0
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (!filter(entry.name)) continue
    const subFrom = `${fromRel}/${entry.name}`.replace(/\\/g, '/')
    const subTo = `${toRel}/${entry.name}`.replace(/\\/g, '/')
    if (entry.isDirectory()) {
      for (const f of walkFiles(join(ROOT, subFrom))) {
        const rel = relative(join(ROOT, subFrom), f).replace(/\\/g, '/')
        if (moveFile(`${subFrom}/${rel}`, `${subTo}/${rel}`, reason)) count += 1
      }
    } else if (moveFile(subFrom, subTo, reason)) {
      count += 1
    }
  }
  return count
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walkFiles(full, out)
    else out.push(full)
  }
  return out
}

function sha256File(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256')
    createReadStream(path)
      .on('data', (d) => hash.update(d))
      .on('end', () => resolve(hash.digest('hex')))
      .on('error', reject)
  })
}

async function moveIntegratedCompanions() {
  const srcRoot = join(ROOT, 'assets/event-disagrea/integrated/companions')
  if (!existsSync(srcRoot)) return
  for (const entry of readdirSync(srcRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const id = entry.name
    const dir = join(srcRoot, id)
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.png'))) {
      moveFile(
        `assets/event-disagrea/integrated/companions/${id}/${file}`,
        `assets/Compagnons/${id}/Autres/disagrea-integrated/${file}`,
        'Disagrea integrated portraits → taxonomy Compagnons/Autres/disagrea-integrated',
      )
    }
  }
  for (const meta of ['VALIDATED_MANIFEST.json', 'README.md']) {
    moveFile(
      `assets/event-disagrea/integrated/${meta}`,
      `assets/Compagnons/Autres/disagrea-integrated/${meta}`,
      'Disagrea integrated manifest/docs → Compagnons/Autres/disagrea-integrated',
    )
  }
}

function moveDisagreaBackgrounds() {
  const bgMap = [
    ['assets/event-disagrea/backgrounds/affinity', 'assets/Background/disagrea-event/affinity'],
    ['assets/event-disagrea/backgrounds/minigame', 'assets/Background/disagrea-event/minigame'],
  ]
  for (const [from, to] of bgMap) {
    moveDirContents(from, to, 'Disagrea affinity/minigame BGs → Background/disagrea-event/')
  }
  for (const meta of ['manifest.json', 'README_CURSOR.txt']) {
    const src = `assets/event-disagrea/backgrounds/${meta}`
    const dest = `assets/Background/disagrea-event/${meta}`
    if (existsSync(join(ROOT, dest))) {
      moveFile(src, `To check manually/disagrea-backgrounds-${meta}`, `Duplicate ${meta} — manual review`)
    } else {
      moveFile(src, dest, 'Disagrea backgrounds manifest → Background/disagrea-event/')
    }
  }
}

function movePromptsAndImports() {
  const promptMoves = [
    ['assets/minigames/dressage/myrions/chibi/sources', 'assets/Prompts/minigames/chibi-sources'],
    ['assets/minigames/capture/myrions/cutout/sources', 'assets/Prompts/minigames/cutout-sources'],
    [
      'assets/minigames/capture/companions/talia/sources',
      'assets/Prompts/minigames/talia-sources',
    ],
    ['assets/myrions-import', 'assets/Prompts/imports/myrions-import'],
    ['assets/talia-import', 'assets/Prompts/imports/talia-import'],
    ['assets/link-corpus-import', 'assets/Prompts/link-corpus-import'],
    ['assets/integrated-portraits', 'assets/Prompts/integrated-portraits'],
    ['assets/village-layout', 'assets/Prompts/village-layout'],
  ]
  for (const [from, to] of promptMoves) {
    if (!existsSync(join(ROOT, from))) continue
    moveDirContents(from, to, 'Import/staging → assets/Prompts/')
  }
}

function moveDisagreaDocs() {
  moveFile(
    'assets/event-disagrea/GENERATION_STYLE.md',
    'assets/Prompts/disagrea/GENERATION_STYLE.md',
    'Disagrea generation style doc → Prompts/disagrea/',
  )
}

function moveLooseRootPngs() {
  const assetsRoot = join(ROOT, 'assets')
  if (!existsSync(assetsRoot)) return
  for (const name of readdirSync(assetsRoot)) {
    if (!name.startsWith('source-') || !name.endsWith('.png')) continue
    moveFile(
      `assets/${name}`,
      `To check manually/loose-root-pngs/${name}`,
      'Loose source PNG at assets root — manual classification',
    )
  }
}

async function handleGachaDuplicates() {
  const dupSrc = join(ROOT, 'assets/gacha/event/disagrea')
  const cinemaDir = join(ROOT, 'assets/Gacha/cinema/disagrea')
  if (!existsSync(dupSrc)) return

  mkdirSync(join(TO_CHECK, 'gacha-event-disagrea-candidates'), { recursive: true })
  const readme = join(TO_CHECK, 'gacha-event-disagrea-candidates/README.md')

  for (const file of readdirSync(dupSrc)) {
    const srcPath = join(dupSrc, file)
    if (!statSync(srcPath).isFile()) continue
    if (file.endsWith('.png')) {
      const cinemaPath = join(cinemaDir, file)
      let reason = 'Gacha event/disagrea PNG — candidate duplicate (old_assets phase pending)'
      if (existsSync(cinemaPath)) {
        try {
          const [a, b] = await Promise.all([sha256File(srcPath), sha256File(cinemaPath)])
          reason =
            a === b
              ? 'Exact duplicate of Gacha/cinema/disagrea/ — archive after public→old_assets'
              : 'Differs from Gacha/cinema/disagrea/ — manual review'
        } catch {
          /* keep default reason */
        }
      }
      moveFile(
        `assets/gacha/event/disagrea/${file}`,
        `To check manually/gacha-event-disagrea-candidates/${file}`,
        reason,
      )
    } else if (file.endsWith('.json') || file.endsWith('.md')) {
      moveFile(
        `assets/gacha/event/disagrea/${file}`,
        `assets/Gacha/event/disagrea/${file}`,
        'Gacha event manifest → assets/Gacha/event/disagrea/',
      )
    }
  }

  if (!DRY && !existsSync(readme)) {
    writeFileSync(
      readme,
      `# Gacha event/disagrea — candidats archive

PNG déplacés depuis \`assets/gacha/event/disagrea/\` pendant cleanup Assets 2.0.

Runtime gacha cinema : \`assets/Gacha/cinema/disagrea/\` (servi via \`/gacha/\`).

**Ne pas archiver vers old_assets/** avant migration public→old_assets.
Comparer hash avec \`Gacha/cinema/disagrea/\` ; doublons exacts → old_assets après go user.
`,
      'utf8',
    )
  }
}

function removeEmptyDirs(dir) {
  if (!existsSync(dir)) return
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) removeEmptyDirs(full)
  }
  if (readdirSync(dir).length === 0 && dir !== ROOT) {
    log(`rmdir empty: ${relative(ROOT, dir)}`)
    if (!DRY) {
      try {
        renameSync(dir, dir) // noop guard
        execSync(`rmdir "${dir}"`, { cwd: ROOT, stdio: 'pipe' })
      } catch {
        /* non-empty or tracked */
      }
    }
  }
}

function writeEventDisagreaStub() {
  const stubPath = join(ROOT, 'assets/event-disagrea/README.md')
  const content = `# event-disagrea — redirect (Assets 2.0 cleanup)

Contenu migré :

| Ancien | Nouveau |
|--------|---------|
| \`integrated/companions/\` | \`assets/Compagnons/{id}/Autres/disagrea-integrated/\` |
| \`backgrounds/\` | \`assets/Background/disagrea-event/\` |
| \`GENERATION_STYLE.md\` | \`assets/Prompts/disagrea/GENERATION_STYLE.md\` |

Dev gallery : \`/dev-assets/event-disagrea/integrated/companions/...\` résolu via \`vite.config.ts\` → \`Compagnons/Autres/disagrea-integrated/\`.

Scripts : \`scripts/import-disagrea-assets.mjs\`, \`scripts/promote-companion-visual-pack.mjs\`.
`
  if (!DRY) writeFileSync(stubPath, content, 'utf8')
}

function writeMinigamesStub() {
  const stubPath = join(ROOT, 'assets/minigames/README.md')
  const content = `# minigames sources — redirect (Assets 2.0 cleanup)

Sources brutes déplacées vers \`assets/Prompts/minigames/\`.

Runtime mini-jeux servi depuis \`assets/Background/\`, \`assets/Myrions/\`, \`assets/Compagnons/\` via \`vite.repo-assets.ts\`.

Chemins scripts : \`scripts/minigame-asset-paths.mjs\` → \`sourceMinigamePaths\`.
`
  if (!DRY) writeFileSync(stubPath, content, 'utf8')
}

function appendCleanupLog() {
  const ts = new Date().toISOString().slice(0, 10)
  const header = `# Assets cleanup log

Updated: ${ts}
Session: apply-assets-cleanup.mjs${DRY ? ' (dry-run)' : ''}

## Moves

| From | To | Reason | Status |
|------|-----|--------|--------|
`
  const rows = moves
    .map((m) => `| \`${m.from}\` | \`${m.to}\` | ${m.reason} | ${m.status} |`)
    .join('\n')

  const footer = `

## Post public→old_assets (planned)

- Dedupe : si fichier actif dans \`assets/\`, ne pas dupliquer dans \`old_assets/\`
- Candidats : \`To check manually/gacha-event-disagrea-candidates/\`
- \`public/gacha/\`, \`public/village/\`, \`public/live2d/\` — migration séparée

## Top-level cible restant

\`Compagnons/\`, \`Background/\`, \`Myrions/\`, \`Gacha/\`, \`UI/\`, \`References/\`, \`Prompts/\`
`

  const existing = existsSync(LOG_PATH) ? readFileSync(LOG_PATH, 'utf8') : ''
  const section = `\n\n---\n\n${header}${rows}${footer}`
  if (!DRY) {
    writeFileSync(LOG_PATH, (existing || '# Assets cleanup log\n') + section, 'utf8')
  }
}

console.log('Assets cleanup — apply moves\n')
await moveIntegratedCompanions()
moveDisagreaBackgrounds()
movePromptsAndImports()
moveDisagreaDocs()
moveLooseRootPngs()
await handleGachaDuplicates()
writeEventDisagreaStub()
writeMinigamesStub()

if (!DRY) {
  removeEmptyDirs(join(ROOT, 'assets/event-disagrea'))
  removeEmptyDirs(join(ROOT, 'assets/gacha/event/disagrea'))
  removeEmptyDirs(join(ROOT, 'assets/minigames'))
}

appendCleanupLog()

const stats = moves.reduce((acc, m) => {
  acc[m.status] = (acc[m.status] ?? 0) + 1
  return acc
}, {})
console.log('\n--- Stats ---')
console.log(JSON.stringify({ total: moves.length, ...stats }, null, 2))
