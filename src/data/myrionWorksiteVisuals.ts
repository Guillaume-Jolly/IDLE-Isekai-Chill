import type { ResourceKey } from './buildingActivities'
import type { WorksiteBiomeId, WorksiteSpotId } from './myrionWorksite'

/** Racine servie par Vite — voir docs/MYRION_WORKSITE_ASSET_PIPELINE.md */
export const MYRION_WORKSITE_ASSET_ROOT = '/assets/minigames/myrion-worksite'

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

export type WorksiteBiomeVisualId =
  | WorksiteBiomeId
  /** MVP 3 — documentés, pas encore en gameplay. */
  | 'marais-doux'
  | 'cristal-lumineux'
  | 'faille-astrale'

export type WorksiteBiomeVisual = {
  id: WorksiteBiomeVisualId
  background: WorksiteVisualAsset
  /** Classe appliquée sur la scène quand ce biome est actif (supervision). */
  supervisedSceneClass: string
}

/** Spots gameplay MVP 2 + futurs MVP 3 (visuels préparés). */
export type WorksiteSpotVisualId =
  | WorksiteSpotId
  | 'cristalliere'
  | 'ruines-anciennes'
  | 'faille-astrale'

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

function asset(subdir: string, filename: string, placeholderClass: string): WorksiteVisualAsset {
  return {
    path: `${MYRION_WORKSITE_ASSET_ROOT}/${subdir}/${filename}`,
    available: false,
    placeholderClass,
  }
}

/** Fonds de biome — placeholders CSS tant que les PNG ne sont pas validés. */
export const WORKSITE_BIOME_VISUALS: Record<WorksiteBiomeVisualId, WorksiteBiomeVisual> = {
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
  'marais-doux': {
    id: 'marais-doux',
    background: asset('backgrounds', 'swamp.png', 'mg-worksite-bg--marais'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
  'cristal-lumineux': {
    id: 'cristal-lumineux',
    background: asset('backgrounds', 'crystal.png', 'mg-worksite-bg--cristal'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
  'faille-astrale': {
    id: 'faille-astrale',
    background: asset('backgrounds', 'astral.png', 'mg-worksite-bg--astral'),
    supervisedSceneClass: 'mg-worksite-biome--supervised',
  },
}

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
    asset: asset('spots', 'pierrier.png', 'mg-worksite-spot-object--pierrier-profond'),
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
  cristalliere: {
    id: 'cristalliere',
    asset: asset('spots', 'cristalliere.png', 'mg-worksite-spot-object--cristalliere'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--cristalliere',
  },
  'ruines-anciennes': {
    id: 'ruines-anciennes',
    asset: asset('spots', 'ruines-anciennes.png', 'mg-worksite-spot-object--ruines-anciennes'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--ruines-anciennes',
  },
  'faille-astrale': {
    id: 'faille-astrale',
    asset: asset('spots', 'faille-astrale.png', 'mg-worksite-spot-object--faille-astrale'),
    cardClass: 'mg-worksite-spot-card',
    objectClass: 'mg-worksite-spot-object mg-worksite-spot-object--faille-astrale',
  },
}

export const WORKSITE_RESOURCE_ICON_VISUALS: Record<WorksiteResourceIconId, WorksiteResourceIconVisual> = {
  wood: {
    id: 'wood',
    asset: asset('icons', 'wood.png', 'mg-worksite-resource-icon--wood'),
    fallbackEmoji: '🪵',
  },
  stone: {
    id: 'stone',
    asset: asset('icons', 'stone.png', 'mg-worksite-resource-icon--stone'),
    fallbackEmoji: '🪨',
  },
  food: {
    id: 'food',
    asset: asset('icons', 'food.png', 'mg-worksite-resource-icon--food'),
    fallbackEmoji: '🌾',
  },
  herbs: {
    id: 'herbs',
    asset: asset('icons', 'herbs.png', 'mg-worksite-resource-icon--herbs'),
    fallbackEmoji: '🌿',
  },
  water: {
    id: 'water',
    asset: asset('icons', 'water.png', 'mg-worksite-resource-icon--water'),
    fallbackEmoji: '💧',
  },
  ore: {
    id: 'ore',
    asset: asset('icons', 'ore.png', 'mg-worksite-resource-icon--ore'),
    fallbackEmoji: '⛏️',
  },
  coal: {
    id: 'coal',
    asset: asset('icons', 'coal.png', 'mg-worksite-resource-icon--coal'),
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
  return WORKSITE_BIOME_VISUALS[biomeId]
}

export function getWorksiteSpotVisual(spotId: WorksiteSpotId): WorksiteSpotVisual {
  return WORKSITE_SPOT_VISUALS[spotId]
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
