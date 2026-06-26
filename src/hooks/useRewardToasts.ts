import { useContext } from 'react'
import { RewardToastContext } from '../contexts/rewardToastContext'

export function useRewardToasts() {
  const context = useContext(RewardToastContext)
  if (!context) {
    throw new Error('useRewardToasts must be used within RewardToastProvider')
  }
  return context
}
