/**
 * Chasse — trois sons procéduraux (Web Audio) :
 * 1. Cri du Myrion sauvage à l’apparition (cri saturé type rapace / grognement, selon rareté)
 * 2. Succès de capture (~0,85 s, sync anim « celebrate » du compagnon)
 * 3. Échec de capture (~0,9 s, sync anim « commiserate » du compagnon)
 */
import type { PalmonRarity } from '../data/wildFamiliars'
import { getSharedAudioContext, getSfxOutput, resumeAudio } from './audioEngine'

let bitCrushCurve: Float32Array<ArrayBuffer> | null = null
let noiseBufferWhite: AudioBuffer | null = null
let noiseBufferBrown: AudioBuffer | null = null
const saturationCurves = new Map<number, Float32Array<ArrayBuffer>>()

/** N/R ≈ cri d’aigle saturé ; UR/LR ≈ grognement de lion ; entre-deux = mélange. */
const RARITY_CRY_PROFILE: Record<
  PalmonRarity,
  {
    duration: number
    peakGain: number
    drive: number
    growlMix: number
    screechHz: number
    growlHz: number
  }
> = {
  N: { duration: 0.34, peakGain: 0.15, drive: 3.4, growlMix: 0, screechHz: 1680, growlHz: 92 },
  R: { duration: 0.4, peakGain: 0.16, drive: 3.8, growlMix: 0.18, screechHz: 1520, growlHz: 82 },
  SR: { duration: 0.48, peakGain: 0.17, drive: 4.2, growlMix: 0.42, screechHz: 1320, growlHz: 72 },
  SSR: { duration: 0.56, peakGain: 0.19, drive: 4.6, growlMix: 0.62, screechHz: 1180, growlHz: 64 },
  UR: { duration: 0.66, peakGain: 0.21, drive: 5.2, growlMix: 0.82, screechHz: 1040, growlHz: 56 },
  LR: { duration: 0.78, peakGain: 0.24, drive: 5.8, growlMix: 1, screechHz: 920, growlHz: 48 },
}

function getContext(): AudioContext | null {
  return getSharedAudioContext()
}

export async function resumeHuntAudio(): Promise<void> {
  await resumeAudio()
}

function hashUnit(value: string): number {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) | 0
  }
  return (Math.abs(hash) % 997) / 997
}

type ToneSpec = {
  frequency: number
  start: number
  duration: number
  type?: OscillatorType
  gain?: number
  attack?: number
  release?: number
}

function playTones(tones: ToneSpec[], masterGain = 0.22, use8Bit = false): void {
  const ctx = getContext()
  const destination = getSfxOutput()
  if (!ctx || !destination) return

  const now = ctx.currentTime
  const bus = use8Bit ? connect8BitBus(ctx, masterGain, destination) : ctx.createGain()
  if (!use8Bit) {
    bus.gain.value = masterGain
    bus.connect(destination)
  }

  for (const tone of tones) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const attack = tone.attack ?? 0.02
    const release = tone.release ?? 0.08
    const peak = tone.gain ?? 1

    osc.type = tone.type ?? 'sine'
    osc.frequency.setValueAtTime(tone.frequency, now + tone.start)

    gain.gain.setValueAtTime(0.0001, now + tone.start)
    gain.gain.exponentialRampToValueAtTime(peak, now + tone.start + attack)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration + release)

    osc.connect(gain)
    gain.connect(bus)
    osc.start(now + tone.start)
    osc.stop(now + tone.start + tone.duration + release + 0.05)
  }
}

function getBitCrushCurve(): Float32Array<ArrayBuffer> {
  if (bitCrushCurve) return bitCrushCurve
  const samples = 65536
  const curve = new Float32Array(samples)
  const steps = 8
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1
    curve[i] = Math.round(x * steps) / steps
  }
  bitCrushCurve = curve
  return curve
}

function connect8BitBus(ctx: AudioContext, masterGain: number, destination: AudioNode): GainNode {
  const shaper = ctx.createWaveShaper()
  shaper.curve = getBitCrushCurve()
  shaper.oversample = 'none'

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 4200
  filter.Q.value = 0.6

  const bus = ctx.createGain()
  bus.gain.value = masterGain
  bus.connect(shaper)
  shaper.connect(filter)
  filter.connect(destination)
  return bus
}

function getSaturationCurve(drive: number): Float32Array<ArrayBuffer> {
  const key = Math.round(drive * 10)
  const cached = saturationCurves.get(key)
  if (cached) return cached

  const samples = 4096
  const curve = new Float32Array(samples)
  const norm = Math.tanh(drive)
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1
    curve[i] = Math.tanh(x * drive) / norm
  }
  saturationCurves.set(key, curve)
  return curve
}

function getNoiseBuffer(ctx: AudioContext, color: 'white' | 'brown'): AudioBuffer {
  if (color === 'white' && noiseBufferWhite) return noiseBufferWhite
  if (color === 'brown' && noiseBufferBrown) return noiseBufferBrown

  const seconds = 2
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0

  for (let i = 0; i < data.length; i += 1) {
    const white = Math.random() * 2 - 1
    if (color === 'brown') {
      brown = (brown + 0.018 * white) / 1.018
      data[i] = brown * 4.2
    } else {
      data[i] = white
    }
  }

  if (color === 'white') noiseBufferWhite = buffer
  else noiseBufferBrown = buffer
  return buffer
}

