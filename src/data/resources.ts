/** Economie des ressources — role et sinks principaux. */

export type ResourceKey =
  | 'coins'
  | 'wood'
  | 'stone'
  | 'food'
  | 'silk'
  | 'mana'
  | 'renown'
  | 'ingredients'
  | 'crystals'
  | 'gifts'
  | 'tickets'
  | 'stardust'

export type Cost = Partial<Record<ResourceKey, number>>

export const RESOURCE_KEYS: ResourceKey[] = [
  'coins',
  'wood',
  'stone',
  'food',
  'silk',
  'mana',
  'renown',
  'ingredients',
  'crystals',
  'gifts',
  'tickets',
  'stardust',
]

export const RESOURCE_LABELS: Record<ResourceKey, string> = {
  coins: 'Pieces',
  wood: 'Bois',
  stone: 'Pierre',
  food: 'Vivres',
  silk: 'Soie',
  mana: 'Mana',
  renown: 'Renom',
  ingredients: 'Ingredients',
  crystals: 'Cristaux',
  gifts: 'Cadeaux',
  tickets: 'Tickets',
  stardust: 'Poussiere stellaire',
}

export const RESOURCE_ICONS: Record<ResourceKey, string> = {
  coins: '💰',
  wood: '🌲',
  stone: '🧱',
  food: '🍞',
  silk: '🧵',
  mana: '✨',
  renown: '👑',
  ingredients: '🌿',
  crystals: '💎',
  gifts: '🎁',
  tickets: '🎟️',
  stardust: '🌠',
}

/** A quoi sert chaque ressource dans le core gameplay. */
export const RESOURCE_ROLES: Record<ResourceKey, string> = {
  coins: 'Ameliorations batiments, entrainement compagnons',
  wood: 'Ameliorations batiments (auberge, jardin, ferme)',
  stone: 'Ameliorations batiments (source, bibliotheque, marche)',
  food: 'Entrainement compagnons, quetes cuisine',
  silk: 'Monter l affinite, atelier rubans',
  mana: 'Entrainement, conversations intimes, magie',
  renown: 'Affinite, theatre, quetes prestige',
  ingredients: 'Entrainement avance, quetes jardin/cuisine',
  crystals: 'Marche etoiles (ameliorations haut niveau), gacha',
  gifts: 'Affinite, entrainement, cadeaux preferes',
  tickets: 'Gacha festival',
  stardust: 'Conversations intimes, ferme lunaire, quetes nocturnes',
}

export const emptyResources = (): Record<ResourceKey, number> =>
  Object.fromEntries(RESOURCE_KEYS.map((key) => [key, 0])) as Record<ResourceKey, number>
