# Audit — Corpus Lien v2

> **Date :** 2026-06-23  
> **Branche :** `feature/link-corpus-v2`  
> **Référence produit :** `wonderland_companion_link_corpus_v2_clean_compact.zip`

---

## Décision

**INTÉGRÉ — corpus V2 validé, importé et branché dans ConversationGame avec fallback legacy.**

---

## Phase 1 — Localisation du corpus

### Chemins utilisés

| Chemin | Résultat |
|--------|----------|
| `assets/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.zip` | ✅ présent (~2 Mo) |
| `assets/link-corpus-import/companion_link_conversations.v2.clean.jsonl` | ✅ source de vérité (~39 Mo) |
| `assets/link-corpus-import/manifest.json` | ✅ métadonnées (7 500 conversations) |
| `src/data/linkCorpusV2.json` | ✅ généré (~39 Mo, format ScenarioScript) |

### Import

```bash
npm run import:link-corpus-v2   # JSONL → linkCorpusV2.json
npm run validate:link-corpus    # exit 0
```

Le script d'import lit en priorité le JSONL (recommandé par le pack) ; le zip sert de secours. Conversion V2 → `ScenarioScript` : `affinity` → `minAffinity`/`maxAffinity`, `narrator`/`companionLine` → `context[]`, `score=1` → `roundToneHints`.

---

## Résumé quantitatif (corpus V2)

| Métrique | Valeur |
|----------|--------|
| Compagnons couverts (V2) | **15** |
| Conversations totales (V2) | **7 500** |
| Entrées rejetées à l'import | **0** |
| Conversations / compagnon / affinité | **100** |
| Couverture affinité 1 | 1 500 (100 × 15) |
| Couverture affinité 2 | 1 500 |
| Couverture affinité 3 | 1 500 |
| Couverture affinité 4 | 1 500 |
| Couverture affinité 5 | 1 500 |

---

## Exemples d'entrées (V2)

Voir `assets/link-corpus-import/sample_lyra-aff1-001.json` (format source) et `src/data/linkCorpusV2.json` entrée `lyra-aff1-001` (format moteur).

**Source V2 (extrait) :** id `lyra-aff1-001`, affinity 1, 3 rounds, 4 choix/round, tons `sincere`/`playful`/`direct`/`romantic`, score 0|1 par choix.

**Converti moteur :** `roundToneHints: ["sincere","sincere","sincere"]`, `context` = `[contexte global, narrator, companionLine]`, choix sans champ `score` (scoring runtime via `getPreferredTone`).

---

## Problèmes détectés

1. ~~Corpus source manquant~~ — résolu.
2. **Taille bundle** : `linkCorpusV2.json` (~39 Mo) est bundlé dans le chunk principal (~36 Mo gzip ~1,8 Mo). Acceptable pour test ; code-splitting possible ultérieurement.
3. Données legacy conservées : `companionScenarios.generated.ts` (~5 Mo, 200 scénarios × 15 compagnons) — fallback actif si pack V2 vide pour un compagnon/affinité.

---

## Phase 2 — Moteur actuel du mini-jeu Lien

### Composants

| Fichier | Rôle |
|---------|------|
| `src/components/minigames/ConversationGame.tsx` | UI mini-jeu Lien (inchangé) |
| `src/data/conversations/engine.ts` | `pickConversation` V2-first + fallback legacy |
| `src/data/conversations/linkCorpusV2.ts` | Loader pack V2 depuis JSON |
| `src/data/linkCorpusV2.json` | **Source V2 runtime** |
| `src/data/conversations/companionScenarios.generated.ts` | **Legacy** (conservé) |
| `scripts/import-link-corpus-v2.mjs` | Import JSONL/zip → JSON |
| `scripts/validate-link-corpus.mjs` | Validation V2 raw + ScenarioScript |

### Sélection conversation (implémenté)

1. `pickConversation(companionId, affinity, avoidId?)` tente le pack V2 (`getLinkCorpusV2Pack`).
2. Filtre par `minAffinity ≤ affinity ≤ maxAffinity` (V2 : égalité stricte sur le palier).
3. Si pool V2 vide → fallback `COMPANION_SCENARIO_PACKS` (legacy 200 scénarios).
4. Score et récompenses : inchangés (`ConversationGame.finish()`).

### Fallback

| Cas | Comportement |
|-----|--------------|
| Compagnon avec pack V2 + affinité couverte | Scénario V2 |
| Pack V2 absent ou affinité sans entrée | Legacy `companionScenarios.generated.ts` |
| Aucun dialogue | UI « Pas encore de dialogue pour ce compagnon. » |

---

## Mapping V2 → moteur (appliqué)

| Champ V2 | Cible moteur |
|----------|--------------|
| `companionId` | clé pack + validation |
| `affinity` | `minAffinity`, `maxAffinity` |
| `id` | `ScenarioScript.id` |
| `title` | `ScenarioScript.title` |
| `context` (top) + `round.narrator` + `round.companionLine` | `rounds[].context[]` |
| `round.prompt` | `prompt` |
| `round.choices[]` | `{ text, tone, reaction }` |
| choix `score=1` | `roundToneHints[roundIndex]` |

---

## Données legacy (référence)

| Métrique | Legacy actuel |
|----------|---------------|
| Compagnons | 15 |
| Scénarios / compagnon | 200 |
| Total scénarios | 3 000 |

---

## Intégrabilité

| Critère | Statut |
|---------|--------|
| Corpus localisé | ✅ |
| Format confirmé | ✅ JSONL + conversion ScenarioScript |
| Script validation | ✅ `npm run validate:link-corpus` |
| Script import | ✅ `npm run import:link-corpus-v2` |
| Branchement ConversationGame | ✅ via `engine.ts` |
| Build / lint | ✅ (warnings préexistants hors scope) |

---

## Cleanup / suivi

- [ ] Test manuel in-game (voir `docs/MANUAL_TEST_LINK_CORPUS.md`)
- [ ] Passe narrative humaine avant canon final (corpus généré par règles)
- [ ] Option future : lazy-load / code-split `linkCorpusV2.json` pour réduire le bundle initial
- [ ] Push après validation utilisateur
