import {
  getBiomeProgress,
  getBiomeRarityWeights,
  getLrUnlockSteps,
  isBiomeUnlocked,
  rarityWeightsToPercentages,
  type BiomeProgress,
  type LrUnlockStep,
  type PlayerCollection,
} from './biomeProgression'
import type { LootExplainSection, LootExplainTip } from './lootExplain'
import { LOOT_PERCENT_TOTAL, normalizeToSum } from './lootExplain'
import { FAVOR_LEVEL_ENCOUNTERS, pickActiveHuntFavors, type HuntFavor } from './myrionMvp2'
import {
  BIOMES,
  PALMON_RARITIES,
  PALMON_SPECIES,
  RARITY_COLORS,
  type PalmonRarity,
  type PalmonSpecies,
} from './wildFamiliars'

export type HuntRarityRateRow = {
  rarity: PalmonRarity
  basePercent: number
  boostedPercent: number
  baseWeight: number
  boostedWeight: number
  baseExplain: LootExplainTip
  boostedExplain: LootExplainTip
}

export type HuntSpeciesRateRow = {
  id: string
  name: string
  emoji: string
  rarity: PalmonRarity
  basePercent: number
  boostedPercent: number
  tierSpeciesCount: number
  tierBasePercent: number
  tierBoostedPercent: number
  baseExplain: LootExplainTip
  boostedExplain: LootExplainTip
}

export type HuntFavorGuide = {
  id: string
  name: string
  active: boolean
  summary: string
  howToGet: string
  affectsDisplayedRates: boolean
}

export type HuntBiomeDropSheet = {
  biomeId: string
  biomeName: string
  emoji: string
  unlocked: boolean
  lrAvailable: boolean
  progress: BiomeProgress
  lrUnlockSteps: LrUnlockStep[]
  favorGuides: HuntFavorGuide[]
  howItWorks: LootExplainTip
  rarityRows: HuntRarityRateRow[]
  speciesRows: HuntSpeciesRateRow[]
  activeFavorNotes: string[]
}

/** LR en tête, N en bas — affichage des paliers et listes de spawns. */
export const HUNT_RARITY_TIER_ORDER: PalmonRarity[] = ['LR', 'UR', 'SSR', 'SR', 'R', 'N']

export type HuntTierSection = {
  rarity: PalmonRarity
  species: HuntSpeciesRateRow[]
  rarityRow: HuntRarityRateRow
  baseTotal: number
  boostedTotal: number
}

export function getHuntTierSections(sheet: HuntBiomeDropSheet): HuntTierSection[] {
  return HUNT_RARITY_TIER_ORDER.map((rarity) => {
    const species = sheet.speciesRows.filter((row) => row.rarity === rarity)
    if (species.length === 0) return null

    const rarityRow = sheet.rarityRows.find((row) => row.rarity === rarity)
    if (!rarityRow) return null

    return {
      rarity,
      species,
      rarityRow,
      baseTotal: species.reduce((sum, row) => sum + row.basePercent, 0),
      boostedTotal: species.reduce((sum, row) => sum + row.boostedPercent, 0),
    }
  }).filter((section): section is HuntTierSection => section !== null)
}

/** LR en tête, N en bas — pour listes de spawns. */
const RARITY_SORT_DESC: Record<PalmonRarity, number> = {
  LR: 0,
  UR: 1,
  SSR: 2,
  SR: 3,
  R: 4,
  N: 5,
}

const STANDARD_RARITY_WEIGHTS: Record<PalmonRarity, number> = {
  N: 45,
  R: 28,
  SR: 15,
  SSR: 8,
  UR: 3.5,
  LR: 0.5,
}

const formatPct = (value: number) => `${value.toFixed(2).replace(/\.?0+$/, '')}%`

function normalizeRarityPercents(
  weights: Record<PalmonRarity, number>,
): Record<PalmonRarity, number> {
  const raw = rarityWeightsToPercentages(weights)
  const normalized = normalizeToSum(
    PALMON_RARITIES.map((rarity) => raw[rarity] ?? 0),
    LOOT_PERCENT_TOTAL,
  )
  return Object.fromEntries(
    PALMON_RARITIES.map((rarity, index) => [rarity, normalized[index] ?? 0]),
  ) as Record<PalmonRarity, number>
}

