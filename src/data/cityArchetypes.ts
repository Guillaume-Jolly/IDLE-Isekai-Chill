export type CityArchetypeId =
  | 'military'
  | 'tourism'
  | 'economic'
  | 'arcane'
  | 'harmony'

export type CityArchetype = {
  id: CityArchetypeId
  name: string
  tagline: string
  /** Batiments cles (existants ou futurs) */
  keywords: string[]
  /** Multiplicateur production par ressource quand archetype dominant (seuil 40 pts) */
  productionBonus: Partial<Record<string, number>>
}

export const CITY_ARCHETYPES: Record<CityArchetypeId, CityArchetype> = {
  military: {
    id: 'military',
    name: 'Cite militaire',
    tagline: 'Murailles, caserne, guilde — securite et renom.',
    keywords: ['Caserne', 'Guilde', 'Murailles', 'Auberge (recrues)'],
    productionBonus: { stone: 1.12, renown: 1.1, food: 1.05 },
  },
  tourism: {
    id: 'tourism',
    name: 'Cite touristique',
    tagline: 'Auberges, hotels, salons — loisirs et pieces.',
    keywords: ['Grand hotel', 'Salon des roses', 'Theatre', 'Auberge'],
    productionBonus: { coins: 1.14, renown: 1.12, gifts: 1.08 },
  },
  economic: {
    id: 'economic',
    name: 'Cite marchande',
    tagline: 'Marches, gacha, echanges — prosperite pure.',
    keywords: ['Bourse', 'Marche des etoiles', 'Comptoir', 'Gacha'],
    productionBonus: { coins: 1.1, crystals: 1.15, tickets: 1.12 },
  },
  arcane: {
    id: 'arcane',
    name: 'Cite arcanique',
    tagline: 'Bibliotheque, source, observatoire — mana et stardust.',
    keywords: ['Observatoire', 'Bibliotheque', 'Source', 'Laboratoire'],
    productionBonus: { mana: 1.14, stardust: 1.12, ingredients: 1.08 },
  },
  harmony: {
    id: 'harmony',
    name: 'Havre equilibre',
    tagline: 'Tous les besoins satisfaits — croissance stable.',
    keywords: ['Jardin', 'Ferme', 'Source', 'Atelier'],
    productionBonus: { food: 1.1, silk: 1.08, mana: 1.06, coins: 1.06 },
  },
}

export const ARCHETYPE_ORDER: CityArchetypeId[] = [
  'military',
  'tourism',
  'economic',
  'arcane',
  'harmony',
]

/** Contribution par niveau de batiment existant */
export const BUILDING_ARCHETYPE_WEIGHTS: Record<string, Partial<Record<CityArchetypeId, number>>> = {
  inn: { tourism: 4, economic: 2, military: 1 },
  'mist-garden': { harmony: 4, arcane: 1 },
  'ribbon-workshop': { tourism: 2, economic: 2, harmony: 3 },
  'clear-spring': { arcane: 4, harmony: 3, tourism: 1 },
  'moon-farm': { harmony: 5, military: 1 },
  'arcane-library': { arcane: 6, harmony: 1 },
  'traveler-theater': { tourism: 5, harmony: 2 },
  'star-market': { economic: 6, tourism: 2 },
}

/** Batiments futurs — affiches comme objectifs par archetype */
export type FutureBuilding = {
  id: string
  name: string
  archetype: CityArchetypeId
  unlockStage: number
  role: string
}

export const FUTURE_BUILDINGS: FutureBuilding[] = [
  {
    id: 'barracks',
    name: 'Caserne du Havre',
    archetype: 'military',
    unlockStage: 2,
    role: 'Securite + entrainement compagnons',
  },
  {
    id: 'guild-hall',
    name: 'Guilde des Lames',
    archetype: 'military',
    unlockStage: 3,
    role: 'Renom, quetes militaires',
  },
  {
    id: 'walls',
    name: 'Murailles des Brumes',
    archetype: 'military',
    unlockStage: 2,
    role: 'Securite, cap population',
  },
  {
    id: 'grand-inn',
    name: 'Grand Hotel des Voyageurs',
    archetype: 'tourism',
    unlockStage: 2,
    role: 'Pieces, loisirs, population',
  },
  {
    id: 'rose-salon',
    name: 'Salon des Roses',
    archetype: 'tourism',
    unlockStage: 3,
    role: 'Affinite, loisirs, renom',
  },
  {
    id: 'trade-exchange',
    name: 'Bourse du Festival',
    archetype: 'economic',
    unlockStage: 2,
    role: 'Echange ressources, cristaux',
  },
  {
    id: 'gacha-shrine',
    name: 'Sanctuaire des Invocations',
    archetype: 'economic',
    unlockStage: 3,
    role: 'Tickets, pity bonus',
  },
  {
    id: 'observatory',
    name: 'Observatoire Lunaire',
    archetype: 'arcane',
    unlockStage: 3,
    role: 'Stardust, mana',
  },
  {
    id: 'healing-hall',
    name: 'Infirmerie du Jardin',
    archetype: 'harmony',
    unlockStage: 2,
    role: 'Sante, bonheur',
  },
]

export const DOMINANT_ARCHETYPE_THRESHOLD = 40
