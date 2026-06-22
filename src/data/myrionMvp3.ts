import type { RefugeBiomeId } from './myrionRefuge'
import { normalizeRefugeBiomeId } from './myrionRefuge'
import type { EchoEgg, PetState } from './minigameSave'
import {
  PERSONALITIES,
  RARE_TRAITS,
  createHuntFavor,
  rollAffinityTags,
  type SupportBuff,
} from './myrionMvp2'
import { PALMON_SPECIES, type PalmonRarity, type PalmonSpecies } from './wildFamiliars'
import { rollVisualVariant } from './myrionVariants'

export const INCUBATOR_SLOTS = 2
export const BREED_RESOURCE_COST = 5
export const BREED_COOLDOWN_MS = 86_400_000
export const MIN_BREED_AFFECTION = 3
export const MIN_BREED_ENERGY = 25

export const HATCH_MS: Record<PalmonRarity, number> = {
  N: 30 * 60_000,
  R: 60 * 60_000,
  SR: 2 * 3_600_000,
  SSR: 8 * 3_600_000,
  UR: 24 * 3_600_000,
  LR: 48 * 3_600_000,
}

type Compatibility = 'strong' | 'normal' | 'unstable' | 'blocked'

const STRONG_PAIRS = new Set([
  pairKey('prairie-solaire', 'foret-ancienne'),
  pairKey('foret-ancienne', 'marais-brumeux'),
  pairKey('marais-brumeux', 'rivage-corallien'),
  pairKey('desert-rouge', 'volcan-noir'),
  pairKey('montagnes-cristallines', 'ruines-astrales'),
  pairKey('prairie-solaire', 'rivage-corallien'),
  pairKey('desert-rouge', 'prairie-solaire'),
])

const UNSTABLE_PAIRS = new Set([
  pairKey('volcan-noir', 'rivage-corallien'),
  pairKey('volcan-noir', 'marais-brumeux'),
  pairKey('montagnes-cristallines', 'volcan-noir'),
  pairKey('ruines-astrales', 'marais-brumeux'),
  pairKey('desert-rouge', 'rivage-corallien'),
])

