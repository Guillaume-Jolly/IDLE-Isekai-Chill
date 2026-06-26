import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { CompanionVisualDevGallery } from './components/CompanionVisualDevGallery'
import { GachaOpening, type GachaOpeningVariant } from './components/GachaOpening'
import { SettingsPanel } from './components/SettingsPanel'
import { DisagreaEventBanner } from './components/DisagreaEventBanner'
import { DisagreaStoryPanel } from './components/DisagreaStoryPanel'
import { FestivalEventBanner } from './components/FestivalEventBanner'
import { useRewardToasts } from './hooks/useRewardToasts'
import { AppNav, type ViewKey } from './components/AppNav'
import { ResourceStrip } from './components/ResourceStrip'
import { ImageLightbox, type LightboxImage } from './components/ImageLightbox'
import { MinigameHub } from './components/minigames/MinigameHub'
import { MinigamePlayer } from './components/minigames/MinigamePlayer'
import { QuestBoard } from './components/QuestBoard'
import { TutorialObjectivesPanel } from './components/TutorialObjectivesPanel'
import { CompanionStatsPanel } from './components/CompanionStatsPanel'
import { CompanionGameplaySupport } from './components/CompanionGameplaySupport'
import { CompanionMiniature } from './components/CompanionMiniature'
import { CompanionPortrait } from './components/CompanionPortrait'
import { InventoryPanel } from './components/InventoryPanel'
import { PopulationPanel } from './components/PopulationPanel'
import { VillagePanorama } from './components/VillagePanorama'
import { type MapLabelSpot } from './components/VillageMapLabels'
import { useMediaQuery } from './hooks/useMediaQuery'
import {
  getActivityById,
} from './data/buildingActivities'
import {
  bumpQuestProgress,
  createStarterQuestSave,
  generateQuestBoard,
  type InfiniteQuest,
  type QuestKind,
  type QuestSave,
} from './data/infiniteQuests'
import {
  claimTutorialObjective,
  createStarterTutorialSave,
  markTutorialSignal,
  syncTutorialObjectives,
  type TutorialGameContext,
  type TutorialObjectiveId,
  type TutorialObjectiveSave,
} from './data/tutorialObjectives'
import { createStarterMinigameSave, mergeMinigameSave, type MinigameSave } from './data/minigameSave'
import {
  createStableDemoSeed,
  isStablePresetBuild,
  mergeStableDemoSeed,
  resolveGameStorageKey,
  shouldResetStableDemoSave,
} from './data/stableDemoSave'
import {
  fetchStableCloudSaveRaw,
  isStableCloudSaveEnabled,
  pushStableCloudSaveRaw,
} from './data/stableCloudSave'
import { type ResourceKey } from './data/resources'
import { applyGachaItems, DEV_UNLIMITED_GACHA, formatGachaPullSummary, rollMulti, type GachaItem } from './data/gacha'
import { rollDisagreaMulti } from './data/disagreaGacha'
import {
  payloadsFromCost,
  payloadsFromGachaResult,
} from './data/rewardToastEntries'
import { companionAssetPath } from './data/companionAssets'
import { createEmptyFragmentCounts, FRAGMENTS_PER_STAT, fragmentStatBudget } from './data/companionFragments'
import {
  affinityCostMultiplier,
  conversationRewardMultiplier,
  createEmptyStatTokens,
  mergeCompanionStats,
  mergeStatTokens,
  minigameRewardMultiplier,
  raiseStat,
  raiseStatDirect,
  statPointsFromAffinity,
  statPointsFromLevelUp,
  statProductionMultiplier,
  STAT_KEYS,
  STAT_LABELS,
  trainingCostMultiplier,
  type CompanionStats,
  type StatKey,
} from './data/companionStats'
import {
  MAP_LABEL_SPOTS,
} from './data/villageMap'
import {
  BUILDING_UNLOCK_STAGE,
  checkStageAdvance,
  computeNeedSatisfaction,
  createStarterPopulation,
  getArchetypeProductionMultiplier,
  getCurrentStage,
  isBuildingUnlockedByStage,
  populationGrowthTick,
  type VillagePopulationState,
} from './data/population'
import './App.css'

const Live2DDemo = lazy(() =>
  import('./components/Live2DDemo').then((module) => ({ default: module.Live2DDemo })),
)

type Resources = Record<ResourceKey, number>
type Cost = Partial<Resources>

type Building = {
  id: string
  name: string
  role: string
  unlockAt: number
  produces: Cost
  baseCost: Cost
}

type Companion = {
  id: string
  name: string
  archetype: string
  talent: string
  favoriteGift: string
  bonusResource: ResourceKey
  scenes: AffinityScene[]
}

type AffinityScene = {
  level: number
  title: string
  summary: string
  artDirection: string
}

type CompanionState = {
  level: number
  affinity: number
  stats: CompanionStats
  unspentStatPoints: number
}

type GameState = {
  resources: Resources
  buildings: Record<string, number>
  companions: Record<string, CompanionState>
  companionFragments: Record<string, number>
  statTokens: Record<StatKey, number>
  eventPulls: number
  disagreaEventPulls: number
  maturePlaceholders: boolean
  lastSaved: number
  minigameSave: MinigameSave
  quests: QuestSave
  tutorial: TutorialObjectiveSave
  village: VillagePopulationState
}

type OfflineReport = {
  cappedHours: number
  gains: Resources
}

const STORAGE_KEY = resolveGameStorageKey()
const OFFLINE_CAP_HOURS = 168

const RESOURCE_KEYS: ResourceKey[] = [
  'coins',
  'wood',
  'stone',
  'food',
  'silk',
  'mana',
  'renown',
  'ingredients',
  'crystals',
  'gifts',
  'tickets',
  'stardust',
]

const RESOURCE_LABELS: Record<ResourceKey, string> = {
  coins: 'Pieces',
  wood: 'Bois',
  stone: 'Pierre',
  food: 'Vivres',
  silk: 'Soie',
  mana: 'Mana',
  renown: 'Renom',
  ingredients: 'Ingredients',
  crystals: 'Cristaux',
  gifts: 'Cadeaux',
  tickets: 'Tickets',
  stardust: 'Poussiere stellaire',
}

const BUILDINGS: Building[] = [
  {
    id: 'inn',
    name: 'Auberge du Passage',
    role: 'Attire les voyageurs et genere des pieces.',
    unlockAt: 0,
    produces: { coins: 42, food: 5 },
    baseCost: { wood: 28, stone: 18, coins: 80 },
  },
  {
    id: 'mist-garden',
    name: 'Jardin des Brumes',
    role: 'Cultive vivres et ingredients rares.',
    unlockAt: 1,
    produces: { food: 34, ingredients: 8 },
    baseCost: { wood: 45, coins: 120 },
  },
  {
    id: 'ribbon-workshop',
    name: 'Atelier des Rubans',
    role: 'Tisse la soie et fabrique des cadeaux.',
    unlockAt: 2,
    produces: { silk: 20, gifts: 4 },
    baseCost: { wood: 65, stone: 35, coins: 160 },
  },
  {
    id: 'clear-spring',
    name: 'Source Claire',
    role: 'Concentre le mana et repose les compagnons.',
    unlockAt: 3,
    produces: { mana: 16, renown: 3 },
    baseCost: { stone: 80, silk: 18, coins: 260 },
  },
  {
    id: 'moon-farm',
    name: 'Ferme Lunaire',
    role: 'Produit beaucoup de vivres sans timer bloquant.',
    unlockAt: 4,
    produces: { food: 80, stardust: 2 },
    baseCost: { wood: 120, stone: 80, mana: 35 },
  },
  {
    id: 'arcane-library',
    name: 'Bibliotheque Arcanique',
    role: 'Transforme mana et renom en progression.',
    unlockAt: 5,
    produces: { mana: 32, renown: 8 },
    baseCost: { stone: 160, silk: 60, coins: 520 },
  },
  {
    id: 'traveler-theater',
    name: 'Theatre des Voyageurs',
    role: 'Donne du renom, des tickets et des mini-jeux.',
    unlockAt: 6,
    produces: { renown: 18, tickets: 0.2 },
    baseCost: { wood: 240, silk: 120, coins: 760 },
  },
  {
    id: 'star-market',
    name: 'Marche des Etoiles',
    role: 'Ouvre les evenements saisonniers et le gacha.',
    unlockAt: 7,
    produces: { crystals: 5, tickets: 0.45, coins: 60 },
    baseCost: { stone: 320, mana: 160, renown: 80 },
  },
]

