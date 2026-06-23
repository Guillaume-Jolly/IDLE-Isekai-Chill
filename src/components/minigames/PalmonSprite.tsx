import { useEffect, useMemo, useState } from 'react'
import type { PalmonSpriteVariant } from '../../data/minigameAssets'
import {
  getPalmonAssetPathCandidates,
  hasMyrionChibiAsset,
} from '../../data/minigameAssets'
import { usePublicAssetSrc } from '../../hooks/usePublicAssetSrc'

type PalmonAnim = 'none' | 'reveal' | 'idle' | 'flee' | 'success'

type PalmonSpriteProps = {
  speciesId: string
  emoji: string
  name: string
  variant?: PalmonSpriteVariant
  size?: 'sm' | 'md' | 'lg' | 'chibi' | 'encounter'
  animate?: PalmonAnim
  className?: string
}

export function PalmonSprite({
  speciesId,
  name,
  variant = 'full',
  size = 'md',
  animate = 'none',
  className = '',
}: PalmonSpriteProps) {
  const candidates = useMemo(
    () => getPalmonAssetPathCandidates(speciesId, variant),
    [speciesId, variant],
  )
  const [src, onAssetError, exhausted] = usePublicAssetSrc(candidates[0], candidates.slice(1))
  const [displayAnim, setDisplayAnim] = useState(animate)

  useEffect(() => {
    if (animate === 'reveal') {
      setDisplayAnim((current) => (current === 'reveal' ? current : 'reveal'))
      return
    }
    setDisplayAnim((current) => {
      if (animate === 'idle' && current === 'reveal') {
        return current
      }
      return animate
    })
  }, [animate])

  const handleAnimationEnd = (event: React.AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== 'mg-creature-reveal') {
      return
    }
    if (animate === 'idle' || animate === 'none') {
      setDisplayAnim('idle')
    }
  }

  const sizeClass =
    size === 'encounter'
      ? 'encounter'
      : variant === 'chibi' && size === 'md'
        ? 'chibi'
        : size

  const animClass =
    displayAnim === 'reveal'
      ? 'mg-creature-reveal'
      : displayAnim === 'idle'
        ? 'mg-creature-idle'
        : displayAnim === 'flee'
          ? 'mg-creature-flee'
          : displayAnim === 'success'
            ? 'mg-creature-success'
            : ''

  if (!hasMyrionChibiAsset(speciesId) && variant === 'chibi') {
    return null
  }

  if (exhausted) {
    return null
  }

  return (
    <img
      alt={name}
      className={`mg-palmon-img ${sizeClass} ${variant} ${animClass} ${className}`.trim()}
      draggable={false}
      onAnimationEnd={handleAnimationEnd}
      onError={onAssetError}
      src={src}
    />
  )
}
