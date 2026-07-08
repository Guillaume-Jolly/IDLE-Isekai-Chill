import { COLOR2_PROMPT_POOL, type Color2Prompt } from './color2Prompts'
import type { HsbColor } from './scoring'

export type Color2ChatGptDebugLayer = {
  id: string
  label: string
  maskSrc: string
  imageSrc: string
  promptFr: string
  target: HsbColor
  /** Lien optionnel vers un prompt jeu existant */
  promptId?: string
  /** luminance = masque niveaux de gris (cheveux, ombres) ; alpha = binaire */
  maskMode?: 'luminance' | 'alpha'
}

const LAHARL_IMAGE = '/assets/companions/laharl/affinity-1.png'

function laharlPrompt(part: string): Color2Prompt | undefined {
  return COLOR2_PROMPT_POOL.find((p) => p.id === `laharl-${part}`)
}

function layer(
  id: string,
  label: string,
  promptPart: string | null,
  fallbackTarget: HsbColor,
  maskMode: 'luminance' | 'alpha' = 'alpha',
): Color2ChatGptDebugLayer {
  const linked = promptPart ? laharlPrompt(promptPart) : undefined
  return {
    id,
    label,
    maskSrc: `/assets/companions/laharl/mask-chatgpt-${id}.png`,
    imageSrc: LAHARL_IMAGE,
    promptFr: linked?.promptFr ?? label,
    target: linked?.target ?? fallbackTarget,
    promptId: linked?.id,
    maskMode,
  }
}

/** Calque cheveux v3 — PNG alpha transparent, affiché tel quel. */
export const COLOR2_LAB_HAIR_V3_LAYER: Color2ChatGptDebugLayer = {
  id: 'cheveux-v3',
  label: 'Cheveux v3',
  maskSrc: '/assets/companions/laharl/mask-chatgpt-cheveux-v3.png',
  imageSrc: LAHARL_IMAGE,
  promptFr: laharlPrompt('hair')?.promptFr ?? 'Teinte des cheveux de Laharl',
  target: laharlPrompt('hair')?.target ?? { h: 218, s: 88, b: 58 },
  promptId: 'laharl-hair',
  maskMode: 'luminance',
}

/** Calque cheveux v2 — PNG transparent (précédent). */
export const COLOR2_LAB_HAIR_V2_LAYER: Color2ChatGptDebugLayer = {
  id: 'cheveux-v2',
  label: 'Cheveux v2',
  maskSrc: '/assets/companions/laharl/mask-chatgpt-cheveux-v2.png',
  imageSrc: LAHARL_IMAGE,
  promptFr: laharlPrompt('hair')?.promptFr ?? 'Teinte des cheveux de Laharl',
  target: laharlPrompt('hair')?.target ?? { h: 218, s: 88, b: 58 },
  promptId: 'laharl-hair',
  maskMode: 'luminance',
}

/** Calques ChatGPT alignés — menu debug Color Toon (`?colorToonDebug=1`). */
export const COLOR2_CHATGPT_LAHARL_LAYERS: Color2ChatGptDebugLayer[] = [
  layer('cheveux', 'Cheveux (ChatGPT)', 'hair', { h: 218, s: 88, b: 58 }),
  layer('yeux', 'Yeux (ChatGPT)', 'eyes', { h: 0, s: 80, b: 50 }),
  layer('echarpe', 'Écharpe (ChatGPT)', 'scarf', { h: 2, s: 86, b: 48 }),
  layer('pantalon', 'Pantalon (ChatGPT)', 'pants', { h: 5, s: 78, b: 38 }),
  layer('ceinture', 'Ceinture (ChatGPT)', 'buckle', { h: 0, s: 0, b: 12 }),
  layer('botte-gauche', 'Botte gauche (ChatGPT)', null, { h: 280, s: 55, b: 35 }),
  layer('botte-droite', 'Botte droite (ChatGPT)', null, { h: 280, s: 55, b: 35 }),
  layer('bras-gauche', 'Brassard gauche (ChatGPT)', null, { h: 0, s: 0, b: 8 }),
  layer('bras-droit', 'Brassard droit (ChatGPT)', null, { h: 0, s: 0, b: 8 }),
  layer('peau', 'Peau visible (ChatGPT)', null, { h: 28, s: 35, b: 88 }),
  layer('oreilles', 'Oreilles (ChatGPT)', null, { h: 28, s: 35, b: 88 }),
]

export function isColorToonMaskDebug(): boolean {
  if (!import.meta.env.DEV) return false
  if (import.meta.env.VITE_MINIGAME_LAB === 'true') return true
  const params = new URLSearchParams(window.location.search)
  return params.has('colorToonDebug') || params.has('colorToonPoc')
}

/** Lab 5174 : tous les calques alignables. Jeu / ?colorToonDebug : calques ChatGPT. */
export function getColorToonDebugLayers(): Color2ChatGptDebugLayer[] {
  if (import.meta.env.VITE_MINIGAME_LAB === 'true') {
    return [COLOR2_LAB_HAIR_V3_LAYER, COLOR2_LAB_HAIR_V2_LAYER, ...COLOR2_CHATGPT_LAHARL_LAYERS]
  }
  return COLOR2_CHATGPT_LAHARL_LAYERS
}

export function getInitialColorToonDebugLayerId(): string {
  return getColorToonDebugLayers()[0]?.id ?? ''
}

export function getChatGptDebugLayer(id: string): Color2ChatGptDebugLayer | undefined {
  return getColorToonDebugLayers().find((l) => l.id === id)
    ?? COLOR2_CHATGPT_LAHARL_LAYERS.find((l) => l.id === id)
}

export function buildChatGptDebugPrompt(layer: Color2ChatGptDebugLayer): Color2Prompt {
  return {
    id: layer.promptId ?? `laharl-chatgpt-${layer.id}`,
    companionId: 'laharl',
    imageSrc: layer.imageSrc,
    promptFr: layer.promptFr,
    target: layer.target,
  }
}
