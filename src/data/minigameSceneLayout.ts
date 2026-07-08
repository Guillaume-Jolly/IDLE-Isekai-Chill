export type MinigameSceneLayerGroup = 'gameplay' | 'interactive' | 'decor' | 'ui'

export type MinigameSceneLayerDef = {
  id: string
  label: string
  group: MinigameSceneLayerGroup
}

export const MINIGAME_SCENE_LAYER_GROUP_LABELS: Record<MinigameSceneLayerGroup, string> = {
  gameplay: 'Gameplay',
  interactive: 'Interactif',
  decor: 'Décor',
  ui: 'Interface',
}

export type MinigameSceneLayerTransform = {
  x: number
  y: number
  scale: number
  rotate: number
}

export type MinigameSceneLayoutCalibration = Record<string, MinigameSceneLayerTransform>

export function createDefaultSceneLayoutCalibration(
  layers: readonly MinigameSceneLayerDef[],
): MinigameSceneLayoutCalibration {
  return Object.fromEntries(
    layers.map((layer) => [layer.id, { x: 0, y: 0, scale: 1, rotate: 0 }]),
  )
}

function storageKey(minigameId: string) {
  return `minigame-scene-layout:${minigameId}`
}

export function loadMinigameSceneLayoutCalibration(
  minigameId: string,
  layers: readonly MinigameSceneLayerDef[],
): MinigameSceneLayoutCalibration {
  const defaults = createDefaultSceneLayoutCalibration(layers)
  if (typeof window === 'undefined') return defaults
  try {
    const raw = window.localStorage.getItem(storageKey(minigameId))
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as MinigameSceneLayoutCalibration
    return { ...defaults, ...parsed }
  } catch {
    return defaults
  }
}

export function saveMinigameSceneLayoutCalibration(
  minigameId: string,
  calibration: MinigameSceneLayoutCalibration,
) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(storageKey(minigameId), JSON.stringify(calibration, null, 2))
}

export function exportMinigameSceneLayoutJson(calibration: MinigameSceneLayoutCalibration) {
  return JSON.stringify(calibration, null, 2)
}

export function parseMinigameSceneLayoutJson(raw: string): MinigameSceneLayoutCalibration {
  return JSON.parse(raw) as MinigameSceneLayoutCalibration
}

/** Style inline appliqué sur `[data-mg-layout-layer="…"]`. */
export function sceneLayoutLayerStyle(
  transform: MinigameSceneLayerTransform | undefined,
): Record<string, string | number> {
  const layer = transform ?? { x: 0, y: 0, scale: 1, rotate: 0 }
  return {
    transform: `translate(${layer.x}%, ${layer.y}%) scale(${layer.scale}) rotate(${layer.rotate}deg)`,
  }
}
