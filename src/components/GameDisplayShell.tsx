import { useEffect, useState, type ReactNode } from 'react'
import { isStandaloneGameDisplay, syncGameDisplayClass } from '../hooks/useGameDisplay'
import './GameDisplayShell.css'

type GameDisplayShellProps = {
  children: ReactNode
}

/** Sync affichage standalone / plein écran — sans écran « Jouer » bloquant (délégué à GameSessionGate). */
export function GameDisplayShell({ children }: GameDisplayShellProps) {
  const [standalone] = useState(isStandaloneGameDisplay)

  useEffect(() => {
    if (standalone) {
      syncGameDisplayClass(true)
    }
  }, [standalone])

  useEffect(() => {
    const onFullscreenChange = () => {
      syncGameDisplayClass(Boolean(document.fullscreenElement) || standalone)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [standalone])

  return children
}
