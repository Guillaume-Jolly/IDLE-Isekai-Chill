import { bestRarity, type GachaItem, type GachaRarity } from './gacha'

const BASE = '/gacha/cinema/disagrea'

export const DISAGREA_GACHA_CINEMA_FRAMES = {
  start: `${BASE}/start.png`,
  intermediate: `${BASE}/intermediate.png`,
  revealN: `${BASE}/reveal-n.png`,
  revealSr: `${BASE}/reveal-sr.png`,
  revealSsr: `${BASE}/reveal-ssr.png`,
  revealUr: `${BASE}/reveal-ur.png`,
  revealLr: `${BASE}/reveal-lr.png`,
  revealMulti: `${BASE}/reveal-multi.png`,
} as const

const REVEAL_BY_RARITY: Record<GachaRarity, string> = {
  N: DISAGREA_GACHA_CINEMA_FRAMES.revealN,
  R: DISAGREA_GACHA_CINEMA_FRAMES.revealSr,
  SR: DISAGREA_GACHA_CINEMA_FRAMES.revealSr,
  SSR: DISAGREA_GACHA_CINEMA_FRAMES.revealSsr,
  UR: DISAGREA_GACHA_CINEMA_FRAMES.revealUr,
  LR: DISAGREA_GACHA_CINEMA_FRAMES.revealLr,
}

/** Séquence diaporama : départ → intermédiaire → flash rareté (ou multi). */
export function disagreaGachaCinemaFrames(items: GachaItem[]): string[] {
  const multiPull = items.length > 1
  const reveal = multiPull
    ? DISAGREA_GACHA_CINEMA_FRAMES.revealMulti
    : REVEAL_BY_RARITY[bestRarity(items)]

  return [
    DISAGREA_GACHA_CINEMA_FRAMES.start,
    DISAGREA_GACHA_CINEMA_FRAMES.intermediate,
    reveal,
  ]
}

/** Durées (ms) par étape du diaporama Disagrea. */
export const DISAGREA_CINEMA_STEP_MS = [900, 900, 2200] as const

export const DISAGREA_CINEMA_TOTAL_MS = DISAGREA_CINEMA_STEP_MS.reduce((a, b) => a + b, 0)
