import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ResourceIcon } from './ResourceIcon'
import type { ResourceKey } from '../data/resources'
import type { RewardToastPayload } from '../data/rewardToastEntries'
import { playUiReward } from '../audio/uiSounds'
import './RewardToastStack.css'

const DISPLAY_MS = 4000
const ANIM_MS = 420

type ToastRecord = RewardToastPayload & {
  toastId: string
}

type RewardToastContextValue = {
  pushRewardPayloads: (payloads: RewardToastPayload[]) => void
}

const RewardToastContext = createContext<RewardToastContextValue | null>(null)

function ToastIcon({ payload }: { payload: RewardToastPayload }) {
  if (payload.icon === 'resource') {
    return <ResourceIcon className="reward-toast-icon" resource={payload.iconValue as ResourceKey} />
  }

  if (payload.icon === 'image' && payload.iconValue.startsWith('/')) {
    return <img alt="" className="reward-toast-icon-img" src={payload.iconValue} />
  }

  return <span className="reward-toast-icon-emoji">{payload.iconValue}</span>
}

function RewardToastItem({
  toast,
  onRemove,
}: {
  toast: ToastRecord
  onRemove: (id: string) => void
}) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setExiting(true), DISPLAY_MS)
    const removeTimer = window.setTimeout(() => onRemove(toast.toastId), DISPLAY_MS + ANIM_MS)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [onRemove, toast.toastId])

  return (
    <div
      aria-live="polite"
      className={`reward-toast${exiting ? ' reward-toast--exit' : ''}`}
      role="status"
    >
      <div className="reward-toast-glow" aria-hidden />
      <div className="reward-toast-icon-wrap">
        <ToastIcon payload={toast} />
      </div>
      <div className="reward-toast-copy">
        <p className="reward-toast-amount">{toast.amount}</p>
        <p className="reward-toast-label">{toast.label}</p>
      </div>
    </div>
  )
}

export function RewardToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const removeToast = useCallback((toastId: string) => {
    setToasts((current) => current.filter((toast) => toast.toastId !== toastId))
  }, [])

  const pushRewardPayloads = useCallback((payloads: RewardToastPayload[]) => {
    if (payloads.length === 0) return
    playUiReward()
    const stamped = Date.now()
    setToasts((current) => [
      ...current,
      ...payloads.map((payload, index) => ({
        ...payload,
        toastId: `${payload.id}-${stamped}-${index}`,
      })),
    ])
  }, [])

  const value = useMemo(() => ({ pushRewardPayloads }), [pushRewardPayloads])

  return (
    <RewardToastContext.Provider value={value}>
      {children}
      <div aria-label="Récompenses obtenues" className="reward-toast-stack">
        {toasts.map((toast) => (
          <RewardToastItem key={toast.toastId} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </RewardToastContext.Provider>
  )
}

export function useRewardToasts() {
  const context = useContext(RewardToastContext)
  if (!context) {
    throw new Error('useRewardToasts must be used within RewardToastProvider')
  }
  return context
}
