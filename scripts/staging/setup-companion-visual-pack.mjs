#!/usr/bin/env node
/**
 * Initialise staging/companion-visual-pack :
 * - arborescence dossiers
 * - copie backgrounds Disagrea depuis assets/
 * - génère GENERATION_QUEUE.json + met à jour PROGRESS.json
 */
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DISAGREA_COMPANIONS,
  VILLAGE_COMPANIONS,
  cutoutPrompt,
} from './companion-visual-pack-data.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../..')
const STAGING = join(ROOT, 'staging/companion-visual-pack')
const EMOTIONS = JSON.parse(readFileSync(join(STAGING, 'data/emotions.json'), 'utf8')).emotions

const DISAGREA_IDS = Object.keys(DISAGREA_COMPANIONS)
const VILLAGE_IDS = Object.keys(VILLAGE_COMPANIONS)

function ensureDir(p) {
  mkdirSync(p, { recursive: true })
}

function copyBackgrounds() {
  const srcRoot = join(ROOT, 'assets/event-disagrea/backgrounds')
  if (!existsSync(srcRoot)) {
    console.warn('⚠ backgrounds source missing:', srcRoot)
    return 0
  }

  let n = 0
  for (const id of DISAGREA_IDS) {
    const name = id.charAt(0).toUpperCase() + id.slice(1)
    const srcDir = join(srcRoot, 'affinity', name)
    const destDir = join(STAGING, 'disagrea', id, 'backgrounds')
    ensureDir(destDir)
    if (!existsSync(srcDir)) continue
    for (const f of readdirSync(srcDir)) {
      if (!f.endsWith('.png')) continue
      cpSync(join(srcDir, f), join(destDir, f), { force: true })
      n++
    }
  }

  const minigameSrc = join(srcRoot, 'minigame')
  const minigameDest = join(STAGING, 'disagrea/_shared/minigame')
  ensureDir(minigameDest)
  if (existsSync(minigameSrc)) {
    for (const f of readdirSync(minigameSrc)) {
      if (f.endsWith('.png')) {
        cpSync(join(minigameSrc, f), join(minigameDest, f), { force: true })
        n++
      }
    }
  }

  cpSync(join(srcRoot, 'manifest.json'), join(STAGING, 'data/disagrea/backgrounds-manifest.json'), {
    force: true,
  })

  return n
}

function buildQueue() {
  const jobs = []

  for (const companionId of DISAGREA_IDS) {
    for (const em of EMOTIONS) {
      const output = `staging/companion-visual-pack/disagrea/${companionId}/cutouts/companion-${companionId}-emotion-${em.id}-cutout-v3.png`
      jobs.push({
        phase: 'disagrea-cutout-v3',
        companionId,
        emotion: em.id,
        output,
        prompt: cutoutPrompt(companionId, em.prompt),
        styleAnchor: `public/assets/companions/${companionId}/affinity-1.png`,
        status: existsSync(join(ROOT, output)) ? 'done' : 'pending',
      })
    }
    const l6 = `staging/companion-visual-pack/disagrea/${companionId}/integrated/companion-${companionId}-affinity-06-peak-plus-scene-v1.png`
    jobs.push({
      phase: 'disagrea-l6',
      companionId,
      output: l6,
      status: existsSync(join(ROOT, l6)) ? 'done' : 'pending',
    })
  }

  for (const companionId of VILLAGE_IDS) {
    for (const em of EMOTIONS) {
      const output = `staging/companion-visual-pack/village/${companionId}/cutouts/companion-${companionId}-emotion-${em.id}-cutout-v3.png`
      jobs.push({
        phase: 'village-cutout-v3',
        companionId,
        emotion: em.id,
        output,
        prompt: cutoutPrompt(companionId, em.prompt),
        styleAnchor: `public/assets/companions/${companionId}/affinity-1.png`,
        status: existsSync(join(ROOT, output)) ? 'done' : 'pending',
      })
    }
  }

  writeFileSync(
    join(STAGING, 'data/GENERATION_QUEUE.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), total: jobs.length, jobs }, null, 2),
  )

  const done = jobs.filter((j) => j.status === 'done').length
  writeFileSync(
    join(STAGING, 'data/PROGRESS.json'),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        version: 'v3-per-companion-anchor',
        styleAnchor: 'public/assets/companions/{id}/affinity-1.png (NOT global Etna lock)',
        total: jobs.length,
        done,
        pending: jobs.length - done,
        percent: Math.round((done / jobs.length) * 100),
        note: 'Etna L5 tests (etna/tests/) — à regénérer séparément',
      },
      null,
      2,
    ),
  )

  return jobs.length
}

function main() {
  ensureDir(STAGING)
  ensureDir(join(STAGING, 'data/disagrea'))
  for (const id of DISAGREA_IDS) {
    ensureDir(join(STAGING, 'disagrea', id, 'cutouts'))
    ensureDir(join(STAGING, 'disagrea', id, 'integrated'))
    ensureDir(join(STAGING, 'disagrea', id, 'backgrounds'))
  }
  for (const id of VILLAGE_IDS) {
    ensureDir(join(STAGING, 'village', id, 'cutouts'))
  }

  const bgCount = copyBackgrounds()
  const total = buildQueue()
  console.log(`✓ Staging ready at ${relative(ROOT, STAGING)}`)
  console.log(`✓ ${bgCount} backgrounds copied`)
  console.log(`✓ ${total} jobs in data/GENERATION_QUEUE.json`)
}

main()