const makeScenes = (name: string, place: string, mood: string): AffinityScene[] => [
  {
    level: 1,
    title: 'Premiere rencontre',
    summary: `${name} rejoint le village apres une rencontre lumineuse a ${place}.`,
    artDirection: `Portrait anime propre et chaleureux, tenue de voyage, decor ${place}, expression curieuse.`,
  },
  {
    level: 2,
    title: 'Flirt leger',
    summary: `Un premier rendez-vous laisse paraitre une complicite douce et joueuse.`,
    artDirection:
      'Scene romantique tout public, sourires, gestes retenus, couleurs pastel, aucun contenu explicite.',
  },
  {
    level: 3,
    title: 'Moment intime',
    summary: `Une discussion tardive dans un cadre calme revele une facette plus vulnerable de ${name}.`,
    artDirection: `Tenue elegante plus legere mais non explicite, ambiance ${mood}, cadrage suggestif et respectueux.`,
  },
  {
    level: 4,
    title: 'Confidence adulte',
    summary:
      'Une nuit complice dans un cadre tamise, tenue legere et atmosphere sensuelle mais respectueuse.',
    artDirection:
      'Peignoir de soie, chambre aux bougies, cadrage intime non explicite, personnage adulte.',
  },
  {
    level: 5,
    title: 'Lien maximum',
    summary:
      'Le lien atteint son apogee dans une scene passionnee voilee, elegante et suggestive sans nudite explicite.',
    artDirection:
      'Lumiere rouge douce, chemise de nuit, draps et rosees, maximum de sensualite dans les limites du contenu mature suggere.',
  },
]

const COMPANIONS: Companion[] = [
  {
    id: 'lyra',
    name: 'Lyra',
    archetype: 'Mage apprentie',
    talent: '+mana sur les recoltes',
    favoriteGift: 'The etoile',
    bonusResource: 'mana',
    scenes: makeScenes('Lyra', 'la bibliotheque', 'nuit etoilee'),
  },
  {
    id: 'maeve',
    name: 'Maeve',
    archetype: 'Marchande nomade',
    talent: '+pieces via le marche',
    favoriteGift: 'Ruban dore',
    bonusResource: 'coins',
    scenes: makeScenes('Maeve', 'la route des lanternes', 'boudoir marchand'),
  },
  {
    id: 'seren',
    name: 'Seren',
    archetype: 'Chevaliere paisible',
    talent: '+renom apres les mini-jeux',
    favoriteGift: 'Pierre polie',
    bonusResource: 'renown',
    scenes: makeScenes('Seren', 'la place du village', 'chambre aux bougies'),
  },
  {
    id: 'nami',
    name: 'Nami',
    archetype: 'Cuisiniere solaire',
    talent: '+vivres passifs',
    favoriteGift: 'Epices rares',
    bonusResource: 'food',
    scenes: makeScenes('Nami', 'la cuisine commune', 'terrasse nocturne'),
  },
  {
    id: 'iris',
    name: 'Iris',
    archetype: 'Herboriste reveuse',
    talent: '+ingredients',
    favoriteGift: 'Carnet de fleurs',
    bonusResource: 'ingredients',
    scenes: makeScenes('Iris', 'le jardin des brumes', 'serre au clair de lune'),
  },
  {
    id: 'kael',
    name: 'Kael',
    archetype: 'Barde androgyne',
    talent: '+tickets evenement',
    favoriteGift: 'Plume argentee',
    bonusResource: 'tickets',
    scenes: makeScenes('Kael', 'le theatre', 'loge privee'),
  },
  {
    id: 'runa',
    name: 'Runa',
    archetype: 'Forgeronne douce',
    talent: '+pierre',
    favoriteGift: 'Charbon bleu',
    bonusResource: 'stone',
    scenes: makeScenes('Runa', 'l atelier des rubans', 'atelier tamise'),
  },
  {
    id: 'solene',
    name: 'Solene',
    archetype: 'Pretresse lunaire',
    talent: '+poussiere stellaire',
    favoriteGift: 'Encens blanc',
    bonusResource: 'stardust',
    scenes: makeScenes('Solene', 'la source claire', 'sanctuaire nocturne'),
  },
  {
    id: 'talia',
    name: 'Talia',
    archetype: 'Exploratrice rieuse',
    talent: '+bois et trouvailles',
    favoriteGift: 'Carte ancienne',
    bonusResource: 'wood',
    scenes: makeScenes('Talia', 'la lisiere de la foret', 'camp sous les etoiles'),
  },
  {
    id: 'mira',
    name: 'Mira',
    archetype: 'Tailleur de reves',
    talent: '+soie',
    favoriteGift: 'Aiguille nacree',
    bonusResource: 'silk',
    scenes: makeScenes('Mira', 'l atelier textile', 'boudoir de velours'),
  },
  {
    id: 'asha',
    name: 'Asha',
    archetype: 'Gardienne des sources',
    talent: '+mana et cristaux',
    favoriteGift: 'Perle claire',
    bonusResource: 'crystals',
    scenes: makeScenes('Asha', 'la cascade cachee', 'bain thermal voile'),
  },
  {
    id: 'elwen',
    name: 'Elwen',
    archetype: 'Archiviste fae',
    talent: '+renom savant',
    favoriteGift: 'Signet de cuivre',
    bonusResource: 'renown',
    scenes: makeScenes('Elwen', 'les archives feeriques', 'alcove silencieuse'),
  },
  {
    id: 'noa',
    name: 'Noa',
    archetype: 'Alchimiste malicieuse',
    talent: '+cristaux',
    favoriteGift: 'Fiole irisee',
    bonusResource: 'crystals',
    scenes: makeScenes('Noa', 'le laboratoire', 'observatoire prive'),
  },
  {
    id: 'sora',
    name: 'Sora',
    archetype: 'Dresseuse de familiers',
    talent: '+cadeaux',
    favoriteGift: 'Clochette rouge',
    bonusResource: 'gifts',
    scenes: makeScenes('Sora', 'la ferme lunaire', 'grenier douillet'),
  },
  {
    id: 'zelie',
    name: 'Zelie',
    archetype: 'Duchesse exilee',
    talent: '+pieces et renom',
    favoriteGift: 'Rose noire',
    bonusResource: 'coins',
    scenes: makeScenes('Zelie', 'le salon des invites', 'suite aux rideaux sombres'),
  },
  {
    id: 'etna',
    name: 'Etna',
    archetype: 'Vassale démoniaque invitée',
    talent: '+cristaux d event',
    favoriteGift: 'Ruban pourpre',
    bonusResource: 'crystals',
    scenes: makeScenes('Etna', 'la faille Disagrea', 'repaire pourpre'),
  },
  {
    id: 'flonne',
    name: 'Flonne',
    archetype: 'Guérisseuse angélique invitée',
    talent: '+cadeaux de lien',
    favoriteGift: 'Cloche d ange',
    bonusResource: 'gifts',
    scenes: makeScenes('Flonne', 'la faille Disagrea', 'chapelle pastel'),
  },
  {
    id: 'laharl',
    name: 'Laharl',
    archetype: 'Overlord invité',
    talent: '+renom',
    favoriteGift: 'Cape rouge',
    bonusResource: 'renown',
    scenes: makeScenes('Laharl', 'la faille Disagrea', 'trône miniature'),
  },
  {
    id: 'pleinair',
    name: 'Pleinair',
    archetype: 'Mascotte silencieuse invitée',
    talent: '+poussiere stellaire',
    favoriteGift: 'Lapin peluche',
    bonusResource: 'stardust',
    scenes: makeScenes('Pleinair', 'la faille Disagrea', 'atelier silencieux'),
  },
]

const CONVERSATION_LAUNCH_COST: Cost = { mana: 15, stardust: 3 }

