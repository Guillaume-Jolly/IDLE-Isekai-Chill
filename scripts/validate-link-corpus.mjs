/**
 * Valide le corpus Lien v2 avant intégration.
 * Usage: node scripts/validate-link-corpus.mjs [--source path/to.json]
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const VALID_COMPANION_IDS = new Set([
  'lyra', 'maeve', 'seren', 'nami', 'iris', 'kael', 'runa', 'solene',
  'talia', 'mira', 'asha', 'elwen', 'noa', 'sora', 'zelie',
])

const VALID_TONES = new Set(['sincere', 'playful', 'direct', 'romantic'])
const PLACEHOLDER_RE = /\b(TODO|lorem|undefined|null|FIXME|placeholder)\b/i

const DEFAULT_PATHS = [
  join(root, 'src/data/linkCorpusV2.json'),
  join(root, 'assets/link-corpus-import/linkCorpusV2.json'),
  join(root, 'assets/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.json'),
]

const ZIP_PATH = join(
  root,
  'assets/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.zip',
)

function parseArgs() {
  const args = process.argv.slice(2)
  const sourceIndex = args.indexOf('--source')
  if (sourceIndex >= 0 && args[sourceIndex + 1]) {
    return resolve(args[sourceIndex + 1])
  }
  return null
}

function resolveJsonPath(explicit) {
  if (explicit && existsSync(explicit)) return explicit
  for (const path of DEFAULT_PATHS) {
    if (existsSync(path)) return path
  }
  const importDir = join(root, 'assets/link-corpus-import')
  if (existsSync(importDir)) {
    const json = readdirSync(importDir).find((name) => name.endsWith('.json'))
    if (json) return join(importDir, json)
  }
  return null
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

  const rounds = entry.rounds
  if (!Array.isArray(rounds) || rounds.length !== 3) {
    errors.push(`${prefix}: rounds doit être un tableau de 3 éléments`)
    return
  }

  stats.conversations += 1
  if (typeof minA === 'number') stats.affinityBuckets.add(`${companionId}:${minA}-${maxA}`)

  rounds.forEach((round, roundIndex) => {
    const rp = `${prefix}.rounds[${roundIndex}]`
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
  })
}

function loadCorpus(path) {
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

function main() {
  const explicit = parseArgs()
  const jsonPath = resolveJsonPath(explicit)

  if (!jsonPath) {
    if (existsSync(ZIP_PATH)) {
      console.error(`ZIP trouvé: ${ZIP_PATH}`)
      console.error('Extraction/conversion requise. Lance: node scripts/import-link-corpus-v2.mjs')
      process.exit(2)
    }
    console.error('Corpus Lien v2 introuvable.')
    console.error('Déposer le zip dans assets/link-corpus-import/ ou passer --source chemin/vers.json')
    process.exit(2)
  }

  let entries
  try {
    entries = loadCorpus(jsonPath)
  } catch (error) {
    console.error(`Erreur lecture ${jsonPath}:`, error.message)
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

  console.log(`Source: ${jsonPath}`)
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
