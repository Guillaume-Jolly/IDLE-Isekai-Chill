import {
  formatCompanionSupportSystems,
  getCompanionSupportProfile,
} from '../data/companionSupport'

type CompanionGameplaySupportProps = {
  companionId: string
}

export function CompanionGameplaySupport({ companionId }: CompanionGameplaySupportProps) {
  const profile = getCompanionSupportProfile(companionId)
  if (!profile || profile.systems.length === 0) return null

  return (
    <p className="companion-gameplay-support">
      <span className="companion-gameplay-support-label">Affinités gameplay :</span>{' '}
      {formatCompanionSupportSystems(profile.systems)}
    </p>
  )
}
