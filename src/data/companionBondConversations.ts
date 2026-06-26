/**
 * Conversations de liens compagnons — MVP 17.
 * Catalogue data-driven par palier d'affinité (1–5).
 */
import type { CompanionSupportSystemId } from './companionSupport'
import { COMPANION_SUPPORT_PROFILES } from './companionSupport'
import { COMPANION_BOND_CATALOG } from './companionBondCatalog.generated'

export type BondAffinityTier = 1 | 2 | 3 | 4 | 5

export type BondTone = 'sincere' | 'playful' | 'direct' | 'romantic'

export type CompanionBondConversation = {
  companionId: string
  affinityTier: BondAffinityTier
  conversationId: string
  prompt: string
  companionReply: string
  tone: BondTone
  relatedSystems?: CompanionSupportSystemId[]
  tags: string[]
  intimacyLevel: BondAffinityTier
  repeatable: boolean
  unlockHint?: string
  qualityFlags?: string[]
}

export const AFFINITY_TIER_LABELS: Record<BondAffinityTier, string> = {
  1: 'Découverte',
  2: 'Confiance',
  3: 'Complicité',
  4: 'Confidence',
  5: 'Lien profond',
}

export const BOND_TONE_LABELS: Record<BondTone, string> = {
  sincere: 'Sincère',
  playful: 'Enjoué',
  direct: 'Direct',
  romantic: 'Tendre',
}

export const COMPANION_BOND_CONVERSATIONS: CompanionBondConversation[] = COMPANION_BOND_CATALOG

export const COMPANION_BOND_COMPANION_IDS = [
  ...new Set(COMPANION_BOND_CONVERSATIONS.map((entry) => entry.companionId)),
].sort()

export function getBondConversationsForCompanion(companionId: string): CompanionBondConversation[] {
  return COMPANION_BOND_CONVERSATIONS.filter((entry) => entry.companionId === companionId)
}

export function getBondConversationsForTier(
  companionId: string,
  tier: BondAffinityTier,
): CompanionBondConversation[] {
  return COMPANION_BOND_CONVERSATIONS.filter(
    (entry) => entry.companionId === companionId && entry.affinityTier === tier,
  )
}

export function isBondConversationUnlocked(
  conversation: CompanionBondConversation,
  currentAffinity: number,
): boolean {
  return currentAffinity >= conversation.affinityTier
}

export function getBondCatalogStats() {
  const byCompanion = new Map<string, Set<number>>()
  for (const entry of COMPANION_BOND_CONVERSATIONS) {
    const tiers = byCompanion.get(entry.companionId) ?? new Set()
    tiers.add(entry.affinityTier)
    byCompanion.set(entry.companionId, tiers)
  }
  return {
    companionCount: byCompanion.size,
    conversationCount: COMPANION_BOND_CONVERSATIONS.length,
    tiersPerCompanion: [...byCompanion.values()].map((tiers) => tiers.size),
  }
}

export function getCompanionBondDisplayName(companionId: string): string {
  return COMPANION_SUPPORT_PROFILES[companionId]?.displayName ?? companionId
}
