export const COMPANION_ASSET_ROOT = '/companions'

export const companionAssetPath = (companionId: string, level = 1) =>
  `${COMPANION_ASSET_ROOT}/${companionId}/affinity-${level}.png`
