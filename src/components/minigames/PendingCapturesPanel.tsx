import { useMemo, useState } from 'react'
import {
  buildPendingCaptureSnapshots,
  countProtectedPending,
  PENDING_BULK_KEEP_OPTIONS,
  PENDING_BULK_RELEASE_OPTIONS,
  pendingIdsMatchingCondition,
  pendingIdsMatchingKeepCondition,
  type PendingBulkKeepCondition,
  type PendingBulkReleaseCondition,
  type PendingCaptureSnapshot,
} from '../../data/pendingCaptures'
import type { PendingHuntCapture, PetState } from '../../data/minigameSave'
import { SUPPORT_STAT_LABELS, TRAIT_LABELS } from '../../data/myrionMvp2'
import type { HuntSearchObjective } from '../../data/myrionMvp2'
import { formatVisualVariant } from '../../data/myrionVariants'
import { RARITY_COLORS } from '../../data/wildFamiliars'
import { PalmonSprite } from './PalmonSprite'
import './Minigames.css'

type PendingCapturesPanelProps = {
  entries: PendingHuntCapture[]
  refugePets: PetState[]
  objectives: HuntSearchObjective[]
  onKeep: (id: string) => void
  onRelease: (id: string) => void
  onKeepAll: () => void
  onKeepMatching: (condition: PendingBulkKeepCondition) => void
  onReleaseAll: () => void
  onReleaseMatching: (condition: PendingBulkReleaseCondition) => void
}

