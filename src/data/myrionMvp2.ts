import type { RefugeBiomeId } from './myrionRefuge'
import { MAX_SPECIES_COPIES, normalizeRefugeBiomeId, speciesCopyCount } from './myrionRefuge'
import type { PetState } from './minigameSave'
import type { PalmonRarity, PalmonSpecies } from './wildFamiliars'
import { formatVisualVariant, rollVisualVariant } from './myrionVariants'

export type SupportStat =
  | 'power'
  | 'resistance'
  | 'speed'
  | 'healing'
  | 'luck'
  | 'capture'
  | 'production'
  | 'craft'
  | 'construction'

export type SupportBuff = {
  stat: SupportStat
  value: number
}

export type HuntFavorCategory =
  | 'biome_appearance'
  | 'species_appearance'
  | 'capture'
  | 'anti_flee'
  | 'hint'
  | 'rarity'
  | 'shiny'

export type HuntFavor = {
  id: string
  name: string
  category: HuntFavorCategory
  level: 1 | 2 | 3 | 4 | 5
  value: number
  remainingEncounters: number
  obtainedAt: number
  sourceMyrionId?: string
  targetBiomeId?: string
  targetSpeciesId?: string
}

export type HuntSearchObjective = {
  id: string
  type:
    | 'species'
    | 'biome'
    | 'support_stat'
    | 'trait'
    | 'companion_affinity'
    | 'lineage_potential'
    | 'shiny'
    | 'variant'
  label: string
  targetSpeciesId?: string
  targetBiome?: RefugeBiomeId
  targetStat?: SupportStat
  targetTrait?: string
  targetCompanionId?: string
  minValue?: number
}

export type CaptureVerdict =
  | 'shiny'
  | 'rare_trait'
  | 'new_record'
  | 'objective_hit'
  | 'interesting'
  | 'common_duplicate'

export type ObjectiveCheckResult = {
  objectiveId: string
  label: string
  status: 'hit' | 'partial' | 'miss'
}

export type CaptureCompareResult = {
  verdict: CaptureVerdict
  headline: string
  details: string[]
  objectiveResults: ObjectiveCheckResult[]
  weakestDuplicate?: PetState
  beatsWeakest: boolean
  recommendRelease: boolean
  protectFromAutoRelease: boolean
  overflowRequired: boolean
  speciesCopyCount: number
}

export type HuntAutoDecisionMode =
  | 'keep_all'
  | 'release_all'
  | 'replace_stronger'
  | 'defer_sort'

export type HuntAutoDecisionSettings = {
  mode?: HuntAutoDecisionMode
  /** @deprecated Anciennes options — migrées vers `mode`. */
  autoKeepIfRoom?: boolean
  autoReleaseIfObjectivesMiss?: boolean
  autoReleaseWithoutObjectivesConfirmed?: boolean
}

export const DEFAULT_HUNT_AUTO_DECISION: HuntAutoDecisionSettings = {
  mode: 'keep_all',
}

export const HUNT_CAPTURE_POLICY_OPTIONS: Array<{
  mode: HuntAutoDecisionMode
  label: string
  description: string
}> = [
  {
    mode: 'keep_all',
    label: 'Tout garder par la suite',
    description: 'Ajoute chaque capture au refuge si une place est disponible (< 11 exemplaires par espèce).',
  },
  {
    mode: 'release_all',
    label: 'Tout relâcher par la suite',
    description: 'Relâche automatiquement les captures communes. Shiny, variantes et objectifs atteints restent en confirmation manuelle.',
  },
  {
    mode: 'replace_stronger',
    label: 'Remplacer uniquement les plus forts',
    description: 'Garde les nouveaux spécimens plus puissants et remplace le plus faible en cas de stock plein.',
  },
  {
    mode: 'defer_sort',
    label: 'Trier plus tard',
    description:
      'Met les captures en attente : aucun point ni ajout au refuge tant que tu ne les as pas triées.',
  },
]

