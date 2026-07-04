import { useEffect, useState, type ReactNode } from 'react'
import {
  makeRevealParticles,
  revealAnimationConfig,
} from '../../data/destinyWheel/rarityRevealAnimations'
import './DestinyWheelRarityReveal.css'

type Props = {
  rarity: string
  label?: string
  playKey: string
  variant?: 'overlay' | 'inline'
  children?: ReactNode
}

export function DestinyWheelRarityReveal({
  rarity,
  label,
  playKey,
  variant = 'overlay',
  children,
}: Props) {
  const [visible, setVisible] = useState(true)
  const config = revealAnimationConfig(rarity)
  const particles = makeRevealParticles(config.particleCount, variant === 'inline' ? 'compact' : 'full')

  useEffect(() => {
    setVisible(true)
    const timer = window.setTimeout(() => setVisible(false), config.durationMs + 80)
    return () => window.clearTimeout(timer)
  }, [playKey, config.durationMs])

  if (!visible) {
    if (variant === 'inline' && children) return <>{children}</>
    return null
  }

  if (variant === 'inline') {
    return (
      <div
        className={`dw-rarity-reveal dw-rarity-reveal--inline ${config.className}`}
        role="presentation"
        aria-hidden
      >
        {particles.map((style, index) => (
          <span key={index} className="dw-rarity-reveal-particle" style={style} />
        ))}
        <div className="dw-rarity-reveal-inline-target">{children}</div>
      </div>
    )
  }

  return (
    <div
      className={`dw-rarity-reveal ${config.className}`}
      role="presentation"
      aria-hidden
    >
      {particles.map((style, index) => (
        <span key={index} className="dw-rarity-reveal-particle" style={style} />
      ))}
      <div className="dw-rarity-reveal-card">{label}</div>
    </div>
  )
}
