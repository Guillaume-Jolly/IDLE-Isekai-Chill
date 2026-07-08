/** HSB 0–360 / 0–100 / 0–100 — scoring inspiré Dialed (0–10 par manche). */

export type HsbColor = {
  h: number
  s: number
  b: number
}

export function clampHsb(color: HsbColor): HsbColor {
  return {
    h: ((color.h % 360) + 360) % 360,
    s: Math.max(0, Math.min(100, color.s)),
    b: Math.max(0, Math.min(100, color.b)),
  }
}

export function hsbToCss(color: HsbColor): string {
  const [r, g, b] = hsbToRgb(color)
  return `rgb(${r}, ${g}, ${b})`
}

/** Dégradé vertical — barre teinte (arc-en-ciel). */
export function hsbHueBarGradient(): string {
  const stops = [0, 60, 120, 180, 240, 300, 360].map((h) => {
    const [r, g, b] = hsbToRgb({ h, s: 100, b: 100 })
    const pct = (h / 360) * 100
    return `rgb(${r}, ${g}, ${b}) ${pct}%`
  })
  return `linear-gradient(to bottom, ${stops.join(', ')})`
}

/** Dégradé vertical — saturation à teinte/luminosité fixes. */
export function hsbSaturationBarGradient(h: number, b: number): string {
  const vivid = hsbToCss({ h, s: 100, b })
  const muted = hsbToCss({ h, s: 0, b: Math.max(b, 55) })
  return `linear-gradient(to bottom, ${vivid}, ${muted})`
}

/** Dégradé vertical — luminosité à teinte/saturation fixes. */
export function hsbBrightnessBarGradient(h: number, s: number): string {
  const bright = hsbToCss({ h, s, b: 100 })
  const dark = hsbToCss({ h, s, b: 0 })
  return `linear-gradient(to bottom, ${bright}, ${dark})`
}

export function hsbToRgb(color: HsbColor): [number, number, number] {
  const c = clampHsb(color)
  const s = c.s / 100
  const v = c.b / 100
  const k = (n: number) => (n + c.h / 30) % 12
  const f = (n: number) => v * (1 - s * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

/** Score 0–10 — distance perceptuelle simplifiée (hue pondéré). */
export function scoreColorMatch(target: HsbColor, guess: HsbColor): number {
  const t = clampHsb(target)
  const g = clampHsb(guess)
  const hueDiff = Math.min(Math.abs(t.h - g.h), 360 - Math.abs(t.h - g.h)) / 180
  const satDiff = Math.abs(t.s - g.s) / 100
  const briDiff = Math.abs(t.b - g.b) / 100
  const dist = Math.sqrt(hueDiff * hueDiff * 5 + satDiff * satDiff + briDiff * briDiff)
  const raw = 10 * Math.exp(-dist * 2.8)
  return Math.round(Math.max(0, Math.min(10, raw)) * 100) / 100
}

export const DIALED_COLOR_ROUNDS = 5
export const DIALED_COLOR_MAX_SCORE = DIALED_COLOR_ROUNDS * 10
