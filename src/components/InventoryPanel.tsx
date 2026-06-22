import { useMemo, useState } from 'react'
import { buildInventorySnapshot, formatInventoryAmount } from '../data/inventoryView'
import type { InventorySection } from '../data/inventoryView'
import type { MinigameSave } from '../data/minigameSave'
import type { ResourceKey } from '../data/resources'
import type { StatKey } from '../data/companionStats'

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
      <section className="inventory-summary">
        <article className="inventory-summary-card">
          <span>Ressources possédées</span>
          <strong>{nonZeroResources}</strong>
          <small>types avec stock &gt; 0</small>
        </article>
        <article className="inventory-summary-card">
          <span>Fragments</span>
          <strong>{formatInventoryAmount(snapshot.totalFragments)}</strong>
          <small>tous compagnons</small>
        </article>
        <article className="inventory-summary-card">
          <span>Jetons gacha</span>
          <strong>{snapshot.totalStatTokens}</strong>
          <small>stats ciblées</small>
        </article>
        <article className="inventory-summary-card">
          <span>Familiers</span>
          <strong>{snapshot.petCount}</strong>
          <small>sanctuaire</small>
        </article>
      </section>

      <section className="inventory-fragment-grid">
        <header className="inventory-section-head">
          <div>
            <h3>Fragments par compagnon</h3>
            <p>10 fragments = +1 stat sur le compagnon (onglet Liens).</p>
          </div>
        </header>
        <div className="inventory-fragment-cards">
          {snapshot.companionRows.map((row) => (
            <article
              className={`inventory-fragment-card ${row.fragments > 0 ? 'has-stock' : ''}`}
              key={row.id}
            >
              <strong>{row.name}</strong>
              <span className="inventory-fragment-count">{row.fragments}</span>
              <div className="inventory-fragment-track">
                <div
                  className="inventory-fragment-fill"
                  style={{
                    width: `${(row.fragmentProgress / 10) * 100}%`,
                  }}
                />
              </div>
              <small>
                {row.fragmentBudget > 0
                  ? `${row.fragmentBudget} échange${row.fragmentBudget > 1 ? 's' : ''} prêt${row.fragmentBudget > 1 ? 's' : ''}`
                  : `${row.fragmentProgress}/10`}
                {row.unspentStatPoints > 0 && ` · ${row.unspentStatPoints} pt stat`}
              </small>
            </article>
          ))}
        </div>
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
  const visibleItems = section.items.filter((item) => item.amount > 0)
  const showEmpty = visibleItems.length === 0

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
          ) : (
            <div className="inventory-item-grid">
              {visibleItems.map((item) => (
                <article className="inventory-item" key={item.id} title={item.hint}>
                  {item.icon ? <span className="inventory-item-icon">{item.icon}</span> : null}
                  <div className="inventory-item-body">
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </div>
                  <div className="inventory-item-amount">
                    <span>{formatInventoryAmount(item.amount)}</span>
                    {item.meta ? <small>{item.meta}</small> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
