import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import type { Cost, ResourceKey } from '../../data/buildingActivities'
import type { PetState } from '../../data/minigameSave'
import {
  WORKSITE_BIOME_IDS,
  WORKSITE_BIOMES,
  WORKSITE_SUPERVISION_MULT,
  assignMyrionToSpot,
  computeWorksiteAutoGrant,
  computeWorksiteAutoPerSecond,
  computeWorksiteClickYield,
  getSpotsForBiome,
  getWorksiteSpot,
  iterUnlockedWorksiteSpots,
  mergeMyrionWorksite,
  removeMyrionFromSpot,
  worksiteAssignedPets,
  worksiteMyrionAssignedElsewhere,
  worksiteRarityMultiplier,
  worksiteSpotKey,
  type MyrionWorksiteSave,
  type WorksiteBiomeId,
  type WorksiteSpotId,
} from '../../data/myrionWorksite'
import { RARITY_COLORS } from '../../data/wildFamiliars'
import {
  getWorksiteBiomeVisual,
  getWorksiteResourceIconVisual,
  getWorksiteSpotVisual,
  worksiteSceneClassNames,
  worksiteSpotMarkerClassNames,
  worksiteSpotObjectClassNames,
  WORKSITE_UI_VISUALS,
} from '../../data/myrionWorksiteVisuals'
import { HuntSideRail } from './HuntSideRail'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import {
  WorksiteBiomeBackground,
  WorksiteResourceIcon,
  WorksiteSpotObject,
} from './WorksiteVisuals'
import './Worksite.css'

const CLICK_COOLDOWN_MS = 180
const AUTO_TICK_MS = 1000
const AUTO_SAVE_MS = 5000
const MOBILE_DRAWER_BREAKPOINT = '(max-width: 767px)'

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

