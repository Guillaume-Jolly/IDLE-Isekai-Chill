import { useState, type ImgHTMLAttributes, type ReactNode } from 'react'
import type { WorksiteVisualAsset } from '../../data/myrionWorksiteVisuals'

type WorksiteOptionalImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  asset: WorksiteVisualAsset
  alt: string
  className?: string
}

/**
 * Affiche une image seulement si `asset.available` — sinon rien (placeholder CSS parent).
 * Si available mais chargement échoue, bascule silencieusement sur le placeholder.
 */
export function WorksiteOptionalImage({
  asset,
  alt,
  className,
  ...rest
}: WorksiteOptionalImageProps) {
  const [failed, setFailed] = useState(false)

  if (!asset.available || failed) return null

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      draggable={false}
      src={asset.path}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}

type WorksiteBiomeBackgroundProps = {
  asset: WorksiteVisualAsset
  label: string
  biomeId?: string
  className?: string
  /** @deprecated Panorama scroll — cadrage via hauteur native. */
  objectPosition?: string
  onImageLoad?: () => void
}

export function WorksiteBiomeBackground({
  asset,
  label,
  biomeId,
  className,
  onImageLoad,
}: WorksiteBiomeBackgroundProps) {
  const biomeClass = biomeId ? `mg-worksite-biome-background--${biomeId}` : ''

  return (
    <div
      aria-hidden
      className={`mg-worksite-biome-background mg-worksite-biome-background--panorama ${biomeClass} ${className ?? ''}`.trim()}
    >
      <WorksiteOptionalImage
        asset={asset}
        alt=""
        aria-hidden
        className="mg-worksite-panorama-image"
        onLoad={onImageLoad}
      />
      <span className="visually-hidden">{label}</span>
    </div>
  )
}

type WorksiteSpotObjectProps = {
  asset: WorksiteVisualAsset
  emoji: string
  name: string
  className?: string
  children?: ReactNode
}

export function WorksiteSpotObject({ asset, emoji, name, className, children }: WorksiteSpotObjectProps) {
  return (
    <span className={className}>
      <WorksiteOptionalImage asset={asset} alt="" aria-hidden className="mg-worksite-spot-object-img" />
      <span aria-hidden className="mg-worksite-spot-object-emoji">
        {emoji}
      </span>
      <span className="visually-hidden">{name}</span>
      {children}
    </span>
  )
}

type WorksiteResourceIconProps = {
  asset: WorksiteVisualAsset
  emoji: string
  label: string
  className?: string
}

export function WorksiteResourceIcon({ asset, emoji, label, className }: WorksiteResourceIconProps) {
  return (
    <span className={`mg-worksite-resource-icon ${asset.placeholderClass} ${className ?? ''}`.trim()} title={label}>
      <WorksiteOptionalImage asset={asset} alt="" aria-hidden className="mg-worksite-resource-icon-img" />
      <span aria-hidden className="mg-worksite-resource-icon-emoji">
        {emoji}
      </span>
      <span className="visually-hidden">{label}</span>
    </span>
  )
}