type SaturatedBus = {
  input: GainNode
}

function connectSaturatedCryChain(
  ctx: AudioContext,
  drive: number,
  masterGain: number,
  destination: AudioNode,
): SaturatedBus {
  const pre = ctx.createGain()
  pre.gain.value = 1.35

  const shaper = ctx.createWaveShaper()
  shaper.curve = getSaturationCurve(drive)
  shaper.oversample = '4x'

  const tone = ctx.createBiquadFilter()
  tone.type = 'peaking'
  tone.frequency.value = 920
  tone.Q.value = 0.9
  tone.gain.value = 4.5

  const lowCut = ctx.createBiquadFilter()
  lowCut.type = 'highpass'
  lowCut.frequency.value = 55
  lowCut.Q.value = 0.5

  const limiter = ctx.createDynamicsCompressor()
  limiter.threshold.value = -10
  limiter.knee.value = 8
  limiter.ratio.value = 6
  limiter.attack.value = 0.004
  limiter.release.value = 0.12

  const out = ctx.createGain()
  out.gain.value = masterGain

  pre.connect(shaper)
  shaper.connect(tone)
  tone.connect(lowCut)
  lowCut.connect(limiter)
  limiter.connect(out)
  out.connect(destination)

  return { input: pre }
}

function scheduleAmplitudeEnvelope(
  gain: GainNode,
  now: number,
  duration: number,
  peak: number,
  attack = 0.028,
  holdRatio = 0.38,
): void {
  const hold = duration * holdRatio
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + attack)
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * 0.42), now + attack + hold)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.1)
}

function playScreechLayer(
  ctx: AudioContext,
  bus: GainNode,
  startAt: number,
  duration: number,
  baseHz: number,
  weight: number,
  unit: number,
): void {
  if (weight <= 0.001) return

  const now = ctx.currentTime + startAt
  const f0 = baseHz * (0.96 + unit * 0.1)
  const fPeak = f0 * (1.28 + unit * 0.08)
  const fEnd = Math.max(420, f0 * 0.62)

  const env = ctx.createGain()
  scheduleAmplitudeEnvelope(env, now, duration, weight)

  const voice = (type: OscillatorType, gainMul: number, detune = 0) => {
    const osc = ctx.createOscillator()
    osc.type = type
    osc.detune.value = detune
    osc.frequency.setValueAtTime(f0, now)
    osc.frequency.linearRampToValueAtTime(fPeak, now + duration * 0.14)
    osc.frequency.exponentialRampToValueAtTime(fEnd, now + duration * 0.9)

    const vib = ctx.createOscillator()
    vib.frequency.value = 7 + unit * 8
    const vibGain = ctx.createGain()
    vibGain.gain.value = 18 + unit * 22
    vib.connect(vibGain)
    vibGain.connect(osc.frequency)

    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 5.5 + unit * 3
    bp.frequency.setValueAtTime(f0 * 0.95, now)
    bp.frequency.linearRampToValueAtTime(fPeak * 1.05, now + duration * 0.18)
    bp.frequency.exponentialRampToValueAtTime(Math.max(350, fEnd), now + duration)

    const voiceGain = ctx.createGain()
    voiceGain.gain.value = gainMul

    osc.connect(bp)
    bp.connect(voiceGain)
    voiceGain.connect(env)

    osc.start(now)
    osc.stop(now + duration + 0.15)
    vib.start(now)
    vib.stop(now + duration + 0.15)
  }

  voice('sawtooth', 0.72)
  voice('square', 0.22, 11)

  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx, 'white')
  noise.loop = true

  const noiseBp = ctx.createBiquadFilter()
  noiseBp.type = 'bandpass'
  noiseBp.Q.value = 7
  noiseBp.frequency.setValueAtTime(fPeak * 0.92, now)
  noiseBp.frequency.exponentialRampToValueAtTime(Math.max(500, fEnd * 1.1), now + duration * 0.85)

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.55 + unit * 0.15

  noise.connect(noiseBp)
  noiseBp.connect(noiseGain)
  noiseGain.connect(env)
  env.connect(bus)

  noise.start(now)
  noise.stop(now + duration + 0.12)
}

