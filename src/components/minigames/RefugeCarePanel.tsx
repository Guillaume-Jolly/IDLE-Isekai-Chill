import { MAX_SPECIES_COPIES } from '../../data/myrionRefuge'
import type { PetState } from '../../data/minigameSave'
import {
  effectiveSupportBuffs,
  maxSupportBuffSlots,
  SUPPORT_STAT_LABELS,
  TRAIT_LABELS,
} from '../../data/myrionMvp2'
import {
  describeInactiveBuffs,
  describeLinkedBuffs,
  findCompanionForMyrion,
  rarityLinkLabel,
} from '../../data/myrionCompanionLinks'
import { formatVisualVariant } from '../../data/myrionVariants'
import './RefugeCarePanel.css'

export type BulkCareScope = 'biome' | 'refuge'

type RefugeCarePanelProps = {
  affinityMult: number
  biomePetCount: number
  companionId: string
  companionLinks: Partial<Record<string, string>>
  companionName: string
  companionSupport: number
  isLinkedToActiveCompanion: boolean
  linkedMyrion?: PetState
  pet: PetState
  refugePetCount: number
  releaseConfirmPending: boolean
  siblingIndex: number
  speciesCount: number
  speciesSiblingCount: number
  biomeSpeciesIndex: number
  biomeSpeciesCount: number
  variant?: 'drawer' | 'popover'
  onBulkCare: (scope: BulkCareScope) => void
  onClose?: () => void
  onCuddle: () => void
  onCycleBiomePet: (delta: number) => void
  onCycleDuplicate: (delta: number) => void
  onFeed: () => void
  onObserve: () => void
  onPlay: () => void
  onReleaseClick: () => void
  onToggleCompanionLink: () => void
}

function affectionPercent(level: number) {
  return Math.round((level / 5) * 100)
}

