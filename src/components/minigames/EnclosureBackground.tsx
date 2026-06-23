import { useEffect, useState } from 'react'
import {
  enclosureAssetPath,
  enclosurePortraitAssetPath,
} from '../../data/myrionRefuge'
import { useIsMobileRefuge } from '../../hooks/useMediaQuery'

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

function resolveSrc(biomeId: string, tier: Tier) {
  if (tier === 'portrait-png') return enclosurePortraitAssetPath(biomeId)
  return enclosureAssetPath(biomeId)
}

export function EnclosureBackground({
  biomeId,
  className = '',
  layout = 'auto',
}: EnclosureBackgroundProps) {
  const isMobile = useIsMobileRefuge()
  const usePortrait = layout === 'portrait' || (layout === 'auto' && isMobile)
  const [tier, setTier] = useState<Tier>(() => initialTier(layout, isMobile))

  useEffect(() => {
    setTier(initialTier(layout, isMobile))
  }, [biomeId, isMobile, layout])

  const handleError = () => {
    if (tier === 'portrait-png') {
      setTier('png')
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
        src={resolveSrc(biomeId, tier)}
      />
    </div>
  )
}
