import { useMemo } from 'react'
import { RARITY_META, type GachaRarity } from '../data/gacha'
import type { GachaLootRateRow, GachaRarityRate } from '../data/gachaRates'
import { formatLootPct, LOOT_PERCENT_TOTAL } from '../data/lootExplain'
import { LootRateHoverTip } from './LootRateHoverTip'
import './LootDetailsLens.css'

type GachaLootDetailsContentProps = {
  title: string
  rarityRates: GachaRarityRate[]
  lootRates: GachaLootRateRow[]
  featuredLoot?: GachaLootRateRow[]
  pityRules: readonly string[]
  featuredNote?: string
}

const formatPct = formatLootPct

const RARITY_SORT = ['N', 'R', 'SR', 'SSR', 'UR', 'LR'] as const

function LootIcon({ alt, src }: { alt: string; src: string }) {
  return (
    <span className="loot-details-icon-wrap">
      <img alt={alt} className="loot-details-icon" decoding="async" src={src} />
    </span>
  )
}

export function GachaLootDetailsContent({
  title,
  rarityRates,
  lootRates,
  featuredLoot,
  pityRules,
  featuredNote,
}: GachaLootDetailsContentProps) {
  const highlights =
    featuredLoot ??
    [...lootRates]
      .filter((row) => ['LR', 'UR', 'SSR'].includes(row.rarity))
      .sort(
        (a, b) =>
          RARITY_SORT.indexOf(b.rarity) - RARITY_SORT.indexOf(a.rarity) || b.percent - a.percent,
      )
      .slice(0, 8)

  const sortedLoot = [...lootRates].sort(
    (a, b) => RARITY_SORT.indexOf(a.rarity) - RARITY_SORT.indexOf(b.rarity) || a.name.localeCompare(b.name),
  )
  const rarityTotal = useMemo(
    () => rarityRates.reduce((sum, row) => sum + row.percent, 0),
    [rarityRates],
  )
  const lootTotal = useMemo(
    () => sortedLoot.reduce((sum, row) => sum + row.percent, 0),
    [sortedLoot],
  )

  return (
    <div className="loot-details-sections">
      {featuredNote ? <p className="loot-details-note">{featuredNote}</p> : null}

      {highlights.length > 0 ? (
        <section className="loot-details-featured-section">
          <h5>Lots vedettes</h5>
          <p className="loot-details-hint">Les récompenses les plus rares — ce que tu peux gagner.</p>
          <ul className="loot-details-featured-grid">
            {highlights.map((row) => (
              <li key={row.id}>
                <LootIcon alt="" src={row.icon} />
                <div className="loot-details-featured-meta">
                  <span className="loot-details-featured-name">{row.name}</span>
                  <span className="loot-details-featured-summary">{row.summary}</span>
                  <span className="loot-details-featured-foot">
                    <span
                      className="loot-details-featured-rarity"
                      style={{ color: RARITY_META[row.rarity as GachaRarity].color }}
                    >
                      {row.rarity}
                    </span>
                    <span className="loot-details-featured-pct">
                      <LootRateHoverTip explain={row.explain}>{formatPct(row.percent)}</LootRateHoverTip>
                    </span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="loot-details-compact-section">
        <h5>Taux de rareté ({title})</h5>
        <ul className="loot-details-rate-list loot-details-rate-list--compact">
          {rarityRates.map((row) => (
            <li key={row.rarity}>
              <span
                className="loot-details-rarity"
                style={{ color: RARITY_META[row.rarity as GachaRarity].color }}
              >
                {row.rarity}
              </span>
              <span className="loot-details-bar-wrap">
                <span
                  className="loot-details-bar"
                  style={{
                    width: `${Math.max(row.percent, 0.5)}%`,
                    background: RARITY_META[row.rarity as GachaRarity].color,
                  }}
                />
              </span>
              <span className="loot-details-pct">
                <LootRateHoverTip explain={row.explain}>{formatPct(row.percent)}</LootRateHoverTip>
              </span>
            </li>
          ))}
          <li className="loot-details-rate-total">
            <span className="loot-details-rarity">Total</span>
            <span className="loot-details-bar-wrap" aria-hidden />
            <span className="loot-details-pct">{formatPct(rarityTotal)}</span>
          </li>
        </ul>
        <p className="loot-details-hint loot-details-hint--tight">
          Total normalisé à {formatPct(LOOT_PERCENT_TOTAL)} hors pity.
        </p>
      </section>

      <section>
        <h5>Tous les lots</h5>
        <div className="loot-details-loot-table-wrap loot-details-loot-table-wrap--short">
          <table className="loot-details-loot-table loot-details-loot-table--compact">
            <thead>
              <tr>
                <th aria-label="Icône" />
                <th>Lot</th>
                <th>Rareté</th>
                <th>Taux</th>
              </tr>
            </thead>
            <tbody>
              {sortedLoot.map((row) => (
                <tr key={row.id}>
                  <td className="loot-details-loot-icon-cell">
                    <LootIcon alt="" src={row.icon} />
                  </td>
                  <td>
                    <strong>{row.name}</strong>
                    <small>{row.summary}</small>
                  </td>
                  <td>
                    <span style={{ color: RARITY_META[row.rarity].color }}>{row.rarity}</span>
                  </td>
                  <td>
                    <LootRateHoverTip explain={row.explain}>{formatPct(row.percent)}</LootRateHoverTip>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="loot-details-total-row">
                <td colSpan={3}>Total</td>
                <td>{formatPct(lootTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section className="loot-details-pity-section">
        <h5>Pity</h5>
        <ul className="loot-details-bullets">
          {pityRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