export function RefugeCarePanel({
  affinityMult,
  biomePetCount,
  companionId,
  companionLinks,
  companionName,
  companionSupport,
  isLinkedToActiveCompanion,
  linkedMyrion,
  pet,
  refugePetCount,
  releaseConfirmPending,
  siblingIndex,
  speciesCount,
  speciesSiblingCount,
  biomeSpeciesIndex,
  biomeSpeciesCount,
  variant = 'drawer',
  onBulkCare,
  onClose,
  onCuddle,
  onCycleBiomePet,
  onCycleDuplicate,
  onFeed,
  onObserve,
  onPlay,
  onReleaseClick,
  onToggleCompanionLink,
}: RefugeCarePanelProps) {
  const compact = variant === 'popover'
  const iconOnlyActions = compact || variant === 'drawer'

  return (
    <div className={`mg-refuge-care-panel${compact ? ' mg-refuge-care-panel--popover' : ' mg-refuge-care-panel--drawer'}`}>
      <header className="mg-refuge-care-panel-head">
        <div>
          <strong id={`mg-refuge-care-title-${pet.id}`}>
            {pet.name}
            {pet.isShiny ? ' ✨' : ''}
          </strong>
          <span>
            {pet.rarity}
            {!compact && pet.visualVariant ? ` · ${formatVisualVariant(pet.visualVariant)}` : ''}
            {' · '}
            {speciesCount}/{MAX_SPECIES_COPIES} ex.
          </span>
        </div>
        {onClose ? (
          <button aria-label="Fermer les soins" className="mg-refuge-care-panel-close" type="button" onClick={onClose}>
            ×
          </button>
        ) : null}
      </header>

      {biomeSpeciesCount > 1 || speciesSiblingCount > 1 ? (
        <nav aria-label="Navigation entre Myrions" className="mg-refuge-care-panel-nav">
          {biomeSpeciesCount > 1 ? (
            <div className="mg-refuge-care-panel-nav-row">
              <span className="mg-refuge-care-panel-nav-label">Enclos</span>
              <button aria-label="Espèce précédente dans l'enclos" type="button" onClick={() => onCycleBiomePet(-1)}>
                ‹
              </button>
              <span className="mg-refuge-care-panel-nav-count">
                {biomeSpeciesIndex + 1}/{biomeSpeciesCount}
              </span>
              <button aria-label="Espèce suivante dans l'enclos" type="button" onClick={() => onCycleBiomePet(1)}>
                ›
              </button>
            </div>
          ) : null}
          {speciesSiblingCount > 1 ? (
            <div className="mg-refuge-care-panel-nav-row">
              <span className="mg-refuge-care-panel-nav-label">Exemplaire</span>
              <button aria-label="Exemplaire précédent" type="button" onClick={() => onCycleDuplicate(-1)}>
                ‹
              </button>
              <span className="mg-refuge-care-panel-nav-count">
                {siblingIndex + 1}/{speciesSiblingCount}
              </span>
              <button aria-label="Exemplaire suivant" type="button" onClick={() => onCycleDuplicate(1)}>
                ›
              </button>
            </div>
          ) : null}
        </nav>
      ) : null}

      <div className="mg-refuge-care-panel-stats">
        <div className="mg-refuge-care-stat">
          <span>🍽 Faim</span>
          <strong>{Math.round(pet.hunger)}%</strong>
        </div>
        <div className="mg-refuge-care-stat">
          <span>😊 Humeur</span>
          <strong>{Math.round(pet.joy)}%</strong>
        </div>
        <div className="mg-refuge-care-stat">
          <span>⚡ Énergie</span>
          <strong>{Math.round(pet.energy)}%</strong>
        </div>
        <div className="mg-refuge-care-stat">
          <span>♥ Affection</span>
          <strong>{affectionPercent(pet.affectionLevel)}%</strong>
        </div>
      </div>

      <div className="mg-refuge-care-panel-actions">
        <button aria-label="Nourrir" title="Nourrir" type="button" onClick={onFeed}>
          🍎{iconOnlyActions ? '' : ' Nourrir'}
        </button>
        <button aria-label="Câliner" title="Câliner" type="button" onClick={onCuddle}>
          💜{iconOnlyActions ? '' : ' Câliner'}
        </button>
        <button aria-label="Jouer" title="Jouer" type="button" onClick={onPlay}>
          🎾{iconOnlyActions ? '' : ' Jouer'}
        </button>
        <button aria-label="Observer" title="Observer" type="button" onClick={onObserve}>
          👀{iconOnlyActions ? '' : ' Observer'}
        </button>
      </div>

      <section className="mg-refuge-care-panel-bulk">
        <span className="mg-refuge-care-panel-bulk-label">Soins groupés</span>
        <div className="mg-refuge-care-panel-bulk-grid">
          <button disabled={biomePetCount === 0} type="button" onClick={() => onBulkCare('biome')}>
            🌿 Enclos ({biomePetCount})
          </button>
          <button disabled={refugePetCount === 0} type="button" onClick={() => onBulkCare('refuge')}>
            🏠 Refuge ({refugePetCount})
          </button>
        </div>
      </section>

      {!compact ? (
        <details className="mg-refuge-care-panel-details">
          <summary>Détails</summary>
          <div className="mg-refuge-care-panel-details-body">
            {pet.personality || pet.traits?.length ? (
              <p>
                {pet.personality ?? ''}
                {pet.traits?.length
                  ? `${pet.personality ? ' · ' : ''}${pet.traits.map((trait) => TRAIT_LABELS[trait] ?? trait).join(', ')}`
                  : ''}
              </p>
            ) : null}
            {pet.supportBuffs && pet.supportBuffs.length > 0 ? (
              <p>
                Buffs ({effectiveSupportBuffs(pet).length}/{maxSupportBuffSlots(pet)}) :{' '}
                {effectiveSupportBuffs(pet)
                  .map((buff) => `${SUPPORT_STAT_LABELS[buff.stat]} +${buff.value}`)
                  .join(' · ')}
              </p>
            ) : null}
            {describeInactiveBuffs(pet) ? <p className="warn">{describeInactiveBuffs(pet)}</p> : null}
            <p>
              Soutien {companionName} : +{companionSupport.toFixed(1)} (×{affinityMult.toFixed(2)})
              {linkedMyrion ? ` · lié : ${linkedMyrion.name}` : ''}
            </p>
            {isLinkedToActiveCompanion ? (
              <p>{describeLinkedBuffs(pet, companionId)}</p>
            ) : null}
            <p>
              Liaison : {rarityLinkLabel(pet.rarity)}
              {findCompanionForMyrion(companionLinks, pet.id) ? ' · déjà lié ailleurs' : ''}
            </p>
            <button className="secondary mg-refuge-link-btn" type="button" onClick={onToggleCompanionLink}>
              {isLinkedToActiveCompanion ? `Délier de ${companionName}` : `Lier à ${companionName}`}
            </button>
            <p>
              Lignée {pet.lineagePotential ?? 0}/100 · Gen. {pet.generation ?? 0}
              {pet.lrBlessing ? ' · Bénédiction LR' : ''}
            </p>
          </div>
        </details>
      ) : null}

      {speciesCount > 1 ? (
        <button
          className={`mg-refuge-care-panel-release${releaseConfirmPending ? ' confirm' : ''}`}
          type="button"
          onClick={onReleaseClick}
        >
          {releaseConfirmPending ? '⚠️ Confirmer le relâcher' : '🕊️ Relâcher'}
        </button>
      ) : null}
    </div>
  )
}
