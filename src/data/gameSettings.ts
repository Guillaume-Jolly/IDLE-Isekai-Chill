export type GameLanguage = 'fr' | 'en'

export type GameSettings = {
  masterVolume: number
  interfaceVolume: number
  musicVolume: number
  language: GameLanguage
  /** Scènes intégrées affinity-04-nsfw (ex-L6). Désactivé par défaut (SFW). */
  nsfwContent: boolean
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  masterVolume: 0.85,
  interfaceVolume: 0.8,
  musicVolume: 0.6,
  language: 'fr',
  nsfwContent: false,
}

const STORAGE_KEY = 'idle-isekai-chill-settings'

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function normalizeSettings(raw: Partial<GameSettings> | null | undefined): GameSettings {
  const language = raw?.language === 'en' ? 'en' : 'fr'
  return {
    masterVolume: clampVolume(raw?.masterVolume ?? DEFAULT_GAME_SETTINGS.masterVolume),
    interfaceVolume: clampVolume(raw?.interfaceVolume ?? DEFAULT_GAME_SETTINGS.interfaceVolume),
    musicVolume: clampVolume(raw?.musicVolume ?? DEFAULT_GAME_SETTINGS.musicVolume),
    language,
    nsfwContent: raw?.nsfwContent === true,
  }
}

export function loadGameSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_GAME_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_GAME_SETTINGS
    return normalizeSettings(JSON.parse(raw) as Partial<GameSettings>)
  } catch {
    return DEFAULT_GAME_SETTINGS
  }
}

export function saveGameSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSettings(settings)))
}

export function applyLanguage(language: GameLanguage): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

export const LANGUAGE_OPTIONS: { value: GameLanguage; label: string; enabled: boolean }[] = [
  { value: 'fr', label: 'Français', enabled: true },
  { value: 'en', label: 'English — bientôt', enabled: false },
]
