# Checklist test manuel — Corpus Lien v2

> **Statut :** en attente du corpus source  
> À exécuter **après** dépôt du zip et intégration sur `feature/link-corpus-v2`.

## Prérequis

- [ ] `assets/link-corpus-import/wonderland_companion_link_corpus_v2_clean_compact.zip` présent
- [ ] `npm run validate:link-corpus` → exit 0
- [ ] `node scripts/import-link-corpus-v2.mjs` exécuté
- [ ] `npm run build` OK

## Desktop

1. [ ] Ouvrir Compagnons / Liens
2. [ ] Lancer mini-jeu Lien (bâtiment conversation) pour **Lyra** (affinité 1+)
3. [ ] Vérifier question + 4 choix
4. [ ] Choisir une réponse → réaction affichée
5. [ ] Terminer 3 rounds → récompense cohérente
6. [ ] Relancer → conversation différente (pas la même ID immédiate)
7. [ ] Tester **Kael** (playful) et **Seren** (direct)
8. [ ] Compagnon sans entrée V2 → fallback legacy ou message vide
9. [ ] Reload page → pas d'écran blanc, pas d'erreur console

## Mobile

1. [ ] Même parcours Lyra + 1 autre compagnon
2. [ ] Textes non coupés (accents, apostrophes)
3. [ ] Boutons choix utilisables au pouce

## Cas fallback

- [ ] Corpus V2 désactivé / absent → legacy `companionScenarios.generated.ts` utilisé
- [ ] `companionId` inconnu → message « Pas encore de dialogue »

## Affinité

- [ ] Affinité 1 : scénarios `minAffinity` bas uniquement
- [ ] Affinité 4–5 : pool élargi (si testable via dev flags)

## Problèmes connus

- Corpus V2 non intégré au 2026-06-23 — checklist non exécutable.