export function normalizeHuntAutoDecision(
  settings?: HuntAutoDecisionSettings,
): { mode: HuntAutoDecisionMode } {
  if (settings?.mode) return { mode: settings.mode }
  if (settings?.autoKeepIfRoom) return { mode: 'keep_all' }
  if (settings?.autoReleaseIfObjectivesMiss) return { mode: 'release_all' }
  return { mode: DEFAULT_HUNT_AUTO_DECISION.mode ?? 'keep_all' }
}

export function searchObjectivesMet(comparison: CaptureCompareResult): boolean {
  if (comparison.objectiveResults.length === 0) return false
  return comparison.objectiveResults.some((result) => result.status === 'hit')
}

export type AutoCaptureDecision = 'keep' | 'release' | 'replace' | 'defer' | 'manual'

export function resolveAutoCaptureDecision(
  comparison: CaptureCompareResult,
  _objectives: HuntSearchObjective[],
  settings: HuntAutoDecisionSettings,
): AutoCaptureDecision {
  const { mode } = normalizeHuntAutoDecision(settings)

  if (mode === 'defer_sort') {
    return 'defer'
  }

  if (mode === 'keep_all') {
    if (comparison.overflowRequired) return 'manual'
    return 'keep'
  }

  if (mode === 'release_all') {
    if (comparison.protectFromAutoRelease) return 'manual'
    return 'release'
  }

  if (mode === 'replace_stronger') {
    if (comparison.overflowRequired) {
      if (comparison.protectFromAutoRelease) return 'manual'
      return comparison.beatsWeakest ? 'replace' : 'release'
    }
    return 'keep'
  }

  return 'manual'
}

export type HuntFavorModifiers = {
  captureBonus: number
  antiFleeBonus: number
  rarityBonus: number
  shinyBonus: number
  biomeBonus: number
  speciesBonus: number
  hintBonus: number
}

export const SHINY_WILD_CHANCE = 0.0001
export const MAX_SEARCH_OBJECTIVES = 3
export const MAX_ACTIVE_HUNT_FAVORS = 3

export const FAVOR_LEVEL_ENCOUNTERS: Record<HuntFavor['level'], number> = {
  1: 10,
  2: 20,
  3: 30,
  4: 40,
  5: 50,
}

export const RELEASE_BIOME_FAVOR: Record<PalmonRarity, number> = {
  N: 0.01,
  R: 0.015,
  SR: 0.03,
  SSR: 0.08,
  UR: 0.2,
  LR: 0.5,
}

export const TRAIT_LABELS: Record<string, string> = {
  curieux: 'Curieux',
  joueur: 'Joueur',
  calme: 'Calme',
  gourmand: 'Gourmand',
  sociable: 'Sociable',
  recolteur: 'Récolteur',
  pisteur: 'Pisteur',
  apaisant: 'Apaisant',
  artisan: 'Artisan',
  chanceux: 'Chanceux',
}

export const RARE_TRAITS = new Set(['chanceux', 'apaisant', 'recolteur', 'pisteur'])

export const COMMON_TRAITS = ['curieux', 'joueur', 'calme', 'gourmand', 'sociable']

export const UTILITY_TRAITS = ['recolteur', 'pisteur', 'apaisant', 'artisan', 'chanceux']

export const PERSONALITIES = ['Curieux', 'Joueur', 'Calme', 'Gourmand', 'Timide', 'Fier']

export const SUPPORT_STAT_LABELS: Record<SupportStat, string> = {
  power: 'Puissance',
  resistance: 'Résistance',
  speed: 'Vitesse',
  healing: 'Soin',
  luck: 'Chance',
  capture: 'Capture',
  production: 'Production',
  craft: 'Craft',
  construction: 'Construction',
}

export const BIOME_AFFINITY_TAGS: Record<RefugeBiomeId, string> = {
  'prairie-solaire': 'prairie',
  'foret-ancienne': 'foret',
  'marais-brumeux': 'marais',
  'montagnes-cristallines': 'cristal',
  'desert-rouge': 'desert',
  'rivage-corallien': 'rivage',
  'volcan-noir': 'volcan',
  'ruines-astrales': 'astral',
  'disagrea-event': 'volcan',
}

