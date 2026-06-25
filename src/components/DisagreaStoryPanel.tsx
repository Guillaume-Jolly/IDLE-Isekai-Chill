import { useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import {
  DISAGREA_ALTERNATE_VARIANTS,
  DISAGREA_STORY_CHAPTERS,
  type DisagreaStoryPage,
} from '../data/disagreaStory'
import './DisagreaStoryPanel.css'

function StoryPageBackground({ page }: { page: DisagreaStoryPage }) {
  const isWide = useMediaQuery('(min-width: 768px)')
  const src = isWide ? page.backgroundWide : page.backgroundPortrait

  return (
    <img
      alt=""
      aria-hidden
      className="disagrea-story-page-bg"
      decoding="async"
      src={src}
    />
  )
}

export function DisagreaStoryPanel() {
  const [chapterIndex] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)

  const chapter = DISAGREA_STORY_CHAPTERS[chapterIndex]
  const page = chapter.pages[pageIndex]
  const pageCount = chapter.pages.length

  const goPrev = () => setPageIndex((current) => Math.max(0, current - 1))
  const goNext = () => setPageIndex((current) => Math.min(pageCount - 1, current + 1))

  return (
    <section aria-labelledby="disagrea-story-title" className="disagrea-story panel">
      <header className="disagrea-story-head">
        <div>
          <p className="eyebrow">Chroniques event</p>
          <h3 id="disagrea-story-title">{chapter.title}</h3>
          <p className="disagrea-story-subtitle">{chapter.subtitle}</p>
        </div>
        <span className="disagrea-story-progress">
          {pageIndex + 1} / {pageCount}
        </span>
      </header>

      <article className="disagrea-story-reader">
        <StoryPageBackground page={page} />
        <div className="disagrea-story-reader-overlay">
          <p className="disagrea-story-location">{page.location}</p>
          {page.companionId ? (
            <img
              alt=""
              className="disagrea-story-companion-cutout"
              src={`/assets/companions/${page.companionId}/affinity-1.png`}
            />
          ) : null}
          <div className="disagrea-story-text">
            {page.paragraphs.map((paragraph, index) => (
              <p key={`${page.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <div className="disagrea-story-nav">
        <button className="secondary" disabled={pageIndex === 0} type="button" onClick={goPrev}>
          ← Page précédente
        </button>
        <div aria-label="Pages du chapitre" className="disagrea-story-dots" role="tablist">
          {chapter.pages.map((entry, index) => (
            <button
              aria-label={`Page ${index + 1} — ${entry.location}`}
              aria-selected={index === pageIndex}
              className={index === pageIndex ? 'active' : undefined}
              key={entry.id}
              role="tab"
              type="button"
              onClick={() => setPageIndex(index)}
            />
          ))}
        </div>
        <button
          className="secondary"
          disabled={pageIndex >= pageCount - 1}
          type="button"
          onClick={goNext}
        >
          Page suivante →
        </button>
      </div>

      <aside className="disagrea-story-variants">
        <div>
          <strong>{DISAGREA_ALTERNATE_VARIANTS.title}</strong>
          <p>{DISAGREA_ALTERNATE_VARIANTS.description}</p>
        </div>
        <ul className="disagrea-story-variants-list">
          {DISAGREA_ALTERNATE_VARIANTS.companionIds.map((companionId) => (
            <li key={companionId}>
              <img
                alt=""
                className="disagrea-story-variants-portrait"
                src={`/assets/companions/${companionId}/affinity-1.png`}
              />
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}
