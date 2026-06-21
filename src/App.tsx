import { lazy, Suspense, useEffect, useState } from 'react'
import { GachaOpening } from './components/GachaOpening'
import { ImageLightbox, type LightboxImage } from './components/ImageLightbox'
import { VillageMapLabels, type MapLabelSpot } from './components/VillageMapLabels'
import { DEV_UNLIMITED_GACHA, rollMulti, type GachaItem } from './data/gacha'
import './App.css'

const Live2DDemo = lazy(() =>
  import('./components/Live2DDemo').then((module) => ({ default: module.Live2DDemo })),
)

type ViewKey =
  | 'village'
  | 'buildings'
  | 'miniGames'
  | 'event'
  | 'companions'
  | 'gallery'

type ResourceKey =
  | 'coins'
  | 'wood'
  | 'stone'
  | 'food'
  | 'silk'
  | 'mana'
  | 'renown'
  | 'ingredients'
  | 'crystals'
  | 'gifts'
  | 'tickets'
  | 'stardust'

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
}

type GameState = {
  resources: Resources
  buildings: Record<string, number>
  companions: Record<string, CompanionState>
  skins: string[]
  eventPulls: number
  maturePlaceholders: boolean
  lastSaved: number
}

type OfflineReport = {
  cappedHours: number
  gains: Resources
}

const STORAGE_KEY = 'idle-isekai-chill-game-v1'
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
]

const MINI_GAMES = [
  {
    name: 'Cuisine minute',
    description: 'Prepare un banquet et gagne vivres, pieces et ingredients.',
    reward: { food: 180, coins: 120, ingredients: 35 },
  },
  {
    name: 'Livraisons relax',
    description: 'Optimise une route simple sans energie limitee.',
    reward: { wood: 120, stone: 90, renown: 18 },
  },
  {
    name: 'Concert au theatre',
    description: 'Un rythme leger pour booster le renom du village.',
    reward: { renown: 45, tickets: 1, gifts: 18 },
  },
  {
    name: 'Exploration douce',
    description: 'Fouille automatique sans risque de blocage.',
    reward: { mana: 80, crystals: 25, stardust: 9 },
  },
] satisfies { name: string; description: string; reward: Cost }[]

