import { useEffect, useState } from 'react'
import { useCompanionPortraitAssets } from '../hooks/useCompanionPortraitAssets'
import { revealInExplorer } from '../utils/revealInExplorer'
import './ImageLightbox.css'

export type LightboxImage = {
  src: string
  alt: string
  caption?: string
  /** Chemin relatif repo — lien Explorateur (dev). */
  repoPath?: string
  /** Résout cutout + background ou composé si présents. */
  companionId?: string
  level?: number
}

export type LightboxImageFit = 'cover' | 'contain'

type LightboxStageProps = {
  image: LightboxImage
  imageFit: LightboxImageFit
}

function LightboxCompanionSlide({
  image,
  imageFit,
}: {
  image: LightboxImage & { companionId: string; level: number }
  imageFit: LightboxImageFit
}) {
  const portrait = useCompanionPortraitAssets(image.companionId, image.level)
  const fullClass = imageFit === 'contain' ? ' lightbox-image--full' : ''

  if (portrait.mode === 'loading') {
    return <div aria-hidden className="lightbox-image lightbox-image--loading" />
  }

  if (portrait.mode === 'missing') {
    return <img className={`lightbox-image${fullClass}`} src={image.src} alt={image.alt} />
  }

  if (portrait.composedSrc && (imageFit === 'contain' || portrait.mode === 'composed')) {
    return (
      <img
        className={`lightbox-image${fullClass}`}
        src={portrait.composedSrc}
        alt={image.alt}
      />
    )
  }

  if (portrait.mode === 'layered' && portrait.backgroundSrc && portrait.cutoutSrc) {
    return (
      <div className={`lightbox-portrait-stack${imageFit === 'contain' ? ' lightbox-portrait-stack--full' : ''}`}>
        <img
          alt=""
          aria-hidden
          className="lightbox-layer lightbox-layer--bg"
          src={portrait.backgroundSrc}
        />
        <img
          alt={image.alt}
          className="lightbox-layer lightbox-layer--cutout"
          src={portrait.cutoutSrc}
        />
      </div>
    )
  }

  if (portrait.cutoutSrc) {
    return (
      <img
        className={`lightbox-image${fullClass}`}
        src={portrait.cutoutSrc}
        alt={image.alt}
      />
    )
  }

  return <img className={`lightbox-image${fullClass}`} src={image.src} alt={image.alt} />
}

function LightboxStageContent({ image, imageFit }: LightboxStageProps) {
  if (image.companionId && image.level) {
    return (
      <LightboxCompanionSlide
        image={{ ...image, companionId: image.companionId, level: image.level }}
        imageFit={imageFit}
      />
    )
  }

  return (
    <img
      className={`lightbox-image${imageFit === 'contain' ? ' lightbox-image--full' : ''}`}
      src={image.src}
      alt={image.alt}
    />
  )
}

type ImageLightboxProps = {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onIndexChange: (nextIndex: number) => void
  /** contain = image entière (zoom Liens). cover = recadrage carte. */
  imageFit?: LightboxImageFit
  /** Affiche le lien « Ouvrir dans l'Explorateur » (dev galerie). */
  showExplorerLink?: boolean
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
  imageFit = 'contain',
  showExplorerLink = false,
}: ImageLightboxProps) {
  const current = images[index]
  const stageClass = imageFit === 'contain' ? 'lightbox-stage lightbox-stage--full' : 'lightbox-stage'
  const [explorerError, setExplorerError] = useState<string | null>(null)

  useEffect(() => {
    setExplorerError(null)
  }, [index])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % images.length)
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [images.length, index, onClose, onIndexChange])

  if (!current) return null

  const canReveal =
    showExplorerLink && import.meta.env.DEV && Boolean(current.repoPath)

  const handleReveal = async () => {
    if (!current.repoPath) return
    setExplorerError(null)
    const result = await revealInExplorer(current.repoPath)
    if (!result.ok) {
      setExplorerError(
        result.error === 'not-found'
          ? 'Fichier introuvable sur le disque.'
          : "Impossible d'ouvrir l'Explorateur.",
      )
    }
  }

  return (
    <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Visionneuse">
      <button className="lightbox-close" type="button" onClick={onClose} aria-label="Fermer">
        ×
      </button>

      <button
        className="lightbox-nav lightbox-prev"
        type="button"
        onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
        aria-label="Image precedente"
      >
        ‹
      </button>

      <figure className={stageClass}>
        <LightboxStageContent image={current} imageFit={imageFit} />
        <figcaption className="lightbox-caption">
          <span className="lightbox-caption-main">
            {current.caption ?? current.alt}
            {canReveal && (
              <button
                className="lightbox-explorer-link"
                type="button"
                onClick={handleReveal}
                title={current.repoPath}
              >
                Ouvrir dans l&apos;Explorateur
              </button>
            )}
            {explorerError && (
              <span className="lightbox-explorer-error" role="alert">
                {explorerError}
              </span>
            )}
          </span>
          <span>
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>

      <button
        className="lightbox-nav lightbox-next"
        type="button"
        onClick={() => onIndexChange((index + 1) % images.length)}
        aria-label="Image suivante"
      >
        ›
      </button>

      {images.length > 1 && (
        <div className="lightbox-thumbs" aria-label="Miniatures">
          {images.map((image, thumbIndex) => (
            <button
              className={thumbIndex === index ? 'active' : ''}
              key={image.alt + thumbIndex}
              type="button"
              onClick={() => onIndexChange(thumbIndex)}
            >
              <img src={image.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
