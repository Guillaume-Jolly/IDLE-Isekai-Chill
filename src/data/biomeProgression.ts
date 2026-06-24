import type { PetState } from './minigameSave'
import type { MinigameSave } from './minigameSave'
import {
  BIOMES,
  PALMON_RARITIES,
  PALMON_SPECIES,
  type Biome,
  type PalmonRarity,
  type PalmonSpecies,
  type WildEncounter,
} from './wildFamiliars'
import type { HuntFavor } from './myrionMvp2'
import { pickActiveHuntFavors } from './myrionMvp2'

export type BiomeUnlockRequirement = {
  biomeId: string
  requiredTotalCaptured: number
  requiredRarityCounts?: Partial<Record<PalmonRarity, number>>
}

export type PlayerCollection = {
  capturedMyrionIds: string[]
  capturedByBiome: Record<string, string[]>
  capturedByRarity: Record<PalmonRarity, number>
  totalCaught: number
}

export type BiomeProgress = {
  biomeId: string
  caught: number
  total: number
  ratio: number
  complete: boolean
  countsByRarity: Partial<Record<PalmonRarity, number>>
}

export const BIOME_UNLOCK_ORDER = BIOMES.map((biome) => biome.id)

export const BIOME_UNLOCK_REQUIREMENTS: BiomeUnlockRequirement[] = [
  { biomeId: 'prairie-solaire', requiredTotalCaptured: 0 },
  { biomeId: 'foret-ancienne', requiredTotalCaptured: 5 },
  { biomeId: 'marais-brumeux', requiredTotalCaptured: 10, requiredRarityCounts: { SR: 1 } },
  { biomeId: 'montagnes-cristallines', requiredTotalCaptured: 18, requiredRarityCounts: { SR: 3 } },
  { biomeId: 'desert-rouge', requiredTotalCaptured: 26, requiredRarityCounts: { SSR: 1 } },
  { biomeId: 'rivage-corallien', requiredTotalCaptured: 36, requiredRarityCounts: { SSR: 3 } },
  { biomeId: 'volcan-noir', requiredTotalCaptured: 48, requiredRarityCounts: { UR: 1 } },
  { biomeId: 'ruines-astrales', requiredTotalCaptured: 60, requiredRarityCounts: { UR: 3 } },
  { biomeId: 'disagrea-event', requiredTotalCaptured: 0 },
]

const MYRION_IDS = new Set(PALMON_SPECIES.map((species) => species.id))

const EMPTY_RARITY_COUNTS = (): Record<PalmonRarity, number> => ({
  N: 0,
  R: 0,
  SR: 0,
  SSR: 0,
  UR: 0,
  LR: 0,
})

export function buildPlayerCollection(
  pets: PetState[],
  captureStats?: MinigameSave['captureStats'],
): PlayerCollection {
  const myrionPets = pets.filter((pet) => MYRION_IDS.has(pet.speciesId))
  const capturedByBiome: Record<string, string[]> = {}

  for (const pet of myrionPets) {
    const list = capturedByBiome[pet.biomeId] ?? []
    if (!list.includes(pet.speciesId)) {
      capturedByBiome[pet.biomeId] = [...list, pet.speciesId]
    }
  }

  const capturedByRarity = EMPTY_RARITY_COUNTS()
  for (const rarity of PALMON_RARITIES) {
    capturedByRarity[rarity] = captureStats?.caughtByRarity?.[rarity] ?? 0
  }

  const hasRarityStats = Object.values(capturedByRarity).some((count) => count > 0)
  if (!hasRarityStats && (captureStats?.totalCaught ?? 0) > 0) {
    for (const pet of myrionPets) {
      capturedByRarity[pet.rarity] += 1
    }
  }

  return {
    capturedMyrionIds: [...new Set(myrionPets.map((pet) => pet.speciesId))],
    capturedByBiome,
    capturedByRarity,
    totalCaught: captureStats?.totalCaught ?? 0,
  }
}

export function getUnlockRequirement(biomeId: string): BiomeUnlockRequirement | undefined {
  return BIOME_UNLOCK_REQUIREMENTS.find((req) => req.biomeId === biomeId)
}

