import { useMemo, useState } from 'react'
import type { PalmonSpriteVariant } from '../../data/minigameAssets'
import {
  getPalmonAssetPath,
  palmonChibiPngPath,
  palmonFullPngPath,
} from '../../data/minigameAssets'

type PalmonSpriteProps = {
  speciesId: string
  emoji: string
  name: string
  variant?: PalmonSpriteVariant
  size?: 'sm' | 'md' | 'lg' | 'chibi' | 'encounter'
  className?: string
}

type LoadTier = 'png' | 'vector' | 'emoji'

export function PalmonSprite({
  speciesId,
  emoji,
  name,
  variant = 'full',
  size = 'md',
  className = '',
}: PalmonSpriteProps) {
  const [tier, setTier] = useState<LoadTier>('png')

  const src = useMemo(() => {
    if (tier === 'emoji') {
      return null
    }
    if (tier === 'png') {
      return variant === 'chibi' ? palmonChibiPngPath(speciesId) : palmonFullPngPath(speciesId)
    }
    return getPalmonAssetPath(speciesId, variant)
  }, [speciesId, tier, variant])

  const sizeClass =
    size === 'encounter'
      ? 'encounter'
      : variant === 'chibi' && size === 'md'
        ? 'chibi'
        : size

  if (!src) {
    return (
      <span aria-hidden className={`mg-palmon-emoji ${sizeClass} ${className}`}>
        {emoji}
      </span>
    )
  }

  return (
    <img
      alt={name}
      className={`mg-palmon-img ${sizeClass} ${variant} mg-encounter-pop ${className}`}
      draggable={false}
      onError={() => {
        if (tier === 'png') {
          setTier('vector')
        } else {
          setTier('emoji')
        }
      }}
      src={src}
    />
  )
}