const CONVERSATION_ACTIVITY_BY_COMPANION: Record<string, string> = {
  lyra: 'library-hearts',
  maeve: 'market-hearts',
  seren: 'inn-hearts',
  nami: 'kitchen-hearts',
  iris: 'garden-hearts',
  kael: 'theater-hearts',
  runa: 'forge-hearts',
  solene: 'spring-hearts',
  talia: 'farm-hearts',
  mira: 'workshop-hearts',
  asha: 'cascade-hearts',
  elwen: 'archive-hearts',
  noa: 'lab-hearts',
  sora: 'barn-hearts',
  zelie: 'salon-hearts',
}

const VIEW_TABS: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'village', label: 'Village', icon: '🏘️' },
  { key: 'buildings', label: 'Batiments', icon: '🏗️' },
  { key: 'quests', label: 'Quetes', icon: '📜' },
  { key: 'miniGames', label: 'Mini-jeux', icon: '🎮' },
  { key: 'event', label: 'Event', icon: '🎊' },
  { key: 'inventory', label: 'Inventaire', icon: '🎒' },
  { key: 'companions', label: 'Liens', icon: '💞' },
  { key: 'gallery', label: 'Dev visuels', icon: '🛠️' },
]

const BUILDING_SHORT_NAMES: Record<string, string> = {
  inn: 'Auberge',
  'mist-garden': 'Jardin',
  'ribbon-workshop': 'Atelier',
  'clear-spring': 'Source',
  'moon-farm': 'Ferme',
  'arcane-library': 'Bibliotheque',
  'traveler-theater': 'Theatre',
  'star-market': 'Marche',
}

const BUILDING_ICON = (buildingId: string) => `/buildings/${buildingId}.png`

const visualFallback = (companion: Companion, level: number) =>
  `${companion.name.slice(0, 1)}${level}`

function CompanionVisual({
  companion,
  level,
  compact = false,
  onOpen,
}: {
  companion: Companion
  level: number
  compact?: boolean
  onOpen?: () => void
}) {
  const scene = companion.scenes[level - 1]
  const externalPath = companionAssetPath(companion.id, level)

  return (
    <button
      className={`companion-visual affinity-${level} ${compact ? 'compact' : ''} ${level >= 4 ? 'mature-slot' : ''}`}
      type="button"
      onClick={onOpen}
      aria-label={`Agrandir ${companion.name} affinite ${level}`}
    >
      <CompanionPortrait
        alt={`${companion.name} affinite ${level}`}
        companionId={companion.id}
        level={level}
        fallback={
          <div className="visual-placeholder">
            <strong>{visualFallback(companion, level)}</strong>
            <span>{scene.title}</span>
            <small>Image manquante — {externalPath}</small>
          </div>
        }
      />
    </button>
  )
}

const emptyResources = (value = 0): Resources =>
  Object.fromEntries(RESOURCE_KEYS.map((key) => [key, value])) as Resources

const starterResources = (): Resources => ({
  ...emptyResources(),
  coins: 450,
  wood: 180,
  stone: 140,
  food: 260,
  silk: 40,
  mana: 80,
  renown: 30,
  ingredients: 45,
  crystals: 90,
  gifts: 60,
  tickets: 5,
  stardust: 10,
})

const createCompanionState = (companionId: string, saved?: Partial<CompanionState>): CompanionState => {
  const statState = mergeCompanionStats(companionId, saved)
  return {
    level: saved?.level ?? 1,
    affinity: saved?.affinity ?? 1,
    stats: statState.stats,
    unspentStatPoints: statState.unspentStatPoints,
  }
}

const createStarterGame = (): GameState => ({
  resources: starterResources(),
  buildings: Object.fromEntries(BUILDINGS.map((building) => [building.id, 1])),
  companions: Object.fromEntries(
    COMPANIONS.map((companion) => [companion.id, createCompanionState(companion.id)]),
  ),
  companionFragments: createEmptyFragmentCounts(),
  statTokens: createEmptyStatTokens(),
  eventPulls: 0,
  disagreaEventPulls: 0,
  maturePlaceholders: false,
  lastSaved: Date.now(),
  minigameSave: createStarterMinigameSave(),
  quests: {
    ...createStarterQuestSave(),
    board: generateQuestBoard(
      BUILDINGS.map((building) => building.id),
      COMPANIONS.map((companion) => companion.id),
      6,
    ),
  },
  tutorial: createStarterTutorialSave(),
  village: createStarterPopulation(),
})

const tutorialContext = (game: Pick<GameState, 'resources' | 'buildings' | 'minigameSave'>): TutorialGameContext => ({
  resources: game.resources,
  buildings: game.buildings,
  minigameSave: game.minigameSave,
})

const withTutorialSync = (game: GameState): GameState => ({
  ...game,
  tutorial: syncTutorialObjectives(
    game.tutorial ?? createStarterTutorialSave(),
    tutorialContext(game),
  ),
})

const withTutorialSignal = (game: GameState, signal: TutorialObjectiveId): GameState => ({
  ...game,
  tutorial: markTutorialSignal(
    game.tutorial ?? createStarterTutorialSave(),
    signal,
    tutorialContext(game),
  ),
})

const formatAmount = (amount: number) =>
  Math.floor(amount).toLocaleString('fr-FR')

const multiplyCost = (cost: Cost, multiplier: number): Cost =>
  Object.fromEntries(
    Object.entries(cost).map(([key, value]) => [
      key,
      Math.ceil((value ?? 0) * multiplier),
    ]),
  ) as Cost

const mergeResources = (resources: Resources, delta: Cost): Resources => {
  const next = { ...resources }
  for (const key of RESOURCE_KEYS) {
    next[key] = Math.max(0, next[key] + (delta[key] ?? 0))
  }
  return next
}

const canAfford = (resources: Resources, cost: Cost) =>
  RESOURCE_KEYS.every((key) => resources[key] >= (cost[key] ?? 0))

const spendResources = (resources: Resources, cost: Cost): Resources => {
  const next = { ...resources }
  for (const key of RESOURCE_KEYS) {
    next[key] -= cost[key] ?? 0
  }
  return next
}

const costText = (cost: Cost) =>
  RESOURCE_KEYS.filter((key) => (cost[key] ?? 0) > 0)
    .map((key) => `${formatAmount(cost[key] ?? 0)} ${RESOURCE_LABELS[key]}`)
    .join(' + ')

const bumpGameQuests = (
  game: GameState,
  kind: QuestKind,
  detail?: { buildingId?: string; companionId?: string; activityId?: string },
): GameState => ({
  ...game,
  quests: {
    ...game.quests,
    board: bumpQuestProgress(game.quests.board, kind, detail),
  },
})

const scaleCostByMultiplier = (cost: Cost, multiplier: number): Cost =>
  Object.fromEntries(
    Object.entries(cost).map(([key, value]) => [key, Math.ceil((value ?? 0) * multiplier)]),
  ) as Cost

const scaleRewardByMultiplier = (reward: Cost, multiplier: number): Cost =>
  Object.fromEntries(
    Object.entries(reward).map(([key, value]) => [
      key,
      Math.max(1, Math.round((value ?? 0) * multiplier)),
    ]),
  ) as Cost

const productionPerMinute = (game: GameState): Resources => {
  const production = emptyResources()
  for (const building of BUILDINGS) {
    const level = game.buildings[building.id] ?? 0
    if (level <= 0 || !isBuildingUnlockedByStage(building.id, game.village.stage)) continue
    for (const key of RESOURCE_KEYS) {
      const base = (building.produces[key] ?? 0) * level
      production[key] += base * getArchetypeProductionMultiplier(key, game.buildings)
    }
  }

  for (const companion of COMPANIONS) {
    const state = game.companions[companion.id]
    if (!state) continue
    production[companion.bonusResource] += statProductionMultiplier(
      state.level,
      state.affinity,
      state.stats,
    )
  }

  const popBonus = 1 + Math.min(0.15, game.village.population / 2000)
  for (const key of RESOURCE_KEYS) {
    production[key] *= popBonus
  }

  return production
}

