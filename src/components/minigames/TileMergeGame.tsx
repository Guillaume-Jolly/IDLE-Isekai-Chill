import { useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const SIZE = 4
const TARGET = 5

function createGrid() {
  return Array.from({ length: SIZE * SIZE }, () => 1 + Math.floor(Math.random() * 3))
}

function rollMergedCellValue() {
  return 1 + Math.floor(Math.random() * 2)
}

export function TileMergeGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [grid, setGrid] = useState(createGrid)
  const [selected, setSelected] = useState<number | null>(null)
  const [merges, setMerges] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const maxLevel = useMemo(() => Math.max(...grid), [grid])

  const finish = (count: number, won: boolean) => {
    setStatus(won ? 'won' : 'lost')
    onComplete(count, TARGET, scaleReward(activity.baseReward, count, TARGET))
  }

  const tapCell = (index: number) => {
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
    if (!adjacent || grid[selected] !== grid[index]) {
      setSelected(index)
      return
    }
    const next = [...grid]
    next[index] = Math.min(6, next[index] + 1)
    next[selected] = rollMergedCellValue()
    setGrid(next)
    setSelected(null)
    const nextMerges = merges + 1
    setMerges(nextMerges)
    if (nextMerges >= TARGET || Math.max(...next) >= 6) {
      finish(nextMerges, true)
    }
  }

  const restart = () => {
    setGrid(createGrid())
    setSelected(null)
    setMerges(0)
    setStatus('playing')
  }

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={TARGET}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={merges}
      status={status}
    >
      <div className="mg-merge">
        <p className="mg-flash">
          Fusionne {TARGET} paires — niveau max {maxLevel}/6
        </p>
        <div className="mg-merge-grid">
          {grid.map((value, index) => (
            <button
              className={`mg-merge-cell level-${value} ${selected === index ? 'selected' : ''}`}
              key={index}
              type="button"
              onClick={() => tapCell(index)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </MinigameFrame>
  )
}
