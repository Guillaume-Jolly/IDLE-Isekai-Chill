import { useEffect, useMemo, useState } from 'react'
import type { PetState } from '../../data/minigameSave'
import type { MyrionWorksiteSave, WorksiteBiomeId } from '../../data/myrionWorksite'
import { getSpotsForBiome } from '../../data/myrionWorksite'
import { getWorksiteDecorationVisual } from '../../data/myrionWorksiteVisuals'
import {
  WORKSITE_LIFE_BUCKET_SEC,
  buildWorksiteLifeView,
  getLifeTimeBucket,
  lifeEntryAnchor,
  shortMyrionName,
} from '../../data/myrionWorksiteLife'
import { WorksiteOptionalImage } from './WorksiteVisuals'

type WorksiteMyrionLifeLayerProps = {
  worksite: MyrionWorksiteSave
  activeBiomeId: WorksiteBiomeId
  pets: PetState[]
}

export function WorksiteMyrionLifeLayer({
  worksite,
  activeBiomeId,
  pets,
}: WorksiteMyrionLifeLayerProps) {
  const [lifeBucket, setLifeBucket] = useState(() => getLifeTimeBucket())
  const spotCount = getSpotsForBiome(activeBiomeId).length

  useEffect(() => {
    const syncBucket = () => setLifeBucket(getLifeTimeBucket())
    const timer = window.setInterval(syncBucket, WORKSITE_LIFE_BUCKET_SEC * 1000)
    return () => window.clearInterval(timer)
  }, [])

  const lifeView = useMemo(
    () => buildWorksiteLifeView(worksite, activeBiomeId, pets, lifeBucket),
    [worksite, activeBiomeId, pets, lifeBucket],
  )

  if (lifeView.totalAssigned === 0) return null

  const restVisual = getWorksiteDecorationVisual('rest-zone')
  const foodVisual = getWorksiteDecorationVisual('food-zone')

  return (
    <div aria-hidden className="mg-worksite-life-layer">
      <div className="mg-worksite-life-zone mg-worksite-rest-zone" title="Coin repos">
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
      <div className="mg-worksite-life-zone mg-worksite-food-zone" title="Coin nourriture">
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

      {lifeView.visible.map((entry) => {
        const anchor = lifeEntryAnchor(entry, spotCount)
        return (
          <div
            className={`mg-worksite-myrion-worker mg-worksite-myrion-state mg-worksite-myrion-${entry.state}`}
            key={entry.pet.id}
            style={{ left: anchor.left, bottom: anchor.bottom }}
            title={`${entry.pet.name} — ${entry.state}`}
          >
            <span className="mg-worksite-myrion-avatar">{entry.pet.emoji}</span>
            <span className="mg-worksite-myrion-shortname">{shortMyrionName(entry.pet.name)}</span>
            {entry.state === 'sleeping' ? (
              <span className="mg-worksite-myrion-zzz" aria-hidden>
                Zzz
              </span>
            ) : null}
            {entry.state === 'eating' ? (
              <span className="mg-worksite-myrion-snack" aria-hidden>
                🥣
              </span>
            ) : null}
          </div>
        )
      })}

      {lifeView.overflow > 0 ? (
        <span className="mg-worksite-myrion-overflow">+{lifeView.overflow}</span>
      ) : null}
    </div>
  )
}
