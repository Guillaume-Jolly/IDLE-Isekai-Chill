import committed from './laharl-color2-layer-alignments.json'
import {
  COLOR2_LAHARL_ALIGN_LAYERS,
  COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID,
  getColor2AlignLayer,
} from './color2LayerAlignCatalog'

export type Color2LayerAlignState = {
  visible: boolean
  locked: boolean
  xPx: number
  yPx: number
  xPct: number
  yPct: number
  /** 0 = taille naturelle du PNG */
  widthPx: number
  heightPx: number
  widthPct: number
  heightPct: number
}

export type Color2AlignDocument = {
  companionId: string
  portraitSrc: string
  baseVisible: boolean
  layers: Record<string, Color2LayerAlignState>
}

const STORAGE_KEY = 'color2-layer-align-laharl-v2'

function defaultLayerState(): Color2LayerAlignState {
  return {
    visible: false,
    locked: false,
    xPx: 0,
    yPx: 0,
    xPct: 0,
    yPct: 0,
    widthPx: 0,
    heightPx: 0,
    widthPct: 0,
    heightPct: 0,
  }
}

function normalizeDocument(raw: Partial<Color2AlignDocument>): Color2AlignDocument {
  const layers: Record<string, Color2LayerAlignState> = {}
  for (const def of COLOR2_LAHARL_ALIGN_LAYERS) {
    const saved = raw.layers?.[def.id]
    layers[def.id] = saved
      ? { ...defaultLayerState(), ...saved }
      : def.id === COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID
        ? {
            visible: true,
            locked: false,
            xPx: 0,
            yPx: 0,
            xPct: 0,
            yPct: 0,
            widthPx: 0,
            heightPx: 0,
            widthPct: 0,
            heightPct: 0,
          }
        : defaultLayerState()
  }
  return {
    companionId: raw.companionId ?? 'laharl',
    portraitSrc: raw.portraitSrc ?? '/assets/companions/laharl/affinity-1.png',
    baseVisible: raw.baseVisible ?? true,
    layers,
  }
}

export function loadColor2AlignDocument(): Color2AlignDocument {
  const base = normalizeDocument(committed as Color2AlignDocument)
  if (typeof window === 'undefined') return base
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    return normalizeDocument({ ...base, ...JSON.parse(raw) })
  } catch {
    return base
  }
}

export function saveColor2AlignDocument(doc: Color2AlignDocument): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doc, null, 2))
}

export function pxToPct(xPx: number, yPx: number, portraitW: number, portraitH: number) {
  return {
    xPct: portraitW > 0 ? (xPx / portraitW) * 100 : 0,
    yPct: portraitH > 0 ? (yPx / portraitH) * 100 : 0,
  }
}

export function sizeToPct(widthPx: number, heightPx: number, portraitW: number, portraitH: number) {
  return {
    widthPct: portraitW > 0 ? (widthPx / portraitW) * 100 : 0,
    heightPct: portraitH > 0 ? (heightPx / portraitH) * 100 : 0,
  }
}

export function pctToPx(xPct: number, yPct: number, portraitW: number, portraitH: number) {
  return {
    xPx: (xPct / 100) * portraitW,
    yPx: (yPct / 100) * portraitH,
  }
}

export async function persistColor2AlignToRepo(doc: Color2AlignDocument): Promise<boolean> {
  try {
    const response = await fetch('/dev-api/color2-layer-align', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    })
    return response.ok
  } catch {
    return false
  }
}

export function getLayerAlignState(
  doc: Color2AlignDocument,
  layerId: string,
): Color2LayerAlignState {
  return doc.layers[layerId] ?? defaultLayerState()
}

export function resolveLayerDisplaySize(
  state: Color2LayerAlignState,
  naturalW: number,
  naturalH: number,
) {
  return {
    widthPx: state.widthPx > 0 ? state.widthPx : naturalW,
    heightPx: state.heightPx > 0 ? state.heightPx : naturalH,
  }
}

export type LockedAlignPlacement = {
  layerId: string
  layerSrc: string
  state: Color2LayerAlignState
}

export function getLockedAlignPlacement(debugLayerId: string): LockedAlignPlacement | null {
  const def = getColor2AlignLayer(debugLayerId)
  if (!def) return null
  const doc = loadColor2AlignDocument()
  const state = doc.layers[debugLayerId]
  if (!state?.locked) return null
  return { layerId: debugLayerId, layerSrc: def.src, state }
}

export function hasLockedDefaultHairLayer(): boolean {
  return getLockedAlignPlacement(COLOR2_LAHARL_DEFAULT_HAIR_LAYER_ID) !== null
}
