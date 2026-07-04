import { generateDisgaeaSegmentColors, isDisgaeaWheelSeed } from './disgaeaWheelTheme.ts'
import { generateHavreSegmentColors, isHavreWheelSeed } from './havreWheelTheme.ts'
import { evaluateRequirements } from './requirementResolver.ts'
import { loadDestinyWheelSeed } from './seedLoader.ts'
import { computeItemWeight } from './weightResolver.ts'
import type { DestinyWheelSeed, RunState, WheelDef, WheelItem } from './types.ts'

export type WheelSegment = {
  item: WheelItem
  label: string
  weight: number
  percent: number
  startAngle: number
  endAngle: number
  midAngle: number
  color: string
  index: number
}

export const RARITY_COLORS: Record<string, string> = {
  common: '#8b8ea8',
  uncommon: '#6ecf8a',
  rare: '#6ec8ff',
  epic: '#b8a0ff',
  legendary: '#ffd56a',
  mythic: '#ff9fd0',
  cursed: '#7a4a8a',
  illegal: '#ff5050',
  cosmic_bug: '#53f0ff',
  mist_touched: '#7ecfd4',
  anomaly: '#c77dff',
  havre_destiny: '#e8b86d',
}

const FALLBACK_COLORS = ['#c43a72', '#6a8cff', '#ff8f6b', '#9ed56b', '#ffd898', '#b8a0ff']

/** Couleurs uniques — échelle HSL (angle d'or) pour N segments. */
export function generateDistinctSegmentColors(count: number): string[] {
  if (count <= 0) return []
  if (count === 1) return ['hsl(282 68% 54%)']
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * 137.508) % 360
    const saturation = 56 + ((i * 11) % 28)
    const lightness = 40 + ((i * 7) % 22)
    return `hsl(${hue.toFixed(1)} ${saturation}% ${lightness}%)`
  })
}

/** @deprecated Utiliser generateDistinctSegmentColors après tri. */
export function segmentColor(item: WheelItem, index: number): string {
  return RARITY_COLORS[item.rarity] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

export function getWheelItemPool(state: RunState, wheel: WheelDef): WheelItem[] {
  const eligible = wheel.items.filter((item) => evaluateRequirements(state, item.requirements).ok)
  return eligible.length > 0 ? eligible : wheel.items
}

export function computeWheelSegments(
  state: RunState,
  wheel: WheelDef,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): WheelSegment[] {
  if (wheel.type === 'batch' && wheel.selection === 'one_per_secondary_stat') {
    const grouped = new Map<string, WheelItem[]>()
    for (const item of wheel.items) {
      const statKey = Object.keys(item.stats_add ?? {})[0] ?? item.id
      const bucket = grouped.get(statKey) ?? []
      bucket.push(item)
      grouped.set(statKey, bucket)
    }
    const pseudoItems: WheelItem[] = []
    for (const [statKey, items] of grouped) {
      const weight = items.reduce((sum, item) => sum + computeItemWeight(state, item, seed).weight, 0)
      pseudoItems.push({
        id: `batch_${statKey}`,
        label: statKey.toUpperCase(),
        rarity: items[0]?.rarity ?? 'common',
        base_weight: weight,
        requirements: {},
      })
    }
    return buildSegmentsFromItems(state, pseudoItems, seed)
  }

  return buildSegmentsFromItems(state, getWheelItemPool(state, wheel), seed)
}

function buildSegmentsFromItems(
  state: RunState,
  items: WheelItem[],
  seed: DestinyWheelSeed,
): WheelSegment[] {
  const weighted = items
    .map((item, index) => {
      const weight =
        item.id.startsWith('batch_') && item.base_weight > 0
          ? item.base_weight
          : computeItemWeight(state, item, seed).weight
      return { item, weight, index }
    })
    .filter((entry) => entry.weight > 0)

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0)
  if (total <= 0) return []

  const sorted = [...weighted].sort((a, b) => b.weight - a.weight)
  const colors = isDisgaeaWheelSeed(seed)
    ? generateDisgaeaSegmentColors(sorted.length)
    : isHavreWheelSeed(seed)
      ? generateHavreSegmentColors(sorted.length)
      : generateDistinctSegmentColors(sorted.length)

  let cursor = 0
  return sorted.map((entry, index) => {
    const percent = (entry.weight / total) * 100
    const sweep = (entry.weight / total) * 360
    const startAngle = cursor
    const endAngle = cursor + sweep
    cursor = endAngle
    return {
      item: entry.item,
      label: entry.item.label,
      weight: entry.weight,
      percent,
      startAngle,
      endAngle,
      midAngle: startAngle + sweep / 2,
      color: colors[index] ?? segmentColor(entry.item, index),
      index,
    }
  })
}

