import { useId, useState } from 'react'
import type { BuildingActivity } from '../../data/buildingActivities'
import { MinigameSettingsButton } from './MinigameSettingsButton'
import { MinigameSideRailQuit } from './MinigameSideRailQuit'
import './MinigameChrome.css'

type MinigameOverlayChromeProps = {
  activity: BuildingActivity
  buildingName: string
  companionName: string
  endless?: boolean
  maxScore: number
  onClose: () => void
  resourceLabel: string
  score: number
  scoreLabel?: string
}

export function MinigameOverlayChrome({
  activity,
  buildingName,
  companionName,
  endless = false,
  maxScore,
  onClose,
  resourceLabel,
  score,
  scoreLabel,
}: MinigameOverlayChromeProps) {
  const popoverId = useId()
  const [infoOpen, setInfoOpen] = useState(false)

  const scoreText = endless ? String(score) : `${score}/${maxScore}`

  return (
    <aside aria-label="Contrôles du mini-jeu" className="mg-minigame-side-rail">
      <div className="mg-minigame-side-rail-main">
        <MinigameSideRailQuit onClose={onClose} />

        <button
          aria-controls={popoverId}
          aria-expanded={infoOpen}
          aria-label="Infos du mini-jeu"
          className="mg-minigame-side-rail-btn mg-minigame-side-rail-btn--info"
          title="Infos"
          type="button"
          onClick={() => setInfoOpen((open) => !open)}
        >
          i
        </button>
      </div>

      <div className="mg-minigame-side-rail-foot">
        <MinigameSettingsButton />
      </div>

      {infoOpen ? (
        <>
          <button
            aria-label="Fermer les infos"
            className="mg-minigame-info-backdrop"
            type="button"
            onClick={() => setInfoOpen(false)}
          />
          <div className="mg-minigame-info-popover" id={popoverId} role="dialog">
            <p className="mg-minigame-info-title">
              {activity.icon} {activity.name}
            </p>
            <p className="mg-minigame-info-line">
              {scoreLabel ?? 'Score'} : <strong>{scoreText}</strong>
            </p>
            <p className="mg-minigame-info-line">Compagnon : {companionName}</p>
            <p className="mg-minigame-info-line">Bâtiment : {buildingName}</p>
            <p className="mg-minigame-info-line">Ressource : {resourceLabel}</p>
            <p className="mg-minigame-info-desc">{activity.description}</p>
          </div>
        </>
      ) : null}
    </aside>
  )
}

