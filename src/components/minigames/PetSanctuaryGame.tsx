import { useEffect, useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import { refreshPetsOnVisit, type PetState } from '../../data/minigameSave'
import { RARITY_COLORS } from '../../data/wildFamiliars'
import { useWanderingSprites } from '../../hooks/useWanderingSprites'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { PalmonSprite } from './PalmonSprite'

export function PetSanctuaryGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
}: MinigameProps) {
  const [pets, setPets] = useState<PetState[]>(() =>
    refreshPetsOnVisit(minigameSave?.pets ?? []),
  )
  const [activePetId, setActivePetId] = useState(pets[0]?.id ?? '')
  const [carePoints, setCarePoints] = useState(0)
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')

  const wanderItems = useMemo(
    () => pets.map((pet) => ({ id: pet.id, emoji: pet.emoji, name: pet.name })),
    [pets],
  )
  const wandering = useWanderingSprites(wanderItems)

  useEffect(() => {
    if (minigameSave && onSaveMinigame) {
      onSaveMinigame({ ...minigameSave, pets })
    }
  }, [pets, minigameSave, onSaveMinigame])

  const activePet = pets.find((pet) => pet.id === activePetId) ?? pets[0]

  const updatePet = (petId: string, patch: Partial<PetState>) => {
    setPets((current) =>
      current.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              ...patch,
              hunger: Math.min(100, patch.hunger ?? pet.hunger),
              joy: Math.min(100, patch.joy ?? pet.joy),
              lastVisit: Date.now(),
            }
          : pet,
      ),
    )
    setCarePoints((value) => value + 1)
  }

  const feed = () => activePet && updatePet(activePet.id, { hunger: activePet.hunger + 22 })
  const play = () => activePet && updatePet(activePet.id, { joy: activePet.joy + 24 })
  const cuddle = () =>
    activePet && updatePet(activePet.id, { hunger: activePet.hunger + 10, joy: activePet.joy + 14 })

  const finishVisit = () => {
    const mood =
      pets.reduce((sum, pet) => sum + pet.hunger + pet.joy, 0) / Math.max(1, pets.length * 2)
    const score = Math.round(mood)
    setStatus('won')
    onComplete(score, 100, scaleReward(activity.baseReward, score, 100))
  }

  const restart = () => {
    setCarePoints(0)
    setStatus('playing')
  }

  const avgMood = Math.round(
    pets.reduce((sum, pet) => sum + (pet.hunger + pet.joy) / 2, 0) / Math.max(1, pets.length),
  )

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionMood="Je garde un oeil sur eux !"
      companionName={companionName}
      maxScore={100}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={avgMood}
      status={status}
    >
      <div className="mg-pets">
        <p className="mg-flash">
          Humeur moyenne {avgMood}/100 — soins {carePoints} — jamais de punition, promis.
        </p>

        <div aria-label="Ferme des familiers" className="mg-pet-meadow" role="img">
          <div className="mg-meadow-sky" />
          <div className="mg-meadow-hills" />
          <div className="mg-meadow-fence" />
          {wandering.map((sprite) => {
            const pet = pets.find((entry) => entry.id === sprite.id)
            if (!pet) {
              return null
            }
            return (
              <button
                aria-label={`Selectionner ${sprite.name ?? sprite.id}`}
                className={`mg-wandering-pet mg-sprite-hitbox ${sprite.id === activePet?.id ? 'active' : ''}`}
                key={sprite.id}
                style={{ left: `${sprite.x}%`, top: `${sprite.y}%` }}
                type="button"
                onClick={() => setActivePetId(sprite.id)}
              >
                <PalmonSprite
                  emoji={pet.emoji}
                  name={pet.name}
                  size="chibi"
                  speciesId={pet.speciesId}
                  variant="chibi"
                />
                <span className="mg-palmon-label">{pet.name}</span>
                <span className="mg-rarity-badge" style={{ color: RARITY_COLORS[pet.rarity] }}>
                  {pet.rarity}
                </span>
              </button>
            )
          })}
        </div>

        {activePet && (
          <div className="mg-pet-card">
            <div className="mg-pet-meters">
              <label>
                Faim
                <progress max={100} value={activePet.hunger} />
              </label>
              <label>
                Joie
                <progress max={100} value={activePet.joy} />
              </label>
            </div>
            <div className="mg-pet-actions">
              <button type="button" onClick={feed}>
                🍎 Nourrir
              </button>
              <button type="button" onClick={play}>
                🎾 Jouer
              </button>
              <button type="button" onClick={cuddle}>
                💜 Câliner
              </button>
            </div>
          </div>
        )}
        {status === 'playing' && (
          <button className="primary mg-big-btn" type="button" onClick={finishVisit}>
            Terminer la visite
          </button>
        )}
        <p className="mg-td-hint">
          Les familiers chibi se baladent librement. S ils ont faim, tu gagnes juste un peu moins — jamais de game over.
        </p>
      </div>
    </MinigameFrame>
  )
}
