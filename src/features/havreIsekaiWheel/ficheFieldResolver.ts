import layoutMapJson from '../../data/destinyWheel/fiche_de_destin_layout_map.json' with { type: 'json' }
import type { CharacterSheet, RunState } from '../../data/destinyWheel/types'
import type { HavreGameModeDef, SavedHavreIsekaiCard } from './types'

export type FicheLayoutRegion = {
  id: string
  label: string
  type: 'text' | 'image'
  x_pct: number
  y_pct: number
  w_pct: number
  h_pct: number
  text_anchor?: string
}

export type FicheLayoutMap = {
  template_image: string
  canvas: { width: number; height: number }
  regions: FicheLayoutRegion[]
}

export const FICHE_LAYOUT_MAP = layoutMapJson as FicheLayoutMap
export const FICHE_TEMPLATE_URL = '/assets/destiny-wheel/fiche/fiche_de_destin_isekai_fantasy.png'
export const FICHE_OVERLAY_URL = '/assets/destiny-wheel/fiche/fiche_de_destin_field_overlay.png'

const WHEEL_ALIASES: Record<string, string> = {
  fusion: 'blessing_curse_fusion',
}

function wheelLabel(state: RunState, wheelId: string, fallback = '—'): string {
  const key = WHEEL_ALIASES[wheelId] ?? wheelId
  return state.selectedItemLabels[key] ?? fallback
}

function statValue(state: RunState, stat: string): number {
  const value = state.stats[stat]
  return typeof value === 'number' ? value : 0
}

function statBar(value: number, max = 10): string {
  const clamped = Math.max(0, Math.min(max, value))
  const filled = Math.round(clamped)
  return `${'█'.repeat(filled)}${'░'.repeat(max - filled)}`
}

function combosNotes(sheet: CharacterSheet, card?: SavedHavreIsekaiCard): string {
  const lines: string[] = []
  for (const combo of sheet.finale.combos) {
    lines.push(combo.name ?? combo.id)
  }
  for (const roast of sheet.finale.statRoasts) {
    lines.push(`${roast.label}: ${roast.text}`)
  }
  if (card?.playerMeta.badge) lines.unshift(`Badge: ${card.playerMeta.badge}`)
  if (card?.playerMeta.jokersUsed.length) {
    lines.push(`Jokers: ${card.playerMeta.jokersUsed.join(', ')}`)
  }
  return lines.join(' · ') || sheet.finale.comicLine
}

export function resolveFicheFieldValue(
  regionId: string,
  sheet: CharacterSheet,
  runState: RunState,
  card?: SavedHavreIsekaiCard,
  modeDef?: HavreGameModeDef,
  displayName?: string,
): string {
  switch (regionId) {
    case 'name_box':
      return displayName ?? card?.displayName ?? sheet.identity.name
    case 'title_box':
      return sheet.identity.title
    case 'portrait_frame':
      return '👤'
    case 'origin_world':
      return wheelLabel(runState, 'origin_world')
    case 'arrival_cause':
      return wheelLabel(runState, 'arrival_cause')
    case 'landing_point':
      return wheelLabel(runState, 'landing_point')
    case 'havre_reaction':
      return wheelLabel(runState, 'havre_reaction')
    case 'nature_race':
      return wheelLabel(runState, 'nature_race')
    case 'rpg_class':
      return wheelLabel(runState, 'rpg_class')
    case 'refuge_job':
      return wheelLabel(runState, 'refuge_job')
    case 'special_destiny':
      return wheelLabel(runState, 'special_destiny')
    case 'blessing':
      return wheelLabel(runState, 'blessing', '—')
    case 'curse':
      return wheelLabel(runState, 'curse', '—')
    case 'fusion':
      return wheelLabel(runState, 'blessing_curse_fusion', '—')
    case 'arrival_object':
      return wheelLabel(runState, 'arrival_object')
    case 'linked_myrion':
      return wheelLabel(runState, 'linked_myrion')
    case 'social_talent':
      return wheelLabel(runState, 'social_talent')
    case 'relational_flaw':
      return wheelLabel(runState, 'relational_flaw')
    case 'secret':
      return wheelLabel(runState, 'secret')
    case 'personal_quest':
      return wheelLabel(runState, 'personal_quest')
    case 'first_day_incident':
      return wheelLabel(runState, 'first_day_incident')
    case 'final_obstacle':
      return wheelLabel(runState, 'final_obstacle')
    case 'verdict':
      return sheet.finale.verdict.label
    case 'reward':
      return Object.keys(runState.reward ?? {}).length > 0
        ? JSON.stringify(runState.reward)
        : sheet.finale.verdict.reward_hint ?? '—'
    case 'combos_notes':
      return combosNotes(sheet, card)
    case 'optional_mode_badge':
      return modeDef?.card_badge ?? card?.playerMeta.badge ?? '—'
    case 'optional_run_badge':
      return card?.mode ?? '—'
    default:
      if (regionId.endsWith('_value')) {
        const stat = regionId.replace('_value', '')
        return String(statValue(runState, stat))
      }
      if (regionId.endsWith('_bar')) {
        const stat = regionId.replace('_bar', '')
        return statBar(statValue(runState, stat))
      }
      return '—'
  }
}

export function buildFicheFieldMap(
  sheet: CharacterSheet,
  runState: RunState,
  card?: SavedHavreIsekaiCard,
  modeDef?: HavreGameModeDef,
  displayName?: string,
): Record<string, string> {
  const map: Record<string, string> = {}
  for (const region of FICHE_LAYOUT_MAP.regions) {
    if (region.type === 'image') continue
    map[region.id] = resolveFicheFieldValue(region.id, sheet, runState, card, modeDef, displayName)
  }
  return map
}
