/** Biomes, spots et save — partagés sans dépendance circulaire (progression ↔ worksite). */
/** Catalogue étendu 15 biomes : voir myrionWorksiteBiomeCatalog.ts (MVP 13). */
/** Gameplay 3 filons / biome : voir myrionWorksiteBiomeRuntime.ts (MVP 14). */

import {
  WORKSITE_RUNTIME_BIOME_IDS,
  WORKSITE_RUNTIME_BIOMES,
  type WorksiteRuntimeBiomeId,
  type WorksiteRuntimeSpotId,
} from './myrionWorksiteBiomeRuntime'

export const WORKSITE_BIOME_IDS = WORKSITE_RUNTIME_BIOME_IDS
export type WorksiteBiomeId = WorksiteRuntimeBiomeId

export type WorksiteSpotId = WorksiteRuntimeSpotId

export type WorksiteBiomeDef = {
  id: WorksiteBiomeId
  label: string
  emoji: string
  panoramaClass: string
  spotIds: readonly WorksiteSpotId[]
  /** Ressource principale (inventaire global). */
  primaryResource?: import('./buildingActivities').ResourceKey
  description?: string
}

export const WORKSITE_BIOMES: Record<WorksiteBiomeId, WorksiteBiomeDef> = Object.fromEntries(
  WORKSITE_BIOME_IDS.map((id) => {
    const runtime = WORKSITE_RUNTIME_BIOMES[id]
    return [
      id,
      {
        id,
        label: runtime.label,
        emoji: runtime.emoji,
        panoramaClass: runtime.panoramaClass,
        spotIds: runtime.spotIds as readonly WorksiteSpotId[],
        primaryResource: runtime.primaryResource,
        description: runtime.description,
      } satisfies WorksiteBiomeDef,
    ]
  }),
) as Record<WorksiteBiomeId, WorksiteBiomeDef>

export function worksiteSpotKey(biomeId: WorksiteBiomeId, spotId: WorksiteSpotId): string {
  return `${biomeId}:${spotId}`
}

export type MyrionWorksiteSave = {
  activeBiomeId: WorksiteBiomeId
  unlockedBiomeIds: WorksiteBiomeId[]
  unlockedSpotKeys: string[]
  selectedSpotByBiome: Record<WorksiteBiomeId, WorksiteSpotId>
  assignedMyrionIdsBySpot: Record<string, string[]>
  totalProducedBySpot: Partial<Record<string, number>>
  seenUnlockNotificationIds: string[]
  lastAutoTickAt: number
  /** MVP 6 — éclats astraux (interne chantier, hors inventaire global). */
  totalAstralShards?: number
  /** MVP 6 — un seul LR sur la Faille astrale. */
  prestigeAssignedMyrionId?: string | null
  /** MVP 6 — joueur a ouvert / vu la section prestige. */
  prestigeSeen?: boolean
  /** Migrations one-shot (ex. reset assignations MVP 4.1, extension 15 biomes MVP 14). */
  saveMigrationVersion?: number
}
