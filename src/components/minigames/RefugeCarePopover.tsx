import type { PetState } from '../../data/minigameSave'
import type { CarePopoverAnchor } from '../../hooks/useRefugeCarePopoverAnchor'
import { RefugeCarePanel, type BulkCareScope } from './RefugeCarePanel'

type RefugeCarePopoverProps = {
  affinityMult: number
  anchor: CarePopoverAnchor
  biomePetCount: number
  companionId: string
  companionLinks: Partial<Record<string, string>>
  companionName: string
  companionSupport: number
  isLinkedToActiveCompanion: boolean
  linkedMyrion?: PetState
  pet: PetState
  refugePetCount: number
  releaseConfirmPending: boolean
  siblingIndex: number
  speciesCount: number
  speciesSiblingCount: number
  biomeSpeciesIndex: number
  biomeSpeciesCount: number
  onBulkCare: (scope: BulkCareScope) => void
  onClose: () => void
  onCuddle: () => void
  onCycleBiomePet: (delta: number) => void
  onCycleDuplicate: (delta: number) => void
  onFeed: () => void
  onObserve: () => void
  onPlay: () => void
  onReleaseClick: () => void
  onToggleCompanionLink: () => void
}

export function RefugeCarePopover(props: RefugeCarePopoverProps) {
  const { anchor, onClose, ...panelProps } = props

  return (
    <div
      aria-labelledby={`mg-refuge-care-title-${props.pet.id}`}
      aria-modal="false"
      className={`mg-refuge-care-popover mg-refuge-care-popover--${anchor}`}
      role="dialog"
      onClick={(event) => event.stopPropagation()}
    >
      <RefugeCarePanel {...panelProps} variant="popover" onClose={onClose} />
    </div>
  )
}
