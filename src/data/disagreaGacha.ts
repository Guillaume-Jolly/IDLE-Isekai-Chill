import {
  COMPANION_FRAGMENT_NAMES,
  type CompanionFragmentId,
} from './companionFragments'
import {
  applyGachaItems,
  RARITY_META,
  RARITY_ORDER,
  type GachaItem,
  type GachaRarity,
} from './gacha'
import type { DisagreaCompanionId } from './eventDisagreaPack'

export const DISAGREA_EVENT_BANNER = {
  id: 'disagrea-event',
  title: 'Faille Disagrea',
  subtitle: 'Ouverture de l\'event Disagrea',
  bannerSrc: '/gacha/events/disagrea-opening-banner.png',
  featured: [
    {
      companionId: 'etna' as const,
      rarity: 'LR' as const,
      displayName: 'Etna',
      archetype: 'Vassale démoniaque invitée',
    },
    {
      companionId: 'flonne' as const,
      rarity: 'UR' as const,
      displayName: 'Flonne',
      archetype: 'Guérisseuse angélique invitée',
    },
    {
      companionId: 'laharl' as const,
      rarity: 'UR' as const,
      displayName: 'Laharl',
      archetype: 'Overlord invité',
    },
    {
      companionId: 'pleinair' as const,
      rarity: 'UR' as const,
      displayName: 'Pleinair',
      archetype: 'Mascotte silencieuse invitée',
    },
  ],
} as const

const DISAGREA_COMPANION_IDS: DisagreaCompanionId[] = ['etna', 'flonne', 'laharl', 'pleinair']

const UR_DISAGREA_IDS: DisagreaCompanionId[] = ['flonne', 'laharl', 'pleinair']

const portraitIcon = (companionId: DisagreaCompanionId) =>
  `/assets/companions/${companionId}/affinity-1.png`

const makeDisagreaFragment = (
  companionId: DisagreaCompanionId,
  rarity: GachaRarity,
  fragmentCount = 1,
): GachaItem => ({
  id: `disagrea-frag-${companionId}-${rarity.toLowerCase()}`,
  name: `Fragment · ${COMPANION_FRAGMENT_NAMES[companionId]}`,
  rarity,
  kind: 'companion-fragment',
  icon: portraitIcon(companionId),
  summary:
    fragmentCount > 1
      ? `+${fragmentCount} fragments ${COMPANION_FRAGMENT_NAMES[companionId]}`
      : `+1 fragment ${COMPANION_FRAGMENT_NAMES[companionId]}`,
  resources: {},
  companionId: companionId as CompanionFragmentId,
})

/** Pool gacha event Disagrea — Etna en LR, invités UR en UR. */
export const DISAGREA_GACHA_POOL: GachaItem[] = [
  {
    id: 'disagrea-n-shard',
    name: 'Éclats de faille',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/gift.svg',
    summary: '+40 cristaux',
    resources: { crystals: 40 },
  },
  {
    id: 'disagrea-n-coins',
    name: 'Butin dimensionnel',
    rarity: 'N',
    kind: 'resource',
    icon: '/gacha/icons/coins.svg',
    summary: '+120 pièces',
    resources: { coins: 120 },
  },
  {
    id: 'disagrea-r-tickets',
    name: 'Sceau Disagrea',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/ticket.svg',
    summary: '+2 tickets',
    resources: { tickets: 2 },
  },
  {
    id: 'disagrea-r-stardust',
    name: 'Poussière pourpre',
    rarity: 'R',
    kind: 'resource',
    icon: '/gacha/icons/celestial.svg',
    summary: '+8 stardust',
    resources: { stardust: 8 },
  },
  {
    id: 'disagrea-sr-pack',
    name: 'Cachet invité',
    rarity: 'SR',
    kind: 'resource',
    icon: '/gacha/icons/meteor.svg',
    summary: '+50 cristaux, +20 mana',
    resources: { crystals: 50, mana: 20 },
  },
  ...DISAGREA_COMPANION_IDS.map((id) => makeDisagreaFragment(id, 'SR')),
  {
    id: 'disagrea-ssr-mix',
    name: 'Relique de faille',
    rarity: 'SSR',
    kind: 'resource',
    icon: '/gacha/icons/aurora.svg',
    summary: '+80 cristaux, +15 stardust',
    resources: { crystals: 80, stardust: 15 },
  },
  ...DISAGREA_COMPANION_IDS.map((id) => makeDisagreaFragment(id, 'SSR')),
  ...UR_DISAGREA_IDS.map((id) => makeDisagreaFragment(id, 'UR')),
  makeDisagreaFragment('etna', 'LR', 3),
  {
    id: 'disagrea-lr-jackpot',
    name: 'Couronne de la vassale',
    rarity: 'LR',
    kind: 'companion-fragment',
    icon: portraitIcon('etna'),
    summary: '+5 fragments Etna',
    resources: {},
    companionId: 'etna',
  },
]

const poolByRarity = (rarity: GachaRarity) =>
  DISAGREA_GACHA_POOL.filter((item) => item.rarity === rarity)

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

export const rollDisagreaGachaItem = (pullIndex: number, totalPullsBefore: number): GachaItem => {
  const nextPull = totalPullsBefore + pullIndex + 1
  let rarity: GachaRarity

  if (nextPull % 100 === 0) rarity = 'LR'
  else if (nextPull % 50 === 0) rarity = 'UR'
  else if (nextPull % 10 === 0) rarity = 'SSR'
  else rarity = rollWeightedRarity(nextPull % 30 === 0 ? 2 : 0)

  const pool = poolByRarity(rarity)
  return pool[Math.floor(Math.random() * pool.length)] ?? DISAGREA_GACHA_POOL[0]
}

export const rollDisagreaMulti = (count: number, totalPullsBefore: number): GachaItem[] =>
  Array.from({ length: count }, (_, index) => rollDisagreaGachaItem(index, totalPullsBefore))

export { applyGachaItems }
