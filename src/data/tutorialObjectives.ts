import type { Cost } from './resources'
import type { MinigameSave } from './minigameSave'
import { buildPlayerCollection } from './biomeProgression'

export type TutorialObjectiveId =
  | 'collect-resources'
  | 'upgrade-building'
  | 'open-hunt'
  | 'capture-myrion'
  | 'open-refuge'
  | 'refuge-care'
  | 'open-companions'
  | 'play-link'
  | 'open-inventory-familiers'
  | 'prepare-next-biome'

export type TutorialObjectiveSave = {
  completedIds: TutorialObjectiveId[]
  claimedIds: TutorialObjectiveId[]
  signals: Partial<Record<TutorialObjectiveId, true>>
}

export type TutorialGameContext = {
  resources: Record<string, number>
  buildings: Record<string, number>
  minigameSave: MinigameSave
}

export type TutorialObjectiveDef = {
  id: TutorialObjectiveId
  title: string
  description: string
  reward: Cost
  order: number
}

const STARTER_TOTAL = 450 + 180 + 140 + 260 + 40 + 80 + 30 + 45 + 90 + 60 + 5 + 10

export const TUTORIAL_OBJECTIVES: TutorialObjectiveDef[] = [
  {
    id: 'collect-resources',
    order: 1,
    title: 'Première récolte',
    description: 'Laisse le village produire des ressources ou ouvre l’onglet Village.',
    reward: { coins: 40, food: 25 },
  },
  {
    id: 'upgrade-building',
    order: 2,
    title: 'Bâtiments du havre',
    description: 'Améliore un bâtiment depuis l’onglet Bâtiments ou la carte du village.',
    reward: { wood: 30, stone: 25, coins: 50 },
  },
  {
    id: 'open-hunt',
    order: 3,
    title: 'Portes de la chasse',
    description: 'Ouvre le mini-jeu Chasse aux Myrions depuis Mini-jeux.',
    reward: { renown: 8, tickets: 0.25 },
  },
  {
    id: 'capture-myrion',
    order: 4,
    title: 'Première capture',
    description: 'Capture un Myrion en chasse (ou récupère une capture en attente).',
    reward: { gifts: 12, ingredients: 15 },
  },
  {
    id: 'open-refuge',
    order: 5,
    title: 'Refuge des Myrions',
    description: 'Ouvre le mini-jeu Refuge des Myrions depuis Mini-jeux.',
    reward: { food: 40, mana: 15 },
  },
  {
    id: 'refuge-care',
    order: 6,
    title: 'Soin bienveillant',
    description: 'Nourris, câline ou joue avec un Myrion dans le refuge.',
    reward: { silk: 10, stardust: 3 },
  },
  {
    id: 'open-companions',
    order: 7,
    title: 'Liens du havre',
    description: 'Visite l’onglet Compagnons.',
    reward: { gifts: 15, renown: 10 },
  },
  {
    id: 'play-link',
    order: 8,
    title: 'Conversation intime',
    description: 'Termine un mini-jeu Lien (conversation) avec un compagnon.',
    reward: { mana: 25, stardust: 5 },
  },
  {
    id: 'open-inventory-familiers',
    order: 9,
    title: 'Inventaire Myrions',
    description: 'Consulte l’inventaire (Myrions et ressources).',
    reward: { crystals: 8, coins: 35 },
  },
  {
    id: 'prepare-next-biome',
    order: 10,
    title: 'Horizon suivant',
    description: 'Capture au moins 5 Myrions pour préparer le biome Forêt ancienne.',
    reward: { tickets: 0.5, renown: 20, wood: 40 },
  },
]

export const createStarterTutorialSave = (): TutorialObjectiveSave => ({
  completedIds: [],
  claimedIds: [],
  signals: {},
})

const resourceTotal = (resources: Record<string, number>) =>
  Object.values(resources).reduce((sum, value) => sum + (value ?? 0), 0)

const maxBuildingLevel = (buildings: Record<string, number>) =>
  Math.max(0, ...Object.values(buildings))

const hasMyrionCapture = (save: MinigameSave) =>
  save.pets.length > 0 ||
  (save.pendingHuntCaptures?.length ?? 0) > 0 ||
  (save.captureStats?.totalCaught ?? 0) > 0

const hasRefugeCare = (save: MinigameSave) =>
  save.pets.some(
    (pet) => pet.affectionLevel > 0 || pet.joy > 72 || pet.hunger < 85 || pet.energy > 85,
  )

export function isTutorialObjectiveMet(
  id: TutorialObjectiveId,
  ctx: TutorialGameContext,
  signals: TutorialObjectiveSave['signals'],
): boolean {
  if (signals[id]) return true

  switch (id) {
    case 'collect-resources':
      return resourceTotal(ctx.resources) > STARTER_TOTAL + 5
    case 'upgrade-building':
      return maxBuildingLevel(ctx.buildings) > 1
    case 'open-hunt':
      return Boolean(signals['open-hunt']) || hasMyrionCapture(ctx.minigameSave)
    case 'capture-myrion':
      return hasMyrionCapture(ctx.minigameSave)
    case 'open-refuge':
      return Boolean(signals['open-refuge']) || ctx.minigameSave.pets.length > 0
    case 'refuge-care':
      return hasRefugeCare(ctx.minigameSave)
    case 'open-companions':
      return Boolean(signals['open-companions'])
    case 'play-link':
      return Boolean(signals['play-link'])
    case 'open-inventory-familiers':
      return Boolean(signals['open-inventory-familiers'])
    case 'prepare-next-biome': {
      const collection = buildPlayerCollection(
        ctx.minigameSave.pets,
        ctx.minigameSave.captureStats,
      )
      return collection.totalCaught >= 5
    }
    default:
      return false
  }
}

export function syncTutorialObjectives(
  save: TutorialObjectiveSave | undefined,
  ctx: TutorialGameContext,
): TutorialObjectiveSave {
  const base = save ?? createStarterTutorialSave()
  const completed = new Set(base.completedIds)

  for (const objective of TUTORIAL_OBJECTIVES) {
    if (isTutorialObjectiveMet(objective.id, ctx, base.signals)) {
      completed.add(objective.id)
    }
  }

  const completedIds = TUTORIAL_OBJECTIVES.map((o) => o.id).filter((id) => completed.has(id))

  return {
    ...base,
    completedIds,
  }
}

export function markTutorialSignal(
  save: TutorialObjectiveSave,
  id: TutorialObjectiveId,
  ctx: TutorialGameContext,
): TutorialObjectiveSave {
  const next: TutorialObjectiveSave = {
    ...save,
    signals: { ...save.signals, [id]: true },
  }
  return syncTutorialObjectives(next, ctx)
}

export function claimTutorialObjective(
  save: TutorialObjectiveSave,
  id: TutorialObjectiveId,
): TutorialObjectiveSave | null {
  if (!save.completedIds.includes(id) || save.claimedIds.includes(id)) {
    return null
  }
  return {
    ...save,
    claimedIds: [...save.claimedIds, id],
  }
}

export function tutorialProgress(save: TutorialObjectiveSave) {
  const total = TUTORIAL_OBJECTIVES.length
  const done = save.completedIds.length
  const claimed = save.claimedIds.length
  return { total, done, claimed, allClaimed: claimed >= total }
}

export function getTutorialObjective(id: TutorialObjectiveId) {
  return TUTORIAL_OBJECTIVES.find((objective) => objective.id === id)
}