const applyOfflineProgress = (game: GameState): { game: GameState; report: OfflineReport } => {
  const now = Date.now()
  const elapsedHours = Math.max(0, (now - game.lastSaved) / 3_600_000)
  const cappedHours = Math.min(elapsedHours, OFFLINE_CAP_HOURS)
  const gains = emptyResources()
  const perMinute = productionPerMinute(game)

  for (const key of RESOURCE_KEYS) {
    gains[key] = perMinute[key] * cappedHours * 60
  }

  return {
    game: {
      ...game,
      resources: mergeResources(game.resources, gains),
      lastSaved: now,
    },
    report: { cappedHours, gains },
  }
}

const createInitialGame = (): GameState => {
  const base = createStarterGame()
  if (!isStablePresetBuild()) return base

  const seed = createStableDemoSeed()
  const merged = mergeStableDemoSeed(base, seed)
  return {
    ...merged,
    companions: Object.fromEntries(
      COMPANIONS.map((companion) => [
        companion.id,
        createCompanionState(
          companion.id,
          seed.companionLevels[companion.id] ?? { level: 10, affinity: 5 },
        ),
      ]),
    ),
  }
}

const hydrateGameFromRaw = (raw: string): { game: GameState; report: OfflineReport } | null => {
  try {
    const parsed = JSON.parse(raw) as GameState & { bonusStatPoints?: number }
    const legacyStatPoints = parsed.bonusStatPoints ?? 0
    const migratedTokens = mergeStatTokens(parsed.statTokens)
    if (legacyStatPoints > 0) {
      migratedTokens.charm += legacyStatPoints
    }
    const mergedMinigameSave = mergeMinigameSave(parsed.minigameSave)
    const migrated: GameState = {
      ...createStarterGame(),
      ...parsed,
      resources: { ...starterResources(), ...parsed.resources },
      buildings: { ...createStarterGame().buildings, ...parsed.buildings },
      companions: Object.fromEntries(
        COMPANIONS.map((companion) => [
          companion.id,
          createCompanionState(companion.id, parsed.companions?.[companion.id]),
        ]),
      ),
      companionFragments: {
        ...createEmptyFragmentCounts(),
        ...(parsed.companionFragments ?? {}),
      },
      statTokens: migratedTokens,
      disagreaEventPulls: parsed.disagreaEventPulls ?? 0,
      maturePlaceholders: parsed.maturePlaceholders ?? false,
      minigameSave: mergedMinigameSave,
      quests: parsed.quests?.board?.length
        ? {
            board: parsed.quests.board,
            totalClaimed: parsed.quests.totalClaimed ?? 0,
          }
        : createStarterGame().quests,
      village: {
        ...createStarterPopulation(),
        ...(parsed.village ?? {}),
      },
      tutorial: syncTutorialObjectives(
        parsed.tutorial ?? createStarterTutorialSave(),
        {
          resources: { ...starterResources(), ...parsed.resources },
          buildings: { ...createStarterGame().buildings, ...parsed.buildings },
          minigameSave: mergedMinigameSave,
        },
      ),
    }
    const synced = withTutorialSync(migrated)
    const hadPetsBefore = (parsed.minigameSave?.pets?.length ?? 0) > 0
    const petsWiped = hadPetsBefore && synced.minigameSave.pets.length === 0
    if (petsWiped) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...parsed, ...synced, minigameSave: synced.minigameSave }),
      )
    }
    return applyOfflineProgress(synced)
  } catch {
    return null
  }
}

const loadInitialSession = () => {
  if (typeof window === 'undefined') {
    return { game: createInitialGame(), report: { cappedHours: 0, gains: emptyResources() } }
  }

  if (shouldResetStableDemoSave()) {
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { game: createInitialGame(), report: { cappedHours: 0, gains: emptyResources() } }
  }

  return hydrateGameFromRaw(raw) ?? {
    game: createInitialGame(),
    report: { cappedHours: 0, gains: emptyResources() },
  }
}

const initialSession = loadInitialSession()

