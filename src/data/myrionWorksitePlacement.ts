/**
 * Placement visuel filons Ferme lunaire — MVP 16.
 * Module feuille : catalogue + runtime uniquement.
 */

import {
  getCatalogBiome,
  getPlacementSlot,
  type WorksiteCatalogBiomeId,
  type WorksitePlacementSlotId,
} from './myrionWorksiteBiomeCatalog'
import { getRuntimeSpotMeta, worksiteRuntimeSpotKey } from './myrionWorksiteBiomeRuntime'
import type { WorksiteBiomeId, WorksiteSpotId } from './myrionWorksiteDefs'

export type WorksiteSpotPlacement = {
  leftPercent: number
  topPercent: number
  scale: number
  zIndex: number
  slotId: WorksitePlacementSlotId
  componentId: string
}

type SlotDelta = {
  xPercent?: number
  yPercent?: number
  mobileXPercent?: number
  mobileYPercent?: number
  scale?: number
}

/** Ajustements par biome × slot (MVP 16 validation wide 2560×960). */
const BIOME_SLOT_DELTAS: Partial<
  Record<WorksiteCatalogBiomeId, Partial<Record<WorksitePlacementSlotId, SlotDelta>>>
> = {
  'prairie-chantier': {
    bottomCenter: { yPercent: -2, mobileYPercent: -1 },
    topLeft: { yPercent: 2 },
    midRight: { yPercent: 4, mobileYPercent: 2 },
  },
  'foret-douce': {
    midLeft: { xPercent: -2 },
    topCenter: { yPercent: 3 },
    bottomCenter: { yPercent: -3 },
  },
  'mine-tranquille': {
    midLeft: { yPercent: 6 },
    topCenter: { yPercent: 4 },
    topRight: { yPercent: 5, xPercent: -2 },
  },
  'marais-lucioles': {
    topLeft: { yPercent: 4 },
    bottomCenter: { yPercent: -4 },
    midRight: { yPercent: 2 },
  },
  'rivage-brumeux': {
    bottomCenter: { yPercent: -6, mobileYPercent: -4 },
    topLeft: { yPercent: 6 },
    topRight: { yPercent: 5 },
  },
  'vergers-suspendus': {
    topCenter: { yPercent: -6, mobileYPercent: -4 },
    topRight: { yPercent: -4 },
    topLeft: { yPercent: -3 },
  },
  'ruines-florales': {
    midLeft: { yPercent: 2 },
    topCenter: { yPercent: -2 },
    topLeft: { scale: 0.05 },
  },
  'grotte-cristalline': {
    topCenter: { yPercent: 2 },
    midLeft: { yPercent: 8 },
    bottomCenter: { yPercent: -5 },
  },
  'desert-cendres-roses': {
    bottomCenter: { yPercent: -5 },
    midLeft: { yPercent: 4 },
    topLeft: { yPercent: 6 },
  },
  'montagne-vents': {
    topCenter: { yPercent: -4 },
    midLeft: { yPercent: 2 },
    topLeft: { yPercent: -2 },
  },
  'lac-etoile': {
    bottomCenter: { yPercent: -4 },
    topRight: { yPercent: 4 },
    topCenter: { yPercent: -2 },
  },
  'bois-automne-eternel': {
    bottomCenter: { yPercent: -3 },
    midLeft: { yPercent: 3 },
    topRight: { yPercent: 2 },
  },
  'jardin-fongique': {
    topCenter: { yPercent: -3 },
    topLeft: { yPercent: -2 },
    midRight: { yPercent: 4 },
  },
  'sanctuaire-astral': {
    topCenter: { yPercent: -5 },
    midLeft: { yPercent: 2 },
    midRight: { yPercent: 2 },
  },
  'ile-celeste': {
    topCenter: { yPercent: -8, mobileYPercent: -6 },
    midRight: { yPercent: -4 },
    bottomCenter: { yPercent: -10, mobileYPercent: -8 },
  },
}

/** Micro-ajustements par spot actif (clé runtime biome:spotId). */
const SPOT_PLACEMENT_OVERRIDES: Partial<Record<string, SlotDelta & { scale?: number; zIndex?: number }>> = {
  'ruines-florales:lierre-ancien': { scale: 0.14, yPercent: 2 },
  'montagne-vents:courants-captifs': { yPercent: -3 },
  'rivage-brumeux:coquillages-nacres': { yPercent: -2 },
  'sanctuaire-astral:fragment-astral': { yPercent: -4 },
}

