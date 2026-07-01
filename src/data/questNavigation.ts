import type { ViewKey } from '../components/AppNav'
import type { NextStepTarget } from './nextStepGuidance'
import type { InfiniteQuest } from './infiniteQuests'

export type QuestNavigateTarget = NextStepTarget | { kind: 'building'; buildingId: string } | { kind: 'companion'; companionId: string }

const CONVERSATION_ACTIVITY_BY_COMPANION: Record<string, string> = {
  lyra: 'library-hearts',
  maeve: 'market-hearts',
  seren: 'inn-hearts',
  nami: 'kitchen-hearts',
  iris: 'garden-hearts',
  kael: 'theater-hearts',
  runa: 'forge-hearts',
  solene: 'spring-hearts',
  talia: 'farm-hearts',
  mira: 'workshop-hearts',
  asha: 'cascade-hearts',
  elwen: 'archive-hearts',
  noa: 'lab-hearts',
  sora: 'barn-hearts',
  zelie: 'salon-hearts',
}

export function getQuestNavigationTarget(quest: InfiniteQuest): QuestNavigateTarget {
  switch (quest.kind) {
    case 'upgrade-building':
      if (quest.buildingId) {
        return { kind: 'building', buildingId: quest.buildingId }
      }
      return { kind: 'view', view: 'buildings' satisfies ViewKey }
    case 'play-minigame':
      if (quest.activityId) {
        return { kind: 'activity', activityId: quest.activityId }
      }
      return { kind: 'view', view: 'miniGames' }
    case 'train-companion':
    case 'raise-affinity':
      if (quest.companionId) {
        return { kind: 'companion', companionId: quest.companionId }
      }
      return { kind: 'view', view: 'companions' }
    case 'conversation': {
      const activityId =
        quest.activityId ??
        (quest.companionId ? CONVERSATION_ACTIVITY_BY_COMPANION[quest.companionId] : undefined) ??
        'spring-hearts'
      return { kind: 'activity', activityId }
    }
    case 'earn-passive':
      return { kind: 'view', view: 'village' }
    default:
      return { kind: 'none' }
  }
}

export function isQuestNavigationActionable(target: QuestNavigateTarget): boolean {
  return target.kind !== 'none'
}
