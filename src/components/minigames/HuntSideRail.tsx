import { type ReactNode, useId } from 'react'
import './Minigames.css'

export type HuntDrawerId = 'decision' | 'objectives' | 'recent' | 'favors' | 'debug'

export type HuntDrawerConfig = {
  id: HuntDrawerId
  label: string
  icon: string
  badge?: number | string
  content: ReactNode
  pinned?: boolean
}

type HuntSideRailProps = {
  drawers: HuntDrawerConfig[]
  openId: HuntDrawerId | null
  onOpenChange: (id: HuntDrawerId | null) => void
  canClose?: (id: HuntDrawerId) => boolean
}

export function HuntSideRail({ drawers, openId, onOpenChange, canClose }: HuntSideRailProps) {
  const groupId = useId()
  const active = drawers.find((drawer) => drawer.id === openId)

  const toggle = (id: HuntDrawerId) => {
    if (openId === id) {
      if (canClose && !canClose(id)) return
      onOpenChange(null)
      return
    }
    onOpenChange(id)
  }

  return (
    <aside aria-label="Outils de chasse" className="mg-hunt-rail">
      <div className="mg-hunt-rail-tabs" role="tablist">
        {drawers.map((drawer) => {
          const selected = openId === drawer.id
          const locked = selected && canClose && !canClose(drawer.id)
          return (
            <button
              aria-controls={`${groupId}-${drawer.id}`}
              aria-expanded={selected}
              aria-selected={selected}
              className={`mg-hunt-rail-tab ${selected ? 'active' : ''} ${drawer.pinned ? 'pinned' : ''}`}
              key={drawer.id}
              role="tab"
              title={drawer.label}
              type="button"
              onClick={() => toggle(drawer.id)}
            >
              <span aria-hidden>{drawer.icon}</span>
              <span className="mg-hunt-rail-tab-label">{drawer.label}</span>
              {drawer.badge !== undefined && drawer.badge !== 0 ? (
                <span className="mg-hunt-rail-badge">{drawer.badge}</span>
              ) : null}
              {locked ? <span className="mg-hunt-rail-lock" title="Décision requise">!</span> : null}
            </button>
          )
        })}
      </div>

      {active ? (
        <section
          aria-labelledby={`${groupId}-${active.id}-title`}
          className="mg-hunt-rail-panel"
          id={`${groupId}-${active.id}`}
          role="tabpanel"
        >
          <header className="mg-hunt-rail-panel-head">
            <h3 id={`${groupId}-${active.id}-title`}>
              {active.icon} {active.label}
            </h3>
            <button
              aria-label={`Fermer ${active.label}`}
              className="secondary mg-hunt-rail-close"
              disabled={canClose ? !canClose(active.id) : false}
              type="button"
              onClick={() => onOpenChange(null)}
            >
              ×
            </button>
          </header>
          <div className="mg-hunt-rail-panel-body">{active.content}</div>
        </section>
      ) : null}
    </aside>
  )
}
