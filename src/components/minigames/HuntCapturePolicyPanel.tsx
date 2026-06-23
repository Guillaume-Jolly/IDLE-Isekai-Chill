import {
  HUNT_CAPTURE_POLICY_OPTIONS,
  normalizeHuntAutoDecision,
  type HuntAutoDecisionMode,
  type HuntAutoDecisionSettings,
} from '../../data/myrionMvp2'
import './Minigames.css'

type HuntCapturePolicyPanelProps = {
  settings: HuntAutoDecisionSettings
  pendingCount?: number
  onChange: (settings: HuntAutoDecisionSettings) => void
  title?: string
  showPendingHint?: boolean
}

export function HuntCapturePolicyPanel({
  settings,
  pendingCount = 0,
  onChange,
  title = 'Politique de capture',
  showPendingHint = false,
}: HuntCapturePolicyPanelProps) {
  const { mode } = normalizeHuntAutoDecision(settings)

  const selectMode = (nextMode: HuntAutoDecisionMode) => {
    if (nextMode === mode) return
    onChange({ mode: nextMode })
  }

  return (
    <section className="mg-hunt-auto-settings">
      <header className="mg-hunt-auto-settings-head">
        <p className="eyebrow">Automatisation</p>
        <h4>{title}</h4>
      </header>
      <p className="mg-hunt-auto-settings-copy">
        S&apos;applique aux prochaines captures réussies. Le 11e exemplaire et les spécimens protégés
        peuvent encore demander une confirmation manuelle.
      </p>
      <div className="mg-hunt-auto-options" role="radiogroup" aria-label={title}>
        {HUNT_CAPTURE_POLICY_OPTIONS.map((option) => (
          <button
            aria-checked={mode === option.mode}
            className={`mg-hunt-auto-option-btn${mode === option.mode ? ' active' : ''}`}
            key={option.mode}
            role="radio"
            type="button"
            onClick={() => selectMode(option.mode)}
          >
            <strong>{option.label}</strong>
            <small>{option.description}</small>
          </button>
        ))}
      </div>
      {showPendingHint && pendingCount > 0 ? (
        <p className="mg-hunt-auto-hint">
          {pendingCount} capture{pendingCount > 1 ? 's' : ''} en attente — consulte l&apos;onglet
          En attente.
        </p>
      ) : null}
    </section>
  )
}

/** @deprecated Alias — préférer HuntCapturePolicyPanel */
export const HuntAutoDecisionSettingsPanel = HuntCapturePolicyPanel
