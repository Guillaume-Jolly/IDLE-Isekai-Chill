import type { PalmonRarity } from './wildFamiliars'
import { BIOMES, PALMON_SPECIES } from './wildFamiliars'

export type RefugeBiomeId = (typeof BIOMES)[number]['id']

export type EnclosureBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type BiomeResourceDef = {
  id: RefugeBiomeId
  resourceName: string
  resourceEmoji: string
  particleClass: string
}

export const ENCLOSURE_ASSET_ROOT = '/minigames/enclosures'

/** Ratio natif des PNG d enclos (1672×941). */
export const ENCLOSURE_ASPECT_RATIO = 1672 / 941

export const enclosureAssetPath = (biomeId: string) => `${ENCLOSURE_ASSET_ROOT}/${biomeId}.png`

/** Zone praticable centrale — marge large pour les gros chibis (LR) près du décor. */
export const ENCLOSURE_PLAYFIELD: EnclosureBounds = {
  minX: 18,
  maxX: 82,
  minY: 28,
  maxY: 72,
}

/** Zone centrale praticable (pourcentages du conteneur). */
export const ENCLOSURE_BOUNDS: Record<RefugeBiomeId, EnclosureBounds> = {
  'prairie-solaire': ENCLOSURE_PLAYFIELD,
  'foret-ancienne': { minX: 17, maxX: 83, minY: 28, maxY: 72 },
  'marais-brumeux': { minX: 18, maxX: 82, minY: 30, maxY: 70 },
  'montagnes-cristallines': { minX: 18, maxX: 82, minY: 26, maxY: 70 },
  'desert-rouge': ENCLOSURE_PLAYFIELD,
  'rivage-corallien': { minX: 17, maxX: 83, minY: 30, maxY: 70 },
  'volcan-noir': { minX: 18, maxX: 82, minY: 30, maxY: 68 },
  'ruines-astrales': { minX: 19, maxX: 81, minY: 30, maxY: 70 },
}

export function clampToEnclosureBounds(
  x: number,
  y: number,
  bounds: EnclosureBounds = ENCLOSURE_PLAYFIELD,
): { x: number; y: number } {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
  }
}

export const BIOME_RESOURCES: Record<RefugeBiomeId, BiomeResourceDef> = {
  'prairie-solaire': {
    id: 'prairie-solaire',
    resourceName: 'Pollen solaire',
    resourceEmoji: '🌼',
    particleClass: 'mg-particles-pollen',
  },
  'foret-ancienne': {
    id: 'foret-ancienne',
    resourceName: 'Mousse vive',
    resourceEmoji: '🍃',
    particleClass: 'mg-particles-leaves',
  },
  'marais-brumeux': {
    id: 'marais-brumeux',
    resourceName: 'Rosée brumeuse',
    resourceEmoji: '💧',
    particleClass: 'mg-particles-mist',
  },
  'montagnes-cristallines': {
    id: 'montagnes-cristallines',
    resourceName: 'Éclats cristallins',
    resourceEmoji: '💎',
    particleClass: 'mg-particles-frost',
  },
  'desert-rouge': {
    id: 'desert-rouge',
    resourceName: 'Sable rouge',
    resourceEmoji: '🏜️',
    particleClass: 'mg-particles-sand',
  },
  'rivage-corallien': {
    id: 'rivage-corallien',
    resourceName: 'Perles d’écume',
    resourceEmoji: '🫧',
    particleClass: 'mg-particles-bubbles',
  },
  'volcan-noir': {
    id: 'volcan-noir',
    resourceName: 'Braisine noire',
    resourceEmoji: '🔥',
    particleClass: 'mg-particles-ember',
  },
  'ruines-astrales': {
    id: 'ruines-astrales',
    resourceName: 'Poussière astrale',
    resourceEmoji: '✨',
    particleClass: 'mg-particles-stars',
  },
}

export const MAX_SPECIES_COPIES = 10

/** Production de base par jour selon rareté (MVP). */
export const RARITY_DAILY_BASE: Record<PalmonRarity, number> = {
  N: 1,
  R: 1.2,
  SR: 1.5,
  SSR: 2.25,
  UR: 3.5,
  LR: 5,
}

/** Bonus doublon cumulatif (exemplaires 2→10). */
export const DUPLICATE_BONUS = [1, 0.2, 0.15, 0.1, 0.08, 0.05, 0.05, 0.05, 0.05, 0.05]

export const COLLECTION_COMPLETE_BONUS = 0.1

/** Bonus total quand les 15 shiny du biome sont obtenus (remplace le +10 % normal). */
export const SHINY_COLLECTION_BONUS = 0.3

