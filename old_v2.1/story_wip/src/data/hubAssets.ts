import { publicAssetUrl } from './publicAssetUrl'

const HUB_PRESENTATION_ROOT = 'assets/Background/hub/presentations'

/** Fond présentation hub mini-jeu par bâtiment (si PNG prod existe). */
export function hubPresentationBackgroundUrl(buildingId: string): string | undefined {
  const known = new Set([
    'arcane-library',
    'moon-farm',
    'traveler-theater',
    'clear-spring',
    'inn',
    'mist-garden',
  ])
  if (!known.has(buildingId)) return undefined
  return publicAssetUrl(`${HUB_PRESENTATION_ROOT}/${buildingId}.png`)
}