function PendingCaptureSynth({ snapshot }: { snapshot: PendingCaptureSnapshot }) {
  const { entry, comparison, power } = snapshot
  const { pet } = entry
  const objectiveHit = comparison.objectiveResults.some((result) => result.status === 'hit')

  return (
    <div className={`mg-hunt-pending-synth-body verdict-${comparison.verdict}`}>
      <p className="mg-hunt-pending-synth-headline">{comparison.headline}</p>
      <ul className="mg-hunt-pending-synth-tags">
        <li>Puissance {power}</li>
        {comparison.speciesCopyCount > 0 ? (
          <li>
            {comparison.speciesCopyCount} en stock
            {comparison.beatsWeakest ? ' · bat le plus faible' : ''}
          </li>
        ) : (
          <li>Premier exemplaire</li>
        )}
        {pet.isShiny ? <li className="tag-shiny">Shiny</li> : null}
        {pet.visualVariant ? (
          <li className="tag-variant">{formatVisualVariant(pet.visualVariant)}</li>
        ) : null}
        {objectiveHit ? <li className="tag-objective">Objectif atteint</li> : null}
        {comparison.recommendRelease ? <li className="tag-release">Relâche conseillée</li> : null}
        {comparison.protectFromAutoRelease ? <li className="tag-protect">À conserver</li> : null}
      </ul>
      {pet.traits && pet.traits.length > 0 ? (
        <p className="mg-hunt-pending-synth-meta">
          Traits : {pet.traits.map((trait) => TRAIT_LABELS[trait] ?? trait).join(', ')}
        </p>
      ) : null}
      {pet.supportBuffs && pet.supportBuffs.length > 0 ? (
        <p className="mg-hunt-pending-synth-meta">
          Buffs :{' '}
          {pet.supportBuffs
            .map((buff) => `${SUPPORT_STAT_LABELS[buff.stat]} +${buff.value}`)
            .join(' · ')}
        </p>
      ) : null}
      <p className="mg-hunt-pending-synth-meta">
        Lignée {pet.lineagePotential ?? 0}/100 · Gen. {pet.generation ?? 0}
      </p>
      {comparison.objectiveResults.length > 0 ? (
        <ul className="mg-hunt-pending-synth-objectives">
          {comparison.objectiveResults.map((objective) => (
            <li className={`status-${objective.status}`} key={objective.objectiveId}>
              {objective.label} —{' '}
              {objective.status === 'hit'
                ? 'atteint'
                : objective.status === 'partial'
                  ? 'partiel'
                  : 'non atteint'}
            </li>
          ))}
        </ul>
      ) : null}
      {comparison.details.length > 0 ? (
        <ul className="mg-hunt-pending-synth-details">
          {comparison.details.slice(0, 3).map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function PendingCapturesPanel({
  entries,
  refugePets,
  objectives,
  onKeep,
  onRelease,
  onKeepAll,
  onKeepMatching,
  onReleaseAll,
  onReleaseMatching,
}: PendingCapturesPanelProps) {
  const [bulkReleaseCondition, setBulkReleaseCondition] = useState<PendingBulkReleaseCondition>(
    'recommend_release',
  )
  const [bulkKeepCondition, setBulkKeepCondition] = useState<PendingBulkKeepCondition>('while_room')

  const snapshots = useMemo(
    () => buildPendingCaptureSnapshots(entries, refugePets, objectives),
    [entries, refugePets, objectives],
  )

  const matchingReleaseIds = useMemo(
    () => pendingIdsMatchingCondition(snapshots, bulkReleaseCondition),
    [snapshots, bulkReleaseCondition],
  )

  const matchingKeepIds = useMemo(
    () =>
      pendingIdsMatchingKeepCondition(
        snapshots,
        bulkKeepCondition,
        refugePets,
        entries,
      ),
    [snapshots, bulkKeepCondition, refugePets, entries],
  )

  const protectedCount = useMemo(() => countProtectedPending(snapshots), [snapshots])

  const handleReleaseAll = () => {
    const message =
      protectedCount > 0
        ? `Relâcher les ${entries.length} Myrions en attente ? ${protectedCount} sont protégés (shiny, objectif, etc.) — cette action est définitive.`
        : `Relâcher les ${entries.length} Myrions en attente ? Cette action est définitive.`
    if (window.confirm(message)) {
      onReleaseAll()
    }
  }

  const handleReleaseMatching = () => {
    if (matchingReleaseIds.length === 0) return
    const option = PENDING_BULK_RELEASE_OPTIONS.find((item) => item.id === bulkReleaseCondition)
    if (
      window.confirm(
        `Relâcher ${matchingReleaseIds.length} Myrion${matchingReleaseIds.length > 1 ? 's' : ''} (${option?.label ?? 'condition'}) ?`,
      )
    ) {
      onReleaseMatching(bulkReleaseCondition)
    }
  }

  const handleKeepAll = () => {
    const message = `Garder les ${entries.length} Myrions en attente ? Les espèces saturées remplaceront automatiquement le plus faible.`
    if (window.confirm(message)) {
      onKeepAll()
    }
  }

  const handleKeepMatching = () => {
    if (matchingKeepIds.length === 0) return
    const option = PENDING_BULK_KEEP_OPTIONS.find((item) => item.id === bulkKeepCondition)
    const replaceNote =
      bulkKeepCondition === 'all'
        ? ' Les espèces saturées remplaceront le plus faible.'
        : ''
    if (
      window.confirm(
        `Garder ${matchingKeepIds.length} Myrion${matchingKeepIds.length > 1 ? 's' : ''} (${option?.label ?? 'condition'}) ?${replaceNote}`,
      )
    ) {
      onKeepMatching(bulkKeepCondition)
    }
  }

  if (entries.length === 0) {
    return (
      <section className="mg-hunt-pending">
        <header className="mg-hunt-pending-head">
          <h4>En attente</h4>
        </header>
        <p className="mg-hunt-pending-empty">
          Aucun Myrion en attente. Active « Trier plus tard » pour stocker les captures sans points.
        </p>
      </section>
    )
  }

  return (
    <section className="mg-hunt-pending">
      <header className="mg-hunt-pending-head">
        <h4>En attente</h4>
        <span className="mg-hunt-pending-count">{entries.length}</span>
      </header>
      <p className="mg-hunt-pending-copy">
        Ces captures n&apos;ont pas encore apporté de points ni rejoint le refuge.
      </p>

      <div className="mg-hunt-pending-bulk">
        <div className="mg-hunt-pending-bulk-row">
          <button className="mg-hunt-pending-bulk-btn primary" type="button" onClick={handleKeepAll}>
            Tout garder ({entries.length})
          </button>
          <div className="mg-hunt-pending-bulk-cond">
            <label className="mg-hunt-pending-bulk-label" htmlFor="mg-pending-bulk-keep">
              Garder selon
            </label>
            <select
              className="mg-hunt-pending-bulk-select"
              id="mg-pending-bulk-keep"
              value={bulkKeepCondition}
              onChange={(event) =>
                setBulkKeepCondition(event.target.value as PendingBulkKeepCondition)
              }
            >
              {PENDING_BULK_KEEP_OPTIONS.filter((option) => option.id !== 'all').map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="mg-hunt-pending-bulk-btn"
              disabled={matchingKeepIds.length === 0}
              type="button"
              onClick={handleKeepMatching}
            >
              Garder ({matchingKeepIds.length})
            </button>
          </div>
        </div>
        <p className="mg-hunt-pending-bulk-hint">
          {PENDING_BULK_KEEP_OPTIONS.find((option) => option.id === bulkKeepCondition)?.description}
        </p>

        <div className="mg-hunt-pending-bulk-row">
          <button className="mg-hunt-pending-bulk-btn danger" type="button" onClick={handleReleaseAll}>
            Tout relâcher ({entries.length})
          </button>
          <div className="mg-hunt-pending-bulk-cond">
            <label className="mg-hunt-pending-bulk-label" htmlFor="mg-pending-bulk-release">
              Relâcher selon
            </label>
            <select
              className="mg-hunt-pending-bulk-select"
              id="mg-pending-bulk-release"
              value={bulkReleaseCondition}
              onChange={(event) =>
                setBulkReleaseCondition(event.target.value as PendingBulkReleaseCondition)
              }
            >
              {PENDING_BULK_RELEASE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              className="mg-hunt-pending-bulk-btn secondary"
              disabled={matchingReleaseIds.length === 0}
              type="button"
              onClick={handleReleaseMatching}
            >
              Relâcher ({matchingReleaseIds.length})
            </button>
          </div>
        </div>
        <p className="mg-hunt-pending-bulk-hint">
          {
            PENDING_BULK_RELEASE_OPTIONS.find((option) => option.id === bulkReleaseCondition)
              ?.description
          }
          {protectedCount > 0
            ? ` Les ${protectedCount} spécimen${protectedCount > 1 ? 's' : ''} protégé${protectedCount > 1 ? 's' : ''} ne sont jamais inclus dans un relâchement conditionnel.`
            : null}
        </p>
      </div>

      <ul className="mg-hunt-pending-list">
        {snapshots.map((snapshot) => (
          <li className="mg-hunt-pending-item" key={snapshot.entry.id}>
            <div className="mg-hunt-pending-hero">
              <PalmonSprite
                emoji={snapshot.entry.pet.emoji}
                name={snapshot.entry.pet.name}
                size="chibi"
                speciesId={snapshot.entry.pet.speciesId}
                variant="chibi"
              />
              <div>
                <p className="mg-hunt-pending-name">
                  {snapshot.entry.pet.name}
                  {snapshot.entry.pet.isShiny ? ' ✨' : ''}
                </p>
                <span
                  className="mg-rarity-badge"
                  style={{ color: RARITY_COLORS[snapshot.entry.pet.rarity] }}
                >
                  {snapshot.entry.pet.rarity}
                </span>
                <p className="mg-hunt-pending-verdict">{snapshot.comparison.headline}</p>
              </div>
            </div>

            <details className="mg-hunt-pending-synth">
              <summary>Synthèse détaillée</summary>
              <PendingCaptureSynth snapshot={snapshot} />
            </details>

            <div className="mg-hunt-pending-actions">
              <button
                className="mg-hunt-pending-btn"
                type="button"
                onClick={() => onKeep(snapshot.entry.id)}
              >
                Garder
              </button>
              <button
                className="mg-hunt-pending-btn secondary"
                type="button"
                onClick={() => onRelease(snapshot.entry.id)}
              >
                Relâcher
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
