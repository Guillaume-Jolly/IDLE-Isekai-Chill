import type { PetState } from './minigameSave'
import {
  assignMyrionToSpot,
  getSpotsForBiome,
  getWorksiteSpot,
  worksiteAssignedPetsInBiome,
  worksiteMyrionAssignedElsewhere,
  worksiteRarityMultiplier,
  worksiteSpotKey,
  WORKSITE_BIOMES,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotDef,
  type WorksiteSpotId,
} from './myrionWorksite'
import { isWorksiteSpotUnlocked } from './myrionWorksiteProgression'
import type { PalmonRarity } from './wildFamiliars'
import { PALMON_RARITIES } from './wildFamiliars'

export const WORKSITE_ASSIGN_PAGE_SIZE = 30

export type WorksiteAssignSort = 'efficiency-desc' | 'efficiency-asc' | 'name-asc' | 'rarity-desc'

export type WorksiteBatchCount = 1 | 5 | 10 | 20 | 50 | 'page' | 'all'

export type WorksiteBatchCriteria = 'sorted-list' | 'top-efficiency'

export type WorksiteSpeciesGroup = {
  speciesId: string
  representative: PetState
  count: number
  petIds: string[]
  totalEfficiency: number
}

export type WorksiteRarityGroup = {
  rarity: PalmonRarity
  count: number
  speciesCount: number
}

export function worksitePetEfficiency(pet: PetState, spot: WorksiteSpotDef): number {
  return worksiteRarityMultiplier(pet.rarity) * spot.baseAutoYieldPerMyrion
}

export function sortPetsForWorksiteAssign(
  pets: PetState[],
  spot: WorksiteSpotDef,
  sort: WorksiteAssignSort,
): PetState[] {
  const list = [...pets]
  switch (sort) {
    case 'efficiency-asc':
      return list.sort(
        (a, b) => worksitePetEfficiency(a, spot) - worksitePetEfficiency(b, spot),
      )
    case 'efficiency-desc':
      return list.sort(
        (a, b) => worksitePetEfficiency(b, spot) - worksitePetEfficiency(a, spot),
      )
    case 'rarity-desc':
      return list.sort(
        (a, b) =>
          PALMON_RARITIES.indexOf(b.rarity) - PALMON_RARITIES.indexOf(a.rarity) ||
          a.name.localeCompare(b.name, 'fr'),
      )
    default:
      return list.sort((a, b) => a.name.localeCompare(b.name, 'fr'))
  }
}

export function groupPetsBySpecies(pets: PetState[]): WorksiteSpeciesGroup[] {
  const bySpecies = new Map<string, PetState[]>()
  for (const pet of pets) {
    const list = bySpecies.get(pet.speciesId) ?? []
    list.push(pet)
    bySpecies.set(pet.speciesId, list)
  }
  return Array.from(bySpecies.entries())
    .map(([speciesId, group]) => {
      const sorted = [...group].sort(
        (a, b) => worksiteRarityMultiplier(b.rarity) - worksiteRarityMultiplier(a.rarity),
      )
      const representative = sorted[0]
      return {
        speciesId,
        representative,
        count: group.length,
        petIds: sorted.map((pet) => pet.id),
        totalEfficiency: group.reduce((sum, pet) => sum + worksiteRarityMultiplier(pet.rarity), 0),
      }
    })
    .sort((a, b) => a.representative.name.localeCompare(b.representative.name, 'fr'))
}

export function groupPetsByRarity(pets: PetState[]): WorksiteRarityGroup[] {
  const counts = new Map<PalmonRarity, { count: number; species: Set<string> }>()
  for (const pet of pets) {
    const entry = counts.get(pet.rarity) ?? { count: 0, species: new Set<string>() }
    entry.count += 1
    entry.species.add(pet.speciesId)
    counts.set(pet.rarity, entry)
  }
  return PALMON_RARITIES.filter((rarity) => counts.has(rarity)).map((rarity) => {
    const entry = counts.get(rarity)!
    return { rarity, count: entry.count, speciesCount: entry.species.size }
  })
}

export function paginateList<T>(items: T[], page: number, pageSize: number): T[] {
  const safePage = Math.max(0, page)
  const start = safePage * pageSize
  return items.slice(start, start + pageSize)
}

export function resolveBatchCount(
  count: WorksiteBatchCount,
  pageSize: number,
  availableCount: number,
): number {
  if (count === 'page') return Math.min(pageSize, availableCount)
  if (count === 'all') return availableCount
  return Math.min(count, availableCount)
}

