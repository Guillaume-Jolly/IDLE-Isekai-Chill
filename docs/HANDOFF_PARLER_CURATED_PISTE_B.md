# Passage agent — Piste B : Parler curé aff. 4–5 (Lyra)

**Date :** 2026-07-03  
**Phase repo :** `feature/2.2` · semver `2.2.0`  
**Statut :** validation auto OK · **Phase C in-game = checklist manuelle** ([`staging/playbooks/parler-smoke.md`](../../staging/playbooks/parler-smoke.md) Partie 2)

---

## Ce qu’on appelle « piste B »

| Piste | Objet | Source de vérité |
|-------|--------|------------------|
| **A** | Corpus Lien bulk (7500 scénarios) | `src/data/linkCorpusV2.json` · relecture par lots compagnon |
| **B** | **Parler curé** aff. 1–2–4–5 (échanges modèle + packs session) | `scripts/references/link-corpus/curated/*.json` · builder + validateurs |

**Piste B en cours = aff. 5 Lyra** : 21 échanges × **2 corpus** (MC homme + MC femme), 5 packs session, NSFW, épilogues round + acte.

Ne pas confondre avec le brief phase 2.2 général : [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md).

---

## Architecture contenu (piste B)

```
build-intimate-action-corpora.mjs     ← SOURCE DE VÉRITÉ textes aff. 4/5 H+F
        ↓
lyra-aff5-curated-12.json             ← MC homme (21 ex.)
lyra-aff5-curated-12-female-mc.json   ← MC femme (miroir anatomique)
        ↓ import statique
src/data/conversations/curatedCorpus.ts
        ↓
ConversationGame.tsx                  ← UI phases + packFinale
```

**Aff. 4** : même pipeline, 12 échanges, 4 packs (suggestif, pas cru aff. 5).  
**Aff. 1–2** : corpus curés séparés, rubrique A→G plus stricte sur aff. 1–2.

### Packs aff. 5 (`PACKS_AFF5`)

| Pack | Label | Ex. | Notes |
|------|-------|-----|-------|
| `pack-1` | Bibliothèque — verrou | 01–03 | Verrou **déjà tiré** ; épilogues round au **présent** |
| `pack-2` | Chambre — peignoir | 04–06 | Dernier ex. peut teaser (« dans deux heures ») |
| `pack-3` | Verrière — nu | 07–09 | Pas de prolepse mid-pack |
| `pack-4` | Toit — aube | 10–12 | **`packIntimateFinale` / `packIntimateFinaleLow`** (écran acte) |
| `pack-5` | Bibliothèque — silence | 13–21 | Spectateur ex. 13–19 · craquage 20 · libération 21 · épilogue d’acte |

### Champs échange (aff. 4–5)

| Champ | Rôle |
|-------|------|
| `bridge` | Pont depuis ex. précédent ; segments `;` = bulles UI |
| `companionAction` | 3e personne, action Lyra |
| `companionLine` | Réplique parlée Lyra (pas didascalie seule) |
| `choices[]` | `tone`, `text`, `score` (+3/+2/+1/+0), `emotion`, `reaction` |
| `powerDynamic` | `companion_dominant`, `mutual`, etc. — aligné choix +3 (S29) |
| `intimateFinale` | Épilogue round score ≥ 2 (aff. 5) |
| `intimateFinaleLow` | Épilogue round score ≤ 1 (optionnel, map par index) |
| `packIntimateFinale` | Sur **meta.sessionPacks[]** — fin d’acte high (pack-4, pack-5) |

**Épilogues aff. 5** : tableaux `AFF5_FINALE_MALE` / `AFF5_FINALE_FEMALE` + maps `AFF5_FINALE_LOW_*` dans le builder — **indices alignés sur l’index échange 0–20**.

---

## Règles narratives verrouillées (ne pas casser)

