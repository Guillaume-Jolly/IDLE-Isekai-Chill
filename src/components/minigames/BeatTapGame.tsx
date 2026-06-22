import { useEffect, useRef, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const LANES = ['A', 'S', 'D', 'F']
const NOTES = 12

type Note = { id: number; lane: number; y: number }

export function BeatTapGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const spawned = useRef(0)
  const idRef = useRef(0)

  useEffect(() => {
    if (status !== 'playing' || spawned.current >= NOTES) return
    const timer = window.setInterval(() => {
      if (spawned.current >= NOTES) return
      spawned.current += 1
      idRef.current += 1
      setNotes((current) => [
        ...current,
        { id: idRef.current, lane: Math.floor(Math.random() * LANES.length), y: 0 },
      ])
    }, 550)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (status !== 'playing') return
    const frame = window.setInterval(() => {
      setNotes((current) => {
        const next = current
          .map((note) => ({ ...note, y: note.y + 6 }))
          .filter((note) => {
            if (note.y > 108) {
              setMisses((value) => {
                const nextMiss = value + 1
                if (nextMiss >= 4) {
                  setStatus('lost')
                  onComplete(score, NOTES, scaleReward(activity.baseReward, score, NOTES))
                }
                return nextMiss
              })
              return false
            }
            return true
          })
        return next
      })
    }, 40)
    return () => window.clearInterval(frame)
  }, [status, score, activity.baseReward, onComplete])

  const hit = (lane: number) => {
    if (status !== 'playing') return
    const target = notes.find((note) => note.lane === lane && note.y >= 78 && note.y <= 98)
    if (!target) return
    setNotes((current) => current.filter((note) => note.id !== target.id))
    const nextScore = score + 1
    setScore(nextScore)
    if (nextScore >= NOTES) {
      setStatus('won')
      onComplete(nextScore, NOTES, scaleReward(activity.baseReward, nextScore, NOTES))
    }
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const lane = LANES.indexOf(event.key.toUpperCase())
      if (lane >= 0) hit(lane)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const restart = () => {
    setNotes([])
    setScore(0)
    setMisses(0)
    spawned.current = 0
    setStatus('playing')
  }

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={NOTES}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-beat">
        <p className="mg-flash">
          Notes {score}/{NOTES} — ratés {misses}/4 — clavier A S D F
        </p>
        <div className="mg-beat-lanes">
          {LANES.map((lane, laneIndex) => (
            <div className="mg-beat-lane" key={lane}>
              <div className="mg-beat-hitline" />
              {notes
                .filter((note) => note.lane === laneIndex)
                .map((note) => (
                  <span className="mg-beat-note" key={note.id} style={{ top: `${note.y}%` }} />
                ))}
              <button type="button" onClick={() => hit(laneIndex)}>
                {lane}
              </button>
            </div>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
