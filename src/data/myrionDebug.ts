import { normalizeRefugeBiomeId, type RefugeBiomeId } from './myrionRefuge'
import { createCapturedMyrion, createHuntFavor, type HuntFavor } from './myrionMvp2'
import type { PetState } from './minigameSave'
import { PALMON_SPECIES } from './wildFamiliars'

/** Panneau debug refuge/chasse — désactiver avant release. */
export const MYRION_REFUGE_DEBUG = true

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export function speciesForBiome(biomeId: RefugeBiomeId) {
  return PALMON_SPECIES.filter((species) => normalizeRefugeBiomeId(species.biomeId) === biomeId)
}

export function spawnDebugMyrion(biomeId?: RefugeBiomeId, speciesId?: string): PetState {
  const pool = speciesId
    ? PALMON_SPECIES.filter((species) => species.id === speciesId)
    : biomeId
      ? speciesForBiome(biomeId)
      : PALMON_SPECIES
  const species = pool.length > 0 ? pick(pool) : PALMON_SPECIES[0]
  return createCapturedMyrion(species, `debug-${species.id}-${Date.now()}`, Date.now())
}

export function spawnDebugMyrionBatch(count: number, biomeId?: RefugeBiomeId): PetState[] {
  return Array.from({ length: count }, () => spawnDebugMyrion(biomeId))
}

/** Preset checklist : N exemplaires d'une même espèce (défaut 10). */
export function spawnDebugSpeciesCopies(
  speciesId: string,
  count: number,
  options?: { shiny?: boolean },
): PetState[] {
  const species = PALMON_SPECIES.find((entry) => entry.id === speciesId)
  if (!species) return []
  return Array.from({ length: count }, (_, index) => {
    const pet = createCapturedMyrion(species, `debug-${species.id}-${index}-${Date.now()}`, Date.now())
    if (options?.shiny) pet.isShiny = true
    return pet
  })
}

/** Preset checklist : une espèce de chaque biome (collection complète partielle). */
export function spawnDebugFullBiome(biomeId: RefugeBiomeId): PetState[] {
  return speciesForBiome(biomeId).map((species, index) =>
    createCapturedMyrion(species, `debug-full-${species.id}-${index}`, Date.now()),
  )
}

/** Preset checklist : file de faveurs de chasse. */
export function spawnDebugHuntFavors(count: number): HuntFavor[] {
  const categories = ['capture', 'anti_flee', 'rarity', 'hint', 'biome_appearance'] as const
  return Array.from({ length: count }, (_, index) =>
    createHuntFavor(categories[index % categories.length], ((index % 3) + 1) as 1 | 2 | 3),
  )
}
