import type { BuildingActivity } from '../../data/buildingActivities'
import { pickCompanionSupportForSystem } from '../../data/companionSupport'

type WorksiteCompanionSupportProps = {
  activity: BuildingActivity
  companionAffinity?: number
}

export function WorksiteCompanionSupport({
  activity,
  companionAffinity,
}: WorksiteCompanionSupportProps) {
  const pick = pickCompanionSupportForSystem('moon-farm', {
    preferCompanionId: activity.companionId,
    preferAffinity: companionAffinity,
  })

  if (!pick) return null

  const { profile, badge } = pick

  return (
    <aside className="mg-worksite-companion-support" aria-label="Conseil compagnon">
      <p className="mg-worksite-companion-support-kicker">
        <span className="mg-worksite-companion-support-badge">{badge}</span>
      </p>
      <p className="mg-worksite-companion-support-name">{profile.displayName}</p>
      <p className="mg-worksite-companion-support-line">{profile.supportLine}</p>
      <p className="mg-worksite-companion-support-role">{profile.roleLine}</p>
    </aside>
  )
}
