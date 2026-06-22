import { useCallback, useEffect, useMemo, useState } from 'react'
import { scaleReward } from '../../data/buildingActivities'
import {
  BIOME_RESOURCES,
  ENCLOSURE_BOUNDS,
  MAX_SPECIES_COPIES,
  estimateDailyProduction,
  getBiomeCollectionStatus,
  enclosureAssetPath,
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
  SUPPORT_STAT_LABELS,
  TRAIT_LABELS,
  companionAffinityMultiplier,
  computeCompanionBuffTotal,
  maybeGrantRefugeFavor,
  type CaptureCompareResult,
  type HuntFavor,
} from '../../data/myrionMvp2'
import {
  findCompanionForMyrion,
  getLinkedMyrion,
  linkMyrionToCompanion,
  describeInactiveBuffs,
  describeLinkedBuffs,
  removeCompanionLinksForPet,
  rarityLinkLabel,
  unlinkCompanionMyrion,
} from '../../data/myrionCompanionLinks'
import { applyReleaseRewards } from '../../data/myrionRelease'
import {
  effectiveSupportBuffs,
  maxSupportBuffSlots,
} from '../../data/myrionMvp2'
import { BREED_RESOURCE_COST } from '../../data/myrionMvp3'
import { type CraftResult } from '../../data/myrionCraft'
import { formatVisualVariant } from '../../data/myrionVariants'
import { useEnclosureWanderers } from '../../hooks/useEnclosureWanderers'
import { BIOMES } from '../../data/wildFamiliars'
import { CaptureComparePanel } from './CaptureComparePanel'
import { EchoNursery } from './EchoNursery'
import { EnclosureChibi } from './EnclosureChibi'
import { MyrionDebugPanel } from './MyrionDebugPanel'
import { MinigameFrame, type MinigameProps } from './MinigameFrame'
import { PalmonSprite } from './PalmonSprite'
import { RefugeCraftPanel } from './RefugeCraftPanel'

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
  const [flash, setFlash] = useState(`${companionName} t accueille au refuge.`)

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
  const { wanderers, flashBubble } = useEnclosureWanderers(wanderInputs, bounds)

  const activePet = pets.find((pet) => pet.id === activePetId) ?? biomePets[0]
  const speciesSiblings = useMemo(
    () => (activePet ? pets.filter((pet) => pet.speciesId === activePet.speciesId) : []),
    [activePet, pets],
  )
  const siblingIndex = activePet
    ? speciesSiblings.findIndex((pet) => pet.id === activePet.id)
    : -1
  const resourceDef = BIOME_RESOURCES[activeBiomeId]
  const resourceAmount = refugeResources[activeBiomeId]?.amount ?? 0
  const biomeFavorBonus = refugeProgress.biomeFavors?.[activeBiomeId] ?? 0
  const collectionStatus = useMemo(
    () => getBiomeCollectionStatus(pets, activeBiomeId),
    [activeBiomeId, pets],
  )
  const dailyProduction = estimateDailyProduction(
    pets,
    activeBiomeId,
    biomeFavorBonus,
    collectionStatus.collectionBonusPercent,
  )

  useEffect(() => {
    if (!minigameSave) return
    setPets(refreshPetsOnVisit(minigameSave.pets))
    setEchoEggs(minigameSave.echoEggs ?? [])
    setActivePetId('')
  }, [minigameSave?.saveVersion, minigameSave?.pets.length])

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
    const patched = { ...activePet, hunger: activePet.hunger + 22, joy: activePet.joy + 6 }
    updatePet(activePet.id, { hunger: patched.hunger, joy: patched.joy })
    flashBubble(activePet.id, 'star')
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
    const patched = { ...activePet, joy: activePet.joy + 24, energy: activePet.energy - 12 }
    updatePet(activePet.id, { joy: patched.joy, energy: patched.energy })
    flashBubble(activePet.id, 'surprised', 900)
    window.setTimeout(() => flashBubble(activePet.id, 'star'), 400)
    if (!grantCareFavor(patched, 'play')) {
      setFlash(`${activePet.name} court joyeusement !`)
    }
  }

  const cuddle = () => {
    if (!activePet) return
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
    flashBubble(activePet.id, 'heart', 2200)
    if (!grantCareFavor(patched, 'cuddle')) {
      setFlash(`Câlin réussi — ${activePet.name} ronronne doucement.`)
    }
  }

  const observe = () => {
    if (!activePet) return
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
    setFlash(`${activePet.name} retourne à la nature — ${rewards.summary}.`)
  }

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

  const cycleDuplicate = (delta: number) => {
    if (!activePet || speciesSiblings.length <= 1) return
    const index = speciesSiblings.findIndex((pet) => pet.id === activePet.id)
    const next =
      speciesSiblings[(index + delta + speciesSiblings.length) % speciesSiblings.length]
    setActivePetId(next.id)
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

  const petCard = activePet ? (
    <div className="mg-refuge-pet-card">
      <div className="mg-refuge-pet-head">
        <strong>
          {activePet.name}
          {activePet.isShiny ? ' ✨' : ''}
          {activePet.visualVariant ? ` · ${formatVisualVariant(activePet.visualVariant)}` : ''}
        </strong>
        <span>
          {activePet.rarity} · {speciesCount}/{MAX_SPECIES_COPIES} exemplaires
        </span>
      </div>
      {activePet.personality || activePet.traits?.length ? (
        <p className="mg-refuge-meta-line">
          {activePet.personality ?? ''}
          {activePet.traits?.length
            ? `${activePet.personality ? ' · ' : ''}${activePet.traits.map((trait) => TRAIT_LABELS[trait] ?? trait).join(', ')}`
            : ''}
        </p>
      ) : null}
      {activePet.supportBuffs && activePet.supportBuffs.length > 0 ? (
        <p className="mg-refuge-meta-line">
          Buffs actifs ({effectiveSupportBuffs(activePet).length}/{maxSupportBuffSlots(activePet)}) :{' '}
          {effectiveSupportBuffs(activePet)
            .map((buff) => `${SUPPORT_STAT_LABELS[buff.stat]} +${buff.value}`)
            .join(' · ')}
        </p>
      ) : null}
      {describeInactiveBuffs(activePet) ? (
        <p className="mg-refuge-meta-line warn">{describeInactiveBuffs(activePet)}</p>
      ) : null}
      <p className="mg-refuge-meta-line">
        Soutien {companionName} : +{companionSupport.toFixed(1)} (×{affinityMult.toFixed(2)})
        {linkedMyrion ? ` · lié : ${linkedMyrion.name}` : ''}
      </p>
      {isLinkedToActiveCompanion ? (
        <p className="mg-refuge-meta-line">{describeLinkedBuffs(activePet, activity.companionId)}</p>
      ) : null}
      <p className="mg-refuge-meta-line">
        Liaison compagnon : {rarityLinkLabel(activePet.rarity)}
        {findCompanionForMyrion(companionLinks, activePet.id)
          ? ` · déjà lié ailleurs`
          : ''}
      </p>
      <button className="secondary mg-refuge-link-btn" type="button" onClick={toggleCompanionLink}>
        {isLinkedToActiveCompanion
          ? `Délier de ${companionName}`
          : `Lier à ${companionName}`}
      </button>
      <p className="mg-refuge-meta-line">
        Lignée {activePet.lineagePotential ?? 0}/100 · Gen. {activePet.generation ?? 0}
        {activePet.lrBlessing ? ' · Bénédiction LR' : ''}
      </p>
      {speciesCount > 1 ? (
        <div className="mg-refuge-duplicate-nav">
          <button aria-label="Exemplaire précédent" type="button" onClick={() => cycleDuplicate(-1)}>
            ‹
          </button>
          <span>
            Exemplaire {siblingIndex + 1}/{speciesCount}
          </span>
          <button aria-label="Exemplaire suivant" type="button" onClick={() => cycleDuplicate(1)}>
            ›
          </button>
        </div>
      ) : null}
      <div className="mg-pet-meters">
        <label>
          Faim
          <progress max={100} value={activePet.hunger} />
        </label>
        <label>
          Humeur
          <progress max={100} value={activePet.joy} />
        </label>
        <label>
          Énergie
          <progress max={100} value={activePet.energy} />
        </label>
        <label>
          Affection
          <progress max={5} value={activePet.affectionLevel} />
        </label>
      </div>
      <div className="mg-pet-actions">
        <button type="button" onClick={feed}>
          🍎 Nourrir
        </button>
        <button type="button" onClick={cuddle}>
          💜 Câliner
        </button>
        <button type="button" onClick={play}>
          🎾 Jouer
        </button>
        <button type="button" onClick={observe}>
          👀 Observer
        </button>
        {speciesCount > 1 ? (
          <button
            className={speciesCount > MAX_SPECIES_COPIES ? 'warn' : ''}
            type="button"
            onClick={releasePet}
          >
            🕊️ Relâcher
          </button>
        ) : null}
      </div>
    </div>
  ) : null

  const biomeTabs = (
    <div className="mg-refuge-biome-tabs" role="tablist">
      {BIOMES.map((biome) => {
        const inBiome = pets.filter((pet) => normalizeRefugeBiomeId(pet.biomeId) === biome.id)
        const count = inBiome.length
        const species = uniqueSpeciesCount(inBiome)
        return (
          <button
            aria-selected={activeBiomeId === biome.id}
            className={`mg-refuge-tab ${activeBiomeId === biome.id ? 'active' : ''}`}
            key={biome.id}
            role="tab"
            type="button"
            onClick={() => {
              setActiveBiomeId(biome.id as RefugeBiomeId)
              setActivePetId('')
            }}
          >
            <span aria-hidden>{biome.emoji}</span>
            <span>{biome.name.split(' ')[0]}</span>
            <small>{count > species ? `${species}·${count}` : count}</small>
          </button>
        )
      })}
    </div>
  )

  const resourceBar = (
    <div className="mg-refuge-resource-bar">
      <span>
        {resourceDef.resourceEmoji} {resourceDef.resourceName} : {resourceAmount}
      </span>
              <span>+{dailyProduction}/jour</span>
              <span>
                Collection {collectionStatus.normalOwned}/{collectionStatus.totalSpecies}
                {collectionStatus.shinyComplete
                  ? ' · shiny +30%'
                  : collectionStatus.normalComplete
                    ? ' · +10%'
                    : ''}
                {' · '}
                Shiny {collectionStatus.shinyOwned}/{collectionStatus.totalSpecies}
              </span>
              <span>Soins {carePoints}</span>
              <span>Faveurs chasse {huntFavors.length}</span>
              {biomeFavorBonus > 0 ? <span>Faveur biome +{biomeFavorBonus}</span> : null}
    </div>
  )

  return (
    <MinigameFrame
      activity={activity}
      buildingName={buildingName}
      companionInScene
      companionMood="Sanctuaire vivant — douceur et soin."
      companionName={companionName}
      endless
      maxScore={100}
      onClose={onClose}
      onRestart={restart}
      resourceLabel={resourceLabel}
      score={avgMood}
      scoreLabel="Humeur refuge"
      status={status}
    >
      <div className="mg-refuge mg-refuge-immersive">
        <div className="mg-refuge-layout">
          <div className="mg-refuge-body">
            <div className="mg-refuge-enclosure-wrap">
              <div className="mg-refuge-enclosure-slot">
                <div
                  aria-label={`Enclos ${resourceDef.resourceName}`}
                  className={`mg-enclosure ${resourceDef.particleClass}`}
                  role="img"
                >
                  <img
                    alt=""
                    className="mg-enclosure-bg"
                    draggable={false}
                    src={enclosureAssetPath(activeBiomeId)}
                  />
                  <div className="mg-enclosure-playfield" />
                  <div aria-hidden className="mg-enclosure-particles" />

                  {wanderers.map((sprite) => {
                    const pet = enclosurePets.find((entry) => entry.id === sprite.id)
                    if (!pet) return null
                    const copies = speciesCopyCount(pets, pet.speciesId)
                    return (
                      <EnclosureChibi
                        key={sprite.id}
                        duplicateCount={copies > 1 ? copies : undefined}
                        rarity={pet.rarity}
                        selected={
                          activePet?.speciesId === pet.speciesId &&
                          normalizeRefugeBiomeId(activePet.biomeId) === activeBiomeId
                        }
                        sprite={sprite}
                        onSelect={() => setActivePetId(pet.id)}
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
            </div>

            <aside className="mg-refuge-ui-rail">
              <p className="mg-flash mg-refuge-flash">{flash}</p>
              {biomeTabs}
              {resourceBar}
              <div className="mg-refuge-side-stat">
                <span className="mg-refuge-side-label">Humeur refuge</span>
                <strong>{avgMood}/100</strong>
              </div>
              <button
                className="mg-refuge-stable-btn"
                type="button"
                onClick={() => setShowStable(true)}
              >
                <span aria-hidden>🏠</span>
                <span>Étables</span>
                <small>{pets.length} Myrions</small>
              </button>
              <button
                className="mg-refuge-stable-btn"
                type="button"
                onClick={() => setShowCraft(true)}
              >
                <span aria-hidden>⚗️</span>
                <span>Atelier</span>
                <small>craft</small>
              </button>
              <button
                className="mg-refuge-stable-btn"
                type="button"
                onClick={() => setShowNursery(true)}
              >
                <span aria-hidden>🥚</span>
                <span>Nid d&apos;Écho</span>
                <small>{echoEggs.length} œuf(s)</small>
              </button>
              <MyrionDebugPanel
                activeBiomeId={activeBiomeId}
                pets={pets}
                onClearAll={() => {
                  setEchoEggs([])
                  setActivePetId('')
                }}
                onFlash={setFlash}
                onHuntFavorsChange={setHuntFavors}
                onPetsChange={setPets}
                onRefugeProgressChange={(patch) =>
                  setRefugeProgress((current) => ({ ...current, ...patch }))
                }
              />
              <div className="mg-refuge-rail-pet">{petCard}</div>
              {status === 'playing' ? (
                <button
                  className="primary mg-big-btn mg-refuge-finish mg-refuge-finish-rail"
                  type="button"
                  onClick={finishVisit}
                >
                  Terminer la visite
                </button>
              ) : null}
            </aside>
          </div>

          <footer className="mg-refuge-fill mg-refuge-fill-bottom">
            <div className="mg-refuge-fill-bottom-inner">
              <p className="mg-flash mg-refuge-flash mg-refuge-flash-mobile">{flash}</p>
              <div className="mg-refuge-mobile-controls">
                {biomeTabs}
                {resourceBar}
                <button className="mg-refuge-stable-link" type="button" onClick={() => setShowStable(true)}>
                  🏠 Étables ({pets.length})
                </button>
              </div>
              <MyrionDebugPanel
                activeBiomeId={activeBiomeId}
                pets={pets}
                onClearAll={() => {
                  setEchoEggs([])
                  setActivePetId('')
                }}
                onFlash={setFlash}
                onHuntFavorsChange={setHuntFavors}
                onPetsChange={setPets}
                onRefugeProgressChange={(patch) =>
                  setRefugeProgress((current) => ({ ...current, ...patch }))
                }
              />
              <div className="mg-refuge-pet-card-mobile">{petCard}</div>
              {status === 'playing' ? (
                <button className="primary mg-big-btn mg-refuge-finish" type="button" onClick={finishVisit}>
                  Terminer la visite
                </button>
              ) : null}
            </div>
          </footer>
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
