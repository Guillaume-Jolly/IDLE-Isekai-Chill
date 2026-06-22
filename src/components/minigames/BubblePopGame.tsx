import { useCallback, useEffect, useRef, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

type Bubble = { id: number; x: number; y: number; good: boolean }

const DURATION = 18

export function BubblePopGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [score, setScore] = useState(0)
  const [bad, setBad] = useState(0)
  const [timeLeft, setTimeLeft] = useState(DURATION)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const idRef = useRef(0)

  const spawn = useCallback(() => {
    idRef.current += 1
    const bubble: Bubble = {
      id: idRef.current,
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 72,
      good: Math.random() > 0.35,
    }
    setBubbles((current) => [...current.slice(-11), bubble])
  }, [])

  useEffect(() => {
    if (status !== 'playing') return
    const spawnTimer = window.setInterval(spawn, 700)
    return () => window.clearInterval(spawnTimer)
  }, [spawn, status])

  useEffect(() => {
    if (status !== 'playing') return
    if (timeLeft <= 0) {
      const won = score >= 10
      setStatus(won ? 'won' : 'lost')
      onComplete(score, 12, scaleReward(activity.baseReward, score, 12))
      return
    }
    const tick = window.setTimeout(() => setTimeLeft((value) => value - 0.1), 100)
    return () => window.clearTimeout(tick)
  }, [timeLeft, status, score, activity.baseReward, onComplete])

  const pop = (bubble: Bubble) => {
    if (status !== 'playing') return
    setBubbles((current) => current.filter((item) => item.id !== bubble.id))
    if (bubble.good) {
      setScore((value) => value + 1)
    } else {
      const nextBad = bad + 1
      setBad(nextBad)
      if (nextBad >= 3) {
        setStatus('lost')
        onComplete(score, 12, scaleReward(activity.baseReward, score, 12))
      }
    }
  }

  const restart = () => {
    setBubbles([])
    setScore(0)
    setBad(0)
    setTimeLeft(DURATION)
    setStatus('playing')
  }

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={12}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-bubbles">
        <p className="mg-flash">
          {timeLeft.toFixed(1)}s — Pop 10 bulles bleues ({score}/10) — Erreurs {bad}/3
        </p>
        <div className="mg-bubble-field">
          {bubbles.map((bubble) => (
            <button
              className={`mg-bubble ${bubble.good ? 'good' : 'bad'}`}
              key={bubble.id}
              style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
              type="button"
              onClick={() => pop(bubble)}
            >
              {bubble.good ? '💧' : '🧊'}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