1. **Prolepse mid-pack interdite** (high finales) : « prochaine fois », « refaire sous le verrou », « déjà fini », « dans une/deux heures », « retrouve-moi » (sauf dernier ex. packs 1–4 ; hooks pack-5 volontaires ex. 18→19 cloche).
2. **Pack-1** : scène **sous verrou actif** — clôtures type « Reste là », « le verrou tient », « On sort quand je le dis ».
3. **Pack-5 spectateur** (ex. 13–19) : `companionLine` = Lyra → **visiteur** ; consignes MC via `companionAction` / réaction.
4. **Anti-calque FMC** : réécrire pont/action/épilogue — pas copier le corpus H (ex. corrigés : ex. 02–03 pack-1 FMC = MC **sur la table**).
5. **S47** : épilogue aligné sur **qui stimule qui** dans `companionAction`.
6. **Un seul** `intimateFinale` / `intimateFinaleLow` par échange — pas par branche de choix (limitation connue).

---

## Pipeline outils (ordre type)

```bash
# 1 — Éditer le builder (pas le JSON à la main sauf urgence)
#    scripts/references/link-corpus/curated/build-intimate-action-corpora.mjs

npm run build:intimate-action-corpora

# 2 — Docs MD sync (H par défaut ; FMC explicitement)
npm run sync:lyra-aff5-doc
node scripts/references/link-corpus/curated/sync-lyra-curated-doc-from-json.mjs scripts/references/link-corpus/curated/lyra-aff5-curated-12-female-mc.json

# 3 — Validation complète + golden
npm run validate:curated-parler:aff5:update-golden
node scripts/references/link-corpus/curated/validate-curated-parler-full.mjs scripts/references/link-corpus/curated/lyra-aff5-curated-12-female-mc.json --update-golden
npm run validate:curated-parler:aff5:both

# 4 — Déroulé cohérence packs (10 = 5 packs × H+F)
npm run walk:pack:aff5:all
node scripts/references/link-corpus/curated/walk-all-aff5-packs.mjs --profile playful

# 5 — Regression globale si doute
npm run build
npm run validate:link-corpus
```

### Scripts clés

| Script | Rôle |
|--------|------|
| `build-intimate-action-corpora.mjs` | Génère JSON aff. 4/5 H+F |
| `validate-curated-parler-semantics.mjs` | Règles S0–S49, FR, LQ |
| `score-curated-exchange.mjs` | Grille A→G · B8 spectateur |
| `validate-curated-parler-full.mjs` | Chaîne complète + golden |
| `walk-pack-coherence.mjs` | Déroulé 1 pack · codes WALK-* |
| `walk-all-aff5-packs.mjs` | 5 packs × 2 corpus |

### Codes walk (`walk-pack-coherence.mjs`)

| Code | Signification |
|------|----------------|
| `WALK-CONT` | Pont ne raccroche pas à N−1 |
| `WALK-SPACE` | Repose sur le lit alors que pont dit déjà dessus |
| `WALK-SPEC-LINE` / `INT` / `REACT` | Spectateur pack-5 |
| `WALK-DOM` / `PWR` | Choix +3 vs action / powerDynamic |
| `WALK-FLIP` | Inversion dominant/passif incohérente avec le fil |
| `WALK-THREAD` | Mot-clé fil pack absent |
| **`WALK-FINALE`** | Prolepse épilogue round mid-pack |

`walk:pack:aff5:all` tourne en profil **`romantic`** (+3 partout). Pour épilogues **low** et acte low, rejouer pack-4 avec `--profile playful` (voir modop Phase A.2).

Modop test manuel : [`docs/traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md`](./traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md)

Rubrique sémantique : [`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`](./traceability/link-corpus-review/CURATED_EXCHANGE_RUBRIC_AFF4-5.md)

---

## UI in-game (`ConversationGame.tsx`)

Phases : `intro` → `round` → `reaction` → `finale` → **`packFinale`** (pack-4/5) → `result`.

