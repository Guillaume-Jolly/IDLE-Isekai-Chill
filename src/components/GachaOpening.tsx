import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { bestRarity, RARITY_META, type GachaItem } from '../data/gacha'
import './GachaOpening.css'

type Phase = 'cinema' | 'summary'

const GOLD_MULTI = '#ffd878'
const OPENING_MP4 = '/gacha/cinema/opening.mp4'
const OPENING_POSTER = '/gacha/cinema/hostess-intro.png'

type GachaOpeningProps = {
  items: GachaItem[]
  onClose: () => void
}

export function GachaOpening({ items, onClose }: GachaOpeningProps) {
  const [phase, setPhase] = useState<Phase>('cinema')
  const [showReward, setShowReward] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const highlight = bestRarity(items)
  const multiPull = items.length > 1
  const tintColor = multiPull ? GOLD_MULTI : RARITY_META[highlight].color
  const spotlight =
    items.length === 1 ? items[0] : items.find((item) => item.rarity === highlight) ?? items[0]

  useEffect(() => {
    const rewardTimer = window.setTimeout(() => setShowReward(true), 2600)
    const summaryTimer = window.setTimeout(() => setPhase('summary'), 4000)
    return () => {
      window.clearTimeout(rewardTimer)
      window.clearTimeout(summaryTimer)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || phase !== 'cinema' || videoFailed) return
    video.currentTime = 0
    void video.play().catch(() => setVideoFailed(true))
  }, [phase, videoFailed])

  return (
    <div className="gacha-overlay" role="dialog" aria-modal="true" aria-label="Invocation gacha">
      {phase === 'cinema' && (
        <div className="gacha-cinema">
          <div className="gacha-cinema-stage">
            {!videoFailed ? (
              <video
                ref={videoRef}
                autoPlay
                className="gacha-cinema-video"
                muted
                playsInline
                poster={OPENING_POSTER}
                onError={() => setVideoFailed(true)}
              >
                <source src={OPENING_MP4} type="video/mp4" />
                <source src="/gacha/cinema/opening.webm" type="video/webm" />
              </video>
            ) : (
              <img alt="" className="gacha-cinema-poster" src={OPENING_POSTER} />
            )}

            <div
              className="gacha-cinema-tint"
              style={
                {
                  '--tint-color': tintColor,
                  '--tint-glow': multiPull ? 'rgba(255, 216, 120, 0.75)' : RARITY_META[highlight].glow,
                } as CSSProperties
              }
            />

            <div className={`gacha-cinema-reward ${showReward ? 'visible' : ''}`}>
              <GachaCard item={spotlight} large showThumb />
            </div>
          </div>

          <p className="gacha-cinema-caption">
            {multiPull
              ? `Invocation x${items.length} — lumiere doree du festival`
              : `Decouverte ${highlight} — ${RARITY_META[highlight].label}`}
          </p>
          {videoFailed && (
            <p className="gacha-cinema-hint">
              Place une vraie boucle dans <code>public/gacha/cinema/opening.mp4</code>
            </p>
          )}
        </div>
      )}

      {phase === 'summary' && (
        <div className="gacha-summary">
          <header className="gacha-summary-head">
            <h3>Resultats x{items.length}</h3>
            <p>
              Meilleure rarete:{' '}
              <strong style={{ color: RARITY_META[highlight].color }}>{highlight}</strong>
            </p>
          </header>

          <div className={`gacha-summary-grid ${items.length >= 50 ? 'compact' : ''}`}>
            {items.map((item, index) => (
              <GachaCard compact showThumb item={item} key={`${item.id}-${index}`} />
            ))}
          </div>

          <button className="gacha-close-btn" type="button" onClick={onClose}>
            Continuer
          </button>
        </div>
      )}
    </div>
  )
}

function GachaCard({
  item,
  large = false,
  compact = false,
  showThumb = false,
}: {
  item: GachaItem
  large?: boolean
  compact?: boolean
  showThumb?: boolean
}) {
  const meta = RARITY_META[item.rarity]

  return (
    <article
      className={`gacha-card rarity-${item.rarity.toLowerCase()} ${large ? 'large' : ''} ${compact ? 'compact' : ''}`}
      style={{ '--rarity-color': meta.color, '--rarity-glow': meta.glow } as CSSProperties}
    >
      <span className="gacha-rarity-badge">{item.rarity}</span>
      {showThumb && (
        <div className="gacha-thumb">
          <img src={item.icon} alt="" />
        </div>
      )}
      <div className="gacha-card-shine" />
      <h4>{item.name}</h4>
      <small>{meta.label}</small>
    </article>
  )
}