export function findSegmentIndexForItem(segments: WheelSegment[], itemId: string): number {
  const direct = segments.findIndex((segment) => segment.item.id === itemId)
  if (direct >= 0) return direct
  if (itemId.includes(':')) {
    const baseId = itemId.split(':').pop()
    if (baseId) {
      const nested = segments.findIndex((segment) => segment.item.id === baseId)
      if (nested >= 0) return nested
    }
  }
  return 0
}

/** SVG arc path — angles in degrees, 0° = top, clockwise. */
export function describeWheelSlice(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const sweep = endAngle - startAngle
  const largeArc = sweep > 180 ? 1 : 0
  if (sweep >= 359.9) {
    return `M ${cx} ${cy} m -${r}, 0 a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`
  }
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`
}

/** Zone texte en forme de part (anneau) — même sens horaire que {@link describeWheelSlice}. */
export function describeWheelAnnularSlice(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
): string {
  if (rInner <= 0.5) {
    return describeWheelSlice(cx, cy, rOuter, startAngle, endAngle)
  }

  const outerStart = polarToCartesian(cx, cy, rOuter, endAngle)
  const outerEnd = polarToCartesian(cx, cy, rOuter, startAngle)
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle)
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle)
  const sweep = endAngle - startAngle
  const largeArc = sweep > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Ligne radiale intérieur → extérieur (bord gauche zone texte, 20 % → 90 % R). */
export function describeWheelRadialLine(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  angleDeg: number,
): string {
  const inner = polarToCartesian(cx, cy, rInner, angleDeg)
  const outer = polarToCartesian(cx, cy, rOuter, angleDeg)
  return `M ${inner.x} ${inner.y} L ${outer.x} ${outer.y}`
}

/** Arc horaire le long d'un cercle (libellé tangent). */
export function describeWheelArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const sweep = endAngle - startAngle
  if (sweep <= 0.01) {
    const p = polarToCartesian(cx, cy, r, startAngle)
    return `M ${p.x} ${p.y}`
  }
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArc = sweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export { polarToCartesian }

export function rotationForSegmentMidAngle(midAngle: number, currentRotation: number, extraSpins = 5): number {
  const normalized = ((midAngle % 360) + 360) % 360
  const landingMod = (360 - normalized) % 360
  const currentMod = ((currentRotation % 360) + 360) % 360
  const clockwiseDelta = (landingMod - currentMod + 360) % 360
  const counterClockwiseDelta = clockwiseDelta === 0 ? 360 : 360 - clockwiseDelta
  return currentRotation - extraSpins * 360 - counterClockwiseDelta
}

/** Rotation CSS pour amener le repère (0° = haut) sur un angle donné. */
export function rotationForPointerAngle(pointerAngleDeg: number, currentRotation: number, extraSpins = 0): number {
  return rotationForSegmentMidAngle(pointerAngleDeg, currentRotation, extraSpins)
}

export type PegBouncePlan = {
  creepTarget: number
  settleTarget: number
}

export type SuspenseLandingPlan = {
  spinTarget: number
  restTarget: number
  pegBounce?: PegBouncePlan
}

/** Atterrissage au centre de case, ou — parfois — accrochage taquet puis léger recul. */
export function buildSuspenseLandingPlan(
  segment: WheelSegment,
  currentRotation: number,
  extraSpins: number,
  rng: () => number = Math.random,
  /** Décalage visuel roue (ex. +45° pack Disgaea assets) — compensé dans les cibles CSS. */
  visualRotationOffsetDeg = 0,
): SuspenseLandingPlan {
  const width = Math.max(1, segment.endAngle - segment.startAngle)
  const restAngle = segment.startAngle + width * (0.58 + rng() * 0.14)
  const restTarget = rotationForPointerAngle(
    restAngle + visualRotationOffsetDeg,
    currentRotation,
    extraSpins,
  )

  const landOnPeg = rng() < 0.4
  if (!landOnPeg) {
    return { spinTarget: restTarget, restTarget }
  }

  const pegAngle = Math.max(
    segment.startAngle + width * 0.72,
    segment.endAngle - 0.35 - rng() * 0.55,
  )
  const settleAngle = segment.endAngle - width * (0.05 + rng() * 0.09)
  const creepAngle = Math.min(segment.endAngle - 0.06, pegAngle + 0.12 + rng() * 0.18)

  return {
    spinTarget: rotationForPointerAngle(pegAngle + visualRotationOffsetDeg, restTarget, 0),
    restTarget,
    pegBounce: {
      creepTarget: rotationForPointerAngle(creepAngle + visualRotationOffsetDeg, restTarget, 0),
      settleTarget: rotationForPointerAngle(settleAngle + visualRotationOffsetDeg, restTarget, 0),
    },
  }
}

export function segmentBoundaryAngles(segments: WheelSegment[]): number[] {
  const boundaries = segments.flatMap((segment) => {
    const end = segment.endAngle
    if (end <= 360) return end > 0.5 ? [end] : []
    const wrapped = end - 360
    return wrapped > 0.5 ? [wrapped] : []
  })
  return [...new Set(boundaries.map((v) => Math.round(v * 100) / 100))].sort((a, b) => a - b)
}

function angularDistanceDeg(a: number, b: number): number {
  const delta = Math.abs(((a - b) % 360) + 360) % 360
  return delta > 180 ? 360 - delta : delta
}

/** Proximité 0–1 d'un taquet sous le repère (1 = taquet aligné). */
export function pegProximityAtRotation(segments: WheelSegment[], rotationDeg: number): number {
  const boundaries = segmentBoundaryAngles(segments)
  if (boundaries.length === 0) return 0

  const pointerAngle = pointerAngleFromRotation(rotationDeg)
  const grazeHalfWidth = 2.8
  let best = 0

  for (const boundary of boundaries) {
    const dist = angularDistanceDeg(pointerAngle, boundary)
    if (dist >= grazeHalfWidth) continue
    best = Math.max(best, 1 - dist / grazeHalfWidth)
  }

  return best
}

/** Déport de la languette repère quand un taquet la frôle (degrés CSS, positif = poussée par le sens de rotation). */
export function flapDeflectionDeg(
  segments: WheelSegment[],
  rotationDeg: number,
  speedDegPerFrame: number,
): number {
  const proximity = pegProximityAtRotation(segments, rotationDeg)
  if (proximity <= 0) return 0

  const speed = Math.abs(speedDegPerFrame)
  const speedNorm = Math.min(1, speed / 3.8)
  const pegInfluence = proximity * (0.4 + 0.6 * proximity)
  const sign = speedDegPerFrame >= 0 ? -1 : 1

  const base = 14 + speedNorm * 38
  let deflect = sign * base * pegInfluence

  if (speedNorm > 0.45 && proximity > 0.3) {
    const floorMag = (22 + speedNorm * 32) * Math.max(proximity, 0.55)
    const floored = sign * floorMag
    if (Math.abs(floored) > Math.abs(deflect)) deflect = floored
  }

  return deflect
}

/** Impulsion à chaque franchissement de taquet (pic visible même entre deux frames). */
export function flapImpulseDeg(speedDegPerFrame: number, spinDirection: 1 | -1 = 1): number {
  const speed = Math.abs(speedDegPerFrame)
  const speedNorm = Math.min(1, speed / 3.8)
  /** Plus lent = pointe plus déportée — effet « galère » en fin de spin. */
  const slowBoost = speed < 0.5 ? 1.55 : speed < 1.2 ? 1.25 : 1
  const sign = spinDirection > 0 ? -1 : 1
  return sign * (22 + speedNorm * 24) * slowBoost
}

/** Retour progressif de la languette après une impulsion (0 = repos). */
export function decayFlapDeflection(currentDeflect: number, dtMs: number, creepPhase = false): number {
  const factor = creepPhase ? 0.86 : 0.9
  const perFrame = Math.pow(factor, dtMs / 16.667)
  const next = currentDeflect * perFrame
  return Math.abs(next) < 0.18 ? 0 : next
}

/** Angle sous le repère fixe (0° = haut) pour une rotation CSS (négatif = anti-horaire). */
export function pointerAngleFromRotation(rotationDeg: number): number {
  return ((360 - rotationDeg) % 360 + 360) % 360
}

/** Prolonge la rotation lue sur la matrice CSS ([-180, 180]) sans saut de ±360°. */
export function unwrapRotationContinuity(previousUnwrapped: number, matrixDeg: number): number {
  const previousMod = ((previousUnwrapped % 360) + 360) % 360
  let delta = matrixDeg - previousMod
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return previousUnwrapped + delta
}

/** Segment sous le repère fixe (0° = haut), rotation CSS anti-horaire en degrés. */
function isPointerInSegmentArc(pointerAngle: number, startAngle: number, endAngle: number): boolean {
  if (endAngle <= 360) {
    return pointerAngle >= startAngle && pointerAngle < endAngle
  }
  return pointerAngle >= startAngle || pointerAngle < endAngle - 360
}

export function segmentAtPointerRotation(segments: WheelSegment[], rotationDeg: number): WheelSegment | null {
  if (segments.length === 0) return null
  const pointerAngle = pointerAngleFromRotation(rotationDeg)
  for (const segment of segments) {
    if (isPointerInSegmentArc(pointerAngle, segment.startAngle, segment.endAngle)) return segment
  }
  return segments[segments.length - 1] ?? null
}

function normalizePointerAngle(deg: number): number {
  return ((deg % 360) + 360) % 360
}

function nextPointerBoundary(
  pos: number,
  direction: 1 | -1,
  boundaries: number[],
): number {
  const normalized = normalizePointerAngle(pos)
  if (direction > 0) {
    for (const boundary of boundaries) {
      if (boundary > normalized + 1e-5) return boundary
    }
    return boundaries[0] + 360
  }
  for (let i = boundaries.length - 1; i >= 0; i -= 1) {
    const boundary = boundaries[i]
    if (boundary < normalized - 1e-5) return boundary
  }
  return boundaries[boundaries.length - 1] - 360
}

/** Nombre de cases franchies entre deux rotations CSS continues (degrés, anti-horaire = négatif). */
export function countSegmentBoundaryCrossings(
  segments: WheelSegment[],
  fromRotation: number,
  toRotation: number,
): number {
  if (segments.length === 0) return 0
  const pointerDelta = -(toRotation - fromRotation)
  if (Math.abs(pointerDelta) < 1e-4) return 0

  const boundaries = segments
    .flatMap((segment) => {
      const end = segment.endAngle
      if (end <= 360) return end > 1e-4 ? [end] : []
      const wrapped = end - 360
      return wrapped > 1e-4 ? [wrapped] : []
    })
    .sort((a, b) => a - b)
  if (boundaries.length === 0) return 0

  const direction: 1 | -1 = pointerDelta > 0 ? 1 : -1
  let remaining = Math.abs(pointerDelta)
  let pos = pointerAngleFromRotation(fromRotation)
  let crossings = 0
  const maxCrossings = Math.max(500, segments.length * 80)

  while (remaining > 1e-4 && crossings < maxCrossings) {
    const boundary = nextPointerBoundary(pos, direction, boundaries)
    const dist = direction > 0 ? boundary - pos : pos - boundary
    if (dist < 1e-4) {
      pos = normalizePointerAngle(boundary + direction * 1e-3)
      remaining = Math.max(0, remaining - 1e-3)
      continue
    }
    if (dist <= remaining + 1e-4) {
      crossings += 1
      remaining -= dist
      pos = normalizePointerAngle(boundary + direction * 1e-3)
    } else {
      break
    }
  }

  return crossings
}
