import { useEffect, useMemo, useState } from 'react'
import type { PalmonSpriteVariant } from '../../data/minigameAssets'
import {
  hasMyrionChibiAsset,
  palmonChibiPngPath,
  palmonFullPngPath,
  palmonSilhouettePngPath,
} from '../../data/minigameAssets'

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
  const [missing, setMissing] = useState(false)
  const [displayAnim, setDisplayAnim] = useState(animate)

  useEffect(() => {
    setMissing(false)
  }, [speciesId, variant])

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

  const src = useMemo(() => {
    if (variant === 'chibi') return palmonChibiPngPath(speciesId)
    if (variant === 'silhouette') return palmonSilhouettePngPath(speciesId)
    return palmonFullPngPath(speciesId)
  }, [speciesId, variant])

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

  if (missing) {
    return null
  }

  return (
    <img
      alt={name}
      className={`mg-palmon-img ${sizeClass} ${variant} ${animClass} ${className}`.trim()}
      draggable={false}
      onAnimationEnd={handleAnimationEnd}
      onError={() => setMissing(true)}
      src={src}
    />
  )
}
