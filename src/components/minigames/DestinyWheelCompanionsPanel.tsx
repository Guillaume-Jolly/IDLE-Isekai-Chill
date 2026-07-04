import type { CharacterSheet, RunState } from '../../data/destinyWheel/types'
import { ratingFromDisplayScore } from '../../data/destinyWheel/runRating'
import type { SavedDestinyWheelCard } from '../../data/destinyWheel/destinyWheelArchiveStore'
import { DESTINY_WHEEL_MAX_CARDS_PER_PACK } from '../../data/destinyWheel/destinyWheelArchiveStore'
import type { WheelPackId } from '../../data/destinyWheel/wheelPacks'
import { DESTINY_WHEEL_PACKS } from '../../data/destinyWheel/wheelPacks'
import { DestinyWheelFinalScreen } from './DestinyWheelFinalScreen'

export function DestinyWheelArchiveSheetOverlay({
  card,
  onClose,
}: {
  card: SavedDestinyWheelCard
  onClose: () => void
}) {
  const runState = { tags: {}, stats: {}, rarityHistory: [], combos: [] } as unknown as RunState

  return (
    <div className="dw-archive-overlay" role="dialog" aria-modal="true" aria-label={`Fiche ${card.name}`}>
      <div className="dw-archive-overlay-backdrop" onClick={onClose} aria-hidden />
      <div className="dw-archive-overlay-panel">
        <header className="dw-archive-overlay-head">
          <p className="dw-archive-overlay-kicker">Archive · {card.title}</p>
          <button type="button" className="dw-archive-overlay-close" onClick={onClose}>
            Fermer
          </button>
        </header>
        <DestinyWheelFinalScreen
          sheet={card.sheet}
          runState={runState}
          displayName={card.name}
          onDisplayNameChange={() => {}}
          favorite={card.favorite}
          onToggleFavorite={() => {}}
          isHavrePack={card.packId === 'havre'}
          readOnly
          ratingOverride={ratingFromDisplayScore(card.displayScore)}
          onValidate={onClose}
          onReplay={onClose}
          onQuit={onClose}
        />
      </div>
    </div>
  )
}

export function DestinyWheelCompanionsPanel({
  activePackId,
  archives,
  onToggleFavorite,
  onViewCard,
}: {
  activePackId: WheelPackId
  archives: SavedDestinyWheelCard[]
  onToggleFavorite?: (entryId: string, favorite: boolean) => void
  onViewCard?: (card: SavedDestinyWheelCard) => void
}) {
  const packLabel = DESTINY_WHEEL_PACKS.find((pack) => pack.id === activePackId)?.label ?? activePackId
  const cards = archives.slice().reverse()

  if (cards.length === 0) {
    return (
      <p className="dw-debug-hint">
        Aucun compagnon archivé pour {packLabel} — valide une fiche pour remplir l’archive (max{' '}
        {DESTINY_WHEEL_MAX_CARDS_PER_PACK}).
      </p>
    )
  }

  return (
    <div className="fiche-archive-list">
      <p className="dw-case-history-kicker">
        {packLabel} ({cards.length}/{DESTINY_WHEEL_MAX_CARDS_PER_PACK})
      </p>
      {cards.slice(0, 48).map((entry) => (
        <div key={entry.id} className="fiche-archive-item">
          <div className="fiche-archive-item-head">
            <span>{entry.name}</span>
            <span>{entry.title}</span>
          </div>
          <p className="fiche-archive-item-meta">
            {entry.displayScore}/100 · {entry.verdictId}
            {' · '}
            {new Date(entry.completedAt).toLocaleDateString('fr-FR')}
          </p>
          <div className="fiche-archive-actions">
            {onViewCard ? (
              <button type="button" onClick={() => onViewCard(entry)}>
                Voir la fiche
              </button>
            ) : null}
            {onToggleFavorite ? (
              <button type="button" onClick={() => onToggleFavorite(entry.id, !entry.favorite)}>
                {entry.favorite ? '★ Favori' : '☆ Favori'}
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export function HavreArchiveSheetOverlay({
  sheet,
  displayName,
  badge,
  onClose,
}: {
  sheet: CharacterSheet
  displayName: string
  badge: string
  onClose: () => void
}) {
  return (
    <div className="dw-archive-overlay" role="dialog" aria-modal="true" aria-label={`Fiche ${displayName}`}>
      <div className="dw-archive-overlay-backdrop" onClick={onClose} aria-hidden />
      <div className="dw-archive-overlay-panel dw-archive-overlay-panel--havre">
        <header className="dw-archive-overlay-head">
          <p className="dw-archive-overlay-kicker">{badge}</p>
          <button type="button" className="dw-archive-overlay-close" onClick={onClose}>
            Fermer
          </button>
        </header>
        <DestinyWheelFinalScreen
          sheet={sheet}
          runState={{ tags: {}, stats: {}, rarityHistory: [], combos: [] } as unknown as RunState}
          displayName={displayName}
          onDisplayNameChange={() => {}}
          favorite={false}
          onToggleFavorite={() => {}}
          isHavrePack
          readOnly
          onValidate={onClose}
          onReplay={onClose}
          onQuit={onClose}
        />
      </div>
    </div>
  )
}
