import type { StatKey } from '../data/companionStats'
import { STAT_KEYS, STAT_LABELS, STAT_ROLES } from '../data/companionStats'
import { FRAGMENTS_PER_STAT } from '../data/companionFragments'

type CompanionStatsPanelProps = {
  stats: Record<StatKey, number>
  unspentPoints: number
  fragmentCount: number
  statTokens: Record<StatKey, number>
  onAssign: (key: StatKey) => void
}

export function CompanionStatsPanel({
  stats,
  unspentPoints,
  fragmentCount,
  statTokens,
  onAssign,
}: CompanionStatsPanelProps) {
  const fragmentBudget = Math.floor(fragmentCount / FRAGMENTS_PER_STAT)
  const fragmentRemainder = fragmentCount % FRAGMENTS_PER_STAT

  return (
    <div className="companion-stats">
      <div className="companion-stats-head">
        <strong>Stats</strong>
        <small>
          {unspentPoints > 0 && `${unspentPoints} pt niveau/affinité`}
          {fragmentCount > 0 && (
            <>
              {unspentPoints > 0 && ' · '}
              {fragmentCount} frag.
              {fragmentBudget > 0 && ` (${fragmentBudget} échange${fragmentBudget > 1 ? 's' : ''})`}
            </>
          )}
        </small>
      </div>
      {fragmentCount > 0 && (
        <div className="companion-fragment-bar" title={`${FRAGMENTS_PER_STAT} fragments = +1 stat`}>
          <span>Fragments</span>
          <div className="companion-fragment-track">
            <div
              className="companion-fragment-fill"
              style={{ width: `${(fragmentRemainder / FRAGMENTS_PER_STAT) * 100}%` }}
            />
          </div>
          <small>
            {fragmentRemainder}/{FRAGMENTS_PER_STAT}
            {fragmentBudget > 0 && ` · ${fragmentBudget} prêt${fragmentBudget > 1 ? 's' : ''}`}
          </small>
        </div>
      )}
      <div className="companion-stats-grid">
        {STAT_KEYS.map((key) => {
          const canUsePoint = unspentPoints > 0
          const canUseFragment = fragmentBudget > 0
          const canUseToken = statTokens[key] > 0
          const canAssign = canUsePoint || canUseFragment || canUseToken

          return (
            <div className="companion-stat-row" key={key} title={STAT_ROLES[key]}>
              <span>{STAT_LABELS[key]}</span>
              <strong>{stats[key]}</strong>
              {canAssign ? (
                <button
                  type="button"
                  className="stat-plus"
                  aria-label={`Augmenter ${STAT_LABELS[key]}`}
                  title={
                    canUseToken
                      ? `Jeton ${STAT_LABELS[key]} (${statTokens[key]})`
                      : canUseFragment
                        ? `10 fragments → +1 ${STAT_LABELS[key]}`
                        : 'Point niveau/affinité'
                  }
                  onClick={() => onAssign(key)}
                >
                  +
                </button>
              ) : null}
              {canUseToken ? (
                <small className="stat-token-badge">{statTokens[key]}</small>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
