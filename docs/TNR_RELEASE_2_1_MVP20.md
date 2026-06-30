# TNR Release 2.1 — MVP 20

**Date :** 2026-06-30  
**Produit :** Havre des Brumes  
**Branche (historique TNR) :** `feature/myrion-worksite-mvp2` — mergée dans `main`, tag `v2.1.0.0`  
**HEAD de référence (pré-corrections) :** `0722c37` — docs: document content review mvp19  
**Version build testée :** v2.0.0.127.52 (preview `npm run build` + `vite preview` sur port 4175)

---

## 1. Objectif

TNR complet avant livraison 2.1 (MVP 21) : valider le jeu jouable, identifier et corriger uniquement les bugs bloquants, documenter le reste.

**Hors scope MVP 20 :** nouvelles features, assets, économie, nettoyage Git, versioning 2.1, push/PR.

---

## 2. Environnement

| Élément | Valeur |
|---------|--------|
| OS | Windows 10 |
| Node | via projet local |
| Preview | `http://127.0.0.1:4175/` |
| Save testée | Mixte : reset partiel + progression worksite/chasse en session |
| Mobile TNR | CDP `Emulation.setDeviceMetricsOverride` — 390×844, `mobile: true` |
| Flags dev | `?worksiteDevUnlock=1` testé sur **build preview** (production) |

---

## 3. Commandes lancées

```bash
git branch --show-current
git log --oneline -n 25
git status --short

npm run validate:companion-bonds   # OK
npm run validate:link-corpus       # OK
npm run tnr:baseline               # OK (build + corpus + asset manifest)
npm run build                      # OK
npm run lint                       # KO — 33 problèmes (19 errors, 14 warnings), préexistants
```

---

## 4. Résultat validations automatisées

| Script | Résultat | Détail |
|--------|----------|--------|
| `validate:companion-bonds` | **OK** | 19 compagnons, 190 conversations de lien |
| `validate:link-corpus` | **OK** | 7500 conversations, 15 compagnons corpus V2 |
| `tnr:baseline` | **OK** | Build + corpus + manifest assets worksite |
| `build` | **OK** | v2.0.0.127.52 |
| `lint` | **KO** | Erreurs ESLint préexistantes (prefer-const, react-hooks, react-refresh) — non bloquant release |

---

## 5. TNR save neuve / parcours minimal

| Étape | Résultat | Notes |
|-------|----------|-------|
| Arrivée Village | OK | Pas de crash, titre « Havre des Brumes » |
| Guidance « À faire maintenant » | OK | « Capturer un premier Myrion » après engagement Ferme lunaire ; cohérent |
| Hub mini-jeux | OK | Ferme lunaire, Chasse aux Myrions, Mini-jeu Parler visibles |
| Chasse aux Myrions | OK | Ouverture via guidance ; carte 8 biomes + Faille Disagrea ; Explorer actif |
| Capture Myrion | Partiel | Non validée bout-en-bout (timing capture) dans cette session |
| Refuge des Myrions | Partiel | Carte hub OK ; enclos non parcouru en détail |
| Ferme lunaire | OK | 3 filons prairie (Champs tendres, Bosquet clair, Pierrier doux) ; tap mine OK |
| Assignation Myrion | N/A | Aucun Myrion en save testée |
| Minage Prairie | OK | Boutons filons cliquables |
| Déblocage Forêt | N/A | Seuils non atteints sur save testée |
| Gacha | OK | Event : Tirer x1/x10 visibles ; 13 tickets en inventaire |
| Inventaire | OK | Ressources lisibles ; note éclats astraux (voir correction MVP20) |
| Liens | OK | 19 compagnons ; conversations de lien + paliers verrouillés |
| Mini-jeu Parler | OK | Picker + intro Iris ; distinction explicite vs conversations de lien |
| Reload F5 | OK | État guidance + village conservés après navigation |

**Terminologie :** pas de « Chantier Myrion » ni « Wonderland » en UI joueur testée. « Familiers » corrigé (voir §10).

---

## 6. TNR save avancée / dev unlock

| Point | Résultat | Notes |
|-------|----------|-------|
| `?worksiteDevUnlock=1` sur preview | Limité | **Inactif en build production** (`import.meta.env.DEV`) — biomes listés mais verrouillés sauf prairie |
| 15 biomes visibles (drawer Biomes) | OK | Liste complète avec hints de déblocage |
| 45 filons actifs | Non testé | Nécessite save avancée ou `npm run dev` + flag dev |
| Backgrounds / filons cliquables | OK (prairie) | Pas de crash ; pas d’audit 404 exhaustif réseau |
| Drawer Biomes | OK | Lisible, fermeture OK |
| Mode surveillance | OK | Bouton « Mode surveillance passive » visible |
| Prestige / Faille astrale | Partiel | Onglet Prestige présent ; pas de parcours prestige complet |
| `?worksitePlacementDebug=1` | Non testé | Dev-only, même contrainte que dev unlock |
| Console | OK | Aucune erreur bloquante observée pendant les parcours |
| `ruines-lierre-ancien.png` | Acceptable | Documenté MVP15/16 : ratio opaque bas, emoji fallback si échec chargement |

