import type { ResourceKey } from './buildingActivities'
import type { WorksiteBiomeId, WorksiteSpotId } from './myrionWorksiteDefs'
import { WORKSITE_RUNTIME_BIOMES, WORKSITE_RUNTIME_SPOT_BY_KEY } from './myrionWorksiteBiomeRuntime'
import { isWorksiteAssetAvailable } from './myrionWorksiteAssetRegistry'
import { publicAssetUrl } from './publicAssetUrl'

/** Racine servie par Vite — voir docs/MYRION_WORKSITE_ASSET_PIPELINE.md */
export const MYRION_WORKSITE_ASSET_ROOT = publicAssetUrl('assets/minigames/myrion-worksite')

export type WorksiteVisualAsset = {
  /** Chemin public relatif à la racine du site. */
  path: string
  /**
   * Quand false, aucun `<img>` n'est rendu — placeholder CSS uniquement.
   * Passer à true une fois le PNG validé et commité.
   */
  available: boolean
  /** Classe CSS fallback (gradient, icône, etc.). */
  placeholderClass: string
}

export type WorksiteBiomeVisualId = WorksiteBiomeId | 'faille-astrale'

export type WorksiteBiomeVisual = {
  id: WorksiteBiomeVisualId
  background: WorksiteVisualAsset
  /** Classe appliquée sur la scène quand ce biome est actif (supervision). */
  supervisedSceneClass: string
}

/** Spots gameplay — legacy + extension MVP 14 (fallback dynamique). */
export type WorksiteSpotVisualId = WorksiteSpotId | 'faille-astrale'

export type WorksiteSpotVisual = {
  id: WorksiteSpotVisualId
  asset: WorksiteVisualAsset
  cardClass: string
  objectClass: string
}

/** Ressources gameplay + futures (icônes documentées, pas d'économie). */
export type WorksiteResourceIconId =
  | ResourceKey
  | 'herbs'
  | 'water'
  | 'ore'
  | 'coal'
  | 'crystal'
  | 'ancient-fragment'
  | 'astral-ore'

export type WorksiteResourceIconVisual = {
  id: WorksiteResourceIconId
  asset: WorksiteVisualAsset
  fallbackEmoji: string
}

export type WorksiteUiState = 'spot-locked' | 'spot-active' | 'spot-supervised' | 'biome-locked' | 'assignment-slot'

export type WorksiteUiVisual = {
  id: WorksiteUiState
  asset: WorksiteVisualAsset
}

function asset(
  subdir: string,
  filename: string,
  placeholderClass: string,
  available?: boolean,
): WorksiteVisualAsset {
  const relPath = `${subdir}/${filename}`
  const resolvedAvailable = available ?? isWorksiteAssetAvailable(relPath)
  return {
    path: `${MYRION_WORKSITE_ASSET_ROOT}/${subdir}/${filename}`,
    available: resolvedAvailable,
    placeholderClass,
  }
}

export type WorksiteDecorationId =
  | 'rest-zone'
  | 'food-zone'
  | 'small-tent'
  | 'soft-campfire'
  | 'food-basket'
  | 'rest-cushion'
  | 'work-crate'
  | 'soft-lantern'

export type WorksiteDecorationVisual = {
  id: WorksiteDecorationId
  asset: WorksiteVisualAsset
  fallbackEmoji: string
}

export const WORKSITE_DECORATION_VISUALS: Record<WorksiteDecorationId, WorksiteDecorationVisual> = {
  'rest-zone': {
    id: 'rest-zone',
    asset: asset('decorations', 'rest-zone.png', 'mg-worksite-life-zone--rest', true),
    fallbackEmoji: '🛏️',
  },
  'food-zone': {
    id: 'food-zone',
    asset: asset('decorations', 'food-zone.png', 'mg-worksite-life-zone--food', true),
    fallbackEmoji: '🍞',
  },
  'small-tent': {
    id: 'small-tent',
    asset: asset('decorations', 'small-tent.png', 'mg-worksite-life-zone--tent'),
    fallbackEmoji: '⛺',
  },
  'soft-campfire': {
    id: 'soft-campfire',
    asset: asset('decorations', 'soft-campfire.png', 'mg-worksite-life-zone--fire'),
    fallbackEmoji: '🔥',
  },
  'food-basket': {
    id: 'food-basket',
    asset: asset('decorations', 'food-basket.png', 'mg-worksite-life-zone--basket'),
    fallbackEmoji: '🧺',
  },
  'rest-cushion': {
    id: 'rest-cushion',
    asset: asset('decorations', 'rest-cushion.png', 'mg-worksite-life-zone--cushion'),
    fallbackEmoji: '🛋️',
  },
  'work-crate': {
    id: 'work-crate',
    asset: asset('decorations', 'work-crate.png', 'mg-worksite-life-zone--crate'),
    fallbackEmoji: '📦',
  },
  'soft-lantern': {
    id: 'soft-lantern',
    asset: asset('decorations', 'soft-lantern.png', 'mg-worksite-life-zone--lantern'),
    fallbackEmoji: '🏮',
  },
}

