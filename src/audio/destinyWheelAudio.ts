/**
 * Roue du Destin — ticks segment (pack soft/clean + mix anti-strident)
 * + révélations par rareté (pack v2).
 */
import { getSharedAudioContext, getSfxOutput, resumeAudio } from './audioEngine'
import { publicAssetUrl } from '../data/publicAssetUrl'

const SEGMENT_TICK_STAGGER_BASE_S = 0.012
const SEGMENT_TICK_STAGGER_SLOW_EXTRA_S = 0.008
const SEGMENT_TICK_SPEED_CAP = 14
/** Montée en volume des premiers clics (début de rotation = le plus sensible). */
const SPIN_WARMUP_MS = 700
const TICK_ATTACK_S = 0.008

const TICK_PATHS = {
  soft: publicAssetUrl('assets/minigames/destiny-wheel/wheel-segment-tick-soft.wav'),
  clean: publicAssetUrl('assets/minigames/destiny-wheel/wheel-segment-tick.wav'),
} as const

const RARITY_REVEAL: Record<string, string> = {
  common: publicAssetUrl('assets/minigames/destiny-wheel/reveal-common.wav'),
  uncommon: publicAssetUrl('assets/minigames/destiny-wheel/reveal-uncommon.wav'),
  rare: publicAssetUrl('assets/minigames/destiny-wheel/reveal-rare.wav'),
  epic: publicAssetUrl('assets/minigames/destiny-wheel/reveal-epic.wav'),
  legendary: publicAssetUrl('assets/minigames/destiny-wheel/reveal-legendary.wav'),
  mythic: publicAssetUrl('assets/minigames/destiny-wheel/reveal-mythic.wav'),
  cursed: publicAssetUrl('assets/minigames/destiny-wheel/reveal-cursed.wav'),
  illegal: publicAssetUrl('assets/minigames/destiny-wheel/reveal-illegal.wav'),
  cosmic_bug: publicAssetUrl('assets/minigames/destiny-wheel/reveal-cosmic-bug.wav'),
}

const clipCache = new Map<string, HTMLAudioElement>()
const tickBufferCache = new Map<string, AudioBuffer>()
const tickBufferLoads = new Map<string, Promise<AudioBuffer | null>>()
const activeTickSources = new Set<AudioBufferSourceNode>()

let spinSessionStartMs = 0
let tickBuffersReady: Promise<void> = Promise.resolve()

function getClip(url: string): HTMLAudioElement {
  let clip = clipCache.get(url)
  if (!clip) {
    clip = new Audio(url)
    clip.preload = 'auto'
    clipCache.set(url, clip)
  }
  return clip
}

function playClip(url: string, volume = 0.55): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null
  const clip = getClip(url)
  const node = clip.cloneNode(true) as HTMLAudioElement
  node.volume = volume
  void node.play().catch(() => undefined)
  return node
}

async function loadTickBuffer(url: string): Promise<AudioBuffer | null> {
  const cached = tickBufferCache.get(url)
  if (cached) return cached

  const pending = tickBufferLoads.get(url)
  if (pending) return pending

  const load = (async () => {
    await resumeAudio()
    const ctx = getSharedAudioContext()
    if (!ctx) return null
    try {
      const response = await fetch(url)
      if (!response.ok) return null
      const data = await response.arrayBuffer()
      const buffer = await ctx.decodeAudioData(data.slice(0))
      tickBufferCache.set(url, buffer)
      return buffer
    } catch {
      return null
    } finally {
      tickBufferLoads.delete(url)
    }
  })()

  tickBufferLoads.set(url, load)
  return load
}

function loadSegmentTickBuffers(): Promise<void> {
  tickBuffersReady = Promise.all([loadTickBuffer(TICK_PATHS.soft), loadTickBuffer(TICK_PATHS.clean)]).then(
    () => undefined,
  )
  return tickBuffersReady
}

function pickTickBuffer(speedNorm: number): AudioBuffer | null {
  const soft = tickBufferCache.get(TICK_PATHS.soft)
  const clean = tickBufferCache.get(TICK_PATHS.clean)
  if (speedNorm < 0.35) return soft ?? clean ?? null
  return clean ?? soft ?? null
}

/** 0→1 : adoucit les premiers clics sans les rendre inaudibles. */
function spinWarmupMultiplier(): number {
  if (spinSessionStartMs <= 0) return 1
  const elapsed = performance.now() - spinSessionStartMs
  if (elapsed >= SPIN_WARMUP_MS) return 1
  const t = elapsed / SPIN_WARMUP_MS
  return 0.52 + t * t * 0.48
}

