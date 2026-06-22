import { useEffect, useState } from 'react'

export type WanderingBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export type WanderingSprite = {
  id: string
  emoji: string
  name?: string
  x: number
  y: number
  vx: number
  vy: number
}

const DEFAULT_BOUNDS: WanderingBounds = {
  minX: 10,
  maxX: 82,
  minY: 18,
  maxY: 68,
}

export function useWanderingSprites(
  items: Array<{ id: string; emoji: string; name?: string }>,
  bounds: WanderingBounds = DEFAULT_BOUNDS,
) {
  const itemKey = items.map((item) => item.id).join(',')

  const [sprites, setSprites] = useState<WanderingSprite[]>(() =>
    items.map((item, index) => ({
      ...item,
      x: 18 + (index * 17) % 58,
      y: 24 + (index * 11) % 38,
      vx: (index % 2 === 0 ? 1 : -1) * (0.18 + (index % 3) * 0.08),
      vy: (index % 3 === 0 ? 1 : -1) * (0.14 + (index % 2) * 0.07),
    })),
  )

  useEffect(() => {
    setSprites(
      items.map((item, index) => ({
        ...item,
        x: 18 + (index * 17) % 58,
        y: 24 + (index * 11) % 38,
        vx: (index % 2 === 0 ? 1 : -1) * (0.18 + (index % 3) * 0.08),
        vy: (index % 3 === 0 ? 1 : -1) * (0.14 + (index % 2) * 0.07),
      })),
    )
  }, [itemKey, items])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSprites((current) =>
        current.map((sprite) => {
          let nextX = sprite.x + sprite.vx
          let nextY = sprite.y + sprite.vy
          let nextVx = sprite.vx
          let nextVy = sprite.vy

          if (nextX < bounds.minX || nextX > bounds.maxX) {
            nextVx = -nextVx
            nextX = Math.max(bounds.minX, Math.min(bounds.maxX, nextX))
          }
          if (nextY < bounds.minY || nextY > bounds.maxY) {
            nextVy = -nextVy
            nextY = Math.max(bounds.minY, Math.min(bounds.maxY, nextY))
          }

          return { ...sprite, x: nextX, y: nextY, vx: nextVx, vy: nextVy }
        }),
      )
    }, 55)

    return () => window.clearInterval(timer)
  }, [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, itemKey])

  return sprites
}
