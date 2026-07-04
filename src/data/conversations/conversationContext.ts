import type { CompanionEmotionId } from '../companionAssets'
import { LYRA_INTIMATE_CUTOUT_EMOTION_IDS } from '../companionAssets'
import type { DialogueChoice } from './types'
import { COMPANION_DIALOGUE_PROFILES } from './profiles'
import type { ProtagonistGender } from '../gameSettings'
import type { ParlerPackFinaleTemplate, ParlerSessionSummary } from './parlerSessionSummary'
import { composePackIntimateFinale } from './parlerSessionSummary'

/** Lignes narrateur méta générées par le corpus — ignorées à l'extraction. */
const META_NARRATOR_LINE = [
  /^La conversation s'ouvre autour de/i,
  /^Tu comprends vite que/i,
  /^Le premier mot compte/i,
  /^Un détail lié à/i,
  /^Un silence s'installe/i,
  /^Tu sens qu'une mauvaise réponse/i,
  /^La question paraît simple/i,
  /^La tension baisse/i,
  /^La brume du campement/i,
  /^Un Myrion passe au loin/i,
  /^Le moment pourrait finir/i,
  /relève les yeux quand le sujet arrive/i,
]

const COMPANION_TAIL_CLAUSE =
  /\s*(Ce sujet ne passe pas inaperçu|Ce sujet restera entre vous[^.]*|Elle attend une réponse qui ne traite pas[^.]*)\.?\s*$/i

const SCENE_ACTION_LINE =
  /^elle (ajuste|replace|replie|vérifie|baisse|feuillette)\b/i

const fillPlaceholders = (text: string, name: string, place: string) =>
  text.replaceAll('{name}', name).replaceAll('{place}', place)

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const isMetaNarratorLine = (line: string) =>
  META_NARRATOR_LINE.some((pattern) => pattern.test(line.trim()))

const isSceneDecorLine = (line: string) =>
  /\btu retrouves\b/i.test(line) || SCENE_ACTION_LINE.test(line.trim())

const extractCompanionSpeech = (line: string, name: string) => {
  let speech = line.replace(COMPANION_TAIL_CLAUSE, '').trim()
  const nameAction = new RegExp(`\\.\\s*${escapeRegExp(name)}\\s+[^.]+\\.`, 'i')
  const cut = speech.search(nameAction)
  if (cut >= 0) {
    speech = speech.slice(0, cut + 1).trim()
  }
  speech = speech.replace(/\s*Ce que j'attends, c'est[^.]*\.?\s*$/i, '').trim()
  return speech
}

const looksLikeCompanionSpeech = (line: string, name: string) => {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (new RegExp(`^${escapeRegExp(name)}\\s`, 'i').test(trimmed)) return false
  if (isSceneDecorLine(trimmed)) return false
  return /^(«|[Jj]e |[Tt]u |[Ll]e |[Cc]e |[Rr]este|[Oo]n |[Ss]i |[Dd]is-|[Cc]ette |L'|Il |—)/.test(
    trimmed,
  )
}

const formatSpeech = (line: string) => {
  const trimmed = line.trim()
  if (trimmed.startsWith('«')) return trimmed
  // Conserver ? et ! ; retirer seulement le point terminal (typo guillemets FR).
  const inner = trimmed.endsWith('.') ? trimmed.slice(0, -1) : trimmed
  return `« ${inner} »`
}

export { formatSpeech }

const stripSpeechGuillemets = (line: string) =>
  line.replace(/^«\s*/, '').replace(/\s*»$/, '').trim()

const topicFromRawContext = (contextLines: string[]) => {
  const combined = contextLines.join(' ')
  const topicMatch = combined.match(/Le sujet touche ([^.]+)\./i)
  return topicMatch?.[1]?.trim() ?? null
}

const topicFromScenarioTitle = (scenarioTitle: string) => {
  const part = scenarioTitle.split('—').pop()?.trim()
  return part && part.length > 0 ? part : null
}

/** Une seule ligne de transition : le sujet de l'échange, pas le décor. */
const buildTopicBridge = (
  rawContextLines: string[],
  scenarioTitle: string,
  roundIndex: number,
): string => {
  if (roundIndex === 1) {
    return `L'échange se resserre entre vous.`
  }
  if (roundIndex === 2) {
    return `Il reste encore quelques mots à placer avec justesse.`
  }

  const topic = topicFromRawContext(rawContextLines)
  if (topic && /lien|relation|passage|confiance|proximité|campement/i.test(topic)) {
    return `Une discussion autour de votre relation s'engage entre vous.`
  }
  if (topic && /^une sortie vers /i.test(topic)) {
    const destination = topic.replace(/^une sortie vers /i, '')
    return `Vous parlez d'une éventuelle sortie vers ${destination}.`
  }
  if (topic) {
    return `La conversation porte sur ${topic}.`
  }

  const titleTopic = topicFromScenarioTitle(scenarioTitle)
  if (titleTopic) {
    return `Une discussion autour de ${titleTopic.toLowerCase()} s'engage entre vous.`
  }

  return `Une conversation s'engage entre vous.`
}