function distributeSpeciesPercents(
  speciesInBiome: PalmonSpecies[],
  rarityPercents: Record<PalmonRarity, number>,
): Map<string, number> {
  const result = new Map<string, number>()

  for (const rarity of PALMON_RARITIES) {
    const tierSpecies = speciesInBiome.filter((species) => species.rarity === rarity)
    if (tierSpecies.length === 0) continue

    const splits = normalizeToSum(
      tierSpecies.map(() => 1),
      rarityPercents[rarity] ?? 0,
    )
    tierSpecies.forEach((species, index) => {
      result.set(species.id, splits[index] ?? 0)
    })
  }

  return result
}

const formatWeight = (value: number) =>
  Number.isInteger(value) ? `${value}` : value.toFixed(2).replace(/\.?0+$/, '')

type HuntExplainContext = {
  biomeId: string
  biomeName: string
  huntFavors: HuntFavor[]
  lrAvailable: boolean
  progress: BiomeProgress
  lrSteps: LrUnlockStep[]
  favorShift: number
  activeRarityFavors: HuntFavor[]
}

function getRarityFavorShift(huntFavors: HuntFavor[]): number {
  const active = pickActiveHuntFavors(huntFavors)
  const rarityBonus = active
    .filter((favor) => favor.category === 'rarity')
    .reduce((sum, favor) => sum + favor.value, 0)
  return rarityBonus > 0 ? Math.min(12, rarityBonus * 3) : 0
}

function totalWeight(weights: Record<PalmonRarity, number>): number {
  return PALMON_RARITIES.reduce((sum, rarity) => sum + weights[rarity], 0)
}

function describeActiveRarityFavors(favors: HuntFavor[]): string[] {
  if (favors.length === 0) {
    return ['Aucune faveur « Écho de rareté » dans ta file active.']
  }
  return favors.map(
    (favor) =>
      `${favor.name} niv.${favor.level} · ${favor.remainingEncounters}/${FAVOR_LEVEL_ENCOUNTERS[favor.level]} rencontres · intensité ${favor.value}`,
  )
}

function howToIncreaseRarityTier(rarity: PalmonRarity, ctx: HuntExplainContext): string[] {
  const lines: string[] = []

  if (rarity === 'LR') {
    for (const step of ctx.lrSteps) {
      lines.push(`${step.done ? '✓' : '○'} ${step.label}`)
      if (!step.done) lines.push(`→ ${step.action}`)
    }
    lines.push('Une fois LR actif, le poids passe à 0,5 (puis normalisé en %).')
    lines.push('Le LR du jour est fixe : une seule espèce LR peut apparaître par jour.')
  } else if (rarity === 'N' || rarity === 'R') {
    lines.push('Sans faveur rareté, ce palier reste à sa valeur de base.')
    lines.push('Il baisse si tu actives un « Écho de rareté » (le poids part vers SR+).')
    lines.push('Pour le remonter : retire ou laisse expirer les faveurs rareté en file.')
  } else {
    lines.push('Papouille au refuge un Myrion à affection 5+ : chance d’obtenir « Écho de rareté ».')
    lines.push('Place la faveur en file (max 3 actives) avant de chasser ce biome.')
    lines.push('Plus le niveau de faveur est haut, plus le shift vers SR/SSR/UR/LR est fort.')
    if (rarity === 'UR' || rarity === 'SSR') {
      lines.push('Débloquer LR (70 % du biome + SSR+ capturé) ajoute aussi un peu de poids aux hauts paliers.')
    }
  }

  return lines
}

