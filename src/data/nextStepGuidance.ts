import type { ViewKey } from '../components/AppNav'
import { mergeMyrionWorksite } from './myrionWorksite'
import type { MinigameSave } from './minigameSave'
import { buildInventorySnapshot } from './inventoryView'
import type { StatKey } from './companionStats'
import type { ResourceKey } from './resources'

export type NextStepTarget =
  | { kind: 'view'; view: ViewKey }
  | { kind: 'activity'; activityId: string }
  | { kind: 'none' }

export type NextStepSuggestion = {
  id: string
  kicker: 'À faire maintenant' | 'Prochaine piste' | 'Objectif conseillé'
  label: string
  detail: string
  target: NextStepTarget
  recommendedActivityId?: string
}

export type NextStepContext = {
  minigameSave: MinigameSave
  tickets: number
  resources: Record<ResourceKey, number>
  companionFragments: Record<string, number>
  statTokens: Record<StatKey, number>
  buildings: Record<string, number>
  eventPulls: number
  questsClaimed: number
  companions: Record<string, { unspentStatPoints: number }>
}

const MOON_FARM_ACTIVITY_ID = 'farm-worksite'
const REFUGE_ACTIVITY_ID = 'farm-dressage'

function hasWorksiteEngagement(minigameSave: MinigameSave): boolean {
  const worksite = mergeMyrionWorksite(minigameSave.myrionWorksite)
  const produced = Object.values(worksite.totalProducedBySpot ?? {}).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  )
  if (produced > 0) return true
  for (const list of Object.values(worksite.assignedMyrionIdsBySpot ?? {})) {
    if ((list ?? []).length > 0) return true
  }
  return false
}

function hasWorksiteAssignment(minigameSave: MinigameSave): boolean {
  const worksite = mergeMyrionWorksite(minigameSave.myrionWorksite)
  for (const list of Object.values(worksite.assignedMyrionIdsBySpot ?? {})) {
    if ((list ?? []).length > 0) return true
  }
  return false
}

function countNonZeroMainResources(ctx: NextStepContext): number {
  const snapshot = buildInventorySnapshot({
    resources: ctx.resources,
    companionFragments: ctx.companionFragments,
    statTokens: ctx.statTokens,
    buildings: ctx.buildings,
    minigameSave: ctx.minigameSave,
    companions: ctx.companions,
    eventPulls: ctx.eventPulls,
    questsClaimed: ctx.questsClaimed,
  })
  return snapshot.sections
    .slice(0, 4)
    .flatMap((section) => section.items)
    .filter((item) => item.amount > 0).length
}

export function computeNextStep(ctx: NextStepContext): NextStepSuggestion {
  const pets = ctx.minigameSave.pets ?? []
  const tickets = Math.floor(ctx.tickets ?? 0)

  if (!hasWorksiteEngagement(ctx.minigameSave)) {
    return {
      id: 'discover-moon-farm',
      kicker: 'Prochaine piste',
      label: 'Découvrir la Ferme lunaire',
      detail: 'Ouvre le chantier, assigne un Myrion et laisse la production avancer.',
      target: { kind: 'activity', activityId: MOON_FARM_ACTIVITY_ID },
      recommendedActivityId: MOON_FARM_ACTIVITY_ID,
    }
  }

  if (pets.length > 0 && !hasWorksiteAssignment(ctx.minigameSave)) {
    return {
      id: 'assign-myrion',
      kicker: 'À faire maintenant',
      label: 'Assigner un Myrion à une activité',
      detail: 'Envoie un Myrion sur un biome du chantier pour lancer la production.',
      target: { kind: 'activity', activityId: MOON_FARM_ACTIVITY_ID },
      recommendedActivityId: MOON_FARM_ACTIVITY_ID,
    }
  }

  if (pets.length === 0) {
    return {
      id: 'visit-refuge',
      kicker: 'Prochaine piste',
      label: 'Voir les Myrions au Refuge',
      detail: 'Récupère ou soigne des Myrions — ils alimentent le reste du Havre.',
      target: { kind: 'activity', activityId: REFUGE_ACTIVITY_ID },
      recommendedActivityId: REFUGE_ACTIVITY_ID,
    }
  }

  const resourceKinds = countNonZeroMainResources(ctx)
  if (resourceKinds < 4) {
    return {
      id: 'check-inventory',
      kicker: 'Objectif conseillé',
      label: 'Consulter les ressources',
      detail: 'Repère ce que tu as déjà et où les dépenser dans le village.',
      target: { kind: 'view', view: 'inventory' },
    }
  }

  if (tickets > 0) {
    return {
      id: 'try-gacha',
      kicker: 'À faire maintenant',
      label: 'Tenter une invocation',
      detail: 'Tu as des tickets — une invocation peut élargir ton équipe.',
      target: { kind: 'view', view: 'event' },
    }
  }

  return {
    id: 'keep-improving',
    kicker: 'Objectif conseillé',
    label: 'Continuer à améliorer le Havre',
    detail: 'Explore les mini-jeux, fais monter les bâtiments et reviens souvent.',
    target: { kind: 'none' },
  }
}
