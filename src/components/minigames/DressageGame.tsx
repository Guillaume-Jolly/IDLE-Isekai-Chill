import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import {
  BIOME_RESOURCES,
  ENCLOSURE_BOUNDS,
  MAX_SPECIES_COPIES,
  estimateDailyProduction,
  getBiomeCollectionStatus,
  normalizeRefugeBiomeId,
  pickEnclosureRepresentatives,
  speciesCopyCount,
  uniqueSpeciesCount,
  type RefugeBiomeId,
} from '../../data/myrionRefuge'
import {
  refreshPetsOnVisit,
  type EchoEgg,
  type MinigameSave,
  type PetState,
  type RefugeProgressState,
  type RefugeResourceState,
} from '../../data/minigameSave'
import {
  compareCapturedMyrion,
  companionAffinityMultiplier,
  computeCompanionBuffTotal,
  maybeGrantRefugeFavor,
  type CaptureCompareResult,
  type HuntFavor,
} from '../../data/myrionMvp2'
import {
  getLinkedMyrion,
  linkMyrionToCompanion,
  removeCompanionLinksForPet,
  unlinkCompanionMyrion,
} from '../../data/myrionCompanionLinks'
import { applyReleaseRewards } from '../../data/myrionRelease'
import { BREED_RESOURCE_COST } from '../../data/myrionMvp3'
import { type CraftResult } from '../../data/myrionCraft'
import { useEnclosureWanderers } from '../../hooks/useEnclosureWanderers'
import { useIsMobileRefuge } from '../../hooks/useMediaQuery'
import { useRefugeCarePopoverAnchor } from '../../hooks/useRefugeCarePopoverAnchor'
import { BIOMES } from '../../data/wildFamiliars'
import { CaptureComparePanel } from './CaptureComparePanel'
import { EchoNursery } from './EchoNursery'
import { EnclosureBackground } from './EnclosureBackground'
import { EnclosureChibi } from './EnclosureChibi'
import { HuntSideRail } from './HuntSideRail'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { MinigameSwitchPanel } from './MinigameSwitchPanel'
import { PalmonSprite } from './PalmonSprite'
import { RefugeBiomeMapPanel } from './RefugeBiomeMapPanel'
import { RefugeCarePanel, type BulkCareScope } from './RefugeCarePanel'
import { RefugeCarePopover } from './RefugeCarePopover'
import { RefugeCraftPanel } from './RefugeCraftPanel'
import { RefugeSummaryPanel } from './RefugeSummaryPanel'
import { SystemContextHint } from '../SystemContextHint'

import './RefugeMobile.css'

const DAY_MS = 86_400_000

function tickRefugeResources(
  save: MinigameSave,
  pets: PetState[],
  now = Date.now(),
): Partial<Record<RefugeBiomeId, RefugeResourceState>> {
  const current = save.refugeResources ?? {}
  const next: Partial<Record<RefugeBiomeId, RefugeResourceState>> = { ...current }

  for (const biome of BIOMES) {
    const biomeId = biome.id as RefugeBiomeId
    const state = next[biomeId] ?? { amount: 0, lastTickAt: now }
    const elapsedDays = Math.max(0, (now - state.lastTickAt) / DAY_MS)
    if (elapsedDays < 0.01) {
      next[biomeId] = state
      continue
    }
    const biomeFavor = save.refugeProgress?.biomeFavors?.[biomeId] ?? 0
    const collectionBonus = getBiomeCollectionStatus(pets, biomeId).collectionBonusPercent
    const daily = estimateDailyProduction(pets, biomeId, biomeFavor, collectionBonus)
    next[biomeId] = {
      amount: Math.round((state.amount + daily * elapsedDays) * 10) / 10,
      lastTickAt: now,
    }
  }

  return next
}

