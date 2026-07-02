import type { ReactEventHandler, ReactNode } from 'react'
import type { CompanionEmotionId } from '../data/companionAssets'
import { useCompanionPortraitAssets } from '../hooks/useCompanionPortraitAssets'
import './CompanionPortrait.css'

export type CompanionPortraitProps = {
  companionId: string
  level: number
  alt: string
  className?: string
  /** Cutout seul — décor fourni par le parent (mini-jeu, etc.). */
  cutoutOnly?: boolean
  /** Cutout entier dans le cadre (Parler) — pas de rognage object-fit: cover. */
  fitContain?: boolean
  /** Cutout émotion (emotion-happy.png, etc.) — prioritaire sur le palier. */
  emotion?: CompanionEmotionId
  /** Fond partagé depuis assets/companions/backgrounds/{sceneId}.png */
  sceneId?: string
  draggable?: boolean
  onClick?: () => void
  onLoad?: ReactEventHandler<HTMLImageElement>
  /** Shown when portrait assets are missing (mode === 'missing'). */
  fallback?: ReactNode
}

export function CompanionPortrait({
  companionId,
  level,
  alt,
  className = '',
  cutoutOnly = false,
  fitContain = false,
  emotion,
  sceneId,
  draggable = false,
  onClick,
  onLoad,
  fallback,
}: CompanionPortraitProps) {
  const assets = useCompanionPortraitAssets(companionId, level, { cutoutOnly, sceneId, emotion })
  const fitClass = fitContain ? ' companion-portrait--fit-contain' : ''

  if (assets.mode === 'loading') {
    return <div aria-hidden className={`companion-portrait companion-portrait--loading ${className}`.trim()} />
  }

  if (assets.mode === 'layered') {
    return (
      <div
        className={`companion-portrait companion-portrait--layered${fitClass} ${className}`.trim()}
        onClick={onClick}
        role={onClick ? 'img' : undefined}
        aria-label={alt}
      >
        <img
          alt=""
          aria-hidden
          className="companion-portrait-bg"
          draggable={false}
          src={assets.backgroundSrc!}
        />
        <img
          alt={alt}
          className={`companion-portrait-cutout${fitClass}`.trim()}
          draggable={draggable}
          onLoad={onLoad}
          src={assets.cutoutSrc!}
        />
      </div>
    )
  }

  if (assets.mode === 'cutout-only') {
    return (
      <img
        alt={alt}
        className={`companion-portrait companion-portrait--cutout${fitClass} ${className}`.trim()}
        draggable={draggable}
        key={assets.cutoutSrc ?? 'cutout'}
        onClick={onClick}
        onLoad={onLoad}
        src={assets.cutoutSrc!}
      />
    )
  }

  if (assets.mode === 'composed') {
    return (
      <img
        alt={alt}
        className={`companion-portrait companion-portrait--composed${fitClass} ${className}`.trim()}
        draggable={draggable}
        onClick={onClick}
        onLoad={onLoad}
        src={assets.composedSrc!}
      />
    )
  }

  return fallback ?? null
}
