# Rapport de validation — Corpus compagnons V2 clean

## Verdict

VALIDÉ pour intégration de test.

## Volumétrie

- Conversations : 7 500
- Choix joueur : 90 000
- Compagnons : 15
- Niveaux d'affinité : 5
- Conversations par compagnon et par niveau : 100

## Variété mesurée

- Choix joueur uniques : 4 047 / 90 000
- Lignes compagnon uniques : 1 125 / 22 500
- Prompts uniques : 166

## Contrôles bloquants passés

- 3 rounds par conversation
- 4 choix par round
- Tons exacts : sincere, playful, direct, romantic
- Scores strictement 0 ou 1
- Couverture exacte 15 × 5 × 100
- Aucune clé technique visible dans les champs narratifs
- Aucune clé ressource anglaise visible dans les champs narratifs
- Aucune formulation cassée détectée du type `de les`, `à le`, `que un`, `du ressource`, `du faveur`
- Aucun vocabulaire sexuel explicite détecté

## Échantillons relus

- `sample_lyra-aff1-001.json`
- `sample_seren-aff4-037.json`
- `sample_sora-aff5-100.json`
- `sample_talia-aff2-044.json`
- `sample_zelie-aff5-088.json`

## Limite importante

Ce corpus est propre structurellement et linguistiquement pour un test en jeu. Il reste généré par règles : une passe humaine reste recommandée avant validation finale du canon narratif.
