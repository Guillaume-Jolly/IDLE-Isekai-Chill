import type { WheelSegment } from './wheelSegments'
import {
  DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION,
  effectiveLabelZoneRadii,
  effectiveRadialTextTrack,
  effectiveTangentArcLength,
  radialTextPathAngle,
  resolveWheelLabelZoneCalibration,
  WHEEL_LABEL_WHEEL_R,
  type WheelLabelZoneCalibration,
} from './wheelLabelZoneCalibration.ts'

/** Marge conservative vs rendu SVG réel (gras + contour). */
const TEXT_WIDTH_SAFETY = 1.12

const WHEEL_R = WHEEL_LABEL_WHEEL_R
const MIN_SWEEP_FOR_LABEL = 4.5

/** @deprecated préférer {@link DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION}.rInnerRatio */
export const LABEL_ZONE_ANG_PAD_START = DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION.angPadStart
/** @deprecated */
export const LABEL_ZONE_ANG_PAD_END = DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION.angPadEnd
/** @deprecated */
export const LABEL_ZONE_R_INNER_RATIO = DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION.rInnerRatio
/** @deprecated */
export const LABEL_ZONE_R_OUTER_RATIO = DEFAULT_WHEEL_LABEL_ZONE_CALIBRATION.rOuterRatio
export const LABEL_ZONE_R_INNER = WHEEL_R * LABEL_ZONE_R_INNER_RATIO
export const LABEL_ZONE_R_OUTER = WHEEL_R * LABEL_ZONE_R_OUTER_RATIO

export type WheelLabelOrientation = 'tangent' | 'radial'

export type WheelLabelZone = {
  startAngle: number
  endAngle: number
  innerR: number
  outerR: number
}

export type WheelLabel = {
  text: string
  fontSize: number
  radius: number
  midAngle: number
  rotation: number
  orientation: WheelLabelOrientation
  textAnchor: 'middle' | 'start'
  zone: WheelLabelZone
  /** Angle (°) de la piste textPath radiale — indépendant du pad clip. */
  pathAngle: number
  pathLengthPx?: number
  shrinkToFit?: boolean
}

export function labelZoneArcRadius(
  zone: WheelLabelZone,
  config?: WheelLabelZoneCalibration,
): number {
  const cfg = resolveWheelLabelZoneCalibration(config)
  return zone.innerR + (zone.outerR - zone.innerR) * cfg.arcRadiusRatio
}

export function labelZoneRadialTrack(
  zone: WheelLabelZone,
  config?: WheelLabelZoneCalibration,
): number {
  const cfg = resolveWheelLabelZoneCalibration(config)
  return (zone.outerR - zone.innerR) * cfg.arcFill
}

export function computeSegmentLabelZone(
  segment: Pick<WheelSegment, 'startAngle' | 'endAngle'>,
  config?: WheelLabelZoneCalibration,
): WheelLabelZone {
  const cfg = resolveWheelLabelZoneCalibration(config)
  const sweep = segment.endAngle - segment.startAngle
  const { innerR, outerR } = effectiveLabelZoneRadii(cfg)
  return {
    startAngle: segment.startAngle + sweep * cfg.angPadStart,
    endAngle: segment.endAngle - sweep * cfg.angPadEnd,
    innerR,
    outerR,
  }
}

function labelAnchor(
  segment: Pick<WheelSegment, 'startAngle' | 'endAngle' | 'midAngle'>,
  orientation: WheelLabelOrientation,
  fontSize: number,
  config: WheelLabelZoneCalibration,
) {
  const zone = computeSegmentLabelZone(segment, config)
  const angle = orientation === 'radial' ? radialTextPathAngle(segment, config) : zone.startAngle
  const radialInset = orientation === 'radial' ? fontSize * config.radialAnchorFontRatio : 0
  const radius = zone.innerR + radialInset
  return { angle, radius, zone }
}

