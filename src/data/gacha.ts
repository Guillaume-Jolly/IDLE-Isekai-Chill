import type { StatKey } from './companionStats'
import {
  COMPANION_FRAGMENT_IDS,
  COMPANION_FRAGMENT_NAMES,
  pickRandomCompanionFragment,
  type CompanionFragmentId,
} from './companionFragments'
import type { Cost } from './resources'

export type GachaRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR'

export type GachaItemKind = 'resource' | 'companion-fragment' | 'stat-token'

export type GachaItem = {
  id: string
  name: string
  rarity: GachaRarity
  kind: GachaItemKind
  icon: string
  /** Texte court affiché sur la carte de résultat */
  summary: string
  resources: Cost
  /** Compagnon cible du fragment, ou tirage aléatoire au moment du pull */
  companionId?: CompanionFragmentId | 'random'
  /** Stat ciblée par un jeton gacha */
  statKey?: StatKey
}

export type GachaPullResult = {
  resources: Cost
  fragments: Record<string, number>
  statTokens: Record<StatKey, number>
  summaries: string[]
}

/** Dev: tirages sans coût en tickets */
export const DEV_UNLIMITED_GACHA = true

/** Debloque tous les mini-jeux dans le hub (ignore le stade village). */
export const DEV_UNLOCK_ALL_MINIGAMES = true

export const RARITY_ORDER: GachaRarity[] = ['N', 'R', 'SR', 'SSR', 'UR', 'LR']

export const RARITY_META: Record<
  GachaRarity,
  { label: string; color: string; glow: string; weight: number }
> = {
  N: { label: 'Normal', color: '#9aa3b2', glow: 'rgba(154,163,178,0.45)', weight: 40 },
  R: { label: 'Rare', color: '#5b8cff', glow: 'rgba(91,140,255,0.55)', weight: 28 },
  SR: { label: 'Super Rare', color: '#b449ff', glow: 'rgba(180,73,255,0.62)', weight: 18 },
  SSR: { label: 'SSR', color: '#ffb020', glow: 'rgba(255,176,32,0.68)', weight: 9 },
  UR: { label: 'Ultra Rare', color: '#ff5a8a', glow: 'rgba(255,90,138,0.72)', weight: 4 },
  LR: { label: 'Legendary', color: '#ffe566', glow: 'rgba(255,229,102,0.85)', weight: 1 },
}

const STAT_TOKEN_META: Record<
  StatKey,
  { name: string; icon: string; summary: string }
> = {
  charm: {
    name: 'Essence de charme',
    icon: '/gacha/icons/gift.svg',
    summary: '+1 token Charme (choix du compagnon)',
  },
  wit: {
    name: 'Parchemin d\'esprit',
    icon: '/gacha/icons/guest.svg',
    summary: '+1 token Esprit (choix du compagnon)',
  },
  vigor: {
    name: 'Cristal de vigueur',
    icon: '/gacha/icons/meteor.svg',
    summary: '+1 token Vigueur (choix du compagnon)',
  },
  grace: {
    name: 'Fil de grâce',
    icon: '/gacha/icons/silk.svg',
    summary: '+1 token Grâce (choix du compagnon)',
  },
  insight: {
    name: 'Prisme d\'intuition',
    icon: '/gacha/icons/celestial.svg',
    summary: '+1 token Intuition (choix du compagnon)',
  },
}

const makeStatTokenItem = (
  id: string,
  statKey: StatKey,
  rarity: GachaRarity,
): GachaItem => {
  const meta = STAT_TOKEN_META[statKey]
  return {
    id,
    name: meta.name,
    rarity,
    kind: 'stat-token',
    icon: meta.icon,
    summary: meta.summary,
    resources: {},
    statKey,
  }
}

const makeFragmentItem = (
  companionId: CompanionFragmentId,
  rarity: GachaRarity,
): GachaItem => ({
  id: `frag-${companionId}-${rarity.toLowerCase()}`,
  name: `Fragment · ${COMPANION_FRAGMENT_NAMES[companionId]}`,
  rarity,
  kind: 'companion-fragment',
  icon: '/gacha/icons/kimono.svg',
  summary: `+1 fragment ${COMPANION_FRAGMENT_NAMES[companionId]}`,
  resources: {},
  companionId,
})

