/** Outils dev-only Ferme lunaire — inactifs en build production. */

export const WORKSITE_DEV_UNLOCK_STORAGE_KEY = 'worksite-dev-unlock-all'
export const WORKSITE_PLACEMENT_DEBUG_STORAGE_KEY = 'worksite-placement-debug'

export function isWorksiteDevEnvironment(): boolean {
  return import.meta.env.DEV
}

function readSearchFlag(name: string): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get(name) === '1'
}

/** Débloque visuellement biomes + filons sans modifier la save. */
export function readWorksiteDevUnlockAll(): boolean {
  if (!isWorksiteDevEnvironment()) return false
  if (readSearchFlag('worksiteDevUnlock')) return true
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(WORKSITE_DEV_UNLOCK_STORAGE_KEY) === '1'
}

export function setWorksiteDevUnlockAll(enabled: boolean): void {
  if (!isWorksiteDevEnvironment() || typeof window === 'undefined') return
  if (enabled) {
    window.localStorage.setItem(WORKSITE_DEV_UNLOCK_STORAGE_KEY, '1')
  } else {
    window.localStorage.removeItem(WORKSITE_DEV_UNLOCK_STORAGE_KEY)
  }
}

/** Overlay placement (slots + %). */
export function readWorksitePlacementDebug(): boolean {
  if (!isWorksiteDevEnvironment()) return false
  if (readSearchFlag('worksitePlacementDebug')) return true
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(WORKSITE_PLACEMENT_DEBUG_STORAGE_KEY) === '1'
}

export function setWorksitePlacementDebug(enabled: boolean): void {
  if (!isWorksiteDevEnvironment() || typeof window === 'undefined') return
  if (enabled) {
    window.localStorage.setItem(WORKSITE_PLACEMENT_DEBUG_STORAGE_KEY, '1')
  } else {
    window.localStorage.removeItem(WORKSITE_PLACEMENT_DEBUG_STORAGE_KEY)
  }
}
