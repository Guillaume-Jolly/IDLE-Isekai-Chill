import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import type { PlayerCollection } from '../data/biomeProgression'
import {
  getHuntBiomeDropSheet,
  getHuntDropSheets,
  getHuntTierSections,
  HUNT_RATE_COLUMN_EXPLAINS,
  RARITY_COLORS,
  type HuntBiomeDropSheet,
  type HuntSpeciesRateRow,
  type HuntTierSection,
} from '../data/huntDropRates'
import { formatLootPct, LOOT_PERCENT_TOTAL } from '../data/lootExplain'
import { LootRateHoverTip } from './LootRateHoverTip'
import { palmonChibiPngPathCandidates } from '../data/minigameAssets'
import type { HuntFavor } from '../data/myrionMvp2'
import { usePublicAssetSrc } from '../hooks/usePublicAssetSrc'
import './LootDetailsLens.css'

type HuntDropRatesContentProps = {
  collection: PlayerCollection
  huntFavors: HuntFavor[]
  focusBiomeId?: string
}

const formatPct = formatLootPct

function HuntSpeciesThumb({ row }: { row: HuntSpeciesRateRow }) {
  const candidates = useMemo(() => palmonChibiPngPathCandidates(row.id), [row.id])
  const [src, onError, exhausted] = usePublicAssetSrc(candidates[0], candidates.slice(1))

  if (exhausted) {
    return (
      <span aria-hidden className="loot-details-species-thumb loot-details-species-thumb--emoji">
        {row.emoji}
      </span>
    )
  }

  return (
    <img
      alt=""
      aria-hidden
      className="loot-details-species-thumb"
      draggable={false}
      onError={onError}
      src={src}
    />
  )
}

function ChecklistMark({ done }: { done: boolean }) {
  if (done) {
    return (
      <span aria-hidden className="loot-details-checklist-mark loot-details-checklist-mark--ok">
        <svg aria-hidden height="12" viewBox="0 0 12 12" width="12">
          <path
            d="M2.5 6.2 5 8.7 9.5 3.8"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </span>
    )
  }

  return (
    <span aria-hidden className="loot-details-checklist-mark loot-details-checklist-mark--ko">
      <svg aria-hidden height="12" viewBox="0 0 12 12" width="12">
        <path
          d="M3.2 3.2 8.8 8.8M8.8 3.2 3.2 8.8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    </span>
  )
}

