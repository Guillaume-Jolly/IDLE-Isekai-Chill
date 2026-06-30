import { useEffect, useMemo, useState } from 'react'
import {
  unlockedStoryChapters,
  storyChaptersForCompanion,
} from '../../data/story/registry'
import { StoryReader } from './StoryReader'
import '../DisagreaStoryPanel.css'

type VillageStoryPanelProps = {
  companionAffinities: Record<string, number>
  /** Ouvre directement le premier chapitre d'un compagnon (depuis onglet Liens). */
  initialCompanionId?: string | null
}

export function VillageStoryPanel({
  companionAffinities,
  initialCompanionId = null,
}: VillageStoryPanelProps) {
  const unlocked = useMemo(
    () => unlockedStoryChapters(companionAffinities),
    [companionAffinities],
  )

  const defaultChapterId =
    initialCompanionId
      ? storyChaptersForCompanion(initialCompanionId, companionAffinities[initialCompanionId] ?? 1)[0]
          ?.id
      : unlocked[0]?.id ?? ''

  const [chapterId, setChapterId] = useState(defaultChapterId)

  useEffect(() => {
    if (!initialCompanionId) return
    const first = storyChaptersForCompanion(
      initialCompanionId,
      companionAffinities[initialCompanionId] ?? 1,
    )[0]
    if (first) setChapterId(first.id)
  }, [initialCompanionId, companionAffinities])

  const chapter = unlocked.find((entry) => entry.id === chapterId) ?? unlocked[0]

  if (unlocked.length === 0) {
    return (
      <section className="disagrea-story panel">
        <header className="disagrea-story-head">
          <div>
            <p className="eyebrow">Histoires du havre</p>
            <h3>Scènes du village</h3>
            <p className="disagrea-story-subtitle">
              Augmente l&apos;affinité avec les compagnons pour débloquer de courtes scènes.
            </p>
          </div>
        </header>
      </section>
    )
  }

  return (
    <section aria-labelledby="village-story-title" className="disagrea-story panel">
      <header className="disagrea-story-head">
        <div>
          <p className="eyebrow">Histoires du havre</p>
          <h3 id="village-story-title">Scènes du village</h3>
          <p className="disagrea-story-subtitle">
            Courtes scènes cozy — lore, fonds variés, cutouts animés.
          </p>
        </div>
        <span className="disagrea-story-progress">{unlocked.length} dispo</span>
      </header>

      <label className="disagrea-story-chapter-pick">
        Chapitre
        <select value={chapter?.id ?? ''} onChange={(event) => setChapterId(event.target.value)}>
          {unlocked.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title} ({entry.companionId})
            </option>
          ))}
        </select>
      </label>

      {chapter ? (
        <StoryReader
          chapter={chapter}
          key={chapter.id}
          affinity={companionAffinities[chapter.companionId] ?? 3}
        />
      ) : null}
    </section>
  )
}
