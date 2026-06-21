import { useEffect } from 'react'
import './ImageLightbox.css'

export type LightboxImage = {
  src: string
  alt: string
  caption?: string
}

type ImageLightboxProps = {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onIndexChange: (nextIndex: number) => void
}

export function ImageLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const current = images[index]

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

      <figure className="lightbox-stage">
        <img className="lightbox-image" src={current.src} alt={current.alt} />
        <figcaption className="lightbox-caption">
          {current.caption ?? current.alt}
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
              key={`${image.src}-${thumbIndex}`}
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
