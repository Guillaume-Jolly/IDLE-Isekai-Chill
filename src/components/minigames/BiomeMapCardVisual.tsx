import { BiomeBackground } from './BiomeBackground'
import { EnclosureBackground } from './EnclosureBackground'

export type BiomeMapThumbKind = 'biome' | 'enclosure'

type BiomeMapCardVisualProps = {
  biomeId: string
  fallbackGradient: string
  complete?: boolean
  locked?: boolean
  thumb?: BiomeMapThumbKind
}

export function BiomeMapCardVisual({
  biomeId,
  fallbackGradient,
  complete = false,
  locked = false,
  thumb = 'biome',
}: BiomeMapCardVisualProps) {
  return (
    <div className="mg-biome-card-visual" style={{ background: fallbackGradient }}>
      {thumb === 'enclosure' ? (
        <EnclosureBackground biomeId={biomeId} className="mg-biome-card-bg" layout="landscape" />
      ) : (
        <BiomeBackground biomeId={biomeId} className="mg-biome-card-bg" layout="landscape" />
      )}
      {locked ? (
        <div aria-hidden className="mg-biome-card-lock">
          <span>🔒</span>
        </div>
      ) : null}
      {complete ? (
        <span aria-hidden className="mg-biome-card-complete">
          ★
        </span>
      ) : null}
    </div>
  )
}
