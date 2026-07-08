import { useCallback, useRef, type PointerEvent } from 'react'
import {
  hsbBrightnessBarGradient,
  hsbHueBarGradient,
  hsbSaturationBarGradient,
  type HsbColor,
} from '../../../data/dialedColor/scoring'

type DialedHsbSlidersProps = {
  value: HsbColor
  onChange: (next: HsbColor) => void
  layout?: 'vertical' | 'horizontal'
}

type VerticalBarProps = {
  ariaLabel: string
  gradient: string
  max: number
  min: number
  onChange: (value: number) => void
  value: number
}

function valueFromPointer(clientY: number, rect: DOMRect, min: number, max: number): number {
  const ratio = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
  return Math.round(min + ratio * (max - min))
}

function VerticalBar({ ariaLabel, gradient, max, min, onChange, value }: VerticalBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  const pick = useCallback(
    (clientY: number) => {
      const rect = trackRef.current?.getBoundingClientRect()
      if (!rect || rect.height <= 0) return
      onChange(valueFromPointer(clientY, rect, min, max))
    },
    [max, min, onChange],
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    pick(event.clientY)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    pick(event.clientY)
  }

  const thumbPct = ((value - min) / (max - min)) * 100

  return (
    <div
      aria-label={ariaLabel}
      aria-valuemax={max}
      aria-valuemin={min}
      aria-valuenow={value}
      className="dc-vbar"
      role="slider"
      tabIndex={0}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 10 : 1
        if (event.key === 'ArrowUp') {
          event.preventDefault()
          onChange(Math.min(max, value + step))
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          onChange(Math.max(min, value - step))
        }
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div ref={trackRef} className="dc-vbar-track" style={{ background: gradient }} />
      <div className="dc-vbar-thumb" style={{ top: `${100 - thumbPct}%` }} />
    </div>
  )
}

export function DialedHsbSliders({ value, onChange, layout = 'vertical' }: DialedHsbSlidersProps) {
  const setPart = (key: keyof HsbColor, next: number) => {
    onChange({ ...value, [key]: next })
  }

  if (layout === 'horizontal') {
    return (
      <div className="dc-hsb-sliders dc-hsb-sliders--horizontal">
        <label className="dc-slider-row">
          <span>Teinte</span>
          <input
            max={360}
            min={0}
            type="range"
            value={value.h}
            onChange={(e) => setPart('h', Number(e.target.value))}
          />
        </label>
        <label className="dc-slider-row">
          <span>Saturation</span>
          <input
            max={100}
            min={0}
            type="range"
            value={value.s}
            onChange={(e) => setPart('s', Number(e.target.value))}
          />
        </label>
        <label className="dc-slider-row">
          <span>Luminosité</span>
          <input
            max={100}
            min={0}
            type="range"
            value={value.b}
            onChange={(e) => setPart('b', Number(e.target.value))}
          />
        </label>
      </div>
    )
  }

  return (
    <div className="dc-hsb-sliders dc-hsb-sliders--vertical">
      <VerticalBar
        ariaLabel="Teinte"
        gradient={hsbHueBarGradient()}
        max={360}
        min={0}
        value={value.h}
        onChange={(h) => setPart('h', h)}
      />
      <VerticalBar
        ariaLabel="Saturation"
        gradient={hsbSaturationBarGradient(value.h, value.b)}
        max={100}
        min={0}
        value={value.s}
        onChange={(s) => setPart('s', s)}
      />
      <VerticalBar
        ariaLabel="Luminosité"
        gradient={hsbBrightnessBarGradient(value.h, value.s)}
        max={100}
        min={0}
        value={value.b}
        onChange={(b) => setPart('b', b)}
      />
    </div>
  )
}
