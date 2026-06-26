import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import type { Cost, ResourceKey } from '../../data/buildingActivities'
import type { PetState } from '../../data/minigameSave'
import {
  WORKSITE_BIOME_LABEL,
  WORKSITE_SPOT_IDS,
  WORKSITE_SPOTS,
  assignMyrionToSpot,
  computeWorksiteAutoGrant,
  computeWorksiteAutoPerSecond,
  computeWorksiteClickYield,
  mergeMyrionWorksite,
  removeMyrionFromSpot,
  worksiteAssignedPets,
  worksiteMyrionAssignedElsewhere,
  worksiteRarityMultiplier,
  type MyrionWorksiteSave,
  type WorksiteSpotId,
} from '../../data/myrionWorksite'
import { RARITY_COLORS } from '../../data/wildFamiliars'
import { HuntSideRail } from './HuntSideRail'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import './Worksite.css'

const CLICK_COOLDOWN_MS = 180
const AUTO_TICK_MS = 1000

const RESOURCE_LABELS: Partial<Record<ResourceKey, string>> = {
  wood: 'Bois',
  stone: 'Pierre',
  food: 'Vivres',
}

function formatYield(value: number) {
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  return value.toFixed(3)
}

function mergeCosts(target: Cost, delta: Cost): Cost {
  const next = { ...target }
  for (const [key, value] of Object.entries(delta)) {
    if (!value) continue
    const resource = key as ResourceKey
    next[resource] = (next[resource] ?? 0) + value
  }
  return next
}