function buildRarityBaseExplain(
  rarity: PalmonRarity,
  weight: number,
  percent: number,
  weightTotal: number,
  ctx: HuntExplainContext,
): LootExplainTip {
  const why: string[] = [
    'À chaque rencontre, le jeu tire d’abord une rareté (étape 1), puis une espèce (étape 2).',
  ]

  if (rarity === 'LR') {
    if (ctx.lrAvailable) {
      why.push(`LR est débloqué dans ${ctx.biomeName} : poids ${formatWeight(weight)}.`)
      why.push(`Somme des poids ${formatWeight(weightTotal)} → ${formatPct(percent)} pour ce palier.`)
    } else {
      why.push('LR vaut 0 tant que les 3 conditions de déblocage ne sont pas remplies.')
      why.push(`D’où ${formatPct(percent)} affiché : le tirage ne peut pas tomber sur LR pour l’instant.`)
    }
  } else {
    const standard = STANDARD_RARITY_WEIGHTS[rarity]
    why.push(`Poids de base fixe ${rarity} = ${formatWeight(standard)} (table standard du jeu).`)
    if (ctx.lrAvailable) {
      why.push(`LR actif dans ce biome : le total des poids monte à ${formatWeight(weightTotal)} (au lieu de ~100 sans LR).`)
    } else {
      why.push(`LR inactif ici : total ${formatWeight(weightTotal)} pts de poids avant normalisation.`)
    }
    why.push(`Normalisé sur ${formatWeight(weightTotal)} pts → ${formatPct(percent)} (total affiché ${formatPct(LOOT_PERCENT_TOTAL)}).`)
  }

  return {
    headline: `${rarity} · base ${formatPct(percent)}`,
    sections: [
      { title: 'Pourquoi cette valeur ?', lines: why },
      { title: 'Comment augmenter ce palier', lines: howToIncreaseRarityTier(rarity, ctx) },
    ],
  }
}

function buildRarityBoostedExplain(
  rarity: PalmonRarity,
  baseWeight: number,
  boostedWeight: number,
  basePercent: number,
  boostedPercent: number,
  _baseTotal: number,
  boostedTotal: number,
  ctx: HuntExplainContext,
): LootExplainTip {
  const deltaPct = boostedPercent - basePercent
  const deltaWeight = boostedWeight - baseWeight
  const sections: LootExplainSection[] = [
    {
      title: 'Pourquoi cette valeur ?',
      lines: [
        'Même tirage rareté qu’en base, mais les poids sont recalculés avec tes faveurs actives.',
        `Poids ${formatWeight(boostedWeight)} / ${formatWeight(boostedTotal)} → ${formatPct(boostedPercent)}.`,
        baseWeight !== boostedWeight
          ? `Par rapport à la base (${formatPct(basePercent)}) : ${deltaPct >= 0 ? '+' : ''}${formatPct(deltaPct)}.`
          : `Identique à la base (${formatPct(basePercent)}).`,
      ],
    },
  ]

  if (ctx.favorShift > 0 && baseWeight !== boostedWeight) {
    sections.push({
      title: 'Pourquoi ce bonus ?',
      lines: [
        'Une faveur « Écho de rareté » transfère du poids depuis N et R vers SR, SSR, UR et LR.',
        `Shift max appliqué : ${formatWeight(ctx.favorShift)} pts (plafonné à 12).`,
        ...describeActiveRarityFavors(ctx.activeRarityFavors),
        `Delta poids ${rarity} : ${deltaWeight >= 0 ? '+' : ''}${formatWeight(deltaWeight)}.`,
      ],
    })
  } else {
    sections.push({
      title: 'Pourquoi ce bonus ?',
      lines: [
        'Aucun écart : pas de faveur rareté dans ta file, ou elle n’a pas encore modifié ce palier.',
        'Seule la catégorie « Écho de rareté » change ces colonnes.',
      ],
    })
  }

  sections.push({
    title: 'Comment augmenter encore',
    lines: [
      ...howToIncreaseRarityTier(rarity, ctx),
      'Les faveurs espèce / biome / capture n’agissent pas sur ces % (voir section Faveurs).',
    ],
  })

  return {
    headline: `${rarity} · avec bonus ${formatPct(boostedPercent)}`,
    sections,
  }
}

