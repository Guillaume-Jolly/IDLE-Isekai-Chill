import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { LootExplainTip } from '../data/lootExplain'
import { resolveTooltipPlacement, type TooltipPlacement } from './lootTooltipPlacement'

type LootRateHoverTipProps = {
  label?: string
  lines?: string[]
  explain?: LootExplainTip
  children: ReactNode
  className?: string
}

type ActiveTip = {
  anchor: HTMLElement
  placement: TooltipPlacement | null
}

const HIDE_DELAY_MS = 180

export function LootRateHoverTip({
  label,
  lines,
  explain,
  children,
  className = '',
}: LootRateHoverTipProps) {
  const tooltipId = useId()
  const popupRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<number | null>(null)
  const hoveringPopupRef = useRef(false)
  const [tip, setTip] = useState<ActiveTip | null>(null)

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const hideTip = useCallback(() => {
    clearHideTimer()
    setTip(null)
  }, [clearHideTimer])

  const scheduleHide = useCallback(() => {
    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      if (!hoveringPopupRef.current) hideTip()
    }, HIDE_DELAY_MS)
  }, [clearHideTimer, hideTip])

  const showTip = useCallback(
    (anchor: HTMLElement) => {
      clearHideTimer()
      setTip({ anchor, placement: null })
    },
    [clearHideTimer],
  )

  useLayoutEffect(() => {
    if (!tip || !popupRef.current) return

    const placement = resolveTooltipPlacement(tip.anchor, popupRef.current)
    setTip((current) => {
      if (!current) return current
      if (
        current.placement?.left === placement.left &&
        current.placement?.top === placement.top &&
        current.placement?.transform === placement.transform
      ) {
        return current
      }
      return { ...current, placement }
    })
  }, [tip?.anchor, explain, lines, label])

  useEffect(() => {
    if (!tip) return

    const dismiss = (event: Event) => {
      const target = event.target
      if (popupRef.current && target instanceof Node && popupRef.current.contains(target)) return
      hideTip()
    }

    window.addEventListener('scroll', dismiss, true)
    window.addEventListener('resize', dismiss)
    return () => {
      window.removeEventListener('scroll', dismiss, true)
      window.removeEventListener('resize', dismiss)
    }
  }, [hideTip, tip])

  useEffect(() => () => clearHideTimer(), [clearHideTimer])

  const hasExplain = explain && explain.sections.some((section) => section.lines.length > 0)
  const hasLines = lines && lines.length > 0
  if (!hasExplain && !hasLines) return <>{children}</>

  const headline = explain?.headline ?? label
  const triggerClass = `loot-details-hover-tip${className ? ` ${className}` : ''}`.trim()
  const inDialog = Boolean(tip?.anchor.closest('.loot-details-dialog'))
  const isReady = Boolean(tip?.placement)

  return (
    <>
      <span
        aria-describedby={tip ? tooltipId : undefined}
        className={triggerClass}
        tabIndex={0}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) scheduleHide()
        }}
        onFocus={(event) => showTip(event.currentTarget)}
        onMouseEnter={(event) => showTip(event.currentTarget)}
        onMouseLeave={scheduleHide}
      >
        {children}
      </span>
      {tip
        ? createPortal(
            <div
              ref={popupRef}
              className={`loot-details-hover-tip-popup${inDialog ? ' loot-details-hover-tip-popup--gameplay' : ''}${isReady ? ' loot-details-hover-tip-popup--ready' : ''}`}
              id={tooltipId}
              role="tooltip"
              style={
                tip.placement
                  ? {
                      left: tip.placement.left,
                      top: tip.placement.top,
                      transform: tip.placement.transform,
                    }
                  : { left: -9999, top: 0, visibility: 'hidden' as const }
              }
              onMouseEnter={() => {
                hoveringPopupRef.current = true
                clearHideTimer()
              }}
              onMouseLeave={() => {
                hoveringPopupRef.current = false
                scheduleHide()
              }}
            >
              {headline ? <strong className="loot-details-hover-tip-title">{headline}</strong> : null}
              {hasExplain ? (
                <div className="loot-details-hover-tip-sections">
                  {explain!.sections.map((section) => (
                    <section key={section.title} className="loot-details-hover-tip-section">
                      <h6 className="loot-details-hover-tip-section-title">{section.title}</h6>
                      <ul className="loot-details-hover-tip-lines">
                        {section.lines.map((line, index) => (
                          <li key={`${section.title}-${index}`}>{line}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
              ) : (
                <ul className="loot-details-hover-tip-lines">
                  {lines!.map((line, index) => (
                    <li key={`${index}-${line}`}>{line}</li>
                  ))}
                </ul>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
