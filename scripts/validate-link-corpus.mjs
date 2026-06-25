/**
 * Valide le corpus Lien v2 avant intégration.
 * Usage: node scripts/validate-link-corpus.mjs [--source path/to.json|.jsonl]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
import { pipelineReferencesRoot } from './minigame-asset-paths.mjs'

const importDir = join(pipelineReferencesRoot, 'link-corpus')

const VALID_COMPANION_IDS = new Set([
  'lyra', 'maeve', 'seren', 'nami', 'iris', 'kael', 'runa', 'solene',
  'talia', 'mira', 'asha', 'elwen', 'noa', 'sora', 'zelie',
])

const VALID_TONES = new Set(['sincere', 'playful', 'direct', 'romantic'])
const PLACEHOLDER_RE = /\b(TODO|lorem|undefined|null|FIXME|placeholder)\b/i
const SKIP_JSON = new Set(['manifest.json'])

const DEFAULT_PATHS = [
  join(root, 'src/data/linkCorpusV2.json'),
  join(importDir, 'companion_link_conversations.v2.clean.jsonl'),
  join(importDir, 'wonderland_companion_link_corpus_v2_clean_compact.json'),
]

const ZIP_PATH = join(importDir, 'wonderland_companion_link_corpus_v2_clean_compact.zip')

function parseArgs() {
  const args = process.argv.slice(2)
  const sourceIndex = args.indexOf('--source')
  if (sourceIndex >= 0 && args[sourceIndex + 1]) {
    return resolve(args[sourceIndex + 1])
  }
  return null
}

function resolveSourcePath(explicit) {
  if (explicit && existsSync(explicit)) return explicit
  for (const path of DEFAULT_PATHS) {
    if (existsSync(path)) return path
  }
  if (existsSync(importDir)) {
    const jsonl = readdirSync(importDir).find((name) => name.endsWith('.jsonl'))
    if (jsonl) return join(importDir, jsonl)
    const json = readdirSync(importDir).find((name) => name.endsWith('.json') && !SKIP_JSON.has(name))
    if (json) return join(importDir, json)
  }
  return null
}

function isV2RawEntry(entry) {
  return entry.affinity !== undefined && !entry.roundToneHints
}

async function loadJsonl(path) {
  const entries = []
  const rl = createInterface({ input: createReadStream(path, 'utf8'), crlfDelay: Infinity })
  let lineNo = 0
  for await (const line of rl) {
    lineNo += 1
    const trimmed = line.trim()
    if (!trimmed) continue
    try {
      entries.push(JSON.parse(trimmed))
    } catch {
      throw new Error(`JSONL ligne ${lineNo}: parse error`)
    }
  }
  return entries
}

function loadCorpus(path) {
  if (path.endsWith('.jsonl')) {
    throw new Error('JSONL: utiliser loadJsonl async')
  }
  const raw = readFileSync(path, 'utf8')
  const data = JSON.parse(raw)
  if (Array.isArray(data)) return data
  if (Array.isArray(data.scenarios)) return data.scenarios
  if (Array.isArray(data.conversations)) return data.conversations
  if (data.packs && typeof data.packs === 'object') {
    return Object.entries(data.packs).flatMap(([companionId, scenarios]) =>
      scenarios.map((scenario) => ({ ...scenario, companionId })),
    )
  }
  throw new Error('Format JSON non reconnu (attendu: array, { scenarios }, { conversations } ou { packs })')
}

function validateScriptedRound(round, rp, errors) {
  if (!Array.isArray(round.context) || round.context.length === 0) {
    errors.push(`${rp}: context vide ou absent`)
  } else {
    round.context.forEach((line, li) => {
      if (!line?.trim()) errors.push(`${rp}.context[${li}]: texte vide`)
      if (PLACEHOLDER_RE.test(line)) errors.push(`${rp}.context[${li}]: placeholder détecté`)
    })
  }
  if (!round.prompt?.trim()) {
    errors.push(`${rp}: prompt vide`)
  } else if (PLACEHOLDER_RE.test(round.prompt)) {
    errors.push(`${rp}: placeholder dans prompt`)
  }
  if (!Array.isArray(round.choices) || round.choices.length !== 4) {
    errors.push(`${rp}: choices doit contenir exactement 4 éléments`)
    return
  }
  round.choices.forEach((choice, ci) => {
    const cp = `${rp}.choices[${ci}]`
    if (!choice.text?.trim()) errors.push(`${cp}: text vide`)
    if (!choice.reaction?.trim()) errors.push(`${cp}: reaction vide`)
    if (!VALID_TONES.has(choice.tone)) errors.push(`${cp}: tone invalide "${choice.tone}"`)
    if (choice.text && choice.text.length > 420) {
      errors.push(`${cp}: text trop long (${choice.text.length} chars)`)
    }
  })
}

function validateV2Round(round, rp, errors) {
  const hasContext =
    round.narrator?.trim() || round.companionLine?.trim()
  if (!hasContext) errors.push(`${rp}: narrator/companionLine absent`)
  if (!round.prompt?.trim()) {
    errors.push(`${rp}: prompt vide`)
  } else if (PLACEHOLDER_RE.test(round.prompt)) {
    errors.push(`${rp}: placeholder dans prompt`)
  }
  if (!Array.isArray(round.choices) || round.choices.length !== 4) {
    errors.push(`${rp}: choices doit contenir exactement 4 éléments`)
    return
  }
  let scoreOnes = 0
  round.choices.forEach((choice, ci) => {
    const cp = `${rp}.choices[${ci}]`
    if (!choice.text?.trim()) errors.push(`${cp}: text vide`)
    if (!choice.reaction?.trim()) errors.push(`${cp}: reaction vide`)
    if (!VALID_TONES.has(choice.tone)) errors.push(`${cp}: tone invalide "${choice.tone}"`)
    if (choice.score !== 0 && choice.score !== 1) errors.push(`${cp}: score invalide (${choice.score})`)
    if (choice.score === 1) scoreOnes += 1
    if (choice.text && choice.text.length > 420) {
      errors.push(`${cp}: text trop long (${choice.text.length} chars)`)
    }
  })
  if (scoreOnes !== 1) errors.push(`${rp}: exactement 1 choix avec score=1 attendu (${scoreOnes} trouvé)`)
}

function validateScenario(entry, errors, stats, index) {
  const prefix = `entry[${index}]`
  const companionId = entry.companionId ?? entry.companion ?? entry.companion_id
  if (!companionId || typeof companionId !== 'string') {
    errors.push(`${prefix}: companionId manquant`)
    return
  }
  if (!VALID_COMPANION_IDS.has(companionId)) {
    errors.push(`${prefix}: companionId inconnu "${companionId}"`)
  } else {
    stats.companions.add(companionId)
  }

  const id = entry.id ?? entry.scenarioId
  if (!id || typeof id !== 'string') {
    errors.push(`${prefix}: id manquant`)
  } else if (stats.ids.has(id)) {
    errors.push(`${prefix}: id dupliqué "${id}"`)
  } else {
    stats.ids.add(id)
  }

  const rounds = entry.rounds
  if (!Array.isArray(rounds) || rounds.length !== 3) {
    errors.push(`${prefix}: rounds doit être un tableau de 3 éléments`)
    return
  }

  stats.conversations += 1

  if (isV2RawEntry(entry)) {
    const affinity = entry.affinity
    if (typeof affinity !== 'number' || affinity < 1 || affinity > 5) {
      errors.push(`${prefix}: affinity invalide (${affinity})`)
    } else {
      stats.affinityBuckets.add(`${companionId}:${affinity}`)
    }
    if (!entry.title?.trim()) errors.push(`${prefix}: title vide`)
    rounds.forEach((round, roundIndex) => validateV2Round(round, `${prefix}.rounds[${roundIndex}]`, errors))
    return
  }

  const minA = entry.minAffinity ?? entry.affinityMin ?? entry.affinity_min
  const maxA = entry.maxAffinity ?? entry.affinityMax ?? entry.affinity_max
  for (const [label, value] of [
    ['minAffinity', minA],
    ['maxAffinity', maxA],
  ]) {
    if (typeof value !== 'number' || value < 1 || value > 5) {
      errors.push(`${prefix}: ${label} invalide (${value})`)
    }
  }
  if (typeof minA === 'number' && typeof maxA === 'number') {
    stats.affinityBuckets.add(`${companionId}:${minA}-${maxA}`)
  }

  rounds.forEach((round, roundIndex) =>
    validateScriptedRound(round, `${prefix}.rounds[${roundIndex}]`, errors),
  )
}

async function main() {
  const explicit = parseArgs()
  const sourcePath = resolveSourcePath(explicit)

  if (!sourcePath) {
    if (existsSync(ZIP_PATH)) {
      console.error(`ZIP trouvé: ${ZIP_PATH}`)
      console.error('Extraction/conversion requise. Lance: npm run import:link-corpus-v2')
      process.exit(2)
    }
    console.error('Corpus Lien v2 introuvable.')
    console.error('Déposer le zip/JSONL dans scripts/references/link-corpus/ ou passer --source chemin')
    process.exit(2)
  }

  let entries
  try {
    entries = sourcePath.endsWith('.jsonl')
      ? await loadJsonl(sourcePath)
      : loadCorpus(sourcePath)
  } catch (error) {
    console.error(`Erreur lecture ${sourcePath}:`, error.message)
    process.exit(1)
  }

  const errors = []
  const stats = {
    ids: new Set(),
    companions: new Set(),
    conversations: 0,
    affinityBuckets: new Set(),
  }

  entries.forEach((entry, index) => validateScenario(entry, errors, stats, index))

  console.log(`Source: ${sourcePath}`)
  console.log(`Conversations: ${stats.conversations}`)
  console.log(`Compagnons: ${stats.companions.size}`)
  console.log(`IDs uniques: ${stats.ids.size}`)

  if (errors.length > 0) {
    console.error(`\n${errors.length} erreur(s):`)
    errors.slice(0, 40).forEach((line) => console.error(`  - ${line}`))
    if (errors.length > 40) console.error(`  ... +${errors.length - 40} autres`)
    process.exit(1)
  }

  console.log('Validation OK.')
}

main()
