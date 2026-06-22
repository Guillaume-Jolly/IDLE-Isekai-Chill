import { useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const SIZE = 5
const GEMS = ['💎', '🔮', '⭐', '🌙', '✨']
const TURNS = 8
const TARGET = 12

function createBoard() {
  return Array.from({ length: SIZE * SIZE }, () => GEMS[Math.floor(Math.random() * GEMS.length)])
}

function swap(board: string[], a: number, b: number) {
  const next = [...board]
  ;[next[a], next[b]] = [next[b], next[a]]
  return next
}

function findMatches(board: string[]) {
  const matched = new Set<number>()
  for (let row = 0; row < SIZE; row += 1) {
    for (let col = 0; col < SIZE - 2; col += 1) {
      const index = row * SIZE + col
      const symbol = board[index]
      if (symbol && board[index + 1] === symbol && board[index + 2] === symbol) {
        matched.add(index)
        matched.add(index + 1)
        matched.add(index + 2)
      }
    }
  }
  for (let col = 0; col < SIZE; col += 1) {
    for (let row = 0; row < SIZE - 2; row += 1) {
      const index = row * SIZE + col
      const symbol = board[index]
      if (symbol && board[index + SIZE] === symbol && board[index + SIZE * 2] === symbol) {
        matched.add(index)
        matched.add(index + SIZE)
        matched.add(index + SIZE * 2)
      }
    }
  }
  return matched
}

function clearMatches(board: string[], matched: Set<number>) {
  return board.map((symbol, index) => (matched.has(index) ? GEMS[Math.floor(Math.random() * GEMS.length)] : symbol))
}

export function SwapMatchGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [board, setBoard] = useState(createBoard)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [turns, setTurns] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const finish = (points: number, won: boolean) => {
    setStatus(won ? 'won' : 'lost')
    onComplete(points, TARGET, scaleReward(activity.baseReward, points, TARGET))
  }

  const resolveBoard = (nextBoard: string[], points: number, usedTurn: boolean) => {
    let current = nextBoard
    let total = points
    let matched = findMatches(current)
    while (matched.size > 0) {
      total += matched.size
      current = clearMatches(current, matched)
      matched = findMatches(current)
    }
    setBoard(current)
    setScore(total)
    const nextTurns = usedTurn ? turns + 1 : turns
    if (usedTurn) setTurns(nextTurns)
    if (total >= TARGET) {
      finish(total, true)
    } else if (usedTurn && nextTurns >= TURNS) {
      finish(total, total >= TARGET * 0.6)
    }
  }

  const tap = (index: number) => {
    if (status !== 'playing') return
    if (selected === null) {
      setSelected(index)
      return
    }
    if (selected === index) {
      setSelected(null)
      return
    }
    const adjacent =
      Math.abs((selected % SIZE) - (index % SIZE)) + Math.abs(Math.floor(selected / SIZE) - Math.floor(index / SIZE)) ===
      1
    if (!adjacent) {
      setSelected(index)
      return
    }
    const swapped = swap(board, selected, index)
    setSelected(null)
    if (findMatches(swapped).size === 0) {
      setTurns((value) => value + 1)
      if (turns + 1 >= TURNS) finish(score, score >= TARGET * 0.6)
      return
    }
    resolveBoard(swapped, score, true)
  }

  const restart = () => {
    setBoard(createBoard())
    setSelected(null)
    setScore(0)
    setTurns(0)
    setStatus('playing')
  }

  const previewMatches = useMemo(() => findMatches(board).size, [board])

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={TARGET}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={score}
      status={status}
    >
      <div className="mg-swap">
        <p className="mg-flash">
          Combos {score}/{TARGET} — tours {turns}/{TURNS} — alignements visibles {previewMatches}
        </p>
        <div className="mg-swap-grid">
          {board.map((gem, index) => (
            <button
              className={`mg-swap-cell ${selected === index ? 'selected' : ''}`}
              key={index}
              type="button"
              onClick={() => tap(index)}
            >
              {gem}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
