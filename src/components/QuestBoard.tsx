import type { Cost } from '../data/resources'
import {
  DAILY_QUESTS_PER_DAY,
  formatDailyBundleLabel,
  INFINITE_BOARD_SIZE,
  isQuestComplete,
  MAX_DAILY_DAY_STACK,
  type InfiniteQuest,
  type QuestSave,
} from '../data/infiniteQuests'
import {
  getQuestNavigationTarget,
  isQuestNavigationActionable,
  type QuestNavigateTarget,
} from '../data/questNavigation'
import { RESOURCE_LABELS, type ResourceKey } from '../data/resources'

type QuestBoardProps = {
  quests: QuestSave
  onClaim: (questId: string) => void
  onNavigate: (target: QuestNavigateTarget) => void
}

const costText = (reward: Cost) =>
  Object.entries(reward)
    .filter((entry): entry is [ResourceKey, number] => (entry[1] ?? 0) > 0)
    .map(([key, value]) => `${Math.floor(value)} ${RESOURCE_LABELS[key]}`)
    .join(' · ')

function QuestCard({
  quest,
  onClaim,
  onNavigate,
}: {
  quest: InfiniteQuest
  onClaim: (questId: string) => void
  onNavigate: (target: QuestNavigateTarget) => void
}) {
  const done = isQuestComplete(quest)
  const navTarget = getQuestNavigationTarget(quest)
  const canNavigate = isQuestNavigationActionable(navTarget)

  return (
    <article className={`panel quest-card ${done ? 'ready' : ''}`}>
      <div className="card-topline">
        <span>{quest.kind.replace(/-/g, ' ')}</span>
        <span>
          {quest.progress}/{quest.goal}
        </span>
      </div>
      <h3>{quest.title}</h3>
      <p>{quest.description}</p>
      <small>Recompense : {costText(quest.reward)}</small>
      <div className="quest-card-actions">
        <button
          type="button"
          className="secondary"
          disabled={!canNavigate}
          onClick={() => onNavigate(navTarget)}
        >
          Aller
        </button>
        <button
          type="button"
          className={done ? 'primary' : 'secondary'}
          disabled={!done}
          onClick={() => onClaim(quest.id)}
        >
          {done ? 'Recolter' : 'En cours…'}
        </button>
      </div>
    </article>
  )
}

export function QuestBoard({ quests, onClaim, onNavigate }: QuestBoardProps) {
  const dailyCount = quests.daily.reduce((sum, bundle) => sum + bundle.quests.length, 0)
  const sortedDaily = [...quests.daily].sort((a, b) => b.dayKey.localeCompare(a.dayKey))

  return (
    <section className="quest-board">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Objectifs chill</p>
          <h2>Quetes</h2>
        </div>
        <p>
          {DAILY_QUESTS_PER_DAY} quetes par jour (jusqu&apos;a {MAX_DAILY_DAY_STACK} jours en reserve) et{' '}
          {INFINITE_BOARD_SIZE} quetes infinies qui se renouvellent. Completees : {quests.totalClaimed}.
        </p>
      </header>

      <section className="quest-daily-section">
        <header className="quest-section-heading">
          <h3>Quetes du jour</h3>
          <span>{dailyCount} active{dailyCount > 1 ? 's' : ''}</span>
        </header>
        {sortedDaily.length === 0 ? (
          <article className="panel quest-card">
            <p>Aucune quete journaliere pour le moment.</p>
          </article>
        ) : (
          sortedDaily.map((bundle) => (
            <div className="quest-daily-bundle" key={bundle.dayKey}>
              <h4>{formatDailyBundleLabel(bundle.dayKey)}</h4>
              <div className="quest-grid">
                {bundle.quests.map((quest) => (
                  <QuestCard key={quest.id} quest={quest} onClaim={onClaim} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="quest-infinite-section">
        <header className="quest-section-heading">
          <h3>Quetes infinies</h3>
          <span>{quests.infinite.length} active{quests.infinite.length > 1 ? 's' : ''}</span>
        </header>
        <div className="quest-grid">
          {quests.infinite.length === 0 ? (
            <article className="panel quest-card">
              <p>Chargement des quetes infinies…</p>
            </article>
          ) : (
            quests.infinite.map((quest) => (
              <QuestCard key={quest.id} quest={quest} onClaim={onClaim} onNavigate={onNavigate} />
            ))
          )}
        </div>
      </section>
    </section>
  )
}
