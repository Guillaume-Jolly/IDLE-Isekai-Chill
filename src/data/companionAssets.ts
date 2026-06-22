export const COMPANION_ASSET_ROOT = '/companions'

export const companionAssetPath = (companionId: string, level = 1) =>
  `${COMPANION_ASSET_ROOT}/${companionId}/affinity-${level}.png`

export const companionChibiPath = (companionId: string) =>
  `${COMPANION_ASSET_ROOT}/${companionId}/chibi.png`

/** Compagnons avec un vrai fichier chibi.png (miniatures inventaire). */
export const COMPANIONS_WITH_CHIBI = new Set(['talia'])

/** Miniature : chibi si dispo, sinon portrait affinity de base. */
export const companionMiniaturePath = (companionId: string, level = 1) =>
  COMPANIONS_WITH_CHIBI.has(companionId)
    ? companionChibiPath(companionId)
    : companionAssetPath(companionId, level)