---

## 7. TNR systèmes globaux

| Écran | Résultat | Notes |
|-------|----------|-------|
| Village | OK | Bâtiments, collecte, guidance |
| Refuge (hub) | OK | « Refuge des Myrions » + **Promenade Myrions** (ex-Familiers, corrigé) |
| Chasse | OK | Terminologie Myrions |
| Inventaire | OK | Éclats astraux hors inventaire global clarifié |
| Gacha / Event | OK | Festival + event Disagrea |
| Liens | OK | 19 compagnons, bond conversations, distinction Parler |
| Parler | OK | Intro 3 rounds, coût mana/stardust mentionné |
| Story / Quêtes | OK | Objectifs havre + mini-quêtes ; pas de branding legacy bloquant |

**Wording mineur restant (non bloquant) :** quêtes « Chantier du havre », « Chantier du village » — interne onboarding, pas le libellé Ferme lunaire.

---

## 8. TNR mobile (~390 px)

| Écran | Résultat | Notes |
|-------|----------|-------|
| Village | OK | `scrollWidth === clientWidth === 390` |
| Hub mini-jeux | OK | Cartes scrollables verticalement |
| Ferme lunaire | OK (desktop retest) | Drawer utilisable |
| Liens / Inventaire / Gacha | OK | Navigation accessible après reset viewport |
| Nav latérale + overlay | Attention | Avec menu ouvert en mobile, certains onglets nav peuvent avoir `pointer-events: none` — fermer le menu ou utiliser le contenu principal |

Pas de scroll horizontal massif détecté sur Village en 390 px.

---

## 9. Bugs bloquants trouvés

| ID | Description | Sévérité |
|----|-------------|----------|
| TNR20-001 | « Refuge des Familiers » à côté de « Refuge des Myrions » — confusion joueur | Bloquant UX (terminologie) |
| TNR20-002 | Inventaire : « sur le chantier (Ferme lunaire) » — legacy visible | Bloquant UX (terminologie) |

Aucun crash, écran blanc, save corrompue, bouton définitivement inutilisable ou 404 bloquant UI identifié.

---

## 10. Bugs corrigés (MVP 20)

| ID | Correction | Fichiers |
|----|------------|----------|
| TNR20-001 | Renommage activité `farm-pets` : **Promenade Myrions** (tagline « Enclos doux — Sora ») | `src/data/buildingActivities.ts` |
| TNR20-002 | Inventaire : éclats astraux « sur la Ferme lunaire, pas dans l'inventaire global » | `src/App.tsx` |

Build repassé **OK** après corrections.

---

## 11. Bugs non bloquants reportés (backlog / MVP 21)

| ID | Description | Priorité |
|----|-------------|----------|
| NB-01 | `npm run lint` — 33 problèmes ESLint préexistants | MVP 21 cleanup |
| NB-02 | Quêtes : libellés « Chantier du havre / village » | Wording |
| NB-03 | Quêtes : « onglet Compagnons » vs « Liens » | Wording |
| NB-04 | `worksiteDevUnlock` / `worksitePlacementDebug` inactifs sur preview prod — documenter pour QA | Doc QA |
| NB-05 | `ruines-lierre-ancien.png` — silhouette faible ; regen asset optionnelle | Asset |
| NB-06 | Parcours capture → refuge → assign → forêt non rejoué manuellement bout-en-bout | QA manuel |
| NB-07 | Audit réseau 404 assets worksite (15 biomes) non exhaustif sur preview | QA manuel |
| NB-08 | Accents manquants UI (« Batiments », « Quetes », « Ingredients ») | Polish |
| NB-09 | Chunk JS > 500 kB (warning build) | Perf / MVP 21 |

---

## 12. Risques avant MVP 21

1. **Lint non vert** — pas bloquant build mais dette visible en CI si activée.
2. **TNR worksite avancé** — validation complète 45 filons / prestige repose sur save riche ou mode dev (`npm run dev`).
3. **Arbre Git dirty** — nombreux fichiers WIP hors scope ; MVP 21 devra trier sans suppression (règle archivage).
4. **Version affichée encore 2.0.0.x** — bump 2.1 réservé MVP 21.

---

## 13. Verdict release readiness

### **Ready avec réserves**

**Réserves :**
- Corrections terminologie MVP 20 appliquées mais preview navigateur non rechargée sur build post-fix (rebuild + retest rapide recommandé en MVP 21).
- Lint KO et TNR worksite 45 filons / prestige incomplet sur preview seul.
- Quelques libellés « chantier » restants dans les quêtes (non bloquants).

**Prêt pour MVP 21 :** versioning 2.1, changelog, nettoyage ciblé, push/PR.

---

## Prochaine étape

~~**MVP 21 — Release 2.1**~~ — **Terminé** (2026-06-30) : merge PR #3, tag `v2.1.0.0`, `main` @ `8e50e13`.  
Phase suivante : **2.2** — voir [`HANDOFF_2_2_AGENT_BRIEF.md`](./HANDOFF_2_2_AGENT_BRIEF.md).
