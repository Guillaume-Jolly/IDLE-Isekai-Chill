import type { ProtagonistGender } from '../gameSettings'
import type { DialogueRound } from './types'

export type ParlerSessionAct =
  | 'grinding'
  | 'fingering_mc'
  | 'fingering_companion'
  | 'oral_on_mc'
  | 'oral_on_companion'
  | 'penetration'
  | 'riding'
  | 'anal'
  | 'toy'
  | 'mutual_grinding'

export type ParlerRoundOutcomeMeta = {
  acts?: ParlerSessionAct[]
  mcClimaxOnSuccess?: boolean
  companionClimaxOnSuccess?: boolean
  beatLabel?: string
}

export type ParlerSessionRoundEntry = {
  roundIndex: number
  score: number | undefined
  succeeded: boolean
  beatLabel: string
  acts: ParlerSessionAct[]
  mcClimax: boolean
  companionClimax: boolean
}

export type ParlerSessionSummary = {
  roundsPlayed: number
  roundsSucceeded: number
  mcClimaxCount: number
  companionClimaxCount: number
  acts: ParlerSessionAct[]
  beats: string[]
  rounds: ParlerSessionRoundEntry[]
}

export type ParlerPackFinaleTemplate = {
  setting: string
  closing: string
}

const ACT_PHRASES: Record<ProtagonistGender, Partial<Record<ParlerSessionAct, string>>> = {
  male: {
    grinding: 'cuisse serrée entre tes jambes',
    fingering_companion: 'ta main sur sa chatte',
    oral_on_companion: 'ta langue sur sa chatte',
    fingering_mc: 'ses doigts sur toi',
    oral_on_mc: 'sa bouche sur ta bite',
    penetration: 'ta bite en elle',
    riding: 'elle monte sur toi',
    anal: 'par derrière',
    toy: 'gode entre vos doigts',
    mutual_grinding: 'hanches collées',
  },
  female: {
    grinding: 'sa main sous ta robe',
    fingering_mc: 'ses doigts sur ta chatte',
    oral_on_mc: 'sa langue sur toi',
    fingering_companion: 'ta main sur elle',
    oral_on_companion: 'ta bouche sur elle',
    penetration: 'face à face sur toi',
    riding: 'chatte contre la tienne',
    anal: 'par derrière',
    toy: 'gode sous le comptoir',
    mutual_grinding: 'cuisses frottées',
  },
}

const INTIMATE_FINALE_THRESHOLD = 2

function roundSucceeded(score: number | undefined): boolean {
  return score !== undefined && score >= INTIMATE_FINALE_THRESHOLD
}

function inferActsFromCompanionAction(
  action: string | undefined,
  gender: ProtagonistGender,
): ParlerSessionAct[] {
  const blob = (action ?? '').toLowerCase()
  const acts: ParlerSessionAct[] = []
  if (!blob) return acts

  if (/\bgode\b/i.test(blob)) acts.push('toy')
  if (/\b(?:califourchon|chevauche|monte sur|genoux de chaque côté)\b/i.test(blob)) {
    acts.push(/\bfrotte\b/i.test(blob) && gender === 'female' ? 'mutual_grinding' : 'riding')
  }
  if (/\b(?:en toi|ta bite|en son cul|par derrière|encule)\b/i.test(blob)) {
    acts.push(/\banus|cul|derrière\b/i.test(blob) ? 'anal' : 'penetration')
  }
  if (/\b(?:langue|lèche|lécher|suce|suces|bouche.*(?:chatte|clitoris|bite)|agenouille entre tes)\b/i.test(blob)) {
    if (/\b(?:ta chatte|ton clitoris|en toi|tes cuisses|ta culotte|ton ventre)\b/i.test(blob)) {
      acts.push('oral_on_mc')
    }
    if (/\b(?:sa chatte|son clitoris|ses cuisses ouvertes sur ton visage|entre ses cuisses)\b/i.test(blob)) {
      acts.push('oral_on_companion')
    }
  }
  if (/\b(?:presse ta main contre sa|doigts contre sa chatte|écarte les cuisses et presse ta main)\b/i.test(blob)) {
    acts.push('fingering_companion')
  }
  if (/\b(?:presse ses doigts contre ta|doigts sur ta chatte|main glissée sous ta robe|glisse ses doigts en toi)\b/i.test(blob)) {
    acts.push('fingering_mc')
  }
  if (/\b(?:cuisse glissée|presse-toi contre|entre tes jambes)\b/i.test(blob) && acts.length === 0) {
    acts.push('grinding')
  }
  return [...new Set(acts)]
}

