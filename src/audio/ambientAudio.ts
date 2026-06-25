import { getMusicOutput, getSharedAudioContext } from './audioEngine'

type AmbientNodes = {
  stop: () => void
  setLevel: (musicVolume: number) => void
}

let ambient: AmbientNodes | null = null

function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let brown = 0
  for (let i = 0; i < data.length; i += 1) {
    brown = (brown + 0.02 * (Math.random() * 2 - 1)) / 1.02
    data[i] = brown * 3.8
  }
  return buffer
}

export function startAmbientBed(musicVolume: number): void {
  if (musicVolume <= 0.01 || ambient) return

  const ctx = getSharedAudioContext()
  const bus = getMusicOutput()
  if (!ctx || !bus) return

  const master = ctx.createGain()
  master.gain.value = 0.022 * musicVolume
  master.connect(bus)

  const noise = ctx.createBufferSource()
  noise.buffer = createNoiseBuffer(ctx)
  noise.loop = true

  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 320
  noiseFilter.Q.value = 0.4

  const noiseGain = ctx.createGain()
  noiseGain.gain.value = 0.55

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)
  noise.start()

  const padA = ctx.createOscillator()
  padA.type = 'sine'
  padA.frequency.value = 110

  const padB = ctx.createOscillator()
  padB.type = 'sine'
  padB.frequency.value = 164.81

  const padGain = ctx.createGain()
  padGain.gain.value = 0.12

  const breathe = ctx.createOscillator()
  breathe.frequency.value = 0.06
  const breatheDepth = ctx.createGain()
  breatheDepth.gain.value = 0.04
  breathe.connect(breatheDepth)
  breatheDepth.connect(padGain.gain)

  padA.connect(padGain)
  padB.connect(padGain)
  padGain.connect(master)
  padA.start()
  padB.start()
  breathe.start()

  ambient = {
    stop: () => {
      try {
        noise.stop()
        padA.stop()
        padB.stop()
        breathe.stop()
      } catch {
        // already stopped
      }
      master.disconnect()
      ambient = null
    },
    setLevel: (volume: number) => {
      master.gain.setTargetAtTime(0.022 * volume, ctx.currentTime, 0.12)
    },
  }
}

export function stopAmbientBed(): void {
  ambient?.stop()
}

export function syncAmbientBed(musicVolume: number): void {
  if (musicVolume <= 0.01) {
    stopAmbientBed()
    return
  }
  if (!ambient) return
  ambient.setLevel(musicVolume)
}

export function ensureAmbientBed(musicVolume: number): void {
  if (musicVolume <= 0.01) {
    stopAmbientBed()
    return
  }
  if (!ambient) {
    startAmbientBed(musicVolume)
    return
  }
  syncAmbientBed(musicVolume)
}
