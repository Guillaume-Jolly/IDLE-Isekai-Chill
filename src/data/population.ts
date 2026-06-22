import {
  ARCHETYPE_ORDER,
  BUILDING_ARCHETYPE_WEIGHTS,
  CITY_ARCHETYPES,
  DOMINANT_ARCHETYPE_THRESHOLD,
  FUTURE_BUILDINGS,
  type CityArchetypeId,
} from './cityArchetypes'

export type NeedKey = 'food' | 'health' | 'security' | 'leisure' | 'prosperity'

export type VillagePopulationState = {
  population: number
  stage: number
}

export const NEED_KEYS: NeedKey[] = ['food', 'health', 'security', 'leisure', 'prosperity']

export const NEED_LABELS: Record<NeedKey, string> = {
  food: 'Vivres',
  health: 'Sante',
  security: 'Securite',
  leisure: 'Loisirs',
  prosperity: 'Prosperite',
}

export const NEED_HINTS: Record<NeedKey, string> = {
  food: 'Ferme, jardin, auberge',
  health: 'Source, jardin, ferme',
  security: 'Pierre, niveau general (caserne plus tard)',
  leisure: 'Theatre, auberge, atelier',
  prosperity: 'Marche, auberge, atelier',
}

/** Apport par niveau de batiment vers chaque besoin */
export const BUILDING_NEED_SUPPLY: Record<string, Partial<Record<NeedKey, number>>> = {
  inn: { food: 3, leisure: 8, prosperity: 6 },
  'mist-garden': { food: 10, health: 8 },
  'ribbon-workshop': { leisure: 6, prosperity: 5 },
  'clear-spring': { health: 12, leisure: 4 },
  'moon-farm': { food: 14, health: 6 },
  'arcane-library': { leisure: 8, prosperity: 4, health: 3 },
  'traveler-theater': { leisure: 14, prosperity: 6 },
  'star-market': { prosperity: 16, leisure: 4 },
}

/** Demande par habitant (par minute equivalent) */
export const NEED_DEMAND_PER_100_POP: Record<NeedKey, number> = {
  food: 28,
  health: 18,
  security: 14,
  leisure: 12,
  prosperity: 10,
}

export type PopulationStage = {
  id: number
  name: string
  popCap: number
  /** Population minimum pour tenter le stade suivant */
  popToAdvance: number
  /** Moyenne des besoins (0-100) requise */
  minAvgNeeds: number
  /** Besoin le plus bas ne doit pas etre sous ce seuil */
  minWeakestNeed: number
}

export const POPULATION_STAGES: PopulationStage[] = [
  {
    id: 0,
    name: 'Campement',
    popCap: 60,
    popToAdvance: 45,
    minAvgNeeds: 42,
    minWeakestNeed: 30,
  },
  {
    id: 1,
    name: 'Hameau',
    popCap: 140,
    popToAdvance: 110,
    minAvgNeeds: 52,
    minWeakestNeed: 38,
  },
  {
    id: 2,
    name: 'Village',
    popCap: 280,
    popToAdvance: 220,
    minAvgNeeds: 60,
    minWeakestNeed: 45,
  },
  {
    id: 3,
    name: 'Bourg',
    popCap: 520,
    popToAdvance: 400,
    minAvgNeeds: 68,
    minWeakestNeed: 52,
  },
  {
    id: 4,
    name: 'Cite des Brumes',
    popCap: 999,
    popToAdvance: 9999,
    minAvgNeeds: 100,
    minWeakestNeed: 100,
  },
]

/** Debloquage batiments existants par stade de population */
export const BUILDING_UNLOCK_STAGE: Record<string, number> = {
  inn: 0,
  'mist-garden': 0,
  'ribbon-workshop': 1,
  'clear-spring': 1,
  'moon-farm': 2,
  'arcane-library': 2,
  'traveler-theater': 3,
  'star-market': 4,
}

/** Ordre d affichage des batiments a stade egal (progression village). */
export const BUILDING_UNLOCK_ORDER = [
  'inn',
  'mist-garden',
  'ribbon-workshop',
  'clear-spring',
  'moon-farm',
  'arcane-library',
  'traveler-theater',
  'star-market',
] as const

export const STAGE_BUILDING_NAMES: Record<number, string[]> = {
  0: ['Auberge', 'Jardin'],
  1: ['Atelier', 'Source'],
  2: ['Ferme', 'Bibliotheque'],
  3: ['Theatre'],
  4: ['Marche des Etoiles'],
}

export const createStarterPopulation = (): VillagePopulationState => ({
  population: 24,
  stage: 0,
})

export const getCurrentStage = (stageId: number) =>
  POPULATION_STAGES[Math.min(stageId, POPULATION_STAGES.length - 1)]

export const getNextStage = (stageId: number) => {
  const next = POPULATION_STAGES[stageId + 1]
  return next ?? null
}

