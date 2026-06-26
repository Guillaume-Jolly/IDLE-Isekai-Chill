import type { NextStepSuggestion, NextStepTarget } from '../data/nextStepGuidance'
import './onboardingHints.css'

type NextStepGuidanceProps = {
  suggestion: NextStepSuggestion
  onNavigate?: (target: NextStepTarget) => void
}

export function NextStepGuidance({ suggestion, onNavigate }: NextStepGuidanceProps) {
  const actionable =
    suggestion.target.kind === 'view' || suggestion.target.kind === 'activity'

  return (
    <section aria-label="Guidance légère" className="next-step-guidance">
      <p className="next-step-guidance-kicker">{suggestion.kicker}</p>
      <div className="next-step-guidance-main">
        <div>
          <p className="next-step-guidance-label">{suggestion.label}</p>
          <p className="next-step-guidance-detail">{suggestion.detail}</p>
        </div>
        {actionable && onNavigate ? (
          <button
            className="next-step-guidance-action"
            type="button"
            onClick={() => onNavigate(suggestion.target)}
          >
            Y aller
          </button>
        ) : null}
      </div>
    </section>
  )
}
