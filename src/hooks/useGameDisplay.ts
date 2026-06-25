export function isStandaloneGameDisplay(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export async function requestGameFullscreen(): Promise<boolean> {
  const root = document.documentElement
  const anyRoot = root as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void
  }

  try {
    if (document.fullscreenElement) return true
    if (root.requestFullscreen) {
      await root.requestFullscreen()
      return true
    }
    if (anyRoot.webkitRequestFullscreen) {
      await anyRoot.webkitRequestFullscreen()
      return true
    }
  } catch {
    return false
  }
  return false
}

export function syncGameDisplayClass(active: boolean) {
  document.documentElement.classList.toggle('game-display-active', active)
}
