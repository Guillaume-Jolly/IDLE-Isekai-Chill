import type { ReactNode } from 'react'

export type ViewKey =
  | 'village'
  | 'buildings'
  | 'quests'
  | 'miniGames'
  | 'event'
  | 'inventory'
  | 'companions'
  | 'gallery'

type NavTab = {
  key: ViewKey
  label: string
  icon: string
}

type AppNavProps = {
  activeView: ViewKey
  tabs: NavTab[]
  villageStageName: string
  population: number
  expanded: boolean
  drawer?: boolean
  resourcesPanel?: ReactNode
  onToggleExpanded: () => void
  onSelect: (view: ViewKey) => void
}

export function AppNav({
  activeView,
  tabs,
  villageStageName,
  population,
  expanded,
  drawer = false,
  resourcesPanel,
  onToggleExpanded,
  onSelect,
}: AppNavProps) {
  const handleSelect = (view: ViewKey) => {
    onSelect(view)
  }

  return (
    <nav
      aria-expanded={expanded}
      aria-label="Navigation principale"
      className={`app-sidebar${expanded ? ' app-sidebar--expanded' : ' app-sidebar--collapsed'}${drawer ? ' app-sidebar--drawer' : ''}`}
    >
      <div className="app-sidebar-head">
        <div className="app-sidebar-brand">
          <span aria-hidden="true" className="app-sidebar-brand-icon">
            🌙
          </span>
          <div className="app-sidebar-brand-copy">
            <strong>Havre</strong>
            <span>des Brumes</span>
          </div>
        </div>
        <button
          aria-controls="app-sidebar-body"
          aria-expanded={expanded}
          aria-label={drawer || expanded ? 'Fermer le menu' : 'Ouvrir le menu'}
          className="app-sidebar-toggle"
          type="button"
          onClick={onToggleExpanded}
        >
          <span aria-hidden="true">{drawer || expanded ? '×' : '☰'}</span>
        </button>
      </div>

      <div className="app-sidebar-body" id="app-sidebar-body">
        <div className="app-sidebar-tabs">
          {tabs.map((tab) => (
            <button
              aria-current={activeView === tab.key ? 'page' : undefined}
              aria-label={tab.label}
              className={activeView === tab.key ? 'active' : ''}
              key={tab.key}
              title={tab.label}
              type="button"
              onClick={() => handleSelect(tab.key)}
            >
              <span aria-hidden="true" className="app-sidebar-tab-icon">
                {tab.icon}
              </span>
              <span className="app-sidebar-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {expanded && resourcesPanel ? (
          <div aria-label="Ressources" className="app-sidebar-resources">
            <p className="app-sidebar-resources-title">Ressources</p>
            {resourcesPanel}
          </div>
        ) : null}

        <div className="app-sidebar-status">
          <span className="app-sidebar-status-stage">{villageStageName}</span>
          <strong>{Math.floor(population)} hab.</strong>
        </div>
      </div>
    </nav>
  )
}
