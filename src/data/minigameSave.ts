import type { PalmonRarity } from './wildFamiliars'



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

  lastVisit: number

}



export type MinigameSave = {

  farmPlots: FarmPlot[]

  pets: PetState[]

  captureStats?: {

    totalCaught: number

    bestRarity: PalmonRarity | null

  }

}



export const FARM_CROPS: Record<

  FarmCropId,

  { label: string; emoji: string; growMs: number; hint: string }

> = {

  herb: { label: 'Herbe brume', emoji: '🌿', growMs: 60_000, hint: '~1 min' },

  'moon-wheat': { label: 'Ble lunaire', emoji: '🌾', growMs: 180_000, hint: '~3 min' },

  'star-berry': { label: 'Baie etoile', emoji: '🫐', growMs: 480_000, hint: '~8 min' },

}



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

    biomeId: pet.biomeId ?? 'moon-meadow',

    hunger: pet.hunger ?? 70,

    joy: pet.joy ?? 75,

    lastVisit: pet.lastVisit ?? Date.now(),

  }

}



export function createStarterMinigameSave(): MinigameSave {

  const now = Date.now()

  return {

    farmPlots: [null, null, null, null, null, null],

    pets: [

      normalizePet({

        id: 'starter-moon-sprout',

        speciesId: 'moon-sprout',

        name: 'Pousselune',

        emoji: '🌱',

        rarity: 'N',

        biomeId: 'moon-meadow',

        hunger: 82,

        joy: 78,

        lastVisit: now,

      }),

      normalizePet({

        id: 'starter-moon-hop',

        speciesId: 'moon-hop',

        name: 'Sautelune',

        emoji: '🐰',

        rarity: 'R',

        biomeId: 'moon-meadow',

        hunger: 74,

        joy: 86,

        lastVisit: now,

      }),

      normalizePet({

        id: 'starter-mist-wisp',

        speciesId: 'mist-wisp',

        name: 'Brumeux',

        emoji: '💧',

        rarity: 'N',

        biomeId: 'mist-forest',

        hunger: 68,

        joy: 72,

        lastVisit: now,

      }),

    ],

    captureStats: { totalCaught: 0, bestRarity: null },

  }

}



export function mergeMinigameSave(partial?: Partial<MinigameSave>): MinigameSave {

  const starter = createStarterMinigameSave()

  return {

    farmPlots: partial?.farmPlots ?? starter.farmPlots,

    pets: (partial?.pets ?? starter.pets).map((pet) => normalizePet(pet)),

    captureStats: partial?.captureStats ?? starter.captureStats,

  }

}



export function refreshPetsOnVisit(pets: PetState[], now = Date.now()): PetState[] {

  return pets.map((pet) => {

    const hoursAway = Math.max(0, (now - pet.lastVisit) / 3_600_000)

    const hungerDrop = Math.min(30, hoursAway * 4)

    const joyDrop = Math.min(25, hoursAway * 3)

    return {

      ...pet,

      hunger: Math.max(25, pet.hunger - hungerDrop),

      joy: Math.max(25, pet.joy - joyDrop),

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

  return { totalCaught: current.totalCaught + 1, bestRarity }

}


