import { getActivityById, type BuildingActivity } from './buildingActivities'

/**
 * Mini-jeux **en cours de développement** — lab Vite port 5174 uniquement.
 *
 * Workflow :
 * 1. Ajouter l’`activity.id` ici pendant le dev (masques, UX, scoring…).
 * 2. Une fois validé, retirer de cette liste — le mini-jeu reste jouable via le jeu complet (5173).
 */
export const MINIGAME_LAB_WIP_IDS: readonly string[] = [
  'disagrea-color-toon',
]

/** @deprecated Utiliser MINIGAME_LAB_WIP_IDS */
export const MINIGAME_LAB_IDS = MINIGAME_LAB_WIP_IDS

export function getMinigameLabActivities(): BuildingActivity[] {
  return MINIGAME_LAB_WIP_IDS.map((id) => getActivityById(id)).filter(
    (activity): activity is BuildingActivity => Boolean(activity),
  )
}

export function getDefaultMinigameLabActivityId(): string {
  return MINIGAME_LAB_WIP_IDS[0] ?? 'disagrea-color-toon'
}