const extractCompanionSpeechFromRaw = (companionId: string, lines: string[]): string | null => {
  const profile = COMPANION_DIALOGUE_PROFILES[companionId]
  if (!profile) return null

  const { name, place } = profile

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    let line = fillPlaceholders(lines[index]?.trim() ?? '', name, place)
    if (!line || isMetaNarratorLine(line) || isSceneDecorLine(line)) continue

    const speech = extractCompanionSpeech(line, name)
    if (speech && looksLikeCompanionSpeech(speech, name)) {
      return speech
    }
  }

  return null
}

/** Aligne le sujet générique du prompt méta avec le contexte brut du corpus. */
const alignMetaPromptTopic = (prompt: string, contextLines: string[]): string => {
  const combined = contextLines.join(' ')
  let polished = prompt

  const outingMatch = combined.match(/Le sujet touche (une sortie vers [^.]+)/i)
  if (outingMatch && /biome familier/i.test(polished)) {
    polished = polished.replace(/le biome familier/i, outingMatch[1])
  }

  const topicMatch = combined.match(/Le sujet touche ([^.]+)\./i)
  if (topicMatch && /sur la ressource rare/i.test(polished)) {
    polished = polished.replace(/la ressource rare/i, topicMatch[1].trim())
  }

  return polished
}

