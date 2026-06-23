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

  const [portraitSrc, onPortraitError, portraitExhausted] = usePublicAssetSrc(
    portraitCandidates[0],
    portraitCandidates.slice(1),
  )
  const [landscapeSrc] = usePublicAssetSrc(
    landscapeCandidates[0],
    landscapeCandidates.slice(1),
  )

  useEffect(() => {
    setTier(initialTier(layout, isMobile))
  }, [biomeId, isMobile, layout])

  const src = tier === 'portrait-png' ? portraitSrc : landscapeSrc

  const handleError = () => {
    if (tier === 'portrait-png') {
      onPortraitError({} as React.SyntheticEvent<HTMLImageElement>)
      if (portraitExhausted) {
        setTier('png')
      }
    }
  }

  return (
    <div className="mg-enclosure-bg-wrap" aria-hidden>
      <img
        alt=""
        className={className}
        data-bg-orientation={usePortrait && tier === 'portrait-png' ? 'portrait' : 'landscape'}
        draggable={false}
        onError={handleError}
        src={src}
      />
    </div>
  )
}
