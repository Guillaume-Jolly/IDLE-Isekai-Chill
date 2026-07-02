# Smoke Parler — Lyra aff. 1 (checklist manuelle)

**Durée cible :** ~15 min · **Fréquence :** avant merge corpus ou changement UI ConversationGame.

**Prérequis :** `npm run validate:curated-parler` vert · dev server (`npm run dev`).

---

## Session dev — un pack

1. Ouvrir le minigame **Parler** avec Lyra, affinité 1.
2. Sélecteur dev : choisir **pack-1** (puis refaire pack-2, 3, 4 si temps).
3. Pour **chaque** des 3 échanges du pack :

| # | Vérifier | OK |
|---|----------|-----|
| A | Bridge/contexte lisible en entier | ☐ |
| B | Question Lyra complète (pas coupée après `:`) | ☐ |
| C | `?` visible si question orale | ☐ |
| D | 4 choix visibles ; badges `+N` en dev | ☐ |
| E | Ordre dev = +3 → +0 (sincere en tête) | ☐ |
| F | Après choix : bulle portrait + texte réaction | ☐ |
| G | Cutout portrait cohérent (pas joyeux si mauvais choix) | ☐ |
| H | Toast score / feedback compréhensible | ☐ |
| I | Scroll auto vers question suivante si fil long | ☐ |

4. **Fin de session** : 3 boutons — relancer · autre compagnon · quitter.

---

## Session prod-like (optionnel)

1. Même flux sans forcer le pack (tirage aléatoire).
2. Ordre des choix **≠** ordre score (shuffle).
3. Relancer 2 parties : éviter le même pack que la précédente si possible.

---

## Relecture oralité (humain)

Sur les lignes modifiées depuis le dernier smoke :

- [ ] Lire **companionLine** à voix haute — rythme naturel ?
- [ ] Les 4 réponses sonnent-elles **plausibles** pour la question ?
- [ ] Pack 4 (10→11→12) : fil narratif sensible ?

---

## Échec → action

| Symptôme | Piste |
|----------|-------|
| Question tronquée | CSS scroll / `formatSpeech` |
| Cutout joyeux + mauvais score | `reactionPortraitEmotion` ou émotion JSON |
| Écran vide | hooks React (early return) |
| Corpus rejeté | `npm run validate:curated-parler` + corriger JSON |
