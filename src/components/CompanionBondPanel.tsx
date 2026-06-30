import { useState } from 'react'
import {
  AFFINITY_TIER_LABELS,
  BOND_TONE_LABELS,
  type BondAffinityTier,
  type CompanionBondConversation,
  getBondConversationsForCompanion,
  isBondConversationUnlocked,
} from '../data/companionBondConversations'
import { COMPANION_SUPPORT_SYSTEM_LABELS } from '../data/companionSupport'

type CompanionBondPanelProps = {
  companionId: string
  companionName: string
  currentAffinity: number
}

const TIERS: BondAffinityTier[] = [1, 2, 3, 4, 5]

export function CompanionBondPanel({
  companionId,
  companionName,
  currentAffinity,
}: CompanionBondPanelProps) {
  const conversations = getBondConversationsForCompanion(companionId)
  const [activeId, setActiveId] = useState<string | null>(null)

  if (conversations.length === 0) return null

  const activeConversation = conversations.find((entry) => entry.conversationId === activeId)

  return (
    <section className="companion-bond-panel" aria-label={`Conversations de lien — ${companionName}`}>
      <header className="companion-bond-panel-head">
        <strong>Conversations de lien</strong>
        <span className="companion-bond-panel-meta">
          Affinité {currentAffinity}/5
        </span>
      </header>
      <p className="companion-bond-panel-intro">
        Dialogues narratifs débloqués par palier — lecture gratuite. Pour une activité avec choix
        et récompenses, utilise le bouton <strong>Parler</strong> sur la carte.
      </p>

      <div className="companion-bond-tiers">
        {TIERS.map((tier) => {
          const tierConversations = conversations.filter((entry) => entry.affinityTier === tier)
          const unlocked = currentAffinity >= tier

          return (
            <div
              className={`companion-bond-tier ${unlocked ? 'unlocked' : 'locked'}`}
              key={tier}
            >
              <div className="companion-bond-tier-head">
                <span className="companion-bond-tier-label">
                  {tier}. {AFFINITY_TIER_LABELS[tier]}
                </span>
                {!unlocked ? (
                  <span className="companion-bond-tier-lock" title="Affinité insuffisante">
                    Verrouillé
                  </span>
                ) : null}
              </div>

              {unlocked ? (
                <ul className="companion-bond-prompt-list">
                  {tierConversations.map((conversation) => (
                    <li key={conversation.conversationId}>
                      <button
                        type="button"
                        className={`companion-bond-prompt-btn ${
                          activeId === conversation.conversationId ? 'active' : ''
                        }`}
                        onClick={() =>
                          setActiveId((prev) =>
                            prev === conversation.conversationId ? null : conversation.conversationId,
                          )
                        }
                      >
                        {conversation.prompt}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="companion-bond-tier-hint">
                  {tierConversations[0]?.unlockHint ??
                    `Monte l'affinité à ${tier} pour débloquer.`}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {activeConversation ? (
        <BondReplyCard conversation={activeConversation} companionName={companionName} />
      ) : null}
    </section>
  )
}

function BondReplyCard({
  conversation,
  companionName,
}: {
  conversation: CompanionBondConversation
  companionName: string
}) {
  return (
    <article className="companion-bond-reply">
      <p className="companion-bond-reply-prompt">
        <span className="companion-bond-speaker">Toi</span>
        {conversation.prompt}
      </p>
      <p className="companion-bond-reply-text">
        <span className="companion-bond-speaker">{companionName}</span>
        {conversation.companionReply}
      </p>
      <footer className="companion-bond-reply-meta">
        <span>{BOND_TONE_LABELS[conversation.tone]}</span>
        {conversation.relatedSystems?.length ? (
          <span>
            {conversation.relatedSystems
              .map((system) => COMPANION_SUPPORT_SYSTEM_LABELS[system])
              .join(' · ')}
          </span>
        ) : null}
        {!conversation.repeatable ? <span>Unique</span> : <span>Réversible</span>}
      </footer>
    </article>
  )
}

export function countUnlockedBondConversations(
  companionId: string,
  currentAffinity: number,
): number {
  return getBondConversationsForCompanion(companionId).filter((entry) =>
    isBondConversationUnlocked(entry, currentAffinity),
  ).length
}