/**
 * Mix par vitesse — début lent = plus filtré, pas muet.
 * Le volume reste audible ; l’adoucissement passe surtout par l’EQ.
 */
function segmentTickMix(speedDegPerFrame: number) {
  const speedNorm = Math.min(1, Math.max(0, Math.abs(speedDegPerFrame) / SEGMENT_TICK_SPEED_CAP))
  const slowBias = 1 - speedNorm
  return {
    speedNorm,
    playbackRate: 0.84 - speedNorm * 0.12,
    volume: (0.58 + speedNorm * 0.28) * spinWarmupMultiplier(),
    lowpassHz: 3600 - speedNorm * 1200,
    highShelfGain: -1 - slowBias * 2.5,
    staggerS: SEGMENT_TICK_STAGGER_BASE_S + slowBias * SEGMENT_TICK_STAGGER_SLOW_EXTRA_S,
  }
}

export function stopDestinyWheelSegmentTicks(): void {
  for (const source of activeTickSources) {
    try {
      source.stop()
    } catch {
      /* déjà arrêté */
    }
  }
  activeTickSources.clear()
}

export async function resumeDestinyWheelAudio(): Promise<void> {
  await resumeAudio()
  await loadSegmentTickBuffers()
}

export function preloadDestinyWheelAudio(): void {
  if (typeof window === 'undefined') return
  void loadSegmentTickBuffers()
  Object.values(RARITY_REVEAL).forEach((url) => getClip(url).load())
}

export function startDestinyWheelSpinSound(): void {
  stopDestinyWheelSegmentTicks()
  spinSessionStartMs = performance.now()
  void resumeDestinyWheelAudio()
}

export function stopDestinyWheelSpinSound(_playStop = false): void {
  stopDestinyWheelSegmentTicks()
  spinSessionStartMs = 0
}

async function playDestinyWheelSegmentTickImpl(speedDegPerFrame: number, tickIndex: number): Promise<void> {
  await resumeAudio()
  await tickBuffersReady

  const ctx = getSharedAudioContext()
  const destination = getSfxOutput()
  if (!ctx || !destination) return

  const mix = segmentTickMix(speedDegPerFrame)
  let buffer = pickTickBuffer(mix.speedNorm)
  if (!buffer) {
    await loadSegmentTickBuffers()
    buffer = pickTickBuffer(mix.speedNorm)
  }
  if (!buffer) return

  const source = ctx.createBufferSource()
  const lowpass = ctx.createBiquadFilter()
  const highShelf = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  source.buffer = buffer
  source.playbackRate.value = mix.playbackRate
  lowpass.type = 'lowpass'
  lowpass.frequency.value = mix.lowpassHz
  lowpass.Q.value = 0.5
  highShelf.type = 'highshelf'
  highShelf.frequency.value = 3200
  highShelf.gain.value = mix.highShelfGain

  const targetGain = Math.min(0.92, Math.max(0.28, mix.volume))
  const startAt = ctx.currentTime + tickIndex * mix.staggerS
  const playDuration = buffer.duration / mix.playbackRate + 0.02

  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(targetGain, startAt + TICK_ATTACK_S)

  source.connect(lowpass)
  lowpass.connect(highShelf)
  highShelf.connect(gain)
  gain.connect(destination)

  source.start(startAt)
  source.stop(startAt + playDuration)

  activeTickSources.add(source)
  source.onended = () => activeTickSources.delete(source)
}

/** Un clic court — appeler une fois par case franchie. */
export function playDestinyWheelSegmentTick(speedDegPerFrame = 1, tickIndex = 0): void {
  if (typeof window === 'undefined') return
  void playDestinyWheelSegmentTickImpl(speedDegPerFrame, tickIndex)
}

function revealVolume(rarity: string): number {
  if (rarity === 'mythic' || rarity === 'cosmic_bug' || rarity === 'legendary') return 0.62
  if (rarity === 'epic' || rarity === 'rare') return 0.58
  if (rarity === 'cursed' || rarity === 'illegal') return 0.56
  return 0.52
}

/** Son d'atterrissage selon la rareté tirée. */
export function playDestinyWheelReactionSound(_reaction?: string, rarity?: string): void {
  void resumeDestinyWheelAudio()
  const key = rarity ?? 'common'
  const url = RARITY_REVEAL[key] ?? RARITY_REVEAL.common
  playClip(url, revealVolume(key))
}

export function disposeDestinyWheelAudio(): void {
  stopDestinyWheelSegmentTicks()
  spinSessionStartMs = 0
  tickBufferCache.clear()
  tickBufferLoads.clear()
  clipCache.clear()
  tickBuffersReady = Promise.resolve()
}