export function planWheelLabels(
  segments: WheelSegment[],
  forceShowIndex: number | null,
  config?: WheelLabelZoneCalibration,
): Map<string, WheelLabel | null> {
  if (segments.length === 0) return new Map()
  const cfg = resolveWheelLabelZoneCalibration(config)

  const maxFont = maxFontForSegmentCount(segments.length, cfg)
  const uniformFont = pickUniformFontSize(segments, forceShowIndex, maxFont, cfg)

  const plans = new Map<string, WheelLabel | null>()
  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]
    const sweep = segment.endAngle - segment.startAngle
    const forced = forceShowIndex === index
    const orientation = labelOrientationForSegment()
    plans.set(
      segment.item.id,
      buildSegmentLabelAtFont(segment, sweep, forced, uniformFont, orientation, cfg),
    )
  }
  return plans
}

function labelOrientationForSegment(): WheelLabelOrientation {
  return 'radial'
}

function maxFontForSegmentCount(count: number, config: WheelLabelZoneCalibration): number {
  let cap = config.maxFont
  if (count <= 10) cap = Math.min(cap, config.maxFont)
  else if (count <= 18) cap = Math.min(cap, 11)
  else if (count <= 28) cap = Math.min(cap, 10)
  else cap = Math.min(cap, 9)
  return cap
}

function pickUniformFontSize(
  segments: WheelSegment[],
  forceShowIndex: number | null,
  maxFont: number,
  config: WheelLabelZoneCalibration,
): number {
  let bestFont = config.minFont
  let bestCount = 0

  for (let font = maxFont; font >= config.minFont; font -= 0.5) {
    let count = 0
    for (let index = 0; index < segments.length; index += 1) {
      const segment = segments[index]
      const sweep = segment.endAngle - segment.startAngle
      const forced = forceShowIndex === index
      const orientation = labelOrientationForSegment()
      if (buildSegmentLabelAtFont(segment, sweep, forced, font, orientation, config)) {
        count += 1
      }
    }
    if (count > bestCount || (count === bestCount && font > bestFont)) {
      bestFont = font
      bestCount = count
    }
  }

  if (forceShowIndex != null && bestCount === 0) {
    for (let font = maxFont; font >= config.minFont; font -= 0.5) {
      const segment = segments[forceShowIndex]
      if (!segment) break
      const sweep = segment.endAngle - segment.startAngle
      const orientation = labelOrientationForSegment()
      if (buildSegmentLabelAtFont(segment, sweep, true, font, orientation, config)) {
        return font
      }
    }
  }

  return bestFont
}

function buildSegmentLabelAtFont(
  segment: WheelSegment,
  sweep: number,
  forced: boolean,
  fontSize: number,
  orientation: WheelLabelOrientation,
  config: WheelLabelZoneCalibration,
): WheelLabel | null {
  const texts = labelTextCandidates(segment.label.trim(), forced)
  if (texts.length === 0) return forced ? makeLabel('…', fontSize, segment, orientation, config) : null

  if (!forced && sweep < minSweepForLabel(orientation)) return null

  for (const text of texts) {
    if (textFitsSegment(text, fontSize, segment, orientation, config)) {
      return makeLabel(text, fontSize, segment, orientation, config)
    }
  }

  if (forced) {
    const fallback = texts[texts.length - 1] ?? '…'
    return makeLabel(fallback, fontSize, segment, orientation, config)
  }

  return null
}

function minSweepForLabel(orientation: WheelLabelOrientation): number {
  return orientation === 'radial' ? 2 : MIN_SWEEP_FOR_LABEL
}

function estimateTextWidthPx(
  text: string,
  fontSize: number,
  config: WheelLabelZoneCalibration,
): number {
  return text.length * fontSize * config.charWidthRatio * config.strokePad * TEXT_WIDTH_SAFETY
}

