import type { RefugeBiomeId } from './myrionRefuge'
import { BIOME_RESOURCES, normalizeRefugeBiomeId } from './myrionRefuge'
import { MYRION_SPECIES_IDS } from './minigameAssets'
import type { PalmonRarity } from './wildFamiliars'
import {
  createStarterMyrionWorksite,
  mergeMyrionWorksite,
  type MyrionWorksiteSave,
} from './myrionWorksite'



export type FarmCropId = 'herb' | 'moon-wheat' | 'star-berry'



export type FarmPlot = {

  cropId: FarmCropId

  plantedAt: number

  growMs: number

} | null



export type PetState = {

  id: string

  speciesId: string

  name: string

  emoji: string

  rarity: PalmonRarity

  biomeId: string

  hunger: number

  joy: number

  energy: number

  affectionLevel: number

  lastVisit: number

  isShiny?: boolean

  visualVariant?: import('./myrionVariants').MyrionVisualVariant

  personality?: string

  traits?: string[]

  lineagePotential?: number

  supportBuffs?: import('./myrionMvp2').SupportBuff[]

  affinityTags?: string[]

  generation?: number

  parentIds?: [string, string]

  breedCooldownUntil?: number

  lrBlessing?: boolean

}

export type PendingHuntCapture = {
  id: string
  pet: PetState
  capturedAt: number
  biomeId: string
}

export type EchoEgg = {
  id: string
  parentAId: string
  parentBId: string
  speciesId: string
  speciesName: string
  speciesEmoji: string
  expectedRarity: PalmonRarity
  biomeId: RefugeBiomeId
  generation: number
  lineagePotential: number
  traits: string[]
  supportBuffs: import('./myrionMvp2').SupportBuff[]
  compatibility: 'strong' | 'normal' | 'unstable'
  startedAt: number
  hatchMs: number
  careActions: Array<'warm' | 'soothe' | 'moon'>
  stability: number
}

export type RefugeProgressState = {
  shinyDiscovered?: boolean
  biomeFavors?: Partial<Record<RefugeBiomeId, number>>
  releasedCount?: number
}

export type RefugeResourceState = {

  amount: number

  lastTickAt: number

}



export type MinigameSave = {

  farmPlots: FarmPlot[]

  pets: PetState[]

  refugeResources?: Partial<Record<RefugeBiomeId, RefugeResourceState>>

  refugeProgress?: RefugeProgressState

  huntFavors?: import('./myrionMvp2').HuntFavor[]

  searchObjectives?: import('./myrionMvp2').HuntSearchObjective[]

  huntAutoDecision?: import('./myrionMvp2').HuntAutoDecisionSettings

  pendingHuntCaptures?: PendingHuntCapture[]

  echoEggs?: EchoEgg[]

  companionMyrionLinks?: Partial<Record<string, string>>

  saveVersion?: number

  captureStats?: {
    totalCaught: number
    bestRarity: PalmonRarity | null
    caughtByRarity?: Partial<Record<PalmonRarity, number>>
  }

  /** Chantier Myrion — MVP 1 spots / assignations. */
  myrionWorksite?: MyrionWorksiteSave
}



export const FARM_CROPS: Record<

  FarmCropId,

  { label: string; emoji: string; growMs: number; hint: string }

> = {

  herb: { label: 'Herbe brume', emoji: '🌿', growMs: 60_000, hint: '~1 min' },

  'moon-wheat': { label: 'Ble lunaire', emoji: '🌾', growMs: 180_000, hint: '~3 min' },

  'star-berry': { label: 'Baie etoile', emoji: '★', growMs: 480_000, hint: '~8 min' },

}



export const MINIGAME_SAVE_VERSION = 4

/** Versions antérieures à celle-ci : collection Myrions réinitialisée (relâchement global). */
export const PET_COLLECTION_RESET_VERSION = 4

const RARITY_RANK: Record<PalmonRarity, number> = {

  N: 0,

  R: 1,

  SR: 2,

  SSR: 3,

  UR: 4,

  LR: 5,

}



export function normalizePet(pet: Partial<PetState> & Pick<PetState, 'id' | 'name' | 'emoji'>): PetState {

  return {

    id: pet.id,

    speciesId: pet.speciesId ?? pet.id,

    name: pet.name,

    emoji: pet.emoji,

    rarity: pet.rarity ?? 'N',

    biomeId: normalizeRefugeBiomeId(pet.biomeId ?? 'prairie-solaire'),

    hunger: pet.hunger ?? 70,

    joy: pet.joy ?? 75,

    energy: pet.energy ?? 80,

    affectionLevel: pet.affectionLevel ?? 1,

    lastVisit: pet.lastVisit ?? Date.now(),

    isShiny: pet.isShiny ?? false,

    visualVariant: pet.visualVariant,

    personality: pet.personality,

    traits: pet.traits ?? [],

    lineagePotential: pet.lineagePotential ?? 40,

    supportBuffs: pet.supportBuffs ?? [],

    affinityTags: pet.affinityTags ?? [],

    generation: pet.generation ?? 0,

    parentIds: pet.parentIds,

    breedCooldownUntil: pet.breedCooldownUntil,

    lrBlessing: pet.lrBlessing ?? false,

  }

}



