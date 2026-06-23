import { useCallback, useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  buildInventorySnapshot,
  formatInventoryAmount,
  inventoryGlyphChar,
  usesInventoryGlyph,
} from '../data/inventoryView'
import type { InventoryItem, InventorySection } from '../data/inventoryView'
import type { MinigameSave } from '../data/minigameSave'
import { RESOURCE_ICONS, type ResourceKey } from '../data/resources'
import type { StatKey } from '../data/companionStats'
import './InventoryPanel.css'

type InventoryPanelProps = {
  resources: Record<ResourceKey, number>
  companionFragments: Record<string, number>
  statTokens: Record<StatKey, number>
  buildings: Record<string, number>
  minigameSave: MinigameSave
  companions: Record<string, { unspentStatPoints: number }>
  eventPulls: number
  questsClaimed: number
}

const GLYPH_RESOURCE_ICONS = new Set<ResourceKey>(['coins', 'wood', 'stone'])

export function InventoryPanel(props: InventoryPanelProps) {
  const snapshot = useMemo(() => buildInventorySnapshot(props), [props])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    village: true,
    craft: true,
    arcane: true,
    festival: true,
    fragments: true,
    'stat-tokens': true,
    'workshop-tools': true,
    farm: true,
    pets: true,
    capture: true,
    misc: true,
    'companion-stat-points': true,
  })

  const toggleSection = (sectionId: string) => {
    setExpanded((current) => ({ ...current, [sectionId]: !current[sectionId] }))
  }

  const nonZeroResources = snapshot.sections
    .slice(0, 4)
    .flatMap((section) => section.items)
    .filter((item) => item.amount > 0).length

  return (
    <div className="inventory-panel">
      <section className="inventory-summary inventory-summary-compact">
        <article className="inventory-summary-chip">
          <span>📦</span>
          <strong>{nonZeroResources}</strong>
          <small>ressources</small>
        </article>
        <article className="inventory-summary-chip">
          <span>💞</span>
          <strong>{formatInventoryAmount(snapshot.totalFragments)}</strong>
          <small>fragments</small>
        </article>
        <article className="inventory-summary-chip">
          <span>✨</span>
          <strong>{snapshot.totalStatTokens}</strong>
          <small>jetons</small>
        </article>
        <article className="inventory-summary-chip">
          <span>🐾</span>
          <strong>{snapshot.petCount}</strong>
          <small>familiers</small>
        </article>
      </section>

      {snapshot.sections.map((section) => (
        <InventorySectionBlock
          expanded={expanded[section.id] ?? true}
          key={section.id}
          section={section}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  )
}

function InventorySectionBlock({
  section,
  expanded,
  onToggle,
}: {
  section: InventorySection
  expanded: boolean
  onToggle: () => void
}) {
  const filteredGroups = section.groups
    ?.map((group) => ({
      ...group,
      items: group.items.filter((item) => section.showZeroAmount || item.amount > 0),
    }))
    .filter((group) => group.items.length > 0)
  const visibleItems = section.showZeroAmount
    ? section.items
    : section.items.filter((item) => item.amount > 0)
  const showEmpty = filteredGroups?.length
    ? filteredGroups.length === 0
    : visibleItems.length === 0

  return (
    <section className="inventory-section">
      <button className="inventory-section-toggle" type="button" onClick={onToggle}>
        <div className="inventory-section-head">
          <h3>{section.title}</h3>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="inventory-section-body">
          {showEmpty ? (
            <p className="inventory-empty">{section.emptyLabel ?? 'Rien pour le moment.'}</p>
          ) : filteredGroups?.length ? (
            <div className="inventory-section-groups">
              {filteredGroups.map((group) => (
                <div className="inventory-item-group" key={group.id}>
                  <div className="inventory-item-group-head">
                    <h4>{group.title}</h4>
                    {group.description ? <p>{group.description}</p> : null}
                  </div>
                  <div className="inventory-compact-grid inventory-compact-grid--dense">
                    {group.items.map((item) => (
                      <InventoryChip dimmed={item.amount <= 0} item={item} key={item.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="inventory-compact-grid">
              {visibleItems.map((item) => (
                <InventoryChip dimmed={item.amount <= 0} item={item} key={item.id} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

type TipState = {
  x: number
  y: number
}

function tooltipAnchorFromElement(element: HTMLElement, gap = 8): TipState {
  const rect = element.getBoundingClientRect()
  const margin = 12
  const halfWidth = 170
  const shell = document.querySelector('.shell')
  const sidebarWidth = shell
    ? Number.parseFloat(getComputedStyle(shell).getPropertyValue('--sidebar-width')) || 168
    : 168
  const minCenter = sidebarWidth + margin + halfWidth
  const maxCenter = window.innerWidth - margin - halfWidth
  const centerX = Math.min(maxCenter, Math.max(minCenter, rect.left + rect.width / 2))
  return { x: centerX, y: rect.bottom + gap }
}

function ResourceIcon({ resource, className = '' }: { resource: ResourceKey; className?: string }) {
  if (GLYPH_RESOURCE_ICONS.has(resource)) {
    return (
      <span
        aria-hidden
        className={`resource-glyph resource-glyph--${resource} ${className}`.trim()}
      />
    )
  }

  return (
    <span aria-hidden className={`resource-chip-icon ${className}`.trim()}>
      {RESOURCE_ICONS[resource]}
    </span>
  )
}

function ChipVisual({ item }: { item: InventoryItem }) {
  const [imageTier, setImageTier] = useState<'primary' | 'fallback' | 'failed'>('primary')

  const activeSrc =
    !item.chibiOnly && imageTier === 'fallback' && item.imageFallbackSrc
      ? item.imageFallbackSrc
      : item.imageSrc

  if (activeSrc && imageTier !== 'failed') {
    return (
      <img
        alt=""
        className={`inventory-chip-image${item.chibiOnly ? ' inventory-chip-image--chibi' : ''}`}
        draggable={false}
        src={activeSrc}
        onError={() => {
          if (!item.chibiOnly && imageTier === 'primary' && item.imageFallbackSrc) {
            setImageTier('fallback')
            return
          }
          setImageTier('failed')
        }}
      />
    )
  }

  if (item.resourceKey) {
    return <ResourceIcon className="inventory-chip-resource" resource={item.resourceKey} />
  }

  if (item.iconKey && usesInventoryGlyph(item.iconKey)) {
    const glyph = inventoryGlyphChar(item.iconKey) ?? item.icon ?? item.label.slice(0, 1)
    return (
      <span
        aria-hidden
        className={`inventory-chip-glyph inventory-chip-glyph--${item.iconKey}`}
      >
        {glyph}
      </span>
    )
  }

  if (item.icon) {
    return <span className="inventory-chip-emoji">{item.icon}</span>
  }

  return <span className="inventory-chip-fallback">{item.label.slice(0, 1)}</span>
}

function InventoryChip({ item, dimmed = false }: { item: InventoryItem; dimmed?: boolean }) {
  const [tip, setTip] = useState<TipState | null>(null)
  const tooltipId = `inv-tip-${item.id}`

  const showTip = useCallback((anchor: HTMLElement) => {
    setTip(tooltipAnchorFromElement(anchor))
  }, [])

  const hideTip = useCallback(() => setTip(null), [])

  useEffect(() => {
    if (!tip) return

    const dismiss = () => hideTip()
    window.addEventListener('scroll', dismiss, true)
    window.addEventListener('resize', dismiss)
    return () => {
      window.removeEventListener('scroll', dismiss, true)
      window.removeEventListener('resize', dismiss)
    }
  }, [hideTip, tip])

  return (
    <>
      <div
        className={`inventory-chip ${item.badgeOverlay ? 'badge-overlay' : 'inline-qty'}${dimmed ? ' inventory-chip--zero' : ''}${item.showLabel ? ' inventory-chip--labeled' : ''}${item.chipSize === 'compact' ? ' inventory-chip--compact' : ''}`}
      >
        <button
          aria-describedby={tip ? tooltipId : undefined}
          aria-label={`${item.label} : ${formatInventoryAmount(item.amount)}`}
          className="inventory-chip-button"
          type="button"
          onBlur={hideTip}
          onFocus={(event) => showTip(event.currentTarget)}
          onMouseEnter={(event) => showTip(event.currentTarget)}
          onMouseLeave={hideTip}
        >
          <span className="inventory-chip-visual">
            <ChipVisual item={item} />
            {item.badgeOverlay ? (
              <span className="inventory-chip-badge">{formatInventoryAmount(item.amount)}</span>
            ) : null}
          </span>
          {item.badgeOverlay ? (
            item.showLabel ? <span className="inventory-chip-label">{item.label}</span> : null
          ) : (
            <>
              {item.showLabel ? <span className="inventory-chip-label">{item.label}</span> : null}
              <span className="inventory-chip-qty">{formatInventoryAmount(item.amount)}</span>
            </>
          )}
        </button>
      </div>

      {tip &&
        createPortal(
          <div
            className="inventory-chip-tooltip inventory-chip-tooltip--fixed"
            id={tooltipId}
            role="tooltip"
            style={{ left: tip.x, top: tip.y }}
          >
            <strong>{item.label}</strong>
            <span>{formatInventoryAmount(item.amount)} en stock</span>
            {item.meta ? <span className="inventory-chip-tooltip-meta">{item.meta}</span> : null}
            {item.hint ? <p>{item.hint}</p> : null}
          </div>,
          document.body,
        )}
    </>
  )
}
