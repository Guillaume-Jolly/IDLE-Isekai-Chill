import { captureRingScale } from '../../data/wildFamiliars'
import type { PalmonRarity } from '../../data/wildFamiliars'
import type { TimingGrade } from '../../data/captureHunt'
import { timingGradeLabel } from '../../data/captureHunt'

type CaptureRingGameProps = {
  rarity: PalmonRarity
  progress: number
  attempt: number
  maxAttempts: number
  stability: number
  lastGrade: TimingGrade | null
  onCapture: () => void
}

export function CaptureRingGame({
  rarity,
  progress,
  attempt,
  maxAttempts,
  stability,
  lastGrade,
  onCapture,
}: CaptureRingGameProps) {
  const ringScale = captureRingScale(progress, rarity)

  return (
    <div className="mg-capture-ui">
      <div className="mg-capture-ui-head">
        <span className="mg-capture-attempt">
          Tentative {attempt}/{maxAttempts}
        </span>
        {(rarity === 'UR' || rarity === 'LR') && (
          <span className="mg-capture-stability">
            Stabilite
            <span className="mg-capture-stability-bar">
              <span className="mg-capture-stability-fill" style={{ width: `${stability}%` }} />
            </span>
          </span>
        )}
      </div>

      <button
        aria-label="Lancer la capture"
        className="mg-capture-ring-btn"
        type="button"
        onClick={onCapture}
      >
        <span className="mg-capture-ring-outer" />
        <span className="mg-capture-ring-sweet" />
        <span
          className="mg-capture-ring-inner"
          style={{ transform: `translate(-50%, -50%) scale(${ringScale})` }}
        />
        <span className="mg-capture-ring-label">Capturer !</span>
      </button>

      {lastGrade && (
        <p className={`mg-capture-grade mg-capture-grade-${lastGrade}`}>
          {timingGradeLabel(lastGrade)}
        </p>
      )}
    </div>
  )
}
