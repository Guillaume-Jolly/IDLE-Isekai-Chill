import { useMemo } from 'react'
import type { BuildingActivity } from '../../data/buildingActivities'
import { getCurrentStage } from '../../data/population'
import { CompanionMiniature } from '../CompanionMiniature'
import './Minigames.css'

type CompanionInfo = { id: string; name: string }

type ConversationPickerProps = {
  activities: BuildingActivity[]
  companions: CompanionInfo[]
  unlockAtByBuilding: Record<string, number>
  villageStage: number
  onClose: () => void
  onPick: (activityId: string) => void
}

function CompanionPortrait({
  companionId,
  name,
}: {
  companionId: string
  name: string
}) {
  return (
    <CompanionMiniature
      className="mg-conversation-picker-portrait"
      companionId={companionId}
      name={name}
    />
  )
}

export function ConversationPicker({
  activities,
  companions,
  unlockAtByBuilding,
  villageStage,
  onClose,
  onPick,
}: ConversationPickerProps) {
  const companionById = useMemo(
    () => Object.fromEntries(companions.map((companion) => [companion.id, companion])),
    [companions],
  )

  const sortedActivities = useMemo(
    () =>
      [...activities].sort((a, b) => {
        const nameA = companionById[a.companionId]?.name ?? a.companionId
        const nameB = companionById[b.companionId]?.name ?? b.companionId
        return nameA.localeCompare(nameB, 'fr')
      }),
    [activities, companionById],
  )

  const unlockedActivities = useMemo(
    () =>
      sortedActivities.filter((activity) => {
        const requiredStage = unlockAtByBuilding[activity.buildingId] ?? 0
        return villageStage >= requiredStage
      }),
    [sortedActivities, unlockAtByBuilding, villageStage],
  )

  const pickRandom = () => {
    if (unlockedActivities.length === 0) return
    const index = Math.floor(Math.random() * unlockedActivities.length)
    onPick(unlockedActivities[index].id)
  }

  return (
    <div className="mg-conversation-picker-overlay" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="mg-conversation-picker-title"
        aria-modal="true"
        className="mg-conversation-picker"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mg-conversation-picker-head">
          <div>
            <p className="eyebrow">Liens</p>
            <h3 id="mg-conversation-picker-title">Avec qui veux-tu parler ?</h3>
          </div>
          <button className="secondary mg-conversation-picker-close" type="button" onClick={onClose}>
            Fermer
          </button>
        </header>

        <p className="mg-conversation-picker-copy">
          Choisis un compagnon ou laisse le hasard decider. Chaque conversation coute du mana et de
          la poussiere stellaire.
        </p>

        <button
          className="mg-conversation-picker-random"
          disabled={unlockedActivities.length === 0}
          type="button"
          onClick={pickRandom}
        >
          <span aria-hidden="true" className="mg-conversation-picker-random-icon">
            🎲
          </span>
          <span className="mg-conversation-picker-random-copy">
            <strong>Rencontre aleatoire</strong>
            <small>
              {unlockedActivities.length > 0
                ? `${unlockedActivities.length} compagnon${unlockedActivities.length > 1 ? 's' : ''} disponible${unlockedActivities.length > 1 ? 's' : ''}`
                : 'Aucun compagnon debloque pour le moment'}
            </small>
          </span>
        </button>

        <div className="mg-conversation-picker-grid">
          {sortedActivities.map((activity) => {
            const companion = companionById[activity.companionId]
            const companionName = companion?.name ?? activity.companionId
            const requiredStage = unlockAtByBuilding[activity.buildingId] ?? 0
            const locked = villageStage < requiredStage
            const unlockLabel = getCurrentStage(requiredStage).name

            return (
              <button
                className={`mg-conversation-picker-card ${locked ? 'locked' : ''}`}
                disabled={locked}
                key={activity.id}
                title={locked ? `Debloque au stade ${unlockLabel}` : activity.tagline}
                type="button"
                onClick={() => onPick(activity.id)}
              >
                <div className="mg-conversation-picker-visual">
                  <CompanionPortrait companionId={activity.companionId} name={companionName} />
                </div>
                <strong>{companionName}</strong>
                <small>{activity.tagline}</small>
                {locked ? <span className="mg-conversation-picker-lock">Stade {unlockLabel}</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
