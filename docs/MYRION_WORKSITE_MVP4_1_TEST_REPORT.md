# Chantier Myrion / Ferme lunaire — Compte-rendu fin de test MVP 4.1

> **Date :** 2026-06-26  
> **Branche :** `feature/myrion-worksite-mvp2`  
> **Version session :** `v2.0.0.45.274` (dernier build polish joueur)  
> **Traçabilité clôture :** `v2.0.0.46` (`npm run version:prompt`)  
> **Statut :** **MVP 4.1 validé fonctionnellement**, sous réserve des limitations listées en §5

---

## 1. Résumé exécutif

Le mini-jeu **Ferme lunaire / Chantier Myrion** est **validé en MVP 4.1** côté parcours joueur : un testeur peut ouvrir le chantier, miner les filons, assigner des Myrions, changer de biome, observer la production passive et les déblocages, puis recharger sans blocage constaté pendant la session.

Les boucles principales sont en place : **trois biomes**, **trois filons visibles par biome**, **clic direct** sur chaque filon, **production passive multi-biomes**, **bonus supervision +15 %** sur le biome affiché, **progression / déblocages**, et **chibis décoratifs** sans impact sur les formules de production.

L’interface a été **simplifiée autour du biome plein écran** : par défaut, seule la barre latérale et la scène sont visibles ; titres, stats, miniatures et hints réapparaissent lorsqu’un onglet est ouvert.

L’**assignation Myrions** est pensée au **niveau biome** côté UI (onglet Spots retiré), tout en conservant la **répartition par spot** côté backend pour la production passive.

Les **assets IA** (fonds, filons, icônes ressources) et les **effets de minage** (éclat de ressource ancré au filon, durée ~2,5 s) améliorent la lisibilité du feedback joueur.

Des **dettes restent ouvertes** : équilibrage chiffré, polish assets / panoramas, ressources spécialisées reportées, migration save v1 (reset assignations), et **TNR transversal complet** (chasse, refuge, inventaire, gacha, village) encore à exécuter.

---

## 2. Parcours de test recommandé vs couvert

### Parcours recommandé (référence projet)

| Étape | Action |
|-------|--------|
| 1 | Ouvrir **Ferme lunaire** / Chantier Myrion depuis le village |
| 2 | **Miner** les filons (clic direct, spam) — vérifier ressource et animation |
| 3 | Ouvrir drawer **Myrions** — assigner / désassigner, lots, filtres |
| 4 | **Changer de biome** (drawer Biomes) — vérifier scène, filons, chibis |
| 5 | Vérifier **production passive** (toast groupé silencieux + cumul) |
| 6 | Atteindre ou simuler **déblocages** — bannière / drawer Progression |
| 7 | **Reload** navigateur — save `myrionWorksite` + assignations |
| 8 | Drawer **Vie** — liste espèces, états décoratifs, miniatures |

### Parcours couvert pendant la session

La session a porté sur le **MVP 4.1 en conditions joueur**, avec **ajustements UI/UX successifs** au fil des retours (immersion, minage, chibis, miniatures, onglet Vie, suppression Spots, mode plein écran).

| Zone | Couverture session |
|------|-------------------|
| Minage direct filons | ✅ Testé et itéré (position éclat, ressource affichée, distance, durée) |
| Mode immersif | ✅ Testé |
| Assignation biome | ✅ Testé (UI) ; backend spots conservé |
| Chibis décoratifs | ✅ Testé (taille, retrait badges scène, wander) |
| Drawers Myrions / Vie / Production | ✅ Testé |
| Déblocages / progression | ✅ Présent (seuils provisoires non finalisés) |
| Reload save | ✅ Smoke session ; migration v1 reset assignations observé |
| TNR chasse / refuge / gacha / village | ❌ Non exécuté dans cette session |
| Multi-tailles mobile exhaustif | ⚠️ Partiel (breakpoints drawer / scroll Vie) |

**Versions :** build polish final **`v2.0.0.45.274`** ; clôture traçabilité **`v2.0.0.46`** (`build-revision.json`, changelog).

---

## 3. Ajustements UX réalisés

### Navigation / UI

- Suppression de l’onglet **Spots** ; les **3 filons** restent visibles sur la scène du biome actif.
- **Mode immersif par défaut** : aucun drawer ouvert au lancement ; biome en plein écran.
- **Header, stats, miniatures, hint minage, détail production** : visibles uniquement quand un onglet latéral est ouvert.
- Drawer **Myrions** : filtres avec bouton **Appliquer**, sections **repliables**, **Désassigner tout** (biome), production et badges **agrégés au biome**.

### Minage

