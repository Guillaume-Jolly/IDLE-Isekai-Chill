export type AlignPoint = { x: number; y: number }

export type TwoPointAlignResult = {
  xPx: number
  yPx: number
  widthPx: number
  heightPx: number
}

const MIN_POINT_DISTANCE = 8
const MIN_LAYER_PX = 24

function clampSize(value: number) {
  return Math.max(MIN_LAYER_PX, value)
}

/**
 * 2 points calque → 2 points portrait : échelle uniforme + translation (sans rotation).
 * Coordonnées calque = espace naturel PNG (0…naturalW/H).
 * Coordonnées portrait = espace portrait (0…portraitW/H).
 */
export function computeTwoPointAlign(
  layerP1: AlignPoint,
  layerP2: AlignPoint,
  portraitP1: AlignPoint,
  portraitP2: AlignPoint,
  naturalW: number,
  naturalH: number,
): TwoPointAlignResult | { error: string } {
  if (naturalW <= 0 || naturalH <= 0) {
    return { error: 'Taille naturelle du calque inconnue.' }
  }

  const layerDist = Math.hypot(layerP2.x - layerP1.x, layerP2.y - layerP1.y)
  const portraitDist = Math.hypot(portraitP2.x - portraitP1.x, portraitP2.y - portraitP1.y)

  if (layerDist < MIN_POINT_DISTANCE) {
    return { error: 'Les 2 points calque sont trop proches.' }
  }
  if (portraitDist < MIN_POINT_DISTANCE) {
    return { error: 'Les 2 points portrait sont trop proches.' }
  }

  const scale = portraitDist / layerDist
  const widthPx = clampSize(naturalW * scale)
  const heightPx = clampSize(naturalH * scale)

  const xFromP1 = portraitP1.x - layerP1.x * scale
  const yFromP1 = portraitP1.y - layerP1.y * scale
  const xFromP2 = portraitP2.x - layerP2.x * scale
  const yFromP2 = portraitP2.y - layerP2.y * scale

  return {
    xPx: (xFromP1 + xFromP2) / 2,
    yPx: (yFromP1 + yFromP2) / 2,
    widthPx,
    heightPx,
  }
}

export function stackCoordsToLayerNatural(
  stackX: number,
  stackY: number,
  layerX: number,
  layerY: number,
  widthPx: number,
  heightPx: number,
  naturalW: number,
  naturalH: number,
): AlignPoint | null {
  if (widthPx <= 0 || heightPx <= 0 || naturalW <= 0 || naturalH <= 0) return null
  const localX = stackX - layerX
  const localY = stackY - layerY
  const scale = widthPx / naturalW
  const x = localX / scale
  const y = localY / scale
  if (x < 0 || y < 0 || x > naturalW || y > naturalH) return null
  return { x, y }
}

export function clientToStackCoords(clientX: number, clientY: number, stackEl: Element): AlignPoint | null {
  const canvas = stackEl.closest('.dc-portrait-viewport-canvas')
  const transformEl = stackEl.closest('.dc-portrait-viewport-transform') as HTMLElement | null
  if (!canvas || !transformEl) return null

  const canvasRect = canvas.getBoundingClientRect()
  const sx = clientX - canvasRect.left
  const sy = clientY - canvasRect.top

  const matrix = getComputedStyle(transformEl).transform
  if (!matrix || matrix === 'none') return { x: sx, y: sy }

  const match = matrix.match(/matrix\(([^)]+)\)/)
  if (!match) return { x: sx, y: sy }

  const parts = match[1].split(',').map((v) => parseFloat(v.trim()))
  const scaleX = parts[0] || 1
  const scaleY = parts[3] || scaleX
  const tx = parts[4] || 0
  const ty = parts[5] || 0

  return {
    x: (sx - tx) / scaleX,
    y: (sy - ty) / scaleY,
  }
}

export type TwoPointPhase = 'off' | 'layer-1' | 'layer-2' | 'portrait-1' | 'portrait-2'

export function twoPointPhaseLabel(phase: TwoPointPhase): string {
  switch (phase) {
    case 'layer-1':
      return 'Clic 1/2 sur le calque (point reconnaissable)'
    case 'layer-2':
      return 'Clic 2/2 sur le calque'
    case 'portrait-1':
      return 'Clic 1/2 sur le portrait (même point)'
    case 'portrait-2':
      return 'Clic 2/2 sur le portrait (2ᵉ point)'
    default:
      return ''
  }
}
