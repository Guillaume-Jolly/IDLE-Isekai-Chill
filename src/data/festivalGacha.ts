import { GACHA_POOL, type GachaItem } from './gacha'

export const FESTIVAL_EVENT_BANNER = {
  id: 'festival-lanterns',
  title: 'Festival des lanternes',
  subtitle: 'Bannière saisonnière',
  bannerSrc: '/gacha/events/festival-lanterns-banner.png',
  featured: [
    {
      itemId: 'lr-legend',
      displayName: 'Fortune du havre',
      archetype: 'Jackpot ressources légendaire',
      rarity: 'LR' as const,
    },
    {
      itemId: 'lr-frag-burst',
      displayName: 'Constellation de liens',
      archetype: '+5 fragments compagnon',
      rarity: 'LR' as const,
    },
    {
      itemId: 'ur-premium',
      displayName: 'Relique du marché',
      archetype: 'Cristaux · stardust · tickets',
      rarity: 'UR' as const,
    },
    {
      itemId: 'ssr-jackpot',
      displayName: 'Trésor du festival',
      archetype: 'Gros pack ressources SSR',
      rarity: 'SSR' as const,
    },
  ],
} as const

const poolById = Object.fromEntries(GACHA_POOL.map((item) => [item.id, item])) as Record<
  string,
  GachaItem
>

export function getFestivalFeaturedItem(itemId: string): GachaItem | undefined {
  return poolById[itemId]
}