export function createStarterMinigameSave(): MinigameSave {

  const now = Date.now()

  return {

    farmPlots: [null, null, null, null, null, null],

    pets: [],

    refugeResources: createStarterRefugeResources(now),

    refugeProgress: { shinyDiscovered: false, biomeFavors: {} },

    huntFavors: [],

    searchObjectives: [],

    huntAutoDecision: {
      mode: 'keep_all',
    },

    pendingHuntCaptures: [],

    echoEggs: [],

    companionMyrionLinks: {},

    saveVersion: MINIGAME_SAVE_VERSION,

    captureStats: { totalCaught: 0, bestRarity: null },

    myrionWorksite: createStarterMyrionWorksite(now),

  }
}



function createStarterRefugeResources(now: number): Partial<Record<RefugeBiomeId, RefugeResourceState>> {
  const resources: Partial<Record<RefugeBiomeId, RefugeResourceState>> = {}
  for (const biomeId of Object.keys(BIOME_RESOURCES) as RefugeBiomeId[]) {
    resources[biomeId] = { amount: 0, lastTickAt: now }
  }
  return resources
}

export function mergeMinigameSave(partial?: Partial<MinigameSave>): MinigameSave {

  const starter = createStarterMinigameSave()
  const incomingVersion = partial?.saveVersion ?? 0
  const shouldWipePets = incomingVersion < PET_COLLECTION_RESET_VERSION

  const petsSource = shouldWipePets ? [] : (partial?.pets ?? starter.pets)

  return {

    farmPlots: partial?.farmPlots ?? starter.farmPlots,

    pets: petsSource
      .map((pet) => normalizePet(pet))
      .filter((pet) => MYRION_SPECIES_IDS.has(pet.speciesId)),

    refugeResources: partial?.refugeResources ?? starter.refugeResources,

    refugeProgress: partial?.refugeProgress ?? { shinyDiscovered: false, biomeFavors: {} },

    huntFavors: partial?.huntFavors ?? [],

    searchObjectives: partial?.searchObjectives ?? [],

    huntAutoDecision: partial?.huntAutoDecision ?? starter.huntAutoDecision,

    pendingHuntCaptures: partial?.pendingHuntCaptures ?? starter.pendingHuntCaptures,

    echoEggs: shouldWipePets ? [] : (partial?.echoEggs ?? []),

    companionMyrionLinks: partial?.companionMyrionLinks ?? {},

    saveVersion: MINIGAME_SAVE_VERSION,

    captureStats: partial?.captureStats ?? starter.captureStats,

    myrionWorksite: mergeMyrionWorksite(partial?.myrionWorksite),

  }

}



export function refreshPetsOnVisit(pets: PetState[], now = Date.now()): PetState[] {

  return pets.map((pet) => {

    const hoursAway = Math.max(0, (now - pet.lastVisit) / 3_600_000)

    const hungerDrop = Math.min(30, hoursAway * 4)

    const joyDrop = Math.min(25, hoursAway * 3)

    const energyDrop = Math.min(20, hoursAway * 2)

    return {

      ...pet,

      hunger: Math.max(25, pet.hunger - hungerDrop),

      joy: Math.max(25, pet.joy - joyDrop),

      energy: Math.max(20, pet.energy - energyDrop),

      lastVisit: now,

    }

  })

}



export function updateCaptureStats(

  stats: MinigameSave['captureStats'],

  rarity: PalmonRarity,

): MinigameSave['captureStats'] {

  const current = stats ?? { totalCaught: 0, bestRarity: null }

  const bestRarity =

    !current.bestRarity || RARITY_RANK[rarity] > RARITY_RANK[current.bestRarity]

      ? rarity

      : current.bestRarity

  return { totalCaught: current.totalCaught + 1, bestRarity, caughtByRarity: {
    ...current.caughtByRarity,
    [rarity]: (current.caughtByRarity?.[rarity] ?? 0) + 1,
  } }

}

export function revertCaptureStats(
  stats: MinigameSave['captureStats'],
  rarity: PalmonRarity,
): MinigameSave['captureStats'] {
  const current = stats ?? { totalCaught: 0, bestRarity: null }
  const nextTotal = Math.max(0, current.totalCaught - 1)
  const nextByRarity = { ...current.caughtByRarity }
  const prevCount = nextByRarity[rarity] ?? 0
  if (prevCount <= 1) {
    delete nextByRarity[rarity]
  } else {
    nextByRarity[rarity] = prevCount - 1
  }

  return {
    totalCaught: nextTotal,
    bestRarity: current.bestRarity,
    caughtByRarity: nextByRarity,
  }
}


