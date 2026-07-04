import type { BuildHavreCardInput, HavreGameModeDef, SavedHavreIsekaiCard } from './types'

const RARITY_RANK: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythic: 5,
  cursed: 2,
  mist_touched: 4,
  anomaly: 5,
  havre_destiny: 6,
  illegal: 6,
  cosmic_bug: 6,
}

function dominantRarity(rarities: string[]): string {
  if (rarities.length === 0) return 'common'
  return rarities.reduce((best, rarity) =>
    (RARITY_RANK[rarity] ?? 0) > (RARITY_RANK[best] ?? 0) ? rarity : best,
  )
}

export function buildSavedHavreCard(
  input: BuildHavreCardInput,
  modeDef: HavreGameModeDef,
): SavedHavreIsekaiCard {
  const now = Date.now()
  const highlights = input.runState.comments.slice(-5).map((line) => line.text)
  const stats: Record<string, number | string> = { ...input.runState.stats }
  const scores = { ...(input.runState.runScores ?? {}) }

  return {
    id: `havre-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
    autoName: input.sheet.identity.name,
    displayName: input.sheet.identity.name,
    runSeed: input.session.rngSeed,
    miniGameId: 'destiny-wheel',
    version: input.seedVersion,
    mode: input.session.mode,
    rarity: dominantRarity(input.runState.rarityHistory),
    verdict: input.verdict.label,
    title: input.sheet.identity.title,
    generatedCharacter: input.sheet,
    stats,
    scores,
    combos: input.runState.combos,
    statRoasts: input.runState.statRoasts,
    commentatorHighlights: highlights,
    reward: input.reward,
    playerMeta: {
      favorite: false,
      locked: false,
      badge: modeDef.card_badge,
      rerollCount: input.runState.rerollCount ?? 0,
      jokersUsed: [...input.session.jokersUsed],
    },
    runMeta: {
      completedWheels: [...input.runState.completedWheels],
      selectedItems: { ...input.runState.selectedItems },
      selectedItemLabels: { ...input.runState.selectedItemLabels },
      spinHistoryCount: input.spinHistoryCount,
    },
  }
}
