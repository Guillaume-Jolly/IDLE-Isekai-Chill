import { evaluateRequirements } from './requirementResolver.ts'
import { loadDestinyWheelSeed } from './seedLoader.ts'
import type { ComboRule, DetectedCombo, DestinyWheelSeed, RunState } from './types.ts'

function normalizeComboRequirements(rule: ComboRule): Record<string, unknown> | undefined {
  if (rule.requirements && Object.keys(rule.requirements).length > 0) {
    return rule.requirements
  }
  if (!rule.required_tags?.length && !rule.min_stats) return undefined
  const requirements: Record<string, unknown> = {}
  if (rule.required_tags?.length) requirements.all_tags = rule.required_tags
  if (rule.min_stats) requirements.stat_min = rule.min_stats
  return requirements
}

export function detectCombos(
  state: RunState,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
): DetectedCombo[] {
  return seed.combo_rules
    .filter((rule) => evaluateRequirements(state, normalizeComboRequirements(rule)).ok)
    .sort((a, b) => b.priority - a.priority)
    .map((rule) => ({ ...rule, detected: true as const }))
}
