import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_GAME_SETTINGS,
  loadGameSettings,
  saveGameSettings,
  type GameSettings,
} from '../data/gameSettings'
import { applyGameAudioSettings } from '../audio/audioEngine'
import { useGameAudioBootstrap } from './useGameAudioBootstrap'

type GameSettingsContextValue = {
  settings: GameSettings
  updateSettings: (patch: Partial<GameSettings>) => void
  resetSettings: () => void
}

const GameSettingsContext = createContext<GameSettingsContextValue | null>(null)

function GameAudioBootstrap({ musicVolume }: { musicVolume: number }) {
  useGameAudioBootstrap({ musicVolume })
  return null
}

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadGameSettings())

  useEffect(() => {
    applyGameAudioSettings(settings)
    saveGameSettings(settings)
  }, [settings])

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((current) => ({ ...current, ...patch }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_GAME_SETTINGS)
  }, [])

  const value = useMemo(
    () => ({ settings, updateSettings, resetSettings }),
    [settings, updateSettings, resetSettings],
  )

  return (
    <GameSettingsContext.Provider value={value}>
      <GameAudioBootstrap musicVolume={settings.musicVolume} />
      {children}
    </GameSettingsContext.Provider>
  )
}

export function useGameSettings(): GameSettingsContextValue {
  const context = useContext(GameSettingsContext)
  if (!context) {
    throw new Error('useGameSettings must be used within GameSettingsProvider')
  }
  return context
}
