import {
  GACHA_POOL,
  RARITY_META,
  RARITY_ORDER,
  type GachaItem,
  type GachaRarity,
} from './gacha'
import { DISAGREA_GACHA_POOL } from './disagreaGacha'
import type { LootExplainTip } from './lootExplain'
import { LOOT_PERCENT_TOTAL, normalizeToSum } from './lootExplain'

export const GACHA_PITY_RULES = [
  'Toutes les 10 invocations : SSR garanti (sauf si pity supérieur sur le même tirage).',
  'Toutes les 50 invocations : UR garanti.',
  'Toutes les 100 invocations : LR garanti.',
  'En dehors du pity, petit boost SR+ tous les 30 tirages.',
] as const

export type GachaRarityRate = {
  rarity: GachaRarity
  weight: number
  percent: number
  explain: LootExplainTip
}

export type GachaLootRateRow = {
  id: string
  name: string
  rarity: GachaRarity
  summary: string
  percent: number
  icon: string
  tierCount: number
  tierPercent: number
  explain: LootExplainTip
}

const formatPct = (value: number) => `${value.toFixed(2).replace(/\.?0+$/, '')}%`

function buildGachaRarityExplain(
  row: { rarity: GachaRarity; weight: number },
  weightTotal: number,
  tierCount: number,
  percent: number,
): LootExplainTip {
  const perLot = tierCount > 0 ? percent / tierCount : 0
  return {
    headline: `${row.rarity} · ${formatPct(percent)}`,
    sections: [
      {
        title: 'Pourquoi cette valeur ?',
        lines: [
          'Tirage hors pity : le jeu choisit d’abord une rareté selon les poids du gacha.',
          `Poids ${row.rarity} = ${row.weight} sur ${weightTotal} au total, normalisé en ${formatPct(percent)}.`,
          `Total des raretés affiché : ${formatPct(LOOT_PERCENT_TOTAL)}.`,
          tierCount > 0
            ? `${tierCount} lot(s) à ce palier → ~${formatPct(perLot)} par lot.`
            : 'Aucun lot à cette rareté dans ce gacha.',
        ],
      },
      {
        title: 'Comment augmenter',
        lines: [
          'Pity garanti : SSR /10 · UR /50 · LR /100 (voir section Pity).',
          'Petit boost SR+ tous les 30 tirages hors pity.',
          'Les poids de base sont fixes ; le pity contourne parfois ce tableau.',
        ],
      },
    ],
  }
}

function buildGachaLootExplain(
  row: { name: string; rarity: GachaRarity; percent: number },
  tierPercent: number,
  tierCount: number,
): LootExplainTip {
  return {
    headline: `${row.name} · ${formatPct(row.percent)}`,
    sections: [
      {
        title: 'Pourquoi cette valeur ?',
        lines: [
          `Lot « ${row.name} » (${row.rarity}).`,
          `Part de rareté ${row.rarity} : ${formatPct(tierPercent)}.`,
          `${tierCount} lot(s) à ce palier → ${formatPct(tierPercent)} ÷ ${tierCount} = ${formatPct(row.percent)}.`,
        ],
      },
      {
        title: 'Comment l’obtenir plus souvent',
        lines: [
          'Augmente la rareté via le pity (invocations cumulées).',
          'Moins il y a de lots à la même rareté, plus chaque lot est probable.',
          'Hors pity, seuls les poids globaux de rareté s’appliquent.',
        ],
      },
    ],
  }
}

function weightedRarityTable(boost = 0, tierCounts?: Record<GachaRarity, number>): GachaRarityRate[] {
  const rows = RARITY_ORDER.map((rarity) => ({
    rarity,
    weight:
      RARITY_META[rarity].weight +
      (rarity === 'SR' || rarity === 'SSR' || rarity === 'UR' || rarity === 'LR' ? boost : 0),
  }))
  const total = rows.reduce((sum, row) => sum + row.weight, 0)
  const normalizedPercents = normalizeToSum(
    rows.map((row) => (total > 0 ? (row.weight / total) * 100 : 0)),
    LOOT_PERCENT_TOTAL,
  )

  return rows.map((row, index) => {
    const percent = normalizedPercents[index] ?? 0
    const tierCount = tierCounts?.[row.rarity] ?? 0
    return {
      ...row,
      percent,
      explain: buildGachaRarityExplain(row, total, tierCount, percent),
    }
  })
}

