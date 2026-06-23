import './Minigames.css'

type MinigameSwitchPanelProps = {
  icon: string
  title: string
  description: string
  launchLabel?: string
  onLaunch: () => void
}

export function MinigameSwitchPanel({
  icon,
  title,
  description,
  launchLabel = 'Ouvrir',
  onLaunch,
}: MinigameSwitchPanelProps) {
  return (
    <section className="mg-minigame-switch">
      <header className="mg-minigame-switch-head">
        <span aria-hidden className="mg-minigame-switch-icon">
          {icon}
        </span>
        <h4>{title}</h4>
      </header>
      <p className="mg-minigame-switch-copy">{description}</p>
      <button className="primary mg-minigame-switch-btn" type="button" onClick={onLaunch}>
        {launchLabel}
      </button>
    </section>
  )
}
