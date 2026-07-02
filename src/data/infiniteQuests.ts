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

export type DailyQuestBundle = {
  dayKey: string
  quests: InfiniteQuest[]
}

export type QuestSave = {
  daily: DailyQuestBundle[]
  infinite: InfiniteQuest[]
  totalClaimed: number
  lastDailyGeneratedDay?: string
}

/** @deprecated ancien format */
export type LegacyQuestSave = {
  board?: InfiniteQuest[]
  totalClaimed?: number
}

export const DAILY_QUESTS_PER_DAY = 10
export const MAX_DAILY_DAY_STACK = 10
export const INFINITE_BOARD_SIZE = 10

export type QuestContext = {
  buildingIds: string[]
  companionIds: string[]
  activityIds: string[]
}

export const createStarterQuestSave = (): QuestSave => ({
  daily: [],
  infinite: [],
  totalClaimed: 0,
})

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const BUILDING_SHORT: Record<string, string> = {
  inn: "l'auberge",
  'mist-garden': 'le jardin',
  'ribbon-workshop': "l'atelier",
  'clear-spring': 'la source',
  'moon-farm': 'la ferme',
  'arcane-library': 'la bibliothèque',
  'traveler-theater': 'le théâtre',
  'star-market': 'le marché',
}

const COMPANION_SHORT: Record<string, string> = {
  lyra: 'Lyra',
  maeve: 'Maeve',
  seren: 'Seren',
  nami: 'Nami',
  iris: 'Iris',
  kael: 'Kael',
  solene: 'Solène',
  talia: 'Talia',
  mira: 'Mira',
  sora: 'Sora',
  asha: 'Asha',
  elwen: 'Elwen',
  noa: 'Noa',
  zelie: 'Zélie',
}

