import type { ReactNode } from 'react'
import type { Cost, ResourceKey } from './resources'
import { RESOURCE_KEYS, RESOURCE_LABELS } from './resources'
import type { StatKey } from './companionStats'
import { STAT_LABELS } from './companionStats'
import { COMPANION_FRAGMENT_NAMES } from './companionFragments'
import { STAT_TOKEN_META } from './gacha'

export type RewardToastPayload = {
  id: string
  label: string
  amount: string
  /** Valeur numérique brute — fusion des toasts groupés. */
  value: number
  icon: 'resource' | 'emoji' | 'image'
  iconValue: ResourceKey | string
}

export function formatRewardToastAmount(amount: number): string {
  const rounded =
    amount >= 10
      ? Math.round(amount * 10) / 10
      : amount >= 1
        ? Math.round(amount * 100) / 100
        : Math.round(amount * 100) / 100
  const display =
    rounded >= 10
      ? rounded.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
      : rounded.toLocaleString('fr-FR', { minimumFractionDigits: rounded < 1 ? 2 : 0, maximumFractionDigits: 2 })
  return `+${display}`
}

export function payloadsFromCost(cost: Cost): RewardToastPayload[] {
  return RESOURCE_KEYS.filter((key) => (cost[key] ?? 0) > 0).map((key) => {
    const value = cost[key] ?? 0
    return {
      id: `resource-${key}`,
      label: RESOURCE_LABELS[key],
      amount: formatRewardToastAmount(value),
      value,
      icon: 'resource',
      iconValue: key,
    }
  })
}

export function payloadsFromFragments(fragments: Record<string, number>): RewardToastPayload[] {
  return Object.entries(fragments)
    .filter(([, count]) => count > 0)
    .map(([companionId, count]) => ({
      id: `frag-${companionId}`,
      label: `Fragment · ${COMPANION_FRAGMENT_NAMES[companionId as keyof typeof COMPANION_FRAGMENT_NAMES] ?? companionId}`,
      amount: formatRewardToastAmount(count),
      value: count,
      icon: 'image',
      iconValue: '/gacha/icons/kimono.svg',
    }))
}

export function payloadsFromStatTokens(
  statTokens: Record<StatKey, number>,
): RewardToastPayload[] {
  return (Object.keys(statTokens) as StatKey[])
    .filter((key) => statTokens[key] > 0)
    .map((key) => {
      const value = statTokens[key]
      return {
        id: `stat-${key}`,
        label: STAT_TOKEN_META[key]?.name ?? STAT_LABELS[key],
        amount: formatRewardToastAmount(value),
        value,
        icon: 'image',
        iconValue: STAT_TOKEN_META[key]?.icon ?? '✨',
      }
    })
}

export function payloadsFromGachaResult(result: {
  resources: Cost
  fragments: Record<string, number>
  statTokens: Record<StatKey, number>
}): RewardToastPayload[] {
  return [
    ...payloadsFromCost(result.resources),
    ...payloadsFromFragments(result.fragments),
    ...payloadsFromStatTokens(result.statTokens),
  ]
}

export type RewardToastRenderIcon = (payload: RewardToastPayload) => ReactNode
