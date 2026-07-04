/** Assets UI roue — calibrés sur viewBox 400×400 (Disgaea 1217×1203, Havre 1024×1024). */

export const HAVRE_WHEEL_ASSETS = {
  frame: '/assets/destiny-wheel/havre/frame.png',
  pointerFixed: '/assets/destiny-wheel/havre/pointer_fixed.png',
  pointerMobile: '/assets/destiny-wheel/havre/pointer_mobile.png',
  tickNormal: '/assets/destiny-wheel/havre/tick_normal.webp',
  tickThin: '/assets/destiny-wheel/havre/tick_thin.webp',
} as const

export const HAVRE_WHEEL_ASSET_PX = {
  frame: { w: 1017, h: 1017 },
  pointerFixed: { w: 646, h: 426 },
  pointerMobile: { w: 343, h: 808 },
  tickNormal: { w: 212, h: 586 },
  tickThin: { w: 96, h: 708 },
} as const

const HAVRE_FRAME_W = HAVRE_WHEEL_ASSET_PX.frame.w
const HAVRE_PACK_FIXED_W_PCT = (HAVRE_WHEEL_ASSET_PX.pointerFixed.w / HAVRE_FRAME_W) * 100
const HAVRE_PACK_MOBILE_W_RATIO =
  HAVRE_WHEEL_ASSET_PX.pointerMobile.w / HAVRE_WHEEL_ASSET_PX.pointerFixed.w

const HAVRE_POINTER_PACK_SCALE = 0.64
const HAVRE_POINTER_MOBILE_ATTACH_ON_FIXED_PCT = 72

const havreFixedAspect = HAVRE_WHEEL_ASSET_PX.pointerFixed.h / HAVRE_WHEEL_ASSET_PX.pointerFixed.w
const havreMobileAspect = HAVRE_WHEEL_ASSET_PX.pointerMobile.h / HAVRE_WHEEL_ASSET_PX.pointerMobile.w
const havreMobileHeightOverFixed =
  (HAVRE_PACK_MOBILE_W_RATIO * havreMobileAspect) / havreFixedAspect
const HAVRE_POINTER_MOBILE_HINGE_ORIGIN_PCT = 5.5
const HAVRE_POINTER_MOBILE_TOP_ON_FIXED_PCT =
  HAVRE_POINTER_MOBILE_ATTACH_ON_FIXED_PCT -
  havreMobileHeightOverFixed * (HAVRE_POINTER_MOBILE_HINGE_ORIGIN_PCT / 100)

/** Repère viewBox 400 — calibré visuel Havre (×1,4 vs baseline Disgaea 11×32). */
const HAVRE_TICK_VIEWBOX_SCALE = 1.4

/** Même structure que Disgaea — dimensions recalibrées sur le pack Havre. */
export const HAVRE_WHEEL_LAYOUT = {
  visualRotationOffsetDeg: 18.5,
  frame: { scalePct: 116 },
  pointer: {
    packScale: HAVRE_POINTER_PACK_SCALE,
    stackTopPct: -1.5,
    fixedWidthPct: HAVRE_PACK_FIXED_W_PCT,
    mobileWidthRatio: HAVRE_PACK_MOBILE_W_RATIO,
    mobileAttachOnFixedPct: HAVRE_POINTER_MOBILE_ATTACH_ON_FIXED_PCT,
    mobileTopOnFixedPct: HAVRE_POINTER_MOBILE_TOP_ON_FIXED_PCT,
    mobileHingeOriginYPct: HAVRE_POINTER_MOBILE_HINGE_ORIGIN_PCT,
  },
  tick: {
    thinSegmentThreshold: 14,
    normal: {
      width: 11 * HAVRE_TICK_VIEWBOX_SCALE,
      height: 32 * HAVRE_TICK_VIEWBOX_SCALE,
      anchorR: 187,
    },
    thin: {
      width: 3.6 * HAVRE_TICK_VIEWBOX_SCALE,
      height: 28 * HAVRE_TICK_VIEWBOX_SCALE,
      anchorR: 187,
    },
  },
} as const

export const DISGAEA_WHEEL_ASSETS = {
  frame: '/assets/destiny-wheel/disgaea/frame.png',
  pointerFixed: '/assets/destiny-wheel/disgaea/pointer_fixed.png',
  pointerMobile: '/assets/destiny-wheel/disgaea/pointer_mobile.png',
  tickNormal: '/assets/destiny-wheel/disgaea/tick_normal.webp',
  tickThin: '/assets/destiny-wheel/disgaea/tick_thin.webp',
} as const

