import type { CSSProperties } from 'react'

export type MapTargetView =
  | 'village'
  | 'buildings'
  | 'miniGames'
  | 'event'
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
  shortNames: Record<string, string>
  onSelect: (spot: MapLabelSpot, locked: boolean) => void
}

export function VillageMapLabels({
  spots,
  activeBuildingId,
  lockedIds,
  levels,
  shortNames,
  onSelect,
}: VillageMapLabelsProps) {
  return (
    <div className="map-labels">
      {spots.map((spot) => {
        const locked = lockedIds.has(spot.buildingId)
        const active = activeBuildingId === spot.buildingId
        const shortName = shortNames[spot.buildingId] ?? spot.buildingId
        const level = levels[spot.buildingId] ?? 1

        return (
          <button
            aria-label={`${shortName} niveau ${level}`}
            className={`map-label ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
            key={spot.id}
            style={{ '--lx': `${spot.x}%`, '--ly': `${spot.y}%` } as CSSProperties}
            type="button"
            onClick={() => onSelect(spot, locked)}
          >
            <span className="map-label-title">
              {shortName} <span className="map-label-level">niv. {level}</span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
