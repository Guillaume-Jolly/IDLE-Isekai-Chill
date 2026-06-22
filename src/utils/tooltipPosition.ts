/** Centre horizontal d'une infobulle fixe, sans passer sous la barre laterale. */
export function clampTooltipCenterX(centerX: number, halfWidth = 170) {
  const margin = 12
  const shell = document.querySelector('.shell')
  const sidebarWidth = shell
    ? Number.parseFloat(getComputedStyle(shell).getPropertyValue('--sidebar-width')) || 168
    : 168
  const minCenter = sidebarWidth + margin + halfWidth
  const maxCenter = window.innerWidth - margin - halfWidth
  return Math.min(maxCenter, Math.max(minCenter, centerX))
}

export function tooltipAnchorFromElement(element: HTMLElement, gap = 8) {
  const rect = element.getBoundingClientRect()
  return {
    x: clampTooltipCenterX(rect.left + rect.width / 2),
    y: rect.bottom + gap,
  }
}
