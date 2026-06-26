import { type CSSProperties } from 'react'
import { WorksiteOptionalImage } from './WorksiteVisuals'
import type { WorksiteVisualAsset } from '../../data/myrionWorksiteVisuals'

export const WORKSITE_MINE_BURST_MS = 2500

export type WorksiteMineBurstRay = {
  id: string
  driftX: number
  driftY: number
  rotate: number
}

export type WorksiteMineBurst = {
  id: string
  left: string
  top: string
  resourceEmoji: string
  resourceAsset: WorksiteVisualAsset
  rays: WorksiteMineBurstRay[]
}

type WorksiteMineBurstsProps = {
  bursts: WorksiteMineBurst[]
}

export function WorksiteMineBursts({ bursts }: WorksiteMineBurstsProps) {
  if (bursts.length === 0) return null

  return (
    <div aria-hidden className="mg-worksite-mine-bursts">
      {bursts.map((burst) => (
        <div
          className="mg-worksite-mine-burst-group"
          key={burst.id}
          style={
            {
              left: burst.left,
              top: burst.top,
              '--burst-duration': `${WORKSITE_MINE_BURST_MS}ms`,
            } as CSSProperties
          }
        >
          <span className="mg-worksite-mine-burst-anchor">
            <span className="mg-worksite-mine-burst-core">
              <WorksiteOptionalImage
                alt=""
                aria-hidden
                asset={burst.resourceAsset}
                className="mg-worksite-mine-burst-img"
              />
              <span className="mg-worksite-mine-burst-emoji" aria-hidden>
                {burst.resourceEmoji}
              </span>
            </span>
          </span>
          {burst.rays.map((ray) => (
            <span
              className="mg-worksite-mine-burst-ray"
              key={ray.id}
              style={
                {
                  '--burst-dx': `${ray.driftX}px`,
                  '--burst-dy': `${ray.driftY}px`,
                  '--burst-rotate': `${ray.rotate}deg`,
                } as CSSProperties
              }
            >
              <span className="mg-worksite-mine-burst-core">
                <WorksiteOptionalImage
                  alt=""
                  aria-hidden
                  asset={burst.resourceAsset}
                  className="mg-worksite-mine-burst-img"
                />
                <span className="mg-worksite-mine-burst-emoji" aria-hidden>
                  {burst.resourceEmoji}
                </span>
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export type MineBurstOrigin = {
  left: string
  top: string
}

/** Centre du marqueur filon, en % dans la scène (même repère que les markers). */
export function markerBurstOrigin(
  marker: HTMLElement,
  scene: HTMLElement,
): MineBurstOrigin {
  const markerRect = marker.getBoundingClientRect()
  const sceneRect = scene.getBoundingClientRect()
  const centerX = markerRect.left + markerRect.width / 2 - sceneRect.left
  const centerY = markerRect.top + markerRect.height / 2 - sceneRect.top
  const leftPct = Math.max(4, Math.min(96, (centerX / sceneRect.width) * 100))
  const topPct = Math.max(6, Math.min(94, (centerY / sceneRect.height) * 100))
  return { left: `${leftPct}%`, top: `${topPct}%` }
}

const MINE_BURST_TRAVEL_PX = 32

/** Une animation par clic — un éclat part du filon dans une direction aléatoire. */
export function createMineBurstRing(
  baseId: number,
  origin: MineBurstOrigin,
  resourceEmoji: string,
  resourceAsset: WorksiteVisualAsset,
): WorksiteMineBurst {
  const angleDeg = Math.random() * 360
  const angleRad = (angleDeg * Math.PI) / 180
  const distance = MINE_BURST_TRAVEL_PX + Math.random() * 10
  const rays: WorksiteMineBurstRay[] = [
    {
      id: 'ray-0',
      driftX: Math.cos(angleRad) * distance,
      driftY: Math.sin(angleRad) * distance,
      rotate: angleDeg * 0.4,
    },
  ]

  return {
    id: `mine-burst-${baseId}`,
    left: origin.left,
    top: origin.top,
    resourceEmoji,
    resourceAsset,
    rays,
  }
}
