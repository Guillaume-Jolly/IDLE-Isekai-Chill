import type { CSSProperties, ReactNode } from 'react'

import type { BuildingActivity, Cost } from '../../data/buildingActivities'

import type { MinigameSave } from '../../data/minigameSave'

import { CompanionPresenter } from './CompanionPresenter'

import { MinigameStage } from './MinigameStage'

import './Minigames.css'



type MinigameFrameProps = {

  activity: BuildingActivity

  companionName: string

  buildingName: string

  resourceLabel: string

  score: number

  maxScore: number

  status: 'playing' | 'won' | 'lost'

  children: ReactNode

  onClose: () => void

  onRestart: () => void

  companionMood?: string

  /** Masque le bandeau victoire (jeux sans fin de session). */

  endless?: boolean

  scoreLabel?: string
  /** Compagnon deja integre dans la scene (ex. cutout Talia) — masque la colonne gauche. */
  companionInScene?: boolean
  /** Fond personnalise de la scene (ex. artwork affinite). */
  stageBackgroundSrc?: string
  stageBackgroundVariant?: 'default' | 'companion-art'
  /** Mise en page dediee conversation (fond artwork plein ecran). */
  layoutVariant?: 'default' | 'conversation' | 'fullscreen'
}



export function MinigameFrame({

  activity,

  companionName,

  buildingName,

  resourceLabel,

  score,

  maxScore,

  status,

  children,

  onClose,

  onRestart,

  companionMood,

  endless = false,

  scoreLabel,

  companionInScene = false,
  stageBackgroundSrc,
  stageBackgroundVariant = 'default',
  layoutVariant = 'fullscreen',

}: MinigameFrameProps) {
  const showResult = !endless && status !== 'playing'
  const isConversation = layoutVariant === 'conversation'
  const isFullscreen = layoutVariant === 'fullscreen'
  const useFullscreenShell = isFullscreen || isConversation
  const showCompanionColumn = !companionInScene && !useFullscreenShell

  return (

    <div className={`minigame-overlay${useFullscreenShell ? ' minigame-overlay-fullscreen' : ''}`} role="dialog" aria-modal="true">

      <div

        className={`minigame-panel minigame-panel-cinematic ${companionInScene || useFullscreenShell ? 'minigame-panel-immersive' : ''} ${isConversation ? 'minigame-panel-conversation' : ''}${useFullscreenShell ? ' minigame-panel-fullscreen' : ''}`}

        style={{ '--mg-accent': activity.accent } as CSSProperties}

      >

        <header className="minigame-head">

          <div>

            <p className="eyebrow">{activity.tagline}</p>

            <h3>

              {activity.icon} {activity.name}

            </h3>

            <p className="minigame-inspiration">Inspire de {activity.inspiration}</p>

          </div>

          <button className="minigame-close" type="button" onClick={onClose}>

            Fermer

          </button>

        </header>



        <div className="minigame-meta">

          <span>Compagnon: {companionName}</span>

          <span>Batiment: {buildingName}</span>

          <span>Ressource: {resourceLabel}</span>

          <span>

            {scoreLabel ?? 'Score'}: {endless ? score : `${score}/${maxScore}`}

          </span>

        </div>



        <p className="minigame-desc">{activity.description}</p>



        <div
          className={`minigame-play-area minigame-play-area-cinematic ${companionInScene ? 'companion-in-scene' : ''}`}
        >
          {showCompanionColumn && (
            <CompanionPresenter
              accent={activity.accent}
              activityId={activity.id}
              companionId={activity.companionId}
              mood={companionMood}
              name={companionName}
              variant="stage"
            />
          )}

          <MinigameStage

            accent={activity.accent}

            activityId={activity.id}

            backgroundSrc={stageBackgroundSrc}

            backgroundVariant={stageBackgroundVariant}

            buildingId={activity.buildingId}

          >

            {children}

          </MinigameStage>

        </div>



        {showResult && (

          <div className={`minigame-result ${status}`}>

            {status === 'won' ? 'Service termine ! Recompenses ajoutees.' : 'Essaye encore, le village compte sur toi.'}

            {!activity.persistent && (

              <button type="button" className="secondary" onClick={onRestart}>

                Rejouer

              </button>

            )}

          </div>

        )}

      </div>

    </div>

  )

}



export type MinigameCompleteHandler = (

  score: number,

  maxScore: number,

  reward: Cost,

  options?: { keepOpen?: boolean },

) => void



export type MinigameProps = {

  activity: BuildingActivity

  companionName: string

  buildingName: string

  resourceLabel: string

  onComplete: MinigameCompleteHandler

  onClose: () => void

  minigameSave?: MinigameSave

  onSaveMinigame?: (save: MinigameSave) => void

  companionAffinity?: number

}


