import { useState } from 'react'
import {
  listProfilesForSystem,
  pickCompanionSupportForSystem,
  type CompanionSupportSystemId,
} from '../data/companionSupport'
import { SYSTEM_CONTEXT_HINTS, SYSTEM_HINT_BADGE } from '../data/systemHints'
import { useIsMobileLayout } from '../hooks/useMediaQuery'
import './onboardingHints.css'

type SystemContextHintProps = {
  systemId: CompanionSupportSystemId
  preferCompanionId?: string
  preferAffinity?: number
  variant?: 'inline' | 'overlay'
  defaultCollapsed?: boolean
}

export function SystemContextHint({
  systemId,
  preferCompanionId,
  preferAffinity,
  variant = 'inline',
  defaultCollapsed,
}: SystemContextHintProps) {
  const isMobile = useIsMobileLayout()
  const hint = SYSTEM_CONTEXT_HINTS[systemId]
  const linkedCompanions = listProfilesForSystem(systemId).slice(0, 3)
  const pick = pickCompanionSupportForSystem(systemId, {
    preferCompanionId,
    preferAffinity,
  })
  const [collapsed, setCollapsed] = useState(
    defaultCollapsed ?? (variant === 'inline' && isMobile),
  )

  if (!hint) return null

  const rootClass = [
    'onboarding-hint',
    variant === 'overlay' ? 'onboarding-hint--overlay' : 'onboarding-hint--inline',
    collapsed ? 'onboarding-hint--collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside aria-label={`Conseil ${hint.shortLabel}`} className={rootClass}>
      <button
        aria-expanded={!collapsed}
        className="onboarding-hint-toggle"
        type="button"
        onClick={() => setCollapsed((value) => !value)}
      >
        <span className="onboarding-hint-badge">{SYSTEM_HINT_BADGE}</span>
        <span className="onboarding-hint-kicker">{hint.shortLabel}</span>
        <span aria-hidden="true" className="onboarding-hint-chevron">
          {collapsed ? '▸' : '▾'}
        </span>
      </button>

      {!collapsed ? (
        <div className="onboarding-hint-body">
          <p className="onboarding-hint-phrase">{hint.phrase}</p>
          {linkedCompanions.length > 0 ? (
            <p className="onboarding-hint-companions">
              <span className="onboarding-hint-companions-label">Liés :</span>
              {linkedCompanions.map((profile) => (
                <span className="onboarding-hint-companion-chip" key={profile.companionId}>
                  {profile.displayName}
                </span>
              ))}
            </p>
          ) : null}
          {pick && variant === 'overlay' ? (
            <p className="onboarding-hint-voice">
              <strong>{pick.profile.displayName}</strong> — {pick.profile.supportLine}
            </p>
          ) : null}
        </div>
      ) : (
        <p className="onboarding-hint-phrase onboarding-hint-phrase--teaser">{hint.phrase}</p>
      )}
    </aside>
  )
}
