import { useMemo, useState, type ReactNode } from 'react'
import type { BuildingActivity } from '../../data/buildingActivities'
import {
  MINIGAME_DRAWER_GROUP_LABELS,
  MINIGAME_DRAWER_GROUP_ORDER,
  MINIGAME_STANDARD_DRAWER_IDS,
  type MinigameDrawerGroupId,
} from '../../data/minigameSideMenu'
import type { MinigameSceneLayerDef, MinigameSceneLayoutCalibration } from '../../data/minigameSceneLayout'
import { loadMinigameSceneLayoutCalibration } from '../../data/minigameSceneLayout'
import { HuntSideRail, type SideDrawerConfig } from './HuntSideRail'
import { MinigameInfoPanel } from './MinigameInfoPanel'
import { MinigameSceneLayoutCalibrator } from './MinigameSceneLayoutCalibrator'
import './MinigameSceneLayoutCalibrator.css'

export type MinigameSideMenuDrawer = SideDrawerConfig & {
  group?: MinigameDrawerGroupId
  devOnly?: boolean
}

export type MinigameSceneLayoutConfig = {
  minigameId: string
  layers: readonly MinigameSceneLayerDef[]
}

export type MinigameSideMenuShellProps = {
  activity: BuildingActivity
  buildingName: string
  companionName: string
  resourceLabel: string
  score: number
  maxScore?: number
  scoreLabel?: string
  endless?: boolean
  infoExtraLines?: Array<{ label: string; value: string }>
  drawers: MinigameSideMenuDrawer[]
  openId: string | null
  onOpenChange: (id: string | null) => void
  onCloseMinigame: () => void
  canClose?: (id: string) => boolean
  menuTitle?: string
  menuAriaLabel?: string
  fabAriaLabel?: string
  alwaysDrawerMenu?: boolean
  onMenuOpenChange?: (open: boolean) => void
  paramsContent?: ReactNode
  sceneLayout?: MinigameSceneLayoutConfig
  sceneLayoutCalibration?: MinigameSceneLayoutCalibration
  onSceneLayoutChange?: (next: MinigameSceneLayoutCalibration) => void
}

function sortDrawersByGroup(drawers: MinigameSideMenuDrawer[]): MinigameSideMenuDrawer[] {
  const rank = new Map(MINIGAME_DRAWER_GROUP_ORDER.map((group, index) => [group, index]))
  return [...drawers].sort(
    (a, b) =>
      (rank.get(a.group ?? 'gameplay') ?? 99) - (rank.get(b.group ?? 'gameplay') ?? 99),
  )
}

export function useMinigameSideMenu({
  activity,
  buildingName,
  companionName,
  resourceLabel,
  score,
  maxScore = 100,
  scoreLabel = 'Score',
  endless = false,
  infoExtraLines,
  drawers,
  openId,
  onOpenChange,
  onCloseMinigame,
  canClose,
  menuTitle,
  menuAriaLabel,
  fabAriaLabel,
  alwaysDrawerMenu = false,
  onMenuOpenChange,
  paramsContent,
  sceneLayout,
  sceneLayoutCalibration,
  onSceneLayoutChange,
}: MinigameSideMenuShellProps) {
  const [layoutDragMode, setLayoutDragMode] = useState(false)
  const [internalCalibration, setInternalCalibration] = useState<MinigameSceneLayoutCalibration>(() =>
    sceneLayout ? loadMinigameSceneLayoutCalibration(sceneLayout.minigameId, sceneLayout.layers) : {},
  )

  const calibration = sceneLayoutCalibration ?? internalCalibration
  const setCalibration = onSceneLayoutChange ?? setInternalCalibration

  const mergedDrawers = useMemo(() => {
    const standard: MinigameSideMenuDrawer[] = [
      {
        id: MINIGAME_STANDARD_DRAWER_IDS.info,
        group: 'system',
        label: 'Infos',
        icon: 'ℹ️',
        content: (
          <MinigameInfoPanel
            activity={activity}
            buildingName={buildingName}
            companionName={companionName}
            endless={endless}
            extraLines={infoExtraLines}
            maxScore={maxScore}
            resourceLabel={resourceLabel}
            score={score}
            scoreLabel={scoreLabel}
          />
        ),
      },
    ]

    if (paramsContent) {
      standard.push({
        id: MINIGAME_STANDARD_DRAWER_IDS.params,
        group: 'system',
        label: 'Options',
        icon: '🎛️',
        content: <div className="mg-side-menu-panel">{paramsContent}</div>,
      })
    }

    const gameDrawers = drawers.filter((drawer) => !drawer.devOnly || import.meta.env.DEV)

    const devDrawers: MinigameSideMenuDrawer[] = []
    if (import.meta.env.DEV && sceneLayout) {
      devDrawers.push({
        id: MINIGAME_STANDARD_DRAWER_IDS.debug,
        group: 'dev',
        label: 'Debug',
        icon: '🛠',
        content: (
          <MinigameSceneLayoutCalibrator
            calibration={calibration}
            dragMode={layoutDragMode}
            layers={sceneLayout.layers}
            minigameId={sceneLayout.minigameId}
            onChange={setCalibration}
            onDragModeChange={setLayoutDragMode}
          />
        ),
      })
    }

    return sortDrawersByGroup([...standard, ...gameDrawers, ...devDrawers])
  }, [
    activity,
    buildingName,
    calibration,
    companionName,
    drawers,
    endless,
    infoExtraLines,
    layoutDragMode,
    maxScore,
    paramsContent,
    resourceLabel,
    sceneLayout,
    score,
    scoreLabel,
    setCalibration,
  ])

  const debugOpen = openId === MINIGAME_STANDARD_DRAWER_IDS.debug

  const rail = (
    <HuntSideRail
      alwaysDrawerMenu={alwaysDrawerMenu}
      canClose={canClose}
      drawers={mergedDrawers}
      fabAriaLabel={fabAriaLabel ?? menuTitle ?? 'Menu mini-jeu'}
      groupLabels={MINIGAME_DRAWER_GROUP_LABELS}
      menuAriaLabel={menuAriaLabel ?? menuTitle ?? 'Menu mini-jeu'}
      menuTitle={menuTitle ?? activity.name}
      openId={openId}
      onCloseMinigame={onCloseMinigame}
      onMenuOpenChange={onMenuOpenChange}
      onOpenChange={onOpenChange}
    />
  )

  return {
    rail,
    sceneLayoutDebug: {
      enabled: debugOpen && layoutDragMode,
      calibration,
      layers: sceneLayout?.layers ?? [],
      onChange: setCalibration,
    },
  }
}

export { MINIGAME_STANDARD_DRAWER_IDS }
