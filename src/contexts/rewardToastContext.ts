import { createContext } from 'react'
import type { PassiveRatePayload, RewardToastPayload } from '../data/rewardToastEntries'
import type { ResourceKey } from '../data/resources'

export type RewardToastContextValue = {
  pushRewardPayloads: (payloads: RewardToastPayload[]) => void
  syncPassiveRates: (perMinute: Partial<Record<ResourceKey, number>>) => void
  passiveRates: PassiveRatePayload[]
}

export const RewardToastContext = createContext<RewardToastContextValue | null>(null)
