import { useEffect, useMemo, useState } from 'react'
import type { EchoEgg, PetState, RefugeResourceState } from '../../data/minigameSave'
import type { RefugeBiomeId } from '../../data/myrionRefuge'
import { BIOME_RESOURCES } from '../../data/myrionRefuge'
import type { HuntFavor } from '../../data/myrionMvp2'
import {
  BREED_RESOURCE_COST,
  INCUBATOR_SLOTS,
  applyBreedingCooldown,
  applyEggCare,
  breedablePets,
  breedingCompatibilityLabel,
  breedingResourceBiome,
  canStartBreeding,
  createEchoEgg,
  eggProgress,
  formatEggRemaining,
  getBreedingCompatibility,
  hatchEchoEgg,
  isEggReady,
} from '../../data/myrionMvp3'
import './Minigames.css'

type EchoNurseryProps = {
  pets: PetState[]
  echoEggs: EchoEgg[]
  refugeResources: Partial<Record<RefugeBiomeId, RefugeResourceState>>
  onClose: () => void
  onHatch: (pet: PetState, favor?: HuntFavor, removedEggId?: string) => void
  onStartBreeding: (egg: EchoEgg, updatedParents: PetState[], resourceBiome: RefugeBiomeId) => void
  onEggCare: (egg: EchoEgg) => void
}

export function EchoNursery({
  pets,
  echoEggs,
  refugeResources,
  onClose,
  onHatch,
  onStartBreeding,
  onEggCare,
}: EchoNurseryProps) {
  const [parentAId, setParentAId] = useState('')
  const [parentBId, setParentBId] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const candidates = useMemo(() => breedablePets(pets, now), [pets, now])
  const parentA = pets.find((pet) => pet.id === parentAId) ?? candidates[0]
  const parentB = pets.find((pet) => pet.id === parentBId) ?? candidates[1]

  const compatibility =
    parentA && parentB ? getBreedingCompatibility(parentA, parentB) : 'blocked'
  const resourceBiome = parentA && parentB ? breedingResourceBiome(parentA, parentB) : 'prairie-solaire'
  const resourceAmount = refugeResources[resourceBiome]?.amount ?? 0
  const eligibility =
    parentA && parentB
      ? canStartBreeding(parentA, parentB, echoEggs, resourceAmount, now)
      : { ok: false, reason: 'Choisis deux parents.' }

  const startBreeding = () => {
    if (!parentA || !parentB || !eligibility.ok) return
    const egg = createEchoEgg(parentA, parentB, now)
    const updatedParents = [applyBreedingCooldown(parentA, now), applyBreedingCooldown(parentB, now)]
    onStartBreeding(egg, updatedParents, resourceBiome)
  }

  return (
    <div className="mg-refuge-stable-overlay" role="presentation" onClick={onClose}>
      <div
        aria-labelledby="mg-echo-nursery-title"
        aria-modal="true"
        className="mg-echo-nursery"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mg-refuge-stable-head">
          <div>
            <p className="eyebrow">Reproduction</p>
            <h3 id="mg-echo-nursery-title">Nid d&apos;Écho</h3>
          </div>
          <button className="secondary" type="button" onClick={onClose}>
            Fermer
          </button>
        </header>

        <p className="mg-refuge-stable-copy">
          Deux Myrions compatibles créent un Œuf d&apos;Écho. Les buffs et la lignée s&apos;héritent.
        </p>

        <section className="mg-echo-section">
          <h4>Parents</h4>
          <div className="mg-echo-parents">
            <label>
              Parent A
              <select value={parentA?.id ?? ''} onChange={(event) => setParentAId(event.target.value)}>
                {candidates.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.rarity})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Parent B
              <select value={parentB?.id ?? ''} onChange={(event) => setParentBId(event.target.value)}>
                {candidates.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name} ({pet.rarity})
                  </option>
                ))}
              </select>
            </label>
          </div>
          {parentA && parentB ? (
            <p className="mg-echo-compat">
              {breedingCompatibilityLabel(compatibility)} · Génération{' '}
              {Math.max(parentA.generation ?? 0, parentB.generation ?? 0) + 1} · Coût{' '}
              {BREED_RESOURCE_COST} {BIOME_RESOURCES[resourceBiome].resourceEmoji}
            </p>
          ) : null}
          <button
            className="primary"
            disabled={!eligibility.ok}
            type="button"
            onClick={startBreeding}
          >
            Créer un Œuf d&apos;Écho
          </button>
          {!eligibility.ok && eligibility.reason ? (
            <p className="mg-echo-hint">{eligibility.reason}</p>
          ) : null}
        </section>

        <section className="mg-echo-section">
          <h4>
            Incubateur {echoEggs.length}/{INCUBATOR_SLOTS}
          </h4>
          {echoEggs.length === 0 ? (
            <p className="mg-echo-hint">Aucun œuf en incubation.</p>
          ) : (
            <ul className="mg-echo-egg-list">
              {echoEggs.map((egg) => {
                const ready = isEggReady(egg, now)
                const progress = Math.round(eggProgress(egg, now) * 100)
                const parentARef = pets.find((pet) => pet.id === egg.parentAId)
                const parentBRef = pets.find((pet) => pet.id === egg.parentBId)
                return (
                  <li className="mg-echo-egg-card" key={egg.id}>
                    <div className="mg-echo-egg-head">
                      <strong>
                        {egg.speciesEmoji} {egg.speciesName}
                      </strong>
                      <span>
                        {egg.expectedRarity} · gen.{egg.generation} · {progress}%
                      </span>
                    </div>
                    <progress max={100} value={progress} />
                    <p className="mg-echo-hint">
                      {ready
                        ? 'Prêt à éclore !'
                        : `Éclosion dans ${formatEggRemaining(egg, now)} · stabilité ${egg.stability}%`}
                    </p>
                    <div className="mg-echo-care">
                      {(['warm', 'soothe', 'moon'] as const).map((action) => (
                        <button
                          disabled={egg.careActions.includes(action)}
                          key={action}
                          type="button"
                          onClick={() => onEggCare(applyEggCare(egg, action))}
                        >
                          {action === 'warm' ? '🔥 Réchauffer' : action === 'soothe' ? '💤 Apaiser' : '🌙 Lune'}
                        </button>
                      ))}
                    </div>
                    {ready && parentARef && parentBRef ? (
                      <button
                        className="primary"
                        type="button"
                        onClick={() => {
                          const result = hatchEchoEgg(egg, parentARef, parentBRef, now)
                          onHatch(result.pet, result.favor, egg.id)
                        }}
                      >
                        Faire éclore
                      </button>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
