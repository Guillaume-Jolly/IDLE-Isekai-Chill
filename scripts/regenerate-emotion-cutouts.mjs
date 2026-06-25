#!/usr/bin/env node
/**
 * Cutouts émotion v3 — archive, prompts, promotion depuis staging.
 *
 * Usage:
 *   node scripts/regenerate-emotion-cutouts.mjs list
 *   node scripts/regenerate-emotion-cutouts.mjs prompt lyra happy
 *   node scripts/regenerate-emotion-cutouts.mjs archive-obsolete [companionId ...]
 *   node scripts/regenerate-emotion-cutouts.mjs archive-obsolete --all-pending
 *   node scripts/regenerate-emotion-cutouts.mjs migrate-legacy-archives
 *   node scripts/regenerate-emotion-cutouts.mjs promote lyra
 *   node scripts/regenerate-emotion-cutouts.mjs promote --all
 */
import { existsSync, mkdirSync, readFileSync, renameSync } from 'node:fs'
import { join } from 'node:path'
import { chromaKeyPng } from './chroma-key-png.mjs'
import {
  ALL_CUTOUT_COMPANION_IDS,
  cutoutOutputPath,
  cutoutPrompt,
  cutoutStyleAnchor,
} from './staging/companion-visual-pack-data.mjs'
import { companionAssetPaths, oldAssetsRoot, repoRoot } from './minigame-asset-paths.mjs'

const ROOT = repoRoot
const STAGING = join(ROOT, 'staging/companion-visual-pack')
const LEGACY_ARCHIVE = join(oldAssetsRoot, 'companion-emotion-cutouts-replaced')
const EMOTIONS = JSON.parse(readFileSync(join(STAGING, 'data/emotions.json'), 'utf8')).emotions

/** old_assets/companions/{id}/cutouts/emotion-{emotion}.png */
function archiveCutoutDir(companionId) {
  return join(oldAssetsRoot, 'companions', companionId, 'cutouts')
}

function archiveCutoutPath(companionId, emotionId, suffix = '') {
  const base = `emotion-${emotionId}${suffix}.png`
  return join(archiveCutoutDir(companionId), base)
}

function stagingPath(companionId, emotionId) {
  return join(ROOT, cutoutOutputPath(companionId, emotionId, 'v3'))
}

function moveToArchive(fromPath, companionId, emotionId) {
  mkdirSync(archiveCutoutDir(companionId), { recursive: true })
  let dest = archiveCutoutPath(companionId, emotionId)
  if (existsSync(dest)) {
    dest = archiveCutoutPath(companionId, emotionId, '-v2-archived')
    if (existsSync(dest)) {
      const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
      dest = archiveCutoutPath(companionId, emotionId, `-v2-${stamp}`)
    }
  }
  renameSync(fromPath, dest)
  return dest
}

function usage() {
  console.error(`Usage:
  node scripts/regenerate-emotion-cutouts.mjs list [companionId]
  node scripts/regenerate-emotion-cutouts.mjs prompt <companionId> [emotionId]
  node scripts/regenerate-emotion-cutouts.mjs archive-obsolete <companionId> [...]
  node scripts/regenerate-emotion-cutouts.mjs archive-obsolete --all-pending
  node scripts/regenerate-emotion-cutouts.mjs migrate-legacy-archives
  node scripts/regenerate-emotion-cutouts.mjs promote <companionId> [...]
  node scripts/regenerate-emotion-cutouts.mjs promote --all`)
  process.exit(1)
}

function listJobs(filterId) {
  const ids = filterId ? [filterId] : ALL_CUTOUT_COMPANION_IDS
  let pending = 0
  let done = 0
  for (const id of ids) {
    console.log(`\n${id} (anchor: ${cutoutStyleAnchor(id)})`)
    for (const em of EMOTIONS) {
      const path = stagingPath(id, em.id)
      const status = existsSync(path) ? '✓' : '○'
      if (existsSync(path)) done += 1
      else pending += 1
      console.log(`  ${status} ${em.id}`)
    }
  }
  console.log(`\nTotal staging v3: ${done} done, ${pending} pending (${ids.length * EMOTIONS.length} jobs)`)
}

function printPrompt(companionId, emotionId) {
  if (!ALL_CUTOUT_COMPANION_IDS.includes(companionId)) {
    console.error('Unknown companion:', companionId)
    process.exit(1)
  }
  const emotions = emotionId ? EMOTIONS.filter((e) => e.id === emotionId) : EMOTIONS
  if (emotions.length === 0) {
    console.error('Unknown emotion:', emotionId)
    process.exit(1)
  }
  for (const em of emotions) {
    console.log('='.repeat(72))
    console.log(`${companionId} / ${em.id} → ${cutoutOutputPath(companionId, em.id, 'v3')}`)
    console.log('='.repeat(72))
    console.log('Reference:', cutoutStyleAnchor(companionId))
    console.log()
    console.log(cutoutPrompt(companionId, em.prompt))
    console.log()
  }
}

