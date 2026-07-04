import type { CharacterSheet, RunState } from '../../data/destinyWheel/types'
import type { HavreGameModeDef, SavedHavreIsekaiCard } from './types'
import {
  buildFicheFieldMap,
  FICHE_LAYOUT_MAP,
  FICHE_OVERLAY_URL,
  FICHE_TEMPLATE_URL,
  resolveFicheFieldValue,
} from './ficheFieldResolver'
import './FicheDestinView.css'

type Props = {
  sheet: CharacterSheet
  runState: RunState
  card?: SavedHavreIsekaiCard
  modeDef?: HavreGameModeDef
  displayName?: string
}

export function FicheDestinView({ sheet, runState, card, modeDef, displayName }: Props) {
  const fields = buildFicheFieldMap(sheet, runState, card, modeDef, displayName)

  return (
    <div className="fiche-destin">
      <div
        className="fiche-destin-canvas"
        style={{ aspectRatio: `${FICHE_LAYOUT_MAP.canvas.width} / ${FICHE_LAYOUT_MAP.canvas.height}` }}
      >
        <img className="fiche-destin-bg" src={FICHE_TEMPLATE_URL} alt="" draggable={false} />
        <img className="fiche-destin-overlay" src={FICHE_OVERLAY_URL} alt="" draggable={false} />
        {FICHE_LAYOUT_MAP.regions.map((region) => {
          if (region.type === 'image' && region.id === 'portrait_frame') {
            return (
              <div
                key={region.id}
                className="fiche-destin-region fiche-destin-region--portrait"
                style={{
                  left: `${region.x_pct * 100}%`,
                  top: `${region.y_pct * 100}%`,
                  width: `${region.w_pct * 100}%`,
                  height: `${region.h_pct * 100}%`,
                }}
              >
                {resolveFicheFieldValue(region.id, sheet, runState, card, modeDef)}
              </div>
            )
          }
          if (region.type !== 'text') return null
          const value = fields[region.id] ?? '—'
          if (value === '—' && region.id.startsWith('optional_')) return null
          return (
            <div
              key={region.id}
              className={`fiche-destin-region fiche-destin-region--text${region.id.endsWith('_bar') ? ' fiche-destin-region--bar' : ''}`}
              style={{
                left: `${region.x_pct * 100}%`,
                top: `${region.y_pct * 100}%`,
                width: `${region.w_pct * 100}%`,
                height: `${region.h_pct * 100}%`,
                textAlign: region.text_anchor === 'center' ? 'center' : 'left',
              }}
              title={region.label}
            >
              {value}
            </div>
          )
        })}
      </div>
    </div>
  )
}
