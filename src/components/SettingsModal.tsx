import { useEffect, useId } from 'react'
import { SettingsPanel } from './SettingsPanel'

type SettingsModalProps = {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  return (
    <>
      <button
        aria-label="Fermer les paramètres"
        className="settings-modal-backdrop"
        type="button"
        onClick={onClose}
      />
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="settings-modal"
        role="dialog"
      >
        <header className="settings-modal-head">
          <h2 id={titleId}>Paramètres</h2>
          <button aria-label="Fermer" className="settings-modal-close" type="button" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="settings-modal-body">
          <SettingsPanel embedded />
        </div>
      </div>
    </>
  )
}
