import { useCallback, useEffect, useRef } from 'react'
import type { HsbColor } from '../../../data/dialedColor/scoring'
import {
  readImageData,
  renderMaskOutline,
  renderPortraitHairOverlay,
  type MaskTintDisplayMode,
} from './maskTintRender'

type LoadedAssets = {
  portrait?: HTMLImageElement
  cutout?: HTMLImageElement
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Image introuvable: ${src}`))
    img.src = src
  })
}

type MaskTintCanvasProps = {
  portraitSrc: string
  cutoutSrc: string
  mode: MaskTintDisplayMode
  tint?: HsbColor
  showMaskOutline?: boolean
  className?: string
  onContentSize?: (width: number, height: number) => void
  onLoadError?: (message: string) => void
}

export function MaskTintCanvas({
  portraitSrc,
  cutoutSrc,
  mode,
  tint,
  showMaskOutline = false,
  className,
  onContentSize,
  onLoadError,
}: MaskTintCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const assetsRef = useRef<LoadedAssets>({})
  const onContentSizeRef = useRef(onContentSize)
  const reportedSizeRef = useRef({ w: 0, h: 0 })

  onContentSizeRef.current = onContentSize

  const paint = useCallback(() => {
    const canvas = canvasRef.current
    const { portrait, cutout } = assetsRef.current
    if (!canvas || !portrait || !cutout) return

    const width = portrait.naturalWidth
    const height = portrait.naturalHeight
    if (!width || !height) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    canvas.width = width
    canvas.height = height
    if (reportedSizeRef.current.w !== width || reportedSizeRef.current.h !== height) {
      reportedSizeRef.current = { w: width, h: height }
      onContentSizeRef.current?.(width, height)
    }

    const portraitData = readImageData(portrait, width, height)
    const cutoutData = readImageData(cutout, width, height)
    if (!portraitData || !cutoutData) return

    if (mode === 'overlay' && tint) {
      const composited = renderPortraitHairOverlay(portraitData, cutoutData, tint)
      ctx.putImageData(composited, 0, 0)
    } else {
      ctx.putImageData(portraitData, 0, 0)
    }

    if (showMaskOutline) {
      renderMaskOutline(ctx, width, height, cutoutData)
    }
  }, [mode, showMaskOutline, tint])

  useEffect(() => {
    let cancelled = false

    Promise.all([loadImage(portraitSrc), loadImage(cutoutSrc)])
      .then(([portrait, cutout]) => {
        if (cancelled) return
        assetsRef.current = { portrait, cutout }
        paint()
      })
      .catch((error: unknown) => {
        assetsRef.current = {}
        onLoadError?.(error instanceof Error ? error.message : String(error))
      })

    return () => {
      cancelled = true
    }
  }, [cutoutSrc, onLoadError, paint, portraitSrc])

  useEffect(() => {
    paint()
  }, [paint])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`dc-mask-tint-canvas${className ? ` ${className}` : ''}`}
    />
  )
}
