import type { CSSProperties } from 'react'
import type { EnclosureWanderer } from '../../hooks/useEnclosureWanderers'
import { RARITY_COLORS, RARITY_REFUGE_CHIBI_SCALE } from '../../data/wildFamiliars'
import type { PalmonRarity } from '../../data/wildFamiliars'
import { PalmonSprite } from './PalmonSprite'

const BUBBLE_EMOJI = {
  none: '',
  heart: '💜',
  star: '⭐',
  zzz: '💤',
  surprised: '❗',
} as const

type EnclosureChibiProps = {
  sprite: EnclosureWanderer
  rarity: PalmonRarity
  selected: boolean
  duplicateCount?: number
  onSelect: () => void
}

export function EnclosureChibi({
  sprite,
  rarity,
  selected,
  duplicateCount,
  onSelect,
}: EnclosureChibiProps) {
  const scale = RARITY_REFUGE_CHIBI_SCALE[rarity]

  return (
    <button
      aria-label={`Sélectionner ${sprite.name}`}
      className={`mg-enclosure-chibi mg-sprite-hitbox mode-${sprite.mode} ${selected ? 'selected' : ''}`}
      style={
        {
          left: `${sprite.x}%`,
          top: `${sprite.y}%`,
          '--mg-chibi-scale': scale,
        } as CSSProperties
      }
      type="button"
      onClick={onSelect}
    >
      {sprite.bubble !== 'none' ? (
        <span aria-hidden className="mg-chibi-bubble">
          {BUBBLE_EMOJI[sprite.bubble]}
        </span>
      ) : null}
      <span aria-hidden className="mg-chibi-shadow" />
      <span className={`mg-chibi-wrap ${sprite.facingLeft ? 'flip' : ''}`}>
        <span className="mg-chibi-body">
          <PalmonSprite
            emoji={sprite.emoji}
            name={sprite.name}
            size="chibi"
            speciesId={sprite.speciesId}
            variant="chibi"
          />
        </span>
      </span>
      {duplicateCount ? (
        <span aria-label={`${duplicateCount} exemplaires`} className="mg-chibi-duplicate-badge">
          ×{duplicateCount}
        </span>
      ) : null}
      {selected ? (
        <span className="mg-chibi-name" style={{ color: RARITY_COLORS[rarity] }}>
          {sprite.name}
        </span>
      ) : null}
    </button>
  )
}
