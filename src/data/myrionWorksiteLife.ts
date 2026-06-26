import type { PetState } from './minigameSave'
import type { EnclosureBounds } from './myrionRefuge'
import type { EnclosureObstacle } from './myrionRefuge'
import {
  getSpotsForBiome,
  worksiteAssignedPetsInBiome,
  worksiteRarityMultiplier,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksite'
import { isWorksiteSpotUnlocked } from './myrionWorksiteProgression'
import type { PalmonRarity } from './wildFamiliars'

export type DecorativeMyrionState = 'working' | 'resting' | 'eating' | 'sleeping'

export const WORKSITE_LIFE_BUCKET_SEC = 60
export const WORKSITE_LIFE_MAX_SPECIES = 15

/** Taille chibi sur le panorama — visible sans masquer le décor. */
export const WORKSITE_LIFE_CHIBI_BASE_REM = 2.55

export const WORKSITE_LIFE_CHIBI_RARITY_SCALE: Record<PalmonRarity, number> = {
  N: 0.86,
  R: 0.94,
  SR: 1.02,
  SSR: 1.1,
  UR: 1.18,
  LR: 1.28,
}

/** Zone de balade principale (tout le biome, au-dessus des filons). */
export const WORKSITE_FIELD_BOUNDS: EnclosureBounds = {
  minX: 8,
  maxX: 92,
  minY: 22,
  maxY: 68,
}

/** @deprecated Coins repos — décor uniquement */
export const WORKSITE_WORK_ZONE_BOUNDS: EnclosureBounds = WORKSITE_FIELD_BOUNDS

export const WORKSITE_REST_ZONE_BOUNDS: EnclosureBounds = {
  minX: 5,
  maxX: 22,
  minY: 56,
  maxY: 82,
}

export const WORKSITE_FOOD_ZONE_BOUNDS: EnclosureBounds = {
  minX: 78,
  maxX: 95,
  minY: 56,
  maxY: 82,
}

export function worksiteSpotObstacles(spotCount: number): EnclosureObstacle[] {
  if (spotCount <= 0) return []
  return Array.from({ length: spotCount }, (_, index) => {
    const t = spotCount <= 1 ? 0.5 : index / (spotCount - 1)
    const x = 12 + t * 76
    return { x, y: 79, radius: 11 }
  })
}

export type WorksiteSpeciesLifeRep = {
  representative: PetState
  speciesId: string
  duplicateCount: number
  assignedSpotIds: WorksiteSpotId[]
  state: DecorativeMyrionState
  workingSpotIndex: number
}

export type WorksiteBiomeLifePlan = {
  representatives: WorksiteSpeciesLifeRep[]
  speciesOverflow: number
  hiddenAssigned: number
  totalAssigned: number
  dominantState: DecorativeMyrionState | null
  stateCounts: Record<DecorativeMyrionState, number>
}

export function getLifeTimeBucket(now = Date.now(), bucketSec = WORKSITE_LIFE_BUCKET_SEC): number {
  return Math.floor(now / (bucketSec * 1000))
}

export function getDecorativeMyrionState(
  myrionId: string,
  bucket: number,
  scopeKey: string,
): DecorativeMyrionState {
  const seed = `${myrionId}:${bucket}:${scopeKey}`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  const roll = hash % 10
  if (roll < 5) return 'working'
  if (roll < 7) return 'resting'
  if (roll < 9) return 'eating'
  return 'sleeping'
}

export function getWorkingSpotIndex(myrionId: string, bucket: number, spotCount: number): number {
  if (spotCount <= 1) return 0
  const seed = `${myrionId}:${bucket}:work-spot`
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }
  return hash % spotCount
}

export function decorativeStateLabel(state: DecorativeMyrionState): string {
  switch (state) {
    case 'working':
      return 'Au travail'
    case 'resting':
      return 'Repos'
    case 'eating':
      return 'Repas'
    case 'sleeping':
      return 'Sommeil'
    default:
      return state
  }
}