- Score round ≥ 2 → `intimateFinale` ; ≤ 1 + low présent → `intimateFinaleLow`.
- Fin d’acte : moyenne session vs seuil `roundCount * 2` → `packIntimateFinale` ou `packIntimateFinaleLow`.
- Dev picker : `?pack=pack-N` · localStorage `parler-dev-curated-selection`.
- NSFW requis (options jeu) pour aff. 5.

**Test manuel obligatoire** avant de marquer un pack « validé » — Phase C du modop.

---

## État au handoff (2026-07-03)

### Fait · auto vert

- Pack-1 ex. 1–3 H+F : épilogues présent sous verrou
- Pack-3 ex. 8, pack-4 ex. 11 : prolepses « prochaine fois » retirées (H+F)
- FMC ex. 3 : épilogue spatial corrigé
- Pack-4/5 : épilogues d’acte, timeline 18→19, B8 spectateur, golden H+F
- `walk:pack:aff5:all` : **10/10 romantic** (H+F, packs 1–5) — confirmé 2026-07-03
- Validateurs : S29 `\b` accents, S1→S20, S35 playful, S37b MC passif, S46 pack-5

### En attente (Guillaume — exécution manuelle)

| Priorité | Tâche |
|----------|--------|
| **P0** | **Phase C in-game** — grille 10 parcours dans [`staging/playbooks/parler-smoke.md`](../../staging/playbooks/parler-smoke.md) Partie 2 |
| P1 | Audit calque FMC ex. 01–09 (pas de check auto systématique) |
| P1 | Rejouer pack-5 **mixed** in-game (profil proche partie réelle) |
| P2 | Épilogues **low** mid-pack : « demain » volontaire en taunt — durcir WALK-FINALE si Guillaume le demande |
| P2 | W1 bridge+line (désactivé — repoussé) |
| P2 | Étendre piste B aux **autres compagnons** aff. 5 (modèle = Lyra) |
| P3 | Aff. 4 FMC : même passe relecture packs que aff. 5 |

### Fait récemment (agent)

- `npm run build` vert (props `villageStage`, typage git, lint TS)
- Smoke playbook aff. 5 Phase C + grille H/F
- Commits locaux piste B (validateurs, in-game, launcher, corpus public)

---

## Fichiers à ne pas confondre

| Fichier | Touche pas sans raison |
|---------|-------------------------|
| `src/data/linkCorpusV2.json` | ~40 Mo — piste A |
| `assets/` PNG Lyra NSFW | règle projet : pas sans demande explicite |
| `old_v2.1/staging_wip/companion-visual-pack/` | WIP visuel gitignoré |

---

## Prompt copier-coller (agent piste B)

```
Tu reprends la piste B — Parler curé Lyra aff. 5 (H + FMC).

Lis d'abord :
- docs/HANDOFF_PARLER_CURATED_PISTE_B.md
- docs/traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md
- docs/traceability/link-corpus-review/CURATED_EXCHANGE_RUBRIC_AFF4-5.md
- AGENTS.md + docs/DOC_AGENT_INDEX.md

État : validation auto OK (walk:pack:aff5:all 10/10) ; RIEN n'est validé in-game.

Règles :
- Éditer build-intimate-action-corpora.mjs → rebuild → validate → walk
- Jamais prolepse mid-pack dans intimateFinale high
- FMC = réécriture anatomique, pas calque H
- Pas de commit sans demande Guillaume ; version:task + DEV_LOG par tâche

Première action : git status, npm run walk:pack:aff5:all, puis Phase C in-game ou correction ciblée selon consigne Guillaume.
```

---

## Références

- Index lots corpus : [`link-corpus-review/README.md`](./traceability/link-corpus-review/README.md)
- Corpus H : [`LYRA_AFF5_CURATED_12.md`](./traceability/link-corpus-review/LYRA_AFF5_CURATED_12.md)
- Corpus FMC : [`LYRA_AFF5_CURATED_12_FEMALE_MC.md`](./traceability/link-corpus-review/LYRA_AFF5_CURATED_12_FEMALE_MC.md)
- Chat session précédente : relecture packs + WALK-FINALE (transcript agent juin–juillet 2026)
