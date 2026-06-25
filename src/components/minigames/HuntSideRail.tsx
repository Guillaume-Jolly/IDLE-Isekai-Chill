import { type ReactNode, useEffect, useId, useState } from 'react'
import { MinigameSettingsButton } from './MinigameSettingsButton'
import { MinigameSideRailQuit } from './MinigameSideRailQuit'
import './Minigames.css'

const HUNT_DRAWER_BREAKPOINT = '(max-width: 767px)'

function useHuntDrawerMenu() {
  const [useDrawerMenu, setUseDrawerMenu] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(HUNT_DRAWER_BREAKPOINT).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(HUNT_DRAWER_BREAKPOINT)
    const sync = () => setUseDrawerMenu(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return useDrawerMenu
}

export type HuntDrawerId = 'biome' | 'decision' | 'objectives' | 'pending' | 'recent' | 'favors' | 'refuge' | 'debug'

export type SideDrawerConfig = {
  id: string
  label: string
  icon: string
  badge?: number | string
  content: ReactNode
  pinned?: boolean
}

/** @deprecated Alias chasse — préférer SideDrawerConfig */
export type HuntDrawerConfig = SideDrawerConfig & { id: HuntDrawerId }

type SideDrawerRailProps = {
  drawers: SideDrawerConfig[]
  openId: string | null
  onOpenChange: (id: string | null) => void
  canClose?: (id: string) => boolean
  menuTitle?: string
  menuAriaLabel?: string
  fabAriaLabel?: string
  onCloseMinigame?: () => void
  onMenuOpenChange?: (open: boolean) => void
}

export function HuntSideRail({
  drawers,
  openId,
  onOpenChange,
  canClose,
  menuTitle = 'Outils de chasse',
  menuAriaLabel = 'Outils de chasse',
  fabAriaLabel = 'Outils de chasse',
  onCloseMinigame,
  onMenuOpenChange,
}: SideDrawerRailProps) {
  const groupId = useId()
  const useDrawerMenu = useHuntDrawerMenu()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = drawers.find((drawer) => drawer.id === openId)

  useEffect(() => {
    if (!useDrawerMenu) return
    if (openId) {
      setMenuOpen(true)
    } else {
      setMenuOpen(false)
    }
  }, [openId, useDrawerMenu])

  useEffect(() => {
    onMenuOpenChange?.(menuOpen)
  }, [menuOpen, onMenuOpenChange])

  const openMenu = () => {
    setMenuOpen(true)
    if (!openId && drawers[0]) {
      onOpenChange(drawers[0].id)
    }
  }

  const closeMenu = () => {
    if (openId && canClose && !canClose(openId)) return
    setMenuOpen(false)
    onOpenChange(null)
  }

  const selectDrawer = (id: string) => {
    if (openId === id) {
      if (canClose && !canClose(id)) return
      onOpenChange(null)
      return
    }
    onOpenChange(id)
  }

  const urgentDrawer = drawers.find((drawer) => drawer.pinned || drawer.badge === '!')

  const quitButton =
    onCloseMinigame ? <MinigameSideRailQuit onClose={onCloseMinigame} /> : null

  const settingsButton = <MinigameSettingsButton />

  const renderDrawerTabs = (groupSuffix: string) =>
    drawers.map((drawer) => {
      const selected = openId === drawer.id
      const locked = selected && canClose && !canClose(drawer.id)
      return (
        <button
          aria-controls={`${groupId}-${groupSuffix}-${drawer.id}`}
          aria-expanded={selected}
          aria-label={drawer.label}
          aria-selected={selected}
          className={`mg-hunt-rail-tab ${selected ? 'active' : ''} ${drawer.pinned ? 'pinned' : ''}`}
          key={drawer.id}
          role="tab"
          title={drawer.label}
          type="button"
          onClick={() => selectDrawer(drawer.id)}
        >
          <span aria-hidden>{drawer.icon}</span>
          <span className="mg-hunt-rail-tab-label">{drawer.label}</span>
          {drawer.badge !== undefined && drawer.badge !== 0 ? (
            <span className="mg-hunt-rail-badge">{drawer.badge}</span>
          ) : null}
          {locked ? (
            <span className="mg-hunt-rail-lock" title="Décision requise">
              !
            </span>
          ) : null}
        </button>
      )
    })

  return (
    <>
      {useDrawerMenu && !menuOpen ? (
        <div aria-label={menuAriaLabel} className="mg-hunt-mobile-fabs">
          {quitButton}
          <button
            aria-label={fabAriaLabel}
            className="mg-hunt-menu-fab"
            type="button"
            onClick={openMenu}
          >
            <span aria-hidden="true">☰</span>
            {urgentDrawer ? <span aria-hidden className="mg-hunt-menu-fab-badge" /> : null}
          </button>
        </div>
      ) : null}

      {useDrawerMenu && !menuOpen ? (
        <div aria-label="Paramètres" className="mg-hunt-settings-dock">
          {settingsButton}
        </div>
      ) : null}

      {menuOpen && useDrawerMenu ? (
        <button
          aria-label="Fermer le menu"
          className="mg-hunt-menu-backdrop"
          type="button"
          onClick={closeMenu}
        />
      ) : null}

      <aside
        aria-hidden={useDrawerMenu ? !menuOpen : false}
        aria-label={menuAriaLabel}
        className={`mg-hunt-rail${
          menuOpen && useDrawerMenu ? ' mg-hunt-rail--menu-open' : ''
        }${useDrawerMenu ? '' : ' mg-hunt-rail--desktop-layout'}`}
      >
        <div className={`mg-hunt-menu-drawer${menuOpen && useDrawerMenu ? ' open' : ''}`}>
          <header className="mg-hunt-menu-drawer-head">
            <h4>{menuTitle}</h4>
            <button
              aria-label="Fermer le menu"
              className="mg-hunt-menu-close"
              disabled={openId ? canClose && !canClose(openId) : false}
              type="button"
              onClick={closeMenu}
            >
              ×
            </button>
          </header>

          <div className="mg-hunt-drawer-body">
            <div className="mg-hunt-rail-tabs mg-hunt-rail-tabs--drawer">
              <div className="mg-hunt-rail-tabs-scroll" role="tablist">
                {quitButton}
                {renderDrawerTabs('drawer')}
              </div>
              <div className="mg-hunt-rail-tabs-footer">{settingsButton}</div>
            </div>

          {active ? (
            <section
              aria-labelledby={`${groupId}-${active.id}-title`}
              className="mg-hunt-rail-panel mg-hunt-rail-panel--drawer"
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
          </div>
        </div>

        <div className="mg-hunt-rail-desktop">
          <div className="mg-hunt-rail-tabs">
            <div className="mg-hunt-rail-tabs-scroll" role="tablist">
              {quitButton}
              {renderDrawerTabs('desktop')}
            </div>
            <div className="mg-hunt-rail-tabs-footer">{settingsButton}</div>
          </div>

          {active ? (
            <section
              aria-labelledby={`${groupId}-desktop-${active.id}-title`}
              className="mg-hunt-rail-panel"
              id={`${groupId}-desktop-${active.id}`}
              role="tabpanel"
            >
              <header className="mg-hunt-rail-panel-head">
                <h3 id={`${groupId}-desktop-${active.id}-title`}>
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
        </div>
      </aside>
    </>
  )
}
