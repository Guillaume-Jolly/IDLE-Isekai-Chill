# TNR transversal — branche Ferme lunaire (MVP 8)

Date : 2026-06-26  
Branche : `feature/myrion-worksite-mvp2`  
HEAD au rapport : `204ae9f` (+ correctif circulaire post-TNR)

## 1. Contexte

Stabilisation après MVP 1–7 Chantier Myrion / Ferme lunaire. Pas de nouvelle feature — vérifier que l’intégration n’a pas cassé le reste du jeu.

## 2. Build result

| Run | Résultat | Version |
|-----|----------|---------|
| Initial | OK | `v2.0.0.46.102` (`204ae9f`) |
| Après correctif | OK | `v2.0.0.46.105` |

## 3. Parcours testés

| Zone | Méthode | Statut |
|------|---------|--------|
| Ferme lunaire (normal + surveillance) | Navigateur `127.0.0.1:5173` | OK |
| Prairie / Forêt / Mine (drawer + minage) | CDP automation | OK (minage bois validé) |
| Drawer Biomes / Myrions | CDP | OK |
| Refuge des Myrions | Ouverture + classe immersive | OK |
| Chasse aux Familiers | Ouverture layout hunt | OK |
| Inventaire | Ouverture, ressources | OK |
| Gacha / Event | Écran + bouton « Tirer x1 » | OK |
| Village | Ouverture | OK |
| Liens / compagnons | Ouverture | OK |
| Mobile 390px | Ferme lunaire + hub | OK (pas de scroll H) |
| Console / images | CDP + broken img scan | OK (0 image cassée) |

## 4. Points OK

- App se charge après correctif (écran titre → hub).
- Ferme lunaire : toggle surveillance, barre résumé, retour vue normale, filons cliquables.
- **Éclats astraux absents de l’inventaire global** (seul « Ruines astrales » — ressource distincte).
- Refuge / Chasse / Inventaire / Village / Event : pas de crash, pas d’écran blanc.
- Build TypeScript + Vite OK.
- Pas de double timer identifié (même tick partagé MVP 7).

## 5. Bugs corrigés

### Bloquant — écran blanc au chargement

- **Cause** : import circulaire `myrionWorksite.ts` ↔ `myrionWorksitePrestige.ts`  
  (`Cannot access 'WORKSITE_SUPERVISION_MULT' before initialization`).
- **Correctif** : `myrionWorksitePrestige.ts` importe uniquement `myrionWorksiteDefs` + `myrionWorksiteProgression` ; `worksitePetIsBusy` inlined ; constante supervision locale `1.15`.
- **Commit** : `fix(worksite): stabilize post-worksite transversal regressions`

## 6. Bugs restants

| Item | Sévérité | Note |
|------|----------|------|
| Test LR prestige assignation + reload | Non bloquant | **Non fait faute de LR** en save de test |
| Assets worksite provisoires (1536×1024) | Cosmétique | Hors scope MVP 8 |
| Working tree dirty hors scope | Process | Non trié volontairement |
| `faille-astrale.png` absent | Cosmétique | Placeholder OK |

Aucun bug bloquant ouvert après correctif circulaire.

## 7. Risques avant merge

- **Moyen** : dépendances circulaires futures entre modules worksite — préférer `myrionWorksiteDefs` pour les imports croisés.
- **Faible** : save sans LR jamais testée sur prestige assignation.
- **Faible** : gros bundle JS (avertissement Vite > 500 kB) — préexistant.

## 8. Recommandation MVP 9

1. **Assets visuels globaux** : backgrounds wide Ferme lunaire + `faille-astrale.png` validé.
2. **Smoke LR** dès qu’une save test LR est disponible.
3. **Optionnel** : test manuel reload préférence mode surveillance (`localStorage`).
4. Ne pas lancer PassiveWindowManager / multi-fenêtres avant validation produit MVP 9.

## Annexe — tests non exécutés

- Reload complet page après assignation LR prestige.
- Tir gacha avec animation complète (clic « Tirer x1 » sans crash UI confirmé, loot non audité).
- Compagnons : écran détail individuel approfondi.
