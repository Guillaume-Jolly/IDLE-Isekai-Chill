import { useMemo, useState } from 'react'

import type { CSSProperties } from 'react'

import {

  BUILDING_ACTIVITIES,

  NEW_MINIGAME_IDS,

  PARLER_HUB_ACTIVITY,

  PARLER_HUB_ACTIVITY_ID,

  sortActivitiesByUnlock,

} from '../../data/buildingActivities'

import { listCompanionNamesForSystem } from '../../data/companionSupport'
import { CURATED_PARLER_ONLY, CURATED_PARLER_COMPANION_ID } from '../../data/companionDialogues'

import { DEV_UNLOCK_ALL_MINIGAMES } from '../../data/gacha'

import { computeNextStep, type NextStepContext, type NextStepTarget } from '../../data/nextStepGuidance'

import { BUILDING_UNLOCK_ORDER, getCurrentStage } from '../../data/population'

import { supportSystemForActivity } from '../../data/systemHints'

import { NextStepGuidance } from '../NextStepGuidance'

import { ConversationPicker } from './ConversationPicker'

import './Minigames.css'

import '../onboardingHints.css'



type CompanionInfo = { id: string; name: string }



type MinigameHubProps = {

  buildings: Record<string, number>

  villageStage: number

  resourceLabels: Record<string, string>

  companions: CompanionInfo[]

  unlockAtByBuilding: Record<string, number>

  focusBuildingId?: string | null

  nextStepContext: NextStepContext

  onPlay: (activityId: string) => void

  onNavigateNextStep?: (target: NextStepTarget) => void

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

  nextStepContext,

  onPlay,

  onNavigateNextStep,

}: MinigameHubProps) {

  const [conversationPickerOpen, setConversationPickerOpen] = useState(false)

  const companionById = Object.fromEntries(companions.map((companion) => [companion.id, companion]))



  const sortedActivities = useMemo(

    () => sortActivitiesByUnlock(BUILDING_ACTIVITIES, unlockAtByBuilding, BUILDING_UNLOCK_ORDER),

    [unlockAtByBuilding],

  )



  const conversationActivities = useMemo(
    () => {
      const items = sortedActivities.filter((activity) => activity.minigameType === 'conversation')
      if (!CURATED_PARLER_ONLY) return items
      return items.filter((activity) => activity.companionId === CURATED_PARLER_COMPANION_ID)
    },
    [sortedActivities],
  )



  const gameplayActivities = useMemo(

    () => sortedActivities.filter((activity) => activity.minigameType !== 'conversation'),

    [sortedActivities],

  )



  const newGameplayActivities = useMemo(

    () =>

      NEW_MINIGAME_IDS.map((id) => {

        if (id === PARLER_HUB_ACTIVITY_ID) return PARLER_HUB_ACTIVITY

        return gameplayActivities.find((activity) => activity.id === id)

      }).filter((activity): activity is (typeof gameplayActivities)[number] | typeof PARLER_HUB_ACTIVITY =>

        Boolean(activity),

      ),

    [gameplayActivities],

  )



  const legacyGameplayActivities = useMemo(

    () => gameplayActivities.filter((activity) => !NEW_MINIGAME_IDS.includes(activity.id)),

    [gameplayActivities],

  )



  const unlockedConversationCount = useMemo(

    () =>

      conversationActivities.filter((activity) =>

        isActivityUnlocked(activity.buildingId, villageStage, unlockAtByBuilding),

      ).length,

    [conversationActivities, unlockAtByBuilding, villageStage],

  )



  const parlerLinkedCompanions = useMemo(

    () =>

      [

        ...new Set(

          conversationActivities

            .map((activity) => companionById[activity.companionId]?.name)

            .filter((name): name is string => Boolean(name)),

        ),

      ],

    [companionById, conversationActivities],

  )



  const nextStep = useMemo(() => computeNextStep(nextStepContext), [nextStepContext])

  const recommendedActivityId = nextStep.recommendedActivityId



  const pickConversation = (activityId: string) => {

    setConversationPickerOpen(false)

    onPlay(activityId)

  }



  const renderActivityCard = (activity: (typeof sortedActivities)[number] | typeof PARLER_HUB_ACTIVITY) => {

    const isParlerHub = activity.id === PARLER_HUB_ACTIVITY_ID

    const requiredStage = unlockAtByBuilding[activity.buildingId] ?? 0

    const locked = isParlerHub

      ? unlockedConversationCount === 0

      : !isActivityUnlocked(activity.buildingId, villageStage, unlockAtByBuilding)

    const level = isParlerHub

      ? unlockedConversationCount

      : (buildings[activity.buildingId] ?? 0)

    const companion = companionById[activity.companionId]

    const companionName = companion?.name ?? activity.companionId

    const resourceLabel = resourceLabels[activity.focusResource] ?? activity.focusResource

    const focused = focusBuildingId === activity.buildingId

    const unlockLabel = getCurrentStage(requiredStage).name

    const supportSystem = isParlerHub ? null : supportSystemForActivity(activity)

    const linkedCompanions = isParlerHub

      ? parlerLinkedCompanions

      : supportSystem

        ? listCompanionNamesForSystem(supportSystem)

        : []

    const recommended =

      !locked &&

      (recommendedActivityId === activity.id ||

        (isParlerHub &&

          recommendedActivityId != null &&

          conversationActivities.some((entry) => entry.id === recommendedActivityId)))

    const detailsTooltip = isParlerHub

      ? [

          activity.description,

          `Inspire de: ${activity.inspiration}`,

          `${conversationActivities.length} compagnons au total · ${unlockedConversationCount} debloque${unlockedConversationCount > 1 ? 's' : ''}`,

          'Distinct des conversations de lien gratuites (onglet Liens).',

        ].join(' · ')

      : [

          activity.description,

          `Inspire de: ${activity.inspiration}`,

          `Deblocage: ${unlockLabel}`,

          activity.persistent ? 'Progression sauvegardee entre les sessions.' : null,

          linkedCompanions.length > 0 ? `Compagnons lies : ${linkedCompanions.join(', ')}` : null,

        ]

          .filter(Boolean)

          .join(' · ')



    return (

      <article

        className={`panel minigame-card ${locked ? 'locked' : ''} ${focused ? 'focused' : ''} ${recommended ? 'minigame-card--recommended' : ''}`}

        key={activity.id}

        style={{ '--mg-accent': activity.accent } as CSSProperties}

      >

        <div className="minigame-card-top">

          <span className="minigame-card-icon">{activity.icon}</span>

          <div className="minigame-card-head">

            <h3>

              {activity.name}

              {recommended ? (

                <span className="minigame-card-recommended-chip"> Recommandé</span>

              ) : null}

            </h3>

            <small>{activity.tagline}</small>

          </div>

        </div>



        <p className="minigame-card-support-line">{activity.description}</p>

        {linkedCompanions.length > 0 ? (

          <p className="minigame-card-linked-companions">

            Compagnons liés : {linkedCompanions.slice(0, 3).join(', ')}

            {linkedCompanions.length > 3 ? ` (+${linkedCompanions.length - 3})` : ''}

          </p>

        ) : null}



        <div className="minigame-card-meta">

          <MetaChip

            chipId={`mg-tip-companion-${activity.id}`}

            icon="💞"

            label={companionName}

            tooltip={

              isParlerHub

                ? `${conversationActivities.length} compagnons disponibles — choix au lancement.`

                : `Compagnon: ${companionName}`

            }

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

            icon={isParlerHub ? '✨' : '🏗️'}

            label={`${level}`}

            tooltip={

              isParlerHub

                ? `${unlockedConversationCount} compagnon${unlockedConversationCount > 1 ? 's' : ''} debloque${unlockedConversationCount > 1 ? 's' : ''} sur ${conversationActivities.length}.`

                : `Niveau du batiment: ${level}`

            }

          />

          <MetaChip

            chipId={`mg-tip-details-${activity.id}`}

            compact

            icon="ℹ️"

            label="Details"

            tooltip={detailsTooltip}

          />

        </div>



        <button

          disabled={locked}

          type="button"

          onClick={() => {

            if (isParlerHub) {

              setConversationPickerOpen(true)

              return

            }

            onPlay(activity.id)

          }}

        >

          {locked ? (isParlerHub ? 'Debloquer un compagnon' : `Stade ${unlockLabel}`) : 'Jouer'}

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



      <NextStepGuidance suggestion={nextStep} onNavigate={onNavigateNextStep} />



      <section aria-labelledby="minigame-hub-new-title" className="minigame-hub-section">

        <header className="minigame-hub-section-head">

          <div>

            <p className="eyebrow">Récent</p>

            <h3 id="minigame-hub-new-title">Nouveaux mini-jeux</h3>

          </div>

          <p>Chantier, chasse, refuge et affinité — les quatre systèmes travaillés ensemble.</p>

        </header>

        <div className="grid mini-grid">

          {newGameplayActivities.map((activity) => renderActivityCard(activity))}

        </div>

      </section>



      {legacyGameplayActivities.length > 0 ? (

        <section aria-labelledby="minigame-hub-legacy-title" className="minigame-hub-section">

          <header className="minigame-hub-section-head">

            <div>

              <p className="eyebrow">Archive gameplay</p>

              <h3 id="minigame-hub-legacy-title">Anciens mini-jeux</h3>

            </div>

            <p>Les activités codées au tout début — puzzles, rythme, fusion et défense par bâtiment.</p>

          </header>

          <div className="grid mini-grid">

            {legacyGameplayActivities.map((activity) => renderActivityCard(activity))}

          </div>

        </section>

      ) : null}



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