export function DressageGame({
  activity,
  companionName,
  buildingName,
  resourceLabel,
  minigameSave,
  onSaveMinigame,
  onComplete,
  onClose,
  onLaunchMinigame,
}: MinigameProps) {
  const [pets, setPets] = useState<PetState[]>(() =>
    refreshPetsOnVisit(minigameSave?.pets ?? []),
  )
  const [refugeResources, setRefugeResources] = useState<
    Partial<Record<RefugeBiomeId, RefugeResourceState>>
  >(() => tickRefugeResources(minigameSave ?? { farmPlots: [], pets: [] }, minigameSave?.pets ?? []))
  const [activeBiomeId, setActiveBiomeId] = useState<RefugeBiomeId>('prairie-solaire')
  const [activePetId, setActivePetId] = useState('')
  const [carePoints, setCarePoints] = useState(0)
  const [showStable, setShowStable] = useState(false)
  const [showNursery, setShowNursery] = useState(false)
  const [showCraft, setShowCraft] = useState(false)
  const [echoEggs, setEchoEggs] = useState<EchoEgg[]>(() => minigameSave?.echoEggs ?? [])
  const [huntFavors, setHuntFavors] = useState<HuntFavor[]>(() => minigameSave?.huntFavors ?? [])
  const [companionLinks, setCompanionLinks] = useState<Partial<Record<string, string>>>(
    () => minigameSave?.companionMyrionLinks ?? {},
  )
  const [pendingHatch, setPendingHatch] = useState<{
    pet: PetState
    favor?: HuntFavor
    removedEggId?: string
    comparison: CaptureCompareResult
  } | null>(null)
  const [refugeProgress, setRefugeProgress] = useState<RefugeProgressState>(
    () => minigameSave?.refugeProgress ?? { shinyDiscovered: false, biomeFavors: {} },
  )
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [flash, setFlash] = useState(`${companionName} t'accueille au refuge.`)
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const [releaseConfirmPending, setReleaseConfirmPending] = useState(false)
  const isMobileRefuge = useIsMobileRefuge()
  const biomePets = useMemo(
    () => pets.filter((pet) => normalizeRefugeBiomeId(pet.biomeId) === activeBiomeId),
    [activeBiomeId, pets],
  )

  const enclosurePets = useMemo(
    () => pickEnclosureRepresentatives(biomePets),
    [biomePets],
  )

  const wanderInputs = useMemo(
    () =>
      enclosurePets.map((pet) => ({
        id: pet.id,
        speciesId: pet.speciesId,
        name: pet.name,
        emoji: pet.emoji,
      })),
    [enclosurePets],
  )

  const bounds = ENCLOSURE_BOUNDS[activeBiomeId]
  const { wanderers, triggerCareReaction } = useEnclosureWanderers(wanderInputs, bounds)
  const enclosureSlotRef = useRef<HTMLDivElement>(null)
  const playfieldRef = useRef<HTMLDivElement>(null)

  const activePet = pets.find((pet) => pet.id === activePetId) ?? biomePets[0]
  const activeWanderer =
    wanderers.find((sprite) => sprite.id === activePetId) ??
    (activePet
      ? wanderers.find((sprite) => {
          const rep = enclosurePets.find((entry) => entry.id === sprite.id)
          return rep?.speciesId === activePet.speciesId
        }) ?? null
      : null)
  const showCarePopover =
    isMobileRefuge &&
    Boolean(activePet && activeWanderer) &&
    enclosurePets.some((pet) => pet.speciesId === activePet?.speciesId)
  const carePopoverAnchor = useRefugeCarePopoverAnchor(
    enclosureSlotRef,
    playfieldRef,
    activeWanderer,
    showCarePopover,
    isMobileRefuge,
  )

  const speciesSiblings = useMemo(
    () =>
      activePet
        ? biomePets.filter((pet) => pet.speciesId === activePet.speciesId)
        : [],
    [activePet, biomePets],
  )
  const biomeSpeciesList = useMemo(
    () => [...enclosurePets].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    [enclosurePets],
  )
  const siblingIndex = activePet
    ? speciesSiblings.findIndex((pet) => pet.id === activePet.id)
    : -1
  const biomeSpeciesIndex = activePet
    ? biomeSpeciesList.findIndex((pet) => pet.speciesId === activePet.speciesId)
    : -1
  const resourceDef = BIOME_RESOURCES[activeBiomeId]

  useEffect(() => {
    if (!minigameSave) return
    setPets(refreshPetsOnVisit(minigameSave.pets))
    setEchoEggs(minigameSave.echoEggs ?? [])
    setActivePetId('')
  }, [minigameSave?.saveVersion, minigameSave?.pets.length])

  useEffect(() => {
    setReleaseConfirmPending(false)
  }, [activePetId])

  useEffect(() => {
    if (!activePet && biomePets[0]) {
      setActivePetId(biomePets[0].id)
    }
  }, [activePet, biomePets])

  useEffect(() => {
    if (minigameSave && onSaveMinigame) {
      onSaveMinigame({
        ...minigameSave,
        pets,
        refugeResources,
        huntFavors,
        refugeProgress,
        echoEggs,
        companionMyrionLinks: companionLinks,
      })
    }
  }, [
    companionLinks,
    echoEggs,
    huntFavors,
    minigameSave,
    onSaveMinigame,
    pets,
    refugeProgress,
    refugeResources,
  ])

  const updatePet = useCallback((petId: string, patch: Partial<PetState>) => {
    setPets((current) =>
      current.map((pet) =>
        pet.id === petId
          ? {
              ...pet,
              ...patch,
              hunger: Math.min(100, patch.hunger ?? pet.hunger),
              joy: Math.min(100, patch.joy ?? pet.joy),
              energy: Math.min(100, Math.max(0, patch.energy ?? pet.energy)),
              affectionLevel: Math.min(5, patch.affectionLevel ?? pet.affectionLevel),
              lastVisit: Date.now(),
            }
          : pet,
      ),
    )
    setCarePoints((value) => value + 1)
  }, [])

  const grantCareResource = useCallback(() => {
    setRefugeResources((current) => {
      const state = current[activeBiomeId] ?? { amount: 0, lastTickAt: Date.now() }
      return {
        ...current,
        [activeBiomeId]: {
          ...state,
          amount: Math.round((state.amount + 0.2) * 10) / 10,
        },
      }
    })
  }, [activeBiomeId])

  const grantCareFavor = useCallback((pet: PetState, action: 'cuddle' | 'feed' | 'play') => {
    const favor = maybeGrantRefugeFavor(pet, action)
    if (!favor) return false
    setHuntFavors((current) => [...current, favor])
    setFlash(`${pet.name} t offre une ${favor.name} (niv. ${favor.level}) !`)
    return true
  }, [])

  const feed = () => {
    if (!activePet) return
    triggerCareReaction(activePet.id, 'feed')
    const patched = { ...activePet, hunger: activePet.hunger + 22, joy: activePet.joy + 6 }
    updatePet(activePet.id, { hunger: patched.hunger, joy: patched.joy })
    grantCareResource()
    if (!grantCareFavor(patched, 'feed')) {
      setFlash(`${activePet.name} savoure sa friandise.`)
    }
  }

  const play = () => {
    if (!activePet || activePet.energy < 12) {
      setFlash('Pas assez d energie — laisse-le se reposer un peu.')
      return
    }
    triggerCareReaction(activePet.id, 'play')
    const patched = { ...activePet, joy: activePet.joy + 24, energy: activePet.energy - 12 }
    updatePet(activePet.id, { joy: patched.joy, energy: patched.energy })
    if (!grantCareFavor(patched, 'play')) {
      setFlash(`${activePet.name} court joyeusement !`)
    }
  }

  const cuddle = () => {
    if (!activePet) return
    triggerCareReaction(activePet.id, 'cuddle')
    const patched = {
      ...activePet,
      joy: activePet.joy + 14,
      hunger: activePet.hunger + 8,
      affectionLevel:
        activePet.joy > 60 && Math.random() < 0.4
          ? Math.min(5, activePet.affectionLevel + 1)
          : activePet.affectionLevel,
    }
    updatePet(activePet.id, {
      joy: patched.joy,
      hunger: patched.hunger,
      affectionLevel: patched.affectionLevel,
    })
    if (!grantCareFavor(patched, 'cuddle')) {
      setFlash(`Câlin réussi — ${activePet.name} ronronne doucement.`)
    }
  }

  const observe = () => {
    if (!activePet) return
    triggerCareReaction(activePet.id, 'observe')
    updatePet(activePet.id, { joy: activePet.joy + 4 })
    setFlash(`${activePet.name} semble ${activePet.joy > 70 ? 'curieux et heureux' : 'un peu timide'}.`)
  }

  const releasePet = () => {
    if (!activePet) return
    if (activePet.isShiny) {
      setFlash('Impossible de relâcher un shiny.')
      return
    }
    const copies = speciesCopyCount(pets, activePet.speciesId)
    if (copies <= 1) {
      setFlash('Impossible de relâcher le seul exemplaire de cette espèce.')
      return
    }
    const rewards = applyReleaseRewards(activePet, refugeProgress, refugeResources)
    setRefugeProgress(rewards.refugeProgress)
    setRefugeResources(rewards.refugeResources)
    setCompanionLinks(removeCompanionLinksForPet(companionLinks, activePet.id))
    setPets((current) => current.filter((pet) => pet.id !== activePet.id))
    setActivePetId('')
    setReleaseConfirmPending(false)
    setFlash(`${activePet.name} retourne à la nature — ${rewards.summary}.`)
  }

  const selectEnclosurePet = useCallback(
    (petId: string) => {
      setActivePetId(petId)
      setReleaseConfirmPending(false)
      if (!isMobileRefuge) {
        setOpenDrawer('care')
      }
    },
    [isMobileRefuge],
  )

  const bulkCare = useCallback(
    (scope: BulkCareScope) => {
      const targets =
        scope === 'biome'
          ? pets.filter((pet) => normalizeRefugeBiomeId(pet.biomeId) === activeBiomeId)
          : pets
      if (targets.length === 0) return

      const visibleIds = new Set(enclosurePets.map((pet) => pet.id))
      const targetIds = new Set(targets.map((pet) => pet.id))

      setPets((current) =>
        current.map((pet) => {
          if (!targetIds.has(pet.id)) return pet
          return {
            ...pet,
            hunger: Math.min(100, pet.hunger + 12),
            joy: Math.min(100, pet.joy + 8),
            energy: Math.min(100, pet.energy + 4),
            lastVisit: Date.now(),
          }
        }),
      )
      setCarePoints((value) => value + targets.length)
      setRefugeResources((current) => {
        const state = current[activeBiomeId] ?? { amount: 0, lastTickAt: Date.now() }
        return {
          ...current,
          [activeBiomeId]: {
            ...state,
            amount: Math.round((state.amount + targets.length * 0.1) * 10) / 10,
          },
        }
      })

      for (const pet of targets) {
        if (visibleIds.has(pet.id)) {
          triggerCareReaction(pet.id, 'cuddle')
        }
      }

      setFlash(
        scope === 'biome'
          ? `Soins enclos — ${targets.length} Myrion(s) du biome.`
          : `Soins refuge — ${targets.length} Myrion(s) soignés.`,
      )
    },
    [activeBiomeId, enclosurePets, pets, triggerCareReaction],
  )

  const finishVisit = () => {
    const mood =
      pets.reduce((sum, pet) => sum + pet.hunger + pet.joy + pet.energy, 0) /
      Math.max(1, pets.length * 3)
    const score = Math.round(mood)
    setStatus('won')
    onComplete(score, 100, scaleReward(activity.baseReward, score, 100))
  }

  const restart = () => {
    setCarePoints(0)
    setStatus('playing')
    setFlash(`${companionName} rouvre les portes du refuge.`)
  }

  const avgMood = Math.round(
    pets.reduce((sum, pet) => sum + (pet.hunger + pet.joy) / 2, 0) / Math.max(1, pets.length),
  )

  const linkedMyrion = getLinkedMyrion(pets, companionLinks, activity.companionId)
  const isLinkedToActiveCompanion = activePet
    ? companionLinks[activity.companionId] === activePet.id
    : false

  const toggleCompanionLink = () => {
    if (!activePet) return
    if (isLinkedToActiveCompanion) {
      setCompanionLinks(unlinkCompanionMyrion(companionLinks, activity.companionId))
      setFlash(`${activePet.name} n'est plus lié à ${companionName}.`)
      return
    }
    const result = linkMyrionToCompanion(
      companionLinks,
      pets,
      activity.companionId,
      activePet.id,
    )
    if (result.error) {
      setFlash(result.error)
      return
    }
    setCompanionLinks(result.links)
    setFlash(`${activePet.name} soutient ${companionName} en chasse et aventure.`)
  }

  const handleCraftResult = (result: CraftResult) => {
    if (!result.ok) {
      setFlash(result.reason)
      return
    }
    setRefugeResources(result.resources)
    if (result.pets) setPets(result.pets)
    if (result.huntFavors) setHuntFavors(result.huntFavors)
    if (result.echoEggs) setEchoEggs(result.echoEggs)
    setFlash(result.message)
  }

  const speciesCount = activePet ? speciesCopyCount(pets, activePet.speciesId) : 0
  const companionSupport = activePet
    ? computeCompanionBuffTotal(activePet, activity.companionId)
    : 0
  const affinityMult = activePet
    ? companionAffinityMultiplier(activity.companionId, activePet)
    : 1

  const handleReleaseClick = () => {
    if (!activePet) return
    if (activePet.isShiny) {
      setFlash('Impossible de relâcher un shiny.')
      return
    }
    const copies = speciesCopyCount(pets, activePet.speciesId)
    if (copies <= 1) {
      setFlash('Impossible de relâcher le seul exemplaire de cette espèce.')
      return
    }
    if (!releaseConfirmPending) {
      setReleaseConfirmPending(true)
      setFlash(`Confirme le relâcher de ${activePet.name}.`)
      return
    }
    releasePet()
  }

  const cycleDuplicate = (delta: number) => {
    if (!activePet || speciesSiblings.length <= 1) return
    const index = speciesSiblings.findIndex((pet) => pet.id === activePet.id)
    const next =
      speciesSiblings[(index + delta + speciesSiblings.length) % speciesSiblings.length]
    setActivePetId(next.id)
    setReleaseConfirmPending(false)
  }

  const cycleBiomePet = (delta: number) => {
    if (!activePet || biomeSpeciesList.length <= 1) return
    const index = biomeSpeciesList.findIndex((pet) => pet.speciesId === activePet.speciesId)
    const next =
      biomeSpeciesList[(index + delta + biomeSpeciesList.length) % biomeSpeciesList.length]
    setActivePetId(next.id)
    setReleaseConfirmPending(false)
  }

  const selectPetFromStable = (petId: string) => {
    const pet = pets.find((entry) => entry.id === petId)
    if (!pet) return
    setActiveBiomeId(normalizeRefugeBiomeId(pet.biomeId))
    setActivePetId(pet.id)
    setShowStable(false)
    setFlash(`${pet.name} t attend dans les étables.`)
  }

  const handleStartBreeding = (
    egg: EchoEgg,
    updatedParents: PetState[],
    resourceBiome: RefugeBiomeId,
  ) => {
    setEchoEggs((current) => [...current, egg])
    setPets((current) =>
      current.map((pet) => updatedParents.find((updated) => updated.id === pet.id) ?? pet),
    )
    setRefugeResources((current) => {
      const state = current[resourceBiome] ?? { amount: 0, lastTickAt: Date.now() }
      return {
        ...current,
        [resourceBiome]: {
          ...state,
          amount: Math.max(0, Math.round((state.amount - BREED_RESOURCE_COST) * 10) / 10),
        },
      }
    })
    setShowNursery(false)
    setFlash('Un Œuf d Écho commence à chanter doucement…')
  }

  const handleHatch = (pet: PetState, favor?: HuntFavor, removedEggId?: string) => {
    const copies = speciesCopyCount(pets, pet.speciesId)
    if (copies >= MAX_SPECIES_COPIES) {
      const nextPets = [...pets, pet]
      setPendingHatch({
        pet,
        favor,
        removedEggId,
        comparison: compareCapturedMyrion(pet, nextPets, []),
      })
      setShowNursery(false)
      return
    }
    finalizeHatch(pet, favor, removedEggId)
  }

  const finalizeHatch = (pet: PetState, favor?: HuntFavor, removedEggId?: string) => {
    setPets((current) => [...current, pet])
    if (removedEggId) {
      setEchoEggs((current) => current.filter((egg) => egg.id !== removedEggId))
    }
    if (favor) setHuntFavors((current) => [...current, favor])
    if (pet.isShiny) {
      setRefugeProgress((current) => ({ ...current, shinyDiscovered: true }))
    }
    setFlash(
      pet.lrBlessing
        ? `${pet.name} éclot sous une Bénédiction LR !`
        : pet.isShiny
          ? `${pet.name} éclot — shiny !`
          : `${pet.name} rejoint le refuge (gen. ${pet.generation ?? 1}).`,
    )
    setShowNursery(false)
    setPendingHatch(null)
  }

  const handleReleaseHatched = () => {
    if (!pendingHatch) return
    const { pet, removedEggId } = pendingHatch
    const rewards = applyReleaseRewards(pet, refugeProgress, refugeResources)
    setRefugeProgress(rewards.refugeProgress)
    setRefugeResources(rewards.refugeResources)
    if (removedEggId) {
      setEchoEggs((current) => current.filter((egg) => egg.id !== removedEggId))
    }
    setPendingHatch(null)
    setFlash(`${pet.name} retourne au vent — ${rewards.summary}.`)
  }

  const handleReplaceWeakestHatch = () => {
    const weakestDuplicate = pendingHatch?.comparison.weakestDuplicate
    if (!pendingHatch || !weakestDuplicate) return
    const { pet, favor, removedEggId } = pendingHatch
    const removedId = weakestDuplicate.id
    const nextPets = [...pets.filter((entry) => entry.id !== removedId), pet]
    setPets(nextPets)
    setCompanionLinks(removeCompanionLinksForPet(companionLinks, removedId))
    if (removedEggId) {
      setEchoEggs((current) => current.filter((egg) => egg.id !== removedEggId))
    }
    if (favor) setHuntFavors((current) => [...current, favor])
    if (pet.isShiny) {
      setRefugeProgress((current) => ({ ...current, shinyDiscovered: true }))
    }
    setPendingHatch(null)
    setFlash(
      `${weakestDuplicate.name} remplacé par ${pet.name} (gen. ${pet.generation ?? 1}).`,
    )
  }

  const handleEggCare = (egg: EchoEgg) => {
    setEchoEggs((current) => current.map((entry) => (entry.id === egg.id ? egg : entry)))
  }

  const carePanel = activePet ? (
    <RefugeCarePanel
      affinityMult={affinityMult}
      biomePetCount={biomePets.length}
      companionId={activity.companionId}
      companionLinks={companionLinks}
      companionName={companionName}
      companionSupport={companionSupport}
      isLinkedToActiveCompanion={isLinkedToActiveCompanion}
      linkedMyrion={linkedMyrion}
      pet={activePet}
      refugePetCount={pets.length}
      releaseConfirmPending={releaseConfirmPending}
      siblingIndex={Math.max(0, siblingIndex)}
      speciesCount={speciesCount}
      speciesSiblingCount={speciesSiblings.length}
      biomeSpeciesIndex={Math.max(0, biomeSpeciesIndex)}
      biomeSpeciesCount={biomeSpeciesList.length}
      variant="drawer"
      onBulkCare={bulkCare}
      onCuddle={cuddle}
      onCycleBiomePet={cycleBiomePet}
      onCycleDuplicate={cycleDuplicate}
      onFeed={feed}
      onObserve={observe}
      onPlay={play}
      onReleaseClick={handleReleaseClick}
      onToggleCompanionLink={toggleCompanionLink}
    />
  ) : null

  const selectRefugeBiome = useCallback((biomeId: RefugeBiomeId) => {
    setActiveBiomeId(biomeId)
    setActivePetId('')
    setOpenDrawer(null)
  }, [])

  const refugeDrawers = useMemo(() => {
    const drawers = [
      {
        id: 'biomes',
        label: 'Biomes',
        icon: '🗺️',
        badge: pets.length,
        content: (
          <>
            <p className="mg-flash mg-refuge-flash">{flash}</p>
            <RefugeBiomeMapPanel
              activeBiomeId={activeBiomeId}
              pets={pets}
              variant="compact"
              onSelect={selectRefugeBiome}
            />
          </>
        ),
      },
      {
        id: 'summary',
        label: 'Récapitulatif',
        icon: '📊',
        content: (
          <RefugeSummaryPanel
            activeBiomeId={activeBiomeId}
            carePoints={carePoints}
            huntFavorsCount={huntFavors.length}
            pets={pets}
            refugeProgress={refugeProgress}
            refugeResources={refugeResources}
          />
        ),
      },
      {
        id: 'care',
        label: 'Soins',
        icon: '💜',
        badge: activePet ? undefined : '!',
        content: carePanel ?? (
          <p className="mg-refuge-stable-empty">Aucun Myrion dans cet enclos.</p>
        ),
      },
      {
        id: 'tools',
        label: 'Outils',
        icon: '🧰',
        content: (
          <div className="mg-refuge-tools-grid">
            <div className="mg-refuge-side-stat">
              <span className="mg-refuge-side-label">Humeur refuge</span>
              <strong>{avgMood}/100</strong>
            </div>
            <button
              className="mg-refuge-stable-btn"
              type="button"
              onClick={() => {
                setShowStable(true)
                setOpenDrawer(null)
              }}
            >
              <span aria-hidden>🏠</span>
              <span>Étables</span>
              <small>{pets.length} Myrions</small>
            </button>
            <button
              className="mg-refuge-stable-btn"
              type="button"
              onClick={() => {
                setShowCraft(true)
                setOpenDrawer(null)
              }}
            >
              <span aria-hidden>⚗️</span>
              <span>Atelier</span>
              <small>craft</small>
            </button>
            <button
              className="mg-refuge-stable-btn"
              type="button"
              onClick={() => {
                setShowNursery(true)
                setOpenDrawer(null)
              }}
            >
              <span aria-hidden>🥚</span>
              <span>Nid d&apos;Écho</span>
              <small>{echoEggs.length} œuf(s)</small>
            </button>
            {status === 'playing' ? (
              <button
                className="primary mg-big-btn mg-refuge-finish mg-refuge-finish-drawer"
                type="button"
                onClick={finishVisit}
              >
                Terminer la visite
              </button>
            ) : null}
          </div>
        ),
      },
    ]

    if (onLaunchMinigame) {
      drawers.push({
        id: 'capture',
        label: 'Chasse',
        icon: '🎯',
        content: (
          <MinigameSwitchPanel
            description="Explore les biomes, croise des Myrions sauvages et tente ta capture au bon moment."
            icon="🎯"
            launchLabel="Ouvrir la chasse"
            title="Chasse aux Myrions"
            onLaunch={() => onLaunchMinigame('farm-capture')}
          />
        ),
      })
    }

    return drawers
  }, [
    activePet,
    avgMood,
    activeBiomeId,
    carePoints,
    echoEggs.length,
    huntFavors.length,
    refugeProgress,
    refugeResources,
    bulkCare,
    carePanel,
    companionLinks,
    companionName,
    finishVisit,
    flash,
    onLaunchMinigame,
    pets.length,
    selectRefugeBiome,
    status,
  ])

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionMood="Sanctuaire vivant — douceur et soin."
      companionName={companionName}
      endless
      hideGlobalChrome
      maxScore={100}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={avgMood}
      scoreLabel="Humeur refuge"
      status={status}
    >
      <div className="mg-refuge mg-refuge-immersive mg-refuge-immersive--mobile">
        <div className="mg-refuge-layout">
          <div className="mg-refuge-body mg-hunt-layout">
            <HuntSideRail
              drawers={refugeDrawers}
              fabAriaLabel="Menu refuge"
              menuAriaLabel="Options du refuge"
              menuTitle="Refuge"
              openId={openDrawer}
              onCloseMinigame={onClose}
              onOpenChange={setOpenDrawer}
            />
            <div className="mg-hunt-main mg-refuge-enclosure-wrap">
              <SystemContextHint
                preferCompanionId={activity.companionId}
                systemId="refuge"
                variant="inline"
              />
              <div className="mg-refuge-enclosure-slot" ref={enclosureSlotRef}>
                <div
                  aria-label={`Enclos ${resourceDef.resourceName}`}
                  className={`mg-enclosure ${resourceDef.particleClass}`}
                  role="img"
                >
                  <EnclosureBackground
                    biomeId={activeBiomeId}
                    className="mg-enclosure-bg"
                    layout="auto"
                  />
                  <div aria-hidden className="mg-enclosure-particles" />
                  <div className="mg-enclosure-playfield" ref={playfieldRef}>

                    {wanderers.map((sprite) => {
                      const pet = enclosurePets.find((entry) => entry.id === sprite.id)
                      if (!pet) return null
                      const copies = speciesCopyCount(pets, pet.speciesId)
                      return (
                        <EnclosureChibi
                          key={sprite.id}
                          duplicateCount={copies > 1 ? copies : undefined}
                          rarity={pet.rarity}
                          selected={activePet?.speciesId === pet.speciesId}
                          sprite={sprite}
                          onSelect={() => selectEnclosurePet(pet.id)}
                        />
                      )
                    })}

                    {enclosurePets.length === 0 ? (
                      <p className="mg-enclosure-empty">
                        Aucun Myrion ici — va chasser dans ce biome pour peupler l enclos !
                      </p>
                    ) : null}
                  </div>
                </div>

                {showCarePopover && activePet && activeWanderer ? (
                  <RefugeCarePopover
                    affinityMult={affinityMult}
                    anchor={carePopoverAnchor}
                    biomePetCount={biomePets.length}
                    companionId={activity.companionId}
                    companionLinks={companionLinks}
                    companionName={companionName}
                    companionSupport={companionSupport}
                    isLinkedToActiveCompanion={isLinkedToActiveCompanion}
                    linkedMyrion={linkedMyrion}
                    pet={activePet}
                    refugePetCount={pets.length}
                    releaseConfirmPending={releaseConfirmPending}
                    siblingIndex={Math.max(0, siblingIndex)}
                    speciesCount={speciesCount}
                    speciesSiblingCount={speciesSiblings.length}
                    biomeSpeciesIndex={Math.max(0, biomeSpeciesIndex)}
                    biomeSpeciesCount={biomeSpeciesList.length}
                    onBulkCare={bulkCare}
                    onClose={() => setActivePetId('')}
                    onCuddle={cuddle}
                    onCycleBiomePet={cycleBiomePet}
                    onCycleDuplicate={cycleDuplicate}
                    onFeed={feed}
                    onObserve={observe}
                    onPlay={play}
                    onReleaseClick={handleReleaseClick}
                    onToggleCompanionLink={toggleCompanionLink}
                  />
                ) : null}
              </div>
            </div>

          </div>
        </div>

        {showStable ? (
          <div
            className="mg-refuge-stable-overlay"
            role="presentation"
            onClick={() => setShowStable(false)}
          >
            <div
              aria-labelledby="mg-refuge-stable-title"
              aria-modal="true"
              className="mg-refuge-stable"
              role="dialog"
              onClick={(event) => event.stopPropagation()}
            >
              <header className="mg-refuge-stable-head">
                <div>
                  <p className="eyebrow">Collection</p>
                  <h3 id="mg-refuge-stable-title">Étables du refuge</h3>
                </div>
                <button className="secondary" type="button" onClick={() => setShowStable(false)}>
                  Fermer
                </button>
              </header>
              <p className="mg-refuge-stable-copy">
                Tous tes Myrions capturés, y compris les doublons. L enclos n affiche qu un chibi
                par espèce.
              </p>
              {pets.length === 0 ? (
                <p className="mg-refuge-stable-empty">Aucun Myrion pour l instant.</p>
              ) : (
                BIOMES.map((biome) => {
                  const stablePets = pets.filter(
                    (pet) => normalizeRefugeBiomeId(pet.biomeId) === biome.id,
                  )
                  if (stablePets.length === 0) return null
                  const representatives = new Set(
                    pickEnclosureRepresentatives(stablePets).map((pet) => pet.id),
                  )
                  return (
                    <section className="mg-refuge-stable-section" key={biome.id}>
                      <h4>
                        {biome.emoji} {biome.name}{' '}
                        <small>
                          {uniqueSpeciesCount(stablePets)} espèces · {stablePets.length} total
                        </small>
                      </h4>
                      <ul className="mg-refuge-stable-list">
                        {stablePets.map((pet) => {
                          const copies = speciesCopyCount(pets, pet.speciesId)
                          const copyIndex =
                            pets
                              .filter((entry) => entry.speciesId === pet.speciesId)
                              .findIndex((entry) => entry.id === pet.id) + 1
                          return (
                            <li key={pet.id}>
                              <button
                                className={`mg-refuge-stable-row ${activePet?.id === pet.id ? 'active' : ''}`}
                                type="button"
                                onClick={() => selectPetFromStable(pet.id)}
                              >
                                <PalmonSprite
                                  className="mg-refuge-stable-thumb"
                                  emoji={pet.emoji}
                                  name={pet.name}
                                  size="chibi"
                                  speciesId={pet.speciesId}
                                />
                                <span className="mg-refuge-stable-meta">
                                  <strong>{pet.name}</strong>
                                  <span>
                                    {pet.rarity}
                                    {pet.isShiny ? ' · ✨ shiny' : ''}
                                    {copies > 1 ? ` · #${copyIndex}/${copies}` : ''}
                                    {representatives.has(pet.id) ? ' · en enclos' : ''}
                                  </span>
                                </span>
                                <span className="mg-refuge-stable-meters">
                                  <span>🍎 {Math.round(pet.hunger)}</span>
                                  <span>💜 {Math.round(pet.joy)}</span>
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </section>
                  )
                })
              )}
            </div>
          </div>
        ) : null}

        {showNursery ? (
          <EchoNursery
            echoEggs={echoEggs}
            pets={pets}
            refugeResources={refugeResources}
            onClose={() => setShowNursery(false)}
            onEggCare={handleEggCare}
            onHatch={handleHatch}
            onStartBreeding={handleStartBreeding}
          />
        ) : null}

        {showCraft ? (
          <RefugeCraftPanel
            activeBiomeId={activeBiomeId}
            activePetId={activePetId}
            echoEggs={echoEggs}
            huntFavors={huntFavors}
            pets={pets}
            refugeResources={refugeResources}
            onClose={() => setShowCraft(false)}
            onCraft={handleCraftResult}
          />
        ) : null}

        {pendingHatch ? (
          <CaptureComparePanel
            pet={pendingHatch.pet}
            result={pendingHatch.comparison}
            onClose={() => {
              if (!pendingHatch.comparison.overflowRequired) setPendingHatch(null)
            }}
            onReleaseNew={handleReleaseHatched}
            onReplaceWeakest={handleReplaceWeakestHatch}
          />
        ) : null}
      </div>
    </MinigameFrame>
  )
}