const COMPANION_FRAGMENT_ITEMS: GachaItem[] = COMPANION_FRAGMENT_IDS.flatMap((companionId) => [
  makeFragmentItem(companionId, 'R'),
  makeFragmentItem(companionId, 'SR'),
])

/**
 * Pool actif — ressources, fragments compagnons, jetons de stat ciblés.
 */
export const GACHA_POOL: GachaItem[] = [
  {
    id: 'n-coins',
    name: 'Sac de pièces',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/coins.svg',
    summary: '+180 pièces',
    resources: { coins: 180 },
  },
  {
    id: 'n-food',
    name: 'Panier de vivres',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/food.svg',
    summary: '+100 vivres',
    resources: { food: 100 },
  },
  {
    id: 'n-wood',
    name: 'Bois poli',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/wood.svg',
    summary: '+70 bois',
    resources: { wood: 70 },
  },
  {
    id: 'n-stone',
    name: 'Pierre taillée',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/wood.svg',
    summary: '+60 pierre',
    resources: { stone: 60 },
  },
  {
    id: 'n-mana',
    name: 'Fiole de mana',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/gift.svg',
    summary: '+35 mana',
    resources: { mana: 35 },
  },
  {
    id: 'n-frag-random',
    name: 'Éclat de lien',
    rarity: 'N',
    kind: 'companion-fragment',
    icon: '/gacha/icons/kimono.svg',
    summary: '+1 fragment compagnon (aléatoire)',
    resources: {},
    companionId: 'random',
  },
  {
    id: 'r-tickets',
    name: '3 tickets festival',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/ticket.svg',
    summary: '+3 tickets',
    resources: { tickets: 3 },
  },
  {
    id: 'r-gift',
    name: 'Coffret cadeaux',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/gift.svg',
    summary: '+22 cadeaux',
    resources: { gifts: 22 },
  },
  {
    id: 'r-silk',
    name: 'Ruban de soie',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/silk.svg',
    summary: '+28 soie',
    resources: { silk: 28 },
  },
  {
    id: 'r-renown',
    name: 'Parchemin de renom',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/guest.svg',
    summary: '+20 renom',
    resources: { renown: 20 },
  },
  {
    id: 'r-ingredients',
    name: 'Corbeille du jardin',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/food.svg',
    summary: '+40 ingrédients',
    resources: { ingredients: 40 },
  },
  {
    id: 'r-mix',
    name: 'Pack du voyageur',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/coins.svg',
    summary: 'Pièces + vivres',
    resources: { coins: 90, food: 55 },
  },
  {
    id: 'r-frag-random',
    name: 'Fragment scintillant',
    rarity: 'R',
    kind: 'companion-fragment',
    icon: '/gacha/icons/kimono.svg',
    summary: '+1 fragment compagnon (aléatoire)',
    resources: {},
    companionId: 'random',
  },
  {
    id: 'sr-mana',
    name: 'Arcane concentrée',
    rarity: 'SR',
    kind: 'resource',
    icon: '/gacha/icons/gift.svg',
    summary: '+80 mana, +15 renom',
    resources: { mana: 80, renown: 15 },
  },
  {
    id: 'sr-stardust',
    name: 'Poussière lunaire',
    rarity: 'SR',
    kind: 'resource',
    icon: '/gacha/icons/celestial.svg',
    summary: '+12 stardust',
    resources: { stardust: 12 },
  },
  {
    id: 'sr-crystals',
    name: 'Éclat de cristal',
    rarity: 'SR',
    kind: 'resource',
    icon: '/gacha/icons/meteor.svg',
    summary: '+25 cristaux',
    resources: { crystals: 25 },
  },
  makeStatTokenItem('sr-token-charm', 'charm', 'SR'),
  makeStatTokenItem('sr-token-wit', 'wit', 'SR'),
  {
    id: 'sr-supply',
    name: 'Coffre du havre',
    rarity: 'SR',
    kind: 'resource',
    icon: '/gacha/icons/lantern.svg',
    summary: 'Pack ressources SR',
    resources: { coins: 150, wood: 80, stone: 60, gifts: 15 },
  },
  {
    id: 'ssr-jackpot',
    name: 'Trésor du festival',
    rarity: 'SSR',
    kind: 'resource',
    icon: '/gacha/icons/snow.svg',
    summary: 'Gros pack ressources',
    resources: { coins: 320, mana: 90, gifts: 35, silk: 40 },
  },
  makeStatTokenItem('ssr-token-vigor', 'vigor', 'SSR'),
  makeStatTokenItem('ssr-token-grace', 'grace', 'SSR'),
  {
    id: 'ssr-stardust',
    name: 'Pluie d\'étoiles',
    rarity: 'SSR',
    kind: 'resource',
    icon: '/gacha/icons/aurora.svg',
    summary: '+28 stardust, +40 cristaux',
    resources: { stardust: 28, crystals: 40 },
  },
  {
    id: 'ssr-tickets',
    name: 'Passe du festival',
    rarity: 'SSR',
    kind: 'resource',
    icon: '/gacha/icons/ticket.svg',
    summary: '+8 tickets, +50 renom',
    resources: { tickets: 8, renown: 50 },
  },
  {
    id: 'ssr-frag-triple',
    name: 'Trio de fragments',
    rarity: 'SSR',
    kind: 'companion-fragment',
    icon: '/gacha/icons/kimono.svg',
    summary: '+3 fragments compagnon (aléatoires)',
    resources: {},
    companionId: 'random',
  },
  {
    id: 'ur-premium',
    name: 'Relique du marché',
    rarity: 'UR',
    kind: 'resource',
    icon: '/gacha/icons/meteor.svg',
    summary: 'Cristaux + stardust + tickets',
    resources: { crystals: 70, stardust: 35, tickets: 5 },
  },
  makeStatTokenItem('ur-token-insight', 'insight', 'UR'),
  makeStatTokenItem('ur-token-charm', 'charm', 'UR'),
  {
    id: 'ur-supply',
    name: 'Réserve du village',
    rarity: 'UR',
    kind: 'resource',
    icon: '/gacha/icons/eclipse.svg',
    summary: 'Pack complet UR',
    resources: { coins: 500, food: 200, ingredients: 80, silk: 60 },
  },
  {
    id: 'lr-legend',
    name: 'Fortune du havre',
    rarity: 'LR',
    kind: 'resource',
    icon: '/gacha/icons/aurora.svg',
    summary: 'Jackpot ressources LR',
    resources: {
      coins: 800,
      crystals: 100,
      stardust: 50,
      tickets: 10,
      mana: 150,
      gifts: 60,
    },
  },
  makeStatTokenItem('lr-token-insight', 'insight', 'LR'),
  makeStatTokenItem('lr-token-wit', 'wit', 'LR'),
  {
    id: 'lr-frag-burst',
    name: 'Constellation de liens',
    rarity: 'LR',
    kind: 'companion-fragment',
    icon: '/gacha/icons/kimono.svg',
    summary: '+5 fragments compagnon (aléatoires)',
    resources: {},
    companionId: 'random',
  },
  ...COMPANION_FRAGMENT_ITEMS,
]

