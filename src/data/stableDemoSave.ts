/**
 * Stub public — preset PROD désactivé (stack locale dans deploy/, hors Git).
 * Copie complète : deploy/stable/local-src/stableDemoSave.full.ts
 */
import type { VillagePopulationState } from './population'
import type { MinigameSave } from './minigameSave'
import type { TutorialObjectiveSave } from './tutorialObjectives'

export const STABLE_STORAGE_KEY = 'idle-isekai-chill-stable-v1'

export function isStablePresetBuild(): boolean {
  return false
}

export function resolveGameStorageKey(): string {
  return 'idle-isekai-chill-game-v1'
}

export function shouldResetStableDemoSave(): boolean {
  return false
}

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
  throw new Error('Stable preset disabled in public build')
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
}>(base: T, _seed?: StableDemoSeed): T {
  return base
}
