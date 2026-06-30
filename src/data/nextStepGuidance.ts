import type { ViewKey } from '../components/AppNav'
import { totalStatTokens } from './companionStats'
import { mergeMyrionWorksite } from './myrionWorksite'
import type { MinigameSave } from './minigameSave'
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
  companions: Record<string, { unspentStatPoints: number; affinity: number }>
}

const MOON_FARM_ACTIVITY_ID = 'farm-worksite'
const HUNT_ACTIVITY_ID = 'farm-capture'
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

function totalChantierProduction(minigameSave: MinigameSave): number {
  const worksite = mergeMyrionWorksite(minigameSave.myrionWorksite)
  return Object.values(worksite.totalProducedBySpot ?? {}).reduce<number>(
    (sum, value) => sum + (value ?? 0),
    0,
  )
}

function unlockedWorksiteBiomeCount(minigameSave: MinigameSave): number {
  return mergeMyrionWorksite(minigameSave.myrionWorksite).unlockedBiomeIds.length
}

function hasStatAssignmentPending(ctx: NextStepContext): boolean {
  if (totalStatTokens(ctx.statTokens) > 0) return true
  return Object.values(ctx.companions).some((companion) => companion.unspentStatPoints > 0)
}

function hasAffinityHeadroom(ctx: NextStepContext): boolean {
  return Object.values(ctx.companions).some((companion) => companion.affinity < 5)
}

function hasWorksiteBasics(ctx: NextStepContext): boolean {
  const pets = ctx.minigameSave.pets ?? []
  return pets.length > 0 && hasWorksiteAssignment(ctx.minigameSave) && hasWorksiteEngagement(ctx.minigameSave)
}

export function computeNextStep(ctx: NextStepContext): NextStepSuggestion {
  const pets = ctx.minigameSave.pets ?? []
  const tickets = Math.floor(ctx.tickets ?? 0)

  if (!hasWorksiteEngagement(ctx.minigameSave)) {
    return {
      id: 'discover-moon-farm',
      kicker: 'Prochaine piste',
      label: 'Découvrir la Ferme lunaire',
      detail: 'Ouvre la ferme, assigne un Myrion et laisse la production avancer.',
      target: { kind: 'activity', activityId: MOON_FARM_ACTIVITY_ID },
      recommendedActivityId: MOON_FARM_ACTIVITY_ID,
    }
  }

  if (pets.length === 0) {
    return {
      id: 'hunt-first-myrion',
      kicker: 'À faire maintenant',
      label: 'Capturer un premier Myrion',
      detail: 'La chasse alimente le Refuge et la Ferme lunaire.',
      target: { kind: 'activity', activityId: HUNT_ACTIVITY_ID },
      recommendedActivityId: HUNT_ACTIVITY_ID,
    }
  }

  if (!hasWorksiteAssignment(ctx.minigameSave)) {
    return {
      id: 'assign-myrion',
      kicker: 'À faire maintenant',
      label: 'Assigner un Myrion à la ferme',
      detail: 'Envoie un Myrion sur un filon de la Ferme lunaire pour lancer la production.',
      target: { kind: 'activity', activityId: MOON_FARM_ACTIVITY_ID },
      recommendedActivityId: MOON_FARM_ACTIVITY_ID,
    }
  }

  if (hasStatAssignmentPending(ctx)) {
    return {
      id: 'assign-companion-stats',
      kicker: 'Objectif conseillé',
      label: 'Assigner des stats compagnons',
      detail: 'Onglet Liens : place tes points de niveau ou jetons gacha sur une stat.',
      target: { kind: 'view', view: 'companions' },
    }
  }

  if (tickets > 0 && hasWorksiteBasics(ctx)) {
    return {
      id: 'try-gacha',
      kicker: 'Prochaine piste',
      label: 'Tenter une invocation',
      detail: 'Tu as des tickets — une invocation peut élargir ton équipe ou tes fragments.',
      target: { kind: 'view', view: 'event' },
    }
  }

  if (
    unlockedWorksiteBiomeCount(ctx.minigameSave) <= 1 &&
    totalChantierProduction(ctx.minigameSave) >= 18
  ) {
    return {
      id: 'expand-chantier-biomes',
      kicker: 'Objectif conseillé',
      label: 'Étendre la Ferme lunaire',
      detail: 'Produis encore un peu sur la prairie pour débloquer un nouveau biome.',
      target: { kind: 'activity', activityId: MOON_FARM_ACTIVITY_ID },
      recommendedActivityId: MOON_FARM_ACTIVITY_ID,
    }
  }

  if (hasAffinityHeadroom(ctx) && hasWorksiteBasics(ctx)) {
    return {
      id: 'strengthen-bonds',
      kicker: 'Prochaine piste',
      label: 'Approfondir un lien compagnon',
      detail:
        'Onglet Liens : conversations de lien (gratuites) ou mini-jeu Parler (activité à choix).',
      target: { kind: 'view', view: 'companions' },
    }
  }

  if (pets.length > 0 && totalChantierProduction(ctx.minigameSave) < 3) {
    return {
      id: 'visit-refuge',
      kicker: 'Prochaine piste',
      label: 'Visiter le Refuge',
      detail: 'Soigne ou observe tes Myrions entre deux sessions à la ferme.',
      target: { kind: 'activity', activityId: REFUGE_ACTIVITY_ID },
      recommendedActivityId: REFUGE_ACTIVITY_ID,
    }
  }

  return {
    id: 'keep-improving',
    kicker: 'Objectif conseillé',
    label: 'Continuer à améliorer le Havre',
    detail: 'Hub mini-jeux, bâtiments du village et Ferme lunaire — à ton rythme.',
    target: { kind: 'none' },
  }
}
