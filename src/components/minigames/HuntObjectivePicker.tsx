import {
  MAX_SEARCH_OBJECTIVES,
  OBJECTIVE_TEMPLATES,
  type HuntSearchObjective,
} from '../../data/myrionMvp2'
import './Minigames.css'

type HuntObjectivePickerProps = {
  selected: HuntSearchObjective[]
  onChange: (objectives: HuntSearchObjective[]) => void
  shinyDiscovered?: boolean
}

export function HuntObjectivePicker({
  selected,
  onChange,
  shinyDiscovered = false,
}: HuntObjectivePickerProps) {
  const selectedIds = new Set(selected.map((objective) => objective.id))
  const templates = OBJECTIVE_TEMPLATES.filter(
    (template) => template.type !== 'shiny' || shinyDiscovered,
  )

  const toggle = (template: HuntSearchObjective) => {
    if (selectedIds.has(template.id)) {
      onChange(selected.filter((objective) => objective.id !== template.id))
      return
    }
    if (selected.length >= MAX_SEARCH_OBJECTIVES) return
    onChange([...selected, template])
  }

  return (
    <section className="mg-hunt-objectives">
      <header className="mg-hunt-objectives-head">
        <div>
          <p className="eyebrow">Pistage</p>
          <h4>Objectifs de chasse</h4>
        </div>
        <span className="mg-hunt-objectives-count">
          {selected.length}/{MAX_SEARCH_OBJECTIVES}
        </span>
      </header>
      <p className="mg-hunt-objectives-copy">
        Optionnel — jusqu à 3 objectifs pour repérer automatiquement les captures intéressantes.
      </p>
      <div className="mg-hunt-objectives-grid">
        {templates.map((template) => {
          const active = selectedIds.has(template.id)
          const disabled = !active && selected.length >= MAX_SEARCH_OBJECTIVES
          return (
            <button
              aria-pressed={active}
              className={`mg-hunt-objective-chip ${active ? 'active' : ''}`}
              disabled={disabled}
              key={template.id}
              type="button"
              onClick={() => toggle(template)}
            >
              {template.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
