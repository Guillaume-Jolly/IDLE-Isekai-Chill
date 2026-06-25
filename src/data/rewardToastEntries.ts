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
  icon: 'resource' | 'emoji' | 'image'
  iconValue: ResourceKey | string
}

const formatAmount = (amount: number) =>
  `+${Math.floor(amount).toLocaleString('fr-FR')}`

export function payloadsFromCost(cost: Cost): RewardToastPayload[] {
  return RESOURCE_KEYS.filter((key) => (cost[key] ?? 0) > 0).map((key) => ({
    id: `resource-${key}`,
    label: RESOURCE_LABELS[key],
    amount: formatAmount(cost[key] ?? 0),
    icon: 'resource',
    iconValue: key,
  }))
}

export function payloadsFromFragments(fragments: Record<string, number>): RewardToastPayload[] {
  return Object.entries(fragments)
    .filter(([, count]) => count > 0)
    .map(([companionId, count]) => ({
      id: `frag-${companionId}`,
      label: `Fragment · ${COMPANION_FRAGMENT_NAMES[companionId as keyof typeof COMPANION_FRAGMENT_NAMES] ?? companionId}`,
      amount: formatAmount(count),
      icon: 'image',
      iconValue: '/gacha/icons/kimono.svg',
    }))
}

export function payloadsFromStatTokens(
  statTokens: Record<StatKey, number>,
): RewardToastPayload[] {
  return (Object.keys(statTokens) as StatKey[])
    .filter((key) => statTokens[key] > 0)
    .map((key) => ({
      id: `stat-${key}`,
      label: STAT_TOKEN_META[key]?.name ?? STAT_LABELS[key],
      amount: formatAmount(statTokens[key]),
      icon: 'image',
      iconValue: STAT_TOKEN_META[key]?.icon ?? '✨',
    }))
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
