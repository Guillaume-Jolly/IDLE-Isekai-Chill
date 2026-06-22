export type MyrionVisualVariant = 'twilight' | 'bloom' | 'mist' | 'ember'

export const VISUAL_VARIANT_LABELS: Record<MyrionVisualVariant, string> = {
  twilight: 'Crépuscule',
  bloom: 'Floraison',
  mist: 'Brume',
  ember: 'Braise',
}

/** Chance de variante visuelle non-shiny à la capture (MVP). */
export const VISUAL_VARIANT_CHANCE = 0.018

const VARIANT_POOL: MyrionVisualVariant[] = ['twilight', 'bloom', 'mist', 'ember']

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export function rollVisualVariant(isShiny: boolean): MyrionVisualVariant | undefined {
  if (isShiny) return undefined
  if (Math.random() >= VISUAL_VARIANT_CHANCE) return undefined
  return pick(VARIANT_POOL)
}

export function formatVisualVariant(variant?: MyrionVisualVariant): string | null {
  if (!variant) return null
  return VISUAL_VARIANT_LABELS[variant] ?? variant
}
