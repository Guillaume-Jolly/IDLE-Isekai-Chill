import type { BuildingActivity, MinigameType } from './buildingActivities'
import type { CompanionSupportSystemId } from './companionSupport'

export const SYSTEM_HINT_BADGE = 'Conseil compagnon'

export const SYSTEM_CONTEXT_HINTS: Record<
  CompanionSupportSystemId,
  { phrase: string; shortLabel: string }
> = {
  'moon-farm': {
    shortLabel: 'Ferme lunaire',
    phrase: 'Assigne des Myrions et surveille les biomes pour produire doucement.',
  },
  refuge: {
    shortLabel: 'Refuge',
    phrase: 'Les Myrions capturés y reposent — ils alimentent le chantier et la chasse.',
  },
  hunt: {
    shortLabel: 'Chasse',
    phrase: 'Capture de nouveaux Myrions pour le Refuge et la Ferme lunaire.',
  },
  village: {
    shortLabel: 'Village',
    phrase: 'Le village transforme tes ressources en progression durable.',
  },
  inventory: {
    shortLabel: 'Inventaire',
    phrase: 'Tes ressources principales sont utilisées dans les activités du Havre.',
  },
  gacha: {
    shortLabel: 'Gacha',
    phrase: 'Les invocations ajoutent de nouveaux alliés à ton équipe.',
  },
  prestige: {
    shortLabel: 'Prestige astral',
    phrase: 'Le prestige astral relance le chantier sans perdre tes liens.',
  },
}

export function supportSystemForMinigameType(type: MinigameType): CompanionSupportSystemId | null {
  switch (type) {
    case 'myrion-worksite':
    case 'idle-farm':
    case 'tile-merge':
      return 'moon-farm'
    case 'pet-sanctuary':
    case 'dressage':
      return 'refuge'
    case 'familiar-capture':
      return 'hunt'
    default:
      return null
  }
}

export function supportSystemForActivity(activity: BuildingActivity): CompanionSupportSystemId | null {
  return supportSystemForMinigameType(activity.minigameType)
}