/** Cosmétiques désactivés pour l'instant */
export const GACHA_COSMETIC_POOL_DISABLED = [
  'sr-skin-kimono',
  'sr-skin-frost',
  'sr-decor-lantern',
  'ssr-skin-celestial',
  'ssr-decor-snow',
  'ssr-guest-oria',
  'ur-decor-meteor',
  'ur-guest-vesper',
  'lr-skin-aurora',
  'lr-decor-eclipse',
] as const

const poolByRarity = (rarity: GachaRarity) =>
  GACHA_POOL.filter((item) => item.rarity === rarity)

const rollWeightedRarity = (boost = 0): GachaRarity => {
  const weights = RARITY_ORDER.map((r) => ({
    rarity: r,
    w: RARITY_META[r].weight + (r === 'SR' || r === 'SSR' || r === 'UR' || r === 'LR' ? boost : 0),
  }))
  const total = weights.reduce((sum, entry) => sum + entry.w, 0)
  let roll = Math.random() * total
  for (const entry of weights) {
    roll -= entry.w
    if (roll <= 0) return entry.rarity
  }
  return 'N'
}

const fragmentCountForItem = (item: GachaItem) => {
  if (item.id === 'ssr-frag-triple') return 3
  if (item.id === 'lr-frag-burst') return 5
  return 1
}

