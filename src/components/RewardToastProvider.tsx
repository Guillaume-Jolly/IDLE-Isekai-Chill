import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ResourceIcon } from './ResourceIcon'
import type { ResourceKey } from '../data/resources'
import {
  formatRewardToastAmount,
  passiveRatesFromPerMinute,
  type PassiveRatePayload,
  type RewardToastPayload,
} from '../data/rewardToastEntries'
import { RewardToastContext } from '../contexts/rewardToastContext'
import { playUiReward } from '../audio/uiSounds'
import './RewardToastStack.css'

const DISPLAY_MS = 4000
const ANIM_MS = 420
const BUMP_MS = 700

type GroupedLine = RewardToastPayload & {
  bumpValue?: number
  showBump: boolean
}

type GroupedToast = {
  sessionId: number
  refreshKey: number
  lines: GroupedLine[]
}

function ToastIcon({ payload }: { payload: RewardToastPayload }) {
  if (payload.icon === 'resource') {
    return <ResourceIcon className="reward-toast-icon" resource={payload.iconValue as ResourceKey} />
  }

  if (payload.icon === 'image' && payload.iconValue.startsWith('/')) {
    return <img alt="" className="reward-toast-icon-img" src={payload.iconValue} />
  }

  return <span className="reward-toast-icon-emoji">{payload.iconValue}</span>
}

function GroupedLineRow({ line }: { line: GroupedLine }) {
  const [bumpVisible, setBumpVisible] = useState(line.showBump)

  useEffect(() => {
    if (!line.showBump || line.bumpValue === undefined) {
      setBumpVisible(false)
      return
    }
    setBumpVisible(true)
    const timer = window.setTimeout(() => setBumpVisible(false), BUMP_MS)
    return () => window.clearTimeout(timer)
  }, [line.showBump, line.bumpValue, line.amount])

  return (
    <li className="reward-toast-line">
      <div className="reward-toast-icon-wrap reward-toast-icon-wrap--line">
        <ToastIcon payload={line} />
      </div>
      <div className="reward-toast-copy reward-toast-copy--line">
        <p className="reward-toast-amount">
          {line.amount}
          {bumpVisible && line.bumpValue !== undefined ? (
            <span className="reward-toast-bump">{formatRewardToastAmount(line.bumpValue)}</span>
          ) : null}
        </p>
        <p className="reward-toast-label">{line.label}</p>
      </div>
    </li>
  )
}

function PassiveRatesToast({
  lines,
  sessionId,
  refreshKey,
}: {
  lines: PassiveRatePayload[]
  sessionId: number
  refreshKey: number
}) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setExiting(false)
    const exitTimer = window.setTimeout(() => setExiting(true), DISPLAY_MS)
    return () => window.clearTimeout(exitTimer)
  }, [sessionId, refreshKey])

  if (lines.length === 0) return null

  return (
    <div
      aria-live="polite"
      className={`reward-toast reward-toast--passive reward-toast--grouped${exiting ? ' reward-toast--exit' : ''}`}
      role="status"
    >
      <div className="reward-toast-glow reward-toast-glow--passive" aria-hidden />
      <p className="reward-toast-passive-title">Production passive</p>
      <ul className="reward-toast-lines">
        {lines.map((line) => (
          <li className="reward-toast-line" key={line.id}>
            <div className="reward-toast-icon-wrap reward-toast-icon-wrap--line reward-toast-icon-wrap--passive">
              <ResourceIcon className="reward-toast-icon" resource={line.resource} />
            </div>
            <div className="reward-toast-copy reward-toast-copy--line">
              <p className="reward-toast-amount reward-toast-amount--passive">{line.rateLabel}</p>
              <p className="reward-toast-label reward-toast-label--passive">{line.label}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GroupedRewardToast({
  toast,
  onDismiss,
}: {
  toast: GroupedToast
  onDismiss: () => void
}) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    setExiting(false)
    const exitTimer = window.setTimeout(() => setExiting(true), DISPLAY_MS)
    const removeTimer = window.setTimeout(() => onDismiss(), DISPLAY_MS + ANIM_MS)
    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [onDismiss, toast.sessionId, toast.refreshKey])

  return (
    <div
      aria-live="polite"
      className={`reward-toast reward-toast--grouped${exiting ? ' reward-toast--exit' : ''}`}
      role="status"
    >
      <div className="reward-toast-glow" aria-hidden />
      <ul className="reward-toast-lines">
        {toast.lines.map((line) => (
          <GroupedLineRow key={line.id} line={line} />
        ))}
      </ul>
    </div>
  )
}

function mergeGroupedLines(current: GroupedLine[], payloads: RewardToastPayload[]): GroupedLine[] {
  const next: GroupedLine[] = current.map(({ bumpValue: _omit, ...line }) => ({
    ...line,
    showBump: false,
  }))
  for (const payload of payloads) {
    const index = next.findIndex((line) => line.id === payload.id)
    if (index >= 0) {
      const existing = next[index]
      const total = Math.round((existing.value + payload.value) * 1000) / 1000
      next[index] = {
        ...existing,
        value: total,
        amount: formatRewardToastAmount(total),
        bumpValue: payload.value,
        showBump: true,
      }
    } else {
      next.push({ ...payload, showBump: false })
    }
  }
  return next
}

export function RewardToastProvider({ children }: { children: ReactNode }) {
  const [groupedToast, setGroupedToast] = useState<GroupedToast | null>(null)
  const [passiveRates, setPassiveRates] = useState<PassiveRatePayload[]>([])
  const sessionRef = useRef(0)

  const dismissToast = useCallback(() => {
    setGroupedToast(null)
  }, [])

  const syncPassiveRates = useCallback((perMinute: Partial<Record<ResourceKey, number>>) => {
    setPassiveRates(passiveRatesFromPerMinute(perMinute))
  }, [])

  const pushRewardPayloads = useCallback((payloads: RewardToastPayload[]) => {
    if (payloads.length === 0) return
    playUiReward()

    setGroupedToast((current) => {
      const sessionId = current ? current.sessionId : ++sessionRef.current
      const lines = mergeGroupedLines(current?.lines ?? [], payloads)
      return {
        sessionId,
        refreshKey: (current?.refreshKey ?? 0) + 1,
        lines,
      }
    })
  }, [])

  const value = useMemo(
    () => ({ pushRewardPayloads, syncPassiveRates, passiveRates }),
    [passiveRates, pushRewardPayloads, syncPassiveRates],
  )

  return (
    <RewardToastContext.Provider value={value}>
      {children}
      <div aria-label="Récompenses obtenues" className="reward-toast-stack">
        {groupedToast ? (
          <>
            <GroupedRewardToast toast={groupedToast} onDismiss={dismissToast} />
            <PassiveRatesToast
              lines={passiveRates}
              refreshKey={groupedToast.refreshKey}
              sessionId={groupedToast.sessionId}
            />
          </>
        ) : null}
      </div>
    </RewardToastContext.Provider>
  )
}
