import havreRaw from './havre_isekai_wheel_seed_v1_complete.json' with { type: 'json' }
import type {
  CommentatorDef,
  ComboRule,
  DestinyWheelSeed,
  RequirementSpec,
  StatRoastRule,
  VerdictRule,
  WheelDef,
  WheelItem,
  WheelType,
} from './types.ts'

type HavreCondition =
  | null
  | { requires_tag?: string }
  | { requires_all_tags?: string[] }

type HavreWheel = {
  id: string
  label: string
  order: number
  type: string
  condition?: HavreCondition
  items: WheelItem[]
}

type HavreComboRule = {
  id: string
  label?: string
  text?: string
  requires_tags?: string[]
}

type HavreStatRoastRule = {
  id: string
  text: string
  requires?: string[]
}

type HavreCommentator = {
  label: string
  role: string
  lines: string[]
}

type HavreSeedRaw = {
  metadata: { id: string; title: string; version: string }
  rarities: Record<string, { weight_scale?: number }>
  stats: Record<string, { label: string }>
  quality_tiers: Array<{
    id: string
    label: string
    rarity: string
    base_weight: number
    score: number
  }>
  wheels: HavreWheel[]
  combo_rules?: HavreComboRule[]
  stat_roast_rules?: HavreStatRoastRule[]
  commentators?: Record<string, HavreCommentator>
  game_modes?: Record<string, import('../../features/havreIsekaiWheel/types.ts').HavreGameModeDef>
  jokers?: Record<string, import('../../features/havreIsekaiWheel/types.ts').HavreJokerDef>
  archive_rules?: import('../../features/havreIsekaiWheel/types.ts').HavreArchiveRules
}

const HAVRE_COMMENTATOR_SLOTS = {
  bard: 'laharl',
  herbalist: 'etna',
  mist_archivist: 'flonne',
} as const

function mapCondition(condition: HavreCondition): RequirementSpec | undefined {
  if (!condition) return undefined
  if ('requires_tag' in condition && condition.requires_tag) {
    return { has_tag: condition.requires_tag }
  }
  if ('requires_all_tags' in condition && condition.requires_all_tags?.length) {
    return { all_tags: condition.requires_all_tags }
  }
  return undefined
}

function mapWheelType(wheel: HavreWheel): WheelType {
  if (wheel.condition) return 'conditional'
  return 'mandatory'
}

function linesToCommentatorDef(lines: string[]): CommentatorDef {
  if (lines.length === 0) {
    return {
      role: 'commentator',
      positive: ['…'],
      neutral: ['…'],
      negative: ['…'],
      contradiction: ['…'],
    }
  }
  const chunk = Math.max(1, Math.ceil(lines.length / 4))
  return {
    role: 'commentator',
    positive: lines.slice(0, chunk),
    neutral: lines.slice(chunk, chunk * 2),
    negative: lines.slice(chunk * 2, chunk * 3),
    contradiction: lines.slice(chunk * 3).length > 0 ? lines.slice(chunk * 3) : [lines[lines.length - 1]],
  }
}

function adaptCommentators(raw: HavreSeedRaw): Record<string, CommentatorDef> {
  const result: Record<string, CommentatorDef> = {
    laharl: linesToCommentatorDef([]),
    etna: linesToCommentatorDef([]),
    flonne: linesToCommentatorDef([]),
  }

  for (const [sourceId, slot] of Object.entries(HAVRE_COMMENTATOR_SLOTS)) {
    const source = raw.commentators?.[sourceId]
    if (source?.lines?.length) {
      result[slot] = linesToCommentatorDef(source.lines)
    }
  }

  return result
}

function adaptComboRules(raw: HavreComboRule[]): ComboRule[] {
  return raw.map((rule, index) => ({
    id: rule.id,
    name: rule.label ?? rule.text ?? rule.id,
    description: rule.text,
    priority: raw.length - index,
    required_tags: rule.requires_tags,
  }))
}

function adaptStatRoastRules(raw: HavreStatRoastRule[]): StatRoastRule[] {
  return raw.map((rule, index) => ({
    id: rule.id,
    label: rule.id,
    text: rule.text,
    priority: raw.length - index,
    requirements: rule.requires?.length ? { all_tags: rule.requires } : undefined,
  }))
}