export function pickPetsForBatchAssign(
  available: PetState[],
  spot: WorksiteSpotDef,
  sort: WorksiteAssignSort,
  criteria: WorksiteBatchCriteria,
  count: WorksiteBatchCount,
  page: number,
  pageSize: number,
): PetState[] {
  const sorted =
    criteria === 'top-efficiency'
      ? sortPetsForWorksiteAssign(available, spot, 'efficiency-desc')
      : sortPetsForWorksiteAssign(available, spot, sort)

  const pool =
    criteria === 'sorted-list' && count === 'page'
      ? paginateList(sorted, page, pageSize)
      : sorted

  const limit = resolveBatchCount(count, pageSize, pool.length)
  const source = criteria === 'sorted-list' && count !== 'page' ? sorted : pool
  return source.slice(0, limit)
}

export function unlockedSpotsForBiome(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
): WorksiteSpotDef[] {
  return getSpotsForBiome(biomeId).filter((spot) =>
    isWorksiteSpotUnlocked(worksite, biomeId, spot.id),
  )
}

/** Spot de référence pour tri / efficacité (UI biome unifiée). */
export function worksiteBiomeReferenceSpot(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
): WorksiteSpotDef {
  const unlocked = unlockedSpotsForBiome(worksite, biomeId)
  if (unlocked.length > 0) return unlocked[0]
  return getWorksiteSpot(biomeId, WORKSITE_BIOMES[biomeId].spotIds[0])
}

export function pickBiomeAssignSpotId(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
): WorksiteSpotId {
  const unlocked = unlockedSpotsForBiome(worksite, biomeId)
  if (unlocked.length === 0) return WORKSITE_BIOMES[biomeId].spotIds[0]
  let pick = unlocked[0].id
  let minCount = Infinity
  for (const spot of unlocked) {
    const count = worksite.assignedMyrionIdsBySpot[worksiteSpotKey(biomeId, spot.id)]?.length ?? 0
    if (count < minCount) {
      minCount = count
      pick = spot.id
    }
  }
  return pick
}

export function assignMyrionToBiome(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  petId: string,
): MyrionWorksiteSave {
  return assignMyrionToSpot(worksite, biomeId, pickBiomeAssignSpotId(worksite, biomeId), petId)
}

export function assignMyrionsToBiome(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  petIds: string[],
): MyrionWorksiteSave {
  return petIds.reduce((state, petId) => assignMyrionToBiome(state, biomeId, petId), worksite)
}

export function availablePetsForBiome(
  worksite: MyrionWorksiteSave,
  pets: PetState[],
  biomeId: WorksiteBiomeId,
): PetState[] {
  const assignedInBiome = worksiteAssignedPetsInBiome(worksite, biomeId, pets)
  const assignedIds = new Set(assignedInBiome.map((pet) => pet.id))
  return pets.filter(
    (pet) =>
      !assignedIds.has(pet.id) && worksiteMyrionAssignedElsewhere(worksite, pet.id) === null,
  )
}

export function assignMyrionsToSpot(
  worksite: MyrionWorksiteSave,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  petIds: string[],
): MyrionWorksiteSave {
  return petIds.reduce(
    (state, petId) => assignMyrionToSpot(state, biomeId, spotId, petId),
    worksite,
  )
}

export function isPetAssignableToSpot(
  worksite: MyrionWorksiteSave,
  petId: string,
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  assignedHere: boolean,
): boolean {
  if (assignedHere) return true
  return worksiteMyrionAssignedElsewhere(worksite, petId, biomeId, spotId) === null
}

export function availablePetsForSpot(
  worksite: MyrionWorksiteSave,
  pets: PetState[],
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  assignedHere: PetState[],
): PetState[] {
  const hereIds = new Set(assignedHere.map((pet) => pet.id))
  return pets.filter(
    (pet) =>
      !hereIds.has(pet.id) &&
      isPetAssignableToSpot(worksite, pet.id, biomeId, spotId, false),
  )
}

export function assignedSpeciesSummary(assigned: PetState[]): {
  speciesGroups: WorksiteSpeciesGroup[]
  rarityGroups: WorksiteRarityGroup[]
} {
  return {
    speciesGroups: groupPetsBySpecies(assigned),
    rarityGroups: groupPetsByRarity(assigned),
  }
}
