import type { ReactEventHandler, ReactNode } from 'react'
import { useCompanionPortraitAssets } from '../hooks/useCompanionPortraitAssets'
import './CompanionPortrait.css'

export type CompanionPortraitProps = {
  companionId: string
  level: number
  alt: string
  className?: string
  /** Cutout seul — décor fourni par le parent (mini-jeu, etc.). */
  cutoutOnly?: boolean
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
  sceneId,
  draggable = false,
  onClick,
  onLoad,
  fallback,
}: CompanionPortraitProps) {
  const assets = useCompanionPortraitAssets(companionId, level, { cutoutOnly, sceneId })

  if (assets.mode === 'loading') {
    return <div aria-hidden className={`companion-portrait companion-portrait--loading ${className}`} />
  }

  if (assets.mode === 'layered') {
    return (
      <div
        className={`companion-portrait companion-portrait--layered ${className}`}
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
          className="companion-portrait-cutout"
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
        className={`companion-portrait companion-portrait--cutout ${className}`}
        draggable={draggable}
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
        className={`companion-portrait companion-portrait--composed ${className}`}
        draggable={draggable}
        onClick={onClick}
        onLoad={onLoad}
        src={assets.composedSrc!}
      />
    )
  }

  return fallback ?? null
}
