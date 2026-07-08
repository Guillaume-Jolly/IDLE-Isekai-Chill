# Changelog phase 2.2 — état des lieux (clôture C)

**Date d'inventaire :** 2026-07-08 (rev. Guillaume)  
**Branche :** `feature/2.2`  
**Semver npm :** `2.2.0` → cible **`2.2.1`** au prochain `git push` branche (hook **C+1**)  
**Label UI :** ~`v2.2.0.704` (voir `build-revision.json`)  
**Main prod :** `2.1.0.0` @ `b91b6fb` — **non mergé**  

**Suite :** [`CHANGELOG_2_2_1.md`](./CHANGELOG_2_2_1.md) — kickoff patch 2.2.1  

---

## Légende

| Statut | Signification |
|--------|----------------|
| **Terminé** | Boucle fermée en 2.2 : utilisable, validé auto ou smoke OK |
| **À compléter** | Livré partiellement — reste en **staging** / smoke manuel |
| **Entamé** | Travail significatif ; critère de fin en **2.2.1** |
| **Delayé** | Report volontaire (backlog 2.2.1+) |
| **Annulé** | Abandonné — **move** vers `old_2_2/` (voir politique archive) |

---

## Politique archive (clôture — **aucune suppression**)

| Destination | Contenu |
|-------------|---------|
| **`old_2_2/old_2_2_1/`** | Archive patch 2.2.1 (nested dans `old_2_2/`) |
| **`old_2_2/old_2_2_1/annule/`** | Lots annulés (Maeve/Runa, parler-scenarios) |
| **`old_2_2/old_2_2_1/mini jeu lien/`** | Reliquats mini-jeu Lien par compagnon |
| **`old_2_2/old_2_2_1/reliquats/`** | Scratch dev |
| **`staging/mini jeu/color 2/`** | Color Toon entamé (lab `:5174`) |
| **`staging/companion-visual-pack/`** | Cutouts émotion v3 WIP |
| **`assets/`** | Livrables intégrés uniquement (pas de WIP Color Toon) |

Manifeste : [`CLEANUP_2_2_1_MANIFEST.md`](../../CLEANUP_2_2_1_MANIFEST.md)

---

## Terminé

### Infra repo, hooks & process

| Lot | Détail |
|-----|--------|
| Kickoff 2.2 | Branche `feature/2.2`, semver `2.2.0`, `DEV_LOG_2_2.md` |
| Schéma A.B.C.X.Y | Hooks git (A/B/C), hooks Cursor (X/Y), docs agent |
| Fix hooks DEV_LOG (2026-07-08) | Ancre `1 commit par Y` ; injection X rétablie ; `audit:dev-log-coverage` |
| Projet REFERENCE | Hub processus partagés |
| Cleanup post-2.1 | Passes 1–3 → `old_2_2/` |
| DEV_LOG / changelog | Backfill X/Y, `CHANGELOG_2_2.md`, `PRODUCT_CHANGELOG.md` auto |

### Dev tooling — lanceur + lab

| Lot | Détail |
|-----|--------|
| Havre Dev Launcher | Dashboard `:9221`, Vite jeu `:5173`, lab `:5174`, logs 24 h, monitoring |
| Lab mini-jeux `:5174` | WIP isolé — lancement direct Color Toon, pas de promotion auto vers `:5173` |
| Version / historique | Label UI, onglets historique app + lanceur, raccourcis barre des tâches |

### Mini-jeu — Roue du Destin

| Lot | Détail |
|-----|--------|
| Moteur Disgaea + Havre | Seed JSON, packs, physique, audio, calibrateurs, fiche finale |
| Validateurs | `validate:destiny-wheel` OK |
| **Statut joueur** | **Jouable** — cutouts personnages : voir **Entamé** |

### Parler — piste B curée (Lyra aff. 5)

| Lot | Détail |
|-----|--------|
| Corpus H + FMC | 21×2 échanges, 5 packs |
| Validateurs auto | S50–S55, walk 10/10 **OK** |
| Handoff & modops | Piste B, rubrique, walkthrough |
| **À compléter (staging)** | **Smoke in-game** manuel non coché — [`staging/playbooks/parler-smoke.md`](../../../staging/playbooks/parler-smoke.md) Partie 2 · pas bloquant clôture 2.2 |

### UX transverse & retouches diverses

