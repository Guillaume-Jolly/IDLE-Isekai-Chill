export const HAVRE_MODE_STORAGE_KEY = 'idle-isekai-havre-wheel-mode'

export {
  addCardToHavreArchive,
  createDefaultHavreWheelSave,
  mergeHavreWheelIntoMinigameSave,
  normalizeHavreWheelSave,
  updateHavreCard,
} from './cardArchiveStore'
export { buildSavedHavreCard } from './cardBuilder'
export { FicheDestinView } from './FicheDestinView'
export { HavreArchivePanel, HavreJokerPanel, HavreModeSelector } from './HavreWheelPanels'
export { buildFicheFieldMap, resolveFicheFieldValue } from './ficheFieldResolver'
export { applyJoker, canUseJoker } from './jokerEngine'
export type {
  BuildHavreCardInput,
  HavreArchiveBucket,
  HavreArchiveRules,
  HavreGameModeDef,
  HavreGameModeId,
  HavreJokerDef,
  HavreRunSession,
  HavreWheelSave,
  SavedHavreIsekaiCard,
} from './types'

import type { HavreGameModeId } from './types'

export function isHavreGameModeId(value: string): value is HavreGameModeId {
  return value === 'hardcore' || value === 'auto_roll' || value === 'artist'
}

export function readStoredHavreMode(): HavreGameModeId {
  if (typeof localStorage === 'undefined') return 'hardcore'
  try {
    const stored = localStorage.getItem(HAVRE_MODE_STORAGE_KEY)
    if (stored && isHavreGameModeId(stored)) return stored
  } catch {
    /* ignore */
  }
  return 'hardcore'
}

export function storeHavreMode(mode: HavreGameModeId): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(HAVRE_MODE_STORAGE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function createHavreRunSession(mode: HavreGameModeId, rngSeed = Date.now()): import('./types').HavreRunSession {
  return {
    mode,
    jokersUsed: [],
    rerollsPerWheel: {},
    lockedWheelIds: [],
    rngSeed,
  }
}