function howToIncreaseSpecies(
  speciesName: string,
  speciesId: string,
  rarity: PalmonRarity,
  tierSpeciesCount: number,
  ctx: HuntExplainContext,
  activeSpeciesFavor: HuntFavor | undefined,
  activeBiomeFavor: HuntFavor | undefined,
): string[] {
  const lines: string[] = [
    `Augmente d’abord le palier ${rarity} (faveur rareté ou déblocage LR) : tout le tier monte ensemble.`,
  ]

  if (tierSpeciesCount > 1) {
    lines.push(
      `${tierSpeciesCount} espèces partagent ce tier : chacune a la même part (${formatPct(100 / tierSpeciesCount)}% théorique du tier avant normalisation).`,
    )
  }

  if (activeSpeciesFavor?.targetSpeciesId === speciesId) {
    lines.push(`✓ Faveur « Écho d’espèce » active pour ${speciesName} : le jeu peut forcer cette espèce (~55 % max).`)
  } else {
    lines.push(`Papouille ${speciesName} au refuge : chance d’obtenir « Écho d’espèce » ciblant ce Myrion.`)
  }

  if (activeBiomeFavor?.targetBiomeId === ctx.biomeId) {
    lines.push(`✓ Faveur « Écho de biome » active sur ${ctx.biomeName} : favorise les espèces du biome (~35 % max).`)
  } else {
    lines.push(`Joue au refuge avec un Myrion de ${ctx.biomeName} : chance d’« Écho de biome ».`)
  }

  return lines
}

function buildSpeciesBaseExplain(
  row: Pick<HuntSpeciesRateRow, 'id' | 'name' | 'rarity' | 'basePercent'>,
  tierBasePercent: number,
  tierSpeciesCount: number,
  ctx: HuntExplainContext,
  activeSpeciesFavor?: HuntFavor,
  activeBiomeFavor?: HuntFavor,
): LootExplainTip {
  return {
    headline: `${row.name} · base ${formatPct(row.basePercent)}`,
    sections: [
      {
        title: 'Pourquoi cette valeur ?',
        lines: [
          'Étape 2 : une fois la rareté tirée, le jeu choisit une espèce dans ce biome.',
          `Si le tirage tombe sur ${row.rarity} (${formatPct(tierBasePercent)} au total),`,
          `${tierSpeciesCount} espèce(s) se partagent le tier à parts égales.`,
          `${formatPct(tierBasePercent)} ÷ ${tierSpeciesCount} = ${formatPct(row.basePercent)} pour ${row.name}.`,
          'Les faveurs espèce/biome peuvent ensuite biaiser ce 2e tirage (non compté ici).',
        ],
      },
      {
        title: 'Comment voir ce Myrion plus souvent',
        lines: howToIncreaseSpecies(
          row.name,
          row.id,
          row.rarity,
          tierSpeciesCount,
          ctx,
          activeSpeciesFavor,
          activeBiomeFavor,
        ),
      },
    ],
  }
}

function buildSpeciesBoostedExplain(
  row: Pick<HuntSpeciesRateRow, 'id' | 'name' | 'rarity' | 'basePercent' | 'boostedPercent'>,
  tierBasePercent: number,
  tierBoostedPercent: number,
  tierSpeciesCount: number,
  ctx: HuntExplainContext,
  activeSpeciesFavor?: HuntFavor,
  activeBiomeFavor?: HuntFavor,
): LootExplainTip {
  const sections: LootExplainSection[] = [
    {
      title: 'Pourquoi cette valeur ?',
      lines: [
        `Palier ${row.rarity} avec faveurs rareté : ${formatPct(tierBoostedPercent)} (base ${formatPct(tierBasePercent)}).`,
        `${tierSpeciesCount} espèce(s) → ${formatPct(row.boostedPercent)} pour ${row.name} (base ${formatPct(row.basePercent)}).`,
      ],
    },
  ]

  if (ctx.favorShift > 0 && tierBoostedPercent !== tierBasePercent) {
    sections.push({
      title: 'Pourquoi ce bonus ?',
      lines: [
        'Le tier entier monte ou baisse car une faveur rareté a redistribué les poids.',
        ...describeActiveRarityFavors(ctx.activeRarityFavors),
        `${row.name} profite du même multiplicateur que les autres ${row.rarity} du biome.`,
      ],
    })
  } else {
    sections.push({
      title: 'Pourquoi ce bonus ?',
      lines: ['Pas de changement sur ce tier : aucune faveur rareté active ne le modifie.'],
    })
  }

  sections.push({
    title: 'Comment voir ce Myrion plus souvent',
    lines: howToIncreaseSpecies(
      row.name,
      row.id,
      row.rarity,
      tierSpeciesCount,
      ctx,
      activeSpeciesFavor,
      activeBiomeFavor,
    ),
  })

  return {
    headline: `${row.name} · bonus ${formatPct(row.boostedPercent)}`,
    sections,
  }
}

