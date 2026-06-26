import type { CSSProperties } from 'react'
import type { EnclosureWanderer } from '../../hooks/useEnclosureWanderers'
import type { DecorativeMyrionState } from '../../data/myrionWorksiteLife'
import {
  WORKSITE_LIFE_CHIBI_BASE_REM,
  WORKSITE_LIFE_CHIBI_RARITY_SCALE,
} from '../../data/myrionWorksiteLife'
import type { PalmonRarity } from '../../data/wildFamiliars'
import { PalmonSprite } from './PalmonSprite'

type WorksiteLifeChibiProps = {
  sprite: EnclosureWanderer
  rarity: PalmonRarity
  state: DecorativeMyrionState
}

export function WorksiteLifeChibi({ sprite, rarity, state }: WorksiteLifeChibiProps) {
  const scale = WORKSITE_LIFE_CHIBI_RARITY_SCALE[rarity]

  return (
    <div
      aria-hidden
      className={`mg-worksite-life-chibi mode-${sprite.mode} mg-worksite-myrion-state mg-worksite-myrion-${state}`}
      style={
        {
          left: `${sprite.x}%`,
          top: `${sprite.y}%`,
          zIndex: Math.round(sprite.y),
          '--mg-chibi-base': `${WORKSITE_LIFE_CHIBI_BASE_REM}rem`,
          '--mg-chibi-scale': scale,
        } as CSSProperties
      }
      title={sprite.name}
    >
      {sprite.bubble === 'zzz' || state === 'sleeping' ? (
        <span aria-hidden className="mg-worksite-myrion-zzz">
          Zzz
        </span>
      ) : null}
      {state === 'eating' ? (
        <span aria-hidden className="mg-worksite-myrion-snack">
          🥣
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
    </div>
  )
}
