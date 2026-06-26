import type { ResourceKey } from './buildingActivities'
import type { PalmonRarity } from './wildFamiliars'

/**
 * Constantes d'équilibrage Chantier Myrion — MVP 10 / extension MVP 14.
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
export const WORKSITE_AUTO_MIN_GRANT = 0.01
export const WORKSITE_AUTO_MAX_CATCHUP_SEC = 5

export type WorksiteBiomeUnlockRule = {
  totalChantier?: number
  wood?: number
  stone?: number
  food?: number
  ingredients?: number
}

export type WorksiteSpotUnlockRule = {
  wood?: number
  stone?: number
  food?: number
  ingredients?: number
  totalChantier?: number
}

/**
 * Déblocages biomes / spots — MVP 10 (1–3) + provisoire MVP 14 (4–15).
 * Biomes 4+ : total chantier + ressource des biomes précédents uniquement.
 */
export const WORKSITE_UNLOCK_THRESHOLDS = {
  biomes: {
    'foret-douce': { totalChantier: 28 },
    'marais-lucioles': { totalChantier: 68, wood: 14 },
    'rivage-brumeux': { totalChantier: 82, stone: 10 },
    'vergers-suspendus': { totalChantier: 96, food: 38 },
    'ruines-florales': { totalChantier: 112, stone: 18 },
    'grotte-cristalline': { totalChantier: 128, ingredients: 12 },
    'desert-cendres-roses': { totalChantier: 142, stone: 28 },
    'montagne-vents': { totalChantier: 158, food: 52 },
    'lac-etoile': { totalChantier: 176, ingredients: 22 },
    'bois-automne-eternel': { totalChantier: 194, ingredients: 35 },
    'jardin-fongique': { totalChantier: 214, food: 65 },
    'sanctuaire-astral': { totalChantier: 236, stone: 40 },
    'ile-celeste': { totalChantier: 260, ingredients: 48 },
  },
  spots: {
    'foret-douce:clairiere-herbes': { wood: 22 },
    'foret-douce:source-claire': { wood: 36 },
    'mine-tranquille:veine-brute': { stone: 20 },
    'mine-tranquille:charbonniere': { stone: 38 },
    'marais-lucioles:flaque-fertile': { totalChantier: 72 },
    'marais-lucioles:champignons-luisants': { totalChantier: 76 },
    'rivage-brumeux:bois-flotte': { totalChantier: 86 },
    'rivage-brumeux:sable-humide': { totalChantier: 90 },
    'vergers-suspendus:graines-dorees': { totalChantier: 100 },
    'vergers-suspendus:fleurs-fruitieres': { totalChantier: 104 },
    'ruines-florales:reliques-fleuries': { totalChantier: 116 },
    'ruines-florales:lierre-ancien': { totalChantier: 120 },
    'grotte-cristalline:veine-argentee': { totalChantier: 132 },
    'grotte-cristalline:flaque-souterraine': { totalChantier: 136 },
    'desert-cendres-roses:cactus-doux': { totalChantier: 146 },
    'desert-cendres-roses:oasis-pale': { totalChantier: 150 },
    'montagne-vents:pierres-hautes': { totalChantier: 162 },
    'montagne-vents:pins-tordus': { totalChantier: 166 },
    'lac-etoile:galets-lunaires': { totalChantier: 180 },
    'lac-etoile:reflets-astraux': { totalChantier: 184 },
    'bois-automne-eternel:bois-roux': { totalChantier: 198 },
    'bois-automne-eternel:champignons-ambres': { totalChantier: 202 },
    'jardin-fongique:spores-douces': { totalChantier: 218 },
    'jardin-fongique:cristaux-myceliens': { totalChantier: 222 },
    'sanctuaire-astral:pierre-sacree': { totalChantier: 240 },
    'sanctuaire-astral:reliques-anciennes': { totalChantier: 244 },
    'ile-celeste:pierres-flottantes': { totalChantier: 264 },
    'ile-celeste:cristaux-ciel': { totalChantier: 268 },
  },
} as const satisfies {
  biomes: Record<string, WorksiteBiomeUnlockRule>
  spots: Record<string, WorksiteSpotUnlockRule>
}

/** Mine : total chantier + bois (la pierre n'existe qu'après déblocage Mine). — inchangé MVP 10 */
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

/** Ressource principale par biome — inventaire global. */
export const WORKSITE_BIOME_PRIMARY_RESOURCE: Record<string, ResourceKey> = {
  'prairie-chantier': 'food',
  'foret-douce': 'wood',
  'mine-tranquille': 'stone',
  'marais-lucioles': 'ingredients',
  'rivage-brumeux': 'stone',
  'vergers-suspendus': 'food',
  'ruines-florales': 'renown',
  'grotte-cristalline': 'crystals',
  'desert-cendres-roses': 'stone',
  'montagne-vents': 'mana',
  'lac-etoile': 'ingredients',
  'bois-automne-eternel': 'ingredients',
  'jardin-fongique': 'food',
  'sanctuaire-astral': 'stardust',
  'ile-celeste': 'food',
}
