import { loadDestinyWheelSeed } from './seedLoader.ts'
import { evaluatePityCondition, evaluateWeightCondition, isEligible } from './requirementResolver.ts'
import type { DestinyWheelSeed, RunState, WeightDebugEntry, WheelItem } from './types.ts'

const DEFAULT_PROFILE_MIN = 0.15
const DEFAULT_PROFILE_MAX = 5.0
const DEFAULT_OTHER_MIN = 0.2
const DEFAULT_OTHER_MAX = 4.0

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getClamps(seed: DestinyWheelSeed) {
  return {
    profileMin: seed.engine_rules.clamps?.profile_multiplier_min ?? DEFAULT_PROFILE_MIN,
    profileMax: seed.engine_rules.clamps?.profile_multiplier_max ?? DEFAULT_PROFILE_MAX,
    otherMin: seed.engine_rules.clamps?.other_multiplier_min ?? DEFAULT_OTHER_MIN,
    otherMax: seed.engine_rules.clamps?.other_multiplier_max ?? DEFAULT_OTHER_MAX,
  }
}

function profileMultiplier(state: RunState, key: string, seed: DestinyWheelSeed): number {
  const { profileMin, profileMax } = getClamps(seed)
  const value = state.probabilityProfile[key] ?? 1
  return clamp(value, profileMin, profileMax)
}

function applyPityMultiplier(
  state: RunState,
  item: WheelItem,
  seed: DestinyWheelSeed,
): { multiplier: number; notes: string[] } {
  let multiplier = 1
  const notes: string[] = []
  for (const pity of seed.engine_rules.pity ?? []) {
    const conditionOk = evaluatePityCondition(state, pity.condition)
    if (!conditionOk) continue

    const effect = pity.effect
    if (!effect) continue

    if (Array.isArray(effect.target_tags)) {
      const matches = (effect.target_tags as string[]).some((tag) => (item.tags_add ?? []).includes(tag))
      if (matches) {
        const mult = typeof effect.multiplier === 'number' ? effect.multiplier : 1
        multiplier *= mult
        notes.push(`pity:${pity.id}×${mult}`)
      }
    }

    if (typeof effect.target_rarity === 'string' && item.rarity === effect.target_rarity) {
      const mult = typeof effect.multiplier === 'number' ? effect.multiplier : 1
      multiplier *= mult
      notes.push(`pity:${pity.id}×${mult}`)
    }

    if (typeof effect.target_rarity_min === 'string') {
      const order = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'cursed', 'illegal', 'cosmic_bug']
      const minIndex = order.indexOf(effect.target_rarity_min)
      const itemIndex = order.indexOf(item.rarity)
      if (minIndex >= 0 && itemIndex >= minIndex) {
        const mult = typeof effect.multiplier === 'number' ? effect.multiplier : 1
        multiplier *= mult
        notes.push(`pity:${pity.id}×${mult}`)
      }
    }
  }
  return { multiplier, notes }
}

function antiRepeatMultiplier(state: RunState, item: WheelItem): { multiplier: number; notes: string[] } {
  const repeats = Object.values(state.selectedItems).filter((id) => id === item.id).length
  if (repeats === 0) return { multiplier: 1, notes: [] }
  const multiplier = 0.35
  return { multiplier, notes: [`anti-repeat×${multiplier}`] }
}

export function computeItemWeight(
  state: RunState,
  item: WheelItem,
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
  debug = false,
): { weight: number; debug?: WeightDebugEntry } {
  const { otherMin, otherMax } = getClamps(seed)
  const eligibility = isEligible(state, item.requirements)
  if (!eligibility) {
    return {
      weight: 0,
      debug: debug
        ? {
            itemId: item.id,
            label: item.label,
            baseWeight: item.base_weight,
            finalWeight: 0,
            multipliers: [],
            eligible: false,
            failedRequirements: ['requirements'],
          }
        : undefined,
    }
  }

  let weight = Math.max(0, item.base_weight)
  const multipliers: string[] = []

  for (const modifier of item.weight_modifiers ?? []) {
    if (!evaluateWeightCondition(state, modifier.condition)) continue
    if (modifier.multiplier_from_profile) {
      const key =
        typeof modifier.condition?.profile_key === 'string'
          ? modifier.condition.profile_key
          : item.profile_keys?.[0]
      if (key) {
        const mult = profileMultiplier(state, key, seed)
        weight *= mult
        multipliers.push(`profile:${key}×${mult.toFixed(2)}`)
      }
    } else if (typeof modifier.multiplier === 'number') {
      const mult = clamp(modifier.multiplier, otherMin, otherMax)
      weight *= mult
      multipliers.push(`cond×${mult.toFixed(2)}`)
    }
  }

  for (const key of item.profile_keys ?? []) {
    const mult = profileMultiplier(state, key, seed)
    weight *= mult
    multipliers.push(`profile_key:${key}×${mult.toFixed(2)}`)
  }

  const pity = applyPityMultiplier(state, item, seed)
  weight *= pity.multiplier
  multipliers.push(...pity.notes)

  const antiRepeat = antiRepeatMultiplier(state, item)
  weight *= antiRepeat.multiplier
  multipliers.push(...antiRepeat.notes)

  weight = Math.max(0, weight)

  return {
    weight,
    debug: debug
      ? {
          itemId: item.id,
          label: item.label,
          baseWeight: item.base_weight,
          finalWeight: weight,
          multipliers,
          eligible: weight > 0,
        }
      : undefined,
  }
}

export function pickWeightedItem(
  state: RunState,
  items: WheelItem[],
  seed: DestinyWheelSeed = loadDestinyWheelSeed(),
  debug = false,
): { item: WheelItem; debugEntries: WeightDebugEntry[] } {
  const debugEntries: WeightDebugEntry[] = []
  const weighted = items.map((item) => {
    const result = computeItemWeight(state, item, seed, debug)
    if (result.debug) debugEntries.push(result.debug)
    return { item, weight: result.weight }
  })

  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0)
  if (total <= 0) {
    const fallback = items[0]
    if (!fallback) throw new Error('Wheel has no items')
    return { item: fallback, debugEntries }
  }

  let roll = state.rng() * total
  for (const entry of weighted) {
    roll -= entry.weight
    if (roll <= 0) return { item: entry.item, debugEntries }
  }

  return { item: weighted[weighted.length - 1].item, debugEntries }
}