/** Taux de rareté hors pity (base ou boost +2). */
export function getGachaRarityRates(
  boost = 0,
  tierCounts?: Record<GachaRarity, number>,
): GachaRarityRate[] {
  return weightedRarityTable(boost, tierCounts)
}

/** Taux par lot = part de rareté ÷ nombre de lots à cette rareté (total normalisé à 100 %). */
export function getGachaLootRates(pool: GachaItem[], boost = 0): GachaLootRateRow[] {
  const counts = RARITY_ORDER.reduce(
    (acc, rarity) => {
      acc[rarity] = pool.filter((item) => item.rarity === rarity).length
      return acc
    },
    {} as Record<GachaRarity, number>,
  )

  const rarityRates = getGachaRarityRates(boost, counts)
  const rarityPercent = Object.fromEntries(
    rarityRates.map((row) => [row.rarity, row.percent]),
  ) as Record<GachaRarity, number>

  const percentByItemId = new Map<string, number>()

  for (const rarity of RARITY_ORDER) {
    const tierItems = pool.filter((item) => item.rarity === rarity)
    if (tierItems.length === 0) continue

    const splits = normalizeToSum(tierItems.map(() => 1), rarityPercent[rarity] ?? 0)
    tierItems.forEach((item, index) => {
      percentByItemId.set(item.id, splits[index] ?? 0)
    })
  }

  return pool.map((item) => {
    const tierCount = counts[item.rarity] || 1
    const tierPercent = rarityPercent[item.rarity] ?? 0
    const percent = percentByItemId.get(item.id) ?? 0
    const row = {
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      summary: item.summary,
      percent,
      icon: item.icon,
      tierCount,
      tierPercent,
    }
    return {
      ...row,
      explain: buildGachaLootExplain(row, tierPercent, tierCount),
    }
  })
}

const RARITY_RANK = Object.fromEntries(
  RARITY_ORDER.map((rarity, index) => [rarity, index]),
) as Record<GachaRarity, number>

const isCompanionTierFragment = (id: string) => /^frag-[a-z]+-(r|sr)$/i.test(id)

/** Lots vedettes pour l’aperçu condensé (jackpots & récompenses haut tier). */
export function pickFeaturedGachaLoot(
  lootRates: GachaLootRateRow[],
  options?: { minRarity?: GachaRarity; limit?: number; includeCompanionFragments?: boolean },
): GachaLootRateRow[] {
  const minRarity = options?.minRarity ?? 'SSR'
  const limit = options?.limit ?? 8
  const includeCompanionFragments = options?.includeCompanionFragments ?? false
  const minRank = RARITY_RANK[minRarity]

  return [...lootRates]
    .filter((row) => {
      if (RARITY_RANK[row.rarity] < minRank) return false
      if (!includeCompanionFragments && isCompanionTierFragment(row.id)) return false
      return true
    })
    .sort(
      (a, b) =>
        RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || b.percent - a.percent || a.name.localeCompare(b.name),
    )
    .slice(0, limit)
}

export function getFestivalGachaRates() {
  const lootRates = getGachaLootRates(GACHA_POOL, 0)
  return {
    title: 'Festival des lanternes',
    rarityRates: getGachaRarityRates(0),
    lootRates,
    featuredLoot: pickFeaturedGachaLoot(lootRates),
    pityRules: GACHA_PITY_RULES,
    featuredNote:
      'Ressources, fragments compagnons et jetons de stat — du pack quotidien au jackpot LR.',
  }
}

export function getDisagreaGachaRates() {
  const lootRates = getGachaLootRates(DISAGREA_GACHA_POOL, 0)
  return {
    title: 'Faille Disagrea',
    rarityRates: getGachaRarityRates(0),
    lootRates,
    featuredLoot: pickFeaturedGachaLoot(lootRates, {
      minRarity: 'UR',
      limit: 8,
      includeCompanionFragments: true,
    }),
    pityRules: GACHA_PITY_RULES,
    featuredNote: 'Etna en LR · Flonne, Laharl et Pleinair en UR.',
  }
}
