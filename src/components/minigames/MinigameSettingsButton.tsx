import { useState } from 'react'
import { SettingsModal } from '../SettingsModal'

type MinigameSettingsButtonProps = {
  className?: string
}

export function MinigameSettingsButton({ className = '' }: MinigameSettingsButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        aria-label="Paramètres"
        className={`mg-side-rail-settings${className ? ` ${className}` : ''}`}
        title="Paramètres"
        type="button"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true">⚙️</span>
      </button>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
