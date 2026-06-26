/** Biomes, spots et save — partagés sans dépendance circulaire (progression ↔ worksite). */

export const WORKSITE_BIOME_IDS = [
  'prairie-chantier',
  'foret-douce',
  'mine-tranquille',
] as const
export type WorksiteBiomeId = (typeof WORKSITE_BIOME_IDS)[number]

export type WorksiteSpotId =
  | 'bosquet'
  | 'pierrier'
  | 'champs'
  | 'sous-bois'
  | 'clairiere-herbes'
  | 'source-claire'
  | 'pierrier-profond'
  | 'veine-brute'
  | 'charbonniere'

export type WorksiteBiomeDef = {
  id: WorksiteBiomeId
  label: string
  emoji: string
  panoramaClass: string
  spotIds: readonly WorksiteSpotId[]
}

export const WORKSITE_BIOMES: Record<WorksiteBiomeId, WorksiteBiomeDef> = {
  'prairie-chantier': {
    id: 'prairie-chantier',
    label: 'Prairie du chantier',
    emoji: '🌾',
    panoramaClass: 'mg-worksite-scene--prairie',
    spotIds: ['bosquet', 'pierrier', 'champs'],
  },
  'foret-douce': {
    id: 'foret-douce',
    label: 'Forêt douce',
    emoji: '🌲',
    panoramaClass: 'mg-worksite-scene--foret',
    spotIds: ['sous-bois', 'clairiere-herbes', 'source-claire'],
  },
  'mine-tranquille': {
    id: 'mine-tranquille',
    label: 'Mine tranquille',
    emoji: '⛏️',
    panoramaClass: 'mg-worksite-scene--mine',
    spotIds: ['pierrier-profond', 'veine-brute', 'charbonniere'],
  },
}

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
}
