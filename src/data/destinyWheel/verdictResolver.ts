import { evaluateRequirements } from './requirementResolver.ts'
import { loadDestinyWheelSeed } from './seedLoader.ts'
import type { DestinyWheelSeed, FinalVerdict, RunState } from './types.ts'

export function resolveVerdict(
  state: RunState,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): FinalVerdict {
  const eligible = seed.verdict_rules
    .filter((rule) => evaluateRequirements(state, rule.requirements).ok)
    .sort((a, b) => b.priority - a.priority)

  if (eligible.length === 0) {
    return {
      id: 'verdict_fallback',
      label: 'Héros administratif',
      description: 'Le générateur a fini sans verdict spécial. Suspect.',
      priority: 1,
      selected: true,
      reward_hint: 'minor_resource_or_codex',
    }
  }

  const topPriority = eligible[0].priority
  const topTier = eligible.filter((rule) => rule.priority === topPriority)
  const pick = topTier[Math.floor(state.rng() * topTier.length)] ?? eligible[0]
  return { ...pick, selected: true }
}

export function estimateWinChance(state: RunState): number {
  const power = typeof state.stats.power === 'number' ? state.stats.power : 0
  const risk = typeof state.stats.risk === 'number' ? state.stats.risk : 0
  const comedy = typeof state.stats.comedy === 'number' ? state.stats.comedy : 0
  const base = 35 + power * 3 - risk * 2 + comedy * 0.5
  return Math.max(3, Math.min(97, Math.round(base)))
}
