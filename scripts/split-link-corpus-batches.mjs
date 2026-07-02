#!/usr/bin/env node
/**
 * Découpe linkCorpusV2.json en lots de 50 servis sous public/data/link-corpus/.
 * Source de vérité validation : src/data/linkCorpusV2.json (conservé).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BATCH_SIZE = 50
const sourcePath = join(root, 'src/data/linkCorpusV2.json')
const outRoot = join(root, 'public/data/link-corpus')

const corpus = JSON.parse(readFileSync(sourcePath, 'utf8'))
const byCompanion = {}

for (const scenario of corpus.scenarios) {
  if (!byCompanion[scenario.companionId]) byCompanion[scenario.companionId] = []
  byCompanion[scenario.companionId].push(scenario)
}

const manifest = {
  version: corpus.version ?? 2,
  batchSize: BATCH_SIZE,
  scenarioCount: corpus.scenarios.length,
  rejectedCount: corpus.rejected?.length ?? 0,
  companions: {},
}

mkdirSync(outRoot, { recursive: true })

for (const [companionId, scenarios] of Object.entries(byCompanion)) {
  const companionDir = join(outRoot, companionId)
  mkdirSync(companionDir, { recursive: true })
  const batches = Math.ceil(scenarios.length / BATCH_SIZE)
  manifest.companions[companionId] = { count: scenarios.length, batches }

  for (let batchIndex = 0; batchIndex < batches; batchIndex += 1) {
    const slice = scenarios.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE)
    const fileName = `batch-${String(batchIndex).padStart(2, '0')}.json`
    writeFileSync(
      join(companionDir, fileName),
      JSON.stringify({ companionId, batchIndex, batchSize: BATCH_SIZE, scenarios: slice }),
    )
  }
}

writeFileSync(join(outRoot, 'manifest.json'), JSON.stringify(manifest, null, 2))

const manifestTs = `/** Généré par scripts/split-link-corpus-batches.mjs — ne pas éditer à la main */
export const LINK_CORPUS_BATCH_SIZE = ${BATCH_SIZE} as const

export const LINK_CORPUS_MANIFEST = ${JSON.stringify(manifest, null, 2)} as const
`

writeFileSync(join(root, 'src/data/conversations/linkCorpusManifest.ts'), manifestTs)

console.log(
  `[corpus:split-batches] ${corpus.scenarios.length} scénarios → ${Object.keys(byCompanion).length} compagnons, lots de ${BATCH_SIZE}`,
)
