import { useEffect, useState } from 'react'

import {

  biomeBackgroundPath,

  biomeBackgroundPortraitPngPath,

  biomeBackgroundPngPath,

} from '../../data/minigameAssets'

import { useIsMobileCapture } from '../../hooks/useMediaQuery'



export type BiomeBackgroundLayout = 'auto' | 'landscape' | 'portrait'



type BiomeBackgroundProps = {

  biomeId: string

  className?: string

  layout?: BiomeBackgroundLayout

  onFailed?: () => void

}



type Tier = 'portrait-png' | 'png' | 'svg' | 'failed'



function resolveSrc(biomeId: string, tier: Tier) {

  if (tier === 'portrait-png') return biomeBackgroundPortraitPngPath(biomeId)

  if (tier === 'png') return biomeBackgroundPngPath(biomeId)

  return biomeBackgroundPath(biomeId)

}



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



  useEffect(() => {

    setTier(initialTier(layout, isMobile))

  }, [biomeId, isMobile, layout])



  if (tier === 'failed') {

    return null

  }



  const handleError = () => {

    if (tier === 'portrait-png') {

      if (usePortrait) {

        setTier('svg')

        return

      }

      setTier('png')

      return

    }

    if (tier === 'png') {

      setTier('svg')

      return

    }

    setTier('failed')

    onFailed?.()

  }



  return (

    <div className="mg-biome-bg-wrap" aria-hidden>

      <img

        alt=""

        className={className}

        data-bg-orientation={usePortrait && tier === 'portrait-png' ? 'portrait' : 'landscape'}

        draggable={false}

        onError={handleError}

        src={resolveSrc(biomeId, tier)}

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