export const COMPANION_PROFILES: Record<string, { name: string; tags: string[] }> = {
  talia: { name: 'Talia', tags: ['herboriste', 'soin', 'nature', 'prairie', 'foret', 'calme'] },
  sora: { name: 'Sora', tags: ['refuge', 'soin', 'nature', 'prairie', 'calme'] },
  nami: { name: 'Nami', tags: ['rivage', 'eau', 'exploration', 'calme'] },
  luna: { name: 'Luna', tags: ['astral', 'cristal', 'mystique', 'calme'] },
  mira: { name: 'Mira', tags: ['craft', 'artisan', 'montagne', 'cristal'] },
  solene: { name: 'Solene', tags: ['prairie', 'production', 'nature', 'joueur'] },
  lyra: { name: 'Lyra', tags: ['foret', 'exploration', 'curieux'] },
  kael: { name: 'Kael', tags: ['volcan', 'desert', 'power', 'fier'] },
  seren: { name: 'Seren', tags: ['soin', 'marais', 'calme', 'apaisant'] },
  runa: { name: 'Runa', tags: ['capture', 'pisteur', 'rivage', 'joueur'] },
  maeve: { name: 'Maeve', tags: ['marais', 'mystique', 'astral'] },
  zelie: { name: 'Zelie', tags: ['craft', 'artisan', 'production'] },
  asha: { name: 'Asha', tags: ['desert', 'volcan', 'exploration'] },
  elwen: { name: 'Elwen', tags: ['foret', 'nature', 'soin'] },
  noa: { name: 'Noa', tags: ['construction', 'artisan', 'prairie'] },
  iris: { name: 'Iris', tags: ['capture', 'luck', 'curieux'] },
}

export const OBJECTIVE_TEMPLATES: HuntSearchObjective[] = [
  {
    id: 'obj-shiny',
    type: 'shiny',
    label: 'Shiny ou variante rare',
  },
  {
    id: 'obj-variant',
    type: 'variant',
    label: 'Variante visuelle',
  },
  {
    id: 'obj-species-bourdilune',
    type: 'species',
    targetSpeciesId: 'bourdilune',
    label: 'Espèce Bourdilune',
  },
  {
    id: 'obj-capture-stat',
    type: 'support_stat',
    targetStat: 'capture',
    minValue: 4,
    label: 'Bonus Capture ≥ 4',
  },
  {
    id: 'obj-production-stat',
    type: 'support_stat',
    targetStat: 'production',
    minValue: 4,
    label: 'Bonus Production ≥ 4',
  },
  {
    id: 'obj-trait-pisteur',
    type: 'trait',
    targetTrait: 'pisteur',
    label: 'Trait Pisteur',
  },
  {
    id: 'obj-trait-recolteur',
    type: 'trait',
    targetTrait: 'recolteur',
    label: 'Trait Récolteur',
  },
  {
    id: 'obj-lineage-80',
    type: 'lineage_potential',
    minValue: 80,
    label: 'Potentiel de lignée ≥ 80',
  },
  {
    id: 'obj-prairie',
    type: 'biome',
    targetBiome: 'prairie-solaire',
    label: 'Myrion de la Prairie solaire',
  },
  {
    id: 'obj-foret',
    type: 'biome',
    targetBiome: 'foret-ancienne',
    label: 'Myrion de la Forêt ancienne',
  },
  {
    id: 'obj-talia',
    type: 'companion_affinity',
    targetCompanionId: 'talia',
    label: 'Affinité Talia (≥ 2 tags)',
  },
  {
    id: 'obj-sora',
    type: 'companion_affinity',
    targetCompanionId: 'sora',
    label: 'Affinité Sora (≥ 2 tags)',
  },
]

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)]

