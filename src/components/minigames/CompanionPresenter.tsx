import { useState, type CSSProperties } from 'react'
import { companionAssetPath } from '../../data/companionAssets'
import { minigamePresentationPath } from '../../data/minigameAssets'
import './Minigames.css'

type CompanionPresenterProps = {
  companionId: string
  activityId?: string
  name: string
  accent: string
  variant?: 'stage' | 'card'
  mood?: string
}

type ImageTier = 'presentation' | 'affinity' | 'letter'

export function CompanionPresenter({
  companionId,
  activityId,
  name,
  accent,
  variant = 'stage',
  mood,
}: CompanionPresenterProps) {
  const [tier, setTier] = useState<ImageTier>(activityId ? 'presentation' : 'affinity')

  const src =
    tier === 'presentation' && activityId
      ? minigamePresentationPath(activityId)
      : tier === 'affinity'
        ? companionAssetPath(companionId, 1)
        : null

  return (
    <aside
      className={`mg-companion-presenter ${variant}`}
      style={{ '--mg-accent': accent } as CSSProperties}
    >
      <div className="mg-companion-glow" />
      <div className="mg-companion-figure">
        {src ? (
          <img
            alt={`${name} — posture de presentation`}
            className="mg-companion-portrait"
            draggable={false}
            onError={() => {
              if (tier === 'presentation') {
                setTier('affinity')
              } else {
                setTier('letter')
              }
            }}
            src={src}
          />
        ) : (
          <div aria-hidden className="mg-companion-fallback">
            {name.slice(0, 1)}
          </div>
        )}
      </div>
      <p className="mg-companion-name">{name}</p>
      {mood && variant === 'stage' && <p className="mg-companion-mood">{mood}</p>}
    </aside>
  )
}
