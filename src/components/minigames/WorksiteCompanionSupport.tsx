import type { BuildingActivity } from '../../data/buildingActivities'
import { SystemContextHint } from '../SystemContextHint'

type WorksiteCompanionSupportProps = {
  activity: BuildingActivity
  companionAffinity?: number
}

export function WorksiteCompanionSupport({
  activity,
  companionAffinity,
}: WorksiteCompanionSupportProps) {
  return (
    <SystemContextHint
      preferAffinity={companionAffinity}
      preferCompanionId={activity.companionId}
      systemId="moon-farm"
      variant="overlay"
      defaultCollapsed={false}
    />
  )
}