export function isBiomeUnlocked(
  biomeId: string,
  collection: PlayerCollection,
  requirements: BiomeUnlockRequirement[] = BIOME_UNLOCK_REQUIREMENTS,
): boolean {
  const req = requirements.find((entry) => entry.biomeId === biomeId)
  if (!req) return false
  if (collection.totalCaught < req.requiredTotalCaptured) return false

  if (req.requiredRarityCounts) {
    for (const [rarity, needed] of Object.entries(req.requiredRarityCounts) as [
      PalmonRarity,
      number,
    ][]) {
      if ((collection.capturedByRarity[rarity] ?? 0) < needed) return false
    }
  }

  return true
}

export function getUnlockedBiomeIds(collection: PlayerCollection): string[] {
  return BIOME_UNLOCK_ORDER.filter((biomeId) => isBiomeUnlocked(biomeId, collection))
}

export function formatUnlockCondition(biomeId: string): string {
  const req = getUnlockRequirement(biomeId)
  if (!req || req.requiredTotalCaptured === 0) return 'Disponible des le depart'

  const parts: string[] = [`${req.requiredTotalCaptured} captures totales`]
  if (req.requiredRarityCounts) {
    for (const [rarity, count] of Object.entries(req.requiredRarityCounts) as [
      PalmonRarity,
      number,
    ][]) {
      parts.push(`${count} ${rarity} capture${count > 1 ? 's' : ''}`)
    }
  }
  return parts.join(' · ')
}

export function getBiomeProgress(biomeId: string, collection: PlayerCollection): BiomeProgress {
  const total = PALMON_SPECIES.filter((species) => species.biomeId === biomeId).length
  const caughtIds = collection.capturedByBiome[biomeId] ?? []
  const countsByRarity: Partial<Record<PalmonRarity, number>> = {}

  for (const speciesId of caughtIds) {
    const species = PALMON_SPECIES.find((entry) => entry.id === speciesId)
    if (!species) continue
    countsByRarity[species.rarity] = (countsByRarity[species.rarity] ?? 0) + 1
  }

  const caught = caughtIds.length
  const ratio = total > 0 ? caught / total : 0

  return {
    biomeId,
    caught,
    total,
    ratio,
    complete: total > 0 && caught >= total,
    countsByRarity,
  }
}

export function hasSsrPlusInBiome(biomeId: string, collection: PlayerCollection): boolean {
  const caught = collection.capturedByBiome[biomeId] ?? []
  return caught.some((speciesId) => {
    const species = PALMON_SPECIES.find((entry) => entry.id === speciesId)
    return species && (species.rarity === 'SSR' || species.rarity === 'UR' || species.rarity === 'LR')
  })
}

export function canSpawnLrInBiome(biomeId: string, collection: PlayerCollection): boolean {
  if (!isBiomeUnlocked(biomeId, collection)) return false
  const progress = getBiomeProgress(biomeId, collection)
  if (progress.ratio < 0.7) return false
  if (!hasSsrPlusInBiome(biomeId, collection)) return false
  return true
}

export function getDailyLrSpecies(biomeId: string, date = new Date()): PalmonSpecies | null {
  const lrs = PALMON_SPECIES.filter(
    (species) => species.biomeId === biomeId && species.rarity === 'LR',
  )
  if (lrs.length === 0) return null

  const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  let hash = 0
  for (const char of `${biomeId}:${dayKey}`) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }

  return lrs[Math.abs(hash) % lrs.length] ?? null
}

function rollRarityExcludingLr(): PalmonRarity {
  const raw: Record<PalmonRarity, number> = {
    N: 45,
    R: 28,
    SR: 15,
    SSR: 8,
    UR: 3.5,
    LR: 0,
  }
  const roll = Math.random() * 99.5
  let cumulative = 0
  for (const rarity of PALMON_RARITIES) {
    cumulative += raw[rarity]
    if (roll <= cumulative) return rarity
  }
  return 'N'
}

