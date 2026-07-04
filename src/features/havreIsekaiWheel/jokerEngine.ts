import { planWheelSpin } from '../../data/destinyWheel/destinyWheelEngine'
import type { DestinyWheelSeed, RunState, WheelItem } from '../../data/destinyWheel/types'
import type { HavreGameModeDef, HavreRunSession } from './types'

const RARITY_RANK: Record<string, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
  mythic: 5,
  cursed: 2,
  mist_touched: 4,
  anomaly: 5,
  havre_destiny: 6,
  illegal: 6,
  cosmic_bug: 6,
}

export type JokerSpinPlan = NonNullable<ReturnType<typeof planWheelSpin>>

export type JokerUseResult =
  | { ok: true; kind: 'reroll'; plan: JokerSpinPlan; session: HavreRunSession; runState: RunState }
  | { ok: true; kind: 'lock'; session: HavreRunSession; runState: RunState }
  | { ok: false; reason: string }

function rarityRank(rarity: string): number {
  return RARITY_RANK[rarity] ?? 0
}

export function canUseJoker(
  jokerId: string,
  session: HavreRunSession,
  modeDef: HavreGameModeDef,
  wheelId: string,
): string | null {
  if (!modeDef.jokers_allowed) return 'Jokers indisponibles dans ce mode.'
  const max = modeDef.max_jokers_per_run ?? 3
  if (session.jokersUsed.length >= max) return 'Limite de jokers atteinte pour cette run.'
  if (jokerId === 'destiny_lock') {
    if (!modeDef.locks_allowed) return 'Verrouillage indisponible.'
    if (session.lockedWheelIds.includes(wheelId)) return 'Résultat déjà verrouillé.'
    return null
  }
  if (!modeDef.rerolls_allowed) return 'Relances indisponibles dans ce mode.'
  const rerolls = session.rerollsPerWheel[wheelId] ?? 0
  const maxRerolls = modeDef.max_rerolls_per_wheel ?? 1
  if (rerolls >= maxRerolls) return 'Relances épuisées sur cette roue.'
  return null
}

export function applyJoker(
  jokerId: string,
  runState: RunState,
  session: HavreRunSession,
  modeDef: HavreGameModeDef,
  seed: DestinyWheelSeed,
  wheelId: string,
  currentItem?: WheelItem,
): JokerUseResult {
  const block = canUseJoker(jokerId, session, modeDef, wheelId)
  if (block) return { ok: false, reason: block }

  if (jokerId === 'destiny_lock') {
    return {
      ok: true,
      kind: 'lock',
      session: {
        ...session,
        jokersUsed: [...session.jokersUsed, jokerId],
        lockedWheelIds: [...session.lockedWheelIds, wheelId],
      },
      runState,
    }
  }

  let plan = planWheelSpin(runState, wheelId, seed)
  if (!plan) return { ok: false, reason: 'Impossible de relancer cette roue.' }

  if (jokerId === 'safe_reroll' && currentItem) {
    const second = planWheelSpin(runState, wheelId, seed)
    if (second) {
      const firstItem = plan.result.items[0]
      const secondItem = second.result.items[0]
      if (firstItem && secondItem && rarityRank(secondItem.rarity) > rarityRank(firstItem.rarity)) {
        plan = second
      }
    }
  }

  return {
    ok: true,
    kind: 'reroll',
    plan,
    session: {
      ...session,
      jokersUsed: [...session.jokersUsed, jokerId],
      rerollsPerWheel: {
        ...session.rerollsPerWheel,
        [wheelId]: (session.rerollsPerWheel[wheelId] ?? 0) + 1,
      },
    },
    runState: { ...runState, rerollCount: (runState.rerollCount ?? 0) + 1 },
  }
}
