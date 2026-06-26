/**
 * Couche gameplay Ferme lunaire — MVP 14.
 * Sélectionne 3 composants actifs / biome depuis le catalogue MVP 13.
 * Module feuille : importe uniquement le catalogue (+ types ResourceKey via alias local).
 */

import type { ResourceKey } from './buildingActivities'
import {
  WORKSITE_CATALOG_BIOME_IDS,
  getCatalogBiome,
  getCatalogComponent,
  type WorksiteCatalogBiomeId,
  type WorksiteCatalogResourceId,
} from './myrionWorksiteBiomeCatalog'

/** 3 composants actifs par biome (ordre d’affichage). */
export const WORKSITE_MVP14_ACTIVE_COMPONENTS: Record<
  WorksiteCatalogBiomeId,
  readonly [string, string, string]
> = {
  'prairie-chantier': ['champs-tendres', 'bosquet-clair', 'pierrier-doux'],
  'foret-douce': ['sous-bois-dense', 'clairiere-herbes', 'source-claire'],
  'mine-tranquille': ['pierrier-profond', 'veine-brute', 'charbonniere-calme'],
  'marais-lucioles': ['roseaux-lumineux', 'flaque-fertile', 'champignons-luisants'],
  'rivage-brumeux': ['coquillages-nacres', 'bois-flotte', 'sable-humide'],
  'vergers-suspendus': ['pommiers-flottants', 'graines-dorees', 'fleurs-fruitieres'],
  'ruines-florales': ['pierres-gravees', 'reliques-fleuries', 'lierre-ancien'],
  'grotte-cristalline': ['cristaux-bleutes', 'veine-argentee', 'flaque-souterraine'],
  'desert-cendres-roses': ['dunes-roses', 'cactus-doux', 'oasis-pale'],
  'montagne-vents': ['courants-captifs', 'pierres-hautes', 'pins-tordus'],
  'lac-etoile': ['eau-etoilee', 'galets-lunaires', 'reflets-astraux'],
  'bois-automne-eternel': ['feuilles-dorees', 'bois-roux', 'champignons-ambres'],
  'jardin-fongique': ['gros-champignons', 'spores-douces', 'cristaux-myceliens'],
  'sanctuaire-astral': ['fragment-astral', 'pierre-sacree', 'reliques-anciennes'],
  'ile-celeste': ['nuages-condenses', 'pierres-flottantes', 'cristaux-ciel'],
}

export const WORKSITE_RUNTIME_BIOME_IDS = WORKSITE_CATALOG_BIOME_IDS
export type WorksiteRuntimeBiomeId = WorksiteCatalogBiomeId

const COMPONENT_EMOJI: Record<string, string> = {
  'champs-tendres': '🌾',
  'bosquet-clair': '🍎',
  'pierrier-doux': '🪨',
  'sous-bois-dense': '🍃',
  'clairiere-herbes': '🌿',
  'source-claire': '💧',
  'pierrier-profond': '🪨',
  'veine-brute': '⛏️',
  'charbonniere-calme': '🪨',
  'roseaux-lumineux': '🌿',
  'flaque-fertile': '💧',
  'champignons-luisants': '🍄',
  'coquillages-nacres': '🐚',
  'bois-flotte': '🪵',
  'sable-humide': '🏖️',
  'pommiers-flottants': '🍎',
  'graines-dorees': '🌱',
  'fleurs-fruitieres': '🌸',
  'pierres-gravees': '🪨',
  'reliques-fleuries': '🏛️',
  'lierre-ancien': '🌿',
  'cristaux-bleutes': '💎',
  'veine-argentee': '⛏️',
  'flaque-souterraine': '💧',
  'dunes-roses': '🏜️',
  'cactus-doux': '🌵',
  'oasis-pale': '💧',
  'courants-captifs': '💨',
  'pierres-hautes': '🪨',
  'pins-tordus': '🌲',
  'eau-etoilee': '💧',
  'galets-lunaires': '🪨',
  'reflets-astraux': '✨',
  'feuilles-dorees': '🍂',
  'bois-roux': '🪵',
  'champignons-ambres': '🍄',
  'gros-champignons': '🍄',
  'spores-douces': '🌿',
  'cristaux-myceliens': '💎',
  'fragment-astral': '✨',
  'pierre-sacree': '🪨',
  'reliques-anciennes': '🏛️',
  'nuages-condenses': '☁️',
  'pierres-flottantes': '🪨',
  'cristaux-ciel': '💎',
}

