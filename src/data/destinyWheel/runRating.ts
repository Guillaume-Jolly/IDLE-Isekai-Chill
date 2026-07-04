import type { CharacterSheet, RunState } from './types'

export type RunRating = {
  score: number
  maxScore: number
  stars: number
  label: string
}

/** Score récompense (runs) — conservé pour les gains, pas l’UI fiche. */
export function getRunScoreMax(totalWheels: number): number {
  return Math.max(10, totalWheels * 2 + 20)
}

const DISPLAY_MAX = 100

const RATING_LABELS: Array<{ minScore: number; label: string }> = [
  { minScore: 92, label: 'Illégale' },
  { minScore: 82, label: 'Post-game' },
  { minScore: 72, label: 'Monstrueuse' },
  { minScore: 58, label: 'Excellente' },
  { minScore: 46, label: 'Bonne' },
  { minScore: 34, label: 'Correcte' },
  { minScore: 22, label: 'Faible' },
  { minScore: 12, label: 'Pathétique' },
  { minScore: 0, label: 'Catastrophique' },
]

const STAT_TIER_SCORE: Record<string, number> = {
  catastrophique: 4,
  pathetic: 4,
  pathétique: 4,
  faible: 18,
  weak: 18,
  correcte: 38,
  correct: 38,
  average: 38,
  moyenne: 38,
  bonne: 52,
  good: 52,
  skilled: 52,
  excellente: 66,
  excellent: 66,
  monstrueuse: 78,
  monstrous: 78,
  distinguished: 72,
  distingué: 72,
  genius: 80,
  génie: 80,
  'post-game': 88,
  illegal: 95,
  illégale: 95,
  légendaire: 85,
  legendary: 85,
}

const RARITY_SCORE: Record<string, number> = {
  common: 20,
  uncommon: 32,
  rare: 48,
  epic: 58,
  legendary: 68,
  mythic: 78,
  cursed: 28,
  illegal: 88,
  cosmic_bug: 92,
  mist_touched: 55,
  anomaly: 72,
  havre_destiny: 82,
}

function normalizeToken(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

function statTierScore(label: string): number {
  const key = normalizeToken(label)
  if (STAT_TIER_SCORE[key] != null) return STAT_TIER_SCORE[key]
  for (const [token, score] of Object.entries(STAT_TIER_SCORE)) {
    if (key.includes(token)) return score
  }
  return 34
}

function averageStatScore(sheet: CharacterSheet): number {
  const values = Object.values(sheet.stats.core)
  if (values.length === 0) return 34
  const sum = values.reduce((acc, label) => acc + statTierScore(label), 0)
  return sum / values.length
}

function averageRarityScore(runState: RunState): number {
  if (runState.rarityHistory.length === 0) return 30
  const sum = runState.rarityHistory.reduce(
    (acc, rarity) => acc + (RARITY_SCORE[rarity] ?? 24),
    0,
  )
  return sum / runState.rarityHistory.length
}

function comboScore(runState: RunState): number {
  const count = runState.combos.length
  if (count === 0) return 18
  return Math.min(72, 24 + count * 11)
}

function verdictModifier(runState: RunState): number {
  const priority = runState.finalVerdict?.priority ?? 1
  return Math.min(12, Math.max(-8, (priority - 40) / 6))
}

/**
 * Note affichée fiche finale (0–100) — volontairement sévère :
 * chance de victoire + qualité des stats pèsent plus que la rareté brute.
 */
export function computeSheetDisplayRating(sheet: CharacterSheet, runState: RunState): RunRating {
  const winComponent = sheet.finale.winChance * 0.52
  const statComponent = averageStatScore(sheet) * 0.34
  const rarityComponent = averageRarityScore(runState) * 0.08
  const comboComponent = comboScore(runState) * 0.06
  const verdictAdj = verdictModifier(runState)

  const raw =
    winComponent + statComponent + rarityComponent + comboComponent + verdictAdj
  const score = Math.max(1, Math.min(DISPLAY_MAX, Math.round(raw)))

  const stars = Math.max(1, Math.min(5, Math.ceil(score / 20)))
  const label =
    RATING_LABELS.find((tier) => score >= tier.minScore)?.label ?? 'Catastrophique'

  return { score, maxScore: DISPLAY_MAX, stars, label }
}

export function ratingFromDisplayScore(score: number): RunRating {
  const clamped = Math.max(1, Math.min(DISPLAY_MAX, Math.round(score)))
  const stars = Math.max(1, Math.min(5, Math.ceil(clamped / 20)))
  const label =
    RATING_LABELS.find((tier) => clamped >= tier.minScore)?.label ?? 'Catastrophique'
  return { score: clamped, maxScore: DISPLAY_MAX, stars, label }
}

export function renderRatingStars(stars: number): string {
  const clamped = Math.max(1, Math.min(5, stars))
  return `${'★'.repeat(clamped)}${'☆'.repeat(5 - clamped)}`
}
