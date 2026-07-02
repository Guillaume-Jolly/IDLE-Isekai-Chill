# Relecture corpus Lien — index lots

Deux pistes distinctes. **Ne pas mélanger** édition bulk (piste A) et Parler curé (piste B).

| Piste | Objet | Source de vérité | Handoff |
|-------|--------|------------------|---------|
| **A** | Corpus Lien bulk (7500 scénarios) | `src/data/linkCorpusV2.json` | Méthode ci-dessous |
| **B** | **Parler curé** aff. 1–2–4–5 (échanges modèle + packs session) | `scripts/references/link-corpus/curated/*.json` · builder | [`../../HANDOFF_PARLER_CURATED_PISTE_B.md`](../../HANDOFF_PARLER_CURATED_PISTE_B.md) |

---

## Piste A — linkCorpusV2 (bulk)

**Corpus :** `src/data/linkCorpusV2.json` (7500 scénarios, 15 compagnons × 500)  
**Profils :** `src/data/conversations/profiles.ts` (`toneWeights`, `personalityHint`)  
**Validation structurelle :** `npm run validate:link-corpus`

### Méthode (petits lots)

1. **Audit automatique** — ton de la bonne réponse vs profil :
   ```bash
   node scripts/audit-link-corpus-tone.mjs lyra --limit 30
   node scripts/audit-link-corpus-tone.mjs lyra --affinity 1 --limit 20
   ```
2. **Relecture humaine** — échantillon 10–20 scénarios du lot (cohérence voix, pas de flirt lourd pour Lyra, etc.).
3. **Corrections** — éditer `linkCorpusV2.json` + regénérer si pipeline l'exige ; toujours `validate:link-corpus`.
4. **Trace** — une note par lot : `LYRA_AFF1_BATCH01.md` (findings + ids corrigés).

### Ordre prévu (piste A)

Lyra → Maeve → Seren → … → Zélie (15 profils Lien ; Disagrea = bonds séparés).

### Lots piste A

| Compagnon | Affinité | Statut | Fichier lot |
|-----------|----------|--------|-------------|
| Lyra | 1 | audit fait | `LYRA_AFF1_BATCH01.md` |

---

## Piste B — Parler curé (aff. 4–5 en cours)

**Architecture :** `build-intimate-action-corpora.mjs` → JSON → `curatedCorpus.ts` → `ConversationGame.tsx`  
**Flag runtime :** `CURATED_PARLER_ONLY = true` dans `curatedCorpus.ts` — ne pas inverser sans revue explicite.

### Lyra aff. 5 (focus actuel)

| Élément | Détail |
|---------|--------|
| Échanges | 21 × corpus H + 21 × corpus FMC |
| Packs | 5 (`pack-1` … `pack-5`) — voir handoff |
| Statut | **auto OK** (`walk:pack:aff5:all` 10/10) · **in-game pending** |
| Modop test | [`PARLER_PACK_WALKTHROUGH_MODOP.md`](./PARLER_PACK_WALKTHROUGH_MODOP.md) |
| Rubrique | [`CURATED_EXCHANGE_RUBRIC_AFF4-5.md`](./CURATED_EXCHANGE_RUBRIC_AFF4-5.md) |

**Pipeline rapide :**

```bash
npm run build:intimate-action-corpora
npm run sync:lyra-aff5-doc
npm run validate:curated-parler:aff5:both
npm run walk:pack:aff5:all
```

**Docs corpus :**

| Corpus | Fichier review |
|--------|----------------|
| MC homme | [`LYRA_AFF5_CURATED_12.md`](./LYRA_AFF5_CURATED_12.md) |
| MC femme | [`LYRA_AFF5_CURATED_12_FEMALE_MC.md`](./LYRA_AFF5_CURATED_12_FEMALE_MC.md) |

**Prochaine étape humaine :** Phase C in-game (modop) — pack-1 → pack-5, H puis FMC. Rien n'est « purement validé » tant que non coché.

### Autres lots curés Lyra

| Affinité | Statut | Fichier lot |
|----------|--------|-------------|
| 1 | **12 échanges modèle (curés)** | `LYRA_AFF1_CURATED_12.md` + `lyra-aff1-curated-12.json` · grille [`CURATED_EXCHANGE_RUBRIC.md`](./CURATED_EXCHANGE_RUBRIC.md) |
| 1 | *(archive 10)* | `LYRA_AFF1_CURATED_10.md` + `curated/archive/lyra-aff1-curated-10.json` |
| 2 | validé auto | `LYRA_AFF2_CURATED_12.md` |
| 4 | suggestif · FMC à repasser | `LYRA_AFF4_CURATED_12.md` · `LYRA_AFF4_CURATED_12_FEMALE_MC.md` |