function App() {
  const [game, setGame] = useState<GameState>(initialSession.game)
  const [offlineReport] = useState<OfflineReport>(initialSession.report)
  const { pushRewardPayloads } = useRewardToasts()
  const [message, setMessage] = useState(() =>
    offlineReport.cappedHours > 0.01
      ? `Hors-ligne +${offlineReport.cappedHours.toFixed(1)} h`
      : '',
  )
  const [activeView, setActiveView] = useState<ViewKey>('village')
  const isMobileLayout = useMediaQuery('(max-width: 767px)')
  const [sidebarExpanded, setSidebarExpanded] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [villagePanelOpen, setVillagePanelOpen] = useState(false)

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => setMessage(''), 3200)
    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const desktop = window.matchMedia('(min-width: 1024px)')

    const collapseOnMobile = (event: MediaQueryListEvent) => {
      if (event.matches) setSidebarExpanded(false)
    }
    const expandOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setSidebarExpanded(true)
    }

    mobile.addEventListener('change', collapseOnMobile)
    desktop.addEventListener('change', expandOnDesktop)
    return () => {
      mobile.removeEventListener('change', collapseOnMobile)
      desktop.removeEventListener('change', expandOnDesktop)
    }
  }, [])

  const handleSelectView = useCallback(
    (view: ViewKey) => {
      setActiveView(view)
      if (view === 'companions') {
        setGame((current) => withTutorialSignal(current, 'open-companions'))
      }
      if (view === 'inventory') {
        setGame((current) => withTutorialSignal(current, 'open-inventory-familiers'))
      }
      if (isMobileLayout) {
        setSidebarExpanded(false)
        setMobileNavOpen(false)
      }
      if (view !== 'village') {
        setVillagePanelOpen(false)
      }
    },
    [isMobileLayout],
  )
  const [activeBuildingId, setActiveBuildingId] = useState(BUILDINGS[0].id)
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null)
  const [gachaOpening, setGachaOpening] = useState<{
    items: GachaItem[]
    variant: GachaOpeningVariant
  } | null>(null)
  const [live2dDemoOpen, setLive2dDemoOpen] = useState(false)
  const [activeMinigameActivityId, setActiveMinigameActivityId] = useState<string | null>(null)
  const [focusMinigameBuildingId, setFocusMinigameBuildingId] = useState<string | null>(null)
  const passiveQuestTicks = useRef(0)
  const effectiveMobileNavOpen = mobileNavOpen && !activeMinigameActivityId

  const openCompanionLightbox = (companion: Companion, level: number) => {
    const images: LightboxImage[] = companion.scenes.map((scene) => ({
      src: companionAssetPath(companion.id, scene.level),
      alt: `${companion.name} affinite ${scene.level}`,
      caption: `${companion.name} — ${scene.title}`,
      companionId: companion.id,
      level: scene.level,
    }))
    setLightbox({ images, index: level - 1 })
  }

  const perMinute = productionPerMinute(game)

  useEffect(() => {
    const payload: GameState = { ...game, lastSaved: Date.now() }
    const raw = JSON.stringify(payload)
    window.localStorage.setItem(STORAGE_KEY, raw)
    if (!isStableCloudSaveEnabled()) return
    const timer = window.setTimeout(() => {
      void pushStableCloudSaveRaw(raw)
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [game])

  useEffect(() => {
    if (!isStableCloudSaveEnabled()) return
    let cancelled = false
    void (async () => {
      const cloudRaw = await fetchStableCloudSaveRaw()
      if (cancelled || !cloudRaw) return
      const cloudSession = hydrateGameFromRaw(cloudRaw)
      if (!cloudSession) return
      const localRaw = window.localStorage.getItem(STORAGE_KEY)
      const localSession = localRaw ? hydrateGameFromRaw(localRaw) : null
      const cloudTime = cloudSession.game.lastSaved ?? 0
      const localTime = localSession?.game.lastSaved ?? 0
      if (cloudTime >= localTime) {
        setGame(cloudSession.game)
        window.localStorage.setItem(STORAGE_KEY, cloudRaw)
      } else if (localRaw) {
        await pushStableCloudSaveRaw(localRaw)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setGame((current) => {
        const tickProduction = productionPerMinute(current)
        const gains = emptyResources()
        for (const key of RESOURCE_KEYS) {
          gains[key] = tickProduction[key] / 12
        }
        passiveQuestTicks.current += 1
        let next: GameState = {
          ...current,
          resources: mergeResources(current.resources, gains),
        }
        if (passiveQuestTicks.current >= 12) {
          passiveQuestTicks.current = 0
          next = bumpGameQuests(next, 'earn-passive')
        }
        const needs = computeNeedSatisfaction(next.buildings, next.village.population)
        const popGain = populationGrowthTick(next.village, needs)
        if (popGain > 0) {
          next = {
            ...next,
            village: {
              ...next.village,
              population: Math.min(
                getCurrentStage(next.village.stage).popCap,
                next.village.population + popGain,
              ),
            },
          }
        }
        return withTutorialSync(next)
      })
    }, 5000)

    return () => window.clearInterval(id)
  }, [])

  const updateBuilding = (building: Building) => {
    if (!isBuildingUnlockedByStage(building.id, game.village.stage)) {
      const requiredStage = BUILDING_UNLOCK_STAGE[building.id] ?? 0
      setMessage(
        `${building.name} se debloque au stade ${getCurrentStage(requiredStage).name}.`,
      )
      return
    }

    const level = game.buildings[building.id] ?? 1
    const cost = multiplyCost(building.baseCost, Math.pow(1.48, level - 1))

    if (!canAfford(game.resources, cost)) {
      setMessage(`Ressources insuffisantes pour ameliorer ${building.name}.`)
      return
    }

    setGame((current) =>
      withTutorialSync(
        bumpGameQuests(
          {
            ...current,
            resources: spendResources(current.resources, cost),
            buildings: { ...current.buildings, [building.id]: level + 1 },
          },
          'upgrade-building',
          { buildingId: building.id },
        ),
      ),
    )
    setMessage(`${building.name} passe niveau ${level + 1}.`)
  }

  const trainCompanion = (companion: Companion) => {
    const current = game.companions[companion.id]
    const baseCost = multiplyCost(
      { coins: 120, mana: 30, gifts: 12, food: 25, ingredients: 10 },
      Math.pow(1.35, current.level - 1),
    )
    const cost = scaleCostByMultiplier(baseCost, trainingCostMultiplier(current.stats))

    if (!canAfford(game.resources, cost)) {
      setMessage(`Il manque des ressources pour entrainer ${companion.name}.`)
      return
    }

    setGame((previous) =>
      bumpGameQuests(
        {
          ...previous,
          resources: spendResources(previous.resources, cost),
          companions: {
            ...previous.companions,
            [companion.id]: {
              ...current,
              level: current.level + 1,
              unspentStatPoints: current.unspentStatPoints + statPointsFromLevelUp(),
            },
          },
        },
        'train-companion',
        { companionId: companion.id },
      ),
    )
    setMessage(`${companion.name} gagne un niveau (+1 point de stat).`)
  }

  const raiseAffinity = (companion: Companion) => {
    const current = game.companions[companion.id]
    if (current.affinity >= 5) {
      setMessage(`${companion.name} est deja au lien maximum.`)
      return
    }

    const affinityBase: Cost = { gifts: 25, renown: 18, silk: 10 }
    if (current.affinity >= 3) {
      affinityBase.stardust = 6
    }
    if (current.affinity >= 4) {
      affinityBase.crystals = 12
    }

    const scaledBase = multiplyCost(affinityBase, Math.pow(1.55, current.affinity - 1))
    const cost = scaleCostByMultiplier(scaledBase, affinityCostMultiplier(current.stats))

    if (!canAfford(game.resources, cost)) {
      setMessage(`Il manque des cadeaux pour renforcer le lien avec ${companion.name}.`)
      return
    }

    const nextAffinity = current.affinity + 1
    const statBonus = statPointsFromAffinity(nextAffinity)

    setGame((previous) =>
      bumpGameQuests(
        {
          ...previous,
          resources: spendResources(previous.resources, cost),
          companions: {
            ...previous.companions,
            [companion.id]: {
              ...current,
              affinity: nextAffinity,
              unspentStatPoints: current.unspentStatPoints + statBonus,
            },
          },
        },
        'raise-affinity',
        { companionId: companion.id },
      ),
    )
    setMessage(
      `Affinite ${nextAffinity} avec ${companion.name}${statBonus > 0 ? ` (+${statBonus} pt stat)` : ''}.`,
    )
  }

  const assignCompanionStat = (companionId: string, key: StatKey) => {
    const current = game.companions[companionId]
    if (!current) return

    if (current.unspentStatPoints > 0) {
      const next = raiseStat(
        { stats: current.stats, unspentStatPoints: current.unspentStatPoints },
        key,
      )
      if (!next) {
        setMessage('Cette stat est au maximum.')
        return
      }
      setGame((previous) => ({
        ...previous,
        companions: { ...previous.companions, [companionId]: { ...current, ...next } },
      }))
      setMessage(`${STAT_LABELS[key]} augmentée (niveau/affinité).`)
      return
    }

    if (game.statTokens[key] > 0) {
      const nextStats = raiseStatDirect(current.stats, key)
      if (!nextStats) {
        setMessage('Cette stat est au maximum.')
        return
      }
      setGame((previous) => ({
        ...previous,
        statTokens: { ...previous.statTokens, [key]: previous.statTokens[key] - 1 },
        companions: {
          ...previous.companions,
          [companionId]: { ...current, stats: nextStats },
        },
      }))
      setMessage(`Jeton ${STAT_LABELS[key]} assigné à ${COMPANIONS.find((c) => c.id === companionId)?.name ?? 'ce compagnon'}.`)
      return
    }

    const fragmentCount = game.companionFragments[companionId] ?? 0
    if (fragmentStatBudget(fragmentCount) > 0) {
      const nextStats = raiseStatDirect(current.stats, key)
      if (!nextStats) {
        setMessage('Cette stat est au maximum.')
        return
      }
      setGame((previous) => ({
        ...previous,
        companionFragments: {
          ...previous.companionFragments,
          [companionId]: fragmentCount - FRAGMENTS_PER_STAT,
        },
        companions: {
          ...previous.companions,
          [companionId]: { ...current, stats: nextStats },
        },
      }))
      setMessage(
        `10 fragments échangés — ${STAT_LABELS[key]} +1 pour ${COMPANIONS.find((c) => c.id === companionId)?.name ?? 'ce compagnon'}.`,
      )
      return
    }

    setMessage('Aucun point, fragment ou jeton disponible pour cette stat.')
  }

  const playMiniGame = (reward: Cost, name: string) => {
    pushRewardPayloads(payloadsFromCost(reward))
    setGame((current) => ({
      ...current,
      resources: mergeResources(current.resources, reward),
    }))
    setMessage(`${name} termine. Recompenses ajoutees.`)
  }

  const completeMinigame = (
    activityId: string,
    reward: Cost,
    activityName: string,
    miniScore: number,
    maxScore: number,
    options?: { keepOpen?: boolean; silent?: boolean },
  ) => {
    const activity = getActivityById(activityId)
    const companionState = activity ? game.companions[activity.companionId] : undefined
    let scaledReward = reward

    if (companionState) {
      const multiplier =
        activity?.minigameType === 'conversation'
          ? conversationRewardMultiplier(companionState.stats)
          : minigameRewardMultiplier(companionState.stats)
      scaledReward = scaleRewardByMultiplier(reward, multiplier)
    }

    setGame((current) => {
      let next: GameState = withTutorialSync({
        ...current,
        resources: mergeResources(current.resources, scaledReward),
      })
      next = bumpGameQuests(next, 'play-minigame', { activityId })
      if (activity?.minigameType === 'conversation') {
        next = bumpGameQuests(next, 'conversation')
        next = withTutorialSignal(next, 'play-link')
      }
      return next
    })
    if (!options?.keepOpen) {
      setActiveMinigameActivityId(null)
    }
    if (!options?.silent) {
      pushRewardPayloads(payloadsFromCost(scaledReward))
      setMessage(`${activityName} — ${costText(scaledReward)} gagnes (${miniScore}/${maxScore}).`)
    }
  }

  const tryLaunchMinigame = (activityId: string) => {
    const activity = getActivityById(activityId)
    if (!activity) return

    if (activity.minigameType === 'conversation') {
      if (!canAfford(game.resources, CONVERSATION_LAUNCH_COST)) {
        setMessage(`Il faut ${costText(CONVERSATION_LAUNCH_COST)} pour lancer une conversation.`)
        return
      }
      setGame((current) => ({
        ...current,
        resources: spendResources(current.resources, CONVERSATION_LAUNCH_COST),
      }))
    }

    if (activity.minigameType === 'familiar-capture') {
      setGame((current) => withTutorialSignal(current, 'open-hunt'))
    }
    if (activity.minigameType === 'dressage') {
      setGame((current) => withTutorialSignal(current, 'open-refuge'))
    }

    setFocusMinigameBuildingId(activity.buildingId)
    setMobileNavOpen(false)
    setActiveMinigameActivityId(activityId)
  }

  const claimQuest = (questId: string, reward: Cost) => {
    pushRewardPayloads(payloadsFromCost(reward))
    setGame((current) => ({
      ...current,
      resources: mergeResources(current.resources, reward),
      quests: {
        totalClaimed: current.quests.totalClaimed + 1,
        board: current.quests.board.filter((quest) => quest.id !== questId),
      },
    }))
    setMessage(`Quete terminee — ${costText(reward)} recoltes.`)
  }

  const refreshQuestBoard = (board: InfiniteQuest[]) => {
    setGame((current) => ({
      ...current,
      quests: { ...current.quests, board },
    }))
    setMessage('Nouvelles mini-quetes generees.')
  }

  const saveMinigameProgress = (save: MinigameSave) => {
    setGame((current) => withTutorialSync({ ...current, minigameSave: save }))
  }

  const claimTutorialReward = (objectiveId: TutorialObjectiveId, reward: Cost) => {
    pushRewardPayloads(payloadsFromCost(reward))
    setGame((current) => {
      const nextTutorial = claimTutorialObjective(current.tutorial, objectiveId)
      if (!nextTutorial) return current
      return withTutorialSync({
        ...current,
        tutorial: nextTutorial,
        resources: mergeResources(current.resources, reward),
      })
    })
    setMessage(`Objectif tutoriel complété — ${costText(reward)} récupérés.`)
  }

  const startGachaPull = (count: number) => {
    if (!DEV_UNLIMITED_GACHA) {
      const cost: Cost = { tickets: count }
      if (!canAfford(game.resources, cost)) {
        setMessage(`Il te faut ${count} ticket${count > 1 ? 's' : ''} pour invoquer.`)
        return
      }
    }

    const items = rollMulti(count, game.eventPulls)
    const pullResult = applyGachaItems(items)
    pushRewardPayloads(payloadsFromGachaResult(pullResult))

    setGame((current) => {
      const nextFragments = { ...current.companionFragments }
      for (const [companionId, delta] of Object.entries(pullResult.fragments)) {
        nextFragments[companionId] = (nextFragments[companionId] ?? 0) + delta
      }
      const nextTokens = { ...current.statTokens }
      for (const key of STAT_KEYS) {
        nextTokens[key] += pullResult.statTokens[key]
      }
      return {
        ...current,
        resources: mergeResources(
          DEV_UNLIMITED_GACHA
            ? current.resources
            : spendResources(current.resources, { tickets: count }),
          pullResult.resources,
        ),
        companionFragments: nextFragments,
        statTokens: nextTokens,
        eventPulls: current.eventPulls + count,
      }
    })
    setGachaOpening({ items, variant: 'festival' })
    setMessage(
      `Invocation x${count} — ${formatGachaPullSummary(pullResult)}${DEV_UNLIMITED_GACHA ? ' (mode dev)' : ''}.`,
    )
  }

  const startDisagreaGachaPull = (count: number) => {
    if (!DEV_UNLIMITED_GACHA) {
      const cost: Cost = { tickets: count }
      if (!canAfford(game.resources, cost)) {
        setMessage(`Il te faut ${count} ticket${count > 1 ? 's' : ''} pour invoquer.`)
        return
      }
    }

    const items = rollDisagreaMulti(count, game.disagreaEventPulls)
    const pullResult = applyGachaItems(items)
    pushRewardPayloads(payloadsFromGachaResult(pullResult))

    setGame((current) => {
      const nextFragments = { ...current.companionFragments }
      for (const [companionId, delta] of Object.entries(pullResult.fragments)) {
        nextFragments[companionId] = (nextFragments[companionId] ?? 0) + delta
      }
      const nextTokens = { ...current.statTokens }
      for (const key of STAT_KEYS) {
        nextTokens[key] += pullResult.statTokens[key]
      }
      return {
        ...current,
        resources: mergeResources(
          DEV_UNLIMITED_GACHA
            ? current.resources
            : spendResources(current.resources, { tickets: count }),
          pullResult.resources,
        ),
        companionFragments: nextFragments,
        statTokens: nextTokens,
        disagreaEventPulls: current.disagreaEventPulls + count,
      }
    })
    setGachaOpening({ items, variant: 'disagrea' })
    setMessage(
      `Disagrea x${count} — ${formatGachaPullSummary(pullResult)}${DEV_UNLIMITED_GACHA ? ' (mode dev)' : ''}.`,
    )
  }

  const advanceVillageStage = () => {
    const needs = computeNeedSatisfaction(game.buildings, game.village.population)
    const check = checkStageAdvance(game.village, needs)
    if (!check.canAdvance) {
      setMessage(`Stade bloque : ${check.reasons.join(' · ')}`)
      return
    }

    const nextStageId = game.village.stage + 1
    setGame((current) => ({
      ...current,
      village: { ...current.village, stage: nextStageId },
    }))
    setMessage(`Felicitations — ${getCurrentStage(nextStageId).name} debloque !`)
  }

  const resetGame = () => {
    const fresh = createStarterGame()
    setGame(fresh)
    setMessage('Nouvelle partie creee.')
  }

  const selectedBuilding =
    BUILDINGS.find((building) => building.id === activeBuildingId) ?? BUILDINGS[0]

  const selectedBuildingLevel = game.buildings[selectedBuilding.id] ?? 1
  const selectedBuildingCost = multiplyCost(
    selectedBuilding.baseCost,
    Math.pow(1.48, selectedBuildingLevel - 1),
  )

  const renderBuildingCards = (items = BUILDINGS) => (
    <>
      <PopulationPanel
        buildings={game.buildings}
        village={game.village}
        onAdvanceStage={advanceVillageStage}
      />

      <section className="section-heading">
        <div>
          <p className="eyebrow">Village</p>
          <h2>Batiments progressifs</h2>
        </div>
        <p>
          Chaque batiment a son menu et sa production. Depuis la carte, tu peux
          ouvrir le menu lie au batiment selectionne.
        </p>
      </section>

      <section className="grid building-grid">
        {items.map((building) => {
          const level = game.buildings[building.id] ?? 1
          const locked = !isBuildingUnlockedByStage(building.id, game.village.stage)
          const cost = multiplyCost(building.baseCost, Math.pow(1.48, level - 1))
          const requiredStage = BUILDING_UNLOCK_STAGE[building.id] ?? 0

          return (
            <article className={`panel ${locked ? 'locked' : ''}`} key={building.id}>
              <div className="building-thumb">
                <img src={BUILDING_ICON(building.id)} alt="" />
              </div>
              <div className="card-topline">
                <span>Niveau {level}</span>
                <span>
                  {locked ? getCurrentStage(requiredStage).name : 'Disponible'}
                </span>
              </div>
              <h3>{building.name}</h3>
              <p>{building.role}</p>
              <small>Production: {costText(building.produces)} / min</small>
              <button type="button" onClick={() => updateBuilding(building)}>
                Ameliorer - {costText(cost)}
              </button>
            </article>
          )
        })}
      </section>
    </>
  )

  const renderQuests = () => (
    <>
      <TutorialObjectivesPanel
        tutorial={game.tutorial}
        onClaim={claimTutorialReward}
        onNavigate={handleSelectView}
      />
      <QuestBoard
        buildingIds={BUILDINGS.map((building) => building.id)}
        companionIds={COMPANIONS.map((companion) => companion.id)}
        quests={game.quests}
        onClaim={claimQuest}
        onRefresh={refreshQuestBoard}
        onLaunchConversation={() => tryLaunchMinigame('spring-hearts')}
        onLaunchMinigames={() => setActiveView('miniGames')}
      />
    </>
  )

  const renderMiniGames = () => (
    <MinigameHub
      buildings={game.buildings}
      companions={COMPANIONS.map((companion) => ({ id: companion.id, name: companion.name }))}
      focusBuildingId={focusMinigameBuildingId}
      resourceLabels={RESOURCE_LABELS}
      unlockAtByBuilding={BUILDING_UNLOCK_STAGE}
      villageStage={game.village.stage}
      onPlay={(activityId) => tryLaunchMinigame(activityId)}
    />
  )

  const renderEvent = () => (
    <div className="event-view-stack">
      <section className="section-heading">
        <div>
          <p className="eyebrow">Evenement</p>
          <h2>Festival saisonnier sans paiement</h2>
        </div>
        <p>
          Chaque tirage donne des ressources, des fragments de compagnons ou des jetons de stat
          ciblés. Tous les 10 fragments d&apos;un compagnon = +1 stat sur lui (onglet Liens).
        </p>
      </section>

      <DisagreaEventBanner
        pulls={game.disagreaEventPulls}
        tickets={Math.floor(game.resources.tickets ?? 0)}
        onPull={startDisagreaGachaPull}
      />

      <DisagreaStoryPanel />

      <FestivalEventBanner
        pulls={game.eventPulls}
        tickets={Math.floor(game.resources.tickets ?? 0)}
        onPull={startGachaPull}
      />
    </div>
  )

  const renderInventory = () => (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Inventaire</p>
          <h2>Tout ce que tu possèdes</h2>
        </div>
        <p>
          Ressources, fragments, jetons gacha, outils débloqués par les bâtiments,
          familiers et cultures en cours.
        </p>
      </section>
      <InventoryPanel
        buildings={game.buildings}
        companionFragments={game.companionFragments}
        companions={Object.fromEntries(
          COMPANIONS.map((companion) => [
            companion.id,
            { unspentStatPoints: game.companions[companion.id]?.unspentStatPoints ?? 0 },
          ]),
        )}
        eventPulls={game.eventPulls}
        minigameSave={game.minigameSave}
        questsClaimed={game.quests.totalClaimed}
        resources={game.resources}
        statTokens={game.statTokens}
      />
    </>
  )

  const renderCompanions = () => (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Compagnons</p>
          <h2>Relations et illustrations</h2>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={game.maturePlaceholders}
            onChange={(event) =>
              setGame((current) => ({
                ...current,
                maturePlaceholders: event.target.checked,
              }))
            }
          />
          Afficher les scenes avancees
        </label>
      </section>

      <section className="companion-grid">
        {COMPANIONS.map((companion) => {
          const current = game.companions[companion.id]
          const activeScene = companion.scenes[current.affinity - 1]
          const trainingBase = multiplyCost(
            { coins: 120, mana: 30, gifts: 12, food: 25, ingredients: 10 },
            Math.pow(1.35, current.level - 1),
          )
          const trainingCost = scaleCostByMultiplier(
            trainingBase,
            trainingCostMultiplier(current.stats),
          )
          const affinityBase: Cost = { gifts: 25, renown: 18, silk: 10 }
          if (current.affinity >= 3) affinityBase.stardust = 6
          if (current.affinity >= 4) affinityBase.crystals = 12
          const affinityCost = scaleCostByMultiplier(
            multiplyCost(affinityBase, Math.pow(1.55, current.affinity - 1)),
            affinityCostMultiplier(current.stats),
          )

          return (
            <article className="companion-card" key={companion.id}>
              <div className="companion-portrait-wrap">
                <div
                  className="portrait portrait-clickable"
                  aria-label={`Agrandir ${companion.name} — survoler pour le profil RP`}
                  onClick={() => openCompanionLightbox(companion, 1)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') openCompanionLightbox(companion, 1)
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <CompanionMiniature
                    className="companion-portrait-img"
                    companionId={companion.id}
                    name={companion.name}
                  />
                  <span>{companion.name.slice(0, 1)}</span>
                </div>
                <div className="companion-portrait-tooltip" role="tooltip">
                  <strong>{companion.archetype}</strong>
                  <p>{companion.talent}</p>
                  <p>Cadeau prefere : {companion.favoriteGift}</p>
                  <hr />
                  <strong>{activeScene.title}</strong>
                  <p>{activeScene.summary}</p>
                  <small>{activeScene.artDirection}</small>
                  {game.maturePlaceholders && current.affinity >= 4 ? (
                    <small className="companion-portrait-tooltip-mature">
                      Paliers 4-5 : contenu mature suggestif, personnages adultes et consentants.
                    </small>
                  ) : null}
                </div>
              </div>
              <div className="companion-body">
                <div className="card-topline">
                  <span>Niv. {current.level}</span>
                  <span>Affinite {current.affinity}/5</span>
                </div>
                <h3>{companion.name}</h3>
                <CompanionGameplaySupport companionId={companion.id} />
                <CompanionStatsPanel
                  fragmentCount={game.companionFragments[companion.id] ?? 0}
                  statTokens={game.statTokens}
                  stats={current.stats}
                  unspentPoints={current.unspentStatPoints}
                  onAssign={(key) => assignCompanionStat(companion.id, key)}
                />
                <CompanionVisual
                  companion={companion}
                  level={current.affinity}
                  onOpen={() => openCompanionLightbox(companion, current.affinity)}
                />
                <div className="companion-actions">
                  <div className="companion-action-chip">
                    <button type="button" onClick={() => trainCompanion(companion)}>
                      Entrainer
                    </button>
                    <div className="companion-action-tooltip" role="tooltip">
                      {costText(trainingCost)}
                    </div>
                  </div>
                  <div className="companion-action-chip">
                    <button
                      type="button"
                      className="secondary"
                      disabled={current.affinity >= 5}
                      onClick={() => raiseAffinity(companion)}
                    >
                      Affinite
                    </button>
                    <div className="companion-action-tooltip" role="tooltip">
                      {current.affinity >= 5 ? 'Affinite maximale' : costText(affinityCost)}
                    </div>
                  </div>
                  {CONVERSATION_ACTIVITY_BY_COMPANION[companion.id] ? (
                    <div className="companion-action-chip">
                      <button
                        type="button"
                        className="secondary"
                        onClick={() =>
                          tryLaunchMinigame(CONVERSATION_ACTIVITY_BY_COMPANION[companion.id])
                        }
                      >
                        Parler
                      </button>
                      <div className="companion-action-tooltip" role="tooltip">
                        {costText(CONVERSATION_LAUNCH_COST)}
                      </div>
                    </div>
                  ) : null}
                  {companion.id === 'lyra' ? (
                    <div className="companion-action-chip">
                      <button
                        className="secondary"
                        type="button"
                        onClick={() => setLive2dDemoOpen(true)}
                      >
                        Live2D
                      </button>
                      <div className="companion-action-tooltip" role="tooltip">
                        Demo Live2D (Haru)
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </>
  )

  const renderGallery = () => (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Mode developpement</p>
          <h2>Galerie visuels compagnons</h2>
        </div>
        <p>
          Catalogue dev : paliers d&apos;affinité, émotions, chibis et variantes NSFW Disagrea.
        </p>
      </section>

      <CompanionVisualDevGallery />
    </>
  )

  const renderVillageBuildingPanel = () => (
    <>
      <div className="card-topline">
        <span>Niveau {selectedBuildingLevel}</span>
        <span>Menu batiment</span>
      </div>
      <h3>{selectedBuilding.name}</h3>
      <p>{selectedBuilding.role}</p>
      <small>Production: {costText(selectedBuilding.produces)} / min</small>
      <button type="button" onClick={() => updateBuilding(selectedBuilding)}>
        Ameliorer - {costText(selectedBuildingCost)}
      </button>
      <div className="button-row compact">
        <button type="button" className="secondary" onClick={() => handleSelectView('buildings')}>
          Gestion
        </button>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            setFocusMinigameBuildingId(selectedBuilding.id)
            handleSelectView('miniGames')
          }}
        >
          Mini-jeu
        </button>
        <button type="button" className="secondary" onClick={() => handleSelectView('event')}>
          Gacha
        </button>
        <button type="button" className="secondary" onClick={() => handleSelectView('companions')}>
          Liens
        </button>
      </div>
    </>
  )

  const renderVillageMap = () => (
    <section className="village-map-panel">
      <div className="panorama-wrap panorama-wrap--fullscreen">
        <div className="panorama-map" aria-label="Carte interactive du village">
          <div className="map-overlay-badge">
            <span className="map-stage-caption">{getCurrentStage(game.village.stage).name}</span>
          </div>
          <VillagePanorama
            activeBuildingId={activeBuildingId}
            buildingInfos={Object.fromEntries(
              BUILDINGS.map((building) => [
                building.id,
                {
                  id: building.id,
                  name: building.name,
                  role: building.role,
                  production: `${costText(building.produces)} / min`,
                },
              ]),
            )}
            buildingLevels={game.buildings}
            lockedIds={
              new Set(
                BUILDINGS.filter(
                  (building) => !isBuildingUnlockedByStage(building.id, game.village.stage),
                ).map((b) => b.id),
              )
            }
            shortNames={BUILDING_SHORT_NAMES}
            spots={MAP_LABEL_SPOTS as MapLabelSpot[]}
            villageStage={game.village.stage}
            onSelect={(spot, locked) => {
              const building = BUILDINGS.find((item) => item.id === spot.buildingId) ?? BUILDINGS[0]
              if (locked) {
                const requiredStage = BUILDING_UNLOCK_STAGE[building.id] ?? 0
                setMessage(
                  `${building.name} se debloque au stade ${getCurrentStage(requiredStage).name}.`,
                )
                return
              }
              setActiveBuildingId(building.id)
              setFocusMinigameBuildingId(building.id)
              setVillagePanelOpen(true)
              setMessage(`${building.name}: ${spot.hint}.`)
            }}
          />
        </div>

        {villagePanelOpen ? (
          <>
            <button
              aria-label="Fermer le panneau batiment"
              className="map-detail-backdrop"
              type="button"
              onClick={() => setVillagePanelOpen(false)}
            />
            <aside className="map-detail map-detail-sheet map-detail-sheet--open">
              <button
                aria-label="Fermer"
                className="map-detail-close"
                type="button"
                onClick={() => setVillagePanelOpen(false)}
              >
                ×
              </button>
              {renderVillageBuildingPanel()}
            </aside>
          </>
        ) : null}
      </div>

      <button
        className={`village-collect-fab${villagePanelOpen ? ' village-collect-fab--panel-open' : ''}`}
        type="button"
        onClick={() => playMiniGame({ coins: 75, food: 45 }, 'Collecte rapide')}
      >
        Collecter
      </button>
    </section>
  )

  const showTopResourceStrip =
    !isMobileLayout &&
    !sidebarExpanded &&
    activeView !== 'village' &&
    activeView !== 'miniGames' &&
    activeView !== 'companions' &&
    activeView !== 'inventory'

  const topStripCompact = activeView === 'event'

  const shellClasses = [
    'shell',
    isMobileLayout ? 'shell--mobile' : '',
    isMobileLayout
      ? effectiveMobileNavOpen
        ? 'shell--mobile-nav-open'
        : 'shell--mobile-nav-closed'
      : sidebarExpanded
        ? 'shell--sidebar-expanded'
        : 'shell--sidebar-collapsed',
    activeMinigameActivityId ? 'shell--minigame-active' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const navProps = {
    activeView,
    expanded: isMobileLayout ? true : sidebarExpanded,
    population: game.village.population,
    resourcesPanel: (
      <ResourceStrip
        layout="vertical"
        perMinute={perMinute}
        resources={game.resources}
        variant="flyout"
      />
    ),
    tabs: VIEW_TABS,
    villageStageName: getCurrentStage(game.village.stage).name,
    onSelect: handleSelectView,
    onToggleExpanded: () => {
      if (isMobileLayout) {
        setMobileNavOpen(false)
        return
      }
      setSidebarExpanded((current) => !current)
    },
  }

  return (
    <main className={shellClasses}>
      {isMobileLayout ? (
        <>
          <div
            aria-hidden={!effectiveMobileNavOpen}
            className={`shell-nav-drawer${effectiveMobileNavOpen ? ' shell-nav-drawer--open' : ''}`}
          >
            <AppNav drawer {...navProps} />
          </div>
          {!activeMinigameActivityId && !effectiveMobileNavOpen ? (
            <button
              aria-expanded={false}
              aria-label="Menu du village"
              className="shell-menu-fab"
              type="button"
              onClick={() => setMobileNavOpen(true)}
            >
              <span aria-hidden="true">☰</span>
            </button>
          ) : null}
        </>
      ) : (
        <AppNav {...navProps} />
      )}

      <div className="shell-main">
        {showTopResourceStrip ? (
          <ResourceStrip
            compact={topStripCompact}
            perMinute={perMinute}
            resources={game.resources}
          />
        ) : null}

        <div className={`view-stage view-stage--${activeView}`}>
        {activeView === 'village' && renderVillageMap()}
        {activeView === 'buildings' && renderBuildingCards()}
        {activeView === 'quests' && renderQuests()}
        {activeView === 'miniGames' && renderMiniGames()}
        {activeView === 'event' && renderEvent()}
        {activeView === 'inventory' && renderInventory()}
        {activeView === 'companions' && renderCompanions()}
        {activeView === 'settings' && <SettingsPanel />}
        {activeView === 'gallery' && (
          <>
            {renderGallery()}
            <section className="design-notes">
              <h2>Notes de design</h2>
              <div className="notes-grid">
                <p>
                  <strong>Anti-FOMO.</strong> La progression hors-ligne est plafonnee
                  a une semaine et recoltee au lancement.
                </p>
                <p>
                  <strong>Monetisation.</strong> Le gacha consomme uniquement des
                  tickets gagnes par production, mini-jeux ou events.
                </p>
                <p>
                  <strong>Contenu adulte.</strong> Les paliers 4-5 proposent des scenes
                  suggestives non explicites, avec personnages adultes et consentement
                  clair dans la fiction.
                </p>
              </div>
              <button type="button" className="danger" onClick={resetGame}>
                Reinitialiser la sauvegarde locale
              </button>
            </section>
          </>
        )}
        </div>

        {message ? (
          <div aria-live="polite" className="game-toast" role="status">
            {message}
          </div>
        ) : null}
      </div>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        />
      )}

      {gachaOpening && (
        <GachaOpening
          items={gachaOpening.items}
          variant={gachaOpening.variant}
          onClose={() => setGachaOpening(null)}
        />
      )}

      {live2dDemoOpen && (
        <Suspense fallback={null}>
          <Live2DDemo onClose={() => setLive2dDemoOpen(false)} />
        </Suspense>
      )}

      {activeMinigameActivityId && (() => {
        const activity = getActivityById(activeMinigameActivityId)
        if (!activity) return null
        const building = BUILDINGS.find((item) => item.id === activity.buildingId)
        const companion = COMPANIONS.find((item) => item.id === activity.companionId)
        if (!building || !companion) return null
        const companionState = game.companions[companion.id]
        return (
          <MinigamePlayer
            activity={activity}
            buildingName={building.name}
            companionAffinity={companionState?.affinity ?? 1}
            companionName={companion.name}
            conversationRewardMultiplier={
              companionState ? conversationRewardMultiplier(companionState.stats) : 1
            }
            minigameSave={game.minigameSave}
            resourceLabel={RESOURCE_LABELS[activity.focusResource]}
            onClose={() => setActiveMinigameActivityId(null)}
            onComplete={(miniScore, maxScore, reward, options) =>
              completeMinigame(activity.id, reward, activity.name, miniScore, maxScore, options)
            }
            onSaveMinigame={saveMinigameProgress}
            onLaunchMinigame={tryLaunchMinigame}
          />
        )
      })()}
    </main>
  )
}

export default App