export const computeNeedSupply = (buildings: Record<string, number>) => {
  const supply = Object.fromEntries(NEED_KEYS.map((key) => [key, 0])) as Record<NeedKey, number>

  for (const [buildingId, level] of Object.entries(buildings)) {
    const contrib = BUILDING_NEED_SUPPLY[buildingId]
    if (!contrib || level <= 0) continue
    for (const key of NEED_KEYS) {
      supply[key] += (contrib[key] ?? 0) * level
    }
  }

  /** Securite bonus global : somme des niveaux de batiments en pierre */
  const stoneBuildings = ['inn', 'clear-spring', 'arcane-library', 'star-market']
  const securityBonus = stoneBuildings.reduce(
    (sum, id) => sum + (buildings[id] ?? 0) * 2,
    0,
  )
  supply.security += securityBonus

  return supply
}

export const computeNeedSatisfaction = (
  buildings: Record<string, number>,
  population: number,
): Record<NeedKey, number> => {
  const supply = computeNeedSupply(buildings)
  const popFactor = Math.max(1, population / 100)

  return Object.fromEntries(
    NEED_KEYS.map((key) => {
      const demand = NEED_DEMAND_PER_100_POP[key] * popFactor
      const ratio = demand > 0 ? supply[key] / demand : 1
      return [key, Math.min(100, Math.round(ratio * 100))]
    }),
  ) as Record<NeedKey, number>
}

export const averageNeeds = (needs: Record<NeedKey, number>) =>
  Math.round(NEED_KEYS.reduce((sum, key) => sum + needs[key], 0) / NEED_KEYS.length)

export const weakestNeed = (needs: Record<NeedKey, number>) =>
  NEED_KEYS.reduce((min, key) => (needs[key] < needs[min] ? key : min), NEED_KEYS[0])

export const computeArchetypePoints = (
  buildings: Record<string, number>,
): Record<CityArchetypeId, number> => {
  const points = Object.fromEntries(ARCHETYPE_ORDER.map((id) => [id, 0])) as Record<
    CityArchetypeId,
    number
  >

  for (const [buildingId, level] of Object.entries(buildings)) {
    const weights = BUILDING_ARCHETYPE_WEIGHTS[buildingId]
    if (!weights || level <= 0) continue
    for (const archetype of ARCHETYPE_ORDER) {
      points[archetype] += (weights[archetype] ?? 0) * level
    }
  }

  return points
}

export const getDominantArchetype = (
  points: Record<CityArchetypeId, number>,
): CityArchetypeId | null => {
  let best: CityArchetypeId | null = null
  let bestScore = DOMINANT_ARCHETYPE_THRESHOLD

  for (const id of ARCHETYPE_ORDER) {
    if (points[id] > bestScore) {
      bestScore = points[id]
      best = id
    }
  }

  return best
}

export const getArchetypeProductionMultiplier = (
  resourceKey: string,
  buildings: Record<string, number>,
): number => {
  const points = computeArchetypePoints(buildings)
  const dominant = getDominantArchetype(points)
  if (!dominant) return 1
  return CITY_ARCHETYPES[dominant].productionBonus[resourceKey] ?? 1
}

export type StageAdvanceCheck = {
  canAdvance: boolean
  reasons: string[]
}

export const checkStageAdvance = (
  village: VillagePopulationState,
  needs: Record<NeedKey, number>,
): StageAdvanceCheck => {
  const next = getNextStage(village.stage)
  if (!next) {
    return { canAdvance: false, reasons: ['Stade maximum atteint.'] }
  }

  const current = getCurrentStage(village.stage)
  const reasons: string[] = []
  const avg = averageNeeds(needs)
  const weak = needs[weakestNeed(needs)]

  if (village.population < current.popToAdvance) {
    reasons.push(`Population ${village.population}/${current.popToAdvance}`)
  }
  if (avg < current.minAvgNeeds) {
    reasons.push(`Bonheur moyen ${avg}% (min ${current.minAvgNeeds}%)`)
  }
  if (weak < current.minWeakestNeed) {
    reasons.push(`Besoin le plus faible ${weak}% (min ${current.minWeakestNeed}%)`)
  }

  return { canAdvance: reasons.length === 0, reasons }
}

/** Croissance population par tick idle (5 s) */
export const populationGrowthTick = (
  village: VillagePopulationState,
  needs: Record<NeedKey, number>,
) => {
  const stage = getCurrentStage(village.stage)
  if (village.population >= stage.popCap) return 0

  const avg = averageNeeds(needs)
  if (avg < 40) return 0

  const headroom = 1 - village.population / stage.popCap
  const growth = (0.35 + village.population * 0.004) * (avg / 100) * headroom
  return Math.max(0, growth)
}

export const isBuildingUnlockedByStage = (buildingId: string, stage: number) =>
  stage >= (BUILDING_UNLOCK_STAGE[buildingId] ?? 0)

export const futureBuildingsForStage = (stage: number) =>
  FUTURE_BUILDINGS.filter((building) => building.unlockStage <= stage + 1)
