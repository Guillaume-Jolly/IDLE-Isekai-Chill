export type ResourceKey =
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

export type Cost = Partial<Record<ResourceKey, number>>

export type MinigameType =
  | 'tap-sequence'
  | 'harvest-rush'
  | 'timing-bar'
  | 'bubble-pop'
  | 'tile-merge'
  | 'memory-pairs'
  | 'beat-tap'
  | 'swap-match'
  | 'tower-defense'
  | 'idle-farm'
  | 'pet-sanctuary'
  | 'familiar-capture'
  | 'dressage'
  | 'conversation'
  | 'myrion-worksite'

/** Mini-jeux peaufinés — affichés en tête du hub (avant le tri stade/bâtiment). */
export const FEATURED_MINIGAME_IDS: readonly string[] = [
  'farm-capture',
  'farm-dressage',
  'farm-pets',
]

export type BuildingActivity = {
  id: string
  buildingId: string
  companionId: string
  focusResource: ResourceKey
  minigameType: MinigameType
  name: string
  tagline: string
  inspiration: string
  description: string
  baseReward: Cost
  accent: string
  icon: string
  persistent?: boolean
}

export const BUILDING_ACTIVITIES: BuildingActivity[] = [
  {
    id: 'inn-service',
    buildingId: 'inn',
    companionId: 'nami',
    focusResource: 'food',
    minigameType: 'tap-sequence',
    name: 'Service Express',
    tagline: 'Auberge du Passage',
    inspiration: 'Cooking Mama / Diner Dash',
    description:
      'Nami enchaine les commandes des voyageurs. Retape les plats dans le bon ordre avant que la cloche sonne.',
    baseReward: { food: 120, coins: 80, ingredients: 20 },
    accent: '#ff8f6b',
    icon: '🍲',
  },
  {
    id: 'garden-td',
    buildingId: 'mist-garden',
    companionId: 'iris',
    focusResource: 'ingredients',
    minigameType: 'tower-defense',
    name: 'Herbes vs Brume',
    tagline: 'Jardin des Brumes',
    inspiration: 'Plants vs Zombies / Tower defense',
    description:
      'Iris plante des defenseurs magiques pour stopper les esprits de brume. Place des tireuses et des racines sur la pelouse.',
    baseReward: { ingredients: 100, food: 50, mana: 15 },
    accent: '#5cb86a',
    icon: '🌻',
  },
  {
    id: 'garden-harvest',
    buildingId: 'mist-garden',
    companionId: 'iris',
    focusResource: 'ingredients',
    minigameType: 'harvest-rush',
    name: 'Recolte Brumeuse',
    tagline: 'Jardin des Brumes',
    inspiration: 'Stardew Valley / Hay Day',
    description:
      'Iris cueille les herbes quand la brume les fait briller. Tape les parcelles pretes avant qu elles se fanent.',
    baseReward: { ingredients: 90, food: 60, gifts: 8 },
    accent: '#7ecf8a',
    icon: '🌿',
  },
  {
    id: 'workshop-thread',
    buildingId: 'ribbon-workshop',
    companionId: 'mira',
    focusResource: 'silk',
    minigameType: 'timing-bar',
    name: 'Fil d Or',
    tagline: 'Atelier des Rubans',
    inspiration: 'Perfect Ironing / rhythm tailor',
    description:
      'Mira coud des rubans enchantes. Clique quand l aiguille passe dans la zone doree.',
    baseReward: { silk: 70, gifts: 22, coins: 40 },
    accent: '#d486ff',
    icon: '🎀',
  },
  {
    id: 'spring-hearts',
    buildingId: 'clear-spring',
    companionId: 'solene',
    focusResource: 'stardust',
    minigameType: 'conversation',
    name: 'Coeur de Source',
    tagline: 'Source Claire — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description:
      'Trois echanges avec Solene. Adapte ton ton a sa douceur spirituelle : 3 bonnes reponses = recompense max.',
    baseReward: { stardust: 12, mana: 40, gifts: 18, renown: 10 },
    accent: '#ff9fd0',
    icon: '💬',
  },
  {
    id: 'library-hearts',
    buildingId: 'arcane-library',
    companionId: 'lyra',
    focusResource: 'stardust',
    minigameType: 'conversation',
    name: 'Pages partagees',
    tagline: 'Bibliotheque — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description:
      'Lyra est reservee : ecoute, sincerite, pas de flirts lourds. Trois bonnes reponses pour le maximum.',
    baseReward: { stardust: 10, mana: 35, silk: 15, renown: 8 },
    accent: '#b49bff',
    icon: '💬',
  },
  {
    id: 'theater-hearts',
    buildingId: 'traveler-theater',
    companionId: 'kael',
    focusResource: 'renown',
    minigameType: 'conversation',
    name: 'Coulisses du coeur',
    tagline: 'Theatre — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description:
      'Kael adore le jeu theatral : complimente avec style et joue la complicite.',
    baseReward: { renown: 22, gifts: 20, stardust: 8, coins: 50 },
    accent: '#ffb347',
    icon: '💬',
  },
  {
    id: 'farm-hearts',
    buildingId: 'moon-farm',
    companionId: 'talia',
    focusResource: 'gifts',
    minigameType: 'conversation',
    name: 'Feu de camp',
    tagline: 'Lisiere — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description:
      'Talia est directe et rieuse : humour leger et audace bienvenue.',
    baseReward: { gifts: 28, food: 35, stardust: 6, wood: 20 },
    accent: '#5ecf8a',
    icon: '💬',
  },
  {
    id: 'inn-hearts',
    buildingId: 'inn',
    companionId: 'seren',
    focusResource: 'renown',
    minigameType: 'conversation',
    name: 'Garde du havre',
    tagline: 'Auberge — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description:
      'Seren est froide et digne : respecte sa fierte, evite les compliments vides.',
    baseReward: { renown: 18, silk: 14, stardust: 8, coins: 45 },
    accent: '#7eb8ff',
    icon: '💬',
  },
  {
    id: 'garden-hearts',
    buildingId: 'mist-garden',
    companionId: 'iris',
    focusResource: 'ingredients',
    minigameType: 'conversation',
    name: 'Serre au clair de lune',
    tagline: 'Jardin — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Iris est reveuse : metaphores, nature, tendresse discrete.',
    baseReward: { ingredients: 30, stardust: 8, gifts: 12, mana: 20 },
    accent: '#8fd4a0',
    icon: '💬',
  },
  {
    id: 'kitchen-hearts',
    buildingId: 'mist-garden',
    companionId: 'nami',
    focusResource: 'food',
    minigameType: 'conversation',
    name: 'Four chaud',
    tagline: 'Cuisine — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Nami est chaleureuse : partage, humour doux, convivialite.',
    baseReward: { food: 55, gifts: 15, renown: 10, coins: 40 },
    accent: '#ffb86b',
    icon: '💬',
  },
  {
    id: 'workshop-hearts',
    buildingId: 'ribbon-workshop',
    companionId: 'mira',
    focusResource: 'silk',
    minigameType: 'conversation',
    name: 'Fil de confiance',
    tagline: 'Atelier — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Mira est artiste : sensibilite, elegance, mots choisis.',
    baseReward: { silk: 35, stardust: 10, gifts: 18, renown: 8 },
    accent: '#d486ff',
    icon: '💬',
  },
  {
    id: 'forge-hearts',
    buildingId: 'ribbon-workshop',
    companionId: 'runa',
    focusResource: 'stone',
    minigameType: 'conversation',
    name: 'Etincelles douces',
    tagline: 'Forge — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Runa est calme : concret, fiable, peu de grands gestes.',
    baseReward: { stone: 40, mana: 25, coins: 50, renown: 8 },
    accent: '#9aa3b2',
    icon: '💬',
  },
  {
    id: 'market-hearts',
    buildingId: 'star-market',
    companionId: 'maeve',
    focusResource: 'coins',
    minigameType: 'conversation',
    name: 'Comptoir complice',
    tagline: 'Marche — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Maeve est negociante : directe, maline, audace mesuree.',
    baseReward: { coins: 100, crystals: 10, gifts: 12, renown: 10 },
    accent: '#ffd56a',
    icon: '💬',
  },
  {
    id: 'salon-hearts',
    buildingId: 'inn',
    companionId: 'zelie',
    focusResource: 'coins',
    minigameType: 'conversation',
    name: 'Salon des secrets',
    tagline: 'Salon — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Zelie est noble : politesse, intrigue, romance raffinee.',
    baseReward: { coins: 80, renown: 20, stardust: 10, silk: 15 },
    accent: '#c084fc',
    icon: '💬',
  },
  {
    id: 'cascade-hearts',
    buildingId: 'clear-spring',
    companionId: 'asha',
    focusResource: 'crystals',
    minigameType: 'conversation',
    name: 'Perles de cascade',
    tagline: 'Source — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Asha est protectrice : loyaute, franchise, confiance gagnee.',
    baseReward: { crystals: 25, mana: 30, stardust: 8, renown: 10 },
    accent: '#6ec8ff',
    icon: '💬',
  },
  {
    id: 'archive-hearts',
    buildingId: 'arcane-library',
    companionId: 'elwen',
    focusResource: 'renown',
    minigameType: 'conversation',
    name: 'Alcove silencieuse',
    tagline: 'Archives — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Elwen est erudite : curiosite, respect des secrets.',
    baseReward: { renown: 22, mana: 35, stardust: 8, silk: 10 },
    accent: '#b49bff',
    icon: '💬',
  },
  {
    id: 'lab-hearts',
    buildingId: 'arcane-library',
    companionId: 'noa',
    focusResource: 'crystals',
    minigameType: 'conversation',
    name: 'Fiole et confidences',
    tagline: 'Laboratoire — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Noa est malicieuse : taquineries, surprises, esprit vif.',
    baseReward: { crystals: 20, mana: 30, gifts: 15, renown: 10 },
    accent: '#ff9fd0',
    icon: '💬',
  },
  {
    id: 'barn-hearts',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'gifts',
    minigameType: 'conversation',
    name: 'Grenier douillet',
    tagline: 'Ferme — Liens',
    inspiration: 'Visual novel / drague adaptee',
    description: 'Sora est bienveillante : animaux, simplicite, chaleur.',
    baseReward: { gifts: 30, food: 40, stardust: 6, renown: 10 },
    accent: '#9ed56b',
    icon: '💬',
  },
  {
    id: 'spring-bubbles',
    buildingId: 'clear-spring',
    companionId: 'solene',
    focusResource: 'mana',
    minigameType: 'bubble-pop',
    name: 'Bulles de Source',
    tagline: 'Source Claire',
    inspiration: 'Bubble Witch / Zen pop',
    description:
      'Solene purifie l eau chaude. Eclate les bulles de mana bleues et evite les bulles froides.',
    baseReward: { mana: 55, stardust: 6, renown: 12 },
    accent: '#6ec8ff',
    icon: '♨️',
  },
  {
    id: 'farm-idle',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'food',
    minigameType: 'idle-farm',
    name: 'Parcelles Lunaires',
    tagline: 'Ferme Lunaire',
    inspiration: 'Hay Day / idle farm',
    description:
      'Plante, ferme le jeu, reviens recolter quand c est pret. Aucune penalite si tu tardes — les recoltes t attendent.',
    baseReward: { food: 80, stardust: 4, ingredients: 20 },
    accent: '#9ed56b',
    icon: '🚜',
    persistent: true,
  },
  {
    id: 'farm-dressage',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'gifts',
    minigameType: 'dressage',
    name: 'Refuge des Myrions',
    tagline: 'Enclos — Sora',
    inspiration: 'Tamagotchi / Neko Atsume / refuge magique',
    description:
      'Visite les 8 enclos biome par biome. Tes Myrions capturés y vivent en chibi : nourris-les, câline-les, collecte les ressources de biome.',
    baseReward: { gifts: 28, renown: 18, stardust: 6 },
    accent: '#ffd898',
    icon: '🏡',
    persistent: true,
  },
  {
    id: 'farm-pets',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'gifts',
    minigameType: 'pet-sanctuary',
    name: 'Refuge des Familiers',
    tagline: 'Animalerie — Sora',
    inspiration: 'Tamagotchi chill / Neko Atsume',
    description:
      'Sora veille sur une petite ferme ou des familiers palmon se promenent. Clique sur l un d eux pour le soigner — jamais de punition.',
    baseReward: { gifts: 25, food: 40, renown: 10 },
    accent: '#ffb86b',
    icon: '🐾',
    persistent: true,
  },
  {
    id: 'farm-capture',
    buildingId: 'moon-farm',
    companionId: 'talia',
    focusResource: 'wood',
    minigameType: 'familiar-capture',
    name: 'Chasse aux Familiers',
    tagline: 'Lisiere — Talia',
    inspiration: 'Palworld / Pokemon GO lite',
    description:
      'Talia explore huit biomes et croise des familiers N a LR. Rencontres illimitees — synchronise ta capture au bon moment.',
    baseReward: { wood: 55, gifts: 30, stardust: 8 },
    accent: '#5ecf8a',
    icon: '🎯',
    persistent: true,
  },
  {
    id: 'farm-worksite',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'wood',
    minigameType: 'myrion-worksite',
    name: 'Chantier Myrion',
    tagline: 'Prairie du chantier',
    inspiration: 'Idle supervision / tap léger',
    description:
      'Assigne tes Myrions au bosquet, au pierrier et aux champs. Tap pour aider un peu — production très faible et contemplative.',
    baseReward: { wood: 1, stone: 1, food: 1 },
    accent: '#87c56a',
    icon: '🏗️',
    persistent: true,
  },
  {
    id: 'farm-merge',
    buildingId: 'moon-farm',
    companionId: 'sora',
    focusResource: 'stardust',
    minigameType: 'tile-merge',
    name: 'Graines Lunaires',
    tagline: 'Ferme Lunaire',
    inspiration: 'Merge Dragons / 2048',
    description:
      'Sora fusionne les graines sous la lune. Clique deux cases identiques adjacentes pour les combiner.',
    baseReward: { stardust: 10, food: 100, gifts: 10 },
    accent: '#b8a0ff',
    icon: '🌙',
  },
  {
    id: 'library-memory',
    buildingId: 'arcane-library',
    companionId: 'lyra',
    focusResource: 'mana',
    minigameType: 'memory-pairs',
    name: 'Grimoire Cache',
    tagline: 'Bibliotheque Arcanique',
    inspiration: 'Memory match / Concentration',
    description:
      'Lyra retrouve les runes oubliees. Retourne les cartes et forme toutes les paires magiques.',
    baseReward: { mana: 75, renown: 20, crystals: 12 },
    accent: '#9b7bff',
    icon: '📖',
  },
  {
    id: 'theater-beat',
    buildingId: 'traveler-theater',
    companionId: 'kael',
    focusResource: 'renown',
    minigameType: 'beat-tap',
    name: 'Applaudissements',
    tagline: 'Theatre des Voyageurs',
    inspiration: 'Osu! / Guitar Hero lite',
    description:
      'Kael dirige le concert du soir. Tape les notes au bon rythme quand elles touchent la ligne.',
    baseReward: { renown: 35, tickets: 1, gifts: 15 },
    accent: '#ff6eb4',
    icon: '🎭',
  },
  {
    id: 'market-swap',
    buildingId: 'star-market',
    companionId: 'maeve',
    focusResource: 'crystals',
    minigameType: 'swap-match',
    name: 'Bazar des Etoiles',
    tagline: 'Marche des Etoiles',
    inspiration: 'Candy Crush / Bejeweled',
    description:
      'Maeve aligne les cristaux etoiles. Echange deux cases voisines pour declencher des combos.',
    baseReward: { crystals: 40, coins: 90, tickets: 0.5 },
    accent: '#ffd56a',
    icon: '✨',
  },
]

