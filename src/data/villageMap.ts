/** Panorama utilisateur — Campement (12800×4263, image native) */
export const PANORAMA_WIDTH = 12800
export const PANORAMA_HEIGHT = 4263

export const PANORAMA_BASE_ASSET = '/village/panorama-base.webp'

export const BUILDING_SLOT_ORDER = [
  'inn',
  'mist-garden',
  'ribbon-workshop',
  'clear-spring',
  'moon-farm',
  'arcane-library',
  'traveler-theater',
  'star-market',
] as const

export const BUILDING_UNLOCK_STAGE: Record<string, number> = {
  'inn': 0,
  'mist-garden': 0,
  'ribbon-workshop': 1,
  'clear-spring': 1,
  'moon-farm': 2,
  'arcane-library': 2,
  'traveler-theater': 3,
  'star-market': 4,
}

/** Positions des pancartes sur le panorama Campement. */
export const BUILDING_SLOTS = [
  { id: 'inn', centerX: 1225, unlockStage: 0, labelYPercent: 8 },
  { id: 'arcane-library', centerX: 2688, unlockStage: 2, labelYPercent: 26 },
  { id: 'mist-garden', centerX: 4350, unlockStage: 0, labelYPercent: 14 },
  { id: 'traveler-theater', centerX: 6350, unlockStage: 3, labelYPercent: 30 },
  { id: 'ribbon-workshop', centerX: 7725, unlockStage: 1, labelYPercent: 10 },
  { id: 'clear-spring', centerX: 9275, unlockStage: 1, labelYPercent: 8 },
  { id: 'star-market', centerX: 10350, unlockStage: 4, labelYPercent: 34 },
  { id: 'moon-farm', centerX: 11725, unlockStage: 2, labelYPercent: 10 },
] as const

export type BuildingMapSlot = (typeof BUILDING_SLOTS)[number]

export const buildingLevelTier = (level: number) => {
  if (level >= 7) return 3
  if (level >= 4) return 2
  return 1
}

export const getPanoramaFocusPercent = (stage: number) => {
  let lastSlot: BuildingMapSlot = BUILDING_SLOTS[0]
  for (const slot of BUILDING_SLOTS) {
    if (stage >= slot.unlockStage) lastSlot = slot
  }
  return (lastSlot.centerX / PANORAMA_WIDTH) * 100
}

export function panoramaStageAsset(_stage: number) {
  void _stage
  return PANORAMA_BASE_ASSET
}

export const panoramaLegacyAsset = '/village/panorama-v1.png'

export const BUILDING_MAP_HINTS: Record<string, string> = {
  'inn': 'Service express auberge',
  'mist-garden': 'Recolte brumeuse',
  'ribbon-workshop': 'Fil d or et soie',
  'clear-spring': 'Bulles de source',
  'moon-farm': 'Graines lunaires',
  'arcane-library': 'Grimoire cache et mana',
  'traveler-theater': 'Concert au theatre',
  'star-market': 'Bazar des etoiles',
}

export const MAP_LABEL_SPOTS = BUILDING_SLOTS.map((slot) => ({
  id: `map-${slot.id}`,
  buildingId: slot.id,
  x: (slot.centerX / PANORAMA_WIDTH) * 100,
  y: slot.labelYPercent,
  hint: BUILDING_MAP_HINTS[slot.id] ?? '',
  targetView: 'miniGames' as const,
}))
