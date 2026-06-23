# Checklist test manuel — Corpus Lien v2

> **Statut :** prêt pour test in-game (2026-06-23)  
> Branche : `feature/link-corpus-v2`

## Prérequis

- [x] `assets/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.zip` présent
- [x] `npm run validate:link-corpus` → exit 0
- [x] `npm run import:link-corpus-v2` exécuté → `src/data/linkCorpusV2.json` (7 500 scénarios)
- [x] `npm run build` OK

## Desktop

1. [ ] Ouvrir Compagnons / Liens
2. [ ] Lancer mini-jeu Lien pour **Lyra** (affinité 1+) — IDs attendus type `lyra-aff{N}-{NNN}`
3. [ ] Vérifier question + 4 choix (textes V2, contexte narrator/compagnon)
4. [ ] Choisir une réponse → réaction affichée
5. [ ] Terminer 3 rounds → récompense cohérente (inchangée vs legacy)
6. [ ] Relancer → conversation différente (pas la même ID immédiate)
7. [ ] Tester **Kael** (playful) et **Seren** (direct)
8. [ ] Vérifier qu'un compagnon connu charge bien (V2 prioritaire)
9. [ ] Reload page → pas d'écran blanc, pas d'erreur console

## Mobile

1. [ ] Même parcours Lyra + 1 autre compagnon
2. [ ] Textes non coupés (accents, apostrophes)
3. [ ] Boutons choix utilisables au pouce

## Cas fallback

- [ ] Renommer temporairement `linkCorpusV2.json` → legacy utilisé (200 scénarios/compagnon)
- [ ] `companionId` inconnu → message « Pas encore de dialogue »

## Affinité

- [ ] Affinité 1 : pool `*-aff1-*` uniquement (100 scénarios/compagnon)
- [ ] Affinité 4–5 : pool élargi aux IDs `aff4` / `aff5`

## Problèmes connus

- Bundle principal ~36 Mo (corpus inline) — acceptable pour test, split possible plus tard.
- Corpus généré par règles — relecture humaine recommandée avant canon.
