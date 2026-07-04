import { DESTINY_WHEEL_PACKS, type WheelPackId } from '../../data/destinyWheel/seedLoader'

type Props = {
  wheelPackId: WheelPackId
  disabled?: boolean
  compact?: boolean
  onChange: (packId: WheelPackId) => void
}

export function WheelPackSelector({ wheelPackId, disabled, compact, onChange }: Props) {
  return (
    <div
      className={`dw-wheel-pack${compact ? ' dw-wheel-pack--compact' : ''}`}
      role="group"
      aria-label="Choisir la roue"
    >
      {!compact ? <span className="dw-wheel-pack-label">Roue</span> : null}
      {DESTINY_WHEEL_PACKS.map((pack) => (
        <button
          key={pack.id}
          type="button"
          className={`dw-wheel-pack-btn${wheelPackId === pack.id ? ' dw-wheel-pack-btn--active' : ''}${pack.id === 'havre' ? ' dw-wheel-pack-btn--havre' : ' dw-wheel-pack-btn--disgaea'}`}
          disabled={disabled}
          title={pack.subtitle}
          aria-pressed={wheelPackId === pack.id}
          onClick={() => onChange(pack.id)}
        >
          {pack.id === 'havre' ? 'Havre' : 'Disgaea'}
        </button>
      ))}
    </div>
  )
}