function rollTraitPool(): string {
  if (Math.random() < 0.22) return pick(UTILITY_TRAITS)
  return pick(COMMON_TRAITS)
}

function buffSlotsForRarity(rarity: PalmonRarity): number {
  if (rarity === 'N') return Math.random() < 0.15 ? 2 : 1
  if (rarity === 'R' || rarity === 'SR') return 2
  if (rarity === 'SSR') return Math.random() < 0.2 ? 3 : 2
  return 3
}

function buffValueForRarity(rarity: PalmonRarity): number {
  const ranges: Record<PalmonRarity, [number, number]> = {
    N: [1, 3],
    R: [2, 4],
    SR: [3, 5],
    SSR: [4, 7],
    UR: [5, 9],
    LR: [7, 12],
  }
  const [min, max] = ranges[rarity]
  return Math.round(rand(min, max) * 10) / 10
}

/** Slots de buff actifs selon rareté et traits (checklist §11). */
export function maxSupportBuffSlots(pet: PetState): number {
  const traits = pet.traits ?? []
  const hasDoubleDon = traits.includes('double_don')
  const rarity = pet.rarity

  if (rarity === 'LR') return Math.max(1, pet.supportBuffs?.length ?? 1)
  if (rarity === 'N') return hasDoubleDon ? 2 : 1
  if (rarity === 'R' || rarity === 'SR') return hasDoubleDon ? 3 : 2
  if (rarity === 'SSR') {
    const rareTrait = traits.some((trait) => trait === 'lignee_pure' || trait === 'double_don')
    if (hasDoubleDon || rareTrait) return 3
    return 2
  }
  if (rarity === 'UR') return 3
  return 1
}

export function effectiveSupportBuffs(pet: PetState): SupportBuff[] {
  return (pet.supportBuffs ?? []).slice(0, maxSupportBuffSlots(pet))
}

const ALL_STATS: SupportStat[] = [
  'capture',
  'production',
  'luck',
  'healing',
  'craft',
  'construction',
  'power',
  'speed',
]

export function rollSupportBuffs(rarity: PalmonRarity, traits: string[]): SupportBuff[] {
  const stats = [...ALL_STATS]
  const buffs: SupportBuff[] = []
  const slots = buffSlotsForRarity(rarity)

  if (traits.includes('recolteur')) stats.unshift('production')
  if (traits.includes('pisteur')) stats.unshift('capture')
  if (traits.includes('artisan')) stats.unshift('craft')
  if (traits.includes('apaisant')) stats.unshift('healing')
  if (traits.includes('chanceux')) stats.unshift('luck')

  for (let index = 0; index < slots; index += 1) {
    const stat = stats[index % stats.length]
    buffs.push({ stat, value: buffValueForRarity(rarity) })
  }

  return buffs
}

export function rollAffinityTags(biomeId: string, traits: string[]): string[] {
  const biome = normalizeRefugeBiomeId(biomeId)
  const biomeTag = BIOME_AFFINITY_TAGS[biome]
  const tags = new Set<string>(['nature'])
  if (biomeTag) tags.add(biomeTag)
  if (traits.includes('joueur')) tags.add('joueur')
  if (traits.includes('calme') || traits.includes('apaisant')) tags.add('calme')
  if (traits.includes('curieux') || traits.includes('pisteur')) tags.add('curieux')
  if (traits.includes('artisan')) tags.add('artisan')
  if (traits.includes('recolteur')) tags.add('production')
  return [...tags]
}

export function rollTraits(): string[] {
  const traits = new Set<string>([rollTraitPool()])
  if (Math.random() < 0.18) traits.add(rollTraitPool())
  return [...traits]
}

export function rollLineagePotential(rarity: PalmonRarity): number {
  const base: Record<PalmonRarity, [number, number]> = {
    N: [20, 55],
    R: [30, 62],
    SR: [40, 72],
    SSR: [55, 85],
    UR: [70, 92],
    LR: [85, 99],
  }
  const [min, max] = base[rarity]
  return Math.round(rand(min, max))
}