const resolveFragmentCompanion = (item: GachaItem): CompanionFragmentId => {
  if (item.companionId && item.companionId !== 'random') {
    return item.companionId
  }
  return pickRandomCompanionFragment()
}

export const rollGachaItem = (pullIndex: number, totalPullsBefore: number): GachaItem => {
  const nextPull = totalPullsBefore + pullIndex + 1
  let rarity: GachaRarity

  if (nextPull % 100 === 0) rarity = 'LR'
  else if (nextPull % 50 === 0) rarity = 'UR'
  else if (nextPull % 10 === 0) rarity = 'SSR'
  else rarity = rollWeightedRarity(nextPull % 30 === 0 ? 2 : 0)

  const pool = poolByRarity(rarity)
  return pool[Math.floor(Math.random() * pool.length)] ?? GACHA_POOL[0]
}

export const rollMulti = (count: number, totalPullsBefore: number): GachaItem[] =>
  Array.from({ length: count }, (_, index) => rollGachaItem(index, totalPullsBefore))

export const bestRarity = (items: GachaItem[]): GachaRarity =>
  items.reduce<GachaRarity>((best, item) => {
    return RARITY_ORDER.indexOf(item.rarity) > RARITY_ORDER.indexOf(best) ? item.rarity : best
  }, 'N')

export const applyGachaItems = (items: GachaItem[]): GachaPullResult => {
  const resources: Cost = {}
  const fragments: Record<string, number> = {}
  const statTokens = {
    charm: 0,
    wit: 0,
    vigor: 0,
    grace: 0,
    insight: 0,
  } satisfies Record<StatKey, number>
  const summaries: string[] = []

  for (const item of items) {
    for (const [key, value] of Object.entries(item.resources)) {
      resources[key as keyof Cost] = (resources[key as keyof Cost] ?? 0) + (value ?? 0)
    }

    if (item.kind === 'companion-fragment') {
      const count = fragmentCountForItem(item)
      for (let index = 0; index < count; index += 1) {
        const companionId = resolveFragmentCompanion(item)
        fragments[companionId] = (fragments[companionId] ?? 0) + 1
        summaries.push(`+1 fragment ${COMPANION_FRAGMENT_NAMES[companionId]}`)
      }
      continue
    }

    if (item.kind === 'stat-token' && item.statKey) {
      statTokens[item.statKey] += 1
      summaries.push(item.summary)
      continue
    }

    if (item.summary) {
      summaries.push(item.summary)
    }
  }

  return { resources, fragments, statTokens, summaries }
}

export const formatGachaPullSummary = (result: GachaPullResult) => {
  const parts: string[] = []
  const resourceText = Object.entries(result.resources)
    .filter(([, value]) => (value ?? 0) > 0)
    .map(([key, value]) => `${Math.floor(value ?? 0)} ${key}`)
  if (resourceText.length > 0) parts.push(resourceText.join(', '))

  const fragmentTotal = Object.values(result.fragments).reduce((sum, value) => sum + value, 0)
  if (fragmentTotal > 0) {
    parts.push(`${fragmentTotal} fragment${fragmentTotal > 1 ? 's' : ''}`)
  }

  const tokenTotal = Object.values(result.statTokens).reduce((sum, value) => sum + value, 0)
  if (tokenTotal > 0) {
    parts.push(`${tokenTotal} jeton${tokenTotal > 1 ? 's' : ''} de stat`)
  }

  return parts.join(' · ') || 'Récompenses reçues'
}

export { STAT_TOKEN_META }