function availablePathLength(
  zone: WheelLabelZone,
  orientation: WheelLabelOrientation,
  config: WheelLabelZoneCalibration,
): number {
  return orientation === 'radial'
    ? effectiveRadialTextTrack(zone, config)
    : effectiveTangentArcLength(zone, config)
}

function makeLabel(
  text: string,
  fontSize: number,
  segment: WheelSegment,
  orientation: WheelLabelOrientation,
  config: WheelLabelZoneCalibration,
): WheelLabel {
  const { angle, radius, zone } = labelAnchor(segment, orientation, fontSize, config)
  const track = availablePathLength(zone, orientation, config)
  const textWidth = estimateTextWidthPx(text, fontSize, config)
  const shrinkToFit = textWidth > track
  const base = {
    text,
    fontSize,
    radius,
    midAngle: angle,
    pathAngle: angle,
    zone,
    pathLengthPx: shrinkToFit ? track : undefined,
    shrinkToFit,
  }

  if (orientation === 'radial') {
    return {
      ...base,
      rotation: radialLabelRotation(angle),
      orientation,
      textAnchor: 'start',
    }
  }

  return {
    ...base,
    rotation: tangentLabelRotation(angle),
    orientation,
    textAnchor: 'start',
  }
}

function labelTextCandidates(label: string, forced: boolean): string[] {
  if (!label) return forced ? ['…'] : []
  const trimmed = label.trim()
  if (!trimmed) return forced ? ['…'] : []
  if (!forced) return [trimmed]

  const words = trimmed.split(/\s+/).filter(Boolean)
  const out = [trimmed]
  if (words[0] && words[0] !== trimmed) out.push(words[0])
  out.push('…')
  return out
}

function textFitsSegment(
  text: string,
  fontSize: number,
  segment: WheelSegment,
  orientation: WheelLabelOrientation,
  config: WheelLabelZoneCalibration,
): boolean {
  if (orientation === 'radial') return textFitsRadial(text, fontSize, segment, config)
  return textFitsTangent(text, fontSize, segment, config)
}

function textFitsTangent(
  text: string,
  fontSize: number,
  segment: WheelSegment,
  config: WheelLabelZoneCalibration,
): boolean {
  const zone = computeSegmentLabelZone(segment, config)
  const track = effectiveTangentArcLength(zone, config)
  const textWidth = estimateTextWidthPx(text, fontSize, config)
  return textWidth <= track * config.shrinkToFitMax
}

function textFitsRadial(
  text: string,
  fontSize: number,
  segment: WheelSegment,
  config: WheelLabelZoneCalibration,
): boolean {
  const zone = computeSegmentLabelZone(segment, config)
  const track = effectiveRadialTextTrack(zone, config)
  const textWidth = estimateTextWidthPx(text, fontSize, config)
  return textWidth <= track * config.shrinkToFitMax
}

export function tangentLabelRotation(midAngle: number): number {
  return midAngle - 90
}

export function radialLabelRotation(midAngle: number): number {
  return midAngle - 90
}

export function verifyLabelPlans(
  segments: WheelSegment[],
  plans: Map<string, WheelLabel | null>,
  config?: WheelLabelZoneCalibration,
): { ok: boolean; overlaps: string[] } {
  const cfg = resolveWheelLabelZoneCalibration(config)
  const overlaps: string[] = []
  const uniformSizes = new Set<number>()

  for (const segment of segments) {
    const label = plans.get(segment.item.id)
    if (!label) continue
    uniformSizes.add(label.fontSize)

    const track = availablePathLength(label.zone, label.orientation, cfg)
    const textWidth = estimateTextWidthPx(label.text, label.fontSize, cfg)
    if (textWidth > track * cfg.shrinkToFitMax + 0.5) {
      overlaps.push(`${segment.item.id} dépasse sa zone texte`)
    }
  }

  if (uniformSizes.size > 1) {
    overlaps.push(`polices non uniformes (${[...uniformSizes].join(', ')})`)
  }

  return { ok: overlaps.length === 0, overlaps }
}
