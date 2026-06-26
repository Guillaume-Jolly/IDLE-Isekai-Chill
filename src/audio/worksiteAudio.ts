/**
 * Chantier Myrion — sons procéduraux légers (Web Audio).
 * Pas de fichiers audio : volume bas, cooldown anti-spam, bus SFX / musique existants.
 */
import type { ResourceKey } from '../data/buildingActivities'
import type { WorksiteBiomeId } from '../data/myrionWorksite'
import { getMusicOutput, getSharedAudioContext, getSfxOutput, resumeAudio } from './audioEngine'

const MINE_COOLDOWN_MS = 72
const UNLOCK_COOLDOWN_MS = 420
const DRAWER_COOLDOWN_MS = 160
const PRESTIGE_COOLDOWN_MS = 280

let lastMineAt = 0
let lastUnlockAt = 0
let lastDrawerAt = 0
let lastPrestigeAt = 0

type AmbienceNodes = {
  stop: () => void
}

let biomeAmbience: AmbienceNodes | null = null

function canPlay(lastAt: number, gapMs: number): boolean {
  const now = performance.now()
  if (now - lastAt < gapMs) return false
  return true
}

function playMineFood(): void {
  playTones(
    [
      { frequency: 520, start: 0, duration: 0.08, peak: 0.9, type: 'triangle' },
      { frequency: 780, start: 0.04, duration: 0.1, peak: 0.55, type: 'sine' },
    ],
    0.038,
  )
}

function playMineWood(): void {
  playTones(
    [
      { frequency: 180, start: 0, duration: 0.06, peak: 0.85, type: 'square' },
      { frequency: 240, start: 0.03, duration: 0.09, peak: 0.45, type: 'triangle' },
    ],
    0.034,
  )
}

function playMineStone(): void {
  playTones(
    [
      { frequency: 140, start: 0, duration: 0.05, peak: 0.75, type: 'square' },
      { frequency: 95, start: 0.02, duration: 0.11, peak: 0.5, type: 'sine' },
    ],
    0.032,
  )
}

type ToneSpec = {
  frequency: number
  start: number
  duration: number
  peak?: number
  type?: OscillatorType
}

function playTones(tones: ToneSpec[], masterGain: number): void {
  const ctx = getSharedAudioContext()
  const destination = getSfxOutput()
  if (!ctx || !destination) return

  const now = ctx.currentTime
  const bus = ctx.createGain()
  bus.gain.value = masterGain
  bus.connect(destination)

  for (const tone of tones) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const peak = tone.peak ?? 1

    osc.type = tone.type ?? 'sine'
    osc.frequency.setValueAtTime(tone.frequency, now + tone.start)

    gain.gain.setValueAtTime(0.0001, now + tone.start)
    gain.gain.exponentialRampToValueAtTime(peak, now + tone.start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration)

    osc.connect(gain)
    gain.connect(bus)
    osc.start(now + tone.start)
    osc.stop(now + tone.start + tone.duration + 0.04)
  }
}

export async function resumeWorksiteAudio(): Promise<void> {
  await resumeAudio()
}

export function playWorksiteMine(resourceId: ResourceKey): void {
  if (!canPlay(lastMineAt, MINE_COOLDOWN_MS)) return
  lastMineAt = performance.now()
  void resumeWorksiteAudio()

  if (resourceId === 'food') playMineFood()
  else if (resourceId === 'wood') playMineWood()
  else if (resourceId === 'stone') playMineStone()
  else playMineStone()
}

export function playWorksiteUnlock(): void {
  if (!canPlay(lastUnlockAt, UNLOCK_COOLDOWN_MS)) return
  lastUnlockAt = performance.now()
  void resumeWorksiteAudio()

  playTones(
    [
      { frequency: 523.25, start: 0, duration: 0.22, peak: 0.7, type: 'sine' },
      { frequency: 659.25, start: 0.12, duration: 0.28, peak: 0.55, type: 'sine' },
      { frequency: 783.99, start: 0.22, duration: 0.35, peak: 0.4, type: 'triangle' },
    ],
    0.042,
  )
}

export function playWorksiteDrawerOpen(): void {
  if (!canPlay(lastDrawerAt, DRAWER_COOLDOWN_MS)) return
  lastDrawerAt = performance.now()
  void resumeWorksiteAudio()
  playTones([{ frequency: 420, start: 0, duration: 0.06, peak: 0.65, type: 'triangle' }], 0.028)
}

export function playWorksitePrestigeAssign(): void {
  if (!canPlay(lastPrestigeAt, PRESTIGE_COOLDOWN_MS)) return
  lastPrestigeAt = performance.now()
  void resumeWorksiteAudio()
  playTones(
    [
      { frequency: 880, start: 0, duration: 0.14, peak: 0.55, type: 'sine' },
      { frequency: 1174, start: 0.08, duration: 0.2, peak: 0.35, type: 'triangle' },
    ],
    0.03,
  )
}

export function playWorksitePrestigeSeen(): void {
  if (!canPlay(lastPrestigeAt, PRESTIGE_COOLDOWN_MS)) return
  lastPrestigeAt = performance.now()
  void resumeWorksiteAudio()
  playTones(
    [{ frequency: 660, start: 0, duration: 0.18, peak: 0.4, type: 'sine' }],
    0.022,
  )
}

function biomeAmbienceProfile(biomeId: WorksiteBiomeId): {
  padA: number
  padB: number
  noiseCutoff: number
  noiseLevel: number
} {
  switch (biomeId) {
    case 'foret-douce':
      return { padA: 98, padB: 147, noiseCutoff: 280, noiseLevel: 0.42 }
    case 'mine-tranquille':
      return { padA: 72, padB: 108, noiseCutoff: 220, noiseLevel: 0.55 }
    default:
      return { padA: 110, padB: 165, noiseCutoff: 340, noiseLevel: 0.38 }
  }
}

function createNoiseBuffer(ctx: AudioContext, brown = true): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let state = 0
  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1
    if (brown) {
      state = (state + 0.02 * white) / 1.02
      data[i] = state * 3.2
    } else {
      data[i] = white * 0.35
    }
  }
  return buffer
}

export function startWorksiteBiomeAmbience(biomeId: WorksiteBiomeId): void {
  stopWorksiteBiomeAmbience()

  const ctx = getSharedAudioContext()
  const bus = getMusicOutput()
  if (!ctx || !bus) return

  const profile = biomeAmbienceProfile(biomeId)
  const master = ctx.createGain()
  master.gain.value = 0.014
  master.connect(bus)

  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx)
  noise.loop = true

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = profile.noiseCutoff
  noiseFilter.Q.value = 0.35

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = profile.noiseLevel

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)
  noise.start()

  const padA = ctx.createOscillator()
  padA.type = 'sine'
  padA.frequency.value = profile.padA

  const padB = ctx.createOscillator()
  padB.type = 'sine'
  padB.frequency.value = profile.padB

  const padGain = ctx.createGain()
  padGain.gain.value = 0.08

  padA.connect(padGain)
  padB.connect(padGain)
  padGain.connect(master)
  padA.start()
  padB.start()

  biomeAmbience = {
    stop: () => {
      try {
        noise.stop()
        padA.stop()
        padB.stop()
      } catch {
        // already stopped
      }
      master.disconnect()
      biomeAmbience = null
    },
  }
}

export function stopWorksiteBiomeAmbience(): void {
  biomeAmbience?.stop()
}
