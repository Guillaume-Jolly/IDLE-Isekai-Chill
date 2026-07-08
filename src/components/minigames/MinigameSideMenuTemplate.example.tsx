/**
 * Template copy-paste — menu latéral mini-jeu (desktop rail + mobile replié).
 *
 * 1. Copier ce squelette dans `MonMiniJeuGame.tsx`
 * 2. Remplacer SCENE_LAYERS + drawers métier
 * 3. Marquer la scène avec `data-mg-layout-layer="…"` + `sceneLayoutLayerStyle`
 * 4. `hideGlobalChrome` sur MinigameFrame — le shell remplace l'ancien rail X/i/⚙
 */
import { useMemo, useState } from 'react'
import type { MinigameSceneLayerDef } from '../../data/minigameSceneLayout'
import { sceneLayoutLayerStyle } from '../../data/minigameSceneLayout'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { useMinigameSideMenu } from './MinigameSideMenuShell'
import { MinigameSceneLayoutDragOverlay, MinigameSceneLayoutScene } from './MinigameSceneLayoutDragOverlay'

const SCENE_LAYERS: MinigameSceneLayerDef[] = [
  { id: 'bg', label: 'Fond', group: 'decor' },
  { id: 'hero', label: 'Héros / focus', group: 'gameplay' },
  { id: 'hud', label: 'HUD', group: 'ui' },
  { id: 'interactive-spot', label: 'Spot cliquable', group: 'interactive' },
]

export function MinigameSideMenuTemplateExample({
  activity,
  buildingName,
  companionName,
  resourceLabel,
  onClose,
}: MinigameProps) {
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const score = 42

  const gameDrawers = useMemo(
    () => [
      {
        id: 'objectives',
        group: 'gameplay' as const,
        label: 'Objectifs',
        icon: '🎯',
        content: <p>Contenu gameplay…</p>,
      },
      {
        id: 'tools',
        group: 'interactive' as const,
        label: 'Outils',
        icon: '🧰',
        content: <p>Actions interactives…</p>,
      },
    ],
    [],
  )

  const sideMenu = useMinigameSideMenu({
    activity,
    buildingName,
    companionName,
    drawers: gameDrawers,
    openId: openDrawer,
    onCloseMinigame: onClose,
    onOpenChange: setOpenDrawer,
    paramsContent: (
      <>
        <p>Options propres au mini-jeu (pas les paramètres globaux ⚙ en bas du rail).</p>
        <label>
          <input defaultChecked type="checkbox" /> Exemple toggle
        </label>
      </>
    ),
    resourceLabel,
    sceneLayout: { minigameId: activity.id, layers: SCENE_LAYERS },
    score,
    scoreLabel: 'Score',
    menuTitle: activity.name,
  })

  const cal = sideMenu.sceneLayoutDebug.calibration

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionName={companionName}
      endless
      hideGlobalChrome
      maxScore={100}
      onClose={onClose}
      onRestart={() => {}}
      resourceLabel={resourceLabel}
      score={score}
      status="playing"
    >
      <div className="mg-example-immersive mg-hunt-layout">
        {sideMenu.rail}

        <MinigameSceneLayoutScene
          className="mg-hunt-main"
          dragOverlay={
            <MinigameSceneLayoutDragOverlay
              calibration={cal}
              enabled={sideMenu.sceneLayoutDebug.enabled}
              layers={SCENE_LAYERS}
              onChange={sideMenu.sceneLayoutDebug.onChange}
            />
          }
        >
          <div
            className="mg-example-bg"
            data-mg-layout-layer="bg"
            style={sceneLayoutLayerStyle(cal.bg)}
          >
            Fond décor
          </div>
          <div data-mg-layout-layer="hero" style={sceneLayoutLayerStyle(cal.hero)}>
            Zone gameplay
          </div>
        </MinigameSceneLayoutScene>
      </div>
    </MinigameFrame>
  )
}
