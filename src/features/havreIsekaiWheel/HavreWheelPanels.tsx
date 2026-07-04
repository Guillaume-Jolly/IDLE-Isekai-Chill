import type { DestinyWheelSeed } from '../../data/destinyWheel/types'
import type {
  HavreGameModeDef,
  HavreGameModeId,
  HavreJokerDef,
  HavreRunSession,
  HavreWheelSave,
  SavedHavreIsekaiCard,
} from './types'
import { canUseJoker } from './jokerEngine'

const MODE_ORDER: HavreGameModeId[] = ['hardcore', 'auto_roll', 'artist']

export function HavreModeSelector({
  mode,
  gameModes,
  disabled,
  onChange,
}: {
  mode: HavreGameModeId
  gameModes: Record<string, HavreGameModeDef>
  disabled: boolean
  onChange: (mode: HavreGameModeId) => void
}) {
  return (
    <div className="havre-mode-group" role="group" aria-label="Mode Havre">
      <span className="dw-wheel-pack-label">Mode</span>
      {MODE_ORDER.map((modeId) => {
        const def = gameModes[modeId]
        if (!def) return null
        return (
          <button
            key={modeId}
            type="button"
            className={`havre-mode-btn${mode === modeId ? ' havre-mode-btn--active' : ''}`}
            disabled={disabled}
            title={def.subtitle}
            onClick={() => onChange(modeId)}
          >
            {def.label}
          </button>
        )
      })}
    </div>
  )
}

export function HavreJokerPanel({
  session,
  modeDef,
  jokers,
  wheelId,
  disabled,
  onUseJoker,
}: {
  session: HavreRunSession
  modeDef: HavreGameModeDef
  jokers: Record<string, HavreJokerDef>
  wheelId: string
  disabled: boolean
  onUseJoker: (jokerId: string) => void
}) {
  if (!modeDef.jokers_allowed) return null

  const entries = Object.entries(jokers).slice(0, 6)

  return (
    <div className="havre-joker-list">
      <p className="dw-case-history-kicker">
        Jokers ({session.jokersUsed.length}/{modeDef.max_jokers_per_run ?? 3})
      </p>
      {entries.map(([id, def]) => {
        const block = canUseJoker(id, session, modeDef, wheelId)
        return (
          <button
            key={id}
            type="button"
            className="havre-joker-btn"
            disabled={disabled || Boolean(block)}
            title={block ?? def.effect}
            onClick={() => onUseJoker(id)}
          >
            <strong>{def.label}</strong>
            <span>{def.effect}</span>
          </button>
        )
      })}
    </div>
  )
}

export function HavreArchivePanel({
  save,
  seed,
  onUpdateCard,
  onViewCard,
}: {
  save: HavreWheelSave
  seed: DestinyWheelSeed
  onUpdateCard: (cardId: string, updates: { favorite?: boolean; locked?: boolean; note?: string }) => void
  onViewCard?: (card: SavedHavreIsekaiCard) => void
}) {
  const buckets = ['hardcore', 'auto_roll', 'artist'] as const
  const archiveRules = seed.pack?.archiveRules

  return (
    <div className="fiche-archive-list">
      {buckets.map((bucket) => {
        const cards = save.archives[bucket]
        if (cards.length === 0) return null
        const badge = seed.pack?.gameModes?.[bucket]?.card_badge ?? bucket
        return (
          <section key={bucket}>
            <p className="dw-case-history-kicker">
              {badge} ({cards.length}/{archiveRules?.max_cards_per_mode ?? 100})
            </p>
            {cards
              .slice()
              .reverse()
              .slice(0, 12)
              .map((card) => (
                <HavreArchiveCardRow
                  key={card.id}
                  card={card}
                  onUpdateCard={onUpdateCard}
                  onViewCard={onViewCard}
                />
              ))}
          </section>
        )
      })}
      {buckets.every((bucket) => save.archives[bucket].length === 0) ? (
        <p className="dw-debug-hint">Aucune carte archivée — termine une run Havre pour remplir l’archive.</p>
      ) : null}
    </div>
  )
}

function HavreArchiveCardRow({
  card,
  onUpdateCard,
  onViewCard,
}: {
  card: SavedHavreIsekaiCard
  onUpdateCard: (cardId: string, updates: { favorite?: boolean; locked?: boolean; note?: string }) => void
  onViewCard?: (card: SavedHavreIsekaiCard) => void
}) {
  return (
    <div className="fiche-archive-item">
      <div className="fiche-archive-item-head">
        <span>{card.displayName}</span>
        <span>{card.verdict}</span>
      </div>
      <p className="fiche-archive-item-meta">
        {card.playerMeta.badge} · {new Date(card.createdAt).toLocaleDateString('fr-FR')}
      </p>
      <div className="fiche-archive-actions">
        {onViewCard ? (
          <button type="button" onClick={() => onViewCard(card)}>
            Voir la fiche
          </button>
        ) : null}
        <button type="button" onClick={() => onUpdateCard(card.id, { favorite: !card.playerMeta.favorite })}>
          {card.playerMeta.favorite ? '★ Favori' : '☆ Favori'}
        </button>
        <button type="button" onClick={() => onUpdateCard(card.id, { locked: !card.playerMeta.locked })}>
          {card.playerMeta.locked ? '🔒 Verrouillée' : '🔓 Verrouiller'}
        </button>
      </div>
    </div>
  )
}