function useMobileDrawerDefault() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_DRAWER_BREAKPOINT).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(MOBILE_DRAWER_BREAKPOINT)
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isMobile
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
  const isMobile = useMobileDrawerDefault()
  const pets = useMemo(() => minigameSave?.pets ?? [], [minigameSave?.pets])
  const [worksite, setWorksite] = useState<MyrionWorksiteSave>(() =>
    mergeMyrionWorksite(minigameSave?.myrionWorksite),
  )
  const [openDrawer, setOpenDrawer] = useState<string | null>(() =>
    typeof window !== 'undefined' && window.matchMedia(MOBILE_DRAWER_BREAKPOINT).matches
      ? null
      : 'biomes',
  )
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [clickFlash, setClickFlash] = useState(false)
  const [sessionClicks, setSessionClicks] = useState(0)

  const worksiteRef = useRef(worksite)
  const petsRef = useRef(pets)
  const lastClickRef = useRef(0)
  const lastAutoSaveAtRef = useRef(0)
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

  useEffect(() => {
    if (isMobile) {
      setOpenDrawer(null)
    } else if (openDrawer === null) {
      setOpenDrawer('biomes')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync drawer when breakpoint changes
  }, [isMobile])

  const persist = useCallback(
    (next: MyrionWorksiteSave) => {
      setWorksite(next)
      worksiteRef.current = next
      lastAutoSaveAtRef.current = Date.now()
      if (minigameSave && onSaveMinigame) {
        onSaveMinigame({ ...minigameSave, myrionWorksite: next })
      }
    },
    [minigameSave, onSaveMinigame],
  )

  const flushWorksiteSave = useCallback(
    (next: MyrionWorksiteSave, force = false) => {
      worksiteRef.current = next
      const now = Date.now()
      if (!force && now - lastAutoSaveAtRef.current < AUTO_SAVE_MS) return
      setWorksite(next)
      lastAutoSaveAtRef.current = now
      const save = minigameSaveRef.current
      if (save && onSaveMinigameRef.current) {
        onSaveMinigameRef.current({ ...save, myrionWorksite: next })
      }
    },
    [],
  )

  const activeBiomeId = worksite.activeBiomeId
  const activeBiome = WORKSITE_BIOMES[activeBiomeId]
  const selectedSpotId = worksite.selectedSpotByBiome[activeBiomeId]
  const selectedSpot = getWorksiteSpot(activeBiomeId, selectedSpotId)
  const selectedAssigned = worksiteAssignedPets(worksite, activeBiomeId, selectedSpotId, pets)
  const clickYield = computeWorksiteClickYield(selectedSpot, selectedAssigned)
  const autoPerSec = computeWorksiteAutoPerSecond(
    selectedSpot,
    selectedAssigned,
    WORKSITE_SUPERVISION_MULT,
  )
  const activeSpots = getSpotsForBiome(activeBiomeId)

  const selectBiome = (biomeId: WorksiteBiomeId) => {
    if (!worksite.unlockedBiomeIds.includes(biomeId)) return
    persist({ ...worksite, activeBiomeId: biomeId })
  }

  const selectSpot = (spotId: WorksiteSpotId) => {
    persist({
      ...worksite,
      selectedSpotByBiome: {
        ...worksite.selectedSpotByBiome,
        [activeBiomeId]: spotId,
      },
    })
  }

  const handleTap = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.timeStamp - lastClickRef.current < CLICK_COOLDOWN_MS) return
    lastClickRef.current = event.timeStamp

    const spotKey = worksiteSpotKey(activeBiomeId, selectedSpotId)
    const reward: Cost = { [selectedSpot.resourceId]: clickYield }
    const produced = (worksite.totalProducedBySpot[spotKey] ?? 0) + clickYield
    persist({
      ...worksite,
      totalProducedBySpot: {
        ...worksite.totalProducedBySpot,
        [spotKey]: produced,
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
      const sharedLastTick = current.lastAutoTickAt

      for (const { biomeId, spotId, spot } of iterUnlockedWorksiteSpots(current)) {
        const assigned = worksiteAssignedPets(current, biomeId, spotId, currentPets)
        const supervised = biomeId === current.activeBiomeId ? WORKSITE_SUPERVISION_MULT : 1
        const grant = computeWorksiteAutoGrant(
          spot,
          assigned,
          sharedLastTick,
          now,
          supervised,
        )
        if (grant.amount > 0) {
          combined = mergeCosts(combined, grant.reward)
          const key = worksiteSpotKey(biomeId, spotId)
          produced[key] = (produced[key] ?? 0) + grant.amount
          granted = true
        }
      }

      const next: MyrionWorksiteSave = {
        ...current,
        lastAutoTickAt: now,
        totalProducedBySpot: produced,
      }

      worksiteRef.current = next

      if (granted) {
        setWorksite(next)
        onCompleteRef.current(0, 1, combined, { keepOpen: true, silent: true })
      }

      flushWorksiteSave(next, granted)
    }, AUTO_TICK_MS)

    return () => {
      window.clearInterval(timer)
      flushWorksiteSave(worksiteRef.current, true)
    }
  }, [flushWorksiteSave])

  const assignPet = (petId: string) => {
    persist(assignMyrionToSpot(worksite, activeBiomeId, selectedSpotId, petId))
  }

  const removePet = (petId: string) => {
    persist(removeMyrionFromSpot(worksite, activeBiomeId, selectedSpotId, petId))
  }

  const totalProduced = (() => {
    let wood = 0
    let stone = 0
    let food = 0
    for (const { biomeId, spotId, spot } of iterUnlockedWorksiteSpots(worksite)) {
      const key = worksiteSpotKey(biomeId, spotId)
      const amount = worksite.totalProducedBySpot[key] ?? 0
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
      assignedHere ? activeBiomeId : undefined,
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
      id: 'biomes',
      label: 'Biomes',
      icon: '🗺️',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">Choisir le biome affiché</p>
          <ul className="mg-worksite-biome-list">
            {WORKSITE_BIOME_IDS.map((biomeId) => {
              const biome = WORKSITE_BIOMES[biomeId]
              const unlocked = worksite.unlockedBiomeIds.includes(biomeId)
              return (
                <li key={biomeId}>
                  <button
                    className={`mg-worksite-biome-btn ${activeBiomeId === biomeId ? 'active' : ''} ${unlocked ? '' : WORKSITE_UI_VISUALS['biome-locked'].asset.placeholderClass}`}
                    disabled={!unlocked}
                    type="button"
                    onClick={() => selectBiome(biomeId)}
                  >
                    <span>
                      {biome.emoji} {biome.label}
                    </span>
                    {activeBiomeId === biomeId ? (
                      <span className="mg-worksite-biome-meta">Affiché · supervision</span>
                    ) : unlocked ? (
                      <span className="mg-worksite-biome-meta">Production passive</span>
                    ) : (
                      <span className="mg-worksite-biome-meta">Verrouillé</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ),
    },
    {
      id: 'spots',
      label: 'Spots',
      icon: '📍',
      content: (
        <div className="mg-worksite-drawer-section">
          <p className="mg-worksite-drawer-lead">
            {activeBiome.emoji} {activeBiome.label}
          </p>
          <ul className="mg-worksite-spot-list">
            {activeSpots.map((spot) => {
              const assigned = worksiteAssignedPets(worksite, activeBiomeId, spot.id, pets)
              const auto = computeWorksiteAutoPerSecond(
                spot,
                assigned,
                WORKSITE_SUPERVISION_MULT,
              )
              return (
                <li key={spot.id}>
                  <button
                    className={`mg-worksite-spot-btn ${selectedSpotId === spot.id ? 'active' : ''}`}
                    type="button"
                    onClick={() => selectSpot(spot.id)}
                  >
                    <span>
                      {spot.emoji} {spot.name}
                    </span>
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
            {(
              [
                ['wood', totalProduced.wood, 'Bois'],
                ['stone', totalProduced.stone, 'Pierre'],
                ['food', totalProduced.food, 'Vivres'],
              ] as const
            ).map(([resourceId, amount, label]) => {
              const icon = getWorksiteResourceIconVisual(resourceId)
              return (
                <li key={resourceId}>
                  <WorksiteResourceIcon
                    asset={icon.asset}
                    emoji={icon.fallbackEmoji}
                    label={label}
                  />{' '}
                  {label} — {formatYield(amount)}
                </li>
              )
            })}
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
          <p className="mg-worksite-drawer-lead">
            Détail — {activeBiome.label} · {selectedSpot.name}
          </p>
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
              <dd>
                {formatYield(autoPerSec)}
                <span className="mg-worksite-supervision-inline">
                  {' '}
                  (+{Math.round((WORKSITE_SUPERVISION_MULT - 1) * 100)}% supervision)
                </span>
              </dd>
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
          {worksite.unlockedBiomeIds.length > 1 ? (
            <>
              <p className="mg-worksite-drawer-lead">Autres biomes (passif)</p>
              <ul className="mg-worksite-other-biomes">
                {worksite.unlockedBiomeIds
                  .filter((biomeId) => biomeId !== activeBiomeId)
                  .map((biomeId) => {
                    const biome = WORKSITE_BIOMES[biomeId]
                    const spots = getSpotsForBiome(biomeId)
                    const assignedCount = spots.reduce(
                      (sum, spot) =>
                        sum +
                        worksiteAssignedPets(worksite, biomeId, spot.id, pets).length,
                      0,
                    )
                    return (
                      <li key={biomeId}>
                        {biome.emoji} {biome.label} — {assignedCount} Myrion(s) assigné(s)
                      </li>
                    )
                  })}
              </ul>
            </>
          ) : null}
          <p className="mg-worksite-note">Équilibrage provisoire MVP 2.</p>
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
            <li>Tous les biomes assignés produisent passivement.</li>
            <li>Seul le biome affiché reçoit la supervision.</li>
            <li>Le clic accélère légèrement le spot actif.</li>
            <li>Les gains restent volontairement faibles.</li>
          </ul>
          <p className="mg-worksite-note">
            Les Myrions restent disponibles ailleurs dans le jeu pour ce MVP.
          </p>
        </div>
      ),
    },
  ]

  const assignedCompact = selectedAssigned.map((pet) => pet.emoji).join(' ') || '—'
  const supervisionPct = Math.round((WORKSITE_SUPERVISION_MULT - 1) * 100)

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
              <div className="mg-worksite-scene-head-row">
                <h2>
                  {activeBiome.emoji} {activeBiome.label}
                </h2>
                <span className="mg-worksite-supervision-badge" title="Bonus auto sur ce biome">
                  Supervision +{supervisionPct}%
                </span>
              </div>
              <p>
                {selectedSpot.emoji} {selectedSpot.name} · {selectedSpot.hint}
              </p>
            </header>

            <div
              aria-label={activeBiome.label}
              className={worksiteSceneClassNames(activeBiomeId, true, activeBiome.panoramaClass)}
              role="img"
            >
              <WorksiteBiomeBackground
                asset={getWorksiteBiomeVisual(activeBiomeId).background}
                label={activeBiome.label}
              />
              <div className="mg-worksite-sky" />
              <div className="mg-worksite-hills" />
              <div className="mg-worksite-spot-markers">
                {activeSpots.map((spot) => {
                  const spotVisual = getWorksiteSpotVisual(spot.id)
                  const selected = selectedSpotId === spot.id
                  const locked = !spot.unlocked
                  return (
                    <button
                      aria-label={`Spot ${spot.name}`}
                      className={worksiteSpotMarkerClassNames(spot.id, selected, locked)}
                      key={spot.id}
                      type="button"
                      onClick={() => selectSpot(spot.id)}
                    >
                      <WorksiteSpotObject
                        asset={spotVisual.asset}
                        className={worksiteSpotObjectClassNames(spot.id)}
                        emoji={spot.emoji}
                        name={spot.name}
                      />
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
              <span className="mg-worksite-tap-label">
                <WorksiteResourceIcon
                  asset={getWorksiteResourceIconVisual(selectedSpot.resourceId).asset}
                  emoji={getWorksiteResourceIconVisual(selectedSpot.resourceId).fallbackEmoji}
                  label={RESOURCE_LABELS[selectedSpot.resourceId] ?? selectedSpot.resourceId}
                />{' '}
                Collecter — {RESOURCE_LABELS[selectedSpot.resourceId]}
              </span>
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
                {detailsOpen ? 'Masquer' : 'Détail production biomes'}
              </button>
              {detailsOpen ? (
                <div className="mg-worksite-details-panel">
                  {worksite.unlockedBiomeIds.map((biomeId) => {
                    const biome = WORKSITE_BIOMES[biomeId]
                    const spots = getSpotsForBiome(biomeId)
                    const supervised = biomeId === activeBiomeId
                    return (
                      <div className="mg-worksite-details-biome" key={biomeId}>
                        <h3>
                          {biome.emoji} {biome.label}
                          {supervised ? (
                            <span className="mg-worksite-supervision-inline"> · supervision</span>
                          ) : null}
                        </h3>
                        <ul>
                          {spots.map((spot) => {
                            const assigned = worksiteAssignedPets(worksite, biomeId, spot.id, pets)
                            const mult = supervised ? WORKSITE_SUPERVISION_MULT : 1
                            const auto = computeWorksiteAutoPerSecond(spot, assigned, mult)
                            const click = computeWorksiteClickYield(spot, assigned)
                            return (
                              <li key={spot.id}>
                                <strong>
                                  {spot.emoji} {spot.name}
                                </strong>
                                <span>
                                  {assigned.length} Myrion(s) · clic {formatYield(click)} · auto{' '}
                                  {formatYield(auto)}/s
                                </span>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    )
                  })}
                  <p className="mg-worksite-note">Équilibrage provisoire — MVP 2.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MinigameFrame>
  )
}
