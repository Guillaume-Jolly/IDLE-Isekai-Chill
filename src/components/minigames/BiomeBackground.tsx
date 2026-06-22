import { useState } from 'react'
import { biomeBackgroundPath, biomeBackgroundPngPath } from '../../data/minigameAssets'

type BiomeBackgroundProps = {
  biomeId: string
  className?: string
  onFailed?: () => void
}

type Tier = 'svg' | 'png' | 'failed'

export function BiomeBackground({ biomeId, className = '', onFailed }: BiomeBackgroundProps) {
  const [tier, setTier] = useState<Tier>('svg')

  if (tier === 'failed') {
    return null
  }

  const src = tier === 'svg' ? biomeBackgroundPath(biomeId) : biomeBackgroundPngPath(biomeId)

  return (
    <img
      alt=""
      aria-hidden
      className={className}
      onError={() => {
        if (tier === 'svg') {
          setTier('png')
        } else {
          setTier('failed')
          onFailed?.()
        }
      }}
      src={src}
    />
  )
}
