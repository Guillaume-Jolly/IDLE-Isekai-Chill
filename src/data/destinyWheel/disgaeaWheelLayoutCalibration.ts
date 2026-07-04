import { DISGAEA_WHEEL_LAYOUT } from './wheelVisualAssets.ts'

export const DISGAEA_WHEEL_CALIBRATION_STORAGE_KEY = 'idle-isekai-disgaea-wheel-layout-calibration'

export type DisgaeaWheelCalLayer = {
  x: number
  y: number
  scale: number
  rotate: number
}

export type DisgaeaWheelLayoutCalibration = {
  version: 1
  disc: DisgaeaWheelCalLayer
  frame: DisgaeaWheelCalLayer
  pointerStack: DisgaeaWheelCalLayer
  pointerMobile: DisgaeaWheelCalLayer & {
    topOnFixedPct: number
    hingeY: number
    widthRatio: number
  }
  ticks: DisgaeaWheelCalLayer
}

export const DISGAEA_WHEEL_CALIBRATION_LAYERS = [
  'disc',
  'frame',
  'pointerStack',
  'pointerMobile',
  'ticks',
] as const

export type DisgaeaWheelCalibrationLayerId = (typeof DISGAEA_WHEEL_CALIBRATION_LAYERS)[number]

export const DISGAEA_WHEEL_CALIBRATION_LAYER_LABELS: Record<DisgaeaWheelCalibrationLayerId, string> = {
  disc: 'Disque (segments)',
  frame: 'Cadre',
  pointerStack: 'Fixation (barre)',
  pointerMobile: 'Pointe mobile',
  ticks: 'Taquets',
}

export function createDefaultDisgaeaWheelCalibration(): DisgaeaWheelLayoutCalibration {
  const p = DISGAEA_WHEEL_LAYOUT.pointer
  return {
    version: 1,
    disc: { x: 0, y: 0, scale: 1, rotate: DISGAEA_WHEEL_LAYOUT.visualRotationOffsetDeg },
    frame: { x: 0, y: 0, scale: DISGAEA_WHEEL_LAYOUT.frame.scalePct / 100, rotate: 0 },
    pointerStack: { x: 0, y: p.stackTopPct, scale: p.packScale, rotate: 0 },
    pointerMobile: {
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      topOnFixedPct: p.mobileTopOnFixedPct,
      hingeY: p.mobileHingeOriginYPct,
      widthRatio: p.mobileWidthRatio,
    },
    ticks: { x: 0, y: 0, scale: 1, rotate: 0 },
  }
}

export function loadDisgaeaWheelCalibration(): DisgaeaWheelLayoutCalibration {
  const defaults = createDefaultDisgaeaWheelCalibration()
  if (typeof localStorage === 'undefined') return defaults
  try {
    const raw = localStorage.getItem(DISGAEA_WHEEL_CALIBRATION_STORAGE_KEY)
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<DisgaeaWheelLayoutCalibration>
    if (parsed.version !== 1) return defaults
    return mergeDisgaeaWheelCalibration(defaults, parsed)
  } catch {
    return defaults
  }
}

export function saveDisgaeaWheelCalibration(cal: DisgaeaWheelLayoutCalibration): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(DISGAEA_WHEEL_CALIBRATION_STORAGE_KEY, JSON.stringify(cal, null, 2))
}

export function mergeDisgaeaWheelCalibration(
  base: DisgaeaWheelLayoutCalibration,
  patch: Partial<DisgaeaWheelLayoutCalibration>,
): DisgaeaWheelLayoutCalibration {
  return {
    version: 1,
    disc: { ...base.disc, ...patch.disc },
    frame: { ...base.frame, ...patch.frame },
    pointerStack: { ...base.pointerStack, ...patch.pointerStack },
    pointerMobile: { ...base.pointerMobile, ...patch.pointerMobile },
    ticks: { ...base.ticks, ...patch.ticks },
  }
}

export function calibrationLayerTransform(layer: DisgaeaWheelCalLayer): string {
  return `translate(${layer.x}%, ${layer.y}%) scale(${layer.scale}) rotate(${layer.rotate}deg)`
}

export function exportDisgaeaWheelCalibrationJson(cal: DisgaeaWheelLayoutCalibration): string {
  return JSON.stringify(cal, null, 2)
}

export function parseDisgaeaWheelCalibrationJson(raw: string): DisgaeaWheelLayoutCalibration {
  const parsed = JSON.parse(raw) as Partial<DisgaeaWheelLayoutCalibration>
  return mergeDisgaeaWheelCalibration(createDefaultDisgaeaWheelCalibration(), parsed)
}