function pairKey(a: string, b: string) {
  return [a, b].sort().join('|')
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export function getBreedingCompatibility(parentA: PetState, parentB: PetState): Compatibility {
  if (parentA.id === parentB.id) return 'blocked'
  if (parentA.rarity === 'LR' || parentB.rarity === 'LR') return 'blocked'
  const biomeA = normalizeRefugeBiomeId(parentA.biomeId)
  const biomeB = normalizeRefugeBiomeId(parentB.biomeId)
  const key = pairKey(biomeA, biomeB)
  if (STRONG_PAIRS.has(key)) return 'strong'
  if (UNSTABLE_PAIRS.has(key)) return 'unstable'
  return 'normal'
}

export function breedingCompatibilityLabel(compatibility: Compatibility) {
  switch (compatibility) {
    case 'strong':
      return 'Harmonie forte'
    case 'unstable':
      return 'Lignée instable'
    case 'blocked':
      return 'Incompatible'
    default:
      return 'Compatibilité normale'
  }
}

export type BreedEligibility = {
  ok: boolean
  reason?: string
}

export function canStartBreeding(
  parentA: PetState,
  parentB: PetState,
  eggs: EchoEgg[],
  resourceAmount: number,
  now = Date.now(),
): BreedEligibility {
  const compatibility = getBreedingCompatibility(parentA, parentB)
  if (compatibility === 'blocked') return { ok: false, reason: 'Ces Myrions ne peuvent pas se reproduire.' }
  if (eggs.length >= INCUBATOR_SLOTS) return { ok: false, reason: 'Incubateur plein.' }
  if (resourceAmount < BREED_RESOURCE_COST) return { ok: false, reason: 'Ressources de biome insuffisantes.' }
  if (parentA.affectionLevel < MIN_BREED_AFFECTION || parentB.affectionLevel < MIN_BREED_AFFECTION) {
    return { ok: false, reason: 'Affection ≥ 3 requise pour les deux parents.' }
  }
  if (parentA.energy < MIN_BREED_ENERGY || parentB.energy < MIN_BREED_ENERGY) {
    return { ok: false, reason: 'Énergie insuffisante.' }
  }
  if ((parentA.breedCooldownUntil ?? 0) > now || (parentB.breedCooldownUntil ?? 0) > now) {
    return { ok: false, reason: 'Un parent est en repos reproductif.' }
  }
  return { ok: true }
}

function rarityRank(rarity: PalmonRarity) {
  return { N: 0, R: 1, SR: 2, SSR: 3, UR: 4, LR: 5 }[rarity]
}

function rollBreedingRarity(parentA: PetState, parentB: PetState, compatibility: Compatibility): PalmonRarity {
  const a = parentA.rarity
  const b = parentB.rarity
  const low = rarityRank(a) <= rarityRank(b) ? a : b
  const high = low === a ? b : a
  const roll = Math.random() * 100

  const tableKey = `${low}+${high}`
  const tables: Record<string, Array<[PalmonRarity, number]>> = {
    'N+N': [
      ['N', 95],
      ['SR', 5],
    ],
    'N+R': [
      ['N', 80],
      ['R', 20],
    ],
    'N+SR': [
      ['N', 70],
      ['SR', 30],
    ],
    'R+R': [
      ['R', 75],
      ['SR', 20],
      ['SSR', 5],
    ],
    'R+SR': [
      ['R', 45],
      ['SR', 50],
      ['SSR', 5],
    ],
    'SR+SR': [
      ['SR', 85],
      ['SSR', 15],
    ],
    'SR+SSR': [
      ['SR', 55],
      ['SSR', 43],
      ['UR', 2],
    ],
    'SSR+SSR': [
      ['SSR', 80],
      ['UR', 20],
    ],
    'SSR+UR': [
      ['SSR', 45],
      ['UR', 53],
      ['LR', 2],
    ],
    'UR+UR': [
      ['UR', 95],
      ['LR', 5],
    ],
  }

  let entries = tables[tableKey]
  if (!entries) {
    entries = [
      [low, 70],
      [high, 30],
    ]
  }

  if (compatibility === 'unstable' && Math.random() < 0.12) {
    const bump = entries[entries.length - 1][0]
    return bump
  }

  let cumulative = 0
  for (const [rarity, weight] of entries) {
    cumulative += weight
    if (roll <= cumulative) return rarity
  }
  return entries[entries.length - 1][0]
}

function pickHatchSpecies(parentA: PetState, parentB: PetState, rarity: PalmonRarity): PalmonSpecies {
  const biomeId = normalizeRefugeBiomeId(parentA.biomeId)
  const parentIds = [parentA.speciesId, parentB.speciesId]
  const inBiome = PALMON_SPECIES.filter((species) => species.biomeId === biomeId && species.rarity === rarity)
  const fromParents = inBiome.filter((species) => parentIds.includes(species.id))
  if (fromParents.length > 0) return pick(fromParents)
  if (inBiome.length > 0) return pick(inBiome)
  const fallback = PALMON_SPECIES.find((species) => parentIds.includes(species.id))
  if (fallback) return fallback
  return PALMON_SPECIES.find((species) => species.biomeId === biomeId) ?? PALMON_SPECIES[0]
}

function inheritTraits(parentA: PetState, parentB: PetState, compatibility: Compatibility): string[] {
  const traits = new Set<string>()
  for (const trait of parentA.traits ?? []) traits.add(trait)
  for (const trait of parentB.traits ?? []) traits.add(trait)
  if (compatibility === 'unstable' && Math.random() < 0.25) traits.add(pick(['chanceux', 'pisteur', 'recolteur']))
  if (traits.size > 3) {
    return [...traits].slice(0, 3)
  }
  return [...traits]
}

function inheritSupportBuffs(
  parentA: PetState,
  parentB: PetState,
  rarity: PalmonRarity,
  generation: number,
  lineagePotential: number,
): SupportBuff[] {
  const merged = new Map<string, SupportBuff>()
  for (const buff of [...(parentA.supportBuffs ?? []), ...(parentB.supportBuffs ?? [])]) {
    const existing = merged.get(buff.stat)
    if (!existing || buff.value > existing.value) {
      merged.set(buff.stat, { ...buff })
    }
  }

  const generationBoost = 1 + generation * 0.04 + lineagePotential / 500
  const rarityBoost = { N: 1, R: 1.05, SR: 1.1, SSR: 1.18, UR: 1.28, LR: 1.4 }[rarity]

  return [...merged.values()].map((buff) => ({
    stat: buff.stat,
    value: Math.round(buff.value * generationBoost * rarityBoost * 10) / 10,
  }))
}

function computeLineagePotential(parentA: PetState, parentB: PetState, compatibility: Compatibility) {
  const base = ((parentA.lineagePotential ?? 40) + (parentB.lineagePotential ?? 40)) / 2
  const bonus = compatibility === 'strong' ? 8 : compatibility === 'unstable' ? 4 : 5
  return Math.min(99, Math.round(base / 2 + bonus + rand(0, 6)))
}

function rollEggShiny(parentA: PetState, parentB: PetState, egg: EchoEgg): boolean {
  let chance = 0.0002
  if (parentA.isShiny) chance = 0.001
  if (parentB.isShiny) chance = parentA.isShiny ? 0.005 : 0.001
  if (egg.careActions.includes('moon')) chance += 0.0005
  if (egg.careActions.includes('warm')) chance += 0.0002
  if (egg.careActions.includes('soothe')) chance += 0.0002
  return Math.random() < Math.min(chance, 0.01)
}

export function createEchoEgg(
  parentA: PetState,
  parentB: PetState,
  now = Date.now(),
): EchoEgg {
  const rawCompatibility = getBreedingCompatibility(parentA, parentB)
  if (rawCompatibility === 'blocked') {
    throw new Error('createEchoEgg requires breedable parents')
  }
  const compatibility = rawCompatibility
  const expectedRarity = rollBreedingRarity(parentA, parentB, compatibility)
  const generation = Math.max(parentA.generation ?? 0, parentB.generation ?? 0) + 1
  const lineagePotential = computeLineagePotential(parentA, parentB, compatibility)
  const species = pickHatchSpecies(parentA, parentB, expectedRarity)
  const traits = inheritTraits(parentA, parentB, compatibility)
  const supportBuffs = inheritSupportBuffs(parentA, parentB, expectedRarity, generation, lineagePotential)

  return {
    id: `egg-${now}-${Math.random().toString(36).slice(2, 7)}`,
    parentAId: parentA.id,
    parentBId: parentB.id,
    speciesId: species.id,
    speciesName: species.name,
    speciesEmoji: species.emoji,
    expectedRarity,
    biomeId: normalizeRefugeBiomeId(species.biomeId),
    generation,
    lineagePotential,
    traits,
    supportBuffs,
    compatibility,
    startedAt: now,
    hatchMs: HATCH_MS[expectedRarity],
    careActions: [],
    stability: compatibility === 'unstable' ? 45 : compatibility === 'strong' ? 85 : 70,
  }
}

export function applyEggCare(egg: EchoEgg, action: EchoEgg['careActions'][number]): EchoEgg {
  if (egg.careActions.includes(action)) return egg
  return {
    ...egg,
    careActions: [...egg.careActions, action],
    lineagePotential: Math.min(99, egg.lineagePotential + (action === 'moon' ? 3 : 2)),
    stability: Math.min(100, egg.stability + 4),
  }
}

export function eggProgress(egg: EchoEgg, now = Date.now()) {
  const elapsed = Math.max(0, now - egg.startedAt)
  return Math.min(1, elapsed / egg.hatchMs)
}

export function isEggReady(egg: EchoEgg, now = Date.now()) {
  return eggProgress(egg, now) >= 1
}

export function formatEggRemaining(egg: EchoEgg, now = Date.now()) {
  const remaining = Math.max(0, egg.hatchMs - (now - egg.startedAt))
  const minutes = Math.ceil(remaining / 60_000)
  if (minutes >= 120) return `${Math.ceil(minutes / 60)} h`
  return `${minutes} min`
}

export function hatchEchoEgg(
  egg: EchoEgg,
  parentA: PetState,
  parentB: PetState,
  now = Date.now(),
): { pet: PetState; favor?: ReturnType<typeof createHuntFavor>; lrBlessing: boolean } {
  const species =
    PALMON_SPECIES.find((entry) => entry.id === egg.speciesId) ??
    pickHatchSpecies(parentA, parentB, egg.expectedRarity)
  const isShiny = rollEggShiny(parentA, parentB, egg)
  const lrBlessing =
    egg.expectedRarity === 'UR' &&
    parentA.rarity === 'UR' &&
    parentB.rarity === 'UR' &&
    egg.generation >= 2 &&
    egg.lineagePotential >= 88 &&
    Math.random() < 0.08

  const pet: PetState = {
    id: `bred-${species.id}-${now}`,
    speciesId: species.id,
    name: species.name,
    emoji: species.emoji,
    rarity: egg.expectedRarity,
    biomeId: egg.biomeId,
    hunger: 78,
    joy: 82,
    energy: 76,
    affectionLevel: 1,
    lastVisit: now,
    isShiny,
    visualVariant: isShiny
      ? undefined
      : parentA.visualVariant ?? parentB.visualVariant ?? rollVisualVariant(false),
    personality: pick(PERSONALITIES),
    traits: egg.traits,
    lineagePotential: egg.lineagePotential,
    supportBuffs: egg.supportBuffs,
    affinityTags: rollAffinityTags(egg.biomeId, egg.traits),
    generation: egg.generation,
    parentIds: [parentA.id, parentB.id],
    lrBlessing,
  }

  const favor =
    egg.expectedRarity === 'SSR' || isShiny
      ? createHuntFavor(isShiny ? 'shiny' : 'rarity', isShiny ? 2 : 1)
      : undefined

  return { pet, favor, lrBlessing }
}

export function applyBreedingCooldown(parent: PetState, now = Date.now()): PetState {
  return {
    ...parent,
    energy: Math.max(20, parent.energy - 18),
    breedCooldownUntil: now + BREED_COOLDOWN_MS,
  }
}

export function breedablePets(pets: PetState[], now = Date.now()) {
  return pets.filter(
    (pet) =>
      pet.rarity !== 'LR' &&
      pet.affectionLevel >= MIN_BREED_AFFECTION &&
      (pet.breedCooldownUntil ?? 0) <= now,
  )
}

export function breedingResourceBiome(parentA: PetState, parentB: PetState): RefugeBiomeId {
  void parentB
  return normalizeRefugeBiomeId(parentA.biomeId)
}

export function hasRareTrait(traits: string[]) {
  return traits.some((trait) => RARE_TRAITS.has(trait))
}