const topicToCompanionQuestion = (topic: string): string => {
  const trimmed = topic.trim()

  if (/lien|relation|passage|confiance|proximité|campement/i.test(trimmed)) {
    return `J'aimerais qu'on parle de nous plus franchement.`
  }
  if (/^une sortie vers/i.test(trimmed)) {
    const phrase = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    return `${phrase}… tu y penses vraiment ?`
  }
  if (/^la gestion de /i.test(trimmed)) {
    return `Comment vois-tu ${trimmed.replace(/^la /i, '')} ici ?`
  }
  if (/^l'|^la |^le |^un |^une /i.test(trimmed)) {
    const bare = trimmed.replace(/^(la |le |l'|une |un )/i, '')
    return `Qu'est-ce que ${bare} t'évoque, pour toi ?`
  }
  return `Qu'en dis-tu, au sujet de ${trimmed} ?`
}

const metaPromptToCompanionLine = (metaPrompt: string, rawContextLines: string[]): string => {
  const aligned = alignMetaPromptTopic(metaPrompt, rawContextLines)

  const respondMatch = aligned.match(/^Comment réponds-tu à \w+ sur (.+)\?$/i)
  if (respondMatch) {
    return topicToCompanionQuestion(respondMatch[1])
  }

  if (/^Quelle réponse respecte le mieux ce moment avec/i.test(aligned)) {
    return `Dis-moi franchement ce que tu en penses.`
  }

  if (/^Comment termines-tu l'échange sans forcer la suite/i.test(aligned)) {
    return `On peut s'arrêter là… si tu préfères.`
  }

  const topic = topicFromRawContext(rawContextLines)
  if (topic) return topicToCompanionQuestion(topic)

  return `J'aimerais savoir ce que tu en penses.`
}

/**
 * Fil narrateur court + réplique du compagnon.
 * Pas de décor (« tu retrouves… », « elle feuillette… ») — seulement l'enjeu puis la voix du compagnon.
 */
export function buildConversationRoundDisplay(
  companionId: string,
  rawLines: string[],
  roundIndex: number,
  scenarioTitle: string,
  metaPrompt: string,
): { displayContext: string[]; prompt: string } {
  const rawContext = rawLines.map((line) => {
    const profile = COMPANION_DIALOGUE_PROFILES[companionId]
    return fillPlaceholders(line, profile?.name ?? 'Compagnon', profile?.place ?? 'le village')
  })

  const bridge = buildTopicBridge(rawContext, scenarioTitle, roundIndex)
  const speech = extractCompanionSpeechFromRaw(companionId, rawLines)
  const fallback = metaPromptToCompanionLine(metaPrompt, rawContext)

  return {
    displayContext: [bridge],
    prompt: formatSpeech(speech ?? fallback),
  }
}

/** Affichage « Lyra : … » dans la bulle compagnon. */
export function formatCompanionPromptLine(companionName: string, prompt: string): string {
  return `${companionName} : ${stripSpeechGuillemets(prompt)}`
}

/** Narration 3e personne — geste Lyra (sans préfixe « Lyra : »). */
export function formatCompanionActionLine(action: string): string {
  return stripSpeechGuillemets(action).trim()
}

/** Réplique de réaction après un choix (sans guillemets) — texte brut si pas de segments. */
export function formatCompanionReactionLine(companionName: string, reaction: string): string {
  return `${companionName} : ${stripSpeechGuillemets(reaction)}`
}

export type CompanionReactionSegment =
  | { kind: 'speech'; text: string }
  | { kind: 'didascalie'; text: string }

/** Réaction mixte : « réplique » + didascalie *Elle…* (3e personne). */
export function parseCompanionReactionSegments(reaction: string): CompanionReactionSegment[] {
  const trimmed = reaction.trim()
  const segments: CompanionReactionSegment[] = []
  const pattern = /«([^»]*)»|\*([^*]+)\*/g
  let match: RegExpExecArray | null = pattern.exec(trimmed)
  while (match !== null) {
    if (match[1] !== undefined) {
      segments.push({ kind: 'speech', text: match[1].trim() })
    } else if (match[2] !== undefined) {
      segments.push({ kind: 'didascalie', text: match[2].trim() })
    }
    match = pattern.exec(trimmed)
  }
  if (segments.length === 0) {
    segments.push({ kind: 'speech', text: stripSpeechGuillemets(trimmed) })
  }
  return segments
}

const JOYFUL_PORTRAIT_EMOTIONS = new Set<CompanionEmotionId>([
  'happy',
  'playful',
  'romantic',
  'pleased',
  'warm',
  'dry_amused',
  'commanding',
  'heated',
  'dominant',
  'lustful',
])

/**
 * Cutout portrait en phase réaction — évite happy/playful sur un choix raté
 * (le toast « Raté » + un cutout joyeux prête à confusion).
 */
export function reactionPortraitEmotion(choice: DialogueChoice): CompanionEmotionId {
  const tagged = choice.emotion
  if (choice.score >= 2) {
    return tagged ?? 'happy'
  }
  if (tagged && LYRA_INTIMATE_CUTOUT_EMOTION_IDS.has(tagged)) {
    return tagged
  }
  if (tagged && !JOYFUL_PORTRAIT_EMOTIONS.has(tagged)) {
    return tagged
  }
  return 'annoyed'
}

export type ContextBubbleVariant = 'narrator' | 'companion'

export type ContextDisplayBubble = {
  variant: ContextBubbleVariant
  text: string
}

/** Segments d'épilogue aff. 5 — une bulle par phrase (séparateur « ; »). */
export function splitIntimateFinaleForDisplay(finale: string): string[] {
  return finale
    .split(/\s*;\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
}

/** Épilogue aff. 5 selon le score du choix (+3/+2 plaisant, ≤+1 variante basse si présente). */
export function resolveIntimateFinaleForScore(
  affinity: number,
  nsfwContent: boolean,
  score: number | undefined,
  round?: { intimateFinale?: string; intimateFinaleLow?: string },
): string | undefined {
  if (affinity < 5 || !nsfwContent || score === undefined || !round) return undefined
  const low = round.intimateFinaleLow?.trim()
  const high = round.intimateFinale?.trim()
  if (score <= 1 && low) return low
  if (score >= 2 && high) return high
  return undefined
}

/** Épilogue d'acte (pack) — moyenne session ≥ 2 pts/échange pour la variante haute. */
export function resolvePackIntimateFinaleForScore(
  affinity: number,
  nsfwContent: boolean,
  totalScore: number,
  roundCount: number,
  conversation?: {
    packIntimateFinale?: string
    packIntimateFinaleLow?: string
    packIntimateFinaleTemplate?: ParlerPackFinaleTemplate
  },
  sessionSummary?: ParlerSessionSummary,
  protagonistGender: ProtagonistGender = 'male',
): string | undefined {
  if (affinity < 5 || !nsfwContent || roundCount <= 0 || !conversation) return undefined
  const high = conversation.packIntimateFinale?.trim()
  const low = conversation.packIntimateFinaleLow?.trim()
  const template = conversation.packIntimateFinaleTemplate
  const threshold = roundCount * 2
  if (totalScore >= threshold) {
    if (template && sessionSummary) {
      return composePackIntimateFinale(template, sessionSummary, protagonistGender)
    }
    if (high) return high
  }
  if (totalScore < threshold && low) return low
  return undefined
}

/** Bulles de contexte — segments séparés par « ; » (pont curé aff. 4+). */
export function splitContextForDisplay(lines: string[]): ContextDisplayBubble[] {
  const merged = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
  if (!merged) return []

  return merged
    .split(/\s*;\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((text) => ({ variant: 'narrator' as const, text }))
}
