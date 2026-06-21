export type GachaRarity = 'N' | 'R' | 'SR' | 'SSR' | 'UR' | 'LR'

export type GachaItem = {
  id: string
  name: string
  rarity: GachaRarity
  kind: 'skin' | 'decor' | 'guest' | 'ticket' | 'resource'
  icon: string
}

/** Dev: tirages sans cout en tickets */
export const DEV_UNLIMITED_GACHA = true

export const RARITY_ORDER: GachaRarity[] = ['N', 'R', 'SR', 'SSR', 'UR', 'LR']

export const RARITY_META: Record<
  GachaRarity,
  { label: string; color: string; glow: string; weight: number }
> = {
  N: { label: 'Normal', color: '#9aa3b2', glow: 'rgba(154,163,178,0.45)', weight: 42 },
  R: { label: 'Rare', color: '#5b8cff', glow: 'rgba(91,140,255,0.55)', weight: 28 },
  SR: { label: 'Super Rare', color: '#b449ff', glow: 'rgba(180,73,255,0.62)', weight: 18 },
  SSR: { label: 'SSR', color: '#ffb020', glow: 'rgba(255,176,32,0.68)', weight: 8 },
  UR: { label: 'Ultra Rare', color: '#ff5a8a', glow: 'rgba(255,90,138,0.72)', weight: 3.5 },
  LR: { label: 'Legendary', color: '#ffe566', glow: 'rgba(255,229,102,0.85)', weight: 0.5 },
}

export const GACHA_POOL: GachaItem[] = [
  { id: 'n-coins', name: 'Sac de pieces', rarity: 'N', kind: 'resource', icon: '/gacha/icons/coins.svg' },
  { id: 'n-food', name: 'Panier de vivres', rarity: 'N', kind: 'resource', icon: '/gacha/icons/food.svg' },
  { id: 'n-wood', name: 'Bois poli', rarity: 'N', kind: 'resource', icon: '/gacha/icons/wood.svg' },
  { id: 'r-tickets', name: '3 tickets festival', rarity: 'R', kind: 'ticket', icon: '/gacha/icons/ticket.svg' },
  { id: 'r-gift', name: 'Coffret cadeaux', rarity: 'R', kind: 'resource', icon: '/gacha/icons/gift.svg' },
  { id: 'r-silk', name: 'Ruban de soie', rarity: 'R', kind: 'resource', icon: '/gacha/icons/silk.svg' },
  { id: 'sr-skin-kimono', name: 'Skin: Kimono des lucioles', rarity: 'SR', kind: 'skin', icon: '/gacha/icons/kimono.svg' },
  { id: 'sr-skin-frost', name: 'Skin: Robe de givre', rarity: 'SR', kind: 'skin', icon: '/gacha/icons/frost.svg' },
  { id: 'sr-decor-lantern', name: 'Decor: Festival des lanternes', rarity: 'SR', kind: 'decor', icon: '/gacha/icons/lantern.svg' },
  { id: 'ssr-skin-celestial', name: 'Skin: Tenue de bal celeste', rarity: 'SSR', kind: 'skin', icon: '/gacha/icons/celestial.svg' },
  { id: 'ssr-decor-snow', name: 'Decor: Jardin enneige', rarity: 'SSR', kind: 'decor', icon: '/gacha/icons/snow.svg' },
  { id: 'ssr-guest-oria', name: 'Invite: Oria', rarity: 'SSR', kind: 'guest', icon: '/gacha/icons/guest.svg' },
  { id: 'ur-decor-meteor', name: 'Decor: Pluie de meteores', rarity: 'UR', kind: 'decor', icon: '/gacha/icons/meteor.svg' },
  { id: 'ur-guest-vesper', name: 'Invite: Vesper', rarity: 'UR', kind: 'guest', icon: '/gacha/icons/guest-gold.svg' },
  { id: 'lr-skin-aurora', name: 'Skin: Aurora eternelle', rarity: 'LR', kind: 'skin', icon: '/gacha/icons/aurora.svg' },
  { id: 'lr-decor-eclipse', name: 'Decor: Eclipse du havre', rarity: 'LR', kind: 'decor', icon: '/gacha/icons/eclipse.svg' },
]

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