export type BiomeCollectionStatus = {
  biomeId: RefugeBiomeId
  totalSpecies: number
  normalOwned: number
  shinyOwned: number
  normalComplete: boolean
  shinyComplete: boolean
  collectionBonusPercent: number
}

export function getBiomeCollectionStatus(
  pets: { speciesId: string; biomeId: string; isShiny?: boolean }[],
  biomeId: RefugeBiomeId,
): BiomeCollectionStatus {
  const speciesInBiome = PALMON_SPECIES.filter((species) => species.biomeId === biomeId)
  const inBiome = pets.filter((pet) => normalizeRefugeBiomeId(pet.biomeId) === biomeId)
  const ownedSpecies = new Set(inBiome.map((pet) => pet.speciesId))
  const shinySpecies = new Set(
    inBiome.filter((pet) => pet.isShiny).map((pet) => pet.speciesId),
  )
  const normalComplete =
    speciesInBiome.length > 0 && speciesInBiome.every((species) => ownedSpecies.has(species.id))
  const shinyComplete =
    speciesInBiome.length > 0 && speciesInBiome.every((species) => shinySpecies.has(species.id))
  let collectionBonusPercent = 0
  if (shinyComplete) {
    collectionBonusPercent = SHINY_COLLECTION_BONUS
  } else if (normalComplete) {
    collectionBonusPercent = COLLECTION_COMPLETE_BONUS
  }

  return {
    biomeId,
    totalSpecies: speciesInBiome.length,
    normalOwned: ownedSpecies.size,
    shinyOwned: shinySpecies.size,
    normalComplete,
    shinyComplete,
    collectionBonusPercent,
  }
}

export const LEGACY_BIOME_MAP: Record<string, RefugeBiomeId> = {
  'moon-meadow': 'prairie-solaire',
  'mist-forest': 'foret-ancienne',
}

export const normalizeRefugeBiomeId = (biomeId: string): RefugeBiomeId =>
  (LEGACY_BIOME_MAP[biomeId] ?? biomeId) as RefugeBiomeId

export function speciesCopyCount(pets: { speciesId: string }[], speciesId: string) {
  return pets.filter((pet) => pet.speciesId === speciesId).length
}

type EnclosureRepresentativePet = {
  id: string
  speciesId: string
  joy?: number
  hunger?: number
  energy?: number
  affectionLevel?: number
}

function enclosureRepresentativeScore(pet: EnclosureRepresentativePet) {
  return (
    (pet.joy ?? 0) +
    (pet.hunger ?? 0) +
    (pet.energy ?? 0) * 0.5 +
    (pet.affectionLevel ?? 0) * 15
  )
}

/** Un seul chibi par espèce dans l enclos — le plus épanoui représente le groupe. */
export function pickEnclosureRepresentatives<T extends EnclosureRepresentativePet>(
  pets: T[],
): T[] {
  const bySpecies = new Map<string, T>()
  for (const pet of pets) {
    const existing = bySpecies.get(pet.speciesId)
    if (!existing || enclosureRepresentativeScore(pet) > enclosureRepresentativeScore(existing)) {
      bySpecies.set(pet.speciesId, pet)
    }
  }
  return Array.from(bySpecies.values())
}

export function uniqueSpeciesCount(pets: { speciesId: string }[]) {
  return new Set(pets.map((pet) => pet.speciesId)).size
}

export function duplicateProductionMultiplier(copyIndex: number) {
  let total = 0
  for (let index = 0; index < Math.min(copyIndex, DUPLICATE_BONUS.length); index += 1) {
    total += DUPLICATE_BONUS[index]
  }
  return total
}

export function estimateDailyProduction(
  pets: { speciesId: string; rarity: PalmonRarity; biomeId: string }[],
  biomeId: RefugeBiomeId,
  biomeFavorBonus = 0,
  collectionBonusPercent = 0,
) {
  const inBiome = pets.filter((pet) => normalizeRefugeBiomeId(pet.biomeId) === biomeId)
  const bySpecies = new Map<string, typeof inBiome>()
  for (const pet of inBiome) {
    const list = bySpecies.get(pet.speciesId) ?? []
    list.push(pet)
    bySpecies.set(pet.speciesId, list)
  }

  let total = 0
  for (const group of bySpecies.values()) {
    const capped = group.slice(0, MAX_SPECIES_COPIES)
    capped.forEach((pet, index) => {
      total += RARITY_DAILY_BASE[pet.rarity] * duplicateProductionMultiplier(index + 1)
    })
  }

  const multiplier = 1 + collectionBonusPercent + biomeFavorBonus * 0.02
  return Math.round(total * multiplier * 10) / 10
}
