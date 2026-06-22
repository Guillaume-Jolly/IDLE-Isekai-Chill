import { normalizeRefugeBiomeId, type RefugeBiomeId } from './myrionRefuge'
import type { RefugeProgressState, RefugeResourceState, PetState } from './minigameSave'
import type { PalmonRarity } from './wildFamiliars'
import { RELEASE_BIOME_FAVOR } from './myrionMvp2'

/** Ressource immédiate du biome lors d’un relâchement (MVP). */
export const RELEASE_IMMEDIATE_RESOURCE: Record<PalmonRarity, number> = {
  N: 1,
  R: 1.5,
  SR: 2.5,
  SSR: 4,
  UR: 6,
  LR: 10,
}

export type ReleaseRewardResult = {
  biomeId: RefugeBiomeId
  favorGain: number
  resourceGain: number
  refugeProgress: RefugeProgressState
  refugeResources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
  summary: string
}

export function applyReleaseRewards(
  pet: PetState,
  refugeProgress: RefugeProgressState,
  refugeResources: Partial<Record<RefugeBiomeId, RefugeResourceState>>,
): ReleaseRewardResult {
  const biomeId = normalizeRefugeBiomeId(pet.biomeId)
  const favorGain = RELEASE_BIOME_FAVOR[pet.rarity]
  const resourceGain = RELEASE_IMMEDIATE_RESOURCE[pet.rarity]
  const resourceState = refugeResources[biomeId] ?? { amount: 0, lastTickAt: Date.now() }

  return {
    biomeId,
    favorGain,
    resourceGain,
    refugeProgress: {
      ...refugeProgress,
      releasedCount: (refugeProgress.releasedCount ?? 0) + 1,
      biomeFavors: {
        ...refugeProgress.biomeFavors,
        [biomeId]: Math.round(((refugeProgress.biomeFavors?.[biomeId] ?? 0) + favorGain) * 1000) / 1000,
      },
    },
    refugeResources: {
      ...refugeResources,
      [biomeId]: {
        ...resourceState,
        amount: Math.round((resourceState.amount + resourceGain) * 10) / 10,
      },
    },
    summary: `+${resourceGain} ressource · Faveur biome +${favorGain}/jour`,
  }
}
