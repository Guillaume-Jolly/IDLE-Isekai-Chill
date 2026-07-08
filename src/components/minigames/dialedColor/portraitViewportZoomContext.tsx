import { createContext, useContext, type ReactNode } from 'react'

export type PortraitViewportZoom = {
  /** Scale CSS appliqué au contenu (espace canvas). */
  viewportScale: number
  /** 1 = ajusté à la fenêtre ; 64 = zoom max. */
  zoomRatio: number
}

const defaultZoom: PortraitViewportZoom = {
  viewportScale: 1,
  zoomRatio: 1,
}

const PortraitViewportZoomContext = createContext<PortraitViewportZoom>(defaultZoom)

export function PortraitViewportZoomProvider({
  value,
  children,
}: {
  value: PortraitViewportZoom
  children: ReactNode
}) {
  return (
    <PortraitViewportZoomContext.Provider value={value}>{children}</PortraitViewportZoomContext.Provider>
  )
}

export function usePortraitViewportZoom() {
  return useContext(PortraitViewportZoomContext)
}