function archiveObsoleteOne(companionId) {
  let moved = 0
  for (const em of EMOTIONS) {
    const src = companionAssetPaths.emotion(companionId, em.id)
    if (!existsSync(src)) continue
    const dest = moveToArchive(src, companionId, em.id)
    console.log(`  → ${dest.replace(/\\/g, '/')}`)
    moved += 1
  }
  return moved
}

function migrateLegacyArchives() {
  if (!existsSync(LEGACY_ARCHIVE)) {
    console.log('No legacy archive folder.')
    return 0
  }
  let moved = 0
  for (const id of ALL_CUTOUT_COMPANION_IDS) {
    const legacyDir = join(LEGACY_ARCHIVE, id)
    if (!existsSync(legacyDir)) continue
    for (const em of EMOTIONS) {
      const legacyName = `emotion-${em.id}-v2-old.png`
      const legacyPath = join(legacyDir, legacyName)
      if (!existsSync(legacyPath)) continue
      const dest = archiveCutoutPath(id, em.id)
      mkdirSync(archiveCutoutDir(id), { recursive: true })
      if (existsSync(dest)) {
        renameSync(legacyPath, archiveCutoutPath(id, em.id, '-v2-legacy'))
      } else {
        renameSync(legacyPath, dest)
      }
      moved += 1
      console.log(`  ${id}/${em.id} legacy → cutouts/`)
    }
  }
  return moved
}

/** Compagnons dont le staging v3 est complet mais pas encore promu — skip si public vide. */
function pendingArchiveIds() {
  return ALL_CUTOUT_COMPANION_IDS.filter((id) => {
    const hasPublic = existsSync(companionAssetPaths.emotion(id, 'neutral'))
    const stagingComplete = EMOTIONS.every((em) => existsSync(stagingPath(id, em.id)))
    return hasPublic && !stagingComplete
  })
}

async function promoteOne(companionId) {
  let promoted = 0

  for (const em of EMOTIONS) {
    const src = stagingPath(companionId, em.id)
    const dest = companionAssetPaths.emotion(companionId, em.id)
    mkdirSync(dirname(dest), { recursive: true })
    if (!existsSync(src)) {
      console.warn(`  skip ${em.id}: missing ${src.replace(/\\/g, '/')}`)
      continue
    }
    if (existsSync(dest)) {
      const archived = moveToArchive(dest, companionId, em.id)
      console.log(`  archive ${em.id} → ${archived.replace(/\\/g, '/').split('old_assets/')[1] ?? archived}`)
    }
    await chromaKeyPng(src, dest)
    console.log(`  ✓ public emotion-${em.id}.png`)
    promoted += 1
  }
  return promoted
}

async function main() {
  const [cmd, ...args] = process.argv.slice(2)
  if (!cmd) usage()

  if (cmd === 'list') {
    listJobs(args[0])
    return
  }

  if (cmd === 'prompt') {
    const [id, emotion] = args
    if (!id) usage()
    printPrompt(id, emotion)
    return
  }

  if (cmd === 'migrate-legacy-archives') {
    const n = migrateLegacyArchives()
    console.log(`\n✓ ${n} fichiers migrés vers old_assets/companions/{id}/cutouts/`)
    return
  }

  if (cmd === 'archive-obsolete') {
    const ids =
      args[0] === '--all-pending'
        ? pendingArchiveIds()
        : args.length > 0
          ? args
          : usage() || []
    if (ids.length === 0) {
      console.log('Aucun cutout obsolete à archiver (--all-pending).')
      return
    }
    let total = 0
    for (const id of ids) {
      console.log(`\nArchive obsolete ${id}…`)
      total += archiveObsoleteOne(id)
    }
    console.log(`\n✓ ${total} fichiers déplacés → old_assets/companions/{id}/cutouts/emotion-*.png`)
    return
  }

  if (cmd === 'promote') {
    const ids = args[0] === '--all' ? ALL_CUTOUT_COMPANION_IDS : args
    if (ids.length === 0) usage()
    let total = 0
    for (const id of ids) {
      console.log(`\nPromote ${id}…`)
      total += await promoteOne(id)
    }
    console.log(`\n✓ ${total} cutouts promoted to public/assets/companions/`)
    return
  }

  usage()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
