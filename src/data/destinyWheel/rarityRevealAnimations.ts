import type { CSSProperties } from 'react'
import rarityPack from './rarity_reveal_animations.json'

export type DestinyRevealRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'
  | 'cursed'
  | 'illegal'
  | 'cosmic_bug'

type PackRarity = {
  duration_ms: number
  particles: number
}

const PACK = rarityPack.rarities as Record<DestinyRevealRarity, PackRarity>

const CLASS_BY_RARITY: Record<DestinyRevealRarity, string> = {
  common: 'dw-rarity-reveal--common',
  uncommon: 'dw-rarity-reveal--uncommon',
  rare: 'dw-rarity-reveal--rare',
  epic: 'dw-rarity-reveal--epic',
  legendary: 'dw-rarity-reveal--legendary',
  mythic: 'dw-rarity-reveal--mythic',
  cursed: 'dw-rarity-reveal--cursed',
  illegal: 'dw-rarity-reveal--illegal',
  cosmic_bug: 'dw-rarity-reveal--cosmic_bug',
}

const EXTENDED_RARITY_COLORS: Record<string, { color: string; accent: string }> = {
  mist_touched: { color: '#7ecfd4', accent: '#eaffff' },
  anomaly: { color: '#c77dff', accent: '#f5e8ff' },
  havre_destiny: { color: '#e8b86d', accent: '#fff6e8' },
}

export function normalizeRevealRarity(rarity: string | undefined): DestinyRevealRarity {
  if (rarity && rarity in CLASS_BY_RARITY) return rarity as DestinyRevealRarity
  return 'common'
}

export function revealAnimationConfig(rarity: string | undefined) {
  const key = normalizeRevealRarity(rarity)
  const entry = PACK[key]
  return {
    rarity: key,
    className: CLASS_BY_RARITY[key],
    durationMs: entry?.duration_ms ?? 700,
    particleCount: entry?.particles ?? 12,
  }
}

/** Thème bulle commentateur — aligné sur la rareté du tirage. */
export function rarityBubbleTheme(rarity: string | undefined): {
  className: string
  style?: CSSProperties
} {
  if (!rarity) return { className: '' }
  if (rarity in CLASS_BY_RARITY) {
    return {
      className: `${CLASS_BY_RARITY[rarity as DestinyRevealRarity]} dw-commentator-bubble--rarity-themed`,
    }
  }
  const extended = EXTENDED_RARITY_COLORS[rarity]
  if (extended) {
    return {
      className: 'dw-commentator-bubble--rarity-themed',
      style: {
        ['--dw-rarity-color' as string]: extended.color,
        ['--dw-rarity-accent' as string]: extended.accent,
      },
    }
  }
  return {
    className: 'dw-commentator-bubble--rarity-themed dw-rarity-reveal--common',
  }
}

export function makeRevealParticles(
  count: number,
  scale: 'full' | 'compact' = 'full',
): CSSProperties[] {
  const distanceBase = scale === 'compact' ? 48 : 120
  const distanceSpread = scale === 'compact' ? 42 : 120
  const sizeBase = scale === 'compact' ? 3 : 4
  const sizeSpread = scale === 'compact' ? 4 : 7

  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i + ((i * 47) % 23)
    const distance = distanceBase + ((i * 37) % distanceSpread)
    const size = sizeBase + ((i * 13) % sizeSpread)
    const delay = (i * 17) % 120
    return {
      ['--p-angle' as string]: `${angle}deg`,
      ['--p-distance' as string]: `${distance}px`,
      ['--p-size' as string]: `${size}px`,
      ['--p-delay' as string]: `${delay}ms`,
    }
  })
}