function pickSpeciesForRarity(
  biomeId: string,
  rarity: PalmonRarity,
  collection: PlayerCollection,
): PalmonSpecies {
  if (rarity === 'LR' && canSpawnLrInBiome(biomeId, collection)) {
    const daily = getDailyLrSpecies(biomeId)
    if (daily) return daily
  }

  const pool = PALMON_SPECIES.filter(
    (species) => species.biomeId === biomeId && species.rarity === rarity,
  )
  if (pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)]
  }

  const fallback = PALMON_SPECIES.filter((species) => species.biomeId === biomeId)
  return fallback[Math.floor(Math.random() * fallback.length)]
}

export function rollRarityForBiome(
  biomeId: string,
  collection: PlayerCollection,
  huntFavors: HuntFavor[] = [],
): PalmonRarity {
  const active = pickActiveHuntFavors(huntFavors)
  const rarityBonus = active
    .filter((favor) => favor.category === 'rarity')
    .reduce((sum, favor) => sum + favor.value, 0)

  const weights: Record<PalmonRarity, number> = {
    N: 45,
    R: 28,
    SR: 15,
    SSR: 8,
    UR: 3.5,
    LR: canSpawnLrInBiome(biomeId, collection) ? 0.5 : 0,
  }

  if (rarityBonus > 0) {
    const shift = Math.min(12, rarityBonus * 3)
    weights.N = Math.max(20, weights.N - shift * 0.5)
    weights.R = Math.max(14, weights.R - shift * 0.35)
    weights.SR += shift * 0.35
    weights.SSR += shift * 0.25
    weights.UR += shift * 0.15
    if (weights.LR > 0) weights.LR += shift * 0.05
  }

  const roll = Math.random() * 100
  let cumulative = 0
  for (const rarity of PALMON_RARITIES) {
    cumulative += weights[rarity]
    if (roll <= cumulative) return rarity
  }

  if (canSpawnLrInBiome(biomeId, collection)) {
    return rollRarityExcludingLr()
  }
  return 'N'
}

function pickSpeciesWithFavors(
  biomeId: string,
  rarity: PalmonRarity,
  collection: PlayerCollection,
  huntFavors: HuntFavor[],
): PalmonSpecies {
  const active = pickActiveHuntFavors(huntFavors)
  const speciesFavor = active.find(
    (favor) => favor.category === 'species_appearance' && favor.targetSpeciesId,
  )
  if (speciesFavor?.targetSpeciesId) {
    const target = PALMON_SPECIES.find((species) => species.id === speciesFavor.targetSpeciesId)
    const bias = Math.min(0.55, speciesFavor.value * 0.04)
    if (
      target &&
      target.biomeId === biomeId &&
      (target.rarity === rarity || Math.random() < bias)
    ) {
      return target
    }
  }

  const biomeFavor = active.find(
    (favor) =>
      favor.category === 'biome_appearance' &&
      favor.targetBiomeId &&
      favor.targetBiomeId === biomeId,
  )
  if (biomeFavor && Math.random() < Math.min(0.35, biomeFavor.value * 0.025)) {
    const boostedPool = PALMON_SPECIES.filter(
      (species) => species.biomeId === biomeId && species.rarity === rarity,
    )
    if (boostedPool.length > 0) {
      return boostedPool[Math.floor(Math.random() * boostedPool.length)]
    }
  }

  return pickSpeciesForRarity(biomeId, rarity, collection)
}

export function rollEncounterInBiome(
  biome: Biome,
  collection: PlayerCollection,
  huntFavors: HuntFavor[] = [],
): WildEncounter {
  const rarity = rollRarityForBiome(biome.id, collection, huntFavors)
  const palmon = pickSpeciesWithFavors(biome.id, rarity, collection, huntFavors)
  return { biome, palmon }
}

export function getBiomeUnlockStatus(
  biomeId: string,
  collection: PlayerCollection,
): { unlocked: boolean; condition: string; progress: BiomeProgress } {
  return {
    unlocked: isBiomeUnlocked(biomeId, collection),
    condition: formatUnlockCondition(biomeId),
    progress: getBiomeProgress(biomeId, collection),
  }
}
