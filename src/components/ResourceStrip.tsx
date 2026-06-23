import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  RESOURCE_KEYS,
  RESOURCE_LABELS,
  RESOURCE_ROLES,
  type ResourceKey,
} from '../data/resources'
import { tooltipAnchorFromElement } from '../utils/tooltipPosition'
import { ResourceIcon } from './ResourceIcon'

type ResourceStripProps = {
  resources: Record<ResourceKey, number>
  perMinute: Record<ResourceKey, number>
  layout?: 'horizontal' | 'vertical'
  compact?: boolean
}

type TipState = {
  key: ResourceKey
  x: number
  y: number
}

const formatAmount = (amount: number) => Math.floor(amount).toLocaleString('fr-FR')

const compactAmount = (amount: number) => {
  const value = Math.floor(amount)
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}k`
  return formatAmount(value)
}

const COMPACT_KEYS: ResourceKey[] = ['coins', 'tickets', 'mana']

export function ResourceStrip({
  resources,
  perMinute,
  layout = 'horizontal',
  compact = false,
}: ResourceStripProps) {
  const [tip, setTip] = useState<TipState | null>(null)

  const showTip = useCallback((key: ResourceKey, anchor: HTMLElement) => {
    const { x, y } = tooltipAnchorFromElement(anchor, 8)
    setTip({ key, x, y })
  }, [])

  const hideTip = useCallback(() => setTip(null), [])

  useEffect(() => {
    if (!tip) {
      return
    }
    const reposition = () => hideTip()
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [hideTip, tip])

  const activeKey = tip?.key
  const production = activeKey ? perMinute[activeKey] : 0
  const productionLabel =
    production > 0 ? `+${formatAmount(production)} / min` : 'Pas de production passive'

  const keys = compact ? COMPACT_KEYS : RESOURCE_KEYS

  return (
    <section
      aria-label="Ressources"
      className={`resource-strip resource-strip--${layout}${compact ? ' resource-strip--compact' : ''}`}
    >
      <div className="resource-strip-scroll">
        {keys.map((key) => (
          <div className="resource-chip" key={key}>
            <button
              aria-describedby={activeKey === key ? `resource-tip-${key}` : undefined}
              className="resource-chip-button"
              type="button"
              onBlur={hideTip}
              onFocus={(event) => showTip(key, event.currentTarget)}
              onMouseEnter={(event) => showTip(key, event.currentTarget)}
              onMouseLeave={hideTip}
            >
              <ResourceIcon resource={key} />
              <span className="resource-chip-amount">{compactAmount(resources[key])}</span>
            </button>
          </div>
        ))}
      </div>

      {tip &&
        createPortal(
          <div
            className="resource-chip-tooltip resource-chip-tooltip--fixed"
            id={`resource-tip-${tip.key}`}
            role="tooltip"
            style={{ left: tip.x, top: tip.y }}
          >
            <strong>{RESOURCE_LABELS[tip.key]}</strong>
            <span className="resource-chip-stock">{formatAmount(resources[tip.key])} en stock</span>
            <span className="resource-chip-rate">{productionLabel}</span>
            <p>{RESOURCE_ROLES[tip.key]}</p>
          </div>,
          document.body,
        )}
    </section>
  )
}
