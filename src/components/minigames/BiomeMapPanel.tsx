import {
  BIOME_UNLOCK_ORDER,
  getBiomeUnlockStatus,
  type PlayerCollection,
} from '../../data/biomeProgression'
import { BIOMES } from '../../data/wildFamiliars'
import { BiomeMapCardVisual } from './BiomeMapCardVisual'
import './BiomeMapPanel.css'

type BiomeMapPanelProps = {
  collection: PlayerCollection
  onExplore: (biomeId: string) => void
  variant?: 'full' | 'compact'
}

export function BiomeMapPanel({
  collection,
  onExplore,
  variant = 'full',
}: BiomeMapPanelProps) {
  const compact = variant === 'compact'

  return (
    <div className={`mg-biome-map${compact ? ' mg-biome-map--compact' : ''}`}>
      {compact ? (
        <p className="mg-biome-map-compact-meta">{collection.totalCaught} captures totales</p>
      ) : (
        <header className="mg-biome-map-head">
          <h4 className="mg-biome-map-title">Carte des biomes</h4>
          <p className="mg-biome-map-sub">{collection.totalCaught} captures totales</p>
        </header>
      )}

      <div className={`mg-biome-map-grid${compact ? ' mg-biome-map-grid--compact' : ''}`}>
        {BIOME_UNLOCK_ORDER.map((biomeId) => {
          const biome = BIOMES.find((entry) => entry.id === biomeId)
          if (!biome) return null

          const { unlocked, condition, progress } = getBiomeUnlockStatus(biomeId, collection)
          const progressPct = Math.round(progress.ratio * 100)
          const cardClass = `mg-biome-card${compact ? ' mg-biome-card--compact' : ''} ${
            unlocked ? 'unlocked' : 'locked'
          } ${progress.complete ? 'complete' : ''}`

          const visual = (
            <BiomeMapCardVisual
              biomeId={biomeId}
              complete={progress.complete}
              fallbackGradient={biome.fallbackGradient}
              locked={!unlocked}
              thumb="biome"
            />
          )

          const meta = (
            <>
              {unlocked ? (
                <>
                  <span aria-hidden className="mg-biome-card-bar">
                    <span className="mg-biome-card-fill" style={{ width: `${progressPct}%` }} />
                  </span>
                  <p className="mg-biome-card-meta">
                    {progress.caught}/{progress.total} Myrions
                  </p>
                </>
              ) : (
                <p className="mg-biome-card-meta">{condition}</p>
              )}
            </>
          )

          if (compact) {
            if (unlocked) {
              return (
                <button
                  className={cardClass}
                  key={biomeId}
                  title={`Explorer ${biome.name}`}
                  type="button"
                  onClick={() => onExplore(biomeId)}
                >
                  {visual}
                  <div className="mg-biome-card-body">
                    <h5>
                      {biome.emoji} {biome.name}
                    </h5>
                    {meta}
                  </div>
                </button>
              )
            }

            return (
              <article className={cardClass} key={biomeId} title={condition}>
                {visual}
                <div className="mg-biome-card-body">
                  <h5>
                    {biome.emoji} {biome.name}
                  </h5>
                  {meta}
                </div>
              </article>
            )
          }

          return (
            <article className={cardClass} key={biomeId}>
              {visual}

              <div className="mg-biome-card-body">
                <h5>
                  {biome.emoji} {biome.name}
                </h5>

                {unlocked ? (
                  <div className="mg-biome-card-progress">
                    <span>
                      {progress.caught}/{progress.total} Myrions
                    </span>
                    <span className="mg-biome-card-bar">
                      <span className="mg-biome-card-fill" style={{ width: `${progressPct}%` }} />
                    </span>
                  </div>
                ) : (
                  <p className="mg-biome-card-meta">{condition}</p>
                )}

                {unlocked ? (
                  <button
                    className="primary mg-biome-explore-btn"
                    type="button"
                    onClick={() => onExplore(biomeId)}
                  >
                    Explorer
                  </button>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
