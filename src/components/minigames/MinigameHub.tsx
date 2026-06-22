import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { BUILDING_ACTIVITIES, sortActivitiesByUnlock } from '../../data/buildingActivities'
import { DEV_UNLOCK_ALL_MINIGAMES } from '../../data/gacha'
import { BUILDING_UNLOCK_ORDER, getCurrentStage } from '../../data/population'
import { ConversationPicker } from './ConversationPicker'
import './Minigames.css'

type CompanionInfo = { id: string; name: string }

type MinigameHubProps = {
  buildings: Record<string, number>
  villageStage: number
  resourceLabels: Record<string, string>
  companions: CompanionInfo[]
  unlockAtByBuilding: Record<string, number>
  focusBuildingId?: string | null
  onPlay: (activityId: string) => void
}

type MetaChipProps = {
  chipId: string
  icon: string
  label: string
  tooltip: string
  compact?: boolean
}

function MetaChip({ chipId, icon, label, tooltip, compact = false }: MetaChipProps) {
  return (
    <div className="mg-meta-chip">
      <button
        aria-describedby={chipId}
        className={`mg-meta-chip-button ${compact ? 'compact' : ''}`}
        type="button"
      >
        <span aria-hidden="true">{icon}</span>
        {!compact && <span className="mg-meta-chip-label">{label}</span>}
      </button>
      <div className="mg-meta-chip-tooltip" id={chipId} role="tooltip">
        {tooltip}
      </div>
    </div>
  )
}

function isActivityUnlocked(
  activityBuildingId: string,
  villageStage: number,
  unlockAtByBuilding: Record<string, number>,
) {
  if (DEV_UNLOCK_ALL_MINIGAMES) return true
  const requiredStage = unlockAtByBuilding[activityBuildingId] ?? 0
  return villageStage >= requiredStage
}

