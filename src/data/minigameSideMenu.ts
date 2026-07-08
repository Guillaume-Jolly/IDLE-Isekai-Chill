/** Groupes standard du rail mini-jeu (ordre d'affichage). */
export const MINIGAME_DRAWER_GROUP_ORDER = [
  'system',
  'gameplay',
  'interactive',
  'decor',
  'dev',
] as const

export type MinigameDrawerGroupId = (typeof MINIGAME_DRAWER_GROUP_ORDER)[number]

export const MINIGAME_DRAWER_GROUP_LABELS: Record<MinigameDrawerGroupId, string> = {
  system: 'Système',
  gameplay: 'Gameplay',
  interactive: 'Interactif',
  decor: 'Décor',
  dev: 'Debug',
}

/** IDs réservés — panneaux génériques injectés par MinigameSideMenuShell. */
export const MINIGAME_STANDARD_DRAWER_IDS = {
  info: '__mg-info__',
  params: '__mg-params__',
  debug: '__mg-debug__',
} as const

export type MinigameStandardDrawerId =
  (typeof MINIGAME_STANDARD_DRAWER_IDS)[keyof typeof MINIGAME_STANDARD_DRAWER_IDS]