function playGrowlLayer(
  ctx: AudioContext,
  bus: GainNode,
  startAt: number,
  duration: number,
  baseHz: number,
  weight: number,
  unit: number,
): void {
  if (weight <= 0.001) return

  const now = ctx.currentTime + startAt
  const f0 = baseHz * (0.9 + unit * 0.14)
  const fMid = f0 * (1.08 + unit * 0.06)
  const fEnd = Math.max(32, f0 * 0.78)

  const env = ctx.createGain()
  scheduleAmplitudeEnvelope(env, now, duration, weight, 0.04, 0.52)

  const body = ctx.createOscillator()
  body.type = 'sawtooth'
  body.frequency.setValueAtTime(f0, now)
  body.frequency.linearRampToValueAtTime(fMid, now + duration * 0.22)
  body.frequency.exponentialRampToValueAtTime(fEnd, now + duration * 0.95)

  const raspLfo = ctx.createOscillator()
  raspLfo.frequency.value = 24 + unit * 14
  const raspDepth = ctx.createGain()
  raspDepth.gain.value = 0.28 + unit * 0.12
  raspLfo.connect(raspDepth)

  const raspGain = ctx.createGain()
  raspGain.gain.value = 1
  raspDepth.connect(raspGain.gain)

  const lowPass = ctx.createBiquadFilter()
  lowPass.type = 'lowpass'
  lowPass.Q.value = 1.2
  lowPass.frequency.setValueAtTime(520 + unit * 180, now)
  lowPass.frequency.exponentialRampToValueAtTime(240, now + duration)

  const bodyGain = ctx.createGain()
  bodyGain.gain.value = 0.78

  body.connect(lowPass)
  lowPass.connect(bodyGain)
  bodyGain.connect(env)

  const sub = ctx.createOscillator()
  sub.type = 'sine'
  sub.frequency.setValueAtTime(Math.max(32, f0 * 0.52), now)
  sub.frequency.exponentialRampToValueAtTime(Math.max(28, fEnd * 0.5), now + duration)

  const subGain = ctx.createGain()
  subGain.gain.value = 0.55 + weight * 0.25

  sub.connect(subGain)
  subGain.connect(env)

  const noise = ctx.createBufferSource()
  noise.buffer = getNoiseBuffer(ctx, 'brown')
  noise.loop = true

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.Q.value = 1.4
  noiseFilter.frequency.value = 280 + unit * 120

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.62

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(env)
  env.connect(bus)

  body.start(now)
  body.stop(now + duration + 0.18)
  raspLfo.start(now)
  raspLfo.stop(now + duration + 0.18)
  sub.start(now)
  sub.stop(now + duration + 0.18)
  noise.start(now)
  noise.stop(now + duration + 0.18)
}

/** Cri saturé type rapace (N/R) ou grognement bestial (UR/LR), nuancé par espèce. */
export function playMyrionEncounterCry(speciesId: string, rarity: PalmonRarity): void {
  const ctx = getContext()
  const destination = getSfxOutput()
  if (!ctx || !destination) return

  const profile = RARITY_CRY_PROFILE[rarity]
  const unit = hashUnit(speciesId)
  const chain = connectSaturatedCryChain(ctx, profile.drive, profile.peakGain, destination)

  const screechHz = profile.screechHz * (0.94 + unit * 0.12)
  const growlHz = profile.growlHz * (0.92 + unit * 0.16)
  const screechWeight = 1 - profile.growlMix
  const growlWeight = profile.growlMix

  playScreechLayer(ctx, chain.input, 0, profile.duration, screechHz, screechWeight, unit)
  playGrowlLayer(ctx, chain.input, profile.growlMix > 0.35 ? 0.03 : 0, profile.duration, growlHz, growlWeight, unit)

  if (profile.growlMix >= 0.55) {
    playGrowlLayer(
      ctx,
      chain.input,
      profile.duration * 0.38,
      profile.duration * 0.55,
      growlHz * 0.88,
      growlWeight * 0.42,
      (unit + 0.37) % 1,
    )
  }
}

/** Succès de capture — arpège montant 8-bit (~0,85 s). */
export function playCaptureSuccess(): void {
  const root = 523.25 // Do5

  playTones(
    [
      { frequency: root, start: 0, duration: 0.1, type: 'square', gain: 1, attack: 0.008 },
      { frequency: root * 1.25, start: 0.09, duration: 0.1, type: 'square', gain: 0.95, attack: 0.008 },
      { frequency: root * 1.5, start: 0.18, duration: 0.12, type: 'square', gain: 1, attack: 0.008 },
      { frequency: root * 2, start: 0.3, duration: 0.32, type: 'square', gain: 0.85, attack: 0.01, release: 0.2 },
      { frequency: root * 2.5, start: 0.52, duration: 0.18, type: 'triangle', gain: 0.45, attack: 0.01, release: 0.14 },
    ],
    0.2,
    true,
  )
}

/** Échec de capture — glissando descendant 8-bit (~0,9 s). */
export function playCaptureFailure(): void {
  const root = 392 // Sol4

  playTones(
    [
      { frequency: root, start: 0, duration: 0.14, type: 'square', gain: 0.9, attack: 0.006 },
      { frequency: root * 0.84, start: 0.12, duration: 0.16, type: 'square', gain: 0.85, attack: 0.006 },
      { frequency: root * 0.7, start: 0.26, duration: 0.22, type: 'square', gain: 0.75, attack: 0.006 },
      { frequency: root * 0.55, start: 0.46, duration: 0.36, type: 'triangle', gain: 0.6, attack: 0.008, release: 0.24 },
    ],
    0.18,
    true,
  )
}
