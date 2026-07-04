import type { DestinyWheelSeed, RunState } from './types.ts'

function pick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)] ?? items[0]
}

export function generateCharacterName(state: RunState, seed: DestinyWheelSeed): string {
  const gen = seed.name_generation
  const prefix = pick(gen.prefixes, state.rng)
  const middle = pick(gen.middles, state.rng)
  const suffix = pick(gen.suffixes, state.rng)
  return `${prefix}${middle}${suffix}`
}

export function generateCharacterTitle(state: RunState, seed: DestinyWheelSeed): string {
  const fragments = seed.name_generation.title_fragments ?? ['Overlord', 'Prinny', 'Vassal']
  const comboFragment =
    state.combos.find((combo) => combo.title_fragment)?.title_fragment
    ?? state.combos.find((combo) => combo.name)?.name
  if (comboFragment) return comboFragment
  return pick(fragments, state.rng)
}