const VIEW_TABS: { key: ViewKey; label: string; icon: string }[] = [
  { key: 'village', label: 'Village', icon: 'MAP' },
  { key: 'buildings', label: 'Batiments', icon: 'UP' },
  { key: 'miniGames', label: 'Mini-jeux', icon: 'MG' },
  { key: 'event', label: 'Event', icon: 'EV' },
  { key: 'companions', label: 'Liens', icon: 'LI' },
  { key: 'gallery', label: 'Dev visuels', icon: 'DEV' },
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

type MapSpotDraft = {
  id: string
  buildingId: string
  x: number
  y: number
  hint: string
  targetView: ViewKey
}

const MAP_SPOT_DRAFTS: MapSpotDraft[] = [
  {
    id: 'map-library',
    buildingId: 'arcane-library',
    x: 12,
    y: 10,
    hint: 'Progression et lore',
    targetView: 'gallery',
  },
  {
    id: 'map-garden',
    buildingId: 'mist-garden',
    x: 18,
    y: 17,
    hint: 'Vivres, ingredients, cadeaux',
    targetView: 'buildings',
  },
  {
    id: 'map-spring',
    buildingId: 'clear-spring',
    x: 50,
    y: 28,
    hint: 'Repos, mana, relations',
    targetView: 'companions',
  },
  {
    id: 'map-market',
    buildingId: 'star-market',
    x: 82,
    y: 13,
    hint: 'Gacha saisonnier',
    targetView: 'event',
  },
  {
    id: 'map-inn',
    buildingId: 'inn',
    x: 22,
    y: 49,
    hint: 'Mini-jeu auberge et revenus',
    targetView: 'miniGames',
  },
  {
    id: 'map-workshop',
    buildingId: 'ribbon-workshop',
    x: 74,
    y: 38,
    hint: 'Soie, cadeaux, craft',
    targetView: 'buildings',
  },
  {
    id: 'map-theater',
    buildingId: 'traveler-theater',
    x: 58,
    y: 62,
    hint: 'Concerts et mini-jeux',
    targetView: 'miniGames',
  },
  {
    id: 'map-farm',
    buildingId: 'moon-farm',
    x: 88,
    y: 76,
    hint: 'Production passive',
    targetView: 'buildings',
  },
]

const MAP_LABEL_SPOTS: MapLabelSpot[] = MAP_SPOT_DRAFTS.map((spot) => ({
  id: spot.id,
  buildingId: spot.buildingId,
  x: spot.x,
  y: spot.y,
  hint: spot.hint,
  targetView: spot.targetView,
}))

const BUILDING_ICON = (buildingId: string) => `/buildings/${buildingId}.png`

const EXTERNAL_ASSET_ROOT = '/companions'

const companionAssetPath = (companionId: string, level: number) =>
  `${EXTERNAL_ASSET_ROOT}/${companionId}/affinity-${level}.png`

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
  const [failed, setFailed] = useState(false)
  const scene = companion.scenes[level - 1]
  const externalPath = companionAssetPath(companion.id, level)

  return (
    <button
      className={`companion-visual affinity-${level} ${compact ? 'compact' : ''} ${level >= 4 ? 'mature-slot' : ''}`}
      type="button"
      onClick={onOpen}
      aria-label={`Agrandir ${companion.name} affinite ${level}`}
    >
      {!failed && (
        <img
          src={externalPath}
          alt={`${companion.name} affinite ${level}`}
          onError={() => setFailed(true)}
        />
      )}
      <div className="visual-placeholder">
        <strong>{visualFallback(companion, level)}</strong>
        <span>{scene.title}</span>
        <small>{failed ? 'Placeholder interne' : 'Cliquer pour agrandir'}</small>
      </div>
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

const createStarterGame = (): GameState => ({
  resources: starterResources(),
  buildings: Object.fromEntries(BUILDINGS.map((building) => [building.id, 1])),
  companions: Object.fromEntries(
    COMPANIONS.map((companion) => [companion.id, { level: 1, affinity: 1 }]),
  ),
  skins: [],
  eventPulls: 0,
  maturePlaceholders: false,
  lastSaved: Date.now(),
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

const villageScore = (game: GameState) =>
  Object.values(game.buildings).reduce((total, level) => total + level, 0)

const productionPerMinute = (game: GameState): Resources => {
  const production = emptyResources()
  for (const building of BUILDINGS) {
    const level = game.buildings[building.id] ?? 0
    if (level <= 0 || villageScore(game) < building.unlockAt) continue
    for (const key of RESOURCE_KEYS) {
      production[key] += (building.produces[key] ?? 0) * level
    }
  }

  for (const companion of COMPANIONS) {
    const state = game.companions[companion.id]
    if (!state) continue
    const affectionMultiplier = 1 + state.affinity * 0.08
    production[companion.bonusResource] +=
      state.level * 2.5 * affectionMultiplier
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

const loadInitialSession = () => {
  if (typeof window === 'undefined') {
    return { game: createStarterGame(), report: { cappedHours: 0, gains: emptyResources() } }
  }

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { game: createStarterGame(), report: { cappedHours: 0, gains: emptyResources() } }
  }

  try {
    const parsed = JSON.parse(raw) as GameState
    const migrated: GameState = {
      ...createStarterGame(),
      ...parsed,
      resources: { ...starterResources(), ...parsed.resources },
      buildings: { ...createStarterGame().buildings, ...parsed.buildings },
      companions: { ...createStarterGame().companions, ...parsed.companions },
      skins: parsed.skins ?? [],
      maturePlaceholders: parsed.maturePlaceholders ?? false,
    }
    return applyOfflineProgress(migrated)
  } catch {
    return { game: createStarterGame(), report: { cappedHours: 0, gains: emptyResources() } }
  }
}

const initialSession = loadInitialSession()

function App() {
  const [game, setGame] = useState<GameState>(initialSession.game)
  const [offlineReport] = useState<OfflineReport>(initialSession.report)
  const [message, setMessage] = useState(
    offlineReport.cappedHours > 0.01
      ? `Progression hors-ligne recoltee: ${offlineReport.cappedHours.toFixed(1)} h.`
      : 'Bienvenue dans ton village chill.',
  )
  const [activeView, setActiveView] = useState<ViewKey>('village')
  const [activeBuildingId, setActiveBuildingId] = useState(BUILDINGS[0].id)
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null)
  const [gachaResults, setGachaResults] = useState<GachaItem[] | null>(null)
  const [live2dDemoOpen, setLive2dDemoOpen] = useState(false)

  const openCompanionLightbox = (companion: Companion, level: number) => {
    const images: LightboxImage[] = companion.scenes.map((scene) => ({
      src: companionAssetPath(companion.id, scene.level),
      alt: `${companion.name} affinite ${scene.level}`,
      caption: `${companion.name} — ${scene.title}`,
    }))
    setLightbox({ images, index: level - 1 })
  }

  const score = villageScore(game)
  const perMinute = productionPerMinute(game)

  useEffect(() => {
    const payload: GameState = { ...game, lastSaved: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  }, [game])

  useEffect(() => {
    const id = window.setInterval(() => {
      setGame((current) => {
        const tickProduction = productionPerMinute(current)
        const gains = emptyResources()
        for (const key of RESOURCE_KEYS) {
          gains[key] = tickProduction[key] / 12
        }
        return { ...current, resources: mergeResources(current.resources, gains) }
      })
    }, 5000)

    return () => window.clearInterval(id)
  }, [])

  const updateBuilding = (building: Building) => {
    if (score < building.unlockAt) {
      setMessage(`${building.name} se debloque avec un score village de ${building.unlockAt}.`)
      return
    }

    const level = game.buildings[building.id] ?? 1
    const cost = multiplyCost(building.baseCost, Math.pow(1.48, level - 1))

    if (!canAfford(game.resources, cost)) {
      setMessage(`Ressources insuffisantes pour ameliorer ${building.name}.`)
      return
    }

    setGame((current) => ({
      ...current,
      resources: spendResources(current.resources, cost),
      buildings: { ...current.buildings, [building.id]: level + 1 },
    }))
    setMessage(`${building.name} passe niveau ${level + 1}.`)
  }

  const trainCompanion = (companion: Companion) => {
    const current = game.companions[companion.id]
    const cost = multiplyCost(
      { coins: 120, mana: 30, gifts: 12 },
      Math.pow(1.35, current.level - 1),
    )

    if (!canAfford(game.resources, cost)) {
      setMessage(`Il manque des ressources pour entrainer ${companion.name}.`)
      return
    }

    setGame((previous) => ({
      ...previous,
      resources: spendResources(previous.resources, cost),
      companions: {
        ...previous.companions,
        [companion.id]: { ...current, level: current.level + 1 },
      },
    }))
    setMessage(`${companion.name} gagne un niveau.`)
  }

  const raiseAffinity = (companion: Companion) => {
    const current = game.companions[companion.id]
    if (current.affinity >= 5) {
      setMessage(`${companion.name} est deja au lien maximum.`)
      return
    }

    const cost = multiplyCost(
      { gifts: 25, renown: 18, silk: 10 },
      Math.pow(1.55, current.affinity - 1),
    )

    if (!canAfford(game.resources, cost)) {
      setMessage(`Il manque des cadeaux pour renforcer le lien avec ${companion.name}.`)
      return
    }

    setGame((previous) => ({
      ...previous,
      resources: spendResources(previous.resources, cost),
      companions: {
        ...previous.companions,
        [companion.id]: { ...current, affinity: current.affinity + 1 },
      },
    }))
    setMessage(`Affinite ${current.affinity + 1} debloquee avec ${companion.name}.`)
  }

  const playMiniGame = (reward: Cost, name: string) => {
    setGame((current) => ({
      ...current,
      resources: mergeResources(current.resources, reward),
    }))
    setMessage(`${name} termine. Recompenses ajoutees.`)
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
    const collectibleNames = items
      .filter((item) => item.kind === 'skin' || item.kind === 'decor' || item.kind === 'guest')
      .map((item) => item.name)

    setGame((current) => ({
      ...current,
      resources: DEV_UNLIMITED_GACHA
        ? current.resources
        : spendResources(current.resources, { tickets: count }),
      eventPulls: current.eventPulls + count,
      skins: Array.from(new Set([...current.skins, ...collectibleNames])),
    }))
    setGachaResults(items)
    setMessage(`Invocation x${count} lancee${DEV_UNLIMITED_GACHA ? ' (mode dev illimite)' : ''}.`)
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
          const locked = score < building.unlockAt
          const cost = multiplyCost(building.baseCost, Math.pow(1.48, level - 1))

          return (
            <article className={`panel ${locked ? 'locked' : ''}`} key={building.id}>
              <div className="building-thumb">
                <img src={BUILDING_ICON(building.id)} alt="" />
              </div>
              <div className="card-topline">
                <span>Niveau {level}</span>
                <span>{locked ? `Score ${building.unlockAt}` : 'Disponible'}</span>
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

  const renderMiniGames = () => (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Routine</p>
          <h2>Mini-jeux fixes</h2>
        </div>
        <p>Des actions courtes sans energie bloquante pour garder du rythme.</p>
      </section>

      <section className="grid mini-grid">
        {MINI_GAMES.map((miniGame) => (
          <article className="panel" key={miniGame.name}>
            <h3>{miniGame.name}</h3>
            <p>{miniGame.description}</p>
            <small>Gain: {costText(miniGame.reward)}</small>
            <button type="button" onClick={() => playMiniGame(miniGame.reward, miniGame.name)}>
              Jouer
            </button>
          </article>
        ))}
      </section>
    </>
  )

  const renderEvent = () => (
    <>
      <section className="section-heading">
        <div>
          <p className="eyebrow">Evenement</p>
          <h2>Festival saisonnier sans paiement</h2>
        </div>
        <p>
          Un ticket par tirage, pity garanti toutes les 10 invocations. Les
          tickets se gagnent en jeu.
        </p>
      </section>

      <section className="event-panel">
        <div>
          <h3>Banniere: Festival des lanternes</h3>
          <p>
            Skins, decors et invites exclusifs. Raretes: N, R, SR, SSR, UR, LR.
            Tirages effectues: {game.eventPulls}. Pity SSR+ toutes les 10
            invocations, UR a 50, LR a 100.
          </p>
          <div className="gacha-pull-actions">
            {[1, 10, 50, 100].map((count) => (
              <button
                className={count === 10 ? 'primary' : 'secondary'}
                key={count}
                type="button"
                onClick={() => startGachaPull(count)}
              >
                Tirer x{count}
              </button>
            ))}
          </div>
          <small>{formatAmount(game.resources.tickets)} tickets disponibles</small>
          {DEV_UNLIMITED_GACHA && (
            <span className="gacha-dev-note">Mode dev: tirages illimites actifs</span>
          )}
        </div>
        <div className="skin-list">
          {game.skins.length === 0 ? (
            <span>Aucun lot obtenu pour le moment.</span>
          ) : (
            game.skins.map((skin) => <span key={skin}>{skin}</span>)
          )}
        </div>
      </section>
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
          Afficher les emplacements mature non explicites
        </label>
      </section>

      <section className="companion-grid">
        {COMPANIONS.map((companion) => {
          const current = game.companions[companion.id]
          const activeScene = companion.scenes[current.affinity - 1]
          const trainingCost = multiplyCost(
            { coins: 120, mana: 30, gifts: 12 },
            Math.pow(1.35, current.level - 1),
          )
          const affinityCost = multiplyCost(
            { gifts: 25, renown: 18, silk: 10 },
            Math.pow(1.55, current.affinity - 1),
          )

          return (
            <article className="companion-card" key={companion.id}>
              <div
                className="portrait portrait-clickable"
                aria-hidden="true"
                onClick={() => openCompanionLightbox(companion, 1)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') openCompanionLightbox(companion, 1)
                }}
                role="button"
                tabIndex={0}
              >
                <img
                  src={companionAssetPath(companion.id, 1)}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <span>{companion.name.slice(0, 1)}</span>
              </div>
              <div className="companion-body">
                <div className="card-topline">
                  <span>Niv. {current.level}</span>
                  <span>Affinite {current.affinity}/5</span>
                </div>
                <h3>{companion.name}</h3>
                <p>{companion.archetype} - {companion.talent}</p>
                <small>Cadeau prefere: {companion.favoriteGift}</small>
                <CompanionVisual
                  companion={companion}
                  level={current.affinity}
                  onOpen={() => openCompanionLightbox(companion, current.affinity)}
                />
                <div className="scene-box">
                  <strong>{activeScene.title}</strong>
                  <p>{activeScene.summary}</p>
                  <small>{activeScene.artDirection}</small>
                </div>
                {game.maturePlaceholders && current.affinity >= 4 && (
                  <div className="mature-note">
                    Paliers 4-5: contenu mature suggestif uniquement. Tous les
                    personnages sont adultes et consentants dans la fiction.
                  </div>
                )}
                <div className="button-row">
                  <button type="button" onClick={() => trainCompanion(companion)}>
                    Entrainer - {costText(trainingCost)}
                  </button>
                  <button type="button" className="secondary" onClick={() => raiseAffinity(companion)}>
                    Affinite - {current.affinity >= 5 ? 'max' : costText(affinityCost)}
                  </button>
                </div>
                {companion.id === 'lyra' && (
                  <button
                    className="secondary live2d-launch"
                    type="button"
                    onClick={() => setLive2dDemoOpen(true)}
                  >
                    Demo Live2D (Haru)
                  </button>
                )}
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
          Cette vue ignore le deblocage. Ajoute plus tard tes fichiers externes
          dans <code>public/companions/&lt;id&gt;/affinity-&lt;niveau&gt;.png</code>.
        </p>
      </section>

      <section className="gallery-grid">
        {COMPANIONS.map((companion) => (
          <article className="gallery-card" key={companion.id}>
            <div>
              <h3>{companion.name}</h3>
              <p>{companion.archetype}</p>
            </div>
            <div className="affinity-strip">
              {companion.scenes.map((scene) => (
                <CompanionVisual
                  compact
                  companion={companion}
                  key={scene.level}
                  level={scene.level}
                  onOpen={() => openCompanionLightbox(companion, scene.level)}
                />
              ))}
            </div>
            <small className="asset-path">
              Exemple: {companionAssetPath(companion.id, 1)}
            </small>
          </article>
        ))}
      </section>
    </>
  )

  const renderVillageMap = () => (
    <section className="village-map-panel">
      <div className="map-copy">
        <p className="eyebrow">Accueil interactif</p>
        <h2>Havre des Brumes</h2>
        <p>
          Clique sur le nom d un batiment pour ouvrir son menu et voir la
          production du niveau actuel.
        </p>
      </div>

      <div className="panorama-wrap">
        <div className="panorama-map" aria-label="Carte interactive du village">
          <img alt="" className="panorama-image" draggable={false} src="/village/panorama.png" />
          <VillageMapLabels
            activeBuildingId={activeBuildingId}
            levels={game.buildings}
            lockedIds={new Set(BUILDINGS.filter((building) => score < building.unlockAt).map((b) => b.id))}
            shortNames={BUILDING_SHORT_NAMES}
            spots={MAP_LABEL_SPOTS}
            onSelect={(spot, locked) => {
              const building = BUILDINGS.find((item) => item.id === spot.buildingId) ?? BUILDINGS[0]
              if (locked) {
                setMessage(`${building.name} se debloque avec un score village de ${building.unlockAt}.`)
                return
              }
              setActiveBuildingId(building.id)
              setMessage(`${building.name}: ${spot.hint}.`)
            }}
          />
        </div>

        <aside className="map-detail">
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
            <button type="button" className="secondary" onClick={() => setActiveView('buildings')}>
              Gestion
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                const spot = MAP_LABEL_SPOTS.find((item) => item.buildingId === selectedBuilding.id)
                setActiveView(spot?.targetView ?? 'buildings')
              }}
            >
              Option liee
            </button>
          </div>
        </aside>
      </div>
    </section>
  )

  return (
    <main className="shell">
      <section className="top-panel">
        <div>
          <p className="eyebrow">Idle isekai chill game</p>
          <h1>Havre des Brumes</h1>
          <p className="hero-copy">
            Un prototype original jouable mobile et PC: recolte hors-ligne,
            village evolutif, compagnons, affinite et evenements gacha sans
            microtransactions.
          </p>
          <div className="hero-actions">
            <button type="button" onClick={() => playMiniGame({ coins: 75, food: 45 }, 'Collecte rapide')}>
              Tout collecter
            </button>
            <button type="button" className="secondary" onClick={() => setActiveView('event')}>
              Ouvrir le gacha
            </button>
          </div>
        </div>
        <aside className="status-card">
          <span>Score village</span>
          <strong>{score}</strong>
          <small>Cap hors-ligne: {OFFLINE_CAP_HOURS} h</small>
        </aside>
      </section>

      <nav className="view-tabs" aria-label="Navigation principale">
        {VIEW_TABS.map((tab) => (
          <button
            className={activeView === tab.key ? 'active' : ''}
            key={tab.key}
            type="button"
            onClick={() => setActiveView(tab.key)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="message-bar" aria-live="polite">
        {message}
      </section>

      <section className="grid resources-grid" aria-label="Ressources">
        {RESOURCE_KEYS.map((key) => (
          <article className="resource-card" key={key}>
            <span>{RESOURCE_LABELS[key]}</span>
            <strong>{formatAmount(game.resources[key])}</strong>
            <small>+{formatAmount(perMinute[key])} / min</small>
          </article>
        ))}
      </section>

      {activeView === 'village' && renderVillageMap()}
      {activeView === 'buildings' && renderBuildingCards()}
      {activeView === 'miniGames' && renderMiniGames()}
      {activeView === 'event' && renderEvent()}
      {activeView === 'companions' && renderCompanions()}
      {activeView === 'gallery' && renderGallery()}

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

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
        />
      )}

      {gachaResults && (
        <GachaOpening items={gachaResults} onClose={() => setGachaResults(null)} />
      )}

      {live2dDemoOpen && (
        <Suspense fallback={null}>
          <Live2DDemo onClose={() => setLive2dDemoOpen(false)} />
        </Suspense>
      )}
    </main>
  )
}

export default App
