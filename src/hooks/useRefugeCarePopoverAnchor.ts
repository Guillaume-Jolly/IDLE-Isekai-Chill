import { useEffect, useState, type RefObject } from 'react'

export type CarePopoverAnchor = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

const ANCHORS: CarePopoverAnchor[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

type Rect = {
  left: number
  top: number
  right: number
  bottom: number
}

const POPOVER_WIDTH = 272
const POPOVER_HEIGHT = 208
const POPOVER_WIDTH_COMPACT = 152
const POPOVER_HEIGHT_COMPACT = 118
const CHIBI_RADIUS = 54
const CHIBI_RADIUS_COMPACT = 38
const EDGE_MARGIN = 12

function popoverSize(compact: boolean) {
  return compact
    ? { width: POPOVER_WIDTH_COMPACT, height: POPOVER_HEIGHT_COMPACT, chibiRadius: CHIBI_RADIUS_COMPACT }
    : { width: POPOVER_WIDTH, height: POPOVER_HEIGHT, chibiRadius: CHIBI_RADIUS }
}

function overlapArea(a: Rect, b: Rect, padding = 10) {
  const left = Math.max(a.left, b.left - padding)
  const top = Math.max(a.top, b.top - padding)
  const right = Math.min(a.right, b.right + padding)
  const bottom = Math.min(a.bottom, b.bottom + padding)
  if (right <= left || bottom <= top) return 0
  return (right - left) * (bottom - top)
}

function popoverScreenRect(anchor: CarePopoverAnchor, slotRect: DOMRect, compact: boolean): Rect {
  const { width, height } = popoverSize(compact)
  const leftBase = slotRect.left + EDGE_MARGIN
  const topBase = slotRect.top + EDGE_MARGIN
  const rightBase = slotRect.right - EDGE_MARGIN
  const bottomBase = slotRect.bottom - EDGE_MARGIN

  switch (anchor) {
    case 'top-left':
      return {
        left: leftBase,
        top: topBase,
        right: leftBase + width,
        bottom: topBase + height,
      }
    case 'top-right':
      return {
        left: rightBase - width,
        top: topBase,
        right: rightBase,
        bottom: topBase + height,
      }
    case 'bottom-left':
      return {
        left: leftBase,
        top: bottomBase - height,
        right: leftBase + width,
        bottom: bottomBase,
      }
    default:
      return {
        left: rightBase - width,
        top: bottomBase - height,
        right: rightBase,
        bottom: bottomBase,
      }
  }
}

function chibiScreenRect(
  playfieldRect: DOMRect,
  xPercent: number,
  yPercent: number,
  compact: boolean,
): Rect {
  const { chibiRadius } = popoverSize(compact)
  const cx = playfieldRect.left + (xPercent / 100) * playfieldRect.width
  const cy = playfieldRect.top + (yPercent / 100) * playfieldRect.height
  return {
    left: cx - chibiRadius,
    top: cy - chibiRadius,
    right: cx + chibiRadius,
    bottom: cy + chibiRadius,
  }
}

function pickAnchor(
  slotRect: DOMRect,
  chibiRect: Rect,
  current: CarePopoverAnchor,
  compact: boolean,
): CarePopoverAnchor {
  const scored = ANCHORS.map((anchor) => {
    const pop = popoverScreenRect(anchor, slotRect, compact)
    const overlap = overlapArea(pop, chibiRect)
    const popCx = (pop.left + pop.right) / 2
    const popCy = (pop.top + pop.bottom) / 2
    const chibiCx = (chibiRect.left + chibiRect.right) / 2
    const chibiCy = (chibiRect.top + chibiRect.bottom) / 2
    const distance = Math.hypot(popCx - chibiCx, popCy - chibiCy)
    return { anchor, overlap, score: -overlap * 1000 + distance }
  })

  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]?.anchor ?? 'bottom-right'
  const currentOverlap = overlapArea(popoverScreenRect(current, slotRect, compact), chibiRect)

  if (currentOverlap <= 0 && scored.some((entry) => entry.anchor === current)) {
    return current
  }

  return best
}

export function useRefugeCarePopoverAnchor(
  slotRef: RefObject<HTMLElement | null>,
  playfieldRef: RefObject<HTMLElement | null>,
  sprite: { x: number; y: number } | null,
  enabled: boolean,
  compact = false,
) {
  const [anchor, setAnchor] = useState<CarePopoverAnchor>('bottom-right')

  useEffect(() => {
    if (!enabled || !sprite) return

    const update = () => {
      const slotEl = slotRef.current
      const playfieldEl = playfieldRef.current
      if (!slotEl || !playfieldEl) return
      const slotRect = slotEl.getBoundingClientRect()
      const playfieldRect = playfieldEl.getBoundingClientRect()
      if (slotRect.width < 1 || slotRect.height < 1) return

      const chibiRect = chibiScreenRect(playfieldRect, sprite.x, sprite.y, compact)
      setAnchor((current) => pickAnchor(slotRect, chibiRect, current, compact))
    }

    update()
    const timer = window.setInterval(update, 64)
    window.addEventListener('resize', update)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('resize', update)
    }
  }, [compact, enabled, playfieldRef, slotRef, sprite?.x, sprite?.y])

  useEffect(() => {
    if (!enabled) {
      setAnchor('bottom-right')
    }
  }, [enabled])

  return anchor
}
