/**
 * Regénère src/data/villageMap.ts depuis scripts/assets/village-map-layout.mjs
 * Usage: node scripts/sync-village-map.mjs
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  BUILDING_SLOTS,
  BUILDING_SLOT_ORDER,
  BUILDING_UNLOCK_STAGE,
  PANORAMA_HEIGHT,
  PANORAMA_WIDTH,
} from './assets/village-map-layout.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const hints = {
  inn: 'Service express auberge',
  'mist-garden': 'Recolte brumeuse',
  'ribbon-workshop': 'Fil d or et soie',
  'clear-spring': 'Bulles de source',
  'moon-farm': 'Graines lunaires',
  'arcane-library': 'Grimoire cache et mana',
  'traveler-theater': 'Concert au theatre',
  'star-market': 'Bazar des etoiles',
}

const slotsLiteral = BUILDING_SLOTS.map((s) =>
  `  { id: '${s.id}', centerX: ${s.centerX}, unlockStage: ${s.unlockStage}, labelYPercent: ${s.labelYPercent}, groundBottomPercent: ${s.groundBottomPercent}, widthPercent: ${s.widthPercent} },`,
).join('\n')

const unlockLiteral = BUILDING_SLOT_ORDER.map(
  (id) => `  ${id.includes('-') ? `'${id}'` : id}: ${BUILDING_UNLOCK_STAGE[id]},`,
).join('\n')

const hintsLiteral = BUILDING_SLOT_ORDER.map(
  (id) => `  ${id.includes('-') ? `'${id}'` : id}: '${hints[id]}',`,
).join('\n')

const ts = `/** Panorama IA — Havre des Brumes (${PANORAMA_WIDTH}×${PANORAMA_HEIGHT}). Généré par scripts/sync-village-map.mjs */
export const PANORAMA_WIDTH = ${PANORAMA_WIDTH}
export const PANORAMA_HEIGHT = ${PANORAMA_HEIGHT}

export const PANORAMA_BASE_ASSET = '/village/panorama-base.webp'

export const BUILDING_SLOT_ORDER = [
${BUILDING_SLOT_ORDER.map((id) => `  '${id}',`).join('\n')}
] as const

export const BUILDING_UNLOCK_STAGE: Record<string, number> = {
${unlockLiteral}
}

/** 8 emplacements prévus — 800 px par section, gauche → droite. */
export const BUILDING_SLOTS = [
${slotsLiteral}
] as const

export type BuildingMapSlot = (typeof BUILDING_SLOTS)[number]

export const buildingAsset = (id: string) => \`/village/buildings-map/\${id}.png\`

export const buildingLevelTier = (level: number) => {
  if (level >= 7) return 3
  if (level >= 4) return 2
  return 1
}

export const getPanoramaRevealRatio = (stage: number) => {
  let lastIndex = -1
  for (let i = 0; i < BUILDING_SLOT_ORDER.length; i += 1) {
    const id = BUILDING_SLOT_ORDER[i]
    if (stage >= (BUILDING_UNLOCK_STAGE[id] ?? 0)) lastIndex = i
  }
  if (lastIndex < 0) return 0.28
  return Math.min(1, (lastIndex + 1.25) / BUILDING_SLOT_ORDER.length)
}

export const getPanoramaFocusPercent = (stage: number) => {
  let lastSlot: BuildingMapSlot = BUILDING_SLOTS[0]
  for (const slot of BUILDING_SLOTS) {
    if (stage >= slot.unlockStage) lastSlot = slot
  }
  return (lastSlot.centerX / PANORAMA_WIDTH) * 100
}

export const panoramaStageAsset = (_stage: number) => PANORAMA_BASE_ASSET

export const panoramaLegacyAsset = '/village/panorama-v1.png'

export const BUILDING_MAP_HINTS: Record<string, string> = {
${hintsLiteral}
}

export const MAP_LABEL_SPOTS = BUILDING_SLOTS.map((slot) => ({
  id: \`map-\${slot.id}\`,
  buildingId: slot.id,
  x: (slot.centerX / PANORAMA_WIDTH) * 100,
  y: slot.labelYPercent,
  hint: BUILDING_MAP_HINTS[slot.id] ?? '',
  targetView: 'miniGames' as const,
}))
`

writeFileSync(join(root, 'src', 'data', 'villageMap.ts'), ts)
console.log(`Synced src/data/villageMap.ts (${PANORAMA_WIDTH}×${PANORAMA_HEIGHT})`)
