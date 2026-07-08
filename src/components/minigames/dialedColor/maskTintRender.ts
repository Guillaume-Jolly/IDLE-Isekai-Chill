import { clampHsb, hsbToRgb, type HsbColor } from '../../../data/dialedColor/scoring'

/** Portrait plein + calque cheveux détouré superposé (reveal et recall). */
export type MaskTintDisplayMode = 'overlay'

export type MaskBounds = {
  x: number
  y: number
  w: number
  h: number
}

function relativeLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

function tintedShadeRgb(tint: HsbColor, shade: number): [number, number, number] {
  const clampedShade = Math.max(0, Math.min(1, shade))
  return hsbToRgb(clampHsb({ ...tint, b: tint.b * clampedShade }))
}

/** Portrait + cheveux recolorés via le détourage (nuances du calque préservées). */
export function renderPortraitHairOverlay(
  portraitData: ImageData,
  cutoutData: ImageData,
  tint: HsbColor,
): ImageData {
  const { width, height } = portraitData
  const out = new ImageData(width, height)
  const src = portraitData.data
  const cut = cutoutData.data
  const data = out.data

  for (let i = 0; i < width * height; i++) {
    const j = i * 4
    const alpha = cut[j + 3] / 255
    if (alpha <= 0.02) {
      data[j] = src[j]
      data[j + 1] = src[j + 1]
      data[j + 2] = src[j + 2]
      data[j + 3] = 255
      continue
    }

    const lum = relativeLuminance(cut[j], cut[j + 1], cut[j + 2])
    const shade = 0.1 + lum * 0.9
    const [tr, tg, tb] = tintedShadeRgb(tint, shade)
    data[j] = Math.round(src[j] * (1 - alpha) + tr * alpha)
    data[j + 1] = Math.round(src[j + 1] * (1 - alpha) + tg * alpha)
    data[j + 2] = Math.round(src[j + 2] * (1 - alpha) + tb * alpha)
    data[j + 3] = 255
  }

  return out
}

/**
 * Calque aligné — remplace totalement les pixels cheveux (pas de bleu d’origine visible).
 * Utilisé en phase devinage / recall.
 */
export function renderAlignedOpaqueHairTint(
  portraitData: ImageData,
  hairNaturalData: ImageData,
  tint: HsbColor,
  x: number,
  y: number,
  w: number,
  h: number,
): ImageData {
  const out = new ImageData(portraitData.width, portraitData.height)
  out.data.set(portraitData.data)

  const scratch = document.createElement('canvas')
  scratch.width = Math.max(1, Math.round(w))
  scratch.height = Math.max(1, Math.round(h))
  const scratchCtx = scratch.getContext('2d')
  if (!scratchCtx) return out

  const hairCanvas = document.createElement('canvas')
  hairCanvas.width = hairNaturalData.width
  hairCanvas.height = hairNaturalData.height
  const hairCtx = hairCanvas.getContext('2d')
  if (!hairCtx) return out
  hairCtx.putImageData(hairNaturalData, 0, 0)
  scratchCtx.drawImage(hairCanvas, 0, 0, scratch.width, scratch.height)
  const scaledHair = scratchCtx.getImageData(0, 0, scratch.width, scratch.height)

  const x0 = Math.round(x)
  const y0 = Math.round(y)
  const pw = portraitData.width
  const cut = scaledHair.data

  for (let ly = 0; ly < scratch.height; ly++) {
    for (let lx = 0; lx < scratch.width; lx++) {
      const px = x0 + lx
      const py = y0 + ly
      if (px < 0 || py < 0 || px >= portraitData.width || py >= portraitData.height) continue

      const sj = (ly * scratch.width + lx) * 4
      const alpha = cut[sj + 3] / 255
      if (alpha <= 0.02) continue

      const lum = relativeLuminance(cut[sj], cut[sj + 1], cut[sj + 2])
      const shade = 0.1 + lum * 0.9
      const [tr, tg, tb] = tintedShadeRgb(tint, shade)

      const pi = (py * pw + px) * 4
      out.data[pi] = tr
      out.data[pi + 1] = tg
      out.data[pi + 2] = tb
      out.data[pi + 3] = 255
    }
  }

  return out
}

export function renderMaskOutline(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  cutoutData: ImageData,
) {
  const overlay = ctx.createImageData(width, height)
  const cut = cutoutData.data
  const data = overlay.data
  for (let i = 0; i < width * height; i++) {
    const j = i * 4
    const alpha = cut[j + 3] / 255
    if (alpha <= 0.08) continue
    const edgeAlpha = Math.min(0.55, alpha * 0.65)
    data[j] = 250
    data[j + 1] = 204
    data[j + 2] = 21
    data[j + 3] = Math.round(edgeAlpha * 255)
  }
  const prev = ctx.globalCompositeOperation
  ctx.globalCompositeOperation = 'source-over'
  ctx.putImageData(overlay, 0, 0)
  ctx.globalCompositeOperation = prev
}

export function readImageData(
  image: CanvasImageSource,
  width: number,
  height: number,
): ImageData | null {
  const scratch = document.createElement('canvas')
  scratch.width = width
  scratch.height = height
  const ctx = scratch.getContext('2d')
  if (!ctx) return null
  ctx.drawImage(image, 0, 0, width, height)
  return ctx.getImageData(0, 0, width, height)
}
