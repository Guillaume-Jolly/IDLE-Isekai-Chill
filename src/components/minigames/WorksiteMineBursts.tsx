import { type CSSProperties } from 'react'
import { WORKSITE_VISUAL_LIMITS } from '../../data/myrionWorksiteBalance'
import { WorksiteOptionalImage } from './WorksiteVisuals'
import type { WorksiteVisualAsset } from '../../data/myrionWorksiteVisuals'

export const WORKSITE_MINE_BURST_MS = WORKSITE_VISUAL_LIMITS.mineBurstMs
export const WORKSITE_MAX_MINE_BURSTS = WORKSITE_VISUAL_LIMITS.maxMineBursts

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
  yieldLabel: string
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
            <span className="mg-worksite-mine-burst-stack">
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
              <span className="mg-worksite-mine-burst-yield">{burst.yieldLabel}</span>
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

const MINE_BURST_TRAVEL_MIN_PX = 96
const MINE_BURST_TRAVEL_MAX_PX = 200

/** Direction aléatoire sur 360° — l’éclat peut traverser toute la scène. */
function pickBurstAngleDeg(): number {
  return Math.random() * 360
}

/** Une animation par clic — éclats partant du filon dans une direction aléatoire (360°). */
export function createMineBurstRing(
  baseId: number,
  origin: MineBurstOrigin,
  resourceEmoji: string,
  resourceAsset: WorksiteVisualAsset,
  yieldLabel: string,
): WorksiteMineBurst {
  const angleDeg = pickBurstAngleDeg()
  const angleRad = (angleDeg * Math.PI) / 180
  const distance = MINE_BURST_TRAVEL_MIN_PX + Math.random() * (MINE_BURST_TRAVEL_MAX_PX - MINE_BURST_TRAVEL_MIN_PX)
  const rays: WorksiteMineBurstRay[] = [
    {
      id: 'ray-0',
      driftX: Math.cos(angleRad) * distance,
      driftY: Math.sin(angleRad) * distance,
      rotate: angleDeg + 360 + Math.random() * 180,
    },
  ]

  return {
    id: `mine-burst-${baseId}`,
    left: origin.left,
    top: origin.top,
    resourceEmoji,
    resourceAsset,
    yieldLabel,
    rays,
  }
}
