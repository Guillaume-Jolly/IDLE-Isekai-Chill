/** Palette roue Havre — bois, laiton, brume teal (pack havre uniquement). */

export const HAVRE_WHEEL_UI = {
  bg: '#1a2428',
  wood: '#5c3d28',
  brass: '#c9a227',
  teal: '#3a8f8a',
  tealGlow: '#6ec4bc',
  mist: '#a8d4d0',
  labelFill: '#f4efe6',
  labelStroke: '#1a1510',
  pointer: '#d4a64a',
} as const

/** Segments saturés — tons chauds / brume (cohérents avec le cadre PNG). */
export const HAVRE_WHEEL_SEGMENT_COLORS = [
  '#3a8f8a',
  '#c9a227',
  '#6a9e72',
  '#8b6914',
  '#4a7a9e',
  '#b85c38',
  '#5c8a6e',
  '#7a5a9e',
  '#d4a64a',
  '#2d6b6f',
  '#9e6a4a',
  '#4a9e8f',
  '#c77d4a',
  '#6e8f3a',
  '#5a7ab8',
  '#8f4a6a',
] as const

export function generateHavreSegmentColors(count: number): string[] {
  if (count <= 0) return []
  if (count === 1) return [HAVRE_WHEEL_SEGMENT_COLORS[0]]
  return Array.from(
    { length: count },
    (_, i) => HAVRE_WHEEL_SEGMENT_COLORS[i % HAVRE_WHEEL_SEGMENT_COLORS.length],
  )
}

export function isHavreWheelSeed(seed: { pack?: { id?: string } }): boolean {
  return seed.pack?.id === 'havre'
}
