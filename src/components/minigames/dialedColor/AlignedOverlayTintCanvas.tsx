import { useCallback, useEffect, useRef } from 'react'
import type { HsbColor } from '../../../data/dialedColor/scoring'
import {
  readImageData,
  renderAlignedOpaqueHairTint,
} from './maskTintRender'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image introuvable: ${src}`))
    img.src = src
  })
}

type AlignedOverlayTintCanvasProps = {
  portraitSrc: string
  layerSrc: string
  x: number
  y: number
  width: number
  height: number
  tint: HsbColor
  className?: string
  onContentSize?: (width: number, height: number) => void
}

export function AlignedOverlayTintCanvas({
  portraitSrc,
  layerSrc,
  x,
  y,
  width,
  height,
  tint,
  className,
  onContentSize,
}: AlignedOverlayTintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onContentSizeRef = useRef(onContentSize)
  const reportedSizeRef = useRef({ w: 0, h: 0 })

  onContentSizeRef.current = onContentSize

  const paint = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const [portrait, hair] = await Promise.all([loadImage(portraitSrc), loadImage(layerSrc)])
      const pw = portrait.naturalWidth
      const ph = portrait.naturalHeight
      if (!pw || !ph || !hair.naturalWidth || !hair.naturalHeight) return

      const portraitData = readImageData(portrait, pw, ph)
      const hairData = readImageData(hair, hair.naturalWidth, hair.naturalHeight)
      if (!portraitData || !hairData) return

      const composited = renderAlignedOpaqueHairTint(portraitData, hairData, tint, x, y, width, height)
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = pw
      canvas.height = ph
      ctx.putImageData(composited, 0, 0)

      if (reportedSizeRef.current.w !== pw || reportedSizeRef.current.h !== ph) {
        reportedSizeRef.current = { w: pw, h: ph }
        onContentSizeRef.current?.(pw, ph)
      }
    } catch {
      /* ignore load errors — canvas reste vide */
    }
  }, [height, layerSrc, portraitSrc, tint, width, x, y])

  useEffect(() => {
    void paint()
  }, [paint])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`dc-mask-tint-canvas dc-aligned-tint-canvas${className ? ` ${className}` : ''}`}
    />
  )
}
