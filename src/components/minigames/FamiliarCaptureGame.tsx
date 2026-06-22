import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { updateCaptureStats, type PetState } from '../../data/minigameSave'
import {
  captureRingScale,
  isCaptureSuccess,
  PALMON_RARITIES,
  RARITY_CAPTURE,
  rollEncounter,
  wildToPetState,
  type WildEncounter,
  BIOMES,
} from '../../data/wildFamiliars'
import { BiomeEncounterScene } from './BiomeEncounterScene'
import { BiomeBackground } from './BiomeBackground'
import { GuideCompanionCutout } from './GuideCompanionCutout'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import type { GuidePose } from '../../data/minigameAssets'

type Phase = 'explore' | 'encounter' | 'capture' | 'result'

export function FamiliarCaptureGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
}: MinigameProps) {
  const [pets, setPets] = useState<PetState[]>(() => minigameSave?.pets ?? [])
  const [captureStats, setCaptureStats] = useState(minigameSave?.captureStats)
  const [sessionCaught, setSessionCaught] = useState(0)
  const [encounter, setEncounter] = useState<WildEncounter | null>(null)
  const [phase, setPhase] = useState<Phase>('explore')
  const [captureProgress, setCaptureProgress] = useState(0)
  const [captureStartedAt, setCaptureStartedAt] = useState(0)
  const [flash, setFlash] = useState('Explore la lisiere — rencontres illimitees et aleatoires.')
  const [lastResult, setLastResult] = useState<'success' | 'fail' | 'flee' | null>(null)
  const timeoutRef = useRef<number | null>(null)

  const persist = useCallback(
    (nextPets: PetState[], nextStats = captureStats) => {
      if (minigameSave && onSaveMinigame) {
        onSaveMinigame({ ...minigameSave, pets: nextPets, captureStats: nextStats })
      }
    },
    [captureStats, minigameSave, onSaveMinigame],
  )

  const ownedSpecies = useMemo(
    () => new Set(pets.map((pet) => pet.speciesId)),
    [pets],
  )

  const startEncounter = useCallback(() => {
    const next = rollEncounter()
    setBiomeBgFailed(false)
    setEncounter(next)
    setPhase('encounter')
    setLastResult(null)
    setFlash(
      `${next.biome.emoji} ${next.biome.name} — un ${next.palmon.name} [${next.palmon.rarity}] apparait !`,
    )
  }, [])

  const beginCapture = () => {
    if (!encounter || phase !== 'encounter') {
      return
    }
    setPhase('capture')
    setCaptureStartedAt(performance.now())
    setCaptureProgress(0)
    setFlash(`Synchronise ta capture quand l anneau violet rejoint l anneau dore.`)
  }

  useEffect(() => {
    if (phase !== 'capture' || !encounter) {
      return
    }

    const { durationMs } = RARITY_CAPTURE[encounter.palmon.rarity]
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min(1, (now - captureStartedAt) / durationMs)
      setCaptureProgress(progress)

      if (progress >= 1) {
        setFlash(`${encounter.palmon.name} s enfuit dans la brume…`)
        setLastResult('flee')
        setPhase('result')
        return
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [captureStartedAt, encounter, phase])

  const attemptCapture = () => {
    if (!encounter || phase !== 'capture') {
      return
    }

    const { palmon } = encounter
    const success = isCaptureSuccess(captureProgress, palmon.rarity)
    setPhase('result')

    if (success) {
      const instanceId = `${palmon.id}-${Date.now()}`
      const isNew = !ownedSpecies.has(palmon.id)
      const nextPet = wildToPetState(palmon, instanceId)
      const nextPets = isNew ? [...pets, nextPet] : pets
      const nextStats = updateCaptureStats(captureStats, palmon.rarity)

      setPets(nextPets)
      setCaptureStats(nextStats)
      persist(nextPets, nextStats)
      setSessionCaught((value) => value + 1)
      setLastResult('success')

      const reward = scaleReward(activity.baseReward, PALMON_RARITIES.indexOf(palmon.rarity) + 1, 6)
      onComplete(PALMON_RARITIES.indexOf(palmon.rarity) + 1, 6, reward, { keepOpen: true })

      setFlash(
        isNew
          ? `${palmon.name} [${palmon.rarity}] rejoint le refuge !`
          : `${palmon.name} [${palmon.rarity}] capture — bonus ressources (deja au refuge).`,
      )
    } else {
      setLastResult('fail')
      setFlash(`Rate — ${palmon.name} s esquive et disparait.`)
    }
  }

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    [],
  )

  const ringScale = encounter
    ? captureRingScale(captureProgress, encounter.palmon.rarity)
    : 1

  const [biomeBgFailed, setBiomeBgFailed] = useState(false)
  const [introBgFailed, setIntroBgFailed] = useState(false)
  const biome = encounter?.biome

  const guidePose: GuidePose =
    phase === 'result' && lastResult === 'success' ? 'cheer' : 'point'

  const guideCompanion = {
    id: activity.companionId,
    name: companionName,
    pose: guidePose,
    side: 'left' as const,
  }

  const introBiome = BIOMES[0]

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionMood="Je les ai reperees — a toi de jouer !"
      companionName={companionName}
      endless
      maxScore={999}
      onClose={onClose}
      onRestart={startEncounter}
      resourceLabel={resourceLabel}
      score={sessionCaught}
      scoreLabel="Captures session"
      status="playing"
    >
      <div className="mg-capture mg-capture-immersive">
        <div className="mg-capture-toolbar">
          <p className="mg-capture-flash">{flash}</p>
          <div className="mg-capture-stats">
            <span>Session {sessionCaught}</span>
            <span>Total {captureStats?.totalCaught ?? 0}</span>
            <span>Best {captureStats?.bestRarity ?? '—'}</span>
          </div>
        </div>

        {phase === 'explore' && (
          <div className="mg-capture-explore">
            <div className="mg-capture-scene-slot">
              <div
                className="mg-capture-field mg-capture-field-biome mg-biome-scene mg-capture-intro"
                style={introBgFailed ? { background: introBiome.fallbackGradient } : undefined}
              >
                {!introBgFailed && (
                  <BiomeBackground
                    biomeId={introBiome.id}
                    className="mg-capture-biome-bg"
                    onFailed={() => setIntroBgFailed(true)}
                  />
                )}
                <GuideCompanionCutout
                  companionId={guideCompanion.id}
                  name={guideCompanion.name}
                  pose={guideCompanion.pose}
                  side={guideCompanion.side}
                />
              </div>
            </div>
            <div className="mg-capture-actions">
              <button className="primary mg-big-btn" type="button" onClick={startEncounter}>
                🧭 Explorer un biome
              </button>
            </div>
          </div>
        )}

        {(phase === 'encounter' || phase === 'capture' || phase === 'result') && biome && encounter && (
          <div className="mg-capture-explore">
            <div className="mg-capture-scene-slot">
              <BiomeEncounterScene
                biome={biome}
                biomeBgFailed={biomeBgFailed}
                guideCompanion={guideCompanion}
                captureRing={
                  phase === 'capture' ? (
                    <button
                      aria-label="Lancer la capture"
                      className="mg-capture-ring-btn"
                      type="button"
                      onClick={attemptCapture}
                    >
                      <span className="mg-capture-ring-outer" />
                      <span
                        className="mg-capture-ring-inner"
                        style={{ transform: `translate(-50%, -50%) scale(${ringScale})` }}
                      />
                      <span className="mg-capture-ring-label">Capturer !</span>
                    </button>
                  ) : undefined
                }
                dimmed={phase === 'capture'}
                palmon={encounter.palmon}
                onBiomeBgError={() => setBiomeBgFailed(true)}
              />
            </div>

            <div className="mg-capture-actions">
              {phase === 'encounter' && (
                <button className="primary mg-big-btn" type="button" onClick={beginCapture}>
                  🎯 Tenter la capture
                </button>
              )}
              {phase === 'capture' && (
                <p className="mg-td-hint mg-capture-ring-hint">
                  Clique quand l anneau violet rejoint le cercle dore.
                </p>
              )}
              {phase === 'result' && (
                <button className="primary mg-big-btn" type="button" onClick={startEncounter}>
                  🧭 Prochaine rencontre
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </MinigameFrame>
  )
}