| Lot | Détail |
|-----|--------|
| Wording hub / tutorial / quêtes | Chantier, Chasse, Refuge, Bâtiments ; quêtes infinies v1 |
| Gate connexion | Plein écran, déconnexion, revoir intro |
| Onglet Lien | Discussions masquées par défaut |
| Hub mini-jeux | Rubrique « Nouveaux mini-jeux » ; **template menu latéral** (`MinigameSideMenuShell`, refuge Dressage) |
| Chantier havre | BG plein écran, minerais repositionnés |
| Calibrateur scène | `MinigameSceneLayoutCalibrator` (pattern Roue / Hunt) |
| Warm-up assets (pilote) | Splash critique — sans SW |
| React StrictMode | Warnings `useEffect` corrigés (pas masqués) |

### Relecture corpus — piste A (bulk)

| Lot | Détail |
|-----|--------|
| Lyra aff. 1 | Audit tone lot 1 |
| Profils compagnons v1 | `docs/traceability/companions/*_PROFILE.md` — ETNA, FINN, LAHARL, NOA, RORIC, TALIA (validé doc) |

---

## Entamé (2.2.1)

| Lot | État | Prochaine étape |
|-----|------|-----------------|
| **Roue du Destin — crash cutouts** | Bloque démo personnages | Fix + smoke Disgaea/Havre — **P0** |
| **Color Toon (lab `:5174`)** | Lab OK · masques en `staging/mini jeu/color 2/` | Promotion `assets/` seulement après validation Guillaume |
| **Clôture git / tri lots** | Surface locale non commitée | Triage lanceur / roue / lab / parler curé — sans pression merge |
| **Mode dark** | Toggle seul · UI incomplète | Report ou v2 tokens CSS |
| **Quêtes 10 jours cumulables** | Infini v1 fait | Spec si toujours voulu |

---

## Delayé (accord Guillaume)

| Lot | Motif |
|-----|--------|
| Warm-up complet | Gacha, village, service worker — après pilote |
| Durcissement CI Parler | FM3 strict, score A→G |
| Extension aff. 5 autres compagnons | Modèle Lyra |
| ESLint global (~33) | Non bloquant |
| Chunk JS > 500 kB | Seed roue embarqué |
| Flags `DEV_*` | Avant prod stable |
| Merge `main` / MEP (A) | Décision Guillaume |
| Piste A bulk (14 compagnons) | Long terme |

---

## Annulé → archive `old_2_2/old_2_2_1/`

| Lot | Motif | Destination |
|-----|--------|-------------|
| **Parler Phase C / Maeve / Runa** | Hors piste B curée | `old_2_2/old_2_2_1/annule/` + `mini jeu lien/{maeve,runa}/` |
| **Lyra aff. 3 (essai)** | Bon essai, non intégré | `mini jeu lien/lyra/` |
| **Outils parler multi-compagnon** | Lot Maeve/Runa | `mini jeu lien/outils/` |
| **Skills Cursor parler** | Comm IA externe | `mini jeu lien/skills-cursor/` |

*Exécuté 2026-07-08 — voir `CLEANUP_2_2_1_MANIFEST.md`.*

---

## Reliquats lots terminés → `old_2_2/old_2_2_1/reliquats/`

Après tri git / clôture C : docs WIP, scripts one-shot, doublons docs, exports launcher obsolètes liés à des lots **terminés** (pas les annulés ci-dessus).

Voir [`CLEANUP_2_2_1_MANIFEST.md`](../../CLEANUP_2_2_1_MANIFEST.md).

---

## Synthèse

| Statut | ~% | Notes |
|--------|-----|-------|
| Terminé | ~65 % | Lanceur, lab, roue (hors cutouts), Parler Lyra aff.5 auto, infra hooks |
| Entamé | ~15 % | Cutouts roue, Color Toon staging |
| Delayé | ~15 % | Warm-up, prod, CI strict |
| Annulé | ~5 % | V2 ChatGPT, Maeve/Runa Parler, Lyra aff.3 essai → `old_2_2/old_2_2_1/` |

---

## Liens

| Document | Rôle |
|----------|------|
| [`CHANGELOG_2_2_1.md`](./CHANGELOG_2_2_1.md) | Kickoff patch 2.2.1 |
| [`DEV_LOG_2_2.md`](./DEV_LOG_2_2.md) | Journal X/Y |
| [`VERSION-INDEX.md`](./VERSION-INDEX.md) | Jalons semver |
| [`project-state.md`](../project-state.md) | État projet |

---

*Clôture 2.2.0 validée par Guillaume — 2026-07-08.*