export function rollShiny(favorBonus = 0): boolean {
  return Math.random() < SHINY_WILD_CHANCE + favorBonus
}

export function createCapturedMyrion(
  palmon: PalmonSpecies,
  instanceId: string,
  now = Date.now(),
  options?: { shinyBonus?: number },
): PetState {
  const traits = rollTraits()
  const isShiny = rollShiny(options?.shinyBonus ?? 0)
  const visualVariant = rollVisualVariant(isShiny)
  return {
    id: instanceId,
    speciesId: palmon.id,
    name: palmon.name,
    emoji: palmon.emoji,
    rarity: palmon.rarity,
    biomeId: palmon.biomeId,
    hunger: 72,
    joy: 78,
    energy: 80,
    affectionLevel: 1,
    lastVisit: now,
    isShiny,
    visualVariant,
    personality: pick(PERSONALITIES),
    traits,
    lineagePotential: rollLineagePotential(palmon.rarity),
    supportBuffs: rollSupportBuffs(palmon.rarity, traits),
    affinityTags: rollAffinityTags(palmon.biomeId, traits),
    generation: 0,
  }
}

export function countSharedTags(a: string[], b: string[]): number {
  const normalizedA = a.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
  const normalizedB = b.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
  const setB = new Set(normalizedB.map((tag) => tag.toLowerCase()))
  return normalizedA.filter((tag) => setB.has(tag.toLowerCase())).length
}

export function companionAffinityMultiplier(companionId: string, pet: PetState): number {
  const profile = COMPANION_PROFILES[companionId]
  if (!profile) return 1
  const shared = countSharedTags(pet.affinityTags ?? [], profile.tags)
  if (shared >= 4) return 1.4
  if (shared === 3) return 1.25
  if (shared === 2) return 1.1
  if (shared === 1) return 1
  return 0.75
}

export function affectionBuffMultiplier(affectionLevel: number): number {
  return 0.85 + affectionLevel * 0.05
}

export function computeCompanionBuffTotal(pet: PetState, companionId: string): number {
  const buffs = effectiveSupportBuffs(pet)
  if (buffs.length === 0) return 0
  const affinity = companionAffinityMultiplier(companionId, pet)
  const affection = affectionBuffMultiplier(pet.affectionLevel)
  const lineage = 0.9 + (pet.lineagePotential ?? 50) / 200
  return buffs.reduce((sum, buff) => sum + buff.value * affinity * affection * lineage, 0)
}

export function petPowerScore(pet: PetState): number {
  const buffTotal = (pet.supportBuffs ?? []).reduce((sum, buff) => sum + buff.value, 0)
  const traitBonus = (pet.traits ?? []).filter((trait) => RARE_TRAITS.has(trait)).length * 3
  const shinyBonus = pet.isShiny ? 12 : 0
  const variantBonus = pet.visualVariant ? 5 : 0
  return buffTotal + traitBonus + shinyBonus + variantBonus + (pet.lineagePotential ?? 0) * 0.08 + pet.affectionLevel
}

export function findWeakestDuplicate(pets: PetState[], speciesId: string, excludeId: string): PetState | undefined {
  const siblings = pets.filter((pet) => pet.speciesId === speciesId && pet.id !== excludeId)
  if (siblings.length === 0) return undefined
  return siblings.reduce((weakest, pet) => (petPowerScore(pet) < petPowerScore(weakest) ? pet : weakest))
}

