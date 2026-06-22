import {
  BIOME_UNLOCK_ORDER,
  getBiomeUnlockStatus,
  type PlayerCollection,
} from '../../data/biomeProgression'
import { BIOMES } from '../../data/wildFamiliars'
import { BiomeBackground } from './BiomeBackground'

type BiomeMapPanelProps = {
  collection: PlayerCollection
  onExplore: (biomeId: string) => void
}

export function BiomeMapPanel({ collection, onExplore }: BiomeMapPanelProps) {
  return (
    <div className="mg-biome-map">
      <header className="mg-biome-map-head">
        <h4 className="mg-biome-map-title">Carte des biomes</h4>
        <p className="mg-biome-map-sub">{collection.totalCaught} captures totales</p>
      </header>

      <div className="mg-biome-map-grid">
        {BIOME_UNLOCK_ORDER.map((biomeId) => {
          const biome = BIOMES.find((entry) => entry.id === biomeId)
          if (!biome) return null

          const { unlocked, condition, progress } = getBiomeUnlockStatus(biomeId, collection)
          const progressPct = Math.round(progress.ratio * 100)

          return (
            <article
              key={biomeId}
              className={`mg-biome-card ${unlocked ? 'unlocked' : 'locked'} ${
                progress.complete ? 'complete' : ''
              }`}
            >
              <div className="mg-biome-card-visual" style={{ background: biome.fallbackGradient }}>
                <BiomeBackground biomeId={biomeId} className="mg-biome-card-bg" />
                {!unlocked && (
                  <div className="mg-biome-card-lock">
                    <span aria-hidden>🔒</span>
                  </div>
                )}
                {progress.complete && <span className="mg-biome-card-complete">★</span>}
              </div>

              <div className="mg-biome-card-body">
                <h5>
                  {biome.emoji} {biome.name}
                </h5>

                <div className="mg-biome-card-progress">
                  <span>
                    {progress.caught}/{progress.total} Myrions
                  </span>
                  <span className="mg-biome-card-bar">
                    <span className="mg-biome-card-fill" style={{ width: `${progressPct}%` }} />
                  </span>
                </div>

                {!unlocked ? (
                  <p className="mg-biome-card-condition">{condition}</p>
                ) : (
                  <button
                    className="primary mg-biome-explore-btn"
                    type="button"
                    onClick={() => onExplore(biomeId)}
                  >
                    Explorer
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
