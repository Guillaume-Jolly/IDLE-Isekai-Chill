import { useEffect, useMemo, useState } from 'react'
import {
  enclosureAssetPathCandidates,
  enclosurePortraitAssetPathCandidates,
} from '../../data/myrionRefuge'
import { useIsMobileRefuge } from '../../hooks/useMediaQuery'
import { usePublicAssetSrc } from '../../hooks/usePublicAssetSrc'

export type EnclosureBackgroundLayout = 'auto' | 'landscape' | 'portrait'

type EnclosureBackgroundProps = {
  biomeId: string
  className?: string
  layout?: EnclosureBackgroundLayout
}

type Tier = 'portrait-png' | 'png'

function initialTier(layout: EnclosureBackgroundLayout, isMobile: boolean): Tier {
  if (layout === 'portrait' || (layout === 'auto' && isMobile)) return 'portrait-png'
  return 'png'
}

export function EnclosureBackground({
  biomeId,
  className = '',
  layout = 'auto',
}: EnclosureBackgroundProps) {
  const isMobile = useIsMobileRefuge()
  const usePortrait = layout === 'portrait' || (layout === 'auto' && isMobile)
  const [tier, setTier] = useState<Tier>(() => initialTier(layout, isMobile))

  const portraitCandidates = useMemo(
    () => enclosurePortraitAssetPathCandidates(biomeId),
    [biomeId],
  )
  const landscapeCandidates = useMemo(() => enclosureAssetPathCandidates(biomeId), [biomeId])
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
  const [landscapeSrc, onLandscapeError] = usePublicAssetSrc(
    landscapeCandidates[0],
    landscapeFallbackCandidates,
  )

  useEffect(() => {
    setTier(initialTier(layout, isMobile))
  }, [biomeId, isMobile, layout])

  useEffect(() => {
    if (tier !== 'portrait-png' || !portraitExhausted) return
    setTier('png')
  }, [portraitExhausted, tier])

  const src = tier === 'portrait-png' ? portraitSrc : landscapeSrc
  const isPortraitBg = usePortrait && tier === 'portrait-png'

  const handleError = () => {
    if (tier === 'portrait-png') {
      onPortraitError({} as React.SyntheticEvent<HTMLImageElement>)
      return
    }
    if (tier === 'png') {
      onLandscapeError({} as React.SyntheticEvent<HTMLImageElement>)
    }
  }

  return (
    <div className="mg-enclosure-bg-wrap" aria-hidden>
      <img
        alt=""
        className={className}
        data-bg-orientation={isPortraitBg ? 'portrait' : 'landscape'}
        draggable={false}
        onError={handleError}
        src={src}
        style={{
          height: '100%',
          minHeight: '100%',
          minWidth: '100%',
          objectFit: 'cover',
          objectPosition: isPortraitBg ? 'center bottom' : 'center center',
          width: '100%',
        }}
      />
    </div>
  )
}