function checkObjective(objective: HuntSearchObjective, pet: PetState): ObjectiveCheckResult['status'] {
  switch (objective.type) {
    case 'shiny':
      return pet.isShiny ? 'hit' : 'miss'
    case 'variant':
      return pet.visualVariant ? 'hit' : 'miss'
    case 'species':
      return pet.speciesId === objective.targetSpeciesId ? 'hit' : 'miss'
    case 'biome':
      return normalizeRefugeBiomeId(pet.biomeId) === objective.targetBiome ? 'hit' : 'miss'
    case 'support_stat': {
      const buff = (pet.supportBuffs ?? []).find((entry) => entry.stat === objective.targetStat)
      if (!buff) return 'miss'
      const min = objective.minValue ?? 1
      if (buff.value >= min) return 'hit'
      if (buff.value >= min * 0.6) return 'partial'
      return 'miss'
    }
    case 'trait':
      return (pet.traits ?? []).includes(objective.targetTrait ?? '') ? 'hit' : 'miss'
    case 'lineage_potential': {
      const min = objective.minValue ?? 80
      const value = pet.lineagePotential ?? 0
      if (value >= min) return 'hit'
      if (value >= min - 15) return 'partial'
      return 'miss'
    }
    case 'companion_affinity': {
      if (!objective.targetCompanionId) return 'miss'
      const shared = countSharedTags(pet.affinityTags ?? [], COMPANION_PROFILES[objective.targetCompanionId]?.tags ?? [])
      if (shared >= 2) return 'hit'
      if (shared === 1) return 'partial'
      return 'miss'
    }
    default:
      return 'miss'
  }
}

export function evaluateSearchObjectives(
  pet: PetState,
  objectives: HuntSearchObjective[],
): ObjectiveCheckResult[] {
  return objectives.map((objective) => ({
    objectiveId: objective.id,
    label: objective.label,
    status: checkObjective(objective, pet),
  }))
}

