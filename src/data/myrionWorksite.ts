import type { Cost, ResourceKey } from './buildingActivities'
import type { PetState } from './minigameSave'
import type { PalmonRarity } from './wildFamiliars'

export const WORKSITE_BIOME_ID = 'prairie-chantier' as const
export const WORKSITE_BIOME_LABEL = 'Prairie du chantier'

export const WORKSITE_SPOT_IDS = ['bosquet', 'pierrier', 'champs'] as const
export type WorksiteSpotId = (typeof WORKSITE_SPOT_IDS)[number]

export type WorksiteSpotDef = {
  id: WorksiteSpotId
  name: string
  emoji: string
  resourceId: ResourceKey
  baseClickYield: number
  baseAutoYieldPerMyrion: number
  unlocked: boolean
  hint: string
}

export const WORKSITE_SPOTS: Record<WorksiteSpotId, WorksiteSpotDef> = {
  bosquet: {
    id: 'bosquet',
    name: 'Bosquet',
    emoji: '🌳',
    resourceId: 'wood',
    baseClickYield: 0.35,
    baseAutoYieldPerMyrion: 0.012,
    unlocked: true,
    hint: 'Bois — calmement.',
  },
  pierrier: {
    id: 'pierrier',
    name: 'Pierrier',
    emoji: '🪨',
    resourceId: 'stone',
    baseClickYield: 0.35,
    baseAutoYieldPerMyrion: 0.012,
    unlocked: true,
    hint: 'Pierre — sans pression.',
  },
  champs: {
    id: 'champs',
    name: 'Champs',
    emoji: '🌾',
    resourceId: 'food',
    baseClickYield: 0.4,
    baseAutoYieldPerMyrion: 0.014,
    unlocked: true,
    hint: 'Vivres — petites récoltes.',
  },
}

/** Coefficients provisoires MVP 1. */
export const WORKSITE_RARITY_MULT: Record<PalmonRarity, number> = {
  N: 1,
  R: 1.25,
  SR: 1.5,
  SSR: 2,
  UR: 2.5,
  LR: 3,
}

export type MyrionWorksiteSave = {
  biomeId: typeof WORKSITE_BIOME_ID
  selectedSpotId: WorksiteSpotId
  assignedMyrionIdsBySpot: Record<WorksiteSpotId, string[]>
  totalProducedBySpot: Partial<Record<WorksiteSpotId, number>>
  lastAutoTickAt: number
}

export function createStarterMyrionWorksite(now = Date.now()): MyrionWorksiteSave {
  return {
    biomeId: WORKSITE_BIOME_ID,
    selectedSpotId: 'bosquet',
    assignedMyrionIdsBySpot: {
      bosquet: [],
      pierrier: [],
      champs: [],
    },
    totalProducedBySpot: {},
    lastAutoTickAt: now,
  }
}

export function mergeMyrionWorksite(partial?: Partial<MyrionWorksiteSave>): MyrionWorksiteSave {
  const starter = createStarterMyrionWorksite()
  if (!partial) return starter

  const assigned = { ...starter.assignedMyrionIdsBySpot }
  for (const spotId of WORKSITE_SPOT_IDS) {
    const list = partial.assignedMyrionIdsBySpot?.[spotId]
    assigned[spotId] = Array.isArray(list) ? [...list] : []
  }

  const selected =
    partial.selectedSpotId && WORKSITE_SPOT_IDS.includes(partial.selectedSpotId)
      ? partial.selectedSpotId
      : starter.selectedSpotId

  return {
    biomeId: WORKSITE_BIOME_ID,
    selectedSpotId: selected,
    assignedMyrionIdsBySpot: assigned,
    totalProducedBySpot: { ...partial.totalProducedBySpot },
    lastAutoTickAt:
      typeof partial.lastAutoTickAt === 'number' && Number.isFinite(partial.lastAutoTickAt)
        ? partial.lastAutoTickAt
        : starter.lastAutoTickAt,
  }
}

export function worksiteRarityMultiplier(rarity: PalmonRarity): number {
  return WORKSITE_RARITY_MULT[rarity] ?? 1
}

export function worksiteAssignedPets(
  worksite: MyrionWorksiteSave,
  spotId: WorksiteSpotId,
  pets: PetState[],
): PetState[] {
  const ids = new Set(worksite.assignedMyrionIdsBySpot[spotId] ?? [])
  return pets.filter((pet) => ids.has(pet.id))
}

export function worksiteMyrionAssignedElsewhere(
  worksite: MyrionWorksiteSave,
  petId: string,
  exceptSpot?: WorksiteSpotId,
): WorksiteSpotId | null {
  for (const spotId of WORKSITE_SPOT_IDS) {
    if (exceptSpot && spotId === exceptSpot) continue
    if (worksite.assignedMyrionIdsBySpot[spotId]?.includes(petId)) return spotId
  }
  return null
}

export function computeWorksiteClickYield(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
): number {
  const bonus = assignedPets.reduce(
    (sum, pet) => sum + 0.05 * worksiteRarityMultiplier(pet.rarity),
    0,
  )
  return Math.max(0.1, Math.round((spot.baseClickYield + bonus) * 100) / 100)
}

export function computeWorksiteAutoPerSecond(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
): number {
  if (assignedPets.length === 0) return 0
  const rate = assignedPets.reduce(
    (sum, pet) =>
      sum + spot.baseAutoYieldPerMyrion * worksiteRarityMultiplier(pet.rarity),
    0,
  )
  return Math.round(rate * 1000) / 1000
}

/** Auto tick — max 5 s de rattrapage pour éviter les spikes au retour focus. */
export function computeWorksiteAutoGrant(
  spot: WorksiteSpotDef,
  assignedPets: PetState[],
  lastTickAt: number,
  now = Date.now(),
): { reward: Cost; nextTickAt: number; amount: number } {
  const deltaSec = Math.min(5, Math.max(0, (now - lastTickAt) / 1000))
  const perSec = computeWorksiteAutoPerSecond(spot, assignedPets)
  const raw = perSec * deltaSec
  const amount = raw >= 0.05 ? Math.floor(raw * 100) / 100 : 0
  return {
    amount,
    reward: amount > 0 ? { [spot.resourceId]: amount } : {},
    nextTickAt: now,
  }
}

export function assignMyrionToSpot(
  worksite: MyrionWorksiteSave,
  spotId: WorksiteSpotId,
  petId: string,
): MyrionWorksiteSave {
  const nextAssigned = { ...worksite.assignedMyrionIdsBySpot }
  for (const id of WORKSITE_SPOT_IDS) {
    nextAssigned[id] = (nextAssigned[id] ?? []).filter((entry) => entry !== petId)
  }
  nextAssigned[spotId] = [...(nextAssigned[spotId] ?? []), petId]
  return { ...worksite, assignedMyrionIdsBySpot: nextAssigned }
}

export function removeMyrionFromSpot(
  worksite: MyrionWorksiteSave,
  spotId: WorksiteSpotId,
  petId: string,
): MyrionWorksiteSave {
  return {
    ...worksite,
    assignedMyrionIdsBySpot: {
      ...worksite.assignedMyrionIdsBySpot,
      [spotId]: (worksite.assignedMyrionIdsBySpot[spotId] ?? []).filter(
        (entry) => entry !== petId,
      ),
    },
  }
}
