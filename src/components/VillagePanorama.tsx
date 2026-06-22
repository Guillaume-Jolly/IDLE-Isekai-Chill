import { useCallback, useEffect, useRef, useState } from 'react'
import type { VillageBuildingInfo } from './VillageBuildingTooltip'
import { VillageMapLabels, type MapLabelSpot } from './VillageMapLabels'
import {
  PANORAMA_HEIGHT,
  PANORAMA_WIDTH,
  buildingLevelTier,
  getPanoramaFocusPercent,
  panoramaStageAsset,
} from '../data/villageMap'

type VillagePanoramaProps = {
  villageStage: number
  buildingLevels: Record<string, number>
  buildingInfos: Record<string, VillageBuildingInfo>
  activeBuildingId: string
  lockedIds: Set<string>
  shortNames: Record<string, string>
  spots: MapLabelSpot[]
  onSelect: (spot: MapLabelSpot, locked: boolean) => void
}

export function VillagePanorama({
  villageStage,
  buildingLevels,
  buildingInfos,
  activeBuildingId,
  lockedIds,
  shortNames,
  spots,
  onSelect,
}: VillagePanoramaProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [scrollMax, setScrollMax] = useState(0)
  const prevStageRef = useRef(villageStage)
  const initialScrollDoneRef = useRef(false)

  const updateScrollBounds = useCallback(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return

    const trackWidth = track.offsetWidth
    const viewport = scroller.clientWidth
    const max = Math.max(0, trackWidth - viewport)
    setScrollMax(max)

    if (scroller.scrollLeft > max) {
      scroller.scrollLeft = max
    }
  }, [])

  useEffect(() => {
    updateScrollBounds()
    window.addEventListener('resize', updateScrollBounds)
    return () => window.removeEventListener('resize', updateScrollBounds)
  }, [updateScrollBounds, villageStage])

  const focusPercent = getPanoramaFocusPercent(villageStage)

  useEffect(() => {
    const scroller = scrollerRef.current
    const track = trackRef.current
    if (!scroller || !track) return

    const trackWidth = track.offsetWidth
    const viewport = scroller.clientWidth
    const targetCenter = (focusPercent / 100) * trackWidth
    const idealScroll = targetCenter - viewport * 0.42
    const max = Math.max(0, trackWidth - viewport)
    const nextScroll = Math.min(max, Math.max(0, idealScroll))

    if (prevStageRef.current !== villageStage) {
      scroller.scrollTo({ left: nextScroll, behavior: 'smooth' })
      prevStageRef.current = villageStage
      initialScrollDoneRef.current = true
    } else if (!initialScrollDoneRef.current && nextScroll > 8) {
      scroller.scrollLeft = nextScroll
      initialScrollDoneRef.current = true
    }
  }, [focusPercent, villageStage])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      event.preventDefault()
      scroller.scrollLeft += event.deltaY
    }

    scroller.addEventListener('wheel', onWheel, { passive: false })
    return () => scroller.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    let dragging = false
    let startX = 0
    let startScroll = 0

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return
      const target = event.target as HTMLElement
      if (target.closest('.map-label')) return
      dragging = true
      startX = event.clientX
      startScroll = scroller.scrollLeft
      scroller.setPointerCapture(event.pointerId)
      scroller.classList.add('panorama-scroller--dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      scroller.scrollLeft = startScroll - (event.clientX - startX)
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      scroller.classList.remove('panorama-scroller--dragging')
      scroller.releasePointerCapture(event.pointerId)
    }

    scroller.addEventListener('pointerdown', onPointerDown)
    scroller.addEventListener('pointermove', onPointerMove)
    scroller.addEventListener('pointerup', endDrag)
    scroller.addEventListener('pointercancel', endDrag)
    return () => {
      scroller.removeEventListener('pointerdown', onPointerDown)
      scroller.removeEventListener('pointermove', onPointerMove)
      scroller.removeEventListener('pointerup', endDrag)
      scroller.removeEventListener('pointercancel', endDrag)
    }
  }, [])

  const clampScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (scroller.scrollLeft > scrollMax) {
      scroller.scrollLeft = scrollMax
    }
  }

  return (
    <div className="panorama-scroller" ref={scrollerRef} onScroll={clampScroll}>
      <div className="panorama-track" ref={trackRef}>
        <img
          alt="Panorama du village Havre des Brumes"
          className="panorama-image--scroll"
          draggable={false}
          height={PANORAMA_HEIGHT}
          src={panoramaStageAsset(villageStage)}
          width={PANORAMA_WIDTH}
          onLoad={updateScrollBounds}
        />
        <VillageMapLabels
          activeBuildingId={activeBuildingId}
          buildingInfos={buildingInfos}
          buildingTiers={Object.fromEntries(
            Object.entries(buildingLevels).map(([id, level]) => [id, buildingLevelTier(level)]),
          )}
          lockedIds={lockedIds}
          levels={buildingLevels}
          shortNames={shortNames}
          spots={spots}
          onSelect={onSelect}
        />
      </div>
      <div className="panorama-scroll-hint" aria-hidden="true">
        <span>← Glisser pour explorer →</span>
      </div>
    </div>
  )
}

export { PANORAMA_WIDTH } from '../data/villageMap'
