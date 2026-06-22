import type { CSSProperties } from 'react'
import { useState } from 'react'
import type { VillageBuildingInfo } from './VillageBuildingTooltip'
import { VillageBuildingTooltip } from './VillageBuildingTooltip'

export type MapTargetView =
  | 'village'
  | 'buildings'
  | 'quests'
  | 'miniGames'
  | 'event'
  | 'inventory'
  | 'companions'
  | 'gallery'

export type MapLabelSpot = {
  id: string
  buildingId: string
  x: number
  y: number
  hint: string
  targetView: MapTargetView
}

type VillageMapLabelsProps = {
  spots: MapLabelSpot[]
  activeBuildingId: string
  lockedIds: Set<string>
  levels: Record<string, number>
  buildingTiers?: Record<string, number>
  shortNames: Record<string, string>
  buildingInfos: Record<string, VillageBuildingInfo>
  onSelect: (spot: MapLabelSpot, locked: boolean) => void
}

export function VillageMapLabels({
  spots,
  activeBuildingId,
  lockedIds,
  levels,
  buildingTiers = {},
  shortNames,
  buildingInfos,
  onSelect,
}: VillageMapLabelsProps) {
  const [hoveredBuildingId, setHoveredBuildingId] = useState<string | null>(null)

  return (
    <div className="map-labels">
      {spots.map((spot) => {
        const locked = lockedIds.has(spot.buildingId)
        const active = activeBuildingId === spot.buildingId
        const hovered = hoveredBuildingId === spot.buildingId
        const shortName = shortNames[spot.buildingId] ?? spot.buildingId
        const level = levels[spot.buildingId] ?? 1
        const tier = buildingTiers[spot.buildingId] ?? 1
        const info = buildingInfos[spot.buildingId]

        return (
          <div
            className="map-label-wrap"
            key={spot.id}
            style={{ '--lx': `${spot.x}%`, '--ly': `${spot.y}%` } as CSSProperties}
          >
            <button
              aria-label={`${shortName} niveau ${level}`}
              className={`map-label map-label--tier-${tier} ${active ? 'active' : ''} ${locked ? 'locked' : ''} ${hovered ? 'hovered' : ''}`}
              type="button"
              onClick={() => onSelect(spot, locked)}
              onMouseEnter={() => setHoveredBuildingId(spot.buildingId)}
              onMouseLeave={() => setHoveredBuildingId(null)}
              onFocus={() => setHoveredBuildingId(spot.buildingId)}
              onBlur={() => setHoveredBuildingId(null)}
            >
              <span className="map-label-title">
                {shortName} <span className="map-label-level">niv. {level}</span>
              </span>
            </button>
            {hovered && info ? (
              <VillageBuildingTooltip
                building={info}
                level={level}
                locked={locked}
                style={{ left: '50%', top: 'calc(100% + 8px)' }}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
