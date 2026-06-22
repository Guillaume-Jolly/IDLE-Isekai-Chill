import type { Cost } from '../data/resources'
import {
  generateQuestBoard,
  isQuestComplete,
  type InfiniteQuest,
  type QuestSave,
} from '../data/infiniteQuests'
import { RESOURCE_LABELS, type ResourceKey } from '../data/resources'

type QuestBoardProps = {
  quests: QuestSave
  buildingIds: string[]
  companionIds: string[]
  onClaim: (questId: string, reward: Cost) => void
  onRefresh: (board: InfiniteQuest[]) => void
  onLaunchConversation: () => void
  onLaunchMinigames: () => void
}

const costText = (reward: Cost) =>
  Object.entries(reward)
    .filter((entry): entry is [ResourceKey, number] => (entry[1] ?? 0) > 0)
    .map(([key, value]) => `${Math.floor(value)} ${RESOURCE_LABELS[key]}`)
    .join(' · ')

export function QuestBoard({
  quests,
  buildingIds,
  companionIds,
  onClaim,
  onRefresh,
  onLaunchConversation,
  onLaunchMinigames,
}: QuestBoardProps) {
  const refreshBoard = () => {
    onRefresh(generateQuestBoard(buildingIds, companionIds, 6))
  }

  return (
    <section className="quest-board">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Objectifs chill</p>
          <h2>Mini-quetes infinies</h2>
        </div>
        <p>
          Petites missions renouvelables quand tu manques d idees. Recompenses modestes,
          toujours utiles. Completees : {quests.totalClaimed}.
        </p>
      </header>

      <div className="quest-board-actions">
        <button type="button" className="secondary" onClick={refreshBoard}>
          Nouvelles quetes
        </button>
        <button type="button" className="secondary" onClick={onLaunchMinigames}>
          Mini-jeux
        </button>
        <button type="button" className="secondary" onClick={onLaunchConversation}>
          Conversation intime
        </button>
      </div>

      <div className="quest-grid">
        {quests.board.length === 0 ? (
          <article className="panel quest-card">
            <p>Aucune quete active.</p>
            <button type="button" className="primary" onClick={refreshBoard}>
              Generer un tableau
            </button>
          </article>
        ) : (
          quests.board.map((quest) => {
            const done = isQuestComplete(quest)
            return (
              <article className={`panel quest-card ${done ? 'ready' : ''}`} key={quest.id}>
                <div className="card-topline">
                  <span>{quest.kind.replace('-', ' ')}</span>
                  <span>
                    {quest.progress}/{quest.goal}
                  </span>
                </div>
                <h3>{quest.title}</h3>
                <p>{quest.description}</p>
                <small>Recompense : {costText(quest.reward)}</small>
                <button
                  type="button"
                  className={done ? 'primary' : 'secondary'}
                  disabled={!done}
                  onClick={() => onClaim(quest.id, quest.reward)}
                >
                  {done ? 'Recolter' : 'En cours…'}
                </button>
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