export function MyrionWorksiteGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
}: MinigameProps) {
  const pets = useMemo(() => minigameSave?.pets ?? [], [minigameSave?.pets])
  const [worksite, setWorksite] = useState<MyrionWorksiteSave>(() =>
    mergeMyrionWorksite(minigameSave?.myrionWorksite),
  )
  const [openDrawer, setOpenDrawer] = useState<string | null>('spots')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [clickFlash, setClickFlash] = useState(false)
  const [sessionClicks, setSessionClicks] = useState(0)

  const worksiteRef = useRef(worksite)
  const petsRef = useRef(pets)
  const lastClickRef = useRef(0)
  const onCompleteRef = useRef(onComplete)
  const onSaveMinigameRef = useRef(onSaveMinigame)
  const minigameSaveRef = useRef(minigameSave)

  useEffect(() => {
    worksiteRef.current = worksite
    petsRef.current = pets
    onCompleteRef.current = onComplete
    onSaveMinigameRef.current = onSaveMinigame
    minigameSaveRef.current = minigameSave
  }, [worksite, pets, onComplete, onSaveMinigame, minigameSave])

  useEffect(() => {
    if (minigameSave?.myrionWorksite) {
      setWorksite(mergeMyrionWorksite(minigameSave.myrionWorksite))
    }
  }, [minigameSave?.myrionWorksite])

  const persist = useCallback(
    (next: MyrionWorksiteSave) => {
      setWorksite(next)
      if (minigameSave && onSaveMinigame) {
        onSaveMinigame({ ...minigameSave, myrionWorksite: next })
      }
    },
    [minigameSave, onSaveMinigame],
  )

  const selectedSpotId = worksite.selectedSpotId
  const selectedSpot = WORKSITE_SPOTS[selectedSpotId]
  const selectedAssigned = worksiteAssignedPets(worksite, selectedSpotId, pets)
  const clickYield = computeWorksiteClickYield(selectedSpot, selectedAssigned)
  const autoPerSec = computeWorksiteAutoPerSecond(selectedSpot, selectedAssigned)

  const selectSpot = (spotId: WorksiteSpotId) => {
    persist({ ...worksite, selectedSpotId: spotId })
  }

  const handleTap = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.timeStamp - lastClickRef.current < CLICK_COOLDOWN_MS) return
    lastClickRef.current = event.timeStamp

    const reward: Cost = { [selectedSpot.resourceId]: clickYield }
    const produced = (worksite.totalProducedBySpot[selectedSpotId] ?? 0) + clickYield
    persist({
      ...worksite,
      totalProducedBySpot: {
        ...worksite.totalProducedBySpot,
        [selectedSpotId]: produced,
      },
    })
    onComplete(1, 1, reward, { keepOpen: true, silent: true })
    setSessionClicks((value) => value + 1)
    setClickFlash(true)
    window.setTimeout(() => setClickFlash(false), 160)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      const current = worksiteRef.current
      const currentPets = petsRef.current
      let combined: Cost = {}
      let granted = false
      const produced = { ...current.totalProducedBySpot }

      for (const spotId of WORKSITE_SPOT_IDS) {
        const spot = WORKSITE_SPOTS[spotId]
        const assigned = worksiteAssignedPets(current, spotId, currentPets)
        const grant = computeWorksiteAutoGrant(spot, assigned, current.lastAutoTickAt, now)
        if (grant.amount > 0) {
          combined = mergeCosts(combined, grant.reward)
          produced[spotId] = (produced[spotId] ?? 0) + grant.amount
          granted = true
        }
      }

      const next: MyrionWorksiteSave = {
        ...current,
        lastAutoTickAt: now,
        totalProducedBySpot: produced,
      }

      if (next.lastAutoTickAt !== current.lastAutoTickAt || granted) {
        setWorksite(next)
        const save = minigameSaveRef.current
        if (save && onSaveMinigameRef.current) {
          onSaveMinigameRef.current({ ...save, myrionWorksite: next })
        }
      }

      if (granted) {
        onCompleteRef.current(0, 1, combined, { keepOpen: true, silent: true })
      }
    }, AUTO_TICK_MS)

    return () => window.clearInterval(timer)
  }, [])

  const assignPet = (petId: string) => {
    persist(assignMyrionToSpot(worksite, selectedSpotId, petId))
  }

  const removePet = (petId: string) => {
    persist(removeMyrionFromSpot(worksite, selectedSpotId, petId))
  }

  const totalProduced = (() => {
    let wood = 0
    let stone = 0
    let food = 0
    for (const spotId of WORKSITE_SPOT_IDS) {
      const spot = WORKSITE_SPOTS[spotId]
      const amount = worksite.totalProducedBySpot[spotId] ?? 0
      if (spot.resourceId === 'wood') wood += amount
      if (spot.resourceId === 'stone') stone += amount
      if (spot.resourceId === 'food') food += amount
    }
    return { wood, stone, food }
  })()

  const renderPetRow = (pet: PetState, assignedHere: boolean) => {
    const elsewhere = worksiteMyrionAssignedElsewhere(
      worksite,
      pet.id,
      assignedHere ? selectedSpotId : undefined,
    )
    const blocked = elsewhere !== null && !assignedHere
    return (
      <div className="mg-worksite-pet-row" key={pet.id}>
        <span className="mg-worksite-pet-emoji">{pet.emoji}</span>
        <span className="mg-worksite-pet-name">{pet.name}</span>
        <span className="mg-worksite-pet-rarity" style={{ color: RARITY_COLORS[pet.rarity] }}>
          {pet.rarity}
        </span>
        {assignedHere ? (
          <button className="mg-worksite-pet-btn secondary" type="button" onClick={() => removePet(pet.id)}>
            Retirer
          </button>
        ) : blocked ? (
          <span className="mg-worksite-pet-busy">Ailleurs</span>
        ) : (
          <button className="mg-worksite-pet-btn" type="button" onClick={() => assignPet(pet.id)}>
            Assigner
          </button>
        )}
      </div>
    )
  }

  const drawers = [
      {
        id: 'spots',
        label: 'Spots',
        icon: '📍',
        content: (
          <div className="mg-worksite-drawer-section">
            <p className="mg-worksite-drawer-lead">{WORKSITE_BIOME_LABEL}</p>
            <ul className="mg-worksite-spot-list">
              {WORKSITE_SPOT_IDS.map((spotId) => {
                const spot = WORKSITE_SPOTS[spotId]
                const assigned = worksiteAssignedPets(worksite, spotId, pets)
                const auto = computeWorksiteAutoPerSecond(spot, assigned)
                return (
                  <li key={spotId}>
                    <button
                      className={`mg-worksite-spot-btn ${selectedSpotId === spotId ? 'active' : ''}`}
                      type="button"
                      onClick={() => selectSpot(spotId)}
                    >
                      <span>{spot.emoji} {spot.name}</span>
                      <span className="mg-worksite-spot-meta">
                        {RESOURCE_LABELS[spot.resourceId]} · {assigned.length} Myrion(s) · {formatYield(auto)}/s
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ),
      },
      {
        id: 'resources',
        label: 'Ressources',
        icon: '📦',
        content: (
          <div className="mg-worksite-drawer-section">
            <p className="mg-worksite-drawer-lead">Total produit au chantier (session cumulée)</p>
            <ul className="mg-worksite-resource-list">
              <li>🪵 Bois — {formatYield(totalProduced.wood)}</li>
              <li>🪨 Pierre — {formatYield(totalProduced.stone)}</li>
              <li>🌾 Vivres — {formatYield(totalProduced.food)}</li>
            </ul>
            <p className="mg-worksite-note">Gains additifs très faibles — équilibrage provisoire.</p>
          </div>
        ),
      },
      {
        id: 'assign',
        label: 'Myrions',
        icon: '🐾',
        badge: selectedAssigned.length || undefined,
        content: (
          <div className="mg-worksite-drawer-section">
            <p className="mg-worksite-drawer-lead">
              {selectedSpot.emoji} {selectedSpot.name} — assignation
            </p>
            {pets.length === 0 ? (
              <p className="mg-worksite-empty">Aucun Myrion capturé. Va chasser pour en obtenir.</p>
            ) : (
              <>
                <div className="mg-worksite-pet-group">
                  <h4>Sur ce spot</h4>
                  {selectedAssigned.length === 0 ? (
                    <p className="mg-worksite-empty">Aucun Myrion assigné.</p>
                  ) : (
                    selectedAssigned.map((pet) => renderPetRow(pet, true))
                  )}
                </div>
                <div className="mg-worksite-pet-group">
                  <h4>Disponibles</h4>
                  {pets
                    .filter((pet) => !selectedAssigned.some((entry) => entry.id === pet.id))
                    .map((pet) => renderPetRow(pet, false))}
                </div>
              </>
            )}
          </div>
        ),
      },
      {
        id: 'production',
        label: 'Production',
        icon: '⚙️',
        content: (
          <div className="mg-worksite-drawer-section">
            <p className="mg-worksite-drawer-lead">Détail — {selectedSpot.name}</p>
            <dl className="mg-worksite-stats">
              <div>
                <dt>Ressource</dt>
                <dd>{RESOURCE_LABELS[selectedSpot.resourceId]}</dd>
              </div>
              <div>
                <dt>Myrions assignés</dt>
                <dd>{selectedAssigned.length}</dd>
              </div>
              <div>
                <dt>Gain par clic</dt>
                <dd>{formatYield(clickYield)}</dd>
              </div>
              <div>
                <dt>Auto / seconde</dt>
                <dd>{formatYield(autoPerSec)}</dd>
              </div>
              <div>
                <dt>Bonus rareté</dt>
                <dd>
                  {selectedAssigned.length === 0
                    ? '—'
                    : selectedAssigned
                        .map((pet) => `${pet.rarity} ×${worksiteRarityMultiplier(pet.rarity)}`)
                        .join(', ')}
                </dd>
              </div>
            </dl>
            <p className="mg-worksite-note">Équilibrage provisoire MVP 1.</p>
          </div>
        ),
      },
      {
        id: 'help',
        label: 'Aide',
        icon: '💡',
        content: (
          <div className="mg-worksite-drawer-section mg-worksite-help">
            <ul>
              <li>Assigne des Myrions pour augmenter la production.</li>
              <li>Les raretés élevées produisent un peu plus.</li>
              <li>Le clic accélère légèrement mais les Myrions font l&apos;essentiel.</li>
            </ul>
            <p className="mg-worksite-note">
              Les Myrions restent disponibles ailleurs dans le jeu pour ce MVP.
            </p>
          </div>
        ),
      },
    ]

  const assignedCompact = selectedAssigned.map((pet) => pet.emoji).join(' ') || '—'

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionMood="Supervise doucement le chantier."
      companionName={companionName}
      endless
      hideGlobalChrome
      maxScore={100}
      onClose={onClose}
      onRestart={() => {}}
      resourceLabel={resourceLabel}
      score={Math.round(totalProduced.wood + totalProduced.stone + totalProduced.food)}
      scoreLabel="Production chantier"
      status="playing"
    >
      <div className="mg-worksite mg-worksite-immersive">
        <div className="mg-worksite-layout">
          <HuntSideRail
            drawers={drawers}
            fabAriaLabel="Menu Chantier Myrion"
            menuAriaLabel="Gestion du chantier"
            menuTitle="Chantier"
            openId={openDrawer}
            onCloseMinigame={onClose}
            onOpenChange={setOpenDrawer}
          />
          <div className="mg-worksite-scene-wrap">
            <header className="mg-worksite-scene-head">
              <h2>{WORKSITE_BIOME_LABEL}</h2>
              <p>{selectedSpot.emoji} {selectedSpot.name} · {selectedSpot.hint}</p>
            </header>

            <div aria-label="Prairie du chantier" className="mg-worksite-scene" role="img">
              <div className="mg-worksite-sky" />
              <div className="mg-worksite-hills" />
              <div className="mg-worksite-spot-markers">
                {WORKSITE_SPOT_IDS.map((spotId) => {
                  const spot = WORKSITE_SPOTS[spotId]
                  return (
                    <button
                      aria-label={`Spot ${spot.name}`}
                      className={`mg-worksite-marker ${selectedSpotId === spotId ? 'active' : ''}`}
                      key={spotId}
                      type="button"
                      onClick={() => selectSpot(spotId)}
                    >
                      {spot.emoji}
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              className={`mg-worksite-tap ${clickFlash ? 'flash' : ''}`}
              type="button"
              onClick={handleTap}
            >
              <span className="mg-worksite-tap-label">Collecter — {RESOURCE_LABELS[selectedSpot.resourceId]}</span>
              <span className="mg-worksite-tap-yield">+{formatYield(clickYield)} / tap</span>
            </button>

            <div className="mg-worksite-compact">
              <span>Auto {formatYield(autoPerSec)}/s</span>
              <span>Myrions {assignedCompact}</span>
              <span>Taps {sessionClicks}</span>
            </div>

            <div className="mg-worksite-details">
              <button
                aria-expanded={detailsOpen}
                className="mg-worksite-details-toggle"
                type="button"
                onClick={() => setDetailsOpen((open) => !open)}
              >
                {detailsOpen ? 'Masquer' : 'Détail production biome'}
              </button>
              {detailsOpen ? (
                <div className="mg-worksite-details-panel">
                  <h3>Production par spot</h3>
                  <ul>
                    {WORKSITE_SPOT_IDS.map((spotId) => {
                      const spot = WORKSITE_SPOTS[spotId]
                      const assigned = worksiteAssignedPets(worksite, spotId, pets)
                      const auto = computeWorksiteAutoPerSecond(spot, assigned)
                      const click = computeWorksiteClickYield(spot, assigned)
                      return (
                        <li key={spotId}>
                          <strong>
                            {spot.emoji} {spot.name}
                          </strong>
                          <span>
                            {assigned.length} Myrion(s) · clic {formatYield(click)} · auto {formatYield(auto)}/s
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                  <p className="mg-worksite-note">Équilibrage provisoire — MVP 1.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MinigameFrame>
  )
}
