import {
  DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS,
  DISGAEA_WHEEL_CALIBRATION_LAYERS,
  DISGAEA_WHEEL_CALIBRATION_STORAGE_KEY,
  mergeDisgaeaWheelCalibration,
  type DisgaeaWheelCalibrationLayerId,
  type DisgaeaWheelLayoutCalibration,
} from './disgaeaWheelLayoutCalibration.ts'
import { createDefaultHavreWheelCalibration } from './havreWheelLayoutCalibration.ts'
import shippedSceneLayoutUser from './destinyWheelSceneLayoutUser.json'

export const DESTINY_WHEEL_SCENE_CALIBRATION_STORAGE_KEY =
  'idle-isekai-destiny-wheel-scene-layout-calibration'

export type SceneCalLayer = {
  visible: boolean
  x: number
  y: number
  scale: number
  rotate: number
  /** Largeur explicite en cqw — bulles / panneaux texte */
  widthCqw?: number
  /** Hauteur explicite en cqh — bulles dialogue */
  heightCqh?: number
}

export type SceneDialogueBubbleMode = 'laharl' | 'lane'

export type DestinyWheelSceneLayoutCalibration = {
  version: 1
  wheel: DisgaeaWheelLayoutCalibration
  havreWheel: DisgaeaWheelLayoutCalibration
  laharl: SceneCalLayer
  etna: SceneCalLayer
  flonne: SceneCalLayer
  currentCase: SceneCalLayer
  laharlBubble: SceneCalLayer
  commentBubbleLane: SceneCalLayer
  packSwitcher: SceneCalLayer
  spinnerHint: SceneCalLayer
}

export const DESTINY_WHEEL_SCENE_LAYERS = [
  'laharl',
  'etna',
  'flonne',
  'currentCase',
  'laharlBubble',
  'commentBubbleLane',
  'packSwitcher',
  'spinnerHint',
] as const

export type DestinyWheelSceneLayerId = (typeof DESTINY_WHEEL_SCENE_LAYERS)[number]

export const DESTINY_WHEEL_SCENE_LAYER_LABELS: Record<DestinyWheelSceneLayerId, string> = {
  laharl: 'Laharl (portrait)',
  etna: 'Etna (portrait)',
  flonne: 'Flonne (portrait)',
  currentCase: 'Zone « case en cours »',
  laharlBubble: 'Bulle dialogue Laharl',
  commentBubbleLane: 'Bulle dialogue droite',
  packSwitcher: 'Sélecteur de pack',
  spinnerHint: 'Message free spin / hint',
}

export type DestinyWheelLayoutLayerId = DisgaeaWheelCalibrationLayerId | DestinyWheelSceneLayerId

export const DESTINY_WHEEL_LAYOUT_LAYER_LABELS: Record<DestinyWheelLayoutLayerId, string> = {
  ...DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS,
  ...DESTINY_WHEEL_SCENE_LAYER_LABELS,
}

/** Layout calibré manuellement — source prod + reset dev. */
export const SHIPPED_DESTINY_WHEEL_SCENE_LAYOUT = shippedSceneLayoutUser as DestinyWheelSceneLayoutCalibration

export function getShippedDestinyWheelSceneLayout(): DestinyWheelSceneLayoutCalibration {
  return structuredClone(SHIPPED_DESTINY_WHEEL_SCENE_LAYOUT)
}

export function createDefaultDestinyWheelSceneCalibration(): DestinyWheelSceneLayoutCalibration {
  return getShippedDestinyWheelSceneLayout()
}

export function mergeDestinyWheelSceneCalibration(
  base: DestinyWheelSceneLayoutCalibration,
  patch: Partial<DestinyWheelSceneLayoutCalibration>,
): DestinyWheelSceneLayoutCalibration {
  return {
    version: 1,
    wheel: mergeDisgaeaWheelCalibration(base.wheel, patch.wheel ?? {}),
    havreWheel: mergeDisgaeaWheelCalibration(
      base.havreWheel ?? createDefaultHavreWheelCalibration(),
      patch.havreWheel ?? {},
    ),
    laharl: { ...base.laharl, ...patch.laharl },
    etna: { ...base.etna, ...patch.etna },
    flonne: { ...base.flonne, ...patch.flonne },
    currentCase: { ...base.currentCase, ...patch.currentCase },
    laharlBubble: { ...base.laharlBubble, ...patch.laharlBubble },
    commentBubbleLane: { ...base.commentBubbleLane, ...patch.commentBubbleLane },
    packSwitcher: { ...base.packSwitcher, ...patch.packSwitcher },
    spinnerHint: { ...base.spinnerHint, ...patch.spinnerHint },
  }
}

