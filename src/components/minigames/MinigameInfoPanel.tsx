import type { BuildingActivity } from '../../data/buildingActivities'

type MinigameInfoPanelProps = {
  activity: BuildingActivity
  buildingName: string
  companionName: string
  resourceLabel: string
  score: number
  maxScore?: number
  scoreLabel?: string
  endless?: boolean
  extraLines?: Array<{ label: string; value: string }>
}

export function MinigameInfoPanel({
  activity,
  buildingName,
  companionName,
  resourceLabel,
  score,
  maxScore = 100,
  scoreLabel = 'Score',
  endless = false,
  extraLines = [],
}: MinigameInfoPanelProps) {
  const scoreText = endless ? String(score) : `${score}/${maxScore}`

  return (
    <div className="mg-side-menu-panel mg-side-menu-panel--info">
      <p className="mg-side-menu-panel-kicker">{activity.tagline}</p>
      <h3 className="mg-side-menu-panel-title">
        {activity.icon} {activity.name}
      </h3>
      <p className="mg-side-menu-panel-desc">{activity.description}</p>
      <dl className="mg-side-menu-info-list">
        <div>
          <dt>{scoreLabel}</dt>
          <dd>{scoreText}</dd>
        </div>
        <div>
          <dt>Compagnon</dt>
          <dd>{companionName}</dd>
        </div>
        <div>
          <dt>Bâtiment</dt>
          <dd>{buildingName}</dd>
        </div>
        <div>
          <dt>Ressource</dt>
          <dd>{resourceLabel}</dd>
        </div>
        {extraLines.map((line) => (
          <div key={line.label}>
            <dt>{line.label}</dt>
            <dd>{line.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mg-side-menu-panel-note">Inspiré de {activity.inspiration}</p>
    </div>
  )
}
