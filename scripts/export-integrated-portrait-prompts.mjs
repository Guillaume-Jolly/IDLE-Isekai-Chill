/**
 * Liste les jobs de génération portrait intégré (chemins + métadonnées).
 * Les prompts complets sont dans src/data/integratedPortraitPrompts.ts
 *
 * Usage:
 *   node scripts/export-integrated-portrait-prompts.mjs
 *   node scripts/export-integrated-portrait-prompts.mjs village
 *   node scripts/export-integrated-portrait-prompts.mjs disagrea
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

const VILLAGE_IDS = [
  'lyra', 'maeve', 'seren', 'nami', 'iris', 'kael', 'runa', 'solene', 'talia',
  'mira', 'asha', 'elwen', 'noa', 'sora', 'zelie',
]

const DISAGREA_IDS = ['etna', 'flonne', 'laharl', 'pleinair']

const LEVEL_SLUG = {
  1: 'rencontre',
  2: 'flirt-proche',
  3: 'vulnerable-complicite',
  4: 'intime-soft',
  5: 'peak-bond',
}

function job(pack, id, level) {
  const lv = String(level).padStart(2, '0')
  const slug = LEVEL_SLUG[level]
  const output =
    pack === 'disagrea'
      ? `assets/event-disagrea/integrated/companions/${id}/companion-${id}-affinity-${lv}-${slug}-scene-originale-v1.png`
      : `assets/integrated-portraits/village/${id}/companion-${id}-affinity-${lv}-${slug}-scene-originale-v1.png`

  return {
    pack,
    companionId: id,
    level,
    slug,
    output,
    promptFn:
      pack === 'disagrea'
        ? `disagreaIntegratedPortraitPrompt('${id}', ${level}, { soft: ${level >= 4} })`
        : `villageIntegratedPortraitPrompt('${id}', ${level}, { soft: ${level >= 4} })`,
    styleAnchor: 'public/assets/companions/talia/affinity-1.png',
    notes:
      id === 'pleinair' && pack === 'disagrea' && level >= 2
        ? 'BACKLOG: parental warmth only until redesign'
        : undefined,
  }
}

const filter = process.argv[2]
const jobs = []

if (!filter || filter === 'village') {
  for (const id of VILLAGE_IDS) {
    for (let level = 1; level <= 5; level += 1) jobs.push(job('village', id, level))
  }
}
if (!filter || filter === 'disagrea') {
  for (const id of DISAGREA_IDS) {
    for (let level = 1; level <= 5; level += 1) jobs.push(job('disagrea', id, level))
  }
}

const outDir = join(repoRoot, 'assets', 'integrated-portraits')
mkdirSync(outDir, { recursive: true })

const payload = {
  generatedAt: new Date().toISOString().slice(0, 10),
  promptModule: 'src/data/integratedPortraitPrompts.ts',
  styleAnchor: 'public/assets/companions/talia/affinity-1.png',
  scope: {
    disagrea: { total: 20, status: 'done except Etna L5 custom + Pleinair L2-5 backlog' },
    village: { total: 75, status: 'pending' },
  },
  count: jobs.length,
  jobs,
}

writeFileSync(join(outDir, 'GENERATION_JOBS.json'), JSON.stringify(payload, null, 2) + '\n', 'utf8')
console.log(`Exported ${jobs.length} jobs → assets/integrated-portraits/GENERATION_JOBS.json`)
