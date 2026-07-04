/** Palette roue Disgaea — Netherworld, gothique flashy, saturé (pack disgaea uniquement). */

export const DISGAEA_WHEEL_UI = {
  bg: '#1A1024',
  prune: '#2A1338',
  bordeaux: '#5A1028',
  warmBlack: '#241515',
  magenta: '#D91E8A',
  neonPink: '#FF4FA3',
  ruby: '#C71F37',
  electricViolet: '#7A2BE2',
  slimeGreen: '#7ED321',
  toxicGreen: '#39D353',
  manaBlue: '#3A86FF',
  magicCyan: '#33D6FF',
  gold: '#D4A64A',
  darkGold: '#9E6A1C',
  bronze: '#8C4B1F',
  labelFill: '#F7F1E8',
  labelStroke: '#111111',
} as const

/** Segments saturés alternés — pas de pastels / tons naturels. */
export const DISGAEA_WHEEL_SEGMENT_COLORS = [
  '#C71F37',
  '#39D353',
  '#A335EE',
  '#D4C45A',
  '#2FA8C6',
  '#E3249B',
  '#7ED957',
  '#2C23D6',
  '#D1723A',
  '#53D3B0',
  '#C017D6',
  '#B4D329',
  '#4A90E2',
  '#B82A46',
  '#32D932',
  '#7B3AF2',
] as const

/** Accents reveal / rareté (optionnel — labels, FX). */
export const DISGAEA_WHEEL_RARITY_COLORS: Record<string, string> = {
  common: '#D8D0C4',
  uncommon: '#39D353',
  rare: '#3A86FF',
  epic: '#7A2BE2',
  legendary: '#D4A64A',
  mythic: '#FF4FA3',
  cursed: '#5A1028',
  illegal: '#C71F37',
  cosmic_bug: '#33D6FF',
  anomaly: '#D91E8A',
}

export function generateDisgaeaSegmentColors(count: number): string[] {
  if (count <= 0) return []
  if (count === 1) return [DISGAEA_WHEEL_SEGMENT_COLORS[0]]
  return Array.from(
    { length: count },
    (_, i) => DISGAEA_WHEEL_SEGMENT_COLORS[i % DISGAEA_WHEEL_SEGMENT_COLORS.length],
  )
}

export function isDisgaeaWheelSeed(seed: { pack?: { id?: string } }): boolean {
  return seed.pack?.id === 'disgaea'
}
