export type GameLanguage = 'fr' | 'en'

export type GameColorTheme = 'light' | 'dark'

/** Genre du protagoniste — choisi à la connexion (dialogues intimes aff. 4+). */
export type ProtagonistGender = 'male' | 'female'

export type GameSettings = {
  masterVolume: number
  interfaceVolume: number
  musicVolume: number
  language: GameLanguage
  /** Scènes intégrées + dialogues Parler aff. 4–5 (NSFW). Désactivé par défaut (SFW). */
  nsfwContent: boolean
  /** MC masculin (H) ou féminin (F) — corpus intime aff. 4+ en production. */
  protagonistGender: ProtagonistGender
  /** Thème global de l'interface — lumineux ou sombre. */
  colorTheme: GameColorTheme
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  masterVolume: 0.85,
  interfaceVolume: 0.8,
  musicVolume: 0.6,
  language: 'fr',
  nsfwContent: false,
  protagonistGender: 'male',
  colorTheme: 'light',
}

const STORAGE_KEY = 'idle-isekai-chill-settings'

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

function normalizeSettings(raw: Partial<GameSettings> | null | undefined): GameSettings {
  const language = raw?.language === 'en' ? 'en' : 'fr'
  const colorTheme = raw?.colorTheme === 'dark' ? 'dark' : 'light'
  const protagonistGender = raw?.protagonistGender === 'female' ? 'female' : 'male'
  return {
    masterVolume: clampVolume(raw?.masterVolume ?? DEFAULT_GAME_SETTINGS.masterVolume),
    interfaceVolume: clampVolume(raw?.interfaceVolume ?? DEFAULT_GAME_SETTINGS.interfaceVolume),
    musicVolume: clampVolume(raw?.musicVolume ?? DEFAULT_GAME_SETTINGS.musicVolume),
    language,
    nsfwContent: raw?.nsfwContent === true,
    protagonistGender,
    colorTheme,
  }
}

export function loadGameSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_GAME_SETTINGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const settings = !raw ? DEFAULT_GAME_SETTINGS : normalizeSettings(JSON.parse(raw) as Partial<GameSettings>)
    applyColorTheme(settings.colorTheme)
    return settings
  } catch {
    applyColorTheme(DEFAULT_GAME_SETTINGS.colorTheme)
    return DEFAULT_GAME_SETTINGS
  }
}

export function saveGameSettings(settings: GameSettings): void {
  if (typeof window === 'undefined') return
  const normalized = normalizeSettings(settings)
  applyColorTheme(normalized.colorTheme)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
}

export function applyLanguage(language: GameLanguage): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
}

export function applyColorTheme(theme: GameColorTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.colorTheme = theme
}

export const COLOR_THEME_OPTIONS: { value: GameColorTheme; label: string; hint: string }[] = [
  { value: 'light', label: 'Lumineux', hint: 'Fonds clairs et pastels — lecture confortable de jour.' },
  { value: 'dark', label: 'Sombre', hint: 'Interface assombrie — moins de lumière, idéal le soir.' },
]

export const LANGUAGE_OPTIONS: { value: GameLanguage; label: string; enabled: boolean }[] = [
  { value: 'fr', label: 'Français', enabled: true },
  { value: 'en', label: 'English — bientôt', enabled: false },
]