export function shortMyrionName(name: string, max = 8): string {
  const trimmed = name.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

function pickSpeciesRepresentative(group: PetState[]): PetState {
  return [...group].sort(
    (a, b) => worksiteRarityMultiplier(b.rarity) - worksiteRarityMultiplier(a.rarity),
  )[0]
}

export function buildWorksiteBiomeLifePlan(
  worksite: MyrionWorksiteSave,
  activeBiomeId: WorksiteBiomeId,
  pets: PetState[],
  bucket = getLifeTimeBucket(),
): WorksiteBiomeLifePlan {
  const assigned = worksiteAssignedPetsInBiome(worksite, activeBiomeId, pets)
  const spots = getSpotsForBiome(activeBiomeId).filter((spot) =>
    isWorksiteSpotUnlocked(worksite, activeBiomeId, spot.id),
  )
  const unlockedSpotCount = Math.max(1, spots.length)

  const bySpecies = new Map<string, { pets: PetState[]; spotIds: Set<WorksiteSpotId> }>()
  for (const spot of spots) {
    const spotKey = worksiteSpotKey(activeBiomeId, spot.id)
    const spotPets = assigned.filter((pet) =>
      (worksite.assignedMyrionIdsBySpot[spotKey] ?? []).includes(pet.id),
    )
    for (const pet of spotPets) {
      const entry = bySpecies.get(pet.speciesId) ?? { pets: [], spotIds: new Set<WorksiteSpotId>() }
      if (!entry.pets.some((item) => item.id === pet.id)) entry.pets.push(pet)
      entry.spotIds.add(spot.id)
      bySpecies.set(pet.speciesId, entry)
    }
  }

  const speciesGroups = Array.from(bySpecies.entries())
    .map(([speciesId, entry]) => ({
      speciesId,
      pets: entry.pets,
      spotIds: Array.from(entry.spotIds),
      count: entry.pets.length,
    }))
    .sort((a, b) => b.count - a.count || a.speciesId.localeCompare(b.speciesId))

  const visibleGroups = speciesGroups.slice(0, WORKSITE_LIFE_MAX_SPECIES)
  const hiddenSpecies = speciesGroups.slice(WORKSITE_LIFE_MAX_SPECIES)
  const hiddenAssigned = hiddenSpecies.reduce((sum, group) => sum + group.count, 0)

  const representatives: WorksiteSpeciesLifeRep[] = visibleGroups.map((group) => {
    const representative = pickSpeciesRepresentative(group.pets)
    const state = getDecorativeMyrionState(representative.id, bucket, activeBiomeId)
    const spotIndex = spots.findIndex((spot) => group.spotIds.includes(spot.id))
    const workingSpotIndex =
      spotIndex >= 0 ? spotIndex : getWorkingSpotIndex(representative.id, bucket, unlockedSpotCount)
    return {
      representative,
      speciesId: group.speciesId,
      duplicateCount: group.count,
      assignedSpotIds: group.spotIds,
      state,
      workingSpotIndex: state === 'working' ? workingSpotIndex : spotIndex >= 0 ? spotIndex : 0,
    }
  })

  const stateCounts: Record<DecorativeMyrionState, number> = {
    working: 0,
    resting: 0,
    eating: 0,
    sleeping: 0,
  }
  for (const rep of representatives) stateCounts[rep.state] += rep.duplicateCount
  for (const group of hiddenSpecies) {
    const state = getDecorativeMyrionState(group.pets[0].id, bucket, `${activeBiomeId}:hidden`)
    stateCounts[state] += group.count
  }

  const dominantState =
    assigned.length === 0
      ? null
      : (Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0][0] as DecorativeMyrionState)

  return {
    representatives,
    speciesOverflow: hiddenSpecies.length,
    hiddenAssigned,
    totalAssigned: assigned.length,
    dominantState,
    stateCounts,
  }
}

/** @deprecated Utiliser buildWorksiteBiomeLifePlan */
export function buildWorksiteLifeView(
  worksite: MyrionWorksiteSave,
  activeBiomeId: WorksiteBiomeId,
  pets: PetState[],
  bucket = getLifeTimeBucket(),
) {
  const plan = buildWorksiteBiomeLifePlan(worksite, activeBiomeId, pets, bucket)
  return {
    visible: plan.representatives.map((rep) => ({
      pet: rep.representative,
      spotId: rep.assignedSpotIds[0],
      spotKey: worksiteSpotKey(activeBiomeId, rep.assignedSpotIds[0]),
      spotIndex: rep.workingSpotIndex,
      slotAtSpot: 0,
      state: rep.state,
      duplicateCount: rep.duplicateCount,
    })),
    overflow: plan.hiddenAssigned,
    totalAssigned: plan.totalAssigned,
    dominantState: plan.dominantState,
    stateCounts: plan.stateCounts,
  }
}
