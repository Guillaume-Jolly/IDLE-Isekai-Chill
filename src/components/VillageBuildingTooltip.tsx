export type VillageBuildingInfo = {
  id: string
  name: string
  role: string
  production: string
}

type VillageBuildingTooltipProps = {
  building: VillageBuildingInfo
  level: number
  locked: boolean
  style: { left: string; top: string }
}

export function VillageBuildingTooltip({
  building,
  level,
  locked,
  style,
}: VillageBuildingTooltipProps) {
  return (
    <div className="panorama-building-tooltip" role="tooltip" style={style}>
      <p className="panorama-building-tooltip__title">
        {building.name}
        <span className="panorama-building-tooltip__level">niv. {level}</span>
      </p>
      <p className="panorama-building-tooltip__role">{building.role}</p>
      <p className="panorama-building-tooltip__prod">
        {locked ? 'Batiment verrouille' : `Production : ${building.production}`}
      </p>
    </div>
  )
}
