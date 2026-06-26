import type { ResourceKey } from './buildingActivities'
import type { PalmonRarity } from './wildFamiliars'

/**
 * Constantes d'équilibrage Chantier Myrion — MVP 10.
 * Module feuille : pas d'import depuis myrionWorksite / progression / prestige.
 */

/** Bonus supervision biome actif (+15 %). */
export const WORKSITE_SUPERVISION_MULT = 1.15

/** Production passive — base par Myrion assigné (avant rareté). */
export const WORKSITE_DEFAULT_BASE_AUTO_PER_MYIRION = 0.014

/** Clic manuel — base par filon (avant bonus assignés). */
export const WORKSITE_DEFAULT_BASE_CLICK_YIELD = 0.28

/** Bonus clic par Myrion assigné : `bonus += factor * rarityMult`. */
export const WORKSITE_CLICK_ASSIGNED_BONUS_FACTOR = 0.04

/** Plancher rendement clic. */
export const WORKSITE_CLICK_MIN_YIELD = 0.08

/** Overrides par spot (`biomeId:spotId`). */
export const WORKSITE_SPOT_YIELD_OVERRIDES: Record<
  string,
  { baseClickYield?: number; baseAutoYieldPerMyrion?: number }
> = {
  'prairie-chantier:champs': {
    baseClickYield: 0.32,
    baseAutoYieldPerMyrion: 0.016,
  },
}

export const WORKSITE_RARITY_MULT: Record<PalmonRarity, number> = {
  N: 1,
  R: 1.25,
  SR: 1.5,
  SSR: 2,
  UR: 2.5,
  LR: 3,
}

/** Tick auto — seuil minimum d'attribution et rattrapage max (secondes). */
export const WORKSITE_AUTO_MIN_GRANT = 0.05
export const WORKSITE_AUTO_MAX_CATCHUP_SEC = 5

/**
 * Déblocages biomes / spots — provisoire MVP 10.
 * Forêt ~2–4 min jeu léger ; Mine ~5–8 min après (bois requis, pas pierre avant Mine).
 */
export const WORKSITE_UNLOCK_THRESHOLDS = {
  biomes: {
    'foret-douce': { totalChantier: 28 },
  },
  spots: {
    'foret-douce:clairiere-herbes': { wood: 22 },
    'foret-douce:source-claire': { wood: 36 },
    'mine-tranquille:veine-brute': { stone: 20 },
    'mine-tranquille:charbonniere': { stone: 38 },
  },
} as const

export type WorksiteBiomeUnlockRule =
  (typeof WORKSITE_UNLOCK_THRESHOLDS.biomes)[keyof typeof WORKSITE_UNLOCK_THRESHOLDS.biomes]

/** Mine : total chantier + bois (la pierre n'existe qu'après déblocage Mine). */
export const WORKSITE_MINE_BIOME_UNLOCK = {
  totalChantier: 52,
  wood: 18,
} as const

/** Prestige LR — très lent, non bloquant. */
export const WORKSITE_PRESTIGE_BALANCE = {
  baseYieldPerLrPerSecond: 0.002,
  minGrantThreshold: 0.0001,
  maxCatchUpSeconds: 5,
} as const

/** Limites visuelles / UI scène. */
export const WORKSITE_VISUAL_LIMITS = {
  lifeMaxSpecies: 15,
  lifeBucketSec: 60,
  chibiBaseRem: 2.4,
  mineBurstMs: 2200,
  maxMineBursts: 12,
  assignPageSize: 30,
} as const

export const WORKSITE_LIFE_CHIBI_RARITY_SCALE: Record<PalmonRarity, number> = {
  N: 0.86,
  R: 0.94,
  SR: 1.02,
  SSR: 1.1,
  UR: 1.18,
  LR: 1.28,
}

/** Cooldowns sons procéduraux (ms) — ressenti spam clic, pas gameplay économique. */
export const WORKSITE_AUDIO_COOLDOWNS_MS = {
  mine: 72,
  unlock: 420,
  drawer: 160,
  prestige: 280,
} as const

export function worksiteBalanceRarityMultiplier(rarity: PalmonRarity): number {
  return WORKSITE_RARITY_MULT[rarity] ?? 1
}

export function worksiteSpotYieldDefaults(
  biomeSpotKey: string,
): { baseClickYield: number; baseAutoYieldPerMyrion: number } {
  const overrides = WORKSITE_SPOT_YIELD_OVERRIDES[biomeSpotKey]
  return {
    baseClickYield: overrides?.baseClickYield ?? WORKSITE_DEFAULT_BASE_CLICK_YIELD,
    baseAutoYieldPerMyrion:
      overrides?.baseAutoYieldPerMyrion ?? WORKSITE_DEFAULT_BASE_AUTO_PER_MYIRION,
  }
}

/** Ressources par biome — pour documentation / outils ; pas de logique runtime. */
export const WORKSITE_BIOME_PRIMARY_RESOURCE: Record<string, ResourceKey> = {
  'prairie-chantier': 'food',
  'foret-douce': 'wood',
  'mine-tranquille': 'stone',
}