export function MinigameHub({
  buildings,
  villageStage,
  resourceLabels,
  companions,
  unlockAtByBuilding,
  focusBuildingId,
  onPlay,
}: MinigameHubProps) {
  const [conversationPickerOpen, setConversationPickerOpen] = useState(false)
  const companionById = Object.fromEntries(companions.map((companion) => [companion.id, companion]))

  const sortedActivities = useMemo(
    () => sortActivitiesByUnlock(BUILDING_ACTIVITIES, unlockAtByBuilding, BUILDING_UNLOCK_ORDER),
    [unlockAtByBuilding],
  )

  const conversationActivities = useMemo(
    () => sortedActivities.filter((activity) => activity.minigameType === 'conversation'),
    [sortedActivities],
  )

  const gameplayActivities = useMemo(
    () => sortedActivities.filter((activity) => activity.minigameType !== 'conversation'),
    [sortedActivities],
  )

  const unlockedConversationCount = useMemo(
    () =>
      conversationActivities.filter((activity) =>
        isActivityUnlocked(activity.buildingId, villageStage, unlockAtByBuilding),
      ).length,
    [conversationActivities, unlockAtByBuilding, villageStage],
  )

  const pickConversation = (activityId: string) => {
    setConversationPickerOpen(false)
    onPlay(activityId)
  }

  const renderActivityCard = (activity: (typeof sortedActivities)[number]) => {
    const requiredStage = unlockAtByBuilding[activity.buildingId] ?? 0
    const locked = !isActivityUnlocked(activity.buildingId, villageStage, unlockAtByBuilding)
    const level = buildings[activity.buildingId] ?? 0
    const companion = companionById[activity.companionId]
    const companionName = companion?.name ?? activity.companionId
    const resourceLabel = resourceLabels[activity.focusResource] ?? activity.focusResource
    const focused = focusBuildingId === activity.buildingId
    const unlockLabel = getCurrentStage(requiredStage).name
    const detailsTooltip = [
      activity.description,
      `Inspire de: ${activity.inspiration}`,
      `Deblocage: ${unlockLabel}`,
      activity.persistent ? 'Progression sauvegardee entre les sessions.' : null,
    ]
      .filter(Boolean)
      .join(' · ')

    return (
      <article
        className={`panel minigame-card ${locked ? 'locked' : ''} ${focused ? 'focused' : ''}`}
        key={activity.id}
        style={{ '--mg-accent': activity.accent } as CSSProperties}
      >
        <div className="minigame-card-top">
          <span className="minigame-card-icon">{activity.icon}</span>
          <div className="minigame-card-head">
            <h3>{activity.name}</h3>
            <small>{activity.tagline}</small>
          </div>
        </div>

        <div className="minigame-card-meta">
          <MetaChip
            chipId={`mg-tip-companion-${activity.id}`}
            icon="💞"
            label={companionName}
            tooltip={`Compagnon: ${companionName}`}
          />
          <MetaChip
            chipId={`mg-tip-resource-${activity.id}`}
            icon="📦"
            label={resourceLabel}
            tooltip={`Ressource focus: ${resourceLabel}`}
          />
          <MetaChip
            chipId={`mg-tip-level-${activity.id}`}
            compact
            icon="🏗️"
            label={`${level}`}
            tooltip={`Niveau du batiment: ${level}`}
          />
          <MetaChip
            chipId={`mg-tip-details-${activity.id}`}
            compact
            icon="ℹ️"
            label="Details"
            tooltip={detailsTooltip}
          />
        </div>

        <button disabled={locked} type="button" onClick={() => onPlay(activity.id)}>
          {locked ? `Stade ${unlockLabel}` : 'Jouer'}
        </button>
      </article>
    )
  }

  return (
    <>
      <section className="section-heading minigame-hub-heading">
        <div>
          <p className="eyebrow">Village actif</p>
          <h2>Mini-jeux des batiments</h2>
        </div>
      </section>

      <section className="grid mini-grid">
        {conversationActivities.length > 0 ? (
          <article
            className={`panel minigame-card minigame-card-conversations ${unlockedConversationCount === 0 ? 'locked' : ''}`}
            style={{ '--mg-accent': '#ff9fd0' } as CSSProperties}
          >
            <div className="minigame-card-top">
              <span className="minigame-card-icon">💞</span>
              <div className="minigame-card-head">
                <h3>Conversations & liens</h3>
                <small>Tous les compagnons du village</small>
              </div>
            </div>

            <div className="minigame-card-meta">
              <MetaChip
                chipId="mg-tip-conversations-count"
                icon="👥"
                label={`${conversationActivities.length}`}
                tooltip={`${conversationActivities.length} conversations disponibles au total.`}
              />
              <MetaChip
                chipId="mg-tip-conversations-open"
                icon="✨"
                label={`${unlockedConversationCount} libres`}
                tooltip={
                  unlockedConversationCount > 0
                    ? `${unlockedConversationCount} compagnon${unlockedConversationCount > 1 ? 's' : ''} debloque${unlockedConversationCount > 1 ? 's' : ''} — ou rencontre aleatoire.`
                    : 'Debloque de nouveaux batiments pour rencontrer plus de compagnons.'
                }
              />
              <MetaChip
                chipId="mg-tip-conversations-details"
                compact
                icon="ℹ️"
                label="Details"
                tooltip="Visual novel chill : trois echanges, ton adapte au compagnon. Cout: mana + poussiere stellaire. Recompenses variables selon tes reponses."
              />
            </div>

            <button
              disabled={unlockedConversationCount === 0}
              type="button"
              onClick={() => setConversationPickerOpen(true)}
            >
              {unlockedConversationCount === 0 ? 'Aucun lien debloque' : 'Choisir un compagnon'}
            </button>
          </article>
        ) : null}

        {gameplayActivities.map((activity) => renderActivityCard(activity))}
      </section>

      {conversationPickerOpen ? (
        <ConversationPicker
          activities={conversationActivities}
          companions={companions}
          unlockAtByBuilding={unlockAtByBuilding}
          villageStage={villageStage}
          onClose={() => setConversationPickerOpen(false)}
          onPick={pickConversation}
        />
      ) : null}
    </>
  )
}
