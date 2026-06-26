import type { PetState } from './minigameSave'
import {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from './myrionWorksiteDefs'
import { isWorksiteBiomeUnlocked } from './myrionWorksiteProgression'
import type { WorksiteVisualAsset } from './myrionWorksiteVisuals'
import { MYRION_WORKSITE_ASSET_ROOT } from './myrionWorksiteVisuals'

/** Aligné sur WORKSITE_SUPERVISION_MULT — valeur locale pour éviter import circulaire. */
const PRESTIGE_SUPERVISION_MULT = 1.15

/** Spot prestige MVP 6 — pas un filon gameplay classique. */
export const WORKSITE_PRESTIGE_SPOT_ID = 'faille-astrale' as const
export type WorksitePrestigeSpotId = typeof WORKSITE_PRESTIGE_SPOT_ID

/** Biome d’affichage scène (pas de biome Astral jouable). */
export const WORKSITE_PRESTIGE_SCENE_BIOME_ID = 'mine-tranquille' as const satisfies WorksiteBiomeId

/** Clé interne ressource prestige (chantier uniquement, hors ResourceKey global). */
export const WORKSITE_PRESTIGE_RESOURCE_KEY = 'astralShards' as const
export type WorksitePrestigeResourceKey = typeof WORKSITE_PRESTIGE_RESOURCE_KEY

export const WORKSITE_PRESTIGE_CONFIG = {
  spotId: WORKSITE_PRESTIGE_SPOT_ID,
  name: 'Faille astrale',
  emoji: '✨',
  resourceKey: WORKSITE_PRESTIGE_RESOURCE_KEY,
  resourceLabel: 'Éclats astraux',
  resourceLabelSingular: 'Éclat astral',
  /** Production passive par LR assigné (hors multi rareté — LR-only). */
  baseYieldPerLrPerSecond: 0.002,
  supervisionMultiplier: PRESTIGE_SUPERVISION_MULT,
  lrRequirementLabel: 'Nécessite un Myrion LR',
  helpText: 'Objectif de prestige. Ne bloque pas la progression normale.',
  drawerLead: 'Production lente réservée aux Myrions LR.',
  minGrantThreshold: 0.0001,
  maxCatchUpSeconds: 5,
} as const

export const WORKSITE_PRESTIGE_SPOT_VISUAL = {
  path: `${MYRION_WORKSITE_ASSET_ROOT}/spots/faille-astrale.png`,
  available: false,
  placeholderClass: 'mg-worksite-spot-object--faille-astrale',
} satisfies WorksiteVisualAsset

export function isLrPet(pet: PetState): boolean {
  return pet.rarity === 'LR'
}

export function listLrPets(pets: PetState[]): PetState[] {
  return pets.filter(isLrPet)
}

export function hasAnyLrPet(pets: PetState[]): boolean {
  return listLrPets(pets).length > 0
}

export function getPrestigeAssignedPet(
  worksite: MyrionWorksiteSave,
  pets: PetState[],
): PetState | null {
  const id = worksite.prestigeAssignedMyrionId
  if (!id) return null
  return pets.find((pet) => pet.id === id) ?? null
}

export function isPrestigeSceneVisible(worksite: MyrionWorksiteSave): boolean {
  return isWorksiteBiomeUnlocked(worksite, WORKSITE_PRESTIGE_SCENE_BIOME_ID)
}

export function canAssignPetToPrestige(
  worksite: MyrionWorksiteSave,
  pet: PetState,
): boolean {
  if (!isLrPet(pet)) return false
  if (worksite.prestigeAssignedMyrionId === pet.id) return true
  return worksitePetIsBusy(worksite, pet.id, { prestige: true }) === false
}

export function worksitePetIsBusy(
  worksite: MyrionWorksiteSave,
  petId: string,
  except?: { prestige?: boolean; biomeId?: WorksiteBiomeId; spotId?: WorksiteSpotId },
): boolean {
  if (!except?.prestige && worksite.prestigeAssignedMyrionId === petId) return true
  for (const biomeId of WORKSITE_BIOME_IDS) {
    for (const spotId of WORKSITE_BIOMES[biomeId].spotIds) {
      if (except?.biomeId === biomeId && except?.spotId === spotId) continue
      const key = worksiteSpotKey(biomeId, spotId)
      if (worksite.assignedMyrionIdsBySpot[key]?.includes(petId)) return true
    }
  }
  return false
}

export function assignLrToPrestige(
  worksite: MyrionWorksiteSave,
  petId: string,
): MyrionWorksiteSave {
  const nextAssigned = { ...worksite.assignedMyrionIdsBySpot }
  for (const key of Object.keys(nextAssigned)) {
    nextAssigned[key] = (nextAssigned[key] ?? []).filter((entry) => entry !== petId)
  }
  return {
    ...worksite,
    assignedMyrionIdsBySpot: nextAssigned,
    prestigeAssignedMyrionId: petId,
    prestigeSeen: true,
  }
}

export function clearPrestigeAssignment(worksite: MyrionWorksiteSave): MyrionWorksiteSave {
  return {
    ...worksite,
    prestigeAssignedMyrionId: null,
  }
}

export function markPrestigeSeen(worksite: MyrionWorksiteSave): MyrionWorksiteSave {
  if (worksite.prestigeSeen) return worksite
  return { ...worksite, prestigeSeen: true }
}

export function computePrestigePerSecond(
  worksite: MyrionWorksiteSave,
  pets: PetState[],
): number {
  const assigned = getPrestigeAssignedPet(worksite, pets)
  if (!assigned) return 0
  const supervised =
    worksite.activeBiomeId === WORKSITE_PRESTIGE_SCENE_BIOME_ID
      ? WORKSITE_PRESTIGE_CONFIG.supervisionMultiplier
      : 1
  const rate = WORKSITE_PRESTIGE_CONFIG.baseYieldPerLrPerSecond * supervised
  return Math.round(rate * 1_000_000) / 1_000_000
}

export function computePrestigeGrant(
  worksite: MyrionWorksiteSave,
  pets: PetState[],
  lastTickAt: number,
  now = Date.now(),
): { amount: number; nextTotal: number } {
  const perSec = computePrestigePerSecond(worksite, pets)
  const deltaSec = Math.min(
    WORKSITE_PRESTIGE_CONFIG.maxCatchUpSeconds,
    Math.max(0, (now - lastTickAt) / 1000),
  )
  const raw = perSec * deltaSec
  const amount =
    raw >= WORKSITE_PRESTIGE_CONFIG.minGrantThreshold
      ? Math.floor(raw * 10_000) / 10_000
      : 0
  const current = worksite.totalAstralShards ?? 0
  return {
    amount,
    nextTotal: current + amount,
  }
}

export function formatPrestigeAmount(value: number): string {
  if (value >= 1) return value.toFixed(2)
  if (value >= 0.01) return value.toFixed(3)
  return value.toFixed(4)
}

export function mergePrestigeSaveFields(
  partial: Partial<MyrionWorksiteSave> | undefined,
  starter: MyrionWorksiteSave,
): Pick<MyrionWorksiteSave, 'totalAstralShards' | 'prestigeAssignedMyrionId' | 'prestigeSeen'> {
  const totalAstralShards =
    typeof partial?.totalAstralShards === 'number' && Number.isFinite(partial.totalAstralShards)
      ? Math.max(0, partial.totalAstralShards)
      : starter.totalAstralShards ?? 0

  const prestigeAssignedMyrionId =
    partial?.prestigeAssignedMyrionId === null ||
    typeof partial?.prestigeAssignedMyrionId === 'string'
      ? partial.prestigeAssignedMyrionId ?? null
      : starter.prestigeAssignedMyrionId ?? null

  const prestigeSeen =
    typeof partial?.prestigeSeen === 'boolean' ? partial.prestigeSeen : starter.prestigeSeen ?? false

  return { totalAstralShards, prestigeAssignedMyrionId, prestigeSeen }
}
