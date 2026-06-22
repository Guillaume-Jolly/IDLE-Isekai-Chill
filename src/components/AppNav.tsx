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
  onSelect: (view: ViewKey) => void
}

export function AppNav({
  activeView,
  tabs,
  villageStageName,
  population,
  onSelect,
}: AppNavProps) {
  return (
    <nav aria-label="Navigation principale" className="app-sidebar">
      <div className="app-sidebar-brand">
        <span aria-hidden="true" className="app-sidebar-brand-icon">
          🌙
        </span>
        <div className="app-sidebar-brand-copy">
          <strong>Havre</strong>
          <span>des Brumes</span>
        </div>
      </div>

      <div className="app-sidebar-tabs">
        {tabs.map((tab) => (
          <button
            aria-current={activeView === tab.key ? 'page' : undefined}
            className={activeView === tab.key ? 'active' : ''}
            key={tab.key}
            title={tab.label}
            type="button"
            onClick={() => onSelect(tab.key)}
          >
            <span aria-hidden="true" className="app-sidebar-tab-icon">
              {tab.icon}
            </span>
            <span className="app-sidebar-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="app-sidebar-status">
        <span>{villageStageName}</span>
        <strong>{Math.floor(population)} hab.</strong>
      </div>
    </nav>
  )
}
