import { getBiome, RARITY_COLORS, type PalmonRarity } from '../../data/wildFamiliars'
import { PalmonSprite } from './PalmonSprite'

export type RecentCaptureEntry = {
  key: string
  speciesId: string
  name: string
  emoji: string
  rarity: PalmonRarity
  biomeId: string
  success: boolean
  timestamp: number
}

type RecentCapturesPanelProps = {
  entries: RecentCaptureEntry[]
  variant?: 'map' | 'hunt'
  compact?: boolean
}

export function RecentCapturesPanel({
  entries,
  variant = 'hunt',
  compact = false,
}: RecentCapturesPanelProps) {
  return (
    <aside
      aria-label="Dernieres captures"
      className={`mg-capture-recent-panel ${variant} ${compact ? 'drawer' : ''}`}
    >
      <header className="mg-capture-recent-head">
        <h4 className="mg-capture-recent-title">Dernieres captures</h4>
        <p className="mg-capture-recent-sub">
          {entries.length > 0 ? `${entries.length} affichees` : 'Aucune capture'}
        </p>
      </header>

      <ul className="mg-capture-recent-list">
        {entries.length === 0 ? (
          <li className="mg-capture-recent-empty">
            Tes prochaines captures apparaitront ici.
          </li>
        ) : (
          entries.map((entry) => {
            const biome = getBiome(entry.biomeId)

            return (
              <li
                key={entry.key}
                className={`mg-capture-recent-item${entry.success ? ' success' : ' failed'}`}
              >
                <PalmonSprite
                  emoji={entry.emoji}
                  name={entry.name}
                  size="chibi"
                  speciesId={entry.speciesId}
                  variant="chibi"
                />

                <div className="mg-capture-recent-meta">
                  <span className="mg-capture-recent-name">{entry.name}</span>
                  <span className="mg-capture-recent-biome">
                    {biome?.emoji ?? '🌍'} {biome?.name ?? 'Biome'}
                  </span>
                </div>

                <span
                  className="mg-capture-recent-rarity"
                  style={{ color: RARITY_COLORS[entry.rarity] }}
                >
                  {entry.success ? entry.rarity : '—'}
                </span>
              </li>
            )
          })
        )}
      </ul>
    </aside>
  )
}

export function buildRecentCapturesFromPets(
  pets: Array<{
    id: string
    speciesId: string
    name: string
    emoji: string
    rarity: PalmonRarity
    biomeId: string
  }>,
): RecentCaptureEntry[] {
  return [...pets]
    .map((pet) => {
      const match = pet.id.match(/-(\d+)$/)
      return {
        key: pet.id,
        speciesId: pet.speciesId,
        name: pet.name,
        emoji: pet.emoji,
        rarity: pet.rarity,
        biomeId: pet.biomeId,
        success: true,
        timestamp: match ? Number(match[1]) : 0,
      }
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
}
