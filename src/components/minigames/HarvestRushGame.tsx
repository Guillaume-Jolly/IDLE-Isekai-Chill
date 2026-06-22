import { useCallback, useEffect, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const WAVES = 5
const GRID = 9

export function HarvestRushGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [readyIds, setReadyIds] = useState<number[]>([])
  const [wave, setWave] = useState(0)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [timeLeft, setTimeLeft] = useState(3)

  const spawnWave = useCallback((waveIndex: number) => {
    const readyCount = 2 + waveIndex
    const ids = Array.from({ length: GRID }, (_, index) => index)
    setReadyIds(ids.sort(() => Math.random() - 0.5).slice(0, readyCount))
    setTimeLeft(3 + waveIndex * 0.4)
  }, [])

  useEffect(() => {
    spawnWave(0)
  }, [spawnWave])

  useEffect(() => {
    if (status !== 'playing') return
    if (timeLeft <= 0) {
      setStatus('lost')
      onComplete(score, WAVES, scaleReward(activity.baseReward, score, WAVES))
      return
    }
    const timer = window.setTimeout(() => setTimeLeft((value) => value - 0.1), 100)
    return () => window.clearTimeout(timer)
  }, [timeLeft, status, score, activity.baseReward, onComplete])

  const harvest = (plotId: number) => {
    if (status !== 'playing' || !readyIds.includes(plotId)) return
    const remaining = readyIds.filter((id) => id !== plotId)
    setReadyIds(remaining)
    if (remaining.length > 0) return

    const nextScore = score + 1
    setScore(nextScore)
    if (wave + 1 >= WAVES) {
      setStatus('won')
      onComplete(nextScore, WAVES, scaleReward(activity.baseReward, nextScore, WAVES))
    } else {
      setWave(wave + 1)
      spawnWave(wave + 1)
    }
  }

  const restart = () => {
    setWave(0)
    setScore(0)
    setStatus('playing')
    spawnWave(0)
  }

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={WAVES}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-harvest">
        <p className="mg-flash">
          Vague {wave + 1}/{WAVES} — {timeLeft.toFixed(1)}s — reste {readyIds.length}
        </p>
        <div className="mg-plot-grid">
          {Array.from({ length: GRID }, (_, plotId) => (
            <button
              className={`mg-plot ${readyIds.includes(plotId) ? 'ready' : 'empty'}`}
              key={plotId}
              type="button"
              onClick={() => harvest(plotId)}
            >
              {readyIds.includes(plotId) ? '🌱' : '🟫'}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
