import { useEffect, useMemo, useState } from 'react'
import {
  biomeBackgroundPortraitPngPathCandidates,
  biomeBackgroundPngPathCandidates,
} from '../../data/minigameAssets'
import { publicAssetUrl } from '../../data/publicAssetUrl'
import { useIsMobileCapture } from '../../hooks/useMediaQuery'
import { usePublicAssetSrc } from '../../hooks/usePublicAssetSrc'

export type BiomeBackgroundLayout = 'auto' | 'landscape' | 'portrait'

type BiomeBackgroundProps = {
  biomeId: string
  className?: string
  layout?: BiomeBackgroundLayout
  onFailed?: () => void
}

type Tier = 'portrait-png' | 'png' | 'svg' | 'failed'

function initialTier(layout: BiomeBackgroundLayout, isMobile: boolean): Tier {
  if (layout === 'portrait' || (layout === 'auto' && isMobile)) return 'portrait-png'
  return 'png'
}

export function BiomeBackground({
  biomeId,
  className = '',
  layout = 'auto',
  onFailed,
}: BiomeBackgroundProps) {
  const isMobile = useIsMobileCapture()
  const usePortrait = layout === 'portrait' || (layout === 'auto' && isMobile)
  const [tier, setTier] = useState<Tier>(() => initialTier(layout, isMobile))

  const portraitCandidates = useMemo(
    () => biomeBackgroundPortraitPngPathCandidates(biomeId),
    [biomeId],
  )
  const landscapeCandidates = useMemo(() => biomeBackgroundPngPathCandidates(biomeId), [biomeId])
  const portraitFallbackCandidates = useMemo(
    () => portraitCandidates.slice(1),
    [portraitCandidates],
  )
  const landscapeFallbackCandidates = useMemo(
    () => landscapeCandidates.slice(1),
    [landscapeCandidates],
  )

  const [portraitSrc, onPortraitError, portraitExhausted] = usePublicAssetSrc(
    portraitCandidates[0],
    portraitFallbackCandidates,
  )
  const [landscapeSrc, onLandscapeError, landscapeExhausted] = usePublicAssetSrc(
    landscapeCandidates[0],
    landscapeFallbackCandidates,
  )

  useEffect(() => {
    setTier(initialTier(layout, isMobile))
  }, [biomeId, isMobile, layout])

  useEffect(() => {
    if (tier !== 'portrait-png' || !portraitExhausted) return
    setTier(usePortrait ? 'svg' : 'png')
  }, [portraitExhausted, tier, usePortrait])

  useEffect(() => {
    if (tier !== 'png' || !landscapeExhausted) return
    setTier('svg')
  }, [landscapeExhausted, tier])

  if (tier === 'failed') {
    return null
  }

  const handleError = () => {
    if (tier === 'portrait-png') {
      onPortraitError({} as React.SyntheticEvent<HTMLImageElement>)
      return
    }
    if (tier === 'png') {
      onLandscapeError({} as React.SyntheticEvent<HTMLImageElement>)
      return
    }
    setTier('failed')
    onFailed?.()
  }

  const src =
    tier === 'portrait-png'
      ? portraitSrc
      : tier === 'png'
        ? landscapeSrc
        : publicAssetUrl(`assets/minigames/capture/biomes/${biomeId}.svg`)

  return (
    <div className="mg-biome-bg-wrap" aria-hidden>
      <img
        alt=""
        className={className}
        data-bg-orientation={usePortrait && tier === 'portrait-png' ? 'portrait' : 'landscape'}
        draggable={false}
        onError={handleError}
        src={src}
        style={{
          height: '100%',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          objectPosition: usePortrait ? 'center bottom' : 'center center',
          width: '100%',
        }}
      />
    </div>
  )
}
