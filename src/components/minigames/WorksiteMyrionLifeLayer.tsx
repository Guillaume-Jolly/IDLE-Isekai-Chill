import { useEffect, useMemo, useState } from 'react'
import type { PetState } from '../../data/minigameSave'
import { getSpotsForBiome, type MyrionWorksiteSave, type WorksiteBiomeId } from '../../data/myrionWorksite'
import { isWorksiteSpotUnlocked } from '../../data/myrionWorksiteProgression'
import { getWorksiteDecorationVisual } from '../../data/myrionWorksiteVisuals'
import {
  WORKSITE_FIELD_BOUNDS,
  WORKSITE_LIFE_BUCKET_SEC,
  buildWorksiteBiomeLifePlan,
  getLifeTimeBucket,
  worksiteSpotObstacles,
  type WorksiteSpeciesLifeRep,
} from '../../data/myrionWorksiteLife'
import { useEnclosureWanderers } from '../../hooks/useEnclosureWanderers'
import { WorksiteLifeChibi } from './WorksiteLifeChibi'
import { WorksiteOptionalImage } from './WorksiteVisuals'

type WorksiteMyrionLifeLayerProps = {
  worksite: MyrionWorksiteSave
  activeBiomeId: WorksiteBiomeId
  pets: PetState[]
}

function toWanderInput(rep: WorksiteSpeciesLifeRep) {
  const pet = rep.representative
  return {
    id: pet.speciesId,
    speciesId: pet.speciesId,
    name: pet.name,
    emoji: pet.emoji,
  }
}

export function WorksiteMyrionLifeLayer({
  worksite,
  activeBiomeId,
  pets,
}: WorksiteMyrionLifeLayerProps) {
  const [lifeBucket, setLifeBucket] = useState(() => getLifeTimeBucket())

  useEffect(() => {
    const syncBucket = () => setLifeBucket(getLifeTimeBucket())
    const timer = window.setInterval(syncBucket, WORKSITE_LIFE_BUCKET_SEC * 1000)
    return () => window.clearInterval(timer)
  }, [])

  const lifePlan = useMemo(
    () => buildWorksiteBiomeLifePlan(worksite, activeBiomeId, pets, lifeBucket),
    [worksite, activeBiomeId, pets, lifeBucket],
  )

  const unlockedSpotCount = useMemo(
    () =>
      getSpotsForBiome(activeBiomeId).filter((spot) =>
        isWorksiteSpotUnlocked(worksite, activeBiomeId, spot.id),
      ).length,
    [worksite, activeBiomeId],
  )

  const spotObstacles = useMemo(
    () => worksiteSpotObstacles(unlockedSpotCount),
    [unlockedSpotCount],
  )

  const wanderInputs = useMemo(
    () => lifePlan.representatives.map(toWanderInput),
    [lifePlan.representatives],
  )

  const { wanderers } = useEnclosureWanderers(wanderInputs, WORKSITE_FIELD_BOUNDS, spotObstacles)

  if (lifePlan.totalAssigned === 0) return null

  const restVisual = getWorksiteDecorationVisual('rest-zone')
  const foodVisual = getWorksiteDecorationVisual('food-zone')

  return (
    <div aria-hidden className="mg-worksite-life-layer">
      <div aria-hidden className="mg-worksite-life-zone mg-worksite-rest-zone mg-worksite-life-zone--decor">
        <WorksiteOptionalImage
          alt=""
          aria-hidden
          asset={restVisual.asset}
          className="mg-worksite-life-zone-img"
        />
        <span className="mg-worksite-life-zone-emoji" aria-hidden>
          {restVisual.fallbackEmoji}
        </span>
        <span className="mg-worksite-life-zone-label">Repos</span>
      </div>
      <div aria-hidden className="mg-worksite-life-zone mg-worksite-food-zone mg-worksite-life-zone--decor">
        <WorksiteOptionalImage
          alt=""
          aria-hidden
          asset={foodVisual.asset}
          className="mg-worksite-life-zone-img"
        />
        <span className="mg-worksite-life-zone-emoji" aria-hidden>
          {foodVisual.fallbackEmoji}
        </span>
        <span className="mg-worksite-life-zone-label">Repas</span>
      </div>
      <div className="mg-worksite-life-playfield mg-worksite-field-playfield">
        {wanderers.map((sprite) => {
          const rep = lifePlan.representatives.find((entry) => entry.speciesId === sprite.speciesId)
          if (!rep) return null
          return (
            <WorksiteLifeChibi
              key={sprite.id}
              rarity={rep.representative.rarity}
              sprite={sprite}
              state={rep.state}
            />
          )
        })}
      </div>
      {lifePlan.hiddenAssigned > 0 ? (
        <span className="mg-worksite-myrion-overflow">+{lifePlan.hiddenAssigned}</span>
      ) : null}
    </div>
  )
}
