import { useEffect, useState, type CSSProperties } from 'react'
import './App.css'

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
      'Emplacement mature verrouille: le prototype garde cette etape en fade-to-black.',
    artDirection:
      'Placeholder narratif uniquement. Prevoir age gate, consentement clair et personnages adultes.',
  },
  {
    level: 5,
    title: 'Lien maximum',
    summary:
      'Emplacement mature verrouille: conclusion relationnelle hors champ dans cette version.',
    artDirection:
      'Placeholder non explicite. Utiliser des assets externes legaux si tu choisis de les ajouter hors de ce prototype.',
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

const EVENT_REWARDS = [
  'Skin: Kimono des lucioles',
  'Skin: Robe de givre',
  'Skin: Tenue de bal celeste',
  'Personnage invite: Oria',
  'Personnage invite: Vesper',
  'Decor: Festival des lanternes',
  'Decor: Jardin enneige',
  'Decor: Pluie de meteores',
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

const MAP_SPOTS: {
  id: string
  buildingId: string
  x: number
  y: number
  icon: string
  hint: string
  targetView: ViewKey
}[] = [
  {
    id: 'map-inn',
    buildingId: 'inn',
    x: 20,
    y: 50,
    icon: 'INN',
    hint: 'Mini-jeu auberge et revenus',
    targetView: 'miniGames',
  },
  {
    id: 'map-garden',
    buildingId: 'mist-garden',
    x: 34,
    y: 25,
    icon: 'GRD',
    hint: 'Vivres, ingredients, cadeaux',
    targetView: 'buildings',
  },
  {
    id: 'map-workshop',
    buildingId: 'ribbon-workshop',
    x: 68,
    y: 38,
    icon: 'WRK',
    hint: 'Soie, cadeaux, craft',
    targetView: 'buildings',
  },
  {
    id: 'map-spring',
    buildingId: 'clear-spring',
    x: 51,
    y: 18,
    icon: 'SPG',
    hint: 'Repos, mana, relations',
    targetView: 'companions',
  },
  {
    id: 'map-farm',
    buildingId: 'moon-farm',
    x: 18,
    y: 78,
    icon: 'FRM',
    hint: 'Production passive',
    targetView: 'buildings',
  },
  {
    id: 'map-library',
    buildingId: 'arcane-library',
    x: 79,
    y: 24,
    icon: 'LIB',
    hint: 'Progression et lore',
    targetView: 'gallery',
  },
  {
    id: 'map-theater',
    buildingId: 'traveler-theater',
    x: 60,
    y: 70,
    icon: 'THR',
    hint: 'Concerts et mini-jeux',
    targetView: 'miniGames',
  },
  {
    id: 'map-market',
    buildingId: 'star-market',
    x: 84,
    y: 62,
    icon: 'EVE',
    hint: 'Gacha saisonnier',
    targetView: 'event',
  },
]

const EXTERNAL_ASSET_ROOT = '/companions'

const companionAssetPath = (companionId: string, level: number) =>
  `${EXTERNAL_ASSET_ROOT}/${companionId}/affinity-${level}.png`

const visualFallback = (companion: Companion, level: number) =>
  `${companion.name.slice(0, 1)}${level}`

function CompanionVisual({
  companion,
  level,
  compact = false,
}: {
  companion: Companion
  level: number
  compact?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const scene = companion.scenes[level - 1]
  const externalPath = companionAssetPath(companion.id, level)

  return (
    <div className={`companion-visual ${compact ? 'compact' : ''} ${level >= 4 ? 'mature-slot' : ''}`}>
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
        <small>{failed ? 'Placeholder interne' : 'Image externe si presente'}</small>
      </div>
    </div>
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

  const pullEvent = () => {
    const cost: Cost = { tickets: 1 }
    if (!canAfford(game.resources, cost)) {
      setMessage('Il te faut au moins 1 ticket pour invoquer.')
      return
    }

    const pityHit = (game.eventPulls + 1) % 10 === 0
    const reward = pityHit
      ? EVENT_REWARDS[(game.eventPulls / 10) % EVENT_REWARDS.length]
      : EVENT_REWARDS[Math.floor(Math.random() * EVENT_REWARDS.length)]

    setGame((current) => ({
      ...current,
      resources: spendResources(current.resources, cost),
      skins: Array.from(new Set([...current.skins, reward])),
      eventPulls: current.eventPulls + 1,
    }))
    setMessage(`${pityHit ? 'Pity garanti' : 'Tirage'}: ${reward}.`)
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
            Skins, decors et invites exclusifs. Tirages effectues:{' '}
            {game.eventPulls}. Prochain pity dans{' '}
            {10 - (game.eventPulls % 10 || 10)} tirages.
          </p>
          <button type="button" onClick={pullEvent}>Tirer x1</button>
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
              <div className="portrait" aria-hidden="true">
                {companion.name.slice(0, 1)}
              </div>
              <div className="companion-body">
                <div className="card-topline">
                  <span>Niv. {current.level}</span>
                  <span>Affinite {current.affinity}/5</span>
                </div>
                <h3>{companion.name}</h3>
                <p>{companion.archetype} - {companion.talent}</p>
                <small>Cadeau prefere: {companion.favoriteGift}</small>
                <CompanionVisual companion={companion} level={current.affinity} />
                <div className="scene-box">
                  <strong>{activeScene.title}</strong>
                  <p>{activeScene.summary}</p>
                  <small>{activeScene.artDirection}</small>
                </div>
                {game.maturePlaceholders && (
                  <div className="mature-note">
                    Paliers 4-5: placeholders seulement, avec consentement,
                    age gate et assets legaux a fournir separement.
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
          Selectionne un batiment sur la carte pour ouvrir son menu. La carte
          est un prototype CSS panoramique: les vraies illustrations pourront
          remplacer chaque zone plus tard.
        </p>
      </div>

      <div className="panorama-wrap">
        <div className="panorama-map" aria-label="Carte interactive du village">
          <div className="river" />
          <div className="road road-main" />
          <div className="road road-side" />
          {MAP_SPOTS.map((spot) => {
            const building = BUILDINGS.find((item) => item.id === spot.buildingId) ?? BUILDINGS[0]
            const level = game.buildings[building.id] ?? 1
            const locked = score < building.unlockAt

            return (
              <button
                className={`map-node ${activeBuildingId === building.id ? 'active' : ''} ${locked ? 'locked' : ''}`}
                key={spot.id}
                style={{ '--x': `${spot.x}%`, '--y': `${spot.y}%` } as CSSProperties}
                type="button"
                onClick={() => {
                  setActiveBuildingId(building.id)
                  setMessage(`${building.name}: ${spot.hint}.`)
                }}
              >
                <span className="map-icon">{spot.icon}</span>
                <span className="map-name">{building.name}</span>
                <small>Niv. {level}</small>
              </button>
            )
          })}
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
                const spot = MAP_SPOTS.find((item) => item.buildingId === selectedBuilding.id)
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
            <button type="button" className="secondary" onClick={pullEvent}>
              Tirage evenement
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
            <strong>Contenu adulte.</strong> Le code gere les paliers et
            emplacements, mais ne contient pas de scene explicite ni d asset
            copie.
          </p>
        </div>
        <button type="button" className="danger" onClick={resetGame}>
          Reinitialiser la sauvegarde locale
        </button>
      </section>
    </main>
  )
}

export default App
