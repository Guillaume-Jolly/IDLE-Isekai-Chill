/**
 * Génère src/data/companionBondCatalog.generated.ts depuis companion-bond-seeds.mjs
 * Usage: node scripts/generate-companion-bond-catalog.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { COMPANION_BOND_IDS, COMPANION_BOND_SEEDS } from './companion-bond-seeds.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'src/data/companionBondCatalog.generated.ts')

const AFFINITY_TIER_LABELS = {
  1: 'Découverte',
  2: 'Confiance',
  3: 'Complicité',
  4: 'Confidence',
  5: 'Lien profond',
}

/** @type {import('../src/data/companionBondConversations.ts').CompanionBondConversation[]} */
const catalog = []

for (const companionId of COMPANION_BOND_IDS) {
  const seed = COMPANION_BOND_SEEDS[companionId]
  if (!seed) {
    throw new Error(`Seed manquant: ${companionId}`)
  }

  for (const tier of [1, 2, 3, 4, 5]) {
    const exchanges = seed.tiers[tier]
    if (!exchanges?.length) {
      throw new Error(`${companionId}: palier ${tier} vide`)
    }

    exchanges.forEach((exchange, index) => {
      const slot = String(index + 1).padStart(2, '0')
      catalog.push({
        companionId,
        affinityTier: tier,
        conversationId: `${companionId}_t${tier}_c${slot}`,
        prompt: exchange.prompt,
        companionReply: exchange.reply,
        tone: exchange.tone,
        relatedSystems: seed.relatedSystems,
        tags: exchange.tags,
        intimacyLevel: exchange.intimacyLevel,
        repeatable: tier <= 2,
        unlockHint:
          tier > 1
            ? `Atteins l'affinité ${tier} (${AFFINITY_TIER_LABELS[tier]}) avec ${seed.displayName}.`
            : undefined,
      })
    })
  }
}

const header = `/**
 * AUTO-GÉNÉRÉ — ne pas éditer à la main.
 * Source: scripts/companion-bond-seeds.mjs
 * Commande: node scripts/generate-companion-bond-catalog.mjs
 */
import type { CompanionBondConversation } from './companionBondConversations'

export const COMPANION_BOND_CATALOG: CompanionBondConversation[] = `

const body = JSON.stringify(catalog, null, 2)
  .replace(/"affinityTier": (\d)/g, '"affinityTier": $1 as 1 | 2 | 3 | 4 | 5')
  .replace(/"intimacyLevel": (\d)/g, '"intimacyLevel": $1 as 1 | 2 | 3 | 4 | 5')

writeFileSync(outPath, `${header}${body}\n`, 'utf8')
console.log(`Catalogue bond: ${catalog.length} conversations → ${outPath}`)
