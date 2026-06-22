import {
  DEFAULT_HUNT_AUTO_DECISION,
  type HuntAutoDecisionSettings,
  type HuntSearchObjective,
} from '../../data/myrionMvp2'
import './Minigames.css'

type HuntAutoDecisionSettingsProps = {
  settings: HuntAutoDecisionSettings
  objectives: HuntSearchObjective[]
  onChange: (settings: HuntAutoDecisionSettings) => void
}

export function HuntAutoDecisionSettingsPanel({
  settings,
  objectives,
  onChange,
}: HuntAutoDecisionSettingsProps) {
  const merged = { ...DEFAULT_HUNT_AUTO_DECISION, ...settings }

  const toggleAutoKeep = () => {
    onChange({ ...merged, autoKeepIfRoom: !merged.autoKeepIfRoom })
  }

  const toggleAutoRelease = () => {
    const next = !merged.autoReleaseIfObjectivesMiss
    if (next && objectives.length === 0) {
      const confirmed = window.confirm(
        'Sans objectif de pistage défini, cette option relâchera automatiquement chaque Myrion capturé (sauf shiny, variante, trait rare ou record).\n\nConfirmer l’activation ?',
      )
      if (!confirmed) return
      onChange({
        ...merged,
        autoReleaseIfObjectivesMiss: true,
        autoReleaseWithoutObjectivesConfirmed: true,
      })
      return
    }
    onChange({
      ...merged,
      autoReleaseIfObjectivesMiss: next,
      autoReleaseWithoutObjectivesConfirmed: next
        ? merged.autoReleaseWithoutObjectivesConfirmed
        : false,
    })
  }

  return (
    <section className="mg-hunt-auto-settings">
      <header className="mg-hunt-auto-settings-head">
        <p className="eyebrow">Automatisation</p>
        <h4>Décision de capture</h4>
      </header>
      <p className="mg-hunt-auto-settings-copy">
        S’applique après chaque capture réussie. Le 11e exemplaire et les spécimens protégés demandent
        toujours une confirmation manuelle.
      </p>
      <label className="mg-hunt-auto-option">
        <input
          checked={merged.autoKeepIfRoom ?? false}
          type="checkbox"
          onChange={toggleAutoKeep}
        />
        <span>
          <strong>Garder automatiquement</strong> si place disponible (&lt; 10 exemplaires)
        </span>
      </label>
      <label className="mg-hunt-auto-option">
        <input
          checked={merged.autoReleaseIfObjectivesMiss ?? false}
          type="checkbox"
          onChange={toggleAutoRelease}
        />
        <span>
          <strong>Relâcher automatiquement</strong> si les objectifs de pistage ne sont pas atteints
        </span>
      </label>
      {merged.autoReleaseIfObjectivesMiss && objectives.length === 0 ? (
        <p className="mg-hunt-auto-warn">
          Aucun objectif actif — tous les Myrions capturés seront relâchés (sauf protégés).
        </p>
      ) : null}
      {merged.autoReleaseIfObjectivesMiss && objectives.length > 0 ? (
        <p className="mg-hunt-auto-hint">
          Relâche si aucun objectif n’est marqué « atteint » (partiel = non atteint).
        </p>
      ) : null}
    </section>
  )
}
