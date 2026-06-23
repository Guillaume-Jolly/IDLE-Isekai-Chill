import {
  TUTORIAL_OBJECTIVES,
  type TutorialObjectiveId,
  type TutorialObjectiveSave,
  getTutorialObjective,
} from '../data/tutorialObjectives'
import { RESOURCE_LABELS, type Cost, type ResourceKey } from '../data/resources'

type TutorialObjectivesPanelProps = {
  tutorial: TutorialObjectiveSave
  onClaim: (id: TutorialObjectiveId, reward: Cost) => void
  onNavigate?: (target: 'buildings' | 'miniGames' | 'companions' | 'inventory') => void
}

const costText = (reward: Cost) =>
  Object.entries(reward)
    .filter((entry): entry is [ResourceKey, number] => (entry[1] ?? 0) > 0)
    .map(([key, value]) => `${Math.floor(value)} ${RESOURCE_LABELS[key]}`)
    .join(' · ')

export function TutorialObjectivesPanel({
  tutorial,
  onClaim,
  onNavigate,
}: TutorialObjectivesPanelProps) {
  const doneCount = tutorial.completedIds.length
  const claimedCount = tutorial.claimedIds.length

  return (
    <section className="tutorial-objectives">
      <header className="section-heading">
        <div>
          <p className="eyebrow">Parcours 0.10</p>
          <h2>Objectifs du havre</h2>
        </div>
        <p>
          Dix étapes pour découvrir la boucle Village → Chasse → Refuge → Compagnons.
          Complétées : {doneCount}/{TUTORIAL_OBJECTIVES.length} · Récompenses récupérées :{' '}
          {claimedCount}/{TUTORIAL_OBJECTIVES.length}.
        </p>
      </header>

      <div className="tutorial-objectives-actions">
        <button type="button" className="secondary" onClick={() => onNavigate?.('miniGames')}>
          Mini-jeux
        </button>
        <button type="button" className="secondary" onClick={() => onNavigate?.('companions')}>
          Compagnons
        </button>
        <button type="button" className="secondary" onClick={() => onNavigate?.('inventory')}>
          Inventaire
        </button>
      </div>

      <div className="quest-grid tutorial-objectives-grid">
        {TUTORIAL_OBJECTIVES.map((objective) => {
          const complete = tutorial.completedIds.includes(objective.id)
          const claimed = tutorial.claimedIds.includes(objective.id)
          const locked =
            objective.order > 1 &&
            !tutorial.completedIds.includes(TUTORIAL_OBJECTIVES[objective.order - 2]?.id ?? objective.id)

          return (
            <article
              className={`panel quest-card tutorial-objective-card ${complete ? 'ready' : ''} ${claimed ? 'claimed' : ''} ${locked ? 'locked' : ''}`}
              key={objective.id}
            >
              <div className="card-topline">
                <span>Étape {objective.order}</span>
                <span>{claimed ? 'Récolté' : complete ? 'Prêt' : locked ? 'Verrouillé' : 'En cours'}</span>
              </div>
              <h3>{objective.title}</h3>
              <p>{objective.description}</p>
              <small>Récompense unique : {costText(objective.reward)}</small>
              <button
                type="button"
                className={complete && !claimed ? 'primary' : 'secondary'}
                disabled={!complete || claimed}
                onClick={() => {
                  const def = getTutorialObjective(objective.id)
                  if (def) onClaim(objective.id, def.reward)
                }}
              >
                {claimed ? 'Récompense récupérée' : complete ? 'Récupérer' : locked ? 'Étape précédente requise' : 'En cours…'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