export function getWorksiteDecorationVisual(id: WorksiteDecorationId): WorksiteDecorationVisual {
  return WORKSITE_DECORATION_VISUALS[id]
}

/** Fonds de biome — 3 legacy + 12 extension MVP 15 via registry. */
const CORE_BIOME_VISUALS: Record<string, WorksiteBiomeVisual> = {
  'prairie-chantier': {
    id: 'prairie-chantier',
    background: asset('backgrounds', 'prairie.png', 'mg-worksite-bg--prairie'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
  'foret-douce': {
    id: 'foret-douce',
    background: asset('backgrounds', 'forest.png', 'mg-worksite-bg--foret'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
  'mine-tranquille': {
    id: 'mine-tranquille',
    background: asset('backgrounds', 'mine.png', 'mg-worksite-bg--mine'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
  'faille-astrale': {
    id: 'faille-astrale',
    background: asset('backgrounds', 'astral.png', 'mg-worksite-bg--astral'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
}

const EXTENDED_BIOME_VISUALS: Partial<Record<WorksiteBiomeId, WorksiteBiomeVisual>> = Object.fromEntries(
  Object.entries(WORKSITE_RUNTIME_BIOMES)
    .filter(([id]) => !(id in CORE_BIOME_VISUALS))
    .map(([id, meta]) => {
      const filename = meta.backgroundAssetKey.split('/').pop() ?? 'extended.png'
      return [
        id,
        {
          id: id as WorksiteBiomeId,
          background: asset('backgrounds', filename, meta.backgroundPlaceholderClass),
          supervisedSceneClass: 'mg-worksite-biome--supervised',
        } satisfies WorksiteBiomeVisual,
      ]
    }),
)

export const WORKSITE_BIOME_VISUALS = {
  ...CORE_BIOME_VISUALS,
  ...EXTENDED_BIOME_VISUALS,
} as Record<WorksiteBiomeVisualId, WorksiteBiomeVisual>

export const WORKSITE_SPOT_VISUALS: Record<WorksiteSpotVisualId, WorksiteSpotVisual> = {
  bosquet: {
    id: 'bosquet',
    asset: asset('spots', 'bosquet.png', 'mg-worksite-spot-object--bosquet'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--bosquet',
  },
  pierrier: {
    id: 'pierrier',
    asset: asset('spots', 'pierrier.png', 'mg-worksite-spot-object--pierrier'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--pierrier',
  },
  champs: {
    id: 'champs',
    asset: asset('spots', 'champs.png', 'mg-worksite-spot-object--champs'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--champs',
  },
  'sous-bois': {
    id: 'sous-bois',
    asset: asset('spots', 'sous-bois.png', 'mg-worksite-spot-object--sous-bois'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--sous-bois',
  },
  'clairiere-herbes': {
    id: 'clairiere-herbes',
    asset: asset('spots', 'clairiere-herbes.png', 'mg-worksite-spot-object--clairiere-herbes'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--clairiere-herbes',
  },
  'source-claire': {
    id: 'source-claire',
    asset: asset('spots', 'source-claire.png', 'mg-worksite-spot-object--source-claire'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--source-claire',
  },
  'pierrier-profond': {
    id: 'pierrier-profond',
    asset: asset('spots', 'pierrier-profond.png', 'mg-worksite-spot-object--pierrier-profond'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--pierrier-profond',
  },
  'veine-brute': {
    id: 'veine-brute',
    asset: asset('spots', 'veine-brute.png', 'mg-worksite-spot-object--veine-brute'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--veine-brute',
  },
  charbonniere: {
    id: 'charbonniere',
    asset: asset('spots', 'charbonniere.png', 'mg-worksite-spot-object--charbonniere'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--charbonniere',
  },
  'faille-astrale': {
    id: 'faille-astrale',
    asset: asset('spots', 'faille-astrale.png', 'mg-worksite-spot-object--faille-astrale'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--faille-astrale',
  },
}

/** Spots extension MVP 14 — chemins catalogue + disponibilité registry MVP 15. */
const RUNTIME_SPOT_VISUALS: Record<string, WorksiteSpotVisual> = Object.fromEntries(
  Object.values(WORKSITE_RUNTIME_SPOT_BY_KEY).map((meta) => {
    const filename = meta.assetKey.split('/').pop() ?? 'generic.png'
    const placeholder = meta.placeholderClass
    return [
      meta.spotId,
      {
        id: meta.spotId as WorksiteSpotVisualId,
        asset: asset('spots', filename, placeholder),
        cardClass: 'mg-worksite-spot-card',
        objectClass: `mg-worksite-spot-object ${placeholder}`,
      } satisfies WorksiteSpotVisual,
    ]
  }),
)

export const WORKSITE_RESOURCE_ICON_VISUALS: Record<WorksiteResourceIconId, WorksiteResourceIconVisual> = {
  wood: {
    id: 'wood',
    asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood', true),
    fallbackEmoji: '🪵',
  },
  stone: {
    id: 'stone',
    asset: asset('icons', 'stone.png', 'mg-worksite-resource-icon--stone', true),
    fallbackEmoji: '🪨',
  },
  food: {
    id: 'food',
    asset: asset('icons', 'food.png', 'mg-worksite-resource-icon--food', true),
    fallbackEmoji: '🌾',
  },
  herbs: {
    id: 'herbs',
    asset: asset('icons', 'herbs.png', 'mg-worksite-resource-icon--herbs', true),
    fallbackEmoji: '🌿',
  },
  water: {
    id: 'water',
    asset: asset('icons', 'water.png', 'mg-worksite-resource-icon--water', true),
    fallbackEmoji: '💧',
  },
  ore: {
    id: 'ore',
    asset: asset('icons', 'ore.png', 'mg-worksite-resource-icon--ore', true),
    fallbackEmoji: '⛏️',
  },
  coal: {
    id: 'coal',
    asset: asset('icons', 'coal.png', 'mg-worksite-resource-icon--coal', true),
    fallbackEmoji: '🪨',
  },
  crystal: {
    id: 'crystal',
    asset: asset('icons', 'crystal.png', 'mg-worksite-resource-icon--crystal'),
    fallbackEmoji: '💎',
  },
  'ancient-fragment': {
    id: 'ancient-fragment',
    asset: asset('icons', 'ancient-fragment.png', 'mg-worksite-resource-icon--ancient-fragment'),
    fallbackEmoji: '🏛️',
  },
  'astral-ore': {
    id: 'astral-ore',
    asset: asset('icons', 'astral-ore.png', 'mg-worksite-resource-icon--astral-ore'),
    fallbackEmoji: '✨',
  },
  coins: { id: 'coins', asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'), fallbackEmoji: '🪙' },
  silk: { id: 'silk', asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'), fallbackEmoji: '🧵' },
  mana: { id: 'mana', asset: asset('icons', 'crystal.png', 'mg-worksite-resource-icon--crystal'), fallbackEmoji: '✨' },
  renown: { id: 'renown', asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'), fallbackEmoji: '⭐' },
  ingredients: { id: 'ingredients', asset: asset('icons', 'herbs.png', 'mg-worksite-resource-icon--herbs'), fallbackEmoji: '🧪' },
  crystals: { id: 'crystals', asset: asset('icons', 'crystal.png', 'mg-worksite-resource-icon--crystal'), fallbackEmoji: '💎' },
  gifts: { id: 'gifts', asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'), fallbackEmoji: '🎁' },
  tickets: { id: 'tickets', asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'), fallbackEmoji: '🎫' },
  stardust: { id: 'stardust', asset: asset('icons', 'astral-ore.png', 'mg-worksite-resource-icon--astral-ore'), fallbackEmoji: '🌟' },
}

export const WORKSITE_UI_VISUALS: Record<WorksiteUiState, WorksiteUiVisual> = {
  'spot-locked': {
    id: 'spot-locked',
    asset: asset('ui', 'spot-locked.png', 'mg-worksite-spot--locked'),
  },
  'spot-active': {
    id: 'spot-active',
    asset: asset('ui', 'spot-active.png', 'mg-worksite-spot--active'),
  },
  'spot-supervised': {
    id: 'spot-supervised',
    asset: asset('ui', 'spot-supervised.png', 'mg-worksite-spot--supervised'),
  },
  'biome-locked': {
    id: 'biome-locked',
    asset: asset('ui', 'biome-locked.png', 'mg-worksite-biome--locked'),
  },
  'assignment-slot': {
    id: 'assignment-slot',
    asset: asset('ui', 'assignment-slot.png', 'mg-worksite-assignment-slot'),
  },
}

export function getWorksiteBiomeVisual(biomeId: WorksiteBiomeId): WorksiteBiomeVisual {
  const visual = WORKSITE_BIOME_VISUALS[biomeId as WorksiteBiomeVisualId]
  if (visual) return visual
  const meta = WORKSITE_RUNTIME_BIOMES[biomeId]
  return {
    id: biomeId,
    background: asset('backgrounds', 'extended.png', meta.backgroundPlaceholderClass),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  }
}

function fallbackSpotVisual(spotId: WorksiteSpotId): WorksiteSpotVisual {
  const meta = Object.values(WORKSITE_RUNTIME_SPOT_BY_KEY).find((entry) => entry.spotId === spotId)
  const placeholder = meta?.placeholderClass ?? 'mg-worksite-spot-object--generic'
  const filename = meta?.assetKey.split('/').pop() ?? 'generic.png'
  return {
    id: spotId,
    asset: asset('spots', filename, placeholder, false),
    cardClass: 'mg-worksite-spot-card',
    objectClass: `mg-worksite-spot-object ${placeholder}`,
  }
}

export function getWorksiteSpotVisual(spotId: WorksiteSpotId): WorksiteSpotVisual {
  const known = WORKSITE_SPOT_VISUALS[spotId as WorksiteSpotVisualId]
  if (known) return known
  const runtime = RUNTIME_SPOT_VISUALS[spotId]
  if (runtime) return runtime
  return fallbackSpotVisual(spotId)
}

export function getWorksiteResourceIconVisual(
  resourceId: ResourceKey,
): WorksiteResourceIconVisual {
  return (
    WORKSITE_RESOURCE_ICON_VISUALS[resourceId as WorksiteResourceIconId] ?? {
      id: resourceId as WorksiteResourceIconId,
      asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'),
      fallbackEmoji: '📦',
    }
  )
}

/** Classes scène = placeholder legacy MVP 2 + fond visuel config. */
export function worksiteSceneClassNames(
  biomeId: WorksiteBiomeId,
  supervised: boolean,
  legacyPanoramaClass: string,
): string {
  const visual = getWorksiteBiomeVisual(biomeId)
  const parts = [
    'mg-worksite-scene',
    'mg-worksite-biome-bg',
    legacyPanoramaClass,
    visual.background.placeholderClass,
  ]
  if (supervised) parts.push(visual.supervisedSceneClass)
  return parts.join(' ')
}

export function worksiteSpotMarkerClassNames(
  spotId: WorksiteSpotId,
  selected: boolean,
  locked: boolean,
): string {
  const visual = getWorksiteSpotVisual(spotId)
  const parts = ['mg-worksite-marker', visual.cardClass]
  if (locked) parts.push(WORKSITE_UI_VISUALS['spot-locked'].asset.placeholderClass)
  if (selected) {
    parts.push('active', WORKSITE_UI_VISUALS['spot-active'].asset.placeholderClass)
  }
  return parts.join(' ')
}

export function worksiteSpotObjectClassNames(spotId: WorksiteSpotId): string {
  const visual = getWorksiteSpotVisual(spotId)
  return [visual.objectClass, visual.asset.placeholderClass].join(' ')
}
