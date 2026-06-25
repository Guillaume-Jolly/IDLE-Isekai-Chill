import { applyLanguage, type GameSettings } from '../data/gameSettings'

let audioCtx: AudioContext | null = null
let masterGain: GainNode | null = null
let sfxGain: GainNode | null = null
let musicGain: GainNode | null = null

function ensureAudioChain(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (audioCtx) return audioCtx

  const Ctx =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null

  audioCtx = new Ctx()
  masterGain = audioCtx.createGain()
  sfxGain = audioCtx.createGain()
  musicGain = audioCtx.createGain()

  sfxGain.connect(masterGain)
  musicGain.connect(masterGain)
  masterGain.connect(audioCtx.destination)

  return audioCtx
}

export function getSharedAudioContext(): AudioContext | null {
  return ensureAudioChain()
}

export function getSfxOutput(): GainNode | null {
  ensureAudioChain()
  return sfxGain
}

export function getMusicOutput(): GainNode | null {
  ensureAudioChain()
  return musicGain
}

export function applyAudioVolumes(
  settings: Pick<GameSettings, 'masterVolume' | 'interfaceVolume' | 'musicVolume'>,
): void {
  ensureAudioChain()
  if (!masterGain || !sfxGain || !musicGain) return
  masterGain.gain.value = settings.masterVolume
  sfxGain.gain.value = settings.interfaceVolume
  musicGain.gain.value = settings.musicVolume
}

export function applyGameAudioSettings(settings: GameSettings): void {
  applyAudioVolumes(settings)
  applyLanguage(settings.language)
}

export async function resumeAudio(): Promise<void> {
  const ctx = ensureAudioChain()
  if (ctx?.state === 'suspended') {
    await ctx.resume()
  }
}
