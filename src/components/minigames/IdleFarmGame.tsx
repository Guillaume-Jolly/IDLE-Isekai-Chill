import { useEffect, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import {
  FARM_CROPS,
  type FarmCropId,
  type FarmPlot,
} from '../../data/minigameSave'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'

function formatRemaining(ms: number) {
  if (ms <= 0) return 'Pret !'
  const totalSec = Math.ceil(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return min > 0 ? `${min} min ${sec}s` : `${sec}s`
}

function cropRewardMultiplier(cropId: FarmCropId) {
  if (cropId === 'star-berry') return 1.4
  if (cropId === 'moon-wheat') return 1.15
  return 1
}

function currentTimestamp() {
  return Date.now()
}

export function IdleFarmGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
}: MinigameProps) {
  const [plots, setPlots] = useState<FarmPlot[]>(minigameSave?.farmPlots ?? [])

  useEffect(() => {
    if (minigameSave?.farmPlots) {
      setPlots(minigameSave.farmPlots)
    }
  }, [minigameSave])
  const [selectedCrop, setSelectedCrop] = useState<FarmCropId>('herb')
  const [harvested, setHarvested] = useState(0)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const persist = (nextPlots: FarmPlot[]) => {
    setPlots(nextPlots)
    if (minigameSave && onSaveMinigame) {
      onSaveMinigame({ ...minigameSave, farmPlots: nextPlots })
    }
  }

  const plant = (index: number) => {
    if (plots[index]) return
    const crop = FARM_CROPS[selectedCrop]
    const next = [...plots]
    next[index] = { cropId: selectedCrop, plantedAt: currentTimestamp(), growMs: crop.growMs }
    persist(next)
  }

  const harvest = (index: number) => {
    const plot = plots[index]
    if (!plot) return
    const remaining = plot.plantedAt + plot.growMs - now
    if (remaining > 0) return

    const next = [...plots]
    next[index] = null
    persist(next)

    const mult = cropRewardMultiplier(plot.cropId)
    const reward = scaleReward(activity.baseReward, Math.round(mult * 100), 100)
    onComplete(1, 1, reward, { keepOpen: true })
    setHarvested((value) => value + 1)
  }

  const readyCount = plots.filter(
    (plot) => plot && plot.plantedAt + plot.growMs <= now,
  ).length

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionName={companionName}
      maxScore={plots.length}
      onClose={onClose}
      onRestart={() => {}}
      resourceLabel={resourceLabel}
      score={readyCount}
      status="playing"
    >
      <div className="mg-farm-idle">
        <p className="mg-flash">
          {readyCount > 0
            ? `${readyCount} parcelle(s) prete(s) a recolter !`
            : 'Plante, reviens plus tard — pas de penalite.'}
          {harvested > 0 && ` — Recoltes cette session: ${harvested}`}
        </p>
        <div className="mg-farm-crops">
          {(Object.keys(FARM_CROPS) as FarmCropId[]).map((cropId) => (
            <button
              className={selectedCrop === cropId ? 'active' : ''}
              key={cropId}
              type="button"
              onClick={() => setSelectedCrop(cropId)}
            >
              {FARM_CROPS[cropId].emoji} {FARM_CROPS[cropId].label} ({FARM_CROPS[cropId].hint})
            </button>
          ))}
        </div>
        <div className="mg-farm-grid">
          {plots.map((plot, index) => {
            if (!plot) {
              return (
                <button className="mg-farm-plot empty" key={index} type="button" onClick={() => plant(index)}>
                  Planter
                </button>
              )
            }
            const crop = FARM_CROPS[plot.cropId]
            const remaining = plot.plantedAt + plot.growMs - now
            const ready = remaining <= 0
            return (
              <button
                className={`mg-farm-plot ${ready ? 'ready' : 'growing'}`}
                key={index}
                type="button"
                onClick={() => (ready ? harvest(index) : undefined)}
              >
                <span>{crop.emoji}</span>
                <small>{ready ? 'Recolter' : formatRemaining(remaining)}</small>
              </button>
            )
          })}
        </div>
        <p className="mg-td-hint">
          Sora garde les champs : meme si tu reviens dans 3 jours, tes recoltes mures restent la.
        </p>
      </div>
    </MinigameFrame>
  )
}
