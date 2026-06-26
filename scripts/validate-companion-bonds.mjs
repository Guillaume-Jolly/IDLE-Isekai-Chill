/**
 * Validation anti-incohérence — conversations de liens compagnons (MVP 17).
 * Usage: node scripts/validate-companion-bonds.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPANION_BOND_IDS } from './companion-bond-seeds.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = join(root, 'src/data/companionBondCatalog.generated.ts')

const VALID_SYSTEMS = new Set([
  'moon-farm',
  'refuge',
  'hunt',
  'village',
  'gacha',
  'inventory',
  'prestige',
])

const VALID_TONES = new Set(['sincere', 'playful', 'direct', 'romantic'])
const VALID_TIERS = new Set([1, 2, 3, 4, 5])
const BANNED_TERMS = [
  /\bsexe\b/i,
  /\bnu\b/i,
  /\bnue\b/i,
  /\bsexy\b/i,
  /\bporno\b/i,
  /\bmer\b/i,
  /\bplage\b/i,
  /\bsoleil\b/i,
  /\bpluie\b/i,
  /\btremp[eé]\b/i,
]

const EXPECTED_COMPANIONS = COMPANION_BOND_IDS.length
const EXPECTED_CONVERSATIONS_MIN = EXPECTED_COMPANIONS * 5
const EXPECTED_CONVERSATIONS_TARGET = EXPECTED_COMPANIONS * 5 * 2

function loadCatalog() {
  const raw = readFileSync(catalogPath, 'utf8')
  const marker = '= ['
  const jsonStart = raw.indexOf(marker)
  if (jsonStart < 0) {
    throw new Error('Tableau catalogue introuvable')
  }
  const arrayStart = jsonStart + marker.length - 1
  const jsonEnd = raw.lastIndexOf(']')
  if (jsonEnd < 0) {
    throw new Error('Catalogue généré introuvable ou mal formé')
  }
  const json = raw
    .slice(arrayStart, jsonEnd + 1)
    .replace(/ as 1 \| 2 \| 3 \| 4 \| 5/g, '')
  return JSON.parse(json)
}

function fail(errors) {
  console.error('\n❌ Validation bond conversations échouée:\n')
  for (const error of errors) {
    console.error(`  • ${error}`)
  }
  process.exit(1)
}

const errors = []
const catalog = loadCatalog()
const companionIds = new Set(COMPANION_BOND_IDS)
const tiersByCompanion = new Map()

for (const entry of catalog) {
  const id = entry.conversationId ?? '?'

  if (!companionIds.has(entry.companionId)) {
    errors.push(`${id}: companionId inconnu "${entry.companionId}"`)
  }

  if (!VALID_TIERS.has(entry.affinityTier)) {
    errors.push(`${id}: affinityTier invalide ${entry.affinityTier}`)
  }

  if (!VALID_TONES.has(entry.tone)) {
    errors.push(`${id}: tone invalide "${entry.tone}"`)
  }

  for (const field of ['prompt', 'companionReply', 'conversationId']) {
    if (!entry[field]?.trim()) {
      errors.push(`${id}: champ vide "${field}"`)
    }
  }

  if (!Array.isArray(entry.tags) || entry.tags.length === 0) {
    errors.push(`${id}: tags manquants`)
  }

  if (entry.intimacyLevel !== entry.affinityTier) {
    errors.push(`${id}: intimacyLevel (${entry.intimacyLevel}) ≠ affinityTier (${entry.affinityTier})`)
  }

  if (entry.relatedSystems) {
    for (const system of entry.relatedSystems) {
      if (!VALID_SYSTEMS.has(system)) {
        errors.push(`${id}: relatedSystem inconnu "${system}"`)
      }
    }
  }

  const text = `${entry.prompt} ${entry.companionReply}`
  for (const pattern of BANNED_TERMS) {
    if (pattern.test(text)) {
      errors.push(`${id}: terme banni détecté (${pattern})`)
    }
  }

  const tiers = tiersByCompanion.get(entry.companionId) ?? new Set()
  tiers.add(entry.affinityTier)
  tiersByCompanion.set(entry.companionId, tiers)
}

for (const companionId of COMPANION_BOND_IDS) {
  const tiers = tiersByCompanion.get(companionId)
  if (!tiers) {
    errors.push(`${companionId}: aucune conversation`)
    continue
  }
  for (const tier of [1, 2, 3, 4, 5]) {
    if (!tiers.has(tier)) {
      errors.push(`${companionId}: palier ${tier} manquant`)
    }
  }
}

if (catalog.length < EXPECTED_CONVERSATIONS_MIN) {
  errors.push(`volume insuffisant: ${catalog.length} < minimum ${EXPECTED_CONVERSATIONS_MIN}`)
}

if (tiersByCompanion.size !== EXPECTED_COMPANIONS) {
  errors.push(`compagnons couverts: ${tiersByCompanion.size}/${EXPECTED_COMPANIONS}`)
}

const ids = new Set(catalog.map((e) => e.conversationId))
if (ids.size !== catalog.length) {
  errors.push('conversationId dupliqués détectés')
}

if (errors.length) fail(errors)

console.log('✅ Validation bond conversations OK')
console.log(`   Compagnons: ${tiersByCompanion.size}`)
console.log(`   Conversations: ${catalog.length} (cible ${EXPECTED_CONVERSATIONS_TARGET})`)
console.log(`   Paliers: 1–5 par compagnon`)
