import type { ResourceKey } from '../data/resources'
import { RESOURCE_ICONS } from '../data/resources'

const GLYPH_ICONS = new Set<ResourceKey>(['coins', 'wood', 'stone'])

type ResourceIconProps = {
  resource: ResourceKey
  className?: string
}

/** Icone ressource — glyphes CSS pour pieces/bois/pierre (compat Windows 10). */
export function ResourceIcon({ resource, className = '' }: ResourceIconProps) {
  if (GLYPH_ICONS.has(resource)) {
    return (
      <span
        aria-hidden
        className={`resource-glyph resource-glyph--${resource} ${className}`.trim()}
      />
    )
  }

  return (
    <span aria-hidden className={`resource-chip-icon ${className}`.trim()}>
      {RESOURCE_ICONS[resource]}
    </span>
  )
}