export function compareCapturedMyrion(
  pet: PetState,
  pets: PetState[],
  objectives: HuntSearchObjective[],
): CaptureCompareResult {
  const objectiveResults = evaluateSearchObjectives(pet, objectives)
  const objectiveHit = objectiveResults.some((result) => result.status === 'hit')
  const rareTrait = (pet.traits ?? []).some((trait) => RARE_TRAITS.has(trait))
  const hasVariant = Boolean(pet.visualVariant)
  const weakestDuplicate = findWeakestDuplicate(pets, pet.speciesId, pet.id)
  const beatsWeakest =
    weakestDuplicate !== undefined && petPowerScore(pet) > petPowerScore(weakestDuplicate)
  const copies = speciesCopyCount(pets, pet.speciesId)

  const usefulAffinity = Object.keys(COMPANION_PROFILES).some((companionId) => {
    const profile = COMPANION_PROFILES[companionId]
    return countSharedTags(pet.affinityTags ?? [], profile.tags) >= 2
  })
  const bestBuff = Math.max(0, ...(pet.supportBuffs ?? []).map((buff) => buff.value))
  const weakestBestBuff = weakestDuplicate
    ? Math.max(0, ...(weakestDuplicate.supportBuffs ?? []).map((buff) => buff.value))
    : 0
  const betterBuff = weakestDuplicate !== undefined && bestBuff > weakestBestBuff

  const details: string[] = []
  if (pet.isShiny) details.push('Shiny détecté — ne jamais relâcher automatiquement.')
  if (hasVariant) {
    details.push(`Variante ${formatVisualVariant(pet.visualVariant)} détectée — conserver si possible.`)
  }
  if (rareTrait) details.push(`Traits rares : ${(pet.traits ?? []).filter((t) => RARE_TRAITS.has(t)).map((t) => TRAIT_LABELS[t] ?? t).join(', ')}`)
  if ((pet.supportBuffs ?? []).length > 0) {
    details.push(
      `Buffs : ${(pet.supportBuffs ?? [])
        .map((buff) => `${SUPPORT_STAT_LABELS[buff.stat]} +${buff.value}`)
        .join(', ')}`,
    )
  }
  details.push(`Potentiel de lignée : ${pet.lineagePotential ?? 0}/100`)
  if (betterBuff) details.push(`Meilleur buff que ton exemplaire le plus faible (+${bestBuff} vs +${weakestBestBuff}).`)
  if (usefulAffinity) details.push('Affinité compagnon prometteuse (≥ 2 tags communs).')

  const overflowRequired = copies > MAX_SPECIES_COPIES
  const withMeta = (
    result: Omit<CaptureCompareResult, 'overflowRequired' | 'speciesCopyCount' | 'beatsWeakest'>,
  ): CaptureCompareResult => ({
    ...result,
    beatsWeakest,
    overflowRequired,
    speciesCopyCount: copies,
    headline: overflowRequired ? `11e exemplaire — choix obligatoire` : result.headline,
    details: overflowRequired
      ? [
          ...result.details,
          `${copies} exemplaires — garde le nouveau en relâchant un ancien, ou relâche le nouveau.`,
        ]
      : result.details,
  })

  if (pet.isShiny) {
    return withMeta({
      verdict: 'shiny',
      headline: '✨ Shiny détecté !',
      details,
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (objectiveHit) {
    return withMeta({
      verdict: 'objective_hit',
      headline: 'Objectif de pistage atteint !',
      details,
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (beatsWeakest) {
    return withMeta({
      verdict: 'new_record',
      headline: 'Nouveau record pour cette espèce !',
      details: [...details, 'Il surpasse ton exemplaire le plus faible.'],
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (rareTrait) {
    return withMeta({
      verdict: 'rare_trait',
      headline: 'Trait rare détecté',
      details,
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (hasVariant) {
    return withMeta({
      verdict: 'interesting',
      headline: 'Variante visuelle détectée !',
      details,
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (usefulAffinity || betterBuff) {
    return withMeta({
      verdict: 'interesting',
      headline: 'Spécimen intéressant détecté',
      details,
      objectiveResults,
      weakestDuplicate,
      recommendRelease: false,
      protectFromAutoRelease: true,
    })
  }

  if (copies > MAX_SPECIES_COPIES || (copies > 1 && petPowerScore(pet) <= (weakestDuplicate ? petPowerScore(weakestDuplicate) : 0))) {
    return withMeta({
      verdict: 'common_duplicate',
      headline: 'Doublon commun — relâche recommandée',
      details: [...details, 'Tu peux le garder ou le relâcher pour une Faveur du biome.'],
      objectiveResults,
      weakestDuplicate,
      recommendRelease: true,
      protectFromAutoRelease: false,
    })
  }

  return withMeta({
    verdict: 'interesting',
    headline: 'Spécimen intéressant',
    details,
    objectiveResults,
    weakestDuplicate,
    recommendRelease: false,
    protectFromAutoRelease: false,
  })
}

const FAVOR_NAMES: Record<HuntFavorCategory, string> = {
  biome_appearance: 'Écho de biome',
  species_appearance: 'Écho d espèce',
  capture: 'Faveur de capture',
  anti_flee: 'Faveur anti-fuite',
  hint: 'Indice du refuge',
  rarity: 'Écho de rareté',
  shiny: 'Éclat shiny',
}

const FAVOR_VALUES: Record<HuntFavorCategory, Record<HuntFavor['level'], number>> = {
  capture: { 1: 2, 2: 4, 3: 6, 4: 8, 5: 10 },
  biome_appearance: { 1: 5, 2: 7, 3: 9, 4: 12, 5: 15 },
  species_appearance: { 1: 5, 2: 7, 3: 9, 4: 12, 5: 15 },
  anti_flee: { 1: 3, 2: 5, 3: 7, 4: 9, 5: 12 },
  hint: { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12 },
  rarity: { 1: 0.2, 2: 0.4, 3: 0.7, 4: 1.0, 5: 1.5 },
  shiny: { 1: 0.01, 2: 0.02, 3: 0.03, 4: 0.04, 5: 0.05 },
}

export function createHuntFavor(
  category: HuntFavorCategory,
  level: HuntFavor['level'],
  sourceMyrionId?: string,
  targets?: { targetBiomeId?: string; targetSpeciesId?: string },
  now = Date.now(),
): HuntFavor {
  return {
    id: `favor-${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: FAVOR_NAMES[category],
    category,
    level,
    value: FAVOR_VALUES[category][level],
    remainingEncounters: FAVOR_LEVEL_ENCOUNTERS[level],
    obtainedAt: now,
    sourceMyrionId,
    targetBiomeId: targets?.targetBiomeId,
    targetSpeciesId: targets?.targetSpeciesId,
  }
}

export function maybeGrantRefugeFavor(pet: PetState, action: 'cuddle' | 'feed' | 'play'): HuntFavor | null {
  const roll = Math.random()
  const biomeId = normalizeRefugeBiomeId(pet.biomeId)
  if (action === 'cuddle' && pet.joy > 55 && roll < 0.18) {
    return createHuntFavor('capture', pet.affectionLevel >= 4 ? 3 : 2, pet.id)
  }
  if (action === 'cuddle' && roll < 0.08) {
    return createHuntFavor('species_appearance', 2, pet.id, {
      targetSpeciesId: pet.speciesId,
      targetBiomeId: biomeId,
    })
  }
  if (action === 'feed' && roll < 0.12) {
    return createHuntFavor('hint', 1, pet.id)
  }
  if (action === 'play' && pet.energy > 20 && roll < 0.14) {
    if (Math.random() < 0.5) {
      return createHuntFavor('anti_flee', 2, pet.id, { targetBiomeId: biomeId })
    }
    return createHuntFavor('biome_appearance', 2, pet.id, { targetBiomeId: biomeId })
  }
  if (pet.affectionLevel >= 5 && roll < 0.08) {
    return createHuntFavor('rarity', 2, pet.id, { targetBiomeId: biomeId })
  }
  if (pet.rarity === 'LR' && pet.affectionLevel >= 4 && roll < 0.1) {
    return createHuntFavor('shiny', 1, pet.id)
  }
  return null
}

export function pickActiveHuntFavors(favors: HuntFavor[]): HuntFavor[] {
  const queue = [...favors].sort((a, b) => a.obtainedAt - b.obtainedAt)
  const active: HuntFavor[] = []
  let hasRarityFavor = false

  for (const favor of queue) {
    if (favor.remainingEncounters <= 0) continue
    if (favor.category === 'rarity' || favor.category === 'shiny') {
      if (hasRarityFavor) continue
      hasRarityFavor = true
    }
    active.push(favor)
    if (active.length >= MAX_ACTIVE_HUNT_FAVORS) break
  }

  return active
}

export function computeHuntFavorModifiers(
  favors: HuntFavor[],
  context: { biomeId: string; speciesId: string },
): HuntFavorModifiers {
  const active = pickActiveHuntFavors(favors)
  const modifiers: HuntFavorModifiers = {
    captureBonus: 0,
    antiFleeBonus: 0,
    rarityBonus: 0,
    shinyBonus: 0,
    biomeBonus: 0,
    speciesBonus: 0,
    hintBonus: 0,
  }

  for (const favor of active) {
    switch (favor.category) {
      case 'capture':
        modifiers.captureBonus += favor.value
        break
      case 'anti_flee':
        modifiers.antiFleeBonus += favor.value
        break
      case 'rarity':
        modifiers.rarityBonus += favor.value
        break
      case 'shiny':
        modifiers.shinyBonus += favor.value
        break
      case 'biome_appearance':
        modifiers.biomeBonus += favor.value
        break
      case 'species_appearance':
        modifiers.speciesBonus += favor.value
        break
      case 'hint':
        modifiers.hintBonus += favor.value
        break
      default:
        break
    }
  }

  void context
  return modifiers
}

export function tickHuntFavorsAfterEncounter(favors: HuntFavor[]): HuntFavor[] {
  const activeIds = new Set(pickActiveHuntFavors(favors).map((favor) => favor.id))
  return favors
    .map((favor) =>
      activeIds.has(favor.id)
        ? { ...favor, remainingEncounters: Math.max(0, favor.remainingEncounters - 1) }
        : favor,
    )
    .filter((favor) => favor.remainingEncounters > 0)
}
