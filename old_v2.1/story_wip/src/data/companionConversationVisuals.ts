import type { DialogueTone } from './conversations/types'
import type { CompanionEmotionId } from './companionAssets'
import { publicAssetUrl } from './publicAssetUrl'

/** Lieu du profil dialogue → fond d'ambiance (biomes existants, pas de décor par compagnon). */
const PLACE_SCENE_BACKGROUNDS: Record<string, string> = {
  'la bibliothèque': 'assets/Background/foret-ancienne/capture-portrait.png',
  'le marché des étoiles': 'assets/Background/prairie-solaire/capture-portrait.png',
  'la place du village': 'assets/Background/prairie-solaire/dressage-portrait.png',
  'la cuisine commune': 'assets/Background/rivage-corallien/capture-portrait.png',
  'le jardin des brumes': 'assets/Background/marais-brumeux/capture-portrait.png',
  'le théâtre': 'assets/Background/disagrea-event/capture-portrait.png',
  "l'atelier des rubans": 'assets/Background/montagnes-cristallines/capture-portrait.png',
  'la source claire': 'assets/Background/rivage-corallien/dressage-portrait.png',
  'la ferme lunaire': 'assets/Background/prairie-solaire/capture-wide.png',
  'la lisière de la forêt': 'assets/Background/foret-ancienne/dressage-portrait.png',
  "l'atelier textile": 'assets/Background/montagnes-cristallines/dressage-portrait.png',
  'la cascade cachée': 'assets/Background/marais-brumeux/capture-portrait.png',
  'les archives féeriques': 'assets/Background/ruines-astrales/capture-portrait.png',
  'le laboratoire': 'assets/Background/volcan-noir/capture-portrait.png',
  'le salon des invités': 'assets/Background/desert-rouge/capture-portrait.png',
}

const BUILDING_SCENE_BACKGROUNDS: Record<string, string> = {
  'arcane-library': 'assets/Background/foret-ancienne/capture-portrait.png',
  'star-market': 'assets/Background/prairie-solaire/capture-portrait.png',
  'traveler-theater': 'assets/Background/disagrea-event/capture-portrait.png',
  'ribbon-workshop': 'assets/Background/montagnes-cristallines/capture-portrait.png',
  'clear-spring': 'assets/Background/rivage-corallien/dressage-portrait.png',
  'moon-farm': 'assets/Background/prairie-solaire/capture-wide.png',
  'mist-garden': 'assets/Background/marais-brumeux/capture-portrait.png',
  'inn': 'assets/Background/foret-ancienne/dressage-portrait.png',
}

export function conversationSceneBackgroundUrl(buildingId?: string, place?: string): string | undefined {
  const placeKey = place?.toLowerCase() ?? ''
  const rel =
    (buildingId && BUILDING_SCENE_BACKGROUNDS[buildingId]) ||
    PLACE_SCENE_BACKGROUNDS[placeKey] ||
    'assets/Background/foret-ancienne/capture-portrait.png'
  return publicAssetUrl(rel)
}

/** Map ton corpus + résultat → cutout émotion (voir staging/story/emotion-cutout-usage-map.md). */
export function emotionFromConversationBeat(params: {
  tone: DialogueTone
  affinity: number
  success: boolean
  roundIndex: number
}): CompanionEmotionId {
  const { tone, affinity, success } = params

  if (!success) {
    if (tone === 'playful' || tone === 'direct') return 'annoyed'
    if (tone === 'romantic' && affinity < 3) return 'shy'
    return 'sad'
  }

  switch (tone) {
    case 'playful':
      return 'playful'
    case 'direct':
      return affinity >= 4 ? 'happy' : 'neutral'
    case 'romantic':
      return affinity >= 3 ? 'romantic' : 'shy'
    case 'sincere':
    default:
      return affinity >= 4 ? 'happy' : 'neutral'
  }
}

/** Intro / transition douce entre émotions. */
export function emotionForRoundPrompt(
  preferredTone: DialogueTone,
  affinity: number,
  roundIndex: number,
): CompanionEmotionId {
  if (roundIndex === 0) return 'neutral'
  return emotionFromConversationBeat({
    tone: preferredTone,
    affinity,
    success: true,
    roundIndex,
  })
}
