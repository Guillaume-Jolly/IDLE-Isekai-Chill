import {
  biomeBackgroundPath,
  getPalmonAssetPath,
  type PalmonSpriteVariant,
} from './minigameAssets'
import { MYRIONS_BIOMES, MYRIONS_SPECIES } from './myrionsCatalog.generated'
import { MYRION_SPECIES_IDS } from './minigameAssets'

export type PalmonRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR'

export type Biome = {
  id: string
  name: string
  emoji: string
  /** Fallback CSS si fond biome PNG absent */
  fallbackGradient: string
}

export type PalmonSpecies = {
  id: string
  name: string
  emoji: string
  rarity: PalmonRarity
  biomeId: string
}

export type WildEncounter = {
  biome: Biome
  palmon: PalmonSpecies
}

export const PALMON_RARITIES: PalmonRarity[] = ['N', 'R', 'SR', 'SSR', 'UR', 'LR']

export const RARITY_WEIGHTS: Record<PalmonRarity, number> = {
  N: 45,
  R: 28,
  SR: 15,
  SSR: 8,
  UR: 3.5,
  LR: 0.5,
}

export const RARITY_COLORS: Record<PalmonRarity, string> = {
  N: '#9aa3b2',
  R: '#5a9fd4',
  SR: '#b49bff',
  SSR: '#ffb347',
  UR: '#ff6eb4',
  LR: '#ffd700',
}

/** Teintes saturées pour halos et apparition (plus visibles que RARITY_COLORS). */
export const RARITY_AURA_COLORS: Record<PalmonRarity, string> = {
  N: '#c8d0dc',
  R: '#3d8cff',
  SR: '#a855f7',
  SSR: '#ff9500',
  UR: '#ff2d6a',
  LR: '#ffcc00',
}

/** Echelle du sprite en rencontre (N petit → LR imposant). */
export const RARITY_ENCOUNTER_SCALE: Record<PalmonRarity, number> = {
  N: 0.7,
  R: 0.8,
  SR: 0.9,
  SSR: 1.05,
  UR: 1.2,
  LR: 1.38,
}

/** Echelle chibi dans le refuge — N = 2× la taille de base, puis croissant par rareté. */
export const RARITY_REFUGE_CHIBI_SCALE: Record<PalmonRarity, number> = {
  N: 2,
  R: 2.35,
  SR: 2.75,
  SSR: 3.2,
  UR: 3.7,
  LR: 4.3,
}

/** Fenetre de capture : anneau interieur rejoint l exterieur a ~66% du temps. */
export const RARITY_CAPTURE: Record<
  PalmonRarity,
  { sweetHalfWidth: number; durationMs: number; startScale: number; endScale: number }
> = {
  N: { sweetHalfWidth: 0.07, durationMs: 3000, startScale: 1.62, endScale: 0.68 },
  R: { sweetHalfWidth: 0.055, durationMs: 2700, startScale: 1.64, endScale: 0.66 },
  SR: { sweetHalfWidth: 0.042, durationMs: 2400, startScale: 1.66, endScale: 0.64 },
  SSR: { sweetHalfWidth: 0.032, durationMs: 2100, startScale: 1.68, endScale: 0.62 },
  UR: { sweetHalfWidth: 0.024, durationMs: 1850, startScale: 1.7, endScale: 0.6 },
  LR: { sweetHalfWidth: 0.018, durationMs: 1600, startScale: 1.72, endScale: 0.58 },
}

export const CAPTURE_SWEET_CENTER = 0.66

export const BIOMES: Biome[] = MYRIONS_BIOMES.map((biome) => ({ ...biome }))

export const PALMON_SPECIES: PalmonSpecies[] = MYRIONS_SPECIES.map((species) => ({
  ...species,
  rarity: species.rarity as PalmonRarity,
})).filter((species) => MYRION_SPECIES_IDS.has(species.id))

export const getBiome = (biomeId: string) => BIOMES.find((biome) => biome.id === biomeId)

export const getPalmonImage = (speciesId: string, variant: PalmonSpriteVariant = 'full') =>
  getPalmonAssetPath(speciesId, variant)

export const getBiomeImage = (biomeId: string) => biomeBackgroundPath(biomeId)

/** Biomes dont le PNG de fond existe dans public/assets/minigames/capture/biomes/ */
export const BIOMES_WITH_BACKGROUNDS = BIOMES.map((biome) => biome.id)

export function rollRarity(): PalmonRarity {
  const roll = Math.random() * 100
  let cumulative = 0
  for (const rarity of PALMON_RARITIES) {
    cumulative += RARITY_WEIGHTS[rarity]
    if (roll <= cumulative) {
      return rarity
    }
  }
  return 'N'
}

export function rollEncounter(): WildEncounter {
  const readyBiomes = BIOMES.filter((biome) =>
    (BIOMES_WITH_BACKGROUNDS as readonly string[]).includes(biome.id),
  )
  const biome = readyBiomes[Math.floor(Math.random() * readyBiomes.length)] ?? BIOMES[0]
  const rarity = rollRarity()
  const pool = PALMON_SPECIES.filter(
    (species) => species.biomeId === biome.id && species.rarity === rarity,
  )
  const fallbackPool = PALMON_SPECIES.filter((species) => species.biomeId === biome.id)
  const palmon =
    pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : fallbackPool[Math.floor(Math.random() * fallbackPool.length)]

  return { biome, palmon }
}

export function captureRingScale(progress: number, rarity: PalmonRarity) {
  const { startScale, endScale } = RARITY_CAPTURE[rarity]
  return startScale - progress * (startScale - endScale)
}

export function isCaptureSuccess(progress: number, rarity: PalmonRarity) {
  const { sweetHalfWidth } = RARITY_CAPTURE[rarity]
  return (
    progress >= CAPTURE_SWEET_CENTER - sweetHalfWidth &&
    progress <= CAPTURE_SWEET_CENTER + sweetHalfWidth
  )
}

export const wildToPetState = (
  palmon: PalmonSpecies,
  instanceId: string,
  now = Date.now(),
) => ({
  id: instanceId,
  speciesId: palmon.id,
  name: palmon.name,
  emoji: palmon.emoji,
  rarity: palmon.rarity,
  biomeId: palmon.biomeId,
  hunger: 72,
  joy: 78,
  energy: 80,
  affectionLevel: 1,
  lastVisit: now,
})
