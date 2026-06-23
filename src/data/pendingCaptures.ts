import {
  compareCapturedMyrion,
  petPowerScore,
  type CaptureCompareResult,
  type HuntSearchObjective,
} from './myrionMvp2'
import { MAX_SPECIES_COPIES, speciesCopyCount } from './myrionRefuge'
import type { PendingHuntCapture, PetState } from './minigameSave'

export type PendingBulkReleaseCondition =
  | 'recommend_release'
  | 'common_rarity'
  | 'no_objective_hit'
  | 'weaker_duplicate'
  | 'without_rare_traits'

export type PendingBulkKeepCondition =
  | 'all'
  | 'while_room'
  | 'beats_weakest'
  | 'not_recommend_release'
  | 'objective_or_rare'

export const PENDING_BULK_RELEASE_OPTIONS: Array<{
  id: PendingBulkReleaseCondition
  label: string
  description: string
}> = [
  {
    id: 'recommend_release',
    label: 'Doublons recommandés',
    description: 'Relâche les spécimens marqués « relâche recommandée ».',
  },
  {
    id: 'common_rarity',
    label: 'Communs (N) non protégés',
    description: 'Rareté N sans shiny, variante ni objectif atteint.',
  },
  {
    id: 'no_objective_hit',
    label: 'Sans objectif de pistage',
    description: 'Aucun objectif actif atteint par le Myrion.',
  },
  {
    id: 'weaker_duplicate',
    label: 'Plus faibles que le stock',
    description: 'Doublons qui ne battent pas ton exemplaire le plus faible.',
  },
  {
    id: 'without_rare_traits',
    label: 'Sans trait rare ni variante',
    description: 'Exclut shiny, variantes et traits rares.',
  },
]

export const PENDING_BULK_KEEP_OPTIONS: Array<{
  id: PendingBulkKeepCondition
  label: string
  description: string
}> = [
  {
    id: 'all',
    label: 'Tout garder',
    description:
      'Ajoute tous les Myrions au refuge. Remplace automatiquement le plus faible si une espèce est saturée.',
  },
  {
    id: 'while_room',
    label: 'Tant qu’il reste de la place',
    description: 'Garde seulement les espèces sous la limite (10 exemplaires) sans remplacement.',
  },
  {
    id: 'beats_weakest',
    label: 'Meilleurs que le stock',
    description: 'Premiers exemplaires ou puissance supérieure au plus faible du refuge.',
  },
  {
    id: 'not_recommend_release',
    label: 'Hors relâche recommandée',
    description: 'Exclut les doublons marqués « relâche recommandée ».',
  },
  {
    id: 'objective_or_rare',
    label: 'Objectifs, shiny & rares',
    description: 'Shiny, objectifs atteints, variantes et traits rares.',
  },
]

export type PendingCaptureSnapshot = {
  entry: PendingHuntCapture
  comparison: CaptureCompareResult
  power: number
}

export function refugePetsWithPending(
  refugePets: PetState[],
  pending: PendingHuntCapture[],
  excludeId?: string,
): PetState[] {
  return [
    ...refugePets,
    ...pending.filter((item) => item.id !== excludeId).map((item) => item.pet),
  ]
}

export function comparePendingCapture(
  entry: PendingHuntCapture,
  allPending: PendingHuntCapture[],
  refugePets: PetState[],
  objectives: HuntSearchObjective[],
): CaptureCompareResult {
  return compareCapturedMyrion(
    entry.pet,
    refugePetsWithPending(refugePets, allPending, entry.id),
    objectives,
  )
}

export function buildPendingCaptureSnapshots(
  entries: PendingHuntCapture[],
  refugePets: PetState[],
  objectives: HuntSearchObjective[],
): PendingCaptureSnapshot[] {
  return entries.map((entry) => {
    const comparison = comparePendingCapture(entry, entries, refugePets, objectives)
    return {
      entry,
      comparison,
      power: petPowerScore(entry.pet),
    }
  })
}

export function matchesPendingBulkCondition(
  snapshot: PendingCaptureSnapshot,
  condition: PendingBulkReleaseCondition,
): boolean {
  const { entry, comparison } = snapshot
  if (comparison.protectFromAutoRelease) return false

  switch (condition) {
    case 'recommend_release':
      return comparison.recommendRelease
    case 'common_rarity':
      return entry.pet.rarity === 'N'
    case 'no_objective_hit':
      return !comparison.objectiveResults.some((result) => result.status === 'hit')
    case 'weaker_duplicate':
      return comparison.speciesCopyCount > 0 && !comparison.beatsWeakest
    case 'without_rare_traits':
      return (
        !entry.pet.isShiny &&
        !entry.pet.visualVariant &&
        comparison.verdict !== 'rare_trait' &&
        comparison.verdict !== 'shiny'
      )
    default:
      return false
  }
}

export function pendingIdsMatchingCondition(
  snapshots: PendingCaptureSnapshot[],
  condition: PendingBulkReleaseCondition,
): string[] {
  return snapshots
    .filter((snapshot) => matchesPendingBulkCondition(snapshot, condition))
    .map((snapshot) => snapshot.entry.id)
}

export function countProtectedPending(snapshots: PendingCaptureSnapshot[]): number {
  return snapshots.filter((snapshot) => snapshot.comparison.protectFromAutoRelease).length
}

export function hasSpeciesRoomForPending(
  entry: PendingHuntCapture,
  refugePets: PetState[],
  allPending: PendingHuntCapture[],
): boolean {
  const pool = refugePetsWithPending(refugePets, allPending, entry.id)
  return speciesCopyCount(pool, entry.pet.speciesId) < MAX_SPECIES_COPIES
}

export function previewKeepPending(
  entry: PendingHuntCapture,
  refugePets: PetState[],
  allPending: PendingHuntCapture[],
  objectives: HuntSearchObjective[],
): CaptureCompareResult {
  const pool = refugePetsWithPending(refugePets, allPending, entry.id)
  return compareCapturedMyrion(entry.pet, [...pool, entry.pet], objectives)
}

export function matchesPendingBulkKeepCondition(
  snapshot: PendingCaptureSnapshot,
  condition: PendingBulkKeepCondition,
  refugePets: PetState[],
  allPending: PendingHuntCapture[],
): boolean {
  const { entry, comparison } = snapshot

  switch (condition) {
    case 'all':
      return true
    case 'while_room':
      return hasSpeciesRoomForPending(entry, refugePets, allPending)
    case 'beats_weakest':
      return comparison.speciesCopyCount === 0 || comparison.beatsWeakest
    case 'not_recommend_release':
      return !comparison.recommendRelease
    case 'objective_or_rare':
      return (
        comparison.protectFromAutoRelease ||
        comparison.verdict === 'rare_trait' ||
        comparison.verdict === 'shiny' ||
        comparison.verdict === 'objective_hit'
      )
    default:
      return false
  }
}

export function pendingIdsMatchingKeepCondition(
  snapshots: PendingCaptureSnapshot[],
  condition: PendingBulkKeepCondition,
  refugePets: PetState[],
  allPending: PendingHuntCapture[],
): string[] {
  return snapshots
    .filter((snapshot) =>
      matchesPendingBulkKeepCondition(snapshot, condition, refugePets, allPending),
    )
    .map((snapshot) => snapshot.entry.id)
}
