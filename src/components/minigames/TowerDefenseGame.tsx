import { useEffect, useRef, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

const ROWS = 3
const COLS = 5
const WAVES = 4

type PlantKind = 'shooter' | 'wall'
type Cell = PlantKind | null
type Enemy = { id: number; row: number; col: number; hp: number }

const PLANT_COST: Record<PlantKind, number> = { shooter: 50, wall: 25 }
const PLANT_ICON: Record<PlantKind, string> = { shooter: '🌻', wall: '🪨' }

export function TowerDefenseGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  onComplete,
  onClose,
}: MinigameProps) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null)),
  )
  const [enemies, setEnemies] = useState<Enemy[]>([])
  const [sun, setSun] = useState(100)
  const [selected, setSelected] = useState<PlantKind>('shooter')
  const [wave, setWave] = useState(0)
  const [waveActive, setWaveActive] = useState(false)
  const [leaks, setLeaks] = useState(0)
  const [kills, setKills] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const enemyId = useRef(0)
  const spawnLeft = useRef(0)

  useEffect(() => {
    if (status !== 'playing') return
    const timer = window.setInterval(() => setSun((value) => value + 15), 4000)
    return () => window.clearInterval(timer)
  }, [status])

  useEffect(() => {
    if (!waveActive || status !== 'playing') return

    const tick = window.setInterval(() => {
      setEnemies((current) => {
        let nextLeaks = 0
        let nextKills = 0
        const shooters = grid.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (cell === 'shooter' ? { row: rowIndex, col: colIndex } : null)).filter(Boolean),
        ) as { row: number; col: number }[]

        const moved = current
          .map((enemy) => {
            const blocked =
              enemy.col > 0 &&
              grid[enemy.row][enemy.col - 1] === 'wall' &&
              Math.random() > 0.35

            let nextCol = blocked ? enemy.col : enemy.col - 1
            shooters.forEach((shooter) => {
              if (shooter.row === enemy.row && shooter.col > nextCol && shooter.col - nextCol <= 2) {
                enemy = { ...enemy, hp: enemy.hp - 1 }
              }
            })

            if (enemy.hp <= 0) {
              nextKills += 1
              return null
            }
            if (nextCol < 0) {
              nextLeaks += 1
              return null
            }
            return { ...enemy, col: nextCol }
          })
          .filter((enemy): enemy is Enemy => enemy !== null)

        if (nextLeaks) {
          setLeaks((value) => {
            const total = value + nextLeaks
            if (total >= 3) {
              setStatus('lost')
              onComplete(kills + nextKills, WAVES, scaleReward(activity.baseReward, kills, WAVES))
            }
            return total
          })
        }
        if (nextKills) {
          setKills((value) => value + nextKills)
          setSun((value) => value + nextKills * 10)
        }

        return moved
      })

      if (spawnLeft.current > 0 && Math.random() > 0.55) {
        spawnLeft.current -= 1
        enemyId.current += 1
        const row = Math.floor(Math.random() * ROWS)
        setEnemies((current) => [...current, { id: enemyId.current, row, col: COLS - 1, hp: 3 }])
      }

      if (spawnLeft.current <= 0) {
        setEnemies((current) => {
          if (current.length === 0) {
            setWaveActive(false)
            setWave((value) => {
              const nextWave = value + 1
              if (nextWave >= WAVES) {
                setStatus('won')
                onComplete(kills, WAVES, scaleReward(activity.baseReward, WAVES, WAVES))
              }
              return nextWave
            })
          }
          return current
        })
      }
    }, 700)

    return () => window.clearInterval(tick)
  }, [waveActive, status, grid, kills, activity.baseReward, onComplete])

  const startWave = () => {
    if (waveActive || status !== 'playing' || wave >= WAVES) return
    spawnLeft.current = 4 + wave * 2
    setWaveActive(true)
  }

  const placePlant = (row: number, col: number) => {
    if (status !== 'playing' || grid[row][col]) return
    const cost = PLANT_COST[selected]
    if (sun < cost) return
    setSun((value) => value - cost)
    setGrid((current) =>
      current.map((line, rowIndex) =>
        line.map((cell, colIndex) => (rowIndex === row && colIndex === col ? selected : cell)),
      ),
    )
  }

  const restart = () => {
    setGrid(Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null)))
    setEnemies([])
    setSun(100)
    setWave(0)
    setWaveActive(false)
    setLeaks(0)
    setKills(0)
    setStatus('playing')
    spawnLeft.current = 0
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
      score={wave}
      status={status}
    >
      <div className="mg-td">
        <p className="mg-flash">
          ☀ {sun} — Vague {Math.min(wave + 1, WAVES)}/{WAVES} — Fuites {leaks}/3 — Abattus {kills}
        </p>
        <div className="mg-td-tools">
          {(['shooter', 'wall'] as PlantKind[]).map((kind) => (
            <button
              className={selected === kind ? 'active' : ''}
              key={kind}
              type="button"
              onClick={() => setSelected(kind)}
            >
              {PLANT_ICON[kind]} {PLANT_COST[kind]}☀
            </button>
          ))}
          <button className="primary" disabled={waveActive || wave >= WAVES} type="button" onClick={startWave}>
            {waveActive ? 'Vague en cours…' : 'Lancer vague'}
          </button>
        </div>
        <div className="mg-td-grid">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const enemy = enemies.find((item) => item.row === rowIndex && item.col === colIndex)
              return (
                <button
                  className={`mg-td-cell ${enemy ? 'enemy' : ''}`}
                  key={`${rowIndex}-${colIndex}`}
                  type="button"
                  onClick={() => placePlant(rowIndex, colIndex)}
                >
                  {enemy ? '👻' : cell ? PLANT_ICON[cell] : ''}
                </button>
              )
            }),
          )}
        </div>
        <p className="mg-td-hint">Les esprits arrivent a droite. Les 🌻 tirent, les 🪨 ralentissent.</p>
      </div>
    </MinigameFrame>
  )
}
