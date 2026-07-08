import { useEffect, useState } from 'react'
import type { HsbColor } from '../../../data/dialedColor/scoring'
import { hsbToCss } from '../../../data/dialedColor/scoring'
import {
  resolveLayerDisplaySize,
  type LockedAlignPlacement,
} from '../../../data/dialedColor/color2LayerAlignStorage'
import { AlignedOverlayTintCanvas } from './AlignedOverlayTintCanvas'

type ToonAlignedOverlayPortraitProps = {
  portraitSrc: string
  placement: LockedAlignPlacement
  tintColor?: HsbColor
  showLayerHint?: boolean
  /** Recall / devinage : teinte opaque, masque le bleu d’origine */
  opaqueTint?: boolean
  frameClassName?: string
}

export function ToonAlignedOverlayPortrait({
  portraitSrc,
  placement,
  tintColor,
  showLayerHint,
  opaqueTint,
  frameClassName,
}: ToonAlignedOverlayPortraitProps) {
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        setNatural({ w: img.naturalWidth, h: img.naturalHeight })
      }
    }
    img.src = placement.layerSrc
  }, [placement.layerSrc])

  const { widthPx, heightPx } = resolveLayerDisplaySize(
    placement.state,
    natural.w || placement.state.widthPx || 1,
    natural.h || placement.state.heightPx || 1,
  )

  if (opaqueTint && tintColor) {
    return (
      <div className={`dc-toon-frame${frameClassName ? ` ${frameClassName}` : ''}`}>
        <AlignedOverlayTintCanvas
          height={heightPx}
          layerSrc={placement.layerSrc}
          portraitSrc={portraitSrc}
          tint={tintColor}
          width={widthPx}
          x={placement.state.xPx}
          y={placement.state.yPx}
        />
      </div>
    )
  }

  const maskStyle = {
    WebkitMaskImage: `url(${placement.layerSrc})`,
    maskImage: `url(${placement.layerSrc})`,
    WebkitMaskMode: 'luminance' as const,
    maskMode: 'luminance' as const,
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat' as const,
    maskRepeat: 'no-repeat' as const,
  }

  return (
    <div className={`dc-toon-frame${frameClassName ? ` ${frameClassName}` : ''}`}>
      <div className="dc-toon-tint-stack dc-toon-tint-stack--aligned">
        <img alt="" className="dc-toon-img dc-toon-img-base" draggable={false} src={portraitSrc} />
        <div
          className="dc-aligned-layer-frame"
          style={{
            height: heightPx,
            transform: `translate(${placement.state.xPx}px, ${placement.state.yPx}px)`,
            width: widthPx,
          }}
        >
          {tintColor ? (
            <div
              aria-hidden
              className="dc-toon-luminance-tint dc-aligned-layer-tint"
              style={{
                ...maskStyle,
                backgroundColor: hsbToCss(tintColor),
              }}
            />
          ) : showLayerHint ? (
            <img
              alt=""
              aria-hidden
              className="dc-aligned-layer-hint"
              draggable={false}
              src={placement.layerSrc}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
