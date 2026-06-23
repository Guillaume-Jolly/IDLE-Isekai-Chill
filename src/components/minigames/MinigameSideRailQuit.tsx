type MinigameSideRailQuitProps = {
  onClose: () => void
  className?: string
}

/** Bouton fermer — en tête de la barre latérale gauche des mini-jeux */
export function MinigameSideRailQuit({ onClose, className = '' }: MinigameSideRailQuitProps) {
  return (
    <button
      aria-label="Fermer le mini-jeu"
      className={`mg-side-rail-quit${className ? ` ${className}` : ''}`}
      title="Fermer"
      type="button"
      onClick={onClose}
    >
      ×
    </button>
  )
}
