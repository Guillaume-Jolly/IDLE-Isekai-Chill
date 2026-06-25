#!/usr/bin/env node
/**
 * Archive les chibis prod → old_assets, détourage chroma-key, promotion public/.
 *
 * Usage:
 *   node scripts/regenerate-village-chibis.mjs kael noa elwen
 *   node scripts/regenerate-village-chibis.mjs --raw companion-kael-chibi-v2-raw.png kael
 *
 * Fichier raw attendu (par défaut) :
 *   staging/companion-visual-pack/village/{id}/chibi/companion-{id}-chibi-v2-raw.png
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromaKeyPng } from './chroma-key-png.mjs'
import { companionAssetPaths, oldAssetsRoot, repoRoot } from './minigame-asset-paths.mjs'

const ROOT = repoRoot
const STAGING = join(ROOT, 'staging/companion-visual-pack')
const archiveCompanionChibis = (companionId) =>
  join(oldAssetsRoot, 'Compagnons', companionId, 'chibis-replaced')

function usage() {
  console.error('Usage: node scripts/regenerate-village-chibis.mjs [--raw <filename>] <companionId> [...]')
  process.exit(1)
}

const args = process.argv.slice(2)
if (args.length === 0) usage()

let rawFlag = false
let rawBasename = ''
const ids = []

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--raw') {
    rawFlag = true
    rawBasename = args[i + 1] ?? ''
    i += 1
    continue
  }
  ids.push(args[i])
}

if (ids.length === 0) usage()

async function promoteOne(companionId) {
  const rawName =
    rawFlag && rawBasename
      ? rawBasename
      : `companion-${companionId}-chibi-v2-raw.png`

  const rawCandidates = [
    join(STAGING, 'village', companionId, 'chibi', rawName),
    join(ROOT, 'assets', rawName),
    join(ROOT, rawName),
  ]

  const rawPath = rawCandidates.find((p) => existsSync(p))
  if (!rawPath) {
    console.error(`✗ Raw introuvable pour ${companionId}:`, rawCandidates.join(' | '))
    return false
  }

  const stagingV2 = join(STAGING, 'village', companionId, 'chibi', `companion-${companionId}-chibi-v2.png`)
  const prodPath = companionAssetPaths.chibi(companionId)
  mkdirSync(dirname(prodPath), { recursive: true })
  const archivePath = join(archiveCompanionChibis(companionId), 'chibi-v1-wrong-colors.png')

  mkdirSync(dirname(stagingV2), { recursive: true })
  mkdirSync(dirname(archivePath), { recursive: true })

  if (existsSync(prodPath)) {
    copyFileSync(prodPath, archivePath)
    console.log(`  archive → ${archivePath.replace(/\\/g, '/')}`)
  }

  copyFileSync(rawPath, join(dirname(stagingV2), rawName.replace(/-raw(?=\.png$)/, '-source')))
  await chromaKeyPng(rawPath, stagingV2)
  await chromaKeyPng(stagingV2, prodPath)

  console.log(`✓ ${companionId}: ${prodPath.replace(/\\/g, '/')}`)
  return true
}

console.log('Regénération chibis village → prod\n')

let ok = 0
for (const id of ids) {
  if (await promoteOne(id)) ok += 1
}

console.log(`\n${ok}/${ids.length} chibis promus. Archives: old_assets/Compagnons/{id}/chibis-replaced/`)

if (ok !== ids.length) process.exit(1)
