import { useMemo } from 'react'

import type { ResourceKey } from '../data/buildingActivities'

import { getCompanionBondDisplayName } from '../data/companionBondConversations'

import { getDefaultMinigameLabActivityId } from '../data/minigameLab'

import { getActivityById } from '../data/buildingActivities'

import { MinigamePlayer } from '../components/minigames/MinigamePlayer'

import './MinigameLab.css'



const RESOURCE_LABELS: Record<ResourceKey, string> = {

  coins: 'Pieces',

  wood: 'Bois',

  stone: 'Pierre',

  food: 'Vivres',

  silk: 'Soie',

  mana: 'Mana',

  renown: 'Renom',

  ingredients: 'Ingredients',

  crystals: 'Cristaux',

  gifts: 'Cadeaux',

  tickets: 'Tickets',

  stardust: 'Poussiere stellaire',

}



/** Lab 5174 — lance directement le mini-jeu WIP par défaut (Color Toon). */

export function MinigameLabApp() {

  const activity = useMemo(() => {

    const id = getDefaultMinigameLabActivityId()

    return getActivityById(id)

  }, [])



  if (!activity) {

    return (

      <div className="minigame-lab">

        <p>Aucune activité lab — vérifiez `MINIGAME_LAB_WIP_IDS`.</p>

      </div>

    )

  }



  return (

    <div className="minigame-lab minigame-lab--playing minigame-lab--direct">

      <MinigamePlayer

        activity={activity}

        companionName={getCompanionBondDisplayName(activity.companionId)}

        buildingName={activity.tagline}

        resourceLabel={RESOURCE_LABELS[activity.focusResource]}

        onComplete={() => undefined}

        onClose={() => undefined}

        companionAffinity={5}

        villageStage={99}

      />

    </div>

  )

}

