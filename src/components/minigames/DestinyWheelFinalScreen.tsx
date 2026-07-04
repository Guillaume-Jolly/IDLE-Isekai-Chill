import type { ReactNode } from 'react'

import type { CharacterSheet, RunState } from '../../data/destinyWheel/types'
import {
  computeSheetDisplayRating,
  renderRatingStars,
  type RunRating,
} from '../../data/destinyWheel/runRating'
import {
  FicheDestinView,
  type HavreGameModeDef,
  type SavedHavreIsekaiCard,
} from '../../features/havreIsekaiWheel'

type Props = {
  sheet: CharacterSheet
  runState: RunState
  displayName: string
  onDisplayNameChange: (name: string) => void
  favorite: boolean
  onToggleFavorite: () => void
  isHavrePack: boolean
  savedHavreCard?: SavedHavreIsekaiCard | null
  havreModeDef?: HavreGameModeDef
  autoArchived?: boolean
  portrait?: string
  readOnly?: boolean
  ratingOverride?: RunRating
  onValidate: () => void
  onReplay: () => void
  onQuit: () => void
}

export function DestinyWheelFinalScreen({
  sheet,
  runState,
  displayName,
  onDisplayNameChange,
  favorite,
  onToggleFavorite,
  isHavrePack,
  savedHavreCard,
  havreModeDef,
  autoArchived,
  portrait = '👹',
  readOnly = false,
  ratingOverride,
  onValidate,
  onReplay,
  onQuit,
}: Props) {
  const rating = ratingOverride ?? computeSheetDisplayRating(sheet, runState)

  return (
    <section
      className={[
        'dw-sheet',
        'dw-sheet--final',
        'dw-sheet--compact',
        readOnly ? 'dw-sheet--readonly' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="dw-sheet-header dw-sheet-header--final">
        <div className="dw-sheet-identity">
          {readOnly ? (
            <>
              <p className="dw-sheet-name-kicker">Nom du compagnon</p>
              <p className="dw-sheet-name-static">{displayName}</p>
            </>
          ) : (
            <label className="dw-sheet-name-field">
              <span className="dw-sheet-name-kicker">Nom du compagnon</span>
              <input
                className="dw-sheet-name-input"
                type="text"
                value={displayName}
                maxLength={48}
                onChange={(event) => onDisplayNameChange(event.target.value)}
                aria-label="Nom du compagnon"
              />
            </label>
          )}
          <p className="dw-sheet-title">{sheet.identity.title}</p>
          <div className="dw-sheet-rating" aria-label={`Note ${rating.score} sur ${rating.maxScore}`}>
            <span className="dw-rating-stars" aria-hidden>
              {renderRatingStars(rating.stars)}
            </span>
            <span className="dw-rating-score">
              {rating.score}/{rating.maxScore}
            </span>
            <span className="dw-rating-label">{rating.label}</span>
          </div>
        </div>
        <div className="dw-portrait dw-portrait--compact">{portrait}</div>
      </header>

      {isHavrePack ? (
        <div className="dw-final-body dw-final-body--fiche">
          <FicheDestinView
            sheet={sheet}
            runState={runState}
            card={savedHavreCard ?? undefined}
            modeDef={havreModeDef}
            displayName={displayName}
          />
          {savedHavreCard ? (
            <p className="dw-fiche-badge">
              {savedHavreCard.playerMeta.badge}
              {autoArchived ? ' · archivée automatiquement' : ''}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="dw-sheet-grid dw-sheet-grid--final">
          <SheetBlock title="Identité & stats" compact className="dw-sheet-block--identity-stats">
            <div className="dw-sheet-split-cols dw-sheet-split-cols--dense">
              <div className="dw-sheet-split-col">
                <SheetRow label="Origine" value={sheet.identity.origin} />
                <SheetRow label="Race/Type" value={sheet.identity.raceType} />
                <SheetRow label="Classe" value={sheet.identity.mainClass} />
              </div>
              <div className="dw-sheet-split-col">
                <SheetRow label="Rang" value={sheet.identity.rank} />
                <SheetRow label="Affiliation" value={sheet.identity.affiliation} />
                {Object.entries(sheet.stats.core).slice(0, 4).map(([key, value]) => (
                  <SheetRow key={key} label={key} value={value} />
                ))}
              </div>
              <div className="dw-sheet-split-col">
                {Object.entries(sheet.stats.core).slice(4).map(([key, value]) => (
                  <SheetRow key={key} label={key} value={value} />
                ))}
              </div>
            </div>
          </SheetBlock>

          <div className="dw-sheet-side-col">
            <SheetBlock title="Armes & Item" compact>
              <SheetRow label="Arme principale" value={sheet.weapons.main} />
              <SheetRow label="Maîtrise" value={sheet.weapons.mainMastery} />
              {sheet.weapons.secondary ? (
                <SheetRow label="Arme sec." value={sheet.weapons.secondary} />
              ) : null}
              <SheetRow label="Item World" value={sheet.item.itemWorld} />
              <SheetRow label="Trait item" value={sheet.item.itemTrait} />
            </SheetBlock>
            <SheetBlock title="Evilities & forme" compact>
              <SheetRow label="Unique" value={sheet.evilities.unique} />
              <SheetRow label="Sec. 1" value={sheet.evilities.secondary1} />
              <SheetRow label="Sec. 2" value={sheet.evilities.secondary2} />
              <SheetRow label="Maudite" value={sheet.evilities.cursed} />
              <SheetRow label="Forme" value={sheet.ultimateForm.name} />
            </SheetBlock>
          </div>

          <SheetBlock title="Final — Boss" compact final boss>
            <SheetRow label="Rival" value={sheet.finale.rival} />
            <SheetRow label="Boss final" value={sheet.finale.boss} />
            <SheetRow label="Verdict" value={sheet.finale.verdict.label} />
            <SheetRow label="Chance victoire" value={`${sheet.finale.winChance}%`} />
            {sheet.finale.combos.length > 0 ? (
              <div className="dw-boss-combos">
                {sheet.finale.combos.map((combo) => (
                  <span key={combo.id} className="dw-boss-combo-chip">
                    {combo.name ?? combo.id}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="dw-final-text-grid dw-final-text-grid--boss">
              {sheet.finale.statRoasts.map((roast) => (
                <p key={roast.id} className="dw-roast dw-roast--compact">
                  <strong>{roast.label}:</strong> {roast.text}
                </p>
              ))}
            </div>
            <p className="dw-comic-line dw-comic-line--compact">{sheet.finale.comicLine}</p>
          </SheetBlock>
        </div>
      )}

      {readOnly ? null : (
        <div className="dw-final-actions" role="group" aria-label="Actions finales">
          <button type="button" className="dw-final-btn dw-final-btn--primary" onClick={onValidate}>
            Valider la fiche
          </button>
          <button
            type="button"
            className={`dw-final-btn dw-final-btn--favorite${favorite ? ' dw-final-btn--favorite-active' : ''}`}
            onClick={onToggleFavorite}
          >
            {favorite ? '★ Favori' : '☆ Mettre en favoris'}
          </button>
          <button type="button" className="dw-final-btn" onClick={onReplay}>
            Rejouer
          </button>
          <button type="button" className="dw-final-btn" onClick={onQuit}>
            Quitter
          </button>
        </div>
      )}
    </section>
  )
}

function SheetBlock({
  title,
  compact,
  final,
  boss,
  className,
  children,
}: {
  title: string
  compact?: boolean
  final?: boolean
  boss?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={[
        'dw-sheet-block',
        compact ? 'dw-sheet-block--compact' : '',
        final ? 'dw-sheet-block--final' : '',
        boss ? 'dw-sheet-block--boss' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <h4>{title}</h4>
      {children}
    </div>
  )
}

function SheetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="dw-sheet-row dw-sheet-row--compact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