function inferClimaxFromFinale(
  finale: string | undefined,
): { mcClimax: boolean; companionClimax: boolean } {
  const text = finale ?? ''
  const mcClimax =
    /\b(tu jouis|tu as joui|relâche-toi|tu as tremblé|t(?:'a|e) fait jouir)\b/i.test(text) &&
    !/\btu fais encore semblant\b/i.test(text)
  const companionClimax =
    /\b(elle jouit|elle a joui|elle a tremblé|son orgasme|tremblements de son orgasme|gémissements terminés)\b/i.test(
      text,
    )
  return { mcClimax, companionClimax }
}

function mergeActs(
  fromMeta: ParlerSessionAct[] | undefined,
  fromAction: ParlerSessionAct[],
): ParlerSessionAct[] {
  return [...new Set([...(fromMeta ?? []), ...fromAction])]
}

export function deriveParlerSessionSummary(
  rounds: Array<DialogueRound & { sessionOutcome?: ParlerRoundOutcomeMeta }>,
  scores: number[],
  protagonistGender: ProtagonistGender,
): ParlerSessionSummary {
  const roundEntries: ParlerSessionRoundEntry[] = []
  const acts: ParlerSessionAct[] = []
  const beats: string[] = []
  let mcClimaxCount = 0
  let companionClimaxCount = 0
  let roundsSucceeded = 0

  rounds.forEach((round, roundIndex) => {
    const score = scores[roundIndex]
    const succeeded = roundSucceeded(score)
    const finale =
      succeeded && round.intimateFinale?.trim()
        ? round.intimateFinale
        : !succeeded && round.intimateFinaleLow?.trim()
          ? round.intimateFinaleLow
          : undefined
    const inferredClimax = inferClimaxFromFinale(finale)
    const meta = round.sessionOutcome
    const roundActs = mergeActs(
      meta?.acts,
      inferActsFromCompanionAction(round.companionAction, protagonistGender),
    )
    const mcClimax =
      succeeded &&
      (meta?.mcClimaxOnSuccess === true ||
        (meta?.mcClimaxOnSuccess !== false && inferredClimax.mcClimax))
    const companionClimax =
      succeeded &&
      (meta?.companionClimaxOnSuccess === true ||
        (meta?.companionClimaxOnSuccess !== false && inferredClimax.companionClimax))

    if (succeeded) roundsSucceeded += 1
    if (mcClimax) mcClimaxCount += 1
    if (companionClimax) companionClimaxCount += 1
    roundActs.forEach((act) => {
      if (!acts.includes(act)) acts.push(act)
    })
    const beatLabel = meta?.beatLabel?.trim() || `Échange ${roundIndex + 1}`
    if (succeeded) beats.push(beatLabel)

    roundEntries.push({
      roundIndex,
      score,
      succeeded,
      beatLabel,
      acts: roundActs,
      mcClimax,
      companionClimax,
    })
  })

  return {
    roundsPlayed: rounds.length,
    roundsSucceeded,
    mcClimaxCount,
    companionClimaxCount,
    acts,
    beats,
    rounds: roundEntries,
  }
}

function formatMcClimaxPhrase(count: number, gender: ProtagonistGender): string {
  if (count <= 0) return ''
  if (gender === 'female') {
    if (count === 1) return 'une fois tu as tremblé'
    return `${count === 2 ? 'deux' : count} fois tu as tremblé`
  }
  if (count === 1) return 'une fois tu as joui'
  return `${count === 2 ? 'deux' : count} fois tu as joui`
}

function formatCompanionClimaxPhrase(count: number): string {
  if (count <= 0) return ''
  if (count === 1) return 'une fois elle a tremblé'
  return `${count === 2 ? 'deux' : count} fois elle a tremblé`
}

function formatActsPhrase(acts: ParlerSessionAct[], gender: ProtagonistGender): string {
  return acts
    .map((act) => ACT_PHRASES[gender][act])
    .filter(Boolean)
    .join(', ')
}

export function composePackFinaleMiddleSegment(
  summary: ParlerSessionSummary,
  protagonistGender: ProtagonistGender,
): string {
  const parts: string[] = []
  const mcPhrase = formatMcClimaxPhrase(summary.mcClimaxCount, protagonistGender)
  const companionPhrase = formatCompanionClimaxPhrase(summary.companionClimaxCount)
  if (mcPhrase) parts.push(mcPhrase)
  if (companionPhrase) parts.push(companionPhrase)
  const actsPhrase = formatActsPhrase(summary.acts, protagonistGender)
  if (actsPhrase) parts.push(actsPhrase)
  return parts.join(', ')
}

export function composePackIntimateFinale(
  template: ParlerPackFinaleTemplate,
  summary: ParlerSessionSummary,
  protagonistGender: ProtagonistGender,
): string {
  const middle = composePackFinaleMiddleSegment(summary, protagonistGender)
  const segments = [template.setting.trim(), middle.trim(), template.closing.trim()].filter(Boolean)
  return segments.join(' ; ')
}

export function formatParlerSessionSummaryLines(
  summary: ParlerSessionSummary,
  protagonistGender: ProtagonistGender,
): string[] {
  const lines: string[] = []
  lines.push(`${summary.roundsSucceeded}/${summary.roundsPlayed} échanges réussis`)
  if (summary.mcClimaxCount > 0) {
    lines.push(
      protagonistGender === 'female'
        ? `Tu as joui ${summary.mcClimaxCount} fois`
        : `Tu as joui ${summary.mcClimaxCount} fois`,
    )
  }
  if (summary.companionClimaxCount > 0) {
    lines.push(`Lyra a joui ${summary.companionClimaxCount} fois`)
  }
  const actsPhrase = formatActsPhrase(summary.acts, protagonistGender)
  if (actsPhrase) lines.push(actsPhrase.charAt(0).toUpperCase() + actsPhrase.slice(1))
  return lines
}