export type WorksiteBiomeBackgroundFrame = {
  objectPosition: string
}

/** Cadrage fond par biome — complète Worksite.css. */
export const WORKSITE_BIOME_BACKGROUND_FRAMES: Record<WorksiteBiomeId, WorksiteBiomeBackgroundFrame> = {
  'prairie-chantier': { objectPosition: 'center 70%' },
  'foret-douce': { objectPosition: 'center 66%' },
  'mine-tranquille': { objectPosition: 'center 62%' },
  'marais-lucioles': { objectPosition: 'center 68%' },
  'rivage-brumeux': { objectPosition: 'center 74%' },
  'vergers-suspendus': { objectPosition: 'center 64%' },
  'ruines-florales': { objectPosition: 'center 68%' },
  'grotte-cristalline': { objectPosition: 'center 58%' },
  'desert-cendres-roses': { objectPosition: 'center 72%' },
  'montagne-vents': { objectPosition: 'center 56%' },
  'lac-etoile': { objectPosition: 'center 70%' },
  'bois-automne-eternel': { objectPosition: 'center 66%' },
  'jardin-fongique': { objectPosition: 'center 62%' },
  'sanctuaire-astral': { objectPosition: 'center 60%' },
  'ile-celeste': { objectPosition: 'center 55%' },
}

function clampPercent(value: number, min = 6, max = 94): number {
  return Math.min(max, Math.max(min, value))
}

function applyDelta(base: number, delta?: number): number {
  return base + (delta ?? 0)
}

export function resolveWorksiteSpotPlacement(
  biomeId: WorksiteBiomeId,
  spotId: WorksiteSpotId,
  mobile: boolean,
): WorksiteSpotPlacement | null {
  const meta = getRuntimeSpotMeta(biomeId, spotId)
  if (!meta) return null

  const catalog = getCatalogBiome(biomeId)
  const component = catalog.components.find((c) => c.id === meta.componentId)
  if (!component) return null

  const slotId = component.recommendedPlacementSlot
  const slot = getPlacementSlot(biomeId, slotId)
  if (!slot) return null

  const biomeDelta = BIOME_SLOT_DELTAS[biomeId]?.[slotId]
  const spotKey = worksiteRuntimeSpotKey(biomeId, spotId)
  const spotDelta = SPOT_PLACEMENT_OVERRIDES[spotKey]

  const leftPercent = clampPercent(
    applyDelta(mobile ? slot.mobileXPercent ?? slot.xPercent : slot.xPercent, mobile ? biomeDelta?.mobileXPercent ?? biomeDelta?.xPercent : biomeDelta?.xPercent) +
      (spotDelta?.xPercent ?? 0) +
      (mobile ? spotDelta?.mobileXPercent ?? 0 : 0),
  )

  const topPercent = clampPercent(
    applyDelta(mobile ? slot.mobileYPercent ?? slot.yPercent : slot.yPercent, mobile ? biomeDelta?.mobileYPercent ?? biomeDelta?.yPercent : biomeDelta?.yPercent) +
      (spotDelta?.yPercent ?? 0) +
      (mobile ? spotDelta?.mobileYPercent ?? 0 : 0),
    8,
    88,
  )

  const scale = Math.min(
    1.28,
    Math.max(0.88, slot.scale * (1 + (biomeDelta?.scale ?? 0) + (spotDelta?.scale ?? 0))),
  )
  const zIndex = spotDelta?.zIndex ?? Math.round(topPercent + (slotId === 'bottomCenter' ? 5 : 0))

  return {
    leftPercent,
    topPercent,
    scale,
    zIndex,
    slotId,
    componentId: meta.componentId,
  }
}

export function worksiteSpotPlacementStyle(
  placement: WorksiteSpotPlacement,
): { left: string; top: string; zIndex: number; transform: string } {
  return {
    left: `${placement.leftPercent}%`,
    top: `${placement.topPercent}%`,
    zIndex: placement.zIndex,
    transform: `translate(-50%, -50%) scale(${placement.scale})`,
  }
}

export function getWorksiteBiomeBackgroundFrame(biomeId: WorksiteBiomeId): WorksiteBiomeBackgroundFrame {
  return WORKSITE_BIOME_BACKGROUND_FRAMES[biomeId]
}

export function listWorksitePlacementSlotsForBiome(biomeId: WorksiteBiomeId) {
  return getCatalogBiome(biomeId).placementSlots
}