/** Dimensions source (px) — même repère que le pack validé. */
export const DISGAEA_WHEEL_ASSET_PX = {
  frame: { w: 1217, h: 1203 },
  pointerFixed: { w: 997, h: 653 },
  pointerMobile: { w: 472, h: 970 },
  tickNormal: { w: 301, h: 840 },
  tickThin: { w: 97, h: 849 },
} as const

const FRAME_W = DISGAEA_WHEEL_ASSET_PX.frame.w
const PACK_FIXED_W_PCT = (DISGAEA_WHEEL_ASSET_PX.pointerFixed.w / FRAME_W) * 100
const PACK_MOBILE_W_RATIO = DISGAEA_WHEEL_ASSET_PX.pointerMobile.w / DISGAEA_WHEEL_ASSET_PX.pointerFixed.w

/** Calibré sur capture v282 — repère ~40 % roue → scale ~0,64 vs pack. */
const POINTER_PACK_SCALE = 0.64
/** Charnière mobile sur fixed (% hauteur image fixed, encoche bas du PNG). */
const POINTER_MOBILE_ATTACH_ON_FIXED_PCT = 72

const fixedAspect = DISGAEA_WHEEL_ASSET_PX.pointerFixed.h / DISGAEA_WHEEL_ASSET_PX.pointerFixed.w
const mobileAspect = DISGAEA_WHEEL_ASSET_PX.pointerMobile.h / DISGAEA_WHEEL_ASSET_PX.pointerMobile.w
const mobileHeightOverFixed =
  (PACK_MOBILE_W_RATIO * mobileAspect) / fixedAspect
const POINTER_MOBILE_HINGE_ORIGIN_PCT = 5.5
const POINTER_MOBILE_TOP_ON_FIXED_PCT =
  POINTER_MOBILE_ATTACH_ON_FIXED_PCT - mobileHeightOverFixed * (POINTER_MOBILE_HINGE_ORIGIN_PCT / 100)

/**
 * Placement relatif au stage (carré = viewBox 400).
 * Repère : stack unique (fixed + mobile) scalé ensemble — charnière alignée.
 */
export const DISGAEA_WHEEL_LAYOUT = {
  visualRotationOffsetDeg: 45,
  frame: { scalePct: 116 },
  pointer: {
    packScale: POINTER_PACK_SCALE,
    stackTopPct: -1.5,
    fixedWidthPct: PACK_FIXED_W_PCT,
    mobileWidthRatio: PACK_MOBILE_W_RATIO,
    mobileAttachOnFixedPct: POINTER_MOBILE_ATTACH_ON_FIXED_PCT,
    mobileTopOnFixedPct: POINTER_MOBILE_TOP_ON_FIXED_PCT,
    mobileHingeOriginYPct: POINTER_MOBILE_HINGE_ORIGIN_PCT,
  },
  tick: {
    thinSegmentThreshold: 14,
    normal: { width: 11, height: 32, anchorR: 187 },
    thin: { width: 3.6, height: 28, anchorR: 187 },
  },
} as const

export function pickDisgaeaTickAsset(segmentCount: number): {
  src: string
  width: number
  height: number
  anchorR: number
} {
  const useThin = segmentCount >= DISGAEA_WHEEL_LAYOUT.tick.thinSegmentThreshold
  const spec = useThin ? DISGAEA_WHEEL_LAYOUT.tick.thin : DISGAEA_WHEEL_LAYOUT.tick.normal
  return {
    src: useThin ? DISGAEA_WHEEL_ASSETS.tickThin : DISGAEA_WHEEL_ASSETS.tickNormal,
    width: spec.width,
    height: spec.height,
    anchorR: spec.anchorR,
  }
}

export function pickHavreTickAsset(segmentCount: number): {
  src: string
  width: number
  height: number
  anchorR: number
} {
  const useThin = segmentCount >= HAVRE_WHEEL_LAYOUT.tick.thinSegmentThreshold
  const spec = useThin ? HAVRE_WHEEL_LAYOUT.tick.thin : HAVRE_WHEEL_LAYOUT.tick.normal
  return {
    src: useThin ? HAVRE_WHEEL_ASSETS.tickThin : HAVRE_WHEEL_ASSETS.tickNormal,
    width: spec.width,
    height: spec.height,
    anchorR: spec.anchorR,
  }
}

export type WheelAssetPackLayout = typeof DISGAEA_WHEEL_LAYOUT | typeof HAVRE_WHEEL_LAYOUT

export function pickWheelTickAsset(
  pack: 'disgaea' | 'havre',
  segmentCount: number,
): ReturnType<typeof pickDisgaeaTickAsset> {
  return pack === 'havre' ? pickHavreTickAsset(segmentCount) : pickDisgaeaTickAsset(segmentCount)
}
