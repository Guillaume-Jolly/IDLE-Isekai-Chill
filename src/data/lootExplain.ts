export type LootExplainSection = {
  title: string
  lines: string[]
}

export type LootExplainTip = {
  headline?: string
  sections: LootExplainSection[]
}

export const LOOT_PERCENT_TOTAL = 100

/** Répartit des parts pour qu'elles totalisent exactement `target` (ex. 100 %). */
export function normalizeToSum(values: number[], target: number, precision = 2): number[] {
  if (values.length === 0) return []

  const factor = 10 ** precision
  const targetUnits = Math.round(target * factor)
  const weightSum = values.reduce((sum, value) => sum + value, 0)

  if (weightSum <= 0) {
    return values.map(() => 0)
  }

  const exactUnits = values.map((value) => (value / weightSum) * targetUnits)
  const floored = exactUnits.map((units) => Math.floor(units))
  let remainder = targetUnits - floored.reduce((sum, units) => sum + units, 0)

  const ranked = exactUnits
    .map((units, index) => ({ index, remainder: units - floored[index] }))
    .sort((a, b) => b.remainder - a.remainder)

  const result = [...floored]
  for (let i = 0; i < remainder; i += 1) {
    result[ranked[i % ranked.length].index] += 1
  }

  return result.map((units) => units / factor)
}

export function sumPercents(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0)
}

export function formatLootPct(value: number): string {
  return `${value.toFixed(2).replace(/\.?0+$/, '')}%`
}

export function flattenLootExplain(tip: LootExplainTip): string[] {
  return tip.sections.flatMap((section) => [section.title, ...section.lines])
}

export function linesToExplain(title: string, lines: string[]): LootExplainTip {
  return {
    headline: title,
    sections: [{ title: 'Détail', lines }],
  }
}