function HuntExplainGuide({ sheet }: { sheet: HuntBiomeDropSheet }) {
  const headline = sheet.howItWorks.headline ?? 'Comment lire ces taux'

  return (
    <details className="loot-details-guide">
      <summary className="loot-details-guide-summary">{headline}</summary>
      <div className="loot-details-guide-body">
        <div className="loot-details-guide-grid">
          {sheet.howItWorks.sections.map((section) => (
            <div key={section.title} className="loot-details-guide-block">
              <p className="loot-details-guide-block-title">{section.title}</p>
              <ul className="loot-details-bullets loot-details-bullets--compact">
                {section.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {!sheet.lrAvailable ? (
          <div className="loot-details-guide-block loot-details-guide-block--lr">
            <p className="loot-details-guide-block-title">Débloquer LR dans {sheet.biomeName}</p>
            <ul className="loot-details-checklist">
              {sheet.lrUnlockSteps.map((step) => (
                <li key={step.id} className={step.done ? 'done' : 'pending'}>
                  <ChecklistMark done={step.done} />
                  <span>
                    <strong>{step.label}</strong>
                    {!step.done ? <small>{step.action}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="loot-details-hint loot-details-hint--tight">
            LR actif · bestiaire {sheet.progress.caught}/{sheet.progress.total} (
            {formatPct(sheet.progress.ratio * 100)}).
          </p>
        )}

        <div className="loot-details-guide-block">
          <p className="loot-details-guide-block-title">Faveurs du refuge</p>
          <ul className="loot-details-favor-guides">
            {sheet.favorGuides.map((guide) => (
              <li key={guide.id} className={guide.active ? 'active' : ''}>
                <span className="loot-details-favor-guides-head">
                  <strong>{guide.name}</strong>
                  {guide.active ? <span className="loot-details-favor-tag">active</span> : null}
                  {guide.affectsDisplayedRates ? (
                    <span className="loot-details-favor-tag loot-details-favor-tag--rates">modifie les %</span>
                  ) : null}
                </span>
                <span>{guide.summary}</span>
                <small>Obtenir : {guide.howToGet}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  )
}

function HuntTierSectionBlock({ section }: { section: HuntTierSection }) {
  const { rarity, species, rarityRow, baseTotal, boostedTotal } = section
  const color = RARITY_COLORS[rarity]

  return (
    <section className="loot-details-tier-section" style={{ '--tier-color': color } as CSSProperties}>
      <header className="loot-details-tier-head">
        <span className="loot-details-tier-badge" style={{ color }}>
          {rarity}
        </span>
        <span className="loot-details-tier-totals">
          <LootRateHoverTip explain={rarityRow.baseExplain}>
            Base {formatPct(baseTotal)}
          </LootRateHoverTip>
          <span aria-hidden className="loot-details-tier-sep">
            ·
          </span>
          <LootRateHoverTip explain={rarityRow.boostedExplain}>
            Bonus {formatPct(boostedTotal)}
          </LootRateHoverTip>
        </span>
        <span className="loot-details-tier-count">
          {species.length} espèce{species.length > 1 ? 's' : ''}
        </span>
      </header>
      <ul className="loot-details-tier-species">
        {species.map((row) => (
          <li key={row.id}>
            <span className="loot-details-species-cell">
              <HuntSpeciesThumb row={row} />
              <span className="loot-details-species-label">{row.name}</span>
            </span>
            <span className="loot-details-tier-pcts">
              <span className="loot-details-tier-pct">
                <LootRateHoverTip explain={row.baseExplain}>{formatPct(row.basePercent)}</LootRateHoverTip>
              </span>
              <span className="loot-details-tier-pct">
                <LootRateHoverTip explain={row.boostedExplain}>
                  {formatPct(row.boostedPercent)}
                </LootRateHoverTip>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BiomeDropSection({ sheet }: { sheet: HuntBiomeDropSheet }) {
  const tierSections = useMemo(() => getHuntTierSections(sheet), [sheet])
  const baseRarityTotal = useMemo(
    () => sheet.rarityRows.reduce((sum, row) => sum + row.basePercent, 0),
    [sheet.rarityRows],
  )
  const boostedRarityTotal = useMemo(
    () => sheet.rarityRows.reduce((sum, row) => sum + row.boostedPercent, 0),
    [sheet.rarityRows],
  )
  const baseSpeciesTotal = useMemo(
    () => sheet.speciesRows.reduce((sum, row) => sum + row.basePercent, 0),
    [sheet.speciesRows],
  )
  const boostedSpeciesTotal = useMemo(
    () => sheet.speciesRows.reduce((sum, row) => sum + row.boostedPercent, 0),
    [sheet.speciesRows],
  )

  return (
    <section className={`loot-details-biome${sheet.unlocked ? '' : ' locked'}`}>
      <h5>
        {sheet.emoji} {sheet.biomeName}
        {!sheet.unlocked ? ' · verrouillé' : null}
        {sheet.lrAvailable ? ' · LR actif' : null}
      </h5>

      <HuntExplainGuide sheet={sheet} />

      <div className="loot-details-dual-grid">
        <div>
          <p className="loot-details-subtitle">Par rareté</p>
          <table className="loot-details-compact-table">
            <thead>
              <tr>
                <th>R</th>
                <th>
                  <LootRateHoverTip explain={HUNT_RATE_COLUMN_EXPLAINS.base}>Base</LootRateHoverTip>
                </th>
                <th>
                  <LootRateHoverTip explain={HUNT_RATE_COLUMN_EXPLAINS.boosted}>Avec bonus</LootRateHoverTip>
                </th>
              </tr>
            </thead>
            <tbody>
              {sheet.rarityRows.map((row) => (
                <tr key={row.rarity}>
                  <td style={{ color: RARITY_COLORS[row.rarity] }}>{row.rarity}</td>
                  <td>
                    <LootRateHoverTip explain={row.baseExplain}>{formatPct(row.basePercent)}</LootRateHoverTip>
                  </td>
                  <td>
                    <LootRateHoverTip explain={row.boostedExplain}>
                      {formatPct(row.boostedPercent)}
                    </LootRateHoverTip>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="loot-details-total-row">
                <td>Total</td>
                <td>{formatPct(baseRarityTotal)}</td>
                <td>{formatPct(boostedRarityTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div>
          <p className="loot-details-subtitle">Myrions par palier</p>
          <p className="loot-details-hint loot-details-hint--tight">
            Survole un % pour le détail. Total espèces : base {formatPct(baseSpeciesTotal)} · bonus{' '}
            {formatPct(boostedSpeciesTotal)} (normalisé à {formatPct(LOOT_PERCENT_TOTAL)}).
          </p>
          <div className="loot-details-tier-sections">
            {tierSections.map((section) => (
              <HuntTierSectionBlock key={section.rarity} section={section} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function HuntDropRatesContent({
  collection,
  huntFavors,
  focusBiomeId,
}: HuntDropRatesContentProps) {
  const sheets = useMemo(
    () => getHuntDropSheets(collection, huntFavors),
    [collection, huntFavors],
  )

  const [selectedBiomeId, setSelectedBiomeId] = useState(
    focusBiomeId ?? sheets.find((sheet) => sheet.unlocked)?.biomeId ?? sheets[0]?.biomeId ?? '',
  )

  useEffect(() => {
    if (focusBiomeId) setSelectedBiomeId(focusBiomeId)
  }, [focusBiomeId])

  const activeSheet =
    getHuntBiomeDropSheet(selectedBiomeId, collection, huntFavors) ?? sheets[0] ?? null

  const favorNotes = activeSheet?.activeFavorNotes ?? []

  return (
    <div className="loot-details-sections">
      <section>
        <h5>Faveurs actives ({huntFavors.length} en file · max 3)</h5>
        <ul className="loot-details-bullets">
          {favorNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section>
        <label className="loot-details-biome-picker">
          Biome
          <select
            value={selectedBiomeId}
            onChange={(event) => setSelectedBiomeId(event.target.value)}
          >
            {sheets.map((sheet) => (
              <option key={sheet.biomeId} value={sheet.biomeId}>
                {sheet.emoji} {sheet.biomeName}
                {sheet.unlocked ? '' : ' (verrouillé)'}
              </option>
            ))}
          </select>
        </label>
      </section>

      {activeSheet ? <BiomeDropSection sheet={activeSheet} /> : null}
    </div>
  )
}