- **Clic direct** sur chaque filon (`onPointerDown`) ; **spam autorisé** sans saut de layout.
- **Un éclat de ressource par clic** : direction **aléatoire**, **icône centrée** sur le filon ~**2,5 s**, distance **courte** (32–42 px) pour limiter les sorties d’écran en bas.
- Ressource affichée = **ressource minée** (vivres / bois / pierre), pas l’image du filon.
- **Usure visuelle progressive** des filons (`spotWear`).

### Myrions / chibis

- Chibis **plus visibles** sur le biome (base ~2,55 rem).
- **Scaling rareté conservé** (N plus petit, LR plus grand).
- **Badges ×N** et **labels rareté retirés** de la scène ; infos dans le bandeau bas et les drawers.
- **Miniatures réduites** (~18 px) dans la liste bas de scène et le drawer **Vie** (fix override CSS chibi 56 px).
- Drawer **Vie** : **pas de scroll** desktop ; scroll uniquement si écran **&lt; 768 px**.
- **Migration save v1** : assignations **vidées au premier chargement** (reset test).

### Gameplay / data

| Biome | Ressource filons |
|-------|------------------|
| Prairie | Vivres (`food`) |
| Forêt douce | Bois (`wood`) |
| Mine tranquille | Pierre (`stone`) |

- **Production passive multi-biomes** : inchangée (tous les spots assignés produisent).
- **Supervision +15 %** : appliquée au biome **affiché** uniquement.
- **15 espèces max** visibles en scène (vie décorative) ; compteur **Espèces X/15** quand panneau ouvert.

---

## 4. Points validés ✅

- Boucle de **minage directe** sur filons opérationnelle.
- **Lisibilité biome** améliorée (fonds, filons, feedback ressource).
- **Scène plus immersive** (plein écran par défaut).
- **Assignation Myrions** plus compréhensible (niveau biome, sans onglet Spots).
- **Production passive** conservée (timer unique, multi-biomes).
- **Supervision** conservée (+15 % biome actif).
- **Chibis décoratifs** intégrés **sans impact** sur les formules de production.
- **Toasts groupés** récompenses conservés (fusion par ressource, silent auto chantier).
- **Reload / save** compatible après les ajustements testés (smoke session).
- **Aucune régression bloquante** signalée pendant la session de test MVP 4.1.

---

## 5. Limitations connues / dette restante ⚠️

| Sujet | Détail |
|-------|--------|
| **Équilibrage** | Gains clic / auto / seuils **non finalisés** — valeurs provisoires MVP 2–3. |
| **Déblocages** | Seuils `WORKSITE_UNLOCK_THRESHOLDS` encore **provisoires**. |
| **Ressources spécialisées** | `herbs`, `water`, `ore`, `coal` : **reportées** ou fallback icône générique. |
| **Assets IA** | Fonds, filons, icônes : **à trier / polir** (halos, cohérence biome, icônes suspectes ex. food). |
| **Panoramas** | Backgrounds possiblement à **régénérer** en vrai panorama wide. |
| **TNR complet** | Chasse, refuge, inventaire, gacha, village : **non rejoué** dans cette session. |
| **Migration save v1** | Vide toutes les assignations au 1er chargement — **OK reset test**, à **confirmer ou retirer** avant diffusion large. |
| **Mobile** | UI à **revalider** sur plusieurs tailles (immersion, minage bas d’écran, drawers). |
| **Effets minage** | Surveiller **clics rapides** (empilement bursts, perfs) en stress test. |
| **Chibis sans PNG** | Espèces sans asset chibi → pas d’affichage sprite (comportement existant). |
| **États décoratifs** | Bucket 60 s, déterministes — pas d’animation continue entre buckets. |

---

## 6. Prochaines étapes suggérées

1. **TNR léger transversal** : chasse, refuge, inventaire, gacha, village, puis **Ferme lunaire** en smoke de non-régression.
2. **Décider du sort de la migration v1** (reset assignations) avant toute diffusion hors branche de test.
3. **Polish assets** : fonds wide, détourage / halos, icônes ressources, filons prairie vs mine.
4. **Équilibrage** seuils déblocage et débits production après retour joueur structuré.
5. **MVP 4.2** : n’envisager qu’**après** validation TNR — pas de nouvelle feature avant cette gate.

---

## Références

- Spéc MVP 4 : [`MYRION_WORKSITE_MVP4.md`](./MYRION_WORKSITE_MVP4.md)
- Changelog session : [`traceability/changelog/entries/2026-06-26.md`](./traceability/changelog/entries/2026-06-26.md) (§ v2.0.0.45.81, v2.0.0.46)
- Test manuel MVP 2 : [`MANUAL_TEST_MYRION_WORKSITE_MVP2.md`](./MANUAL_TEST_MYRION_WORKSITE_MVP2.md) (partiellement dépassé par MVP 4.1 UI)

---

*Document rédigé en clôture de session test — aucune modification gameplay lors de la rédaction.*
