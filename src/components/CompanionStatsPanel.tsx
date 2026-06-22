import { useState } from 'react'
import type { StatKey } from '../data/companionStats'
import { STAT_KEYS, STAT_LABELS, STAT_ROLES } from '../data/companionStats'
import { FRAGMENTS_PER_STAT } from '../data/companionFragments'
import './CompanionStatsPanel.css'

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
  const [open, setOpen] = useState(false)
  const fragmentBudget = Math.floor(fragmentCount / FRAGMENTS_PER_STAT)
  const fragmentRemainder = fragmentCount % FRAGMENTS_PER_STAT
  const totalLevel = STAT_KEYS.reduce((sum, key) => sum + stats[key], 0)
  const tokenTotal = STAT_KEYS.reduce((sum, key) => sum + statTokens[key], 0)
  const hasBudget = unspentPoints > 0 || fragmentBudget > 0 || tokenTotal > 0

  return (
    <div className={`companion-stats ${open ? 'open' : 'collapsed'}`}>
      <button
        aria-expanded={open}
        className="companion-stats-toggle"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="companion-stats-toggle-main">
          <strong>Stats</strong>
          <small>
            {totalLevel} pts
            {hasBudget ? (
              <>
                {' '}
                ·{' '}
                {[
                  unspentPoints > 0 ? `${unspentPoints} dispo` : null,
                  fragmentBudget > 0 ? `${fragmentBudget} frag.` : null,
                  tokenTotal > 0 ? `${tokenTotal} jeton${tokenTotal > 1 ? 's' : ''}` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </>
            ) : null}
          </small>
        </span>
        <span aria-hidden className="companion-stats-chevron">
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open ? (
        <div className="companion-stats-body">
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
      ) : null}
    </div>
  )
}
