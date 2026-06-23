import { BIOMES } from '../../data/wildFamiliars'
import {
  normalizeRefugeBiomeId,
  uniqueSpeciesCount,
  type RefugeBiomeId,
} from '../../data/myrionRefuge'
import type { PetState } from '../../data/minigameSave'
import { BiomeMapCardVisual } from './BiomeMapCardVisual'
import './BiomeMapPanel.css'

type RefugeBiomeMapPanelProps = {
  activeBiomeId: RefugeBiomeId
  pets: PetState[]
  onSelect: (biomeId: RefugeBiomeId) => void
  variant?: 'full' | 'compact'
}

export function RefugeBiomeMapPanel({
  activeBiomeId,
  pets,
  onSelect,
  variant = 'full',
}: RefugeBiomeMapPanelProps) {
  const compact = variant === 'compact'

  return (
    <div className={`mg-biome-map${compact ? ' mg-biome-map--compact' : ''}`}>
      {compact ? (
        <p className="mg-biome-map-compact-meta">{pets.length} Myrions au refuge</p>
      ) : (
        <header className="mg-biome-map-head">
          <h4 className="mg-biome-map-title">Enclos du refuge</h4>
          <p className="mg-biome-map-sub">{pets.length} Myrions au refuge</p>
        </header>
      )}

      <div className={`mg-biome-map-grid${compact ? ' mg-biome-map-grid--compact' : ''}`}>
        {BIOMES.map((biome) => {
          const biomeId = biome.id as RefugeBiomeId
          const inBiome = pets.filter(
            (pet) => normalizeRefugeBiomeId(pet.biomeId) === biomeId,
          )
          const count = inBiome.length
          const species = uniqueSpeciesCount(inBiome)
          const isActive = activeBiomeId === biomeId
          const cardClass = `mg-biome-card${compact ? ' mg-biome-card--compact' : ''} unlocked${
            isActive ? ' active' : ''
          }`

          const countLabel =
            count > 0
              ? species < count
                ? `${species} espèces · ${count} Myrions`
                : `${count} Myrion${count > 1 ? 's' : ''}`
              : 'Enclos vide'

          const visual = (
            <BiomeMapCardVisual
              biomeId={biomeId}
              fallbackGradient={biome.fallbackGradient}
              thumb="enclosure"
            />
          )

          if (compact) {
            return (
              <button
                aria-current={isActive ? 'true' : undefined}
                className={cardClass}
                key={biomeId}
                title={`Visiter ${biome.name}`}
                type="button"
                onClick={() => onSelect(biomeId)}
              >
                {visual}
                <div className="mg-biome-card-body">
                  <h5>
                    {biome.emoji} {biome.name}
                  </h5>
                  <p className="mg-biome-card-meta">{countLabel}</p>
                </div>
              </button>
            )
          }

          return (
            <article className={cardClass} key={biomeId}>
              {visual}
              <div className="mg-biome-card-body">
                <h5>
                  {biome.emoji} {biome.name}
                </h5>
                <p className="mg-biome-card-meta">{countLabel}</p>
                <button
                  className="primary mg-biome-explore-btn"
                  type="button"
                  onClick={() => onSelect(biomeId)}
                >
                  {isActive ? 'En cours' : 'Visiter'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
