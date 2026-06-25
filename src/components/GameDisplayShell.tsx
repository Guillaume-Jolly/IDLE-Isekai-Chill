import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  isStandaloneGameDisplay,
  requestGameFullscreen,
  syncGameDisplayClass,
} from '../hooks/useGameDisplay'
import './GameDisplayShell.css'

const SESSION_KEY = 'game-display-ready'

type GameDisplayShellProps = {
  children: ReactNode
}

export function GameDisplayShell({ children }: GameDisplayShellProps) {
  const [standalone] = useState(isStandaloneGameDisplay)
  const [ready, setReady] = useState(
    () => standalone || sessionStorage.getItem(SESSION_KEY) === '1',
  )

  useEffect(() => {
    if (standalone) {
      syncGameDisplayClass(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }
  }, [standalone])

  useEffect(() => {
    const onFullscreenChange = () => {
      syncGameDisplayClass(Boolean(document.fullscreenElement) || standalone)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [standalone])

  const launch = useCallback(async () => {
    const ok = await requestGameFullscreen()
    syncGameDisplayClass(ok || standalone)
    sessionStorage.setItem(SESSION_KEY, '1')
    setReady(true)
  }, [standalone])

  if (!ready) {
    return (
      <div className="game-launch" role="dialog" aria-modal="true" aria-label="Lancer le jeu">
        <div className="game-launch-card">
          <p className="game-launch-kicker">Havre des Brumes</p>
          <h1 className="game-launch-title">IDLE Isekai Chill</h1>
          <p className="game-launch-copy">
            Mode plein écran — comme une vraie app. Sur mobile, ajoute aussi le site à l&apos;écran
            d&apos;accueil pour l&apos;expérience la plus immersive.
          </p>
          <button type="button" className="game-launch-btn" onClick={() => void launch()}>
            Jouer
          </button>
          <button
            type="button"
            className="game-launch-skip"
            onClick={() => {
              sessionStorage.setItem(SESSION_KEY, '1')
              setReady(true)
            }}
          >
            Continuer dans le navigateur
          </button>
        </div>
      </div>
    )
  }

  return children
}
