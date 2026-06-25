const VIEWPORT_PAD = 12

export type TooltipPlacement = {
  left: number
  top: number
  transform: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function clampBox(left: number, top: number, width: number, height: number): TooltipPlacement {
  const vw = window.innerWidth
  const vh = window.innerHeight
  return {
    left: clamp(left, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, vw - width - VIEWPORT_PAD)),
    top: clamp(top, VIEWPORT_PAD, Math.max(VIEWPORT_PAD, vh - height - VIEWPORT_PAD)),
    transform: 'none',
  }
}

/** Panneau latéral (gameplay) quand la modale loot est ouverte. */
export function computeDialogAdjacentPlacement(
  dialogRect: DOMRect,
  popupRect: DOMRect,
): TooltipPlacement {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pw = popupRect.width
  const ph = popupRect.height
  const gap = 14

  const spaceLeft = dialogRect.left - VIEWPORT_PAD
  const spaceRight = vw - dialogRect.right - VIEWPORT_PAD
  const centeredTop = (vh - ph) / 2

  if (spaceLeft >= pw + gap) {
    return clampBox(dialogRect.left - gap - pw, centeredTop, pw, ph)
  }

  if (spaceRight >= pw + gap) {
    return clampBox(dialogRect.right + gap, centeredTop, pw, ph)
  }

  const spaceAbove = dialogRect.top - VIEWPORT_PAD
  const spaceBelow = vh - dialogRect.bottom - VIEWPORT_PAD

  if (spaceBelow >= ph + gap) {
    return clampBox((vw - pw) / 2, dialogRect.bottom + gap, pw, ph)
  }

  if (spaceAbove >= ph + gap) {
    return clampBox((vw - pw) / 2, dialogRect.top - gap - ph, pw, ph)
  }

  return clampBox((vw - pw) / 2, (vh - ph) / 2, pw, ph)
}

/** Infobulle ancrée au survol (hors modale ou petits écrans). */
export function computeAnchoredPlacement(
  anchorRect: DOMRect,
  popupRect: DOMRect,
): TooltipPlacement {
  const vh = window.innerHeight
  const pw = popupRect.width
  const ph = popupRect.height
  const gap = 8

  let top = anchorRect.bottom + gap
  let left = anchorRect.left + anchorRect.width / 2
  let transform = 'translateX(-50%)'

  if (top + ph > vh - VIEWPORT_PAD) {
    const above = anchorRect.top - gap - ph
    if (above >= VIEWPORT_PAD) {
      top = above
    } else {
      top = clamp((vh - ph) / 2, VIEWPORT_PAD, vh - ph - VIEWPORT_PAD)
      left = clamp(pw / 2 + VIEWPORT_PAD, left, window.innerWidth - pw / 2 - VIEWPORT_PAD)
      transform = 'translateX(-50%)'
      return { left, top, transform }
    }
  }

  left = clamp(pw / 2 + VIEWPORT_PAD, left, window.innerWidth - pw / 2 - VIEWPORT_PAD)
  return { left, top, transform }
}

export function resolveTooltipPlacement(
  anchor: HTMLElement,
  popup: HTMLElement,
): TooltipPlacement {
  const anchorRect = anchor.getBoundingClientRect()
  const popupRect = popup.getBoundingClientRect()
  const dialog = anchor.closest('.loot-details-dialog')

  if (dialog) {
    return computeDialogAdjacentPlacement(dialog.getBoundingClientRect(), popupRect)
  }

  return computeAnchoredPlacement(anchorRect, popupRect)
}
