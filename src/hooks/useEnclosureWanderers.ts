import { useEffect, useRef, useState } from 'react'
import { clampToEnclosureBounds, type EnclosureBounds } from '../data/myrionRefuge'

export type ChibiBubble = 'none' | 'heart' | 'star' | 'zzz' | 'surprised'
export type ChibiMode = 'walk' | 'idle' | 'run' | 'hop' | 'sleep'

export type EnclosureWanderer = {
  id: string
  speciesId: string
  name: string
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  facingLeft: boolean
  mode: ChibiMode
  bubble: ChibiBubble
}

type WandererInput = {
  id: string
  speciesId: string
  name: string
  emoji: string
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function spawnWanderer(item: WandererInput, index: number, bounds: EnclosureBounds): EnclosureWanderer {
  const vx = (index % 2 === 0 ? 1 : -1) * rand(0.12, 0.28)
  const spawn = clampToEnclosureBounds(
    rand(bounds.minX, bounds.maxX),
    rand(bounds.minY, bounds.maxY),
    bounds,
  )
  return {
    ...item,
    ...spawn,
    vx,
    vy: (index % 3 === 0 ? 1 : -1) * rand(0.08, 0.22),
    facingLeft: vx < 0,
    mode: 'walk',
    bubble: 'none',
  }
}

function syncWanderers(
  current: EnclosureWanderer[],
  items: WandererInput[],
  bounds: EnclosureBounds,
): EnclosureWanderer[] {
  const byId = new Map(current.map((sprite) => [sprite.id, sprite]))
  return items.map((item, index) => {
    const existing = byId.get(item.id)
    if (existing) {
      const clamped = clampToEnclosureBounds(existing.x, existing.y, bounds)
      return {
        ...existing,
        ...clamped,
        speciesId: item.speciesId,
        name: item.name,
        emoji: item.emoji,
      }
    }
    return spawnWanderer(item, index, bounds)
  })
}

export function useEnclosureWanderers(items: WandererInput[], bounds: EnclosureBounds) {
  const itemKey = items.map((item) => item.id).join(',')
  const boundsKey = `${bounds.minX}-${bounds.maxX}-${bounds.minY}-${bounds.maxY}`
  const bubbleTimers = useRef<Map<string, number>>(new Map())

  const [wanderers, setWanderers] = useState<EnclosureWanderer[]>(() =>
    items.map((item, index) => spawnWanderer(item, index, bounds)),
  )

  useEffect(() => {
    setWanderers((current) => syncWanderers(current, items, bounds))
  }, [boundsKey, itemKey])

  useEffect(() => {
    const timer = window.setInterval(() => {
      const now = Date.now()
      setWanderers((current) =>
        current.map((sprite) => {
          let { x, y, vx, vy, mode, bubble, facingLeft } = sprite

          if (bubble !== 'none') {
            const until = bubbleTimers.current.get(sprite.id) ?? 0
            if (now >= until) {
              bubble = 'none'
              bubbleTimers.current.delete(sprite.id)
            }
          }

          if (mode === 'sleep') {
            if (Math.random() < 0.015) {
              mode = 'idle'
              bubble = 'none'
            }
            return { ...sprite, mode, bubble }
          }

          if (mode === 'idle') {
            if (Math.random() < 0.04) {
              mode = 'walk'
              vx = (Math.random() < 0.5 ? -1 : 1) * rand(0.1, 0.24)
              vy = (Math.random() < 0.5 ? -1 : 1) * rand(0.08, 0.18)
            } else if (Math.random() < 0.008) {
              mode = 'sleep'
              bubble = 'zzz'
            }
            return { ...sprite, mode, bubble, vx, vy }
          }

          if (mode === 'hop') {
            if (Math.random() < 0.2) {
              mode = Math.abs(vx) + Math.abs(vy) > 0.28 ? 'run' : 'walk'
            }
          } else {
            x += vx
            y += vy

            if (x < bounds.minX || x > bounds.maxX) {
              vx = -vx
              x = Math.max(bounds.minX, Math.min(bounds.maxX, x))
              facingLeft = vx < 0
            }
            if (y < bounds.minY || y > bounds.maxY) {
              vy = -vy
              y = Math.max(bounds.minY, Math.min(bounds.maxY, y))
            }

            const speed = Math.abs(vx) + Math.abs(vy)
            mode = speed > 0.32 ? 'run' : 'walk'

            if (Math.random() < 0.012) {
              mode = 'idle'
              vx = 0
              vy = 0
            } else if (Math.random() < 0.006) {
              mode = 'hop'
            } else if (Math.random() < 0.003) {
              mode = 'run'
              vx = (vx >= 0 ? 1 : -1) * rand(0.34, 0.48)
              vy = (vy >= 0 ? 1 : -1) * rand(0.24, 0.38)
              facingLeft = vx < 0
            }
          }

          return { ...sprite, ...clampToEnclosureBounds(x, y, bounds), vx, vy, mode, bubble, facingLeft }
        }),
      )
    }, 48)

    return () => window.clearInterval(timer)
  }, [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, boundsKey, itemKey])

  const flashBubble = (id: string, bubble: ChibiBubble, durationMs = 1800) => {
    bubbleTimers.current.set(id, Date.now() + durationMs)
    setWanderers((current) =>
      current.map((sprite) =>
        sprite.id === id ? { ...sprite, bubble, mode: bubble === 'heart' ? 'hop' : sprite.mode } : sprite,
      ),
    )
  }

  return { wanderers, flashBubble }
}
