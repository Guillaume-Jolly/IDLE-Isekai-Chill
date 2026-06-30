# TNR — Progression naturelle 0.10

> **Date :** 2026-06-23  
> **Branche :** `feature/link-corpus-v2`  
> **Méthode :** build/lint/validate automatisés + revue parcours (browser MCP indisponible cette session)

## Prérequis prod (sans flags dev)

| Étape | Prérequis stade village | Accès |
|-------|-------------------------|-------|
| Village + bâtiments | Stade 0 | Immédiat |
| Mini-jeux hub | Stade 0 | Onglet Mini-jeux |
| Chasse Myrions | Stade ≥ 1 (population) | `BUILDING_UNLOCK_STAGE` |
| Refuge Dressage | Stade ≥ 2 | Idem |
| Compagnons Lien | Affinité + ressources conversation | Hub / Compagnons |

## Parcours attendu (nouvelle partie)

### 1. Village (0–2 min)

- Ressources tick toutes les 5 s.
- **Objectif tutoriel 1** se valide automatiquement.
- Panorama : cliquer bâtiment → améliorer.

### 2. Bâtiments (2–5 min)

- Améliorer un bâtiment (coût starter suffisant pour 1 upgrade).
- **Objectif 2** validé.

### 3. Chasse (5–15 min)

- Attendre stade village si chasse verrouillée (population / besoins).
- Mini-jeux → Chasse aux Myrions → **objectif 3**.
- Capturer Moussprout ou autre N de la prairie → **objectif 4**.

### 4. Refuge (10–20 min)

- Mini-jeux → Refuge Dressage → **objectif 5**.
- Sélectionner Myrion → Nourrir / Câliner → **objectif 6**.

### 5. Compagnons & Lien (15–25 min)

- Onglet Compagnons → **objectif 7**.
- Mini-jeu Lien (ex. Lyra, coût lancement) → terminer 3 rounds → **objectif 8**.
- Corpus V2 : IDs `lyra-aff{N}-*`, fallback legacy si JSON absent.

### 6. Inventaire & biome (20–40 min)

- Onglet Inventaire → **objectif 9**.
- 5 captures cumulées → **objectif 10** (aligné déblocage Forêt ancienne).

## Résultats session autonome

| Check | Statut | Notes |
|-------|--------|-------|
| `npm run build` | ✅ | exit 0 |
| `npm run lint` | ✅ | warnings préexistants |
| `npm run validate:link-corpus` | ✅ | 7500 scénarios |
| Objectifs tutoriel codés | ✅ | 10 étapes + save |
| Browser in-game complet | ⚠️ | MCP browser tab indisponible — tests manuels requis |
| Progression sans dev flags | ⚠️ | Stades village à valider en jeu |

## Bugs bloquants identifiés

Aucun bloquant build/lint/corpus sur HEAD + objectifs tutoriel.

### Dette / risques

1. **Arbre de travail sale** — migration assets Disagrea non commitée (hors scope 0.10).
2. **Bundle 36 Mo** — corpus Lien inline.
3. **Chasse/refuge gated** — TNR prod dépend du stade village ; documenter seuils dans `population.ts`.

## Prochaines validations humaines

- [ ] Nouvelle partie → objectifs 1–3 sans console error
- [ ] Reload mid-parcours
- [ ] Mobile 375px — onglet Quêtes
- [ ] Lyra aff1 + Kael + Seren (corpus V2)
- [ ] Fallback legacy (renommer temporairement `linkCorpusV2.json`)
