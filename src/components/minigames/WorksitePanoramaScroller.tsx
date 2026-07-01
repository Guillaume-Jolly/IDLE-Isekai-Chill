import { useCallback, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'

type WorksitePanoramaScrollerProps = {
  children: ReactNode
  focusPercent?: number
  trackRef?: RefObject<HTMLDivElement | null>
  trackLayoutKey?: number | string
  className?: string
}

const DRAG_SKIP_SELECTOR =
  '.mg-worksite-marker, .mg-worksite-monitor-toggle, .mg-worksite-prestige-marker, button, a, input, select, textarea'

/** Panorama Chantier — hauteur forcée, défilement horizontal comme le village. */
export function WorksitePanoramaScroller({
  children,
  focusPercent = 50,
  trackRef: externalTrackRef,
  trackLayoutKey = 0,
  className,
}: WorksitePanoramaScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const internalTrackRef = useRef<HTMLDivElement>(null)
  const trackRef = externalTrackRef ?? internalTrackRef
  const [scrollMax, setScrollMax] = useState(0)
  const [scrollable, setScrollable] = useState(false)
  const prevFocusRef = useRef(focusPercent)
  const initialScrollDoneRef = useRef(false)

  const updateScrollBounds = useCallback(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return

    const trackWidth = track.offsetWidth
    const viewport = scroller.clientWidth
    const max = Math.max(0, trackWidth - viewport)
    setScrollMax(max)
    setScrollable(max > 12)

    if (scroller.scrollLeft > max) {
      scroller.scrollLeft = max
    }
  }, [trackRef])

  useEffect(() => {
    initialScrollDoneRef.current = false
    updateScrollBounds()
    window.addEventListener('resize', updateScrollBounds)
    return () => window.removeEventListener('resize', updateScrollBounds)
  }, [updateScrollBounds, trackLayoutKey])

  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return

    const trackWidth = track.offsetWidth
    const viewport = scroller.clientWidth
    const targetCenter = (focusPercent / 100) * trackWidth
    const idealScroll = targetCenter - viewport * 0.42
    const max = Math.max(0, trackWidth - viewport)
    const nextScroll = Math.min(max, Math.max(0, idealScroll))

    if (prevFocusRef.current !== focusPercent) {
      scroller.scrollTo({ left: nextScroll, behavior: 'smooth' })
      prevFocusRef.current = focusPercent
      initialScrollDoneRef.current = true
    } else if (!initialScrollDoneRef.current && nextScroll > 8) {
      scroller.scrollLeft = nextScroll
      initialScrollDoneRef.current = true
    }
  }, [focusPercent, trackRef, trackLayoutKey])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      scroller.scrollLeft += event.deltaY
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    return () => scroller.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let dragging = false
    let startX = 0
    let startScroll = 0

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = event.target as HTMLElement
      if (target.closest(DRAG_SKIP_SELECTOR)) return
      dragging = true
      startX = event.clientX
      startScroll = scroller.scrollLeft
      scroller.setPointerCapture(event.pointerId)
      scroller.classList.add('mg-worksite-panorama-scroller--dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      scroller.scrollLeft = startScroll - (event.clientX - startX)
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      scroller.classList.remove('mg-worksite-panorama-scroller--dragging')
      scroller.releasePointerCapture(event.pointerId)
    }

    scroller.addEventListener('pointerdown', onPointerDown)
    scroller.addEventListener('pointermove', onPointerMove)
    scroller.addEventListener('pointerup', endDrag)
    scroller.addEventListener('pointercancel', endDrag)
    return () => {
      scroller.removeEventListener('pointerdown', onPointerDown)
      scroller.removeEventListener('pointermove', onPointerMove)
      scroller.removeEventListener('pointerup', endDrag)
      scroller.removeEventListener('pointercancel', endDrag)
    }
  }, [])

  const clampScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (scroller.scrollLeft > scrollMax) {
      scroller.scrollLeft = scrollMax
    }
  }

  const rootClass = ['mg-worksite-panorama-scroller', className].filter(Boolean).join(' ')

  return (
    <div className={rootClass} ref={scrollerRef} onScroll={clampScroll}>
      <div className="mg-worksite-panorama-track" ref={trackRef}>
        {children}
      </div>
      {scrollable ? (
        <div aria-hidden className="mg-worksite-panorama-scroll-hint">
          <span>← Glisser pour explorer →</span>
        </div>
      ) : null}
    </div>
  )
}
