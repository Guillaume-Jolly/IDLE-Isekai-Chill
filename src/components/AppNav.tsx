import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useAppBuildVersion } from '../hooks/useAppBuildVersion'
import { useIsMobileLayout } from '../hooks/useMediaQuery'

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
  const isMobileLayout = useIsMobileLayout()
  const layoutMode = isMobileLayout ? 'Mobile' : 'PC'
  const appVersion = useAppBuildVersion()
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const resourcesWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!resourcesOpen) return

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (resourcesWrapRef.current?.contains(target)) return
      setResourcesOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [resourcesOpen])

  const handleSelect = (view: ViewKey) => {
    setResourcesOpen(false)
    onSelect(view)
  }

  const openInventory = () => {
    setResourcesOpen(false)
    onSelect('inventory')
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
            <strong className="app-sidebar-brand-title">Havre des Brumes</strong>
            <span className="app-sidebar-brand-version">
              {layoutMode} · {appVersion}
            </span>
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

          {resourcesPanel ? (
            <div className="app-sidebar-resources-wrap" ref={resourcesWrapRef}>
              <button
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                aria-label="Ressources"
                className={`app-sidebar-tab-resources${resourcesOpen ? ' active' : ''}`}
                title="Ressources"
                type="button"
                onClick={() => setResourcesOpen((open) => !open)}
              >
                <span aria-hidden="true" className="app-sidebar-tab-icon">
                  💎
                </span>
                <span className="app-sidebar-tab-label">Ressources</span>
              </button>

              {resourcesOpen ? (
                <div aria-label="Ressources" className="app-sidebar-resources-flyout" role="dialog">
                  {resourcesPanel}
                  <button
                    className="app-sidebar-inventory-link"
                    type="button"
                    onClick={openInventory}
                  >
                    Détails → Inventaire
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="app-sidebar-status">
          <span className="app-sidebar-status-stage">{villageStageName}</span>
          <strong>{Math.floor(population)} hab.</strong>
        </div>
      </div>
    </nav>
  )
}
