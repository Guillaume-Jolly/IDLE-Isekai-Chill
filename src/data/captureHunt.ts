import { DISAGREA_BIOME, DISAGREA_COMPANIONS } from './eventDisagreaPack'
import type { PalmonRarity } from './wildFamiliars'
import { CAPTURE_SWEET_CENTER, RARITY_CAPTURE } from './wildFamiliars'
import type { HuntFavorModifiers } from './myrionMvp2'

export type HuntPhase = 'entering' | 'appeared' | 'capturing' | 'success' | 'failed'

/** Phases de l'écran chasse / capture (exploration carte → combat → résultat). */
export type CaptureGamePhase = 'explore' | 'hunt' | 'result'

export type TimingGrade = 'perfect' | 'great' | 'good' | 'miss'

export const TIMING_BONUS: Record<TimingGrade, number> = {
  perfect: 25,
  great: 15,
  good: 7,
  miss: 0,
}

/** Chance de base avant bonus timing / compagnon (spec MVP). */
export const RARITY_BASE_CAPTURE: Record<PalmonRarity, number> = {
  N: 70,
  R: 58,
  SR: 50,
  SSR: 32,
  UR: 18,
  LR: 8,
}

/** Nombre de tentatives de timing par rarete. */
export const RARITY_CAPTURE_ATTEMPTS: Record<PalmonRarity, number> = {
  N: 1,
  R: 2,
  SR: 2,
  SSR: 2,
  UR: 3,
  LR: 3,
}

export type AmbientParticleKind =
  | 'pollen'
  | 'fireflies'
  | 'mist'
  | 'snow'
  | 'sand'
  | 'bubbles'
  | 'embers'
  | 'stars'

export const BIOME_AMBIENT: Record<string, AmbientParticleKind> = {
  'prairie-solaire': 'pollen',
  'foret-ancienne': 'fireflies',
  'marais-brumeux': 'mist',
  'montagnes-cristallines': 'snow',
  'desert-rouge': 'sand',
  'rivage-corallien': 'bubbles',
  'volcan-noir': 'embers',
  'ruines-astrales': 'stars',
  [DISAGREA_BIOME.id]: 'embers',
}

/** Override du compagnon guide en chasse pour certains biomes (ex. event Disagrea). */
export const HUNT_BIOME_GUIDE: Record<string, { companionId: string; name: string }> = {
  [DISAGREA_BIOME.id]: {
    companionId: 'etna',
    name: DISAGREA_COMPANIONS.etna.displayName,
  },
}

export function resolveHuntGuideCompanion(
  biomeId: string,
  fallback: { companionId: string; name: string },
): { id: string; name: string; side: 'left' } {
  const override = HUNT_BIOME_GUIDE[biomeId]
  return {
    id: override?.companionId ?? fallback.companionId,
    name: override?.name ?? fallback.name,
    side: 'left',
  }
}

/** Biomes favoris du compagnon Talia (bonus capture). */
export const COMPANION_BIOME_BONUS: Record<string, { biomes: string[]; bonus: number }> = {
  talia: { biomes: ['prairie-solaire', 'foret-ancienne', 'marais-brumeux'], bonus: 10 },
  nami: { biomes: ['rivage-corallien'], bonus: 12 },
  luna: { biomes: ['ruines-astrales', 'montagnes-cristallines'], bonus: 10 },
}

export function gradeCaptureTiming(progress: number, rarity: PalmonRarity): TimingGrade {
  const { sweetHalfWidth } = RARITY_CAPTURE[rarity]
  const delta = Math.abs(progress - CAPTURE_SWEET_CENTER)
  if (delta <= sweetHalfWidth * 0.35) return 'perfect'
  if (delta <= sweetHalfWidth) return 'great'
  if (delta <= sweetHalfWidth * 2.2) return 'good'
  return 'miss'
}

export function companionCaptureBonus(companionId: string, biomeId: string): number {
  const profile = COMPANION_BIOME_BONUS[companionId]
  if (!profile) return 5
  return profile.biomes.includes(biomeId) ? profile.bonus : 5
}

export function computeCaptureChance(
  rarity: PalmonRarity,
  grades: TimingGrade[],
  companionId: string,
  biomeId: string,
  favorModifiers: HuntFavorModifiers = {
    captureBonus: 0,
    antiFleeBonus: 0,
    rarityBonus: 0,
    shinyBonus: 0,
    biomeBonus: 0,
    speciesBonus: 0,
    hintBonus: 0,
  },
  linkedCaptureBonus = 0,
): number {
  const base = RARITY_BASE_CAPTURE[rarity]
  const bestBonus = grades.reduce((best, grade) => Math.max(best, TIMING_BONUS[grade]), 0)
  const avgBonus =
    grades.length > 0
      ? grades.reduce((sum, grade) => sum + TIMING_BONUS[grade], 0) / grades.length
      : 0
  const timingBonus = rarity === 'LR' || rarity === 'UR' ? avgBonus : bestBonus
  const companionBonus = companionCaptureBonus(companionId, biomeId)
  const favorBonus =
    favorModifiers.captureBonus +
    favorModifiers.hintBonus * 0.5 +
    favorModifiers.antiFleeBonus * 0.35 +
    favorModifiers.biomeBonus * 0.4 +
    favorModifiers.speciesBonus * 0.35
  const rarityFavorBonus =
    ['SR', 'SSR', 'UR', 'LR'].includes(rarity) ? favorModifiers.rarityBonus : 0
  return Math.min(
    96,
    Math.max(
      4,
      base + timingBonus + companionBonus + favorBonus + rarityFavorBonus + linkedCaptureBonus,
    ),
  )
}

export function rollCaptureSuccess(chance: number): boolean {
  return Math.random() * 100 < chance
}

export function timingGradeLabel(grade: TimingGrade): string {
  switch (grade) {
    case 'perfect':
      return 'Parfait !'
    case 'great':
      return 'Super !'
    case 'good':
      return 'Bien'
    default:
      return 'Rate'
  }
}
