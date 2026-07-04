import { evaluateRequirements } from './requirementResolver.ts'
import { loadDestinyWheelSeed } from './seedLoader.ts'
import type { DestinyWheelSeed, RunState, StatRoast } from './types.ts'

function normalizeStatRoastRequirements(rule: import('./types.ts').StatRoastRule & { requires?: string[] }) {
  if (rule.requirements && Object.keys(rule.requirements).length > 0) return rule.requirements
  if (rule.requires?.length) return { all_tags: rule.requires }
  return undefined
}

export function resolveStatRoasts(
  state: RunState,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
  limit = 3,
): StatRoast[] {
  return seed.stat_roast_rules
    .filter((rule) => evaluateRequirements(state, normalizeStatRoastRequirements(rule)).ok)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit)
    .map((rule) => ({ ...rule, selected: true as const }))
}
