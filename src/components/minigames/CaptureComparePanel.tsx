import type { CaptureCompareResult } from '../../data/myrionMvp2'
import { SUPPORT_STAT_LABELS, TRAIT_LABELS } from '../../data/myrionMvp2'
import type { PetState } from '../../data/minigameSave'
import { formatVisualVariant } from '../../data/myrionVariants'
import { PalmonSprite } from './PalmonSprite'
import './Minigames.css'

type CaptureComparePanelProps = {
  pet: PetState
  result: CaptureCompareResult
  onClose: () => void
  onReplaceWeakest?: () => void
  onReleaseNew?: () => void
  embedded?: boolean
}

export function CaptureComparePanel({
  pet,
  result,
  onClose,
  onReplaceWeakest,
  onReleaseNew,
  embedded = false,
}: CaptureComparePanelProps) {
  const canReplace = result.overflowRequired && result.weakestDuplicate && onReplaceWeakest
  const dismissible = !result.overflowRequired

  const body = (
    <div
      className={`mg-capture-compare ${result.verdict} ${result.overflowRequired ? 'overflow' : ''} ${embedded ? 'embedded' : ''}`}
    >
      <header className="mg-capture-compare-head">
        <div>
          <p className="eyebrow">
            {pet.isShiny ? 'Shiny' : pet.visualVariant ? 'Variante' : pet.rarity}
          </p>
          <h3>{result.headline}</h3>
        </div>
        {!embedded && dismissible ? (
          <button className="secondary" type="button" onClick={onClose}>
            OK
          </button>
        ) : null}
      </header>

      <div className="mg-capture-compare-hero">
        <PalmonSprite
          emoji={pet.emoji}
          name={pet.name}
          size="chibi"
          speciesId={pet.speciesId}
          variant="chibi"
        />
        <div>
          <p className="mg-capture-compare-name">
            {pet.name}
            {pet.isShiny ? ' ✨' : ''}
            {pet.visualVariant ? ` · ${formatVisualVariant(pet.visualVariant)}` : ''}
          </p>
          {result.speciesCopyCount > 0 ? (
            <p className="mg-capture-compare-count">
              {result.speciesCopyCount} exemplaire{result.speciesCopyCount > 1 ? 's' : ''} de cette espèce
            </p>
          ) : null}
        </div>
      </div>

      {pet.traits && pet.traits.length > 0 ? (
        <p className="mg-capture-compare-meta">
          Traits : {pet.traits.map((trait) => TRAIT_LABELS[trait] ?? trait).join(', ')}
        </p>
      ) : null}
      {pet.supportBuffs && pet.supportBuffs.length > 0 ? (
        <p className="mg-capture-compare-meta">
          Buffs :{' '}
          {pet.supportBuffs
            .map((buff) => `${SUPPORT_STAT_LABELS[buff.stat]} +${buff.value}`)
            .join(' · ')}
        </p>
      ) : null}
      <p className="mg-capture-compare-meta">
        Lignée {pet.lineagePotential ?? 0}/100 · Gen. {pet.generation ?? 0}
      </p>

      <ul className="mg-capture-compare-details">
        {result.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>

      {result.objectiveResults.length > 0 ? (
        <div className="mg-capture-compare-objectives">
          <strong>Objectifs de pistage</strong>
          <ul>
            {result.objectiveResults.map((objective) => (
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
        </div>
      ) : null}

      <div className="mg-capture-compare-actions">
        {result.overflowRequired ? (
          <>
            {canReplace ? (
              <button type="button" onClick={onReplaceWeakest}>
                Garder le nouveau (remplace {result.weakestDuplicate?.name})
              </button>
            ) : (
              <p className="mg-capture-compare-hint warn">
                Aucun exemplaire remplaçable — relâche le nouveau ou un ancien depuis le refuge.
              </p>
            )}
            {onReleaseNew ? (
              <button className="secondary" type="button" onClick={onReleaseNew}>
                Relâcher le nouveau
              </button>
            ) : null}
          </>
        ) : (
          <>
            <button type="button" onClick={onClose}>
              Garder le Myrion
            </button>
            {onReleaseNew ? (
              <button className="secondary" type="button" onClick={onReleaseNew}>
                Relâcher le Myrion
              </button>
            ) : null}
            {result.recommendRelease ? (
              <p className="mg-capture-compare-hint warn">
                Relâche recommandée pour une Faveur du biome et des ressources.
              </p>
            ) : (
              <p className="mg-capture-compare-hint">Le Myrion rejoint ton refuge.</p>
            )}
          </>
        )}
      </div>
    </div>
  )

  if (embedded) return body

  return (
    <div
      className="mg-capture-compare-overlay"
      role="presentation"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        aria-labelledby="mg-capture-compare-title"
        aria-modal="true"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        {body}
      </div>
    </div>
  )
}
