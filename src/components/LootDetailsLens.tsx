import { useEffect, useId, useState, type ReactNode } from 'react'
import './LootDetailsLens.css'

type LootDetailsLensProps = {
  label: string
  title: string
  children: ReactNode
  className?: string
  onOpenChange?: (open: boolean) => void
}

export function LootDetailsLens({
  label,
  title,
  children,
  className = '',
  onOpenChange,
}: LootDetailsLensProps) {
  const dialogId = useId()
  const [open, setOpen] = useState(false)

  const setDialogOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <>
      <button
        aria-controls={dialogId}
        aria-expanded={open}
        aria-label={label}
        className={`loot-details-lens${className ? ` ${className}` : ''}`}
        title={label}
        type="button"
        onClick={() => setDialogOpen(true)}
      >
        <span aria-hidden className="loot-details-lens-icon">
          🔍
        </span>
      </button>

      {open ? (
        <>
          <button
            aria-label="Fermer les détails"
            className="loot-details-backdrop"
            type="button"
            onClick={() => setDialogOpen(false)}
          />
          <div
            aria-labelledby={`${dialogId}-title`}
            className="loot-details-dialog"
            id={dialogId}
            role="dialog"
          >
            <header className="loot-details-dialog-head">
              <h4 id={`${dialogId}-title`}>{title}</h4>
              <button
                aria-label="Fermer"
                className="loot-details-close"
                type="button"
                onClick={() => setDialogOpen(false)}
              >
                ×
              </button>
            </header>
            <div className="loot-details-dialog-body">{children}</div>
          </div>
        </>
      ) : null}
    </>
  )
}