const BIOME_EMOJI: Record<WorksiteRuntimeBiomeId, string> = {
  'prairie-chantier': '🌾',
  'foret-douce': '🌲',
  'mine-tranquille': '⛏️',
  'marais-lucioles': '✨',
  'rivage-brumeux': '🌊',
  'vergers-suspendus': '🍎',
  'ruines-florales': '🏛️',
  'grotte-cristalline': '💎',
  'desert-cendres-roses': '🏜️',
  'montagne-vents': '⛰️',
  'lac-etoile': '🌙',
  'bois-automne-eternel': '🍂',
  'jardin-fongique': '🍄',
  'sanctuaire-astral': '🌟',
  'ile-celeste': '☁️',
}

const BIOME_PANORAMA_CLASS: Record<WorksiteRuntimeBiomeId, string> = {
  'prairie-chantier': 'mg-worksite-scene--prairie',
  'foret-douce': 'mg-worksite-scene--foret',
  'mine-tranquille': 'mg-worksite-scene--mine',
  'marais-lucioles': 'mg-worksite-scene--marais',
  'rivage-brumeux': 'mg-worksite-scene--rivage',
  'vergers-suspendus': 'mg-worksite-scene--vergers',
  'ruines-florales': 'mg-worksite-scene--ruines',
  'grotte-cristalline': 'mg-worksite-scene--cristal',
  'desert-cendres-roses': 'mg-worksite-scene--desert',
  'montagne-vents': 'mg-worksite-scene--montagne',
  'lac-etoile': 'mg-worksite-scene--lac',
  'bois-automne-eternel': 'mg-worksite-scene--automne',
  'jardin-fongique': 'mg-worksite-scene--fongique',
  'sanctuaire-astral': 'mg-worksite-scene--sanctuaire',
  'ile-celeste': 'mg-worksite-scene--ile',
}

/** Mapping catalogue → inventaire global (documenté MVP 14). */
export const CATALOG_RESOURCE_TO_GAMEPLAY: Record<WorksiteCatalogResourceId, ResourceKey> = {
  food: 'food',
  wood: 'wood',
  stone: 'stone',
  herb: 'ingredients',
  water: 'ingredients',
  ore: 'stone',
  coal: 'stone',
  crystal: 'crystals',
  flower: 'ingredients',
  mushroom: 'food',
  sand: 'stone',
  shell: 'stone',
  wind: 'mana',
  astral: 'stardust',
  seed: 'food',
  relic: 'renown',
  ingredients: 'ingredients',
}

export type WorksiteRuntimeSpotMeta = {
  biomeId: WorksiteRuntimeBiomeId
  spotId: string
  componentId: string
  displayName: string
  emoji: string
  resourceId: ResourceKey
  catalogResource: WorksiteCatalogResourceId
  hint: string
  assetKey: string
  placeholderClass: string
}

export type WorksiteRuntimeBiomeMeta = {
  id: WorksiteRuntimeBiomeId
  label: string
  emoji: string
  panoramaClass: string
  spotIds: readonly string[]
  primaryResource: ResourceKey
  description: string
  backgroundAssetKey: string
  backgroundPlaceholderClass: string
}

function spotPlaceholderClass(resourceId: ResourceKey): string {
  return `mg-worksite-spot-object--resource-${resourceId}`
}

function resolveSpotId(biomeId: WorksiteRuntimeBiomeId, componentId: string): string {
  const component = getCatalogComponent(biomeId, componentId)
  return component?.legacyGameplaySpotId ?? componentId
}

function buildSpotMeta(biomeId: WorksiteRuntimeBiomeId, componentId: string): WorksiteRuntimeSpotMeta {
  const component = getCatalogComponent(biomeId, componentId)
  if (!component) {
    throw new Error(`Missing catalog component: ${biomeId}/${componentId}`)
  }
  const spotId = resolveSpotId(biomeId, componentId)
  const resourceId = CATALOG_RESOURCE_TO_GAMEPLAY[component.producedResource]
  return {
    biomeId,
    spotId,
    componentId,
    displayName: component.displayName,
    emoji: COMPONENT_EMOJI[componentId] ?? '📦',
    resourceId,
    catalogResource: component.producedResource,
    hint: component.description,
    assetKey: component.assetKey,
    placeholderClass: spotPlaceholderClass(resourceId),
  }
}

const RUNTIME_SPOT_METAS: WorksiteRuntimeSpotMeta[] = WORKSITE_RUNTIME_BIOME_IDS.flatMap((biomeId) =>
  WORKSITE_MVP14_ACTIVE_COMPONENTS[biomeId].map((componentId) => buildSpotMeta(biomeId, componentId)),
)

export const WORKSITE_RUNTIME_SPOT_BY_KEY: Record<string, WorksiteRuntimeSpotMeta> = Object.fromEntries(
  RUNTIME_SPOT_METAS.map((spot) => [`${spot.biomeId}:${spot.spotId}`, spot]),
)

