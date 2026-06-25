import { getSharedAudioContext, getSfxOutput, resumeAudio } from './audioEngine'

let lastUiSoundAt = 0

function canPlayUiSound(minGapMs = 45): boolean {
  const now = performance.now()
  if (now - lastUiSoundAt < minGapMs) return false
  lastUiSoundAt = now
  return true
}

type BlipOptions = {
  frequency: number
  duration?: number
  peak?: number
  type?: OscillatorType
  slideRatio?: number
}

function playBlip(options: BlipOptions): void {
  if (!canPlayUiSound()) return

  const ctx = getSharedAudioContext()
  const bus = getSfxOutput()
  if (!ctx || !bus) return

  const {
    frequency,
    duration = 0.05,
    peak = 0.042,
    type = 'triangle',
    slideRatio = 1.12,
  } = options

  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(frequency, now)
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * slideRatio), now + duration * 0.85)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  osc.connect(gain)
  gain.connect(bus)
  osc.start(now)
  osc.stop(now + duration + 0.02)
}

/** Clic léger — boutons, actions courantes. */
export function playUiTap(): void {
  playBlip({ frequency: 520, peak: 0.038, duration: 0.045 })
}

/** Navigation — onglets, menus. */
export function playUiTab(): void {
  playBlip({ frequency: 640, peak: 0.044, duration: 0.052, slideRatio: 1.18 })
}

/** Petite récompense / toast. */
export function playUiReward(): void {
  if (!canPlayUiSound(80)) return

  const ctx = getSharedAudioContext()
  const bus = getSfxOutput()
  if (!ctx || !bus) return

  const now = ctx.currentTime
  const tones = [
    { frequency: 587.33, start: 0, duration: 0.07, peak: 0.05 },
    { frequency: 739.99, start: 0.06, duration: 0.1, peak: 0.042 },
  ]

  for (const tone of tones) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(tone.frequency, now + tone.start)

    gain.gain.setValueAtTime(0.0001, now + tone.start)
    gain.gain.exponentialRampToValueAtTime(tone.peak, now + tone.start + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.duration)

    osc.connect(gain)
    gain.connect(bus)
    osc.start(now + tone.start)
    osc.stop(now + tone.start + tone.duration + 0.02)
  }
}

export function bindUiClickSounds(): () => void {
  const onClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('.minigame-overlay, .settings-modal, [data-ui-silent]')) return

    const interactive = target.closest('button, .app-sidebar-tabs button, .app-sidebar-settings')
    if (!interactive || interactive instanceof HTMLButtonElement && interactive.disabled) return
    if (interactive.closest('input[type="range"]')) return

    void resumeAudio()

    if (interactive.closest('.app-sidebar-tabs, .app-sidebar-settings, .mg-hunt-rail-tab')) {
      playUiTab()
      return
    }

    playUiTap()
  }

  document.addEventListener('click', onClick, true)
  return () => document.removeEventListener('click', onClick, true)
}
