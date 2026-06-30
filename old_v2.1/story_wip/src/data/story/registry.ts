import type { SceneChapter, SceneChapterKind } from '../sceneGenerator'
import brannStoryClou from './chapters/brann-story-clou-promesse.json'
import brannStoryEcorce from './chapters/brann-story-ecorce-accueil.json'
import elwenStorySceau from './chapters/elwen-story-sceau-archive.json'
import etnaDisagreaBalcon from './chapters/etna-disagrea-balcon-confiance.json'
import flonneDisagreaCloche from './chapters/flonne-disagrea-cloche-douce.json'
import flonneDisagreaPlume from './chapters/flonne-disagrea-plume-blanche.json'
import irisStoryPollen from './chapters/iris-story-pollen-lune.json'
import kaelStoryRideau from './chapters/kael-story-rideau-baisse.json'
import korrenStoryPiste from './chapters/korren-story-piste-partagee.json'
import laharlDisagreaTrone from './chapters/laharl-disagrea-trone-petit.json'
import lyraStoryEncre from './chapters/lyra-story-encre-froide.json'
import lyraStoryMarge from './chapters/lyra-story-deuxieme-marge.json'
import lyraStoryPagePartagee from './chapters/lyra-story-page-partagee.json'
import maeveStoryMarche from './chapters/maeve-story-marche-etoile.json'
import marinStoryMaree from './chapters/marin-story-maree-douce.json'
import miraStoryRuban from './chapters/mira-story-ruban-test.json'
import namiStoryMiroir from './chapters/nami-story-soupe-miroir.json'
import namiStorySoupe from './chapters/nami-story-soupe-partagee.json'
import nyxStoryPhalene from './chapters/nyx-story-phalene-brume.json'
import runaStoryLame from './chapters/runa-story-premiere-lame.json'
import serenStoryGarde from './chapters/seren-story-garde-douce.json'
import soleneStoryEau from './chapters/solene-story-eau-statique.json'
import soraStoryClochette from './chapters/sora-story-clochette-douce.json'
import taliaStoryFil from './chapters/talia-story-fil-guide.json'
import thorneStoryEchelle from './chapters/thorne-story-echelle-savoir.json'

export const STORY_CHAPTERS: SceneChapter[] = [
  lyraStoryPagePartagee as SceneChapter,
  lyraStoryEncre as SceneChapter,
  lyraStoryMarge as SceneChapter,
  namiStorySoupe as SceneChapter,
  namiStoryMiroir as SceneChapter,
  irisStoryPollen as SceneChapter,
  runaStoryLame as SceneChapter,
  serenStoryGarde as SceneChapter,
  taliaStoryFil as SceneChapter,
  maeveStoryMarche as SceneChapter,
  soleneStoryEau as SceneChapter,
  miraStoryRuban as SceneChapter,
  elwenStorySceau as SceneChapter,
  kaelStoryRideau as SceneChapter,
  soraStoryClochette as SceneChapter,
  brannStoryEcorce as SceneChapter,
  brannStoryClou as SceneChapter,
  thorneStoryEchelle as SceneChapter,
  nyxStoryPhalene as SceneChapter,
  marinStoryMaree as SceneChapter,
  korrenStoryPiste as SceneChapter,
  etnaDisagreaBalcon as SceneChapter,
  flonneDisagreaPlume as SceneChapter,
  flonneDisagreaCloche as SceneChapter,
  laharlDisagreaTrone as SceneChapter,
]

export function storyChaptersByKind(kind: SceneChapterKind): SceneChapter[] {
  return STORY_CHAPTERS.filter((chapter) => chapter.kind === kind)
}

export function storyChapterById(id: string): SceneChapter | undefined {
  return STORY_CHAPTERS.find((chapter) => chapter.id === id)
}

export function storyChaptersForCompanion(
  companionId: string,
  affinity = 5,
): SceneChapter[] {
  return STORY_CHAPTERS.filter(
    (chapter) =>
      chapter.companionId === companionId &&
      chapter.kind === 'story' &&
      affinity >= (chapter.minAffinity ?? 1) &&
      affinity <= (chapter.maxAffinity ?? 5),
  )
}

export function unlockedStoryChapters(
  companionAffinities: Record<string, number>,
): SceneChapter[] {
  return STORY_CHAPTERS.filter((chapter) => {
    if (chapter.kind !== 'story') return false
    const affinity = companionAffinities[chapter.companionId] ?? 1
    return (
      affinity >= (chapter.minAffinity ?? 1) &&
      affinity <= (chapter.maxAffinity ?? 5)
    )
  })
}

export function pickStoryChapterForCompanion(
  companionId: string,
  affinity: number,
): SceneChapter | undefined {
  return storyChaptersForCompanion(companionId, affinity)[0]
}
