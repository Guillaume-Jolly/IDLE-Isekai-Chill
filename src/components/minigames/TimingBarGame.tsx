import { useEffect, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const HITS = 5

export function TimingBarGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [cursor, setCursor] = useState(0)
  const [direction, setDirection] = useState(1)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  useEffect(() => {
    if (status !== 'playing') return
    const frame = window.setInterval(() => {
      setCursor((value) => {
        let next = value + direction * 4
        if (next >= 100) {
          setDirection(-1)
          next = 100
        }
        if (next <= 0) {
          setDirection(1)
          next = 0
        }
        return next
      })
    }, 30)
    return () => window.clearInterval(frame)
  }, [direction, status])

  const tap = () => {
    if (status !== 'playing') return
    const inZone = cursor >= 38 && cursor <= 62
    if (!inZone) {
      setStatus('lost')
      onComplete(score, HITS, scaleReward(activity.baseReward, score, HITS))
      return
    }
    const nextScore = score + 1
    setScore(nextScore)
    if (nextScore >= HITS) {
      setStatus('won')
      onComplete(nextScore, HITS, scaleReward(activity.baseReward, nextScore, HITS))
    }
  }

  const restart = () => {
    setScore(0)
    setCursor(0)
    setDirection(1)
    setStatus('playing')
  }

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={HITS}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-timing">
        <p className="mg-flash">Couds {score}/{HITS} points parfaits</p>
        <div className="mg-timing-track">
          <div className="mg-timing-zone" />
          <div className="mg-timing-cursor" style={{ left: `${cursor}%` }} />
        </div>
        <button className="primary mg-big-btn" type="button" onClick={tap}>
          Coudre !
        </button>
      </div>
    </MinigameFrame>
  )
}
