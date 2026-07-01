import type { WorksiteBiomeId } from '../../data/myrionWorksiteDefs'
import { listWorksitePlacementSlotsForBiome, resolveWorksiteSpotPlacement } from '../../data/myrionWorksitePlacement'
import { getRuntimeSpotMeta } from '../../data/myrionWorksiteBiomeRuntime'
import type { WorksiteSpotId } from '../../data/myrionWorksiteDefs'

type WorksitePlacementDebugProps = {
  biomeId: WorksiteBiomeId
  spotIds: readonly WorksiteSpotId[]
  mobile: boolean
}

/** Overlay dev-only — slots catalogue + filons actifs (repère panorama). */
export function WorksitePlacementDebug({ biomeId, spotIds, mobile }: WorksitePlacementDebugProps) {
  const slots = listWorksitePlacementSlotsForBiome(biomeId)

  return (
    <div className="mg-worksite-placement-debug" aria-hidden>
      {slots.map((slot) => {
        const x = mobile ? slot.mobileXPercent ?? slot.xPercent : slot.xPercent
        const y = mobile ? slot.mobileYPercent ?? slot.yPercent : slot.yPercent
        return (
          <span
            key={slot.id}
            className="mg-worksite-placement-debug-slot"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {slot.id}
          </span>
        )
      })}
      {spotIds.map((spotId) => {
        const placement = resolveWorksiteSpotPlacement(biomeId, spotId, mobile)
        const meta = getRuntimeSpotMeta(biomeId, spotId)
        if (!placement || !meta) return null
        return (
          <span
            key={spotId}
            className="mg-worksite-placement-debug-spot"
            style={{ left: `${placement.leftPercent}%`, top: `${placement.topPercent}%` }}
          >
            {meta.displayName}
            <small>
              {placement.leftPercent.toFixed(0)}%, {placement.topPercent.toFixed(0)}%
            </small>
          </span>
        )
      })}
    </div>
  )
}
