export type StatKey = 'charm' | 'wit' | 'vigor' | 'grace' | 'insight'

export type CompanionStats = Record<StatKey, number>

export type CompanionStatState = {
  stats: CompanionStats
  unspentStatPoints: number
}

export const STAT_KEYS: StatKey[] = ['charm', 'wit', 'vigor', 'grace', 'insight']

export const STAT_LABELS: Record<StatKey, string> = {
  charm: 'Charme',
  wit: 'Esprit',
  vigor: 'Vigueur',
  grace: 'Grace',
  insight: 'Intuition',
}

export const STAT_ROLES: Record<StatKey, string> = {
  charm: 'Conversations, affinite, renom',
  wit: 'Mini-jeux et tickets',
  vigor: 'Entrainement, production brute',
  grace: 'Cadeaux, soie, vivres',
  insight: 'Mana, cristaux, stardust',
}

/** Stats de base uniques par compagnon (total ~30). */
export const COMPANION_BASE_STATS: Record<string, CompanionStats> = {
  lyra: { charm: 5, wit: 7, vigor: 3, grace: 4, insight: 9 },
  maeve: { charm: 6, wit: 8, vigor: 5, grace: 5, insight: 4 },
  seren: { charm: 4, wit: 5, vigor: 9, grace: 4, insight: 5 },
  nami: { charm: 7, wit: 5, vigor: 6, grace: 8, insight: 4 },
  iris: { charm: 6, wit: 6, vigor: 4, grace: 7, insight: 7 },
  kael: { charm: 9, wit: 8, vigor: 4, grace: 6, insight: 3 },
  runa: { charm: 4, wit: 5, vigor: 8, grace: 5, insight: 6 },
  solene: { charm: 7, wit: 5, vigor: 4, grace: 6, insight: 9 },
  talia: { charm: 7, wit: 7, vigor: 8, grace: 4, insight: 4 },
  mira: { charm: 8, wit: 6, vigor: 4, grace: 9, insight: 5 },
  asha: { charm: 5, wit: 6, vigor: 8, grace: 5, insight: 6 },
  elwen: { charm: 4, wit: 9, vigor: 3, grace: 5, insight: 8 },
  noa: { charm: 6, wit: 9, vigor: 5, grace: 5, insight: 5 },
  sora: { charm: 8, wit: 5, vigor: 6, grace: 7, insight: 4 },
  zelie: { charm: 9, wit: 7, vigor: 4, grace: 8, insight: 5 },
}

export const STAT_SOFT_CAP = 60

export const createStarterStats = (companionId: string): CompanionStatState => ({
  stats: { ...(COMPANION_BASE_STATS[companionId] ?? defaultBaseStats()) },
  unspentStatPoints: 0,
})

const defaultBaseStats = (): CompanionStats => ({
  charm: 5,
  wit: 5,
  vigor: 5,
  grace: 5,
  insight: 5,
})

export const sumStats = (stats: CompanionStats) =>
  STAT_KEYS.reduce((total, key) => total + stats[key], 0)

export const mergeCompanionStats = (
  companionId: string,
  saved?: Partial<CompanionStatState>,
): CompanionStatState => {
  const starter = createStarterStats(companionId)
  if (!saved) return starter
  return {
    unspentStatPoints: saved.unspentStatPoints ?? 0,
    stats: {
      ...starter.stats,
      ...(saved.stats ?? {}),
    },
  }
}

/** Multiplicateur production idle lie au compagnon. */
export const statProductionMultiplier = (
  level: number,
  affinity: number,
  stats: CompanionStats,
) => {
  const total = sumStats(stats)
  return level * 2.5 * (1 + affinity * 0.08 + total * 0.004)
}

export const trainingCostMultiplier = (stats: CompanionStats) =>
  Math.max(0.72, 1 - stats.vigor * 0.007)

export const conversationRewardMultiplier = (stats: CompanionStats) =>
  1 + stats.charm * 0.012

export const minigameRewardMultiplier = (stats: CompanionStats) => 1 + stats.wit * 0.01

export const affinityCostMultiplier = (stats: CompanionStats) =>
  Math.max(0.78, 1 - stats.charm * 0.006)

export const canRaiseStat = (stats: CompanionStats, key: StatKey) =>
  stats[key] < STAT_SOFT_CAP

export const raiseStat = (state: CompanionStatState, key: StatKey): CompanionStatState | null => {
  if (state.unspentStatPoints <= 0 || !canRaiseStat(state.stats, key)) {
    return null
  }
  return {
    unspentStatPoints: state.unspentStatPoints - 1,
    stats: { ...state.stats, [key]: state.stats[key] + 1 },
  }
}

export const createEmptyStatTokens = (): Record<StatKey, number> =>
  Object.fromEntries(STAT_KEYS.map((key) => [key, 0])) as Record<StatKey, number>

export const mergeStatTokens = (
  saved?: Partial<Record<StatKey, number>>,
): Record<StatKey, number> => {
  const empty = createEmptyStatTokens()
  if (!saved) return empty
  return STAT_KEYS.reduce(
    (acc, key) => ({ ...acc, [key]: saved[key] ?? 0 }),
    empty,
  )
}

export const totalStatTokens = (tokens: Record<StatKey, number>) =>
  STAT_KEYS.reduce((sum, key) => sum + tokens[key], 0)

export const raiseStatDirect = (
  stats: CompanionStats,
  key: StatKey,
): CompanionStats | null => {
  if (!canRaiseStat(stats, key)) return null
  return { ...stats, [key]: stats[key] + 1 }
}

/** +1 point de stat a chaque niveau ; paliers d affinite en bonus. */
export const statPointsFromLevelUp = () => 1

export const statPointsFromAffinity = (newAffinity: number) => {
  if (newAffinity === 3 || newAffinity === 5) return 2
  if (newAffinity === 2 || newAffinity === 4) return 1
  return 0
}

export const primaryStatForCompanion = (companionId: string): StatKey => {
  const stats = COMPANION_BASE_STATS[companionId] ?? defaultBaseStats()
  return STAT_KEYS.reduce((best, key) => (stats[key] > stats[best] ? key : best), STAT_KEYS[0])
}
