import { useCallback, useEffect, useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const DISHES = ['🍵', '🍜', '🥟', '🍱', '🍡']
const MAX_ROUNDS = 4

export function TapSequenceGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [round, setRound] = useState(0)
  const [sequence, setSequence] = useState<string[]>([])
  const [inputIndex, setInputIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [flash, setFlash] = useState('')

  const startRound = useCallback((roundIndex: number) => {
    const length = 2 + roundIndex
    const next = Array.from({ length }, () => DISHES[Math.floor(Math.random() * DISHES.length)])
    setSequence(next)
    setInputIndex(0)
    setFlash('Memorise la commande…')
    window.setTimeout(() => setFlash('A toi !'), 900 + length * 350)
  }, [])

  useEffect(() => {
    startRound(0)
  }, [startRound])

  const handlePick = (dish: string) => {
    if (status !== 'playing' || flash.startsWith('Memorise')) return
    if (dish === sequence[inputIndex]) {
      const nextIndex = inputIndex + 1
      setInputIndex(nextIndex)
      if (nextIndex >= sequence.length) {
        const nextScore = score + 1
        setScore(nextScore)
        if (round + 1 >= MAX_ROUNDS) {
          setStatus('won')
          onComplete(nextScore, MAX_ROUNDS, scaleReward(activity.baseReward, nextScore, MAX_ROUNDS))
        } else {
          setRound(round + 1)
          startRound(round + 1)
        }
      }
    } else {
      setStatus('lost')
      onComplete(score, MAX_ROUNDS, scaleReward(activity.baseReward, score, MAX_ROUNDS))
    }
  }

  const restart = () => {
    setRound(0)
    setScore(0)
    setStatus('playing')
    startRound(0)
  }

  const choices = useMemo(() => [...new Set([...sequence, ...DISHES.slice(0, 3)])].slice(0, 5), [sequence])

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={MAX_ROUNDS}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-tap-sequence">
        <p className="mg-flash">{flash}</p>
        <div className="mg-order-strip">
          {sequence.map((dish, index) => (
            <span
              className={`mg-order-item ${index < inputIndex ? 'done' : index === inputIndex ? 'active' : ''}`}
              key={`${dish}-${index}`}
            >
              {dish}
            </span>
          ))}
        </div>
        <div className="mg-choice-grid">
          {choices.map((dish) => (
            <button key={dish} type="button" onClick={() => handlePick(dish)}>
              {dish}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