function compareSpeciesByRarityDesc(a: HuntSpeciesRateRow, b: HuntSpeciesRateRow): number {
  const rarityDelta = RARITY_SORT_DESC[a.rarity] - RARITY_SORT_DESC[b.rarity]
  if (rarityDelta !== 0) return rarityDelta
  return a.name.localeCompare(b.name, 'fr')
}

function buildFavorGuides(huntFavors: HuntFavor[], _biomeId: string, biomeName: string): HuntFavorGuide[] {
  const active = pickActiveHuntFavors(huntFavors)
  const hasCategory = (category: HuntFavor['category']) =>
    active.some((favor) => favor.category === category)

  return [
    {
      id: 'rarity',
      name: 'Écho de rareté',
      active: hasCategory('rarity'),
      summary: 'Déplace du poids N/R vers SR, SSR, UR et LR. Modifie les colonnes « bonus ».',
      howToGet: 'Papouille au refuge un Myrion à affection 5+ (chance aléatoire).',
      affectsDisplayedRates: true,
    },
    {
      id: 'species',
      name: 'Écho d’espèce',
      active: hasCategory('species_appearance'),
      summary: 'Peut forcer l’apparition d’un Myrion précis après le tirage de rareté.',
      howToGet: 'Papouille le Myrion visé au refuge.',
      affectsDisplayedRates: false,
    },
    {
      id: 'biome',
      name: 'Écho de biome',
      active: hasCategory('biome_appearance'),
      summary: `Favorise les espèces de ${biomeName} après le tirage de rareté.`,
      howToGet: 'Joue au refuge avec un Myrion natif de ce biome.',
      affectsDisplayedRates: false,
    },
    {
      id: 'capture',
      name: 'Faveur de capture',
      active: hasCategory('capture'),
      summary: 'Bonus à la capture, pas aux apparitions.',
      howToGet: 'Papouille un Myrion joyeux (joie > 55) au refuge.',
      affectsDisplayedRates: false,
    },
  ]
}

function buildHowItWorks(biomeName: string, lrAvailable: boolean): LootExplainTip {
  return {
    headline: 'Comment lire ces taux',
    sections: [
      {
        title: 'Deux étapes à chaque rencontre',
        lines: [
          '1. Tirage de rareté (N → LR) selon les poids du biome.',
          '2. Tirage d’espèce parmi les Myrions de cette rareté dans le biome (parts égales).',
          `Les % affichés = probabilité finale (${biomeName}).`,
        ],
      },
      {
        title: 'Base vs bonus',
        lines: [
          'Base : sans faveur « Écho de rareté ». Bonus : avec ta file active (max 3 faveurs).',
          `Chaque colonne totalise toujours ${formatPct(LOOT_PERCENT_TOTAL)} (normalisation affichage).`,
          lrAvailable
            ? 'LR actif ici : le poids LR (0,5) entre dans le calcul.'
            : 'LR inactif ici : poids LR = 0 tant que les conditions ne sont pas remplies.',
        ],
      },
      {
        title: 'Ce qui n’est pas dans le tableau',
        lines: [
          'Faveurs espèce / biome : biaisent l’espèce après le tirage de rareté.',
          'Faveurs capture / anti-fuite / indice : n’affectent pas les apparitions.',
        ],
      },
    ],
  }
}

