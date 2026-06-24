import { publicAssetUrl } from './publicAssetUrl'

/** Dossier public : public/assets/companions/ */
export const COMPANION_ASSET_ROOT = publicAssetUrl('assets/companions')

/** Ancien emplacement : public/companions/ */
export const LEGACY_COMPANION_ASSET_ROOT = publicAssetUrl('companions')

/** Fonds de scène partagés (réutilisables entre compagnons / mini-jeux). */
export const COMPANION_SCENE_BACKGROUND_ROOT = publicAssetUrl('assets/companions/backgrounds')

/** Ratio portrait compagnon (aligné sur les placeholders SVG 512×704). */
export const COMPANION_PORTRAIT_ASPECT = 512 / 704

const companionRelative = (companionId: string, level: number) =>
  `assets/companions/${companionId}/affinity-${level}.png`

const legacyCompanionRelative = (companionId: string, level: number) =>
  `companions/${companionId}/affinity-${level}.png`

const companionCutoutRelative = (companionId: string, level: number) =>
  `assets/companions/${companionId}/cutout-${level}.png`

const companionBackgroundRelative = (companionId: string, level: number) =>
  `assets/companions/${companionId}/background-${level}.png`

const companionBackgroundWideRelative = (companionId: string, level: number) =>
  `assets/companions/${companionId}/background-${level}-wide.png`

const companionSceneBackgroundRelative = (sceneId: string) =>
  `assets/companions/backgrounds/${sceneId}.png`

/** Portrait composé legacy (personnage + décor en un seul PNG). */
export const companionAssetPath = (companionId: string, level = 1) =>
  publicAssetUrl(companionRelative(companionId, level))

export const companionAssetPathCandidates = (companionId: string, level = 1) => [
  companionRelative(companionId, level),
  legacyCompanionRelative(companionId, level),
]

/** Personnage détouré seul — généré en premier, sans décor. */
export const companionCutoutPath = (companionId: string, level = 1) =>
  publicAssetUrl(companionCutoutRelative(companionId, level))

export const companionCutoutPathCandidates = (companionId: string, level = 1) => [
  companionCutoutRelative(companionId, level),
]

/** Décor de palier d'affinité — généré séparément, sans personnage. */
export const companionBackgroundPath = (companionId: string, level = 1) =>
  publicAssetUrl(companionBackgroundRelative(companionId, level))

export const companionBackgroundPathCandidates = (companionId: string, level = 1) => [
  companionBackgroundRelative(companionId, level),
]

/** Fond palier format paysage (PC) — fallback sur portrait si absent. */
export const companionBackgroundWidePathCandidates = (companionId: string, level = 1) => [
  companionBackgroundWideRelative(companionId, level),
  companionBackgroundRelative(companionId, level),
]

/** Décor partagé (ex. auberge, forêt) — superposable avec n'importe quel cutout. */
export const companionSceneBackgroundPath = (sceneId: string) =>
  publicAssetUrl(companionSceneBackgroundRelative(sceneId))

export const companionSceneBackgroundPathCandidates = (sceneId: string) => [
  companionSceneBackgroundRelative(sceneId),
]

export type CompanionPortraitLayerSources = {
  cutout: string[]
  background: string[]
  /** Fond palier paysage (PC) — portrait en fallback. */
  backgroundWide?: string[]
  /** Fond alternatif (mini-jeu, variante de contexte). */
  sceneBackground?: string[]
  composed: string[]
}

export const companionPortraitLayerSources = (
  companionId: string,
  level = 1,
  sceneId?: string,
): CompanionPortraitLayerSources => ({
  cutout: companionCutoutPathCandidates(companionId, level),
  background: companionBackgroundPathCandidates(companionId, level),
  sceneBackground: sceneId ? companionSceneBackgroundPathCandidates(sceneId) : undefined,
  composed: companionAssetPathCandidates(companionId, level),
})

export const companionChibiPath = (companionId: string) =>
  publicAssetUrl(`assets/companions/${companionId}/chibi.png`)

export const companionChibiPathCandidates = (companionId: string) => [
  `assets/companions/${companionId}/chibi.png`,
  `companions/${companionId}/chibi.png`,
]

/** Compagnons avec un vrai fichier chibi.png (miniatures inventaire). */
export const COMPANIONS_WITH_CHIBI = new Set(['talia'])

/** Miniature : chibi si dispo, sinon portrait affinity de base. */
export const companionMiniaturePath = (companionId: string, level = 1) =>
  COMPANIONS_WITH_CHIBI.has(companionId)
    ? companionChibiPath(companionId)
    : companionAssetPath(companionId, level)

export const companionMiniaturePathCandidates = (companionId: string, level = 1) =>
  COMPANIONS_WITH_CHIBI.has(companionId)
    ? companionChibiPathCandidates(companionId)
    : companionAssetPathCandidates(companionId, level)