function adaptVerdictRules(wheels: WheelDef[]): VerdictRule[] {
  const verdictWheel = wheels.find((wheel) => wheel.id === 'verdict')
  if (!verdictWheel) return []
  return verdictWheel.items.map((item, index) => ({
    id: item.id,
    label: item.label,
    description: item.short_text,
    priority: verdictWheel.items.length - index,
    requirements: { selected: { verdict: item.id } },
    reward_hint: 'minor_resource_or_codex',
  }))
}

function adaptWheels(rawWheels: HavreWheel[]): WheelDef[] {
  return rawWheels.map((wheel) => ({
    id: wheel.id,
    label: wheel.label,
    order: wheel.order,
    type: mapWheelType(wheel),
    requirements: mapCondition(wheel.condition ?? null),
    items: wheel.items.map((item) => ({
      ...item,
      reaction: item.reaction ?? 'neutral',
    })),
  }))
}

export function adaptHavreSeed(raw: HavreSeedRaw = havreRaw as unknown as HavreSeedRaw): DestinyWheelSeed {
  const coreStats = Object.keys(raw.stats)
  const wheels = adaptWheels(raw.wheels)
  const comboRules = adaptComboRules(raw.combo_rules ?? [])
  const statRoastRules = adaptStatRoastRules(raw.stat_roast_rules ?? [])

  return {
    game_id: raw.metadata.id,
    version: raw.metadata.version,
    language: 'fr',
    rarity_weights: Object.fromEntries(
      Object.entries(raw.rarities).map(([key, value]) => [key, value.weight_scale ?? 1]),
    ),
    engine_rules: {
      clamps: {
        profile_multiplier_min: 0.25,
        profile_multiplier_max: 4,
        other_multiplier_min: 0.5,
        other_multiplier_max: 3,
      },
    },
    stat_model: {
      core_stats: coreStats,
      secondary_stats: [],
      quality_scale: Object.fromEntries(
        raw.quality_tiers.map((tier) => [
          tier.id,
          {
            label: tier.label,
            multiplier: Math.max(0.1, tier.score / 10),
            base_weight: tier.base_weight,
            rarity: tier.rarity,
          },
        ]),
      ),
    },
    wheels,
    combo_rules: comboRules,
    verdict_rules: adaptVerdictRules(wheels),
    commentators: adaptCommentators(raw),
    ui_reactions: {},
    name_generation: {
      prefixes: ['Ari', 'Brume', 'Lanterne', 'Refuge', 'Myrion', ''],
      middles: ['-', ' de ', ' du ', ''],
      suffixes: ['Brumes', 'Brisé', 'Errant', 'Choisi', 'Calme', ''],
      title_fragments: [
        'Pilier du refuge',
        'Anomalie du Havre',
        'Gardien de routine',
        'Catastrophe cozy',
        'Boss reconverti',
        'Carte de destin',
      ],
    },
    stat_roast_rules: statRoastRules,
    pack: {
      id: 'havre',
      label: raw.metadata.title,
      kicker: 'Roulette du Havre',
      verdictWheelId: 'verdict',
      statWheelPrefix: 'stat_',
      commentators: {
        laharl: { name: raw.commentators?.bard?.label ?? 'Le Barde' },
        etna: { name: raw.commentators?.herbalist?.label ?? "L'Herboriste" },
        flonne: { name: raw.commentators?.mist_archivist?.label ?? "L'Archiviste de la Brume" },
      },
      sheetWheels: {
        origin: 'origin_world',
        raceType: 'nature_race',
        mainClass: 'rpg_class',
        rank: 'arrival_cause',
        affiliation: 'refuge_job',
        crimeDebt: 'relational_flaw',
        mainWeapon: 'arrival_object',
        itemWorld: 'landing_point',
        itemTrait: 'social_talent',
        uniqueEvility: 'secret',
        secondaryEvility1: 'personal_quest',
        secondaryEvility2: 'linked_myrion',
        curseEvility: 'first_day_incident',
        ultimateForm: 'final_obstacle',
        finalRival: 'havre_reaction',
        finalBoss: 'final_obstacle',
        reincarnation: 'special_destiny',
      },
      gameModes: raw.game_modes,
      jokers: raw.jokers,
      archiveRules: raw.archive_rules ?? {
        auto_save: true,
        max_cards_per_mode: 100,
        never_auto_delete: ['favorite', 'locked'],
        overflow_policy: 'delete_oldest_non_favorite_unlocked',
        rename_allowed: true,
        notes_allowed: true,
        favorite_allowed: true,
        locked_allowed: true,
      },
    },
  }
}