const BIOME_BG_PLACEHOLDER: Record<WorksiteRuntimeBiomeId, string> = {
  'prairie-chantier': 'mg-worksite-bg--prairie',
  'foret-douce': 'mg-worksite-bg--foret',
  'mine-tranquille': 'mg-worksite-bg--mine',
  'marais-lucioles': 'mg-worksite-bg--marais',
  'rivage-brumeux': 'mg-worksite-bg--rivage',
  'vergers-suspendus': 'mg-worksite-bg--vergers',
  'ruines-florales': 'mg-worksite-bg--ruines',
  'grotte-cristalline': 'mg-worksite-bg--cristal',
  'desert-cendres-roses': 'mg-worksite-bg--desert',
  'montagne-vents': 'mg-worksite-bg--montagne',
  'lac-etoile': 'mg-worksite-bg--lac',
  'bois-automne-eternel': 'mg-worksite-bg--automne',
  'jardin-fongique': 'mg-worksite-bg--fongique',
  'sanctuaire-astral': 'mg-worksite-bg--astral',
  'ile-celeste': 'mg-worksite-bg--ile',
}

export const WORKSITE_RUNTIME_BIOMES = Object.fromEntries(
  WORKSITE_RUNTIME_BIOME_IDS.map((biomeId) => {
    const catalog = getCatalogBiome(biomeId)
    const spotIds = WORKSITE_MVP14_ACTIVE_COMPONENTS[biomeId].map((componentId) =>
      resolveSpotId(biomeId, componentId),
    )
    return [
      biomeId,
      {
        id: biomeId,
        label: catalog.displayName,
        emoji: BIOME_EMOJI[biomeId],
        panoramaClass: BIOME_PANORAMA_CLASS[biomeId],
        spotIds,
        primaryResource: CATALOG_RESOURCE_TO_GAMEPLAY[catalog.primaryResource],
        description: catalog.description,
        backgroundAssetKey: catalog.backgroundAssetKey,
        backgroundPlaceholderClass: BIOME_BG_PLACEHOLDER[biomeId],
      } satisfies WorksiteRuntimeBiomeMeta,
    ]
  }),
) as unknown as Record<WorksiteRuntimeBiomeId, WorksiteRuntimeBiomeMeta>

/** Union de tous les spot IDs gameplay MVP 14. */
export const WORKSITE_ALL_SPOT_IDS = [
  ...new Set(RUNTIME_SPOT_METAS.map((spot) => spot.spotId)),
] as const

export type WorksiteRuntimeSpotId = (typeof WORKSITE_ALL_SPOT_IDS)[number]

export function worksiteRuntimeSpotKey(biomeId: WorksiteRuntimeBiomeId, spotId: string): string {
  return `${biomeId}:${spotId}`
}

export function getRuntimeSpotMeta(
  biomeId: WorksiteRuntimeBiomeId,
  spotId: string,
): WorksiteRuntimeSpotMeta | null {
  return WORKSITE_RUNTIME_SPOT_BY_KEY[worksiteRuntimeSpotKey(biomeId, spotId)] ?? null
}

export function getRuntimeBiomeEntrySpotId(biomeId: WorksiteRuntimeBiomeId): string {
  return WORKSITE_RUNTIME_BIOMES[biomeId].spotIds[0]
}

export function getRuntimeBiomeDefaultSelectedSpotId(biomeId: WorksiteRuntimeBiomeId): string {
  const spots = WORKSITE_RUNTIME_BIOMES[biomeId].spotIds
  return spots[spots.length - 1] ?? spots[0]
}

export function buildDefaultSelectedSpotByBiome(): Record<WorksiteRuntimeBiomeId, string> {
  return Object.fromEntries(
    WORKSITE_RUNTIME_BIOME_IDS.map((biomeId) => [
      biomeId,
      getRuntimeBiomeDefaultSelectedSpotId(biomeId),
    ]),
  ) as Record<WorksiteRuntimeBiomeId, string>
}

export function buildRuntimeBiomeEntrySpots(): Record<WorksiteRuntimeBiomeId, string> {
  return Object.fromEntries(
    WORKSITE_RUNTIME_BIOME_IDS.map((biomeId) => [biomeId, getRuntimeBiomeEntrySpotId(biomeId)]),
  ) as Record<WorksiteRuntimeBiomeId, string>
}

export function mapProducedAmountToResourceTrack(
  resourceId: ResourceKey,
  amount: number,
  totals: { wood: number; stone: number; food: number; ingredients: number },
): void {
  switch (resourceId) {
    case 'wood':
      totals.wood += amount
      break
    case 'stone':
      totals.stone += amount
      break
    case 'food':
      totals.food += amount
      break
    case 'ingredients':
      totals.ingredients += amount
      break
    default:
      break
  }
}