function speciesRatesForBiome(
  biomeId: string,
  huntFavors: HuntFavor[],
  ctx: HuntExplainContext,
  basePct: Record<PalmonRarity, number>,
  boostedPct: Record<PalmonRarity, number>,
): HuntSpeciesRateRow[] {
  const active = pickActiveHuntFavors(huntFavors)
  const activeSpeciesFavor = active.find((favor) => favor.category === 'species_appearance')
  const activeBiomeFavor = active.find((favor) => favor.category === 'biome_appearance')

  const speciesInBiome = PALMON_SPECIES.filter((species) => species.biomeId === biomeId)
  const baseBySpecies = distributeSpeciesPercents(speciesInBiome, basePct)
  const boostedBySpecies = distributeSpeciesPercents(speciesInBiome, boostedPct)

  const tierCounts = Object.fromEntries(
    PALMON_RARITIES.map((rarity) => [
      rarity,
      speciesInBiome.filter((row) => row.rarity === rarity).length,
    ]),
  ) as Record<PalmonRarity, number>

  return speciesInBiome
    .map((species) => {
      const tierSpeciesCount = tierCounts[species.rarity] ?? 1
      const tierBasePercent = basePct[species.rarity] ?? 0
      const tierBoostedPercent = boostedPct[species.rarity] ?? 0
      const basePercent = baseBySpecies.get(species.id) ?? 0
      const boostedPercent = boostedBySpecies.get(species.id) ?? 0

      const rowBase = {
        id: species.id,
        name: species.name,
        rarity: species.rarity,
        basePercent,
        boostedPercent,
      }

      return {
        id: species.id,
        name: species.name,
        emoji: species.emoji,
        rarity: species.rarity,
        basePercent,
        boostedPercent,
        tierSpeciesCount,
        tierBasePercent,
        tierBoostedPercent,
        baseExplain: buildSpeciesBaseExplain(
          rowBase,
          tierBasePercent,
          tierSpeciesCount,
          ctx,
          activeSpeciesFavor,
          activeBiomeFavor,
        ),
        boostedExplain: buildSpeciesBoostedExplain(
          rowBase,
          tierBasePercent,
          tierBoostedPercent,
          tierSpeciesCount,
          ctx,
          activeSpeciesFavor,
          activeBiomeFavor,
        ),
      }
    })
    .sort(compareSpeciesByRarityDesc)
}

function favorNotes(huntFavors: HuntFavor[]): string[] {
  const active = pickActiveHuntFavors(huntFavors)
  if (active.length === 0) {
    return ['Aucune faveur active — colonne « avec bonus » = taux de base.']
  }

  return active.map((favor) => {
    switch (favor.category) {
      case 'rarity':
        return `Écho de rareté niv.${favor.level} · ${favor.remainingEncounters} rencontres restantes · modifie les % bonus.`
      case 'biome_appearance':
        return `Écho de biome (${favor.targetBiomeId ?? '?'}) · biais espèce après tirage, pas les %.`
      case 'species_appearance':
        return `Écho d’espèce (${favor.targetSpeciesId ?? '?'}) · peut forcer ce Myrion, pas les %.`
      case 'capture':
        return `Faveur capture niv.${favor.level} · bonus capture uniquement.`
      case 'anti_flee':
        return `Anti-fuite niv.${favor.level} · réduit l’échec auto, pas le spawn.`
      case 'hint':
        return `Indice niv.${favor.level} · révèle plus tôt, pas le spawn.`
      case 'shiny':
        return `Éclat shiny niv.${favor.level} · variante cosmétique, pas le spawn.`
      default:
        return `Faveur ${favor.category} active.`
    }
  })
}

