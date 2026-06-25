import { BUILDING_UNLOCK_ORDER } from './population'
import type { VillagePopulationState } from './population'
import { RESOURCE_KEYS } from './resources'
import { createStarterMinigameSave, mergeMinigameSave, type MinigameSave } from './minigameSave'
import {
  TUTORIAL_OBJECTIVES,
  createStarterTutorialSave,
  type TutorialObjectiveSave,
} from './tutorialObjectives'

export const STABLE_STORAGE_KEY = 'idle-isekai-chill-stable-v1'

export const STABLE_BUILDING_LEVEL = 10
export const STABLE_VILLAGE_STAGE = 4

const STABLE_COMPANION_IDS = [
  'lyra',
  'maeve',
  'seren',
  'nami',
  'iris',
  'kael',
  'runa',
  'solene',
  'talia',
  'mira',
  'asha',
  'elwen',
  'noa',
  'sora',
  'zelie',
  'etna',
  'flonne',
  'laharl',
  'pleinair',
] as const

export function isStablePresetBuild(): boolean {
  return import.meta.env.VITE_STABLE_PRESET === 'demo'
}

export function resolveGameStorageKey(): string {
  return isStablePresetBuild() ? STABLE_STORAGE_KEY : 'idle-isekai-chill-game-v1'
}

export function shouldResetStableDemoSave(): boolean {
  if (typeof window === 'undefined' || !isStablePresetBuild()) return false
  return new URLSearchParams(window.location.search).has('fresh')
}

const generousResources = (): Record<string, number> =>
  Object.fromEntries(RESOURCE_KEYS.map((key) => [key, 999_999]))

const maxTutorialSave = (): TutorialObjectiveSave => {
  const ids = TUTORIAL_OBJECTIVES.map((objective) => objective.id)
  const signals = Object.fromEntries(ids.map((id) => [id, true as const])) as TutorialObjectiveSave['signals']
  return {
    completedIds: [...ids],
    claimedIds: [...ids],
    signals,
  }
}

const demoMinigameSave = (): MinigameSave =>
  mergeMinigameSave({
    ...createStarterMinigameSave(),
    captureStats: {
      totalCaught: 80,
      bestRarity: 'UR',
      caughtByRarity: {
        N: 20,
        R: 18,
        SR: 16,
        SSR: 12,
        UR: 8,
        LR: 1,
      },
    },
    refugeProgress: { shinyDiscovered: true, biomeFavors: {} },
  })

export type StableDemoSeed = {
  resources: Record<string, number>
  buildings: Record<string, number>
  village: VillagePopulationState
  tutorial: TutorialObjectiveSave
  minigameSave: MinigameSave
  companionLevels: Record<string, { level: number; affinity: number }>
  eventPulls: number
  disagreaEventPulls: number
  maturePlaceholders: boolean
}

export function createStableDemoSeed(): StableDemoSeed {
  const buildings = Object.fromEntries(
    BUILDING_UNLOCK_ORDER.map((buildingId) => [buildingId, STABLE_BUILDING_LEVEL]),
  )
  const companionLevels = Object.fromEntries(
    STABLE_COMPANION_IDS.map((companionId) => [companionId, { level: 10, affinity: 5 }]),
  )

  return {
    resources: generousResources(),
    buildings,
    village: { population: 520, stage: STABLE_VILLAGE_STAGE },
    tutorial: maxTutorialSave(),
    minigameSave: demoMinigameSave(),
    companionLevels,
    eventPulls: 999,
    disagreaEventPulls: 999,
    maturePlaceholders: true,
  }
}

export function mergeStableDemoSeed<T extends {
  resources: Record<string, number>
  buildings: Record<string, number>
  village: VillagePopulationState
  tutorial: TutorialObjectiveSave
  minigameSave: MinigameSave
  eventPulls: number
  disagreaEventPulls: number
  maturePlaceholders: boolean
}>(base: T, seed = createStableDemoSeed()): T {
  return {
    ...base,
    resources: { ...base.resources, ...seed.resources },
    buildings: { ...base.buildings, ...seed.buildings },
    village: { ...base.village, ...seed.village },
    tutorial: {
      ...createStarterTutorialSave(),
      ...seed.tutorial,
    },
    minigameSave: seed.minigameSave,
    eventPulls: seed.eventPulls,
    disagreaEventPulls: seed.disagreaEventPulls,
    maturePlaceholders: seed.maturePlaceholders,
  }
}
