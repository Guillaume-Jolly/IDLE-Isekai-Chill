import { useMemo, useState } from 'react'
import { ImageLightbox, type LightboxImage } from './ImageLightbox'
import {
  ALL_DEV_COMPANION_IDS,
  buildCompanionDevVisualSections,
  flattenDevVisualEntries,
  type DevVisualEntry,
  type DevVisualKind,
  type DevVisualSection,
} from '../data/companionVisualDevCatalog'
import './CompanionVisualDevGallery.css'

const COMPANION_NAMES: Record<string, string> = {
  lyra: 'Lyra',
  maeve: 'Maeve',
  seren: 'Seren',
  nami: 'Nami',
  iris: 'Iris',
  kael: 'Kael',
  runa: 'Runa',
  solene: 'Solene',
  talia: 'Talia',
  mira: 'Mira',
  asha: 'Asha',
  elwen: 'Elwen',
  noa: 'Noa',
  sora: 'Sora',
  zelie: 'Zelie',
  etna: 'Etna',
  flonne: 'Flonne',
  laharl: 'Laharl',
  pleinair: 'Pleinair',
}

const SECTION_FILTERS: { value: 'all' | DevVisualKind; label: string }[] = [
  { value: 'all', label: 'Toutes sections' },
  { value: 'affinity', label: 'Affinité' },
  { value: 'emotion', label: 'Émotions' },
  { value: 'chibi', label: 'Chibi' },
  { value: 'integrated-nsfw', label: 'NSFW seul' },
  { value: 'integrated', label: 'Source intégrée' },
]

function companionVisualClass(entry: DevVisualEntry): string {
  const level = entry.level ?? 0
  const classes = ['companion-visual', `kind-${entry.kind}`]
  if (entry.kind === 'affinity') {
    classes.push(`affinity-${level}`)
  }
  if (level >= 4 || entry.kind === 'integrated-nsfw') {
    classes.push('mature-slot')
  }
  return classes.join(' ')
}

function DevVisualThumb({
  entry,
  onOpen,
}: {
  entry: DevVisualEntry
  onOpen: () => void
}) {
  return (
    <div className={`dev-visual-cell kind-${entry.kind}`}>
      <button
        className={companionVisualClass(entry)}
        type="button"
        onClick={onOpen}
        title={entry.label}
      >
        <img alt={entry.label} loading="lazy" src={entry.src} />
      </button>
      <span className="dev-visual-label">{entry.label}</span>
    </div>
  )
}

function filterSections(
  sections: DevVisualSection[],
  sectionFilter: 'all' | DevVisualKind,
  includeNsfw: boolean,
): DevVisualSection[] {
  if (sectionFilter === 'all') {
    return sections.filter(
      (section) => section.kind !== 'integrated-nsfw' || includeNsfw,
    )
  }
  if (sectionFilter === 'affinity') {
    return sections.filter((section) => section.kind === 'affinity')
  }
  return sections.filter((section) => section.kind === sectionFilter)
}

export function CompanionVisualDevGallery() {
  const [filterId, setFilterId] = useState<string>('all')
  const [sectionFilter, setSectionFilter] = useState<'all' | DevVisualKind>('affinity')
  const [includeNsfw, setIncludeNsfw] = useState(false)
  const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(
    null,
  )

  const companionIds =
    filterId === 'all' ? ALL_DEV_COMPANION_IDS : ALL_DEV_COMPANION_IDS.filter((id) => id === filterId)

  const cards = useMemo(
    () =>
      companionIds.map((companionId) => {
        const sections = filterSections(
          buildCompanionDevVisualSections(companionId),
          sectionFilter,
          includeNsfw,
        )
        return {
          companionId,
          name: COMPANION_NAMES[companionId] ?? companionId,
          sections,
        }
      }),
    [companionIds, includeNsfw, sectionFilter],
  )

  const visibleCards = cards.filter(({ sections }) => sections.length > 0)

  const openSection = (companionName: string, entries: DevVisualEntry[], index: number) => {
    const images: LightboxImage[] = entries.map((entry) => ({
      src: entry.src,
      alt: `${companionName} — ${entry.label}`,
      caption: `${companionName} — ${entry.label}`,
      repoPath: entry.repoPath,
      companionId: entry.kind === 'affinity' ? entry.companionId : undefined,
      level: entry.kind === 'affinity' ? entry.level : undefined,
    }))
    setLightbox({ images, index })
  }

  return (
    <>
      <article className="dev-visual-filters-card">
        <div className="dev-visual-filters">
          <label className="dev-visual-field">
            <span className="dev-visual-field-label">Compagnon</span>
            <select value={filterId} onChange={(event) => setFilterId(event.target.value)}>
              <option value="all">Tous ({ALL_DEV_COMPANION_IDS.length})</option>
              {ALL_DEV_COMPANION_IDS.map((id) => (
                <option key={id} value={id}>
                  {COMPANION_NAMES[id] ?? id}
                </option>
              ))}
            </select>
          </label>

          <label className="dev-visual-field">
            <span className="dev-visual-field-label">Section</span>
            <select
              value={sectionFilter}
              onChange={(event) => setSectionFilter(event.target.value as 'all' | DevVisualKind)}
            >
              {SECTION_FILTERS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="dev-visual-field dev-visual-field--checkbox">
            <input
              checked={includeNsfw}
              type="checkbox"
              onChange={(event) => setIncludeNsfw(event.target.checked)}
            />
            <span>
              Variantes NSFW
              <small>
                Affiche les variantes Disagrea (Etna ×3, autres ×3). Section « NSFW seul » pour
                les voir seules.
              </small>
            </span>
          </label>
        </div>

        <p className="dev-visual-note">
          Assets jeu : <code>public/assets/companions/</code> · Sources intégrées :{' '}
          <code>/dev-assets/event-disagrea/</code> · Tests Etna :{' '}
          <code>/dev-assets/staging-companion-visual-pack/</code>
        </p>
      </article>

      <section className="dev-visual-grid">
        {visibleCards.length === 0 ? (
          <p className="dev-visual-empty">Aucun visuel pour cette sélection.</p>
        ) : (
          visibleCards.map(({ companionId, name, sections }) => {
            const flat = flattenDevVisualEntries(sections)
            return (
              <article className="dev-visual-card" key={companionId}>
                <header>
                  <h3>{name}</h3>
                  <small>{flat.length} visuels</small>
                </header>

                {sections.map((section) => (
                  <div className="dev-visual-section" key={`${companionId}-${section.kind}`}>
                    <h4>{section.title}</h4>
                    <div className="dev-visual-strip">
                      {section.entries.map((entry, index) => (
                        <DevVisualThumb
                          entry={entry}
                          key={entry.id}
                          onOpen={() => openSection(name, section.entries, index)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </article>
            )
          })
        )}
      </section>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onIndexChange={(index) => setLightbox((current) => (current ? { ...current, index } : current))}
          showExplorerLink
        />
      )}
    </>
  )
}