export const HUNT_RATE_COLUMN_EXPLAINS = {
  base: {
    headline: 'Colonne Base',
    sections: [
      {
        title: 'Pourquoi cette colonne ?',
        lines: [
          'Taux calculés sans faveur « Écho de rareté ».',
          'Reflet de ta progression (LR débloqué ou non) et des poids standard N:45 · R:28 · SR:15 · SSR:8 · UR:3,5.',
        ],
      },
      {
        title: 'Comment augmenter les hauts paliers',
        lines: [
          'Complète le bestiaire du biome (70 % + SSR+ pour LR).',
          'Les faveurs rareté n’agissent que sur la colonne Bonus.',
        ],
      },
    ],
  } satisfies LootExplainTip,
  boosted: {
    headline: 'Colonne Avec bonus',
    sections: [
      {
        title: 'Pourquoi cette colonne ?',
        lines: [
          'Même calcul que la base, plus les faveurs actives en file (max 3).',
          'Seul « Écho de rareté » modifie ces pourcentages.',
        ],
      },
      {
        title: 'Comment activer un bonus',
        lines: [
          'Papouille un Myrion affection 5+ au refuge pour obtenir « Écho de rareté ».',
          'Consomme la faveur sur les prochaines rencontres (durée selon le niveau).',
        ],
      },
    ],
  } satisfies LootExplainTip,
} as const

export function getHuntBiomeDropSheet(
  biomeId: string,
  collection: PlayerCollection,
  huntFavors: HuntFavor[] = [],
): HuntBiomeDropSheet | null {
  const biome = BIOMES.find((entry) => entry.id === biomeId)
  if (!biome) return null

  const progress = getBiomeProgress(biomeId, collection)
  const lrSteps = getLrUnlockSteps(biomeId, collection)
  const baseWeights = getBiomeRarityWeights(biomeId, collection, [])
  const boostedWeights = getBiomeRarityWeights(biomeId, collection, huntFavors)
  const basePct = normalizeRarityPercents(baseWeights)
  const boostedPct = normalizeRarityPercents(boostedWeights)
  const baseTotal = totalWeight(baseWeights)
  const boostedTotal = totalWeight(boostedWeights)
  const lrAvailable = baseWeights.LR > 0
  const favorShift = getRarityFavorShift(huntFavors)
  const activeRarityFavors = pickActiveHuntFavors(huntFavors).filter(
    (favor) => favor.category === 'rarity',
  )

  const ctx: HuntExplainContext = {
    biomeId,
    biomeName: biome.name,
    huntFavors,
    lrAvailable,
    progress,
    lrSteps,
    favorShift,
    activeRarityFavors,
  }

  const rarityRows: HuntRarityRateRow[] = PALMON_RARITIES.map((rarity) => {
    const baseWeight = baseWeights[rarity] ?? 0
    const boostedWeight = boostedWeights[rarity] ?? 0
    const basePercent = basePct[rarity] ?? 0
    const boostedPercent = boostedPct[rarity] ?? 0

    return {
      rarity,
      basePercent,
      boostedPercent,
      baseWeight,
      boostedWeight,
      baseExplain: buildRarityBaseExplain(rarity, baseWeight, basePercent, baseTotal, ctx),
      boostedExplain: buildRarityBoostedExplain(
        rarity,
        baseWeight,
        boostedWeight,
        basePercent,
        boostedPercent,
        baseTotal,
        boostedTotal,
        ctx,
      ),
    }
  })

  return {
    biomeId,
    biomeName: biome.name,
    emoji: biome.emoji,
    unlocked: isBiomeUnlocked(biomeId, collection),
    lrAvailable,
    progress,
    lrUnlockSteps: lrSteps,
    favorGuides: buildFavorGuides(huntFavors, biomeId, biome.name),
    howItWorks: buildHowItWorks(biome.name, lrAvailable),
    rarityRows,
    speciesRows: speciesRatesForBiome(biomeId, huntFavors, ctx, basePct, boostedPct),
    activeFavorNotes: favorNotes(huntFavors),
  }
}

export function getHuntDropSheets(
  collection: PlayerCollection,
  huntFavors: HuntFavor[] = [],
): HuntBiomeDropSheet[] {
  return BIOMES.map((biome) => getHuntBiomeDropSheet(biome.id, collection, huntFavors)).filter(
    (sheet): sheet is HuntBiomeDropSheet => sheet !== null,
  )
}

export { RARITY_COLORS }
