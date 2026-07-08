# État du projet — IDLE Isekai Chill (Havre des Brumes)

> **Source de vérité courante** — mise à jour : 2026-07-08  
> **Clôture 2.2.0 :** [`changelog/CHANGELOG_2_2.md`](./changelog/CHANGELOG_2_2.md) · **Kickoff 2.2.1 :** [`changelog/CHANGELOG_2_2_1.md`](./changelog/CHANGELOG_2_2_1.md)

## Résumé

Jeu idle / collection cozy fantasy, jouable navigateur. **Release 2.1.0.0 livrée** sur `main`. **Phase 2.2.0 clôturée** (inventaire 2026-07-08) — **patch 2.2.1** en préparation sur `feature/2.2`.

| Élément | État |
|---------|------|
| Branche prod | `main` @ `b91b6fb` |
| Branche dev | `feature/2.2` |
| Semver npm | `2.2.0` → **`2.2.1`** au prochain push C |
| Label UI | `v2.2.0.704` — **reset X/Y recommandé** au kickoff 2.2.1 |
| Build | **OK** (`npm run build`) |
| Lint global | **KO** (~33 préexistants, non bloquant) |
| Tests auto | `audit:dev-log-coverage`, validateurs domaine, smoke manuel |
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

- **Aucune suppression définitive** — déplacer vers `old_2_2/old_2_2_1/` (annulé + mini jeu lien), `old_assets/`, `old_v2.1/`
- Manifeste moves : [`docs/CLEANUP_2_2_1_MANIFEST.md`](../CLEANUP_2_2_1_MANIFEST.md)
- Pas de modification assets sans demande explicite Guillaume
- Pas de push `main` / merge sans go explicite
- Décideur : **Guillaume**

## Phase 2.2 — statut lots (2026-07-08)

| Statut | Lots principaux |
|--------|-----------------|
| **Terminé** | Lanceur + lab `:5174`, Roue du Destin (hors cutouts), Parler Lyra aff.5 validateurs auto, hooks X/Y, retouches hub/mini-jeux |
| **À compléter (staging)** | Smoke in-game Parler Lyra aff.5 |
| **Entamé (2.2.1)** | Crash cutouts Roue · Color Toon lab (`staging/mini jeu/color 2/`) |
| **Annulé → `old_2_2/old_2_2_1/`** | Corpus Parler V2 ChatGPT · Maeve/Runa · Lyra aff.3 essai |
| **Delayé** | Warm-up gacha/village/SW, merge main, CI Parler strict |

## Wording onboarding — harmonisé (2026-07-01)

Terminologie alignée hub mini-jeux (`buildingActivities.ts`) :

| Zone | Libellé retenu | Fichier |
|------|----------------|---------|
| Mini-jeu worksite | **Chantier du havre** | hub, quêtes `play-minigame` |
| Mini-jeu capture | **Chasse aux Myrions** | hub, tutorial étape 3 |
| Mini-jeu dressage | **Refuge des Myrions** | hub, tutorial étape 5 |
| Amélioration bâtiment | **Bâtiments du havre** | tutorial étape 2, quêtes `upgrade-building` |

Ce n'est **pas** le mini-jeu Chantier Myrion (`myrionWorksite*`) — autre système.

**Statut :** fait en 2.2 (`tutorialObjectives.ts`, `infiniteQuests.ts`).

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
