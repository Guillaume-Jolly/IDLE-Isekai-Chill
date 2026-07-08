import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  PortraitViewportZoomProvider,
  type PortraitViewportZoom,
} from './portraitViewportZoomContext'

type ViewTransform = {
  scale: number
  x: number
  y: number
}

const MIN_ZOOM_RATIO = 0.35
const MAX_ZOOM_RATIO = 64

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

type ToonPortraitViewportProps = {
  children: ReactNode
  imageSrc: string
  contentSize?: { w: number; h: number }
  className?: string
  /** Multiplicateur max par rapport au fit (défaut 64 → 6400 %). */
  maxZoomRatio?: number
}

export function ToonPortraitViewport({
  children,
  imageSrc,
  contentSize,
  className,
  maxZoomRatio = MAX_ZOOM_RATIO,
}: ToonPortraitViewportProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [fitScale, setFitScale] = useState(1)
  const [transform, setTransform] = useState<ViewTransform>({ scale: 1, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const transformRef = useRef(transform)
  transformRef.current = transform
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    baseX: number
    baseY: number
  } | null>(null)
  const lastCanvasSizeRef = useRef({ w: 0, h: 0 })
  const userAdjustedRef = useRef(false)

  useEffect(() => {
    if (contentSize && contentSize.w > 0 && contentSize.h > 0) {
      setNatural(contentSize)
      return
    }
    const img = new Image()
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.src = imageSrc
  }, [contentSize, imageSrc])

  const computeFit = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || natural.w <= 0 || natural.h <= 0) return null
    const rect = canvas.getBoundingClientRect()
    const pad = 12
    const availW = Math.max(1, rect.width - pad * 2)
    const availH = Math.max(1, rect.height - pad * 2)
    const scale = Math.min(availW / natural.w, availH / natural.h)
    const x = (rect.width - natural.w * scale) / 2
    const y = (rect.height - natural.h * scale) / 2
    return { scale, x, y }
  }, [natural.h, natural.w])

  const applyFit = useCallback(
    (force = false) => {
      if (userAdjustedRef.current && !force) return
      const fit = computeFit()
      if (!fit) return
      setFitScale((prev) => (prev === fit.scale ? prev : fit.scale))
      setTransform((prev) =>
        prev.scale === fit.scale && prev.x === fit.x && prev.y === fit.y ? prev : fit,
      )
    },
    [computeFit],
  )

  useLayoutEffect(() => {
    applyFit(true)
  }, [applyFit])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      const last = lastCanvasSizeRef.current
      if (Math.abs(width - last.w) < 0.5 && Math.abs(height - last.h) < 0.5) return
      lastCanvasSizeRef.current = { w: width, h: height }
      applyFit(true)
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [applyFit])

  const minScale = fitScale * MIN_ZOOM_RATIO
  const maxScale = fitScale * maxZoomRatio

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const px = clientX - rect.left
      const py = clientY - rect.top
      setTransform((prev) => {
        const nextScale = clamp(prev.scale * factor, minScale, maxScale)
        const ratio = nextScale / prev.scale
        userAdjustedRef.current = true
        return {
          scale: nextScale,
          x: px - ratio * (px - prev.x),
          y: py - ratio * (py - prev.y),
        }
      })
    },
    [maxScale, minScale],
  )

  const onWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      event.preventDefault()
      const ratio = fitScale > 0 ? transformRef.current.scale / fitScale : 1
      const step = ratio >= 4 ? 1.06 : ratio >= 2 ? 1.09 : 1.12
      const factor = event.deltaY < 0 ? step : 1 / step
      zoomAt(event.clientX, event.clientY, factor)
    },
    [fitScale, zoomAt],
  )

  const zoomAtCenter = useCallback(
    (factor: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor)
    },
    [zoomAt],
  )

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.setPointerCapture(event.pointerId)
    setIsDragging(true)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: transformRef.current.x,
      baseY: transformRef.current.y,
    }
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    setTransform((prev) => ({
      ...prev,
      x: drag.baseX + dx,
      y: drag.baseY + dy,
    }))
    userAdjustedRef.current = true
  }, [])

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }, [])

  const zoomPercent = fitScale > 0 ? Math.round((transform.scale / fitScale) * 100) : 100
  const zoomContext = useMemo(
    (): PortraitViewportZoom => ({
      viewportScale: transform.scale,
      zoomRatio: fitScale > 0 ? transform.scale / fitScale : 1,
    }),
    [fitScale, transform.scale],
  )

  return (
    <div className={`dc-portrait-viewport${className ? ` ${className}` : ''}`}>
      <div className="dc-portrait-viewport-toolbar" role="toolbar" aria-label="Zoom portrait">
        <button type="button" onClick={() => zoomAtCenter(1 / 1.2)}>
          −
        </button>
        <span className="dc-portrait-viewport-zoom-label">{zoomPercent}%</span>
        <button type="button" onClick={() => zoomAtCenter(1.2)}>
          +
        </button>
        <button
          type="button"
          onClick={() => {
            userAdjustedRef.current = false
            applyFit(true)
          }}
        >
          Ajuster
        </button>
        <span className="dc-portrait-viewport-hint">Molette · glisser</span>
      </div>
      <div
        ref={canvasRef}
        className={`dc-portrait-viewport-canvas${isDragging ? ' is-dragging' : ''}`}
        onDoubleClick={() => {
          userAdjustedRef.current = false
          applyFit(true)
        }}
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onWheel={onWheel}
      >
        <div
          className="dc-portrait-viewport-transform"
          style={{
            width: natural.w > 0 ? natural.w : undefined,
            height: natural.h > 0 ? natural.h : undefined,
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <PortraitViewportZoomProvider value={zoomContext}>
            {children}
          </PortraitViewportZoomProvider>
        </div>
      </div>
    </div>
  )
}
