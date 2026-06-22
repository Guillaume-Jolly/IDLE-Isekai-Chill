import type { RefugeBiomeId } from './myrionRefuge'
import type { EchoEgg, PetState, RefugeResourceState } from './minigameSave'
import { createHuntFavor, type HuntFavor } from './myrionMvp2'
import { applyEggCare } from './myrionMvp3'

export type CraftRecipeId = 'hint-favor' | 'comfort-treat' | 'echo-warmth'

export type CraftRecipe = {
  id: CraftRecipeId
  name: string
  emoji: string
  description: string
  biomeId: RefugeBiomeId
  cost: number
}

export const REFUGE_CRAFT_RECIPES: CraftRecipe[] = [
  {
    id: 'hint-favor',
    name: 'Indice du refuge',
    emoji: '🔍',
    description: 'Ajoute une Faveur d’indice (niv. 1) à la file de chasse.',
    biomeId: 'foret-ancienne',
    cost: 8,
  },
  {
    id: 'comfort-treat',
    name: 'Friandise réconfort',
    emoji: '🍯',
    description: 'Restaure la faim et l’humeur du Myrion actif (+18 / +12).',
    biomeId: 'prairie-solaire',
    cost: 4,
  },
  {
    id: 'echo-warmth',
    name: 'Chaleur d’incubation',
    emoji: '🔥',
    description: 'Réchauffe le premier œuf en incubation (une fois).',
    biomeId: 'volcan-noir',
    cost: 12,
  },
]

export type CraftResult =
  | {
      ok: true
      message: string
      resources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
      pets?: PetState[]
      huntFavors?: HuntFavor[]
      echoEggs?: EchoEgg[]
    }
  | { ok: false; reason: string }

export function canAffordCraft(
  resources: Partial<Record<RefugeBiomeId, RefugeResourceState>>,
  recipe: CraftRecipe,
): boolean {
  return (resources[recipe.biomeId]?.amount ?? 0) >= recipe.cost
}

export function applyCraftRecipe(
  recipe: CraftRecipe,
  context: {
    resources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
    pets: PetState[]
    huntFavors: HuntFavor[]
    echoEggs: EchoEgg[]
    activePetId?: string
  },
): CraftResult {
  if (!canAffordCraft(context.resources, recipe)) {
    return { ok: false, reason: 'Ressources insuffisantes pour ce craft.' }
  }

  const nextResources = { ...context.resources }
  const state = nextResources[recipe.biomeId] ?? { amount: 0, lastTickAt: Date.now() }
  nextResources[recipe.biomeId] = {
    ...state,
    amount: Math.round((state.amount - recipe.cost) * 10) / 10,
  }

  switch (recipe.id) {
    case 'hint-favor': {
      const favor = createHuntFavor('hint', 1)
      return {
        ok: true,
        message: `${recipe.emoji} ${recipe.name} fabriqué — Faveur d’indice ajoutée.`,
        resources: nextResources,
        huntFavors: [...context.huntFavors, favor],
      }
    }
    case 'comfort-treat': {
      const activePet = context.pets.find((pet) => pet.id === context.activePetId)
      if (!activePet) {
        return { ok: false, reason: 'Sélectionne un Myrion avant de fabriquer cette friandise.' }
      }
      const pets = context.pets.map((pet) =>
        pet.id === activePet.id
          ? {
              ...pet,
              hunger: Math.min(100, pet.hunger + 18),
              joy: Math.min(100, pet.joy + 12),
            }
          : pet,
      )
      return {
        ok: true,
        message: `${activePet.name} savoure la friandise.`,
        resources: nextResources,
        pets,
      }
    }
    case 'echo-warmth': {
      const egg = context.echoEggs[0]
      if (!egg) {
        return { ok: false, reason: 'Aucun œuf en incubation.' }
      }
      if (egg.careActions.includes('warm')) {
        return { ok: false, reason: 'Cet œuf a déjà été réchauffé.' }
      }
      const echoEggs = context.echoEggs.map((entry, index) =>
        index === 0 ? applyEggCare(entry, 'warm') : entry,
      )
      return {
        ok: true,
        message: 'L’œuf vibre doucement sous la chaleur craftée.',
        resources: nextResources,
        echoEggs,
      }
    }
    default:
      return { ok: false, reason: 'Recette inconnue.' }
  }
}
