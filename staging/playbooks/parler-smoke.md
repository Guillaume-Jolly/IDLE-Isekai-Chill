# Smoke Parler — Lyra (checklist manuelle)

**Durée cible :** aff. 1 ~15 min · aff. 5 ~2–4 h (10 parcours pack × genre)  
**Fréquence :** avant merge corpus ou changement UI `ConversationGame`.

**Prérequis communs :**

```bash
npm run build
npm run validate:curated-parler
```

Dev server : `npm run dev` (ou `npm run dev:launcher`).

Modop aff. 5 détaillé : [`docs/traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md`](../../docs/traceability/link-corpus-review/PARLER_PACK_WALKTHROUGH_MODOP.md)

---

## Partie 1 — Aff. 1 (régression UI)

1. Ouvrir **Parler** avec Lyra, **affinité 1**.
2. Sélecteur dev : **pack-1** (puis pack-2, 3, 4 si temps).
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

4. **Fin de session** : relancer · autre compagnon · quitter.

### Session prod-like aff. 1 (optionnel)

- Tirage pack aléatoire · shuffle choix · 2 parties sans même pack.

---

## Partie 2 — Aff. 5 Phase C (livraison joueur)

**Objectif :** cocher manuellement les 10 parcours **pack-1 → pack-5** × **MC homme puis MC femme**.

**Prérequis aff. 5 :**

```bash
npm run validate:curated-parler:aff5:both
npm run walk:pack:aff5:all
```

- Options jeu : **NSFW activé**.
- Lyra **affinité 5** (ou picker dev aff. 5).
- Dev : `?pack=pack-N` ou sessionStorage `parler-dev-curated-selection`.
- Genre MC : rejouer toute la grille avec **female** en settings pour le corpus FMC.

### Grille de suivi Phase C

Cocher quand le pack est joué **en entier** in-game (checklist C.2 du modop OK).

| Pack | Label | MC homme | MC femme | Notes |
|------|-------|----------|----------|-------|
| pack-1 | Bibliothèque — verrou | ☐ | ☐ | Verrou actif ; épilogues présent |
| pack-2 | Chambre — peignoir | ☐ | ☐ | Teaser ex. 06 OK en clôture |
| pack-3 | Verrière — nu | ☐ | ☐ | Pas de prolepse mid-pack |
| pack-4 | Toit — aube | ☐ | ☐ | **+** parcours playful (C.3 B) |
| pack-5 | Bibliothèque — silence | ☐ | ☐ | Spectateur 13–19 ; mixed recommandé |

### Checklist rapide **chaque échange** (tous packs aff. 5)

| # | Vérifier | OK |
|---|----------|-----|
| 1 | Bulles pont (`;`) ordre logique | ☐ |
| 2 | `companionAction` ↔ `companionLine` cohérents | ☐ |
| 3 | Choix +3 (sincere) aligné action Lyra | ☐ |
| 4 | Réaction + portrait (émotion cutout) | ☐ |
| 5 | Épilogue round (score ≥ 2) sans prolepse | ☐ |
| 6 | Écran **packFinale** avant résultat (pack-4/5) | ☐ |

### Focus par pack (rappel)

- **pack-1** : verrou tiré ; FMC ex. 02–03 = MC sur la table (pas calque H).
- **pack-4** : rejouer **playful (+0) × 3** → épilogues round low + acte low.
- **pack-5** : ex. 13–19 spectateur (Lyra → visiteur) ; ex. 20–21 Lyra parle au MC.

### Oralité (humain)

- [ ] Lire **companionLine** à voix haute sur lignes modifiées depuis dernier smoke.
- [ ] Pack 4 (10→11→12) et pack 5 (18→21) : fil sensible et cohérent.

---

## Échec → action

| Symptôme | Piste |
|----------|-------|
| Question tronquée | CSS scroll / `formatSpeech` |
| Cutout joyeux + mauvais score | `reactionPortraitEmotion` ou émotion JSON |
| Écran vide | hooks React (early return) |
| Corpus rejeté | `npm run validate:curated-parler:aff5:both` |
| Build rouge | `npm run build` avant smoke |

**Clôture aff. 5 :** les 10 cases de la grille Phase C cochées → marquer « validé in-game » dans le handoff piste B.
