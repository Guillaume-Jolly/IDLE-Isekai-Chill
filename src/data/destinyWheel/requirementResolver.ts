import { warnDestinyWheel } from './logger.ts'
import type { RequirementSpec, RunState } from './types.ts'

function tagCount(state: RunState, tag: string): number {
  return state.tags[tag] ?? 0
}

function hasTag(state: RunState, tag: string): boolean {
  return tagCount(state, tag) > 0
}

function statValue(state: RunState, key: string): number {
  const value = state.stats[key]
  return typeof value === 'number' ? value : 0
}

function checkAllTags(state: RunState, tags: unknown): boolean {
  if (!Array.isArray(tags)) return false
  return tags.every((tag) => typeof tag === 'string' && hasTag(state, tag))
}

function checkAnyTags(state: RunState, tags: unknown): boolean {
  if (!Array.isArray(tags)) return false
  return tags.some((tag) => typeof tag === 'string' && hasTag(state, tag))
}

function checkNotTags(state: RunState, tags: unknown): boolean {
  if (!Array.isArray(tags)) return true
  return tags.every((tag) => typeof tag === 'string' && !hasTag(state, tag))
}

function checkStatMin(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  return Object.entries(spec as Record<string, number>).every(
    ([key, min]) => statValue(state, key) >= min,
  )
}

function checkStatMax(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  return Object.entries(spec as Record<string, number>).every(
    ([key, max]) => statValue(state, key) <= max,
  )
}

function checkSelected(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  return Object.entries(spec as Record<string, string>).every(
    ([wheelId, itemId]) => state.selectedItems[wheelId] === itemId,
  )
}

function checkNotSelected(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  return Object.entries(spec as Record<string, string>).every(
    ([wheelId, itemId]) => state.selectedItems[wheelId] !== itemId,
  )
}

function checkTagCountMin(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  return Object.entries(spec as Record<string, number>).some(
    ([tag, min]) => tagCount(state, tag) >= min,
  )
}

function checkTagCountMinAny(state: RunState, spec: unknown): boolean {
  return checkTagCountMin(state, spec)
}

function checkHasTag(state: RunState, tag: unknown): boolean {
  return typeof tag === 'string' && hasTag(state, tag)
}

function checkHasAnyTag(state: RunState, tags: unknown): boolean {
  return checkAnyTags(state, tags)
}

function checkReincarnation(state: RunState, value: unknown): boolean {
  const reincarnated = hasTag(state, 'reincarnated')
  if (value === true || value === 'yes') return reincarnated
  if (value === false || value === 'no') return !reincarnated
  return true
}

function checkRarityStreak(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  const rarity = (spec as { rarity_streak?: string; min?: number }).rarity_streak
  const min = (spec as { min?: number }).min ?? 1
  if (!rarity) return true
  const streak = state.rarityHistory.slice(-min)
  return streak.length >= min && streak.every((entry) => entry === rarity)
}

function checkNoRarityMin(state: RunState, spec: unknown): boolean {
  if (!spec || typeof spec !== 'object') return true
  const minRarity = (spec as { no_rarity_min?: string }).no_rarity_min
  const minRolls = (spec as { min_rolls?: number }).min_rolls ?? 1
  if (!minRarity) return true
  const order = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'cursed', 'illegal', 'cosmic_bug']
  const minIndex = order.indexOf(minRarity)
  if (minIndex < 0) return true
  const recent = state.rarityHistory.slice(-minRolls)
  if (recent.length < minRolls) return false
  return recent.every((rarity) => order.indexOf(rarity) < minIndex)
}

function checkLastRarity(state: RunState, rarity: unknown): boolean {
  const last = state.rarityHistory[state.rarityHistory.length - 1]
  return typeof rarity === 'string' && last === rarity
}

function checkStatScoreMin(state: RunState, spec: unknown): boolean {
  return checkStatMin(state, spec)
}

export function evaluatePityCondition(state: RunState, condition?: Record<string, unknown>): boolean {
  if (!condition || Object.keys(condition).length === 0) return true
  if ('rarity_streak' in condition) return checkRarityStreak(state, condition)
  if ('no_rarity_min' in condition) return checkNoRarityMin(state, condition)
  if ('last_rarity' in condition) return checkLastRarity(state, condition.last_rarity)
  if ('stat_score_min' in condition) return checkStatScoreMin(state, condition.stat_score_min)
  if ('tag_count_min_any' in condition) return checkTagCountMinAny(state, condition.tag_count_min_any)
  return evaluateRequirements(state, condition).ok
}

const HANDLERS: Record<string, (state: RunState, value: unknown) => boolean> = {
  all_tags: checkAllTags,
  any_tags: checkAnyTags,
  not_tags: checkNotTags,
  stat_min: checkStatMin,
  stat_max: checkStatMax,
  selected: checkSelected,
  not_selected: checkNotSelected,
  tag_count_min: checkTagCountMin,
  tag_count_min_any: checkTagCountMinAny,
  has_tag: checkHasTag,
  has_any_tag: checkHasAnyTag,
  reincarnation: checkReincarnation,
  reincarnated: checkReincarnation,
  no_reincarnation: (state) => !hasTag(state, 'reincarnated'),
  rarity_streak: checkRarityStreak,
  no_rarity_min: checkNoRarityMin,
  last_rarity: checkLastRarity,
  stat_score_min: checkStatScoreMin,
}

export function evaluateRequirements(
  state: RunState,
  requirements?: RequirementSpec,
): { ok: boolean; failures: string[] } {
  if (!requirements || Object.keys(requirements).length === 0) {
    return { ok: true, failures: [] }
  }

  const failures: string[] = []
  for (const [key, value] of Object.entries(requirements)) {
    const handler = HANDLERS[key]
    if (!handler) {
      warnDestinyWheel(`req:${key}`, `Requirement key ignored: ${key}`)
      continue
    }
    if (!handler(state, value)) {
      failures.push(key)
    }
  }

  return { ok: failures.length === 0, failures }
}

export function isEligible(state: RunState, requirements?: RequirementSpec): boolean {
  return evaluateRequirements(state, requirements).ok
}

export function evaluateWeightCondition(state: RunState, condition?: Record<string, unknown>): boolean {
  if (!condition || Object.keys(condition).length === 0) return true
  if ('profile_key' in condition && Object.keys(condition).length === 1) return true
  return evaluateRequirements(state, condition).ok
}
