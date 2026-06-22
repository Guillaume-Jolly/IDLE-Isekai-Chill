import type { Cost, ResourceKey } from './resources'
import { BUILDING_ACTIVITIES } from './buildingActivities'

export type QuestKind =
  | 'upgrade-building'
  | 'play-minigame'
  | 'train-companion'
  | 'raise-affinity'
  | 'conversation'
  | 'earn-passive'

export type InfiniteQuest = {
  id: string
  title: string
  description: string
  kind: QuestKind
  goal: number
  progress: number
  reward: Cost
  buildingId?: string
  companionId?: string
  activityId?: string
  resourceKey?: ResourceKey
}

export type QuestSave = {
  board: InfiniteQuest[]
  totalClaimed: number
}

export const createStarterQuestSave = (): QuestSave => ({
  board: [],
  totalClaimed: 0,
})

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

type QuestContext = {
  buildingIds: string[]
  companionIds: string[]
  activityIds: string[]
}

const QUEST_TEMPLATES: Array<(ctx: QuestContext) => InfiniteQuest> = [
  (ctx) => ({
    id: uid(),
    title: 'Chantier du village',
    description: `Ameliore ${BUILDING_SHORT[ctx.buildingIds[0]] ?? 'un batiment'} une fois.`,
    kind: 'upgrade-building',
    goal: 1,
    progress: 0,
    buildingId: ctx.buildingIds[0],
    reward: { coins: 90, wood: 20, stone: 15 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Pause mini-jeu',
    description: 'Termine un mini-jeu une fois.',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: pick(ctx.activityIds),
    reward: { renown: 12, gifts: 8, coins: 50 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Entrainement du jour',
    description: `Entraine ${COMPANION_SHORT[ctx.companionIds[0]] ?? 'un compagnon'}.`,
    kind: 'train-companion',
    goal: 1,
    progress: 0,
    companionId: ctx.companionIds[0],
    reward: { mana: 25, food: 40, ingredients: 15 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Moment complice',
    description: `Renforce l affinite de ${COMPANION_SHORT[ctx.companionIds[1]] ?? 'un compagnon'}.`,
    kind: 'raise-affinity',
    goal: 1,
    progress: 0,
    companionId: ctx.companionIds[1],
    reward: { gifts: 20, silk: 12, renown: 10 },
  }),
  () => ({
    id: uid(),
    title: 'Coeur a coeur',
    description: 'Reussis une conversation intime (mini-jeu Liens).',
    kind: 'conversation',
    goal: 1,
    progress: 0,
    reward: { stardust: 8, mana: 30, gifts: 15 },
  }),
  () => ({
    id: uid(),
    title: 'Recolte patiente',
    description: 'Laisse la production idle avancer (3 min de jeu actif).',
    kind: 'earn-passive',
    goal: 3,
    progress: 0,
    reward: { food: 60, ingredients: 25, coins: 40 },
  }),
  () => ({
    id: uid(),
    title: 'Double session',
    description: 'Termine 2 mini-jeux.',
    kind: 'play-minigame',
    goal: 2,
    progress: 0,
    reward: { crystals: 15, tickets: 0.5, renown: 18 },
  }),
  () => ({
    id: uid(),
    title: 'Expansion',
    description: 'Ameliore 2 batiments (n importe lesquels).',
    kind: 'upgrade-building',
    goal: 2,
    progress: 0,
    reward: { stone: 35, wood: 35, coins: 120 },
  }),
]

const BUILDING_SHORT: Record<string, string> = {
  inn: 'l auberge',
  'mist-garden': 'le jardin',
  'ribbon-workshop': 'l atelier',
  'clear-spring': 'la source',
  'moon-farm': 'la ferme',
  'arcane-library': 'la bibliotheque',
  'traveler-theater': 'le theatre',
  'star-market': 'le marche',
}

const COMPANION_SHORT: Record<string, string> = {
  lyra: 'Lyra',
  maeve: 'Maeve',
  seren: 'Seren',
  nami: 'Nami',
  iris: 'Iris',
  kael: 'Kael',
  solene: 'Solene',
  talia: 'Talia',
  mira: 'Mira',
  sora: 'Sora',
}

export function generateQuestBoard(
  buildingIds: string[],
  companionIds: string[],
  count = 6,
): InfiniteQuest[] {
  const ctx: QuestContext = {
    buildingIds: [...buildingIds].sort(() => Math.random() - 0.5),
    companionIds: [...companionIds].sort(() => Math.random() - 0.5),
    activityIds: BUILDING_ACTIVITIES.map((a) => a.id),
  }

  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((factory) => factory(ctx))
}

export function bumpQuestProgress(
  board: InfiniteQuest[],
  kind: QuestKind,
  detail?: {
    buildingId?: string
    companionId?: string
    activityId?: string
  },
): InfiniteQuest[] {
  return board.map((quest) => {
    if (quest.progress >= quest.goal) {
      return quest
    }
    if (quest.kind !== kind) {
      return quest
    }

    if (kind === 'upgrade-building' && quest.buildingId && detail?.buildingId !== quest.buildingId) {
      return quest
    }
    if (kind === 'train-companion' && quest.companionId && detail?.companionId !== quest.companionId) {
      return quest
    }
    if (kind === 'raise-affinity' && quest.companionId && detail?.companionId !== quest.companionId) {
      return quest
    }
    if (kind === 'play-minigame' && quest.activityId && detail?.activityId !== quest.activityId) {
      /* compte quand meme si pas d activityId specifique */
    }

    return { ...quest, progress: Math.min(quest.goal, quest.progress + 1) }
  })
}

export function isQuestComplete(quest: InfiniteQuest) {
  return quest.progress >= quest.goal
}
