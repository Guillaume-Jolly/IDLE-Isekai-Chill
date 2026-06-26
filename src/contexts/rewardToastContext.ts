import { createContext } from 'react'
import type { RewardToastPayload } from '../data/rewardToastEntries'

export type RewardToastContextValue = {
  pushRewardPayloads: (payloads: RewardToastPayload[]) => void
}

export const RewardToastContext = createContext<RewardToastContextValue | null>(null)