export function loadDestinyWheelSceneCalibration(): DestinyWheelSceneLayoutCalibration {
  const shipped = getShippedDestinyWheelSceneLayout()
  if (typeof localStorage === 'undefined') return shipped
  try {
    const raw = localStorage.getItem(DESTINY_WHEEL_SCENE_CALIBRATION_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<DestinyWheelSceneLayoutCalibration>
      if (parsed.version === 1) {
        const merged = mergeDestinyWheelSceneCalibration(shipped, parsed)
        // Valeurs prod figées dans destinyWheelSceneLayoutUser.json (évite drift localStorage).
        merged.currentCase = { ...shipped.currentCase }
        merged.havreWheel = { ...shipped.havreWheel }
        return merged
      }
    }
    const legacy = localStorage.getItem(DISGAEA_WHEEL_CALIBRATION_STORAGE_KEY)
    if (legacy) {
      const parsed = JSON.parse(legacy) as Partial<DisgaeaWheelLayoutCalibration>
      if (parsed.version === 1) {
        return mergeDestinyWheelSceneCalibration(shipped, {
          wheel: mergeDisgaeaWheelCalibration(shipped.wheel, parsed),
        })
      }
    }
  } catch {
    /* ignore */
  }
  return shipped
}

export function saveDestinyWheelSceneCalibration(cal: DestinyWheelSceneLayoutCalibration): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(DESTINY_WHEEL_SCENE_CALIBRATION_STORAGE_KEY, JSON.stringify(cal, null, 2))
}

export function sceneLayerTransform(layer: SceneCalLayer): string {
  return `translate(${layer.x}%, ${layer.y}%) scale(${layer.scale}) rotate(${layer.rotate}deg)`
}

export function sceneDialogueBubbleStyle(
  layer: SceneCalLayer | undefined,
  mode: SceneDialogueBubbleMode,
): import('react').CSSProperties | undefined {
  if (!layer) return undefined
  if (!layer.visible) return { display: 'none' }

  const widthCqw = layer.widthCqw ?? (mode === 'laharl' ? 52 : 38)
  const heightCqh = layer.heightCqh ?? (mode === 'laharl' ? 16 : 22)

  if (mode === 'laharl') {
    return {
      ['--dw-bubble-w' as string]: `${widthCqw}cqw`,
      ['--dw-bubble-h' as string]: `${heightCqh}cqh`,
      ['--dw-bubble-left' as string]: `calc(8cqw + ${layer.x}cqw)`,
      ['--dw-bubble-bottom' as string]: `calc(36cqh + ${layer.y}cqh)`,
      ['--dw-bubble-scale' as string]: String(layer.scale),
      ['--dw-bubble-rotate' as string]: `${layer.rotate}deg`,
    }
  }

  return {
    ['--dw-bubble-w' as string]: `${widthCqw}cqw`,
    ['--dw-bubble-h' as string]: `${heightCqh}cqh`,
    ['--dw-bubble-right' as string]: `calc(33cqw - ${layer.x}cqw)`,
    ['--dw-bubble-top' as string]: `calc(50cqh + ${layer.y}cqh)`,
    ['--dw-bubble-scale' as string]: String(layer.scale),
    ['--dw-bubble-rotate' as string]: `${layer.rotate}deg`,
  }
}

export function scenePanelStyle(layer: SceneCalLayer | undefined): import('react').CSSProperties | undefined {
  if (!layer) return undefined
  if (!layer.visible) return { display: 'none' }
  const style: import('react').CSSProperties = {
    position: 'absolute',
    left: `${layer.x}cqw`,
    top: `${layer.y}cqh`,
    transform: `scale(${layer.scale}) rotate(${layer.rotate}deg)`,
    transformOrigin: 'top left',
  }
  if (layer.widthCqw != null && layer.widthCqw > 0) {
    style.width = `${layer.widthCqw}cqw`
    style.maxWidth = `${layer.widthCqw}cqw`
    style.minWidth = 0
    style.boxSizing = 'border-box'
  }
  if (layer.heightCqh != null && layer.heightCqh > 0) {
    ;(style as Record<string, string>)['--dw-case-panel-h'] = `${layer.heightCqh}cqh`
  }
  return style
}

export const DIALOGUE_BUBBLE_SCENE_LAYERS = ['laharlBubble', 'commentBubbleLane'] as const
export type DialogueBubbleSceneLayerId = (typeof DIALOGUE_BUBBLE_SCENE_LAYERS)[number]

export function isDialogueBubbleSceneLayer(id: string): id is DialogueBubbleSceneLayerId {
  return (DIALOGUE_BUBBLE_SCENE_LAYERS as readonly string[]).includes(id)
}

export function exportDestinyWheelSceneCalibrationJson(cal: DestinyWheelSceneLayoutCalibration): string {
  return JSON.stringify(cal, null, 2)
}

export function parseDestinyWheelSceneCalibrationJson(raw: string): DestinyWheelSceneLayoutCalibration {
  const parsed = JSON.parse(raw) as Partial<DestinyWheelSceneLayoutCalibration>
  return mergeDestinyWheelSceneCalibration(getShippedDestinyWheelSceneLayout(), parsed)
}

export { DISGAEA_WHEEL_CALIBRATION_LAYERS }
