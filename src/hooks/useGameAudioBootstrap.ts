import { useEffect } from 'react'
import { ensureAmbientBed, stopAmbientBed } from '../audio/ambientAudio'
import { resumeAudio } from '../audio/audioEngine'
import type { GameSettings } from '../data/gameSettings'
import { bindUiClickSounds } from '../audio/uiSounds'

export function useGameAudioBootstrap(settings: Pick<GameSettings, 'musicVolume'>): void {
  useEffect(() => {
    return bindUiClickSounds()
  }, [])

  useEffect(() => {
    const boot = () => {
      void resumeAudio().then(() => {
        ensureAmbientBed(settings.musicVolume)
      })
    }

    window.addEventListener('pointerdown', boot, { once: true })
    return () => window.removeEventListener('pointerdown', boot)
  }, [settings.musicVolume])

  useEffect(() => {
    ensureAmbientBed(settings.musicVolume)
  }, [settings.musicVolume])

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        stopAmbientBed()
        return
      }
      ensureAmbientBed(settings.musicVolume)
    }

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [settings.musicVolume])
}
