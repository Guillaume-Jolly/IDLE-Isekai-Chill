import type { Cost } from '../buildingActivities'
import type { DetectedCombo, FinalVerdict, RunState } from './types.ts'

const REWARD_HINT_TO_COST: Record<string, Cost> = {
  minor_resource_or_codex: { stardust: 4, gifts: 6 },
  codex_or_minor_bonus: { renown: 8, stardust: 3 },
  temporary_bonus: { mana: 12 },
}

export function resolveReward(
  verdict: FinalVerdict,
  combos: DetectedCombo[],
): { reward: Record<string, unknown>; scaledCost: Cost } {
  const hint = verdict.reward_hint ?? 'minor_resource_or_codex'
  const base = REWARD_HINT_TO_COST[hint] ?? { stardust: 3, gifts: 5 }
  const comboBonus = Math.min(combos.length, 3)
  const scaledCost: Cost = {
    ...base,
    stardust: (base.stardust ?? 0) + comboBonus,
    gifts: (base.gifts ?? 0) + (comboBonus > 1 ? 2 : 0),
  }

  return {
    reward: {
      type: hint,
      comboCount: combos.length,
      verdictId: verdict.id,
    },
    scaledCost,
  }
}

export function computeRunScore(state: RunState, totalWheels: number): number {
  const rarityScore = state.rarityHistory.reduce((sum, rarity) => {
    const weights: Record<string, number> = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythic: 6,
      cursed: 2,
      illegal: 7,
      cosmic_bug: 8,
    }
    return sum + (weights[rarity] ?? 1)
  }, 0)
  const verdictBonus = (state.finalVerdict?.priority ?? 0) / 20
  const comboBonus = state.combos.length * 2
  const raw = rarityScore + verdictBonus + comboBonus
  const max = Math.max(10, totalWheels * 2 + 20)
  return Math.max(1, Math.min(max, Math.round(raw)))
}