const QUEST_TEMPLATES: Array<(ctx: QuestContext) => InfiniteQuest> = [
  (ctx) => ({
    id: uid(),
    title: 'Bâtiments du havre',
    description: `Améliore ${BUILDING_SHORT[ctx.buildingIds[0]] ?? 'un bâtiment'}.`,
    kind: 'upgrade-building',
    goal: 1,
    progress: 0,
    buildingId: ctx.buildingIds[0],
    reward: { coins: 120, wood: 28, stone: 22 },
  }),
  () => ({
    id: uid(),
    title: 'Double expansion',
    description: 'Améliore 2 bâtiments (n’importe lesquels).',
    kind: 'upgrade-building',
    goal: 2,
    progress: 0,
    reward: { stone: 45, wood: 45, coins: 180, crystals: 8 },
  }),
  () => ({
    id: uid(),
    title: 'Pause mini-jeu',
    description: 'Termine un mini-jeu.',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    reward: { renown: 18, gifts: 12, coins: 65 },
  }),
  () => ({
    id: uid(),
    title: 'Double session',
    description: 'Termine 2 mini-jeux.',
    kind: 'play-minigame',
    goal: 2,
    progress: 0,
    reward: { crystals: 22, tickets: 1, renown: 24, stardust: 6 },
  }),
  () => ({
    id: uid(),
    title: 'Chasse aux Myrions',
    description: 'Termine une session de chasse (capture).',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: 'farm-capture',
    reward: { wood: 40, gifts: 18, stardust: 10 },
  }),
  () => ({
    id: uid(),
    title: 'Chantier du havre',
    description: 'Passe une session au Chantier du havre (filons Myrions).',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: 'farm-worksite',
    reward: { stone: 35, wood: 35, food: 30 },
  }),
  () => ({
    id: uid(),
    title: 'Refuge des Myrions',
    description: 'Passe une session au Refuge des Myrions (dressage).',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: 'farm-dressage',
    reward: { gifts: 24, renown: 14, food: 35 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Entraînement du jour',
    description: `Entraîne ${COMPANION_SHORT[ctx.companionIds[0]] ?? 'un compagnon'}.`,
    kind: 'train-companion',
    goal: 1,
    progress: 0,
    companionId: ctx.companionIds[0],
    reward: { mana: 35, food: 50, ingredients: 22 },
  }),
  () => ({
    id: uid(),
    title: 'Routine d’entraînement',
    description: 'Entraîne 2 compagnons différents.',
    kind: 'train-companion',
    goal: 2,
    progress: 0,
    reward: { mana: 55, coins: 90, silk: 15 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Moment complice',
    description: `Renforce l’affinité de ${COMPANION_SHORT[ctx.companionIds[2] ?? ctx.companionIds[0]] ?? 'un compagnon'}.`,
    kind: 'raise-affinity',
    goal: 1,
    progress: 0,
    companionId: ctx.companionIds[2] ?? ctx.companionIds[0],
    reward: { gifts: 28, silk: 18, renown: 14 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Cœur à cœur',
    description: `Conversation intime avec ${COMPANION_SHORT[ctx.companionIds[3] ?? ctx.companionIds[1]] ?? 'un compagnon'}.`,
    kind: 'conversation',
    goal: 1,
    progress: 0,
    companionId: ctx.companionIds[3] ?? ctx.companionIds[1],
    reward: { stardust: 12, mana: 40, gifts: 22 },
  }),
  () => ({
    id: uid(),
    title: 'Parole douce',
    description: 'Réussis une conversation intime (mini-jeu Parler).',
    kind: 'conversation',
    goal: 1,
    progress: 0,
    reward: { stardust: 10, mana: 35, renown: 12 },
  }),
  () => ({
    id: uid(),
    title: 'Récolte patiente',
    description: 'Laisse la production avancer (3 min de jeu actif).',
    kind: 'earn-passive',
    goal: 3,
    progress: 0,
    reward: { food: 80, ingredients: 35, coins: 55 },
  }),
  () => ({
    id: uid(),
    title: 'Veille du havre',
    description: 'Laisse la production avancer (5 min de jeu actif).',
    kind: 'earn-passive',
    goal: 5,
    progress: 0,
    reward: { coins: 100, mana: 25, wood: 30, stone: 25 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Atelier en fête',
    description: `Améliore ${BUILDING_SHORT[ctx.buildingIds[2] ?? ctx.buildingIds[1]] ?? 'un bâtiment'} puis joue un mini-jeu.`,
    kind: 'upgrade-building',
    goal: 1,
    progress: 0,
    buildingId: ctx.buildingIds[2] ?? ctx.buildingIds[1],
    reward: { silk: 20, coins: 140, tickets: 0.5 },
  }),
  () => ({
    id: uid(),
    title: 'Triple combo',
    description: 'Termine 3 mini-jeux.',
    kind: 'play-minigame',
    goal: 3,
    progress: 0,
    reward: { crystals: 30, stardust: 14, renown: 30, tickets: 1 },
  }),
  (ctx) => ({
    id: uid(),
    title: 'Lien profond',
    description: `Monte l’affinité de ${COMPANION_SHORT[ctx.companionIds[4] ?? ctx.companionIds[0]] ?? 'un compagnon'} deux fois.`,
    kind: 'raise-affinity',
    goal: 2,
    progress: 0,
    companionId: ctx.companionIds[4] ?? ctx.companionIds[0],
    reward: { gifts: 40, stardust: 8, silk: 25 },
  }),
  () => ({
    id: uid(),
    title: 'Grimoire oublié',
    description: 'Termine le mini-jeu mémoire (bibliothèque).',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: 'library-memory',
    reward: { mana: 45, crystals: 12, renown: 10 },
  }),
  () => ({
    id: uid(),
    title: 'Bazar scintillant',
    description: 'Termine le match-3 du marché.',
    kind: 'play-minigame',
    goal: 1,
    progress: 0,
    activityId: 'market-swap',
    reward: { crystals: 28, coins: 110, tickets: 0.5 },
  }),
]

export function createQuestContext(buildingIds: string[], companionIds: string[]): QuestContext {
  return {
    buildingIds: [...buildingIds].sort(() => Math.random() - 0.5),
    companionIds: [...companionIds].sort(() => Math.random() - 0.5),
    activityIds: BUILDING_ACTIVITIES.map((activity) => activity.id),
  }
}

export function getLocalDayKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDailyBundleLabel(dayKey: string, todayKey = getLocalDayKey()): string {
  if (dayKey === todayKey) return "Aujourd'hui"
  const today = new Date(`${todayKey}T12:00:00`)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayKey = getLocalDayKey(yesterday)
  if (dayKey === yesterdayKey) return 'Hier'
  const [y, m, d] = dayKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function generateQuestBoard(
  buildingIds: string[],
  companionIds: string[],
  count = INFINITE_BOARD_SIZE,
): InfiniteQuest[] {
  const ctx = createQuestContext(buildingIds, companionIds)
  const shuffled = [...QUEST_TEMPLATES].sort(() => Math.random() - 0.5)
  const factories = shuffled.length >= count ? shuffled.slice(0, count) : shuffled
  const quests = factories.map((factory) => factory(ctx))
  while (quests.length < count) {
    quests.push(generateSingleQuest(ctx))
  }
  return quests
}

export function generateSingleQuest(ctx: QuestContext): InfiniteQuest {
  return pick(QUEST_TEMPLATES)(ctx)
}

function pruneEmptyDailyBundles(daily: DailyQuestBundle[]): DailyQuestBundle[] {
  return daily.filter((bundle) => bundle.quests.length > 0)
}

function capDailyBundles(daily: DailyQuestBundle[]): DailyQuestBundle[] {
  const sorted = [...daily].sort((a, b) => b.dayKey.localeCompare(a.dayKey))
  return sorted.slice(0, MAX_DAILY_DAY_STACK)
}

export function ensureDailyQuests(save: QuestSave, ctx: QuestContext): QuestSave {
  const today = getLocalDayKey()
  let daily = pruneEmptyDailyBundles(save.daily)

  if (!daily.some((bundle) => bundle.dayKey === today)) {
    daily = capDailyBundles([
      { dayKey: today, quests: generateQuestBoard(ctx.buildingIds, ctx.companionIds, DAILY_QUESTS_PER_DAY) },
      ...daily,
    ])
  }

  return {
    ...save,
    daily,
    lastDailyGeneratedDay: today,
  }
}

export function ensureInfiniteBoard(save: QuestSave, ctx: QuestContext): QuestSave {
  const nextCtx = createQuestContext(ctx.buildingIds, ctx.companionIds)
  const infinite = [...save.infinite]
  while (infinite.length < INFINITE_BOARD_SIZE) {
    infinite.push(generateSingleQuest(nextCtx))
  }
  return {
    ...save,
    infinite: infinite.slice(0, INFINITE_BOARD_SIZE),
  }
}

export function syncQuestSave(save: QuestSave, ctx: QuestContext): QuestSave {
  return ensureInfiniteBoard(ensureDailyQuests(save, ctx), ctx)
}

export function createInitialQuestSave(buildingIds: string[], companionIds: string[]): QuestSave {
  const ctx = createQuestContext(buildingIds, companionIds)
  return syncQuestSave(createStarterQuestSave(), ctx)
}

export function normalizeQuestSave(
  raw: (Partial<QuestSave> & LegacyQuestSave) | null | undefined,
  ctx: QuestContext,
): QuestSave {
  if (raw?.daily && Array.isArray(raw.infinite)) {
    return syncQuestSave(
      {
        daily: raw.daily,
        infinite: raw.infinite,
        totalClaimed: raw.totalClaimed ?? 0,
        lastDailyGeneratedDay: raw.lastDailyGeneratedDay,
      },
      ctx,
    )
  }

  const legacyBoard = raw?.board ?? []
  return syncQuestSave(
    {
      ...createStarterQuestSave(),
      infinite: legacyBoard,
      totalClaimed: raw?.totalClaimed ?? 0,
    },
    ctx,
  )
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
    if (
      (kind === 'train-companion' || kind === 'raise-affinity' || kind === 'conversation') &&
      quest.companionId &&
      quest.goal === 1 &&
      detail?.companionId !== quest.companionId
    ) {
      return quest
    }
    if (kind === 'play-minigame' && quest.activityId && detail?.activityId !== quest.activityId) {
      return quest
    }

    return { ...quest, progress: Math.min(quest.goal, quest.progress + 1) }
  })
}

export function bumpQuestSaveProgress(
  save: QuestSave,
  kind: QuestKind,
  detail?: {
    buildingId?: string
    companionId?: string
    activityId?: string
  },
): QuestSave {
  return {
    ...save,
    daily: save.daily.map((bundle) => ({
      ...bundle,
      quests: bumpQuestProgress(bundle.quests, kind, detail),
    })),
    infinite: bumpQuestProgress(save.infinite, kind, detail),
  }
}

export function isQuestComplete(quest: InfiniteQuest) {
  return quest.progress >= quest.goal
}

export type QuestClaimResult = {
  save: QuestSave
  reward: Cost | null
  pool: 'daily' | 'infinite' | null
}

export function claimQuestInSave(save: QuestSave, questId: string, ctx: QuestContext): QuestClaimResult {
  const dailyIndex = save.daily.findIndex((bundle) => bundle.quests.some((quest) => quest.id === questId))
  if (dailyIndex >= 0) {
    const quest = save.daily[dailyIndex].quests.find((entry) => entry.id === questId)
    if (!quest || !isQuestComplete(quest)) {
      return { save, reward: null, pool: null }
    }
    const daily = save.daily.map((bundle, index) =>
      index === dailyIndex
        ? { ...bundle, quests: bundle.quests.filter((entry) => entry.id !== questId) }
        : bundle,
    )
    return {
      save: {
        ...save,
        daily: pruneEmptyDailyBundles(daily),
        totalClaimed: save.totalClaimed + 1,
      },
      reward: quest.reward,
      pool: 'daily',
    }
  }

  const infiniteIndex = save.infinite.findIndex((quest) => quest.id === questId)
  if (infiniteIndex >= 0) {
    const quest = save.infinite[infiniteIndex]
    if (!isQuestComplete(quest)) {
      return { save, reward: null, pool: null }
    }
    const nextCtx = createQuestContext(ctx.buildingIds, ctx.companionIds)
    const infinite = save.infinite.filter((entry) => entry.id !== questId)
    infinite.push(generateSingleQuest(nextCtx))
    while (infinite.length < INFINITE_BOARD_SIZE) {
      infinite.push(generateSingleQuest(nextCtx))
    }
    return {
      save: {
        ...save,
        infinite: infinite.slice(0, INFINITE_BOARD_SIZE),
        totalClaimed: save.totalClaimed + 1,
      },
      reward: quest.reward,
      pool: 'infinite',
    }
  }

  return { save, reward: null, pool: null }
}

export function countActiveQuests(save: QuestSave): number {
  const dailyCount = save.daily.reduce((sum, bundle) => sum + bundle.quests.length, 0)
  return dailyCount + save.infinite.length
}
