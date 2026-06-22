import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { minigameStagePath, STAGE_FALLBACK_CSS } from '../../data/minigameAssets'
import './Minigames.css'

type MinigameStageProps = {
  activityId: string
  buildingId: string
  accent: string
  children: ReactNode
  /** Remplace le fond batiment (ex. artwork affinite compagnon). */
  backgroundSrc?: string
  backgroundVariant?: 'default' | 'companion-art'
}

export function MinigameStage({
  activityId,
  buildingId,
  accent,
  children,
  backgroundSrc,
  backgroundVariant = 'default',
}: MinigameStageProps) {
  const [bgFailed, setBgFailed] = useState(false)
  const stageSrc = backgroundSrc ?? minigameStagePath(activityId)
  const fallbackBg = STAGE_FALLBACK_CSS[buildingId] ?? STAGE_FALLBACK_CSS['moon-farm']
  const isCompanionArt = backgroundVariant === 'companion-art'

  useEffect(() => {
    setBgFailed(false)
  }, [stageSrc])

  return (
    <div
      className={`minigame-stage ${isCompanionArt ? 'minigame-stage-companion-art' : ''}`}
      style={{ '--mg-accent': accent } as CSSProperties}
    >
      {!bgFailed ? (
        <img
          alt=""
          aria-hidden
          className={`minigame-stage-bg ${isCompanionArt ? 'minigame-stage-bg-companion' : ''}`}
          onError={() => setBgFailed(true)}
          src={stageSrc}
        />
      ) : (
        <div
          aria-hidden
          className="minigame-stage-bg minigame-stage-bg-fallback"
          style={{ background: fallbackBg }}
        />
      )}
      <div className="minigame-stage-inner">{children}</div>
    </div>
  )
}
