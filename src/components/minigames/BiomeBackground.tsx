import { useState } from 'react'
import { biomeBackgroundPath, biomeBackgroundPngPath } from '../../data/minigameAssets'

type BiomeBackgroundProps = {
  biomeId: string
  className?: string
  onFailed?: () => void
}

type Tier = 'png' | 'svg' | 'failed'

export function BiomeBackground({ biomeId, className = '', onFailed }: BiomeBackgroundProps) {
  const [tier, setTier] = useState<Tier>('png')

  if (tier === 'failed') {
    return null
  }

  const src = tier === 'png' ? biomeBackgroundPngPath(biomeId) : biomeBackgroundPath(biomeId)

  return (
    <img
      alt=""
      aria-hidden
      className={className}
      onError={() => {
        if (tier === 'png') {
          setTier('svg')
        } else {
          setTier('failed')
          onFailed?.()
        }
      }}
      src={src}
    />
  )
}
