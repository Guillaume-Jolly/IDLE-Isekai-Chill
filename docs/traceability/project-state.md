# État du projet — IDLE Isekai Chill (Havre des Brumes)

> **Source de vérité courante** — mise à jour : 2026-07-01  
> Documents historiques archivés : [`old_v2.1/docs_wip/docs-finished-2.1/`](../old_v2.1/docs_wip/docs-finished-2.1/PROJECT_STATE.md) (audit 2026-06-22).

## Résumé

Jeu idle / collection cozy fantasy, jouable navigateur. **Release 2.1.0.0 livrée** sur `main` (tag `v2.1.0.0`). **Phase 2.2 active** sur `feature/2.2` — retouches libres, nettoyage non destructif.

| Élément | État |
|---------|------|
| Branche prod | `main` @ `b91b6fb` |
| Branche dev | `feature/2.2` — kickoff fait 2026-06-30 |
| Semver npm | `2.2.0` (branche feature) |
| Label UI | `v2.2.0.{X}` — hook Cursor auto-bump X |
| Build | **OK** (`npm run build`) |
| Lint global | **KO** (~33 préexistants, non bloquant) |
| Tests auto | Aucun framework ; `tnr:baseline` + smoke manuel |
| Sauvegarde | `localStorage` — migrations versionnées |

## Stack

React 19 · TypeScript ~6.0 · Vite 8 · Pixi.js (optionnel Live2D) · assets via `vite.repo-assets.ts`.

## Fonctionnalités majeures (2.1)

- Village panorama, 8+ bâtiments, hub mini-jeux
- 19 compagnons, 190 conversations de lien, 5 paliers affinité
- Gacha, inventaire, quêtes, production passive
- Myrions : capture, refuge, dressage, reproduction
- **Ferme lunaire** : 15 biomes, 45 filons, supervision, prestige
- Promenade Myrions (ex-Refuge des Familiers — libellés harmonisés MVP 20)

## Structure repo (simplifié)

```
src/              Application React
assets/           Source-of-truth visuels (Assets 2.0)
public/           Shell statique minimal
old_assets/       Archive cold storage
old_v2.1/         Archive locale post-2.1 (gitignorée — hors Git public)
docs/agent-guide/ Onboarding agents
docs/traceability/ Changelog, project-state, audits actifs
staging/playbooks/  Procédures opérationnelles (seul staging actif)
scripts/          Import, validate, bump version
.ai/              Stub agent local (gitignoré — optionnel)
```

## Pipeline validation (release / CI)

Ordre canonique :

```bash
npm run validate:companion-bonds   # 19 compagnons, 190 bonds
npm run validate:link-corpus       # 7500 conversations
npm run tnr:baseline               # bonds + corpus + build + manifest
npm run build
```

CI GitHub : [`.github/workflows/validate.yml`](../../.github/workflows/validate.yml) — bonds, corpus, build (sans lint).

`npm run lint` — optionnel ; ne pas bloquer une livraison pour le lint global.

## Versionnement UI

Format : `v{semver}.{X}` ou `v{semver}.{X}.{Y}` — voir [`docs/agent-guide/05-politique-versionnement.md`](../agent-guide/05-politique-versionnement.md).

- **X** : hook [`.cursor/hooks.json`](../../.cursor/hooks.json) ou `npm run version:prompt` — opt-out : `même X`
- **Y** : `npm run version:task` (agent — HMR ne bump plus Y)
- **DEV_LOG** : [`DEV_LOG_2_2.md`](./changelog/DEV_LOG_2_2.md) — sections ⚠️ + commits atomiques par Y
- **Kickoff** : [`07-kickoff-nouvelle-version.md`](../agent-guide/07-kickoff-nouvelle-version.md)

**Kickoff 2.2 :** fait 2026-06-30 — reset UI depuis `v2.1.0.128`.

## Archives & règles dures

- **Aucune suppression définitive** — déplacer vers `old_assets/` ou `old_v2.1/`
- Pas de modification assets sans demande explicite Guillaume
- Pas de push `main` / merge sans go explicite
- Décideur : **Guillaume**

## Wording onboarding — « Chantier du havre » (non fait)

**Pourquoi c'est encore listé :** la release 2.1 a harmonisé le hub (Promenade Myrions, Ferme lunaire, etc.), mais **pas** le panneau objectifs tutorial (`src/data/tutorialObjectives.ts`).

| Zone | Libellé actuel | Fichier |
|------|----------------|---------|
| Objectif onboarding étape 2 | « Chantier du havre » | `tutorialObjectives.ts` |
| Quête infinie (upgrade bâtiment) | « Chantier du village » | `infiniteQuests.ts` |
| Objectif onboarding étape 5 | « Refuge des brumes » | `tutorialObjectives.ts` |
| Hub mini-jeux | « Promenade Myrions » | `buildingActivities.ts` |

Ce n'est **pas** le mini-jeu Chantier Myrion (`myrionWorksite*`) — autre système.

**Statut :** réserve reportée en 2.2, jamais implémentée. À trancher (havre vs village vs harmoniser avec Promenade) sur demande Guillaume.

| Sujet | Fichier |
|-------|---------|
| Release 2.1 (archive) | `old_v2.1/docs_release_2.1/` |
| Cleanup résidus | `docs/CLEANUP_2_2_RESIDUAL_MANIFEST.md` |
| Brief agent 2.2 | `docs/HANDOFF_2_2_AGENT_BRIEF.md` |
| Agent rules | `AGENTS.md` |
| Playbooks | `staging/playbooks/` |

## Réserves connues (2.2 backlog libre)

- ESLint global (~33)
- `worksiteDevUnlock` (`import.meta.env.DEV`)
- Asset `ruines-lierre-ancien.png` — silhouette faible
- Chunk JS > 500 kB (warning Vite)
- Flags dev gacha (`DEV_*`) — à traiter avant prod stable
- **Wording onboarding tutorial** — voir ci-dessous