export const getActivityById = (activityId: string) =>
  BUILDING_ACTIVITIES.find((activity) => activity.id === activityId)

export const getActivitiesByBuilding = (buildingId: string) =>
  BUILDING_ACTIVITIES.filter((activity) => activity.buildingId === buildingId)

const buildingOrderIndex = (buildingId: string, order: readonly string[]) => {
  const index = order.indexOf(buildingId)
  return index === -1 ? 999 : index
}

const featuredMinigameIndex = (activityId: string) => {
  const index = FEATURED_MINIGAME_IDS.indexOf(activityId)
  return index === -1 ? 999 : index
}

/** Tri hub mini-jeux : peaufinés, stade de deblocage, batiment, gameplay puis conversations. */
export function sortActivitiesByUnlock(
  activities: BuildingActivity[],
  unlockAtByBuilding: Record<string, number>,
  buildingOrder: readonly string[] = [],
) {
  return [...activities].sort((a, b) => {
    const featuredA = featuredMinigameIndex(a.id)
    const featuredB = featuredMinigameIndex(b.id)
    if (featuredA !== featuredB) {
      return featuredA - featuredB
    }
    const stageA = unlockAtByBuilding[a.buildingId] ?? 0
    const stageB = unlockAtByBuilding[b.buildingId] ?? 0
    if (stageA !== stageB) {
      return stageA - stageB
    }
    const buildingA = buildingOrderIndex(a.buildingId, buildingOrder)
    const buildingB = buildingOrderIndex(b.buildingId, buildingOrder)
    if (buildingA !== buildingB) {
      return buildingA - buildingB
    }
    const convA = a.minigameType === 'conversation' ? 1 : 0
    const convB = b.minigameType === 'conversation' ? 1 : 0
    if (convA !== convB) {
      return convA - convB
    }
    return a.name.localeCompare(b.name, 'fr')
  })
}

export function scaleReward(base: Cost, score: number, maxScore: number): Cost {
  const ratio = Math.max(0.35, Math.min(1.5, score / Math.max(1, maxScore)))
  const scaled: Cost = {}
  for (const [key, value] of Object.entries(base)) {
    if (value !== undefined) {
      scaled[key as ResourceKey] = Math.max(1, Math.round(value * ratio))
    }
  }
  return scaled
}
