# Consolidation gameplay global — MVP 18

> **Date :** 2026-06-30  
> **Branche (historique, mergée) :** `feature/myrion-worksite-mvp2` → `main` @ `v2.1.0.0`  
> **Prérequis :** MVP 17 (conversations de lien) terminé

## 1. Objectif

Rendre les boucles principales du Havre des Brumes **lisibles et connectées** sans nouvelle feature ni refonte : textes courts, guidance priorisée, distinction Parler / conversations de lien, cohérence inter-écrans.

Hors scope : équilibrage Ferme lunaire, extension corpus bond (285), bonus chiffrés compagnons, TNR complet (MVP 20).

## 2. Systèmes vérifiés

| Système | Rôle attendu | Statut audit |
|---------|--------------|--------------|
| **Village** | Production passive, accès bâtiments / mini-jeux | OK — guidance + hint `village` |
| **Refuge** | Myrions capturés, soin / observation | OK — lié à Chasse + chantier via hints |
| **Chasse** | Capture Myrions → Refuge / chantier | **Corrigé** — guidance pointait Refuge sans Myrion |
| **Inventaire** | Ressources Havre, fragments, jetons | OK — éclats astraux **non** exposés (chantier interne) |
| **Gacha** | Invocation tickets / fragments | OK — ne bloque plus les étapes early |
| **Liens** | Stats, affinité, bond + Parler | **Clarifié** — distinction visible |
| **Mini-jeu Parler** | 3 rounds, coût mana/stardust, récompenses | Inchangé — libellés clarifiés |
| **Ferme lunaire** | Assignation, biomes, surveillance, prestige LR | Non modifié (hors textes hints) |
| **Onboarding** | `nextStepGuidance` + `NextStepGuidance` | **Repriorisé** |
| **Story chapters** | `VillageStoryPanel` / hub | Déjà branché — hors scope corrections |

## 3. Incohérences trouvées

1. **Guidance save neuve sans Myrion** : après engagement chantier, « Voir le Refuge » alors qu’aucun Myrion n’existe → Refuge vide.
2. **« Consulter l’inventaire » trop tôt** : déclenché dès &lt; 4 types de ressources, peu actionnable sur save neuve.
3. **Gacha prioritaire** avant boucle Myrion stabilisée si le joueur avait des tickets.
4. **Parler vs conversations de lien** : libellés proches (« Conversations & liens » hub, « Conversations lien » panneau) — risque de confusion.
5. **Inventaire** : pas de mention que le prestige astral (éclats) reste sur le chantier.

## 4. Corrections appliquées

### Guidance (`src/data/nextStepGuidance.ts`)

Nouvelle priorité :

1. Chantier non engagé → Ferme lunaire  
2. Aucun Myrion → **Chasse** (`farm-capture`)  
3. Myrions sans assignation → assigner au chantier  
4. Points de stat / jetons en attente → onglet **Liens**  
5. Tickets + bases OK → Gacha (piste, pas bloquant)  
6. Un seul biome + production ≥ 18 → étendre le chantier  
7. Bases OK + affinité &lt; 5 → approfondir un lien (Liens)  
8. Refuge si production chantier faible  
9. Sinon → continuer le Havre (hub mini-jeux)

Contexte étendu : `companions[id].affinity` pour suggestions Liens.

### Parler vs conversations de lien

| | **Conversations de lien** | **Mini-jeu Parler** |
|---|---------------------------|---------------------|
| Accès | Onglet Liens, panneau par carte | Bouton Parler ou hub « Mini-jeu Parler » |
| Coût | Gratuit | Mana + poussière stellaire |
| Format | Question → réponse (lecture) | 3 rounds à choix, score, récompenses |
| Déblocage | Paliers d’affinité 1–5 | Bâtiments village débloqués |
| Fichiers | `companionBondConversations.ts` | `ConversationGame` + corpus V2 |

### Textes harmonisés

- `App.tsx` — intro onglet Liens, tooltip Parler, note inventaire (éclats astraux)
- `CompanionBondPanel.tsx` — intro + libellé « Conversations de lien »
- `ConversationPicker.tsx` — eyebrow « Mini-jeu Parler », copy distinction
- `MinigameHub.tsx` — carte « Mini-jeu Parler », tooltip ℹ️
- `systemHints.ts` — Refuge ↔ Chasse ↔ chantier

## 5. Guidance « Que faire maintenant »

Affichée sur **carte village** et **hub mini-jeux** (`NextStepGuidance` + bouton « Y aller »).

- **Save neuve** : Ferme lunaire → Chasse → assignation.  
- **Joueur avec tickets** : Gacha après bases (Myrions + assignation), pas en premier.  
- **Joueur avec compagnons** : Liens pour stats puis approfondir liens.  
- **Joueur avancé** : extension biomes chantier si prairie seule saturée.

## 6. Limites connues

- Pas de persistance « conversation de lien lue » en save.
- Pas de lien direct depuis guidance vers une conversation bond précise (vue Liens seulement).
- 5 compagnons non-humains (brann, thorne, …) hors `COMPANIONS` — pas dans guidance Liens.
- `npm run build` — **OK** en release 2.1 (voir `docs/traceability/project-state.md`).
- Story chapters : pas de repasse contenu MVP 18.

## 7. Reporté MVP 19–21

| MVP | Sujet |
|-----|--------|
| **19** | Relecture fonctionnelle + cohérence contenu (bond, corpus Parler, story) |
| **20** | TNR complet transversal |
| **21** | Extension bond (285+), persistance lectures, nouveaux compagnons |

## 8. Validation

```bash
npm run validate:companion-bonds
node node_modules/typescript/bin/tsc -b
node node_modules/vite/bin/vite.js build
```

Smoke court : Village, hub, Ferme lunaire, Refuge, Chasse, Inventaire, Gacha, Liens, Parler, mobile ~390 px, console propre.

## 9. Fichiers modifiés

- `src/data/nextStepGuidance.ts`
- `src/data/systemHints.ts`
- `src/App.tsx`
- `src/App.css`
- `src/components/CompanionBondPanel.tsx`
- `src/components/minigames/ConversationPicker.tsx`
- `src/components/minigames/MinigameHub.tsx`
- `docs/GLOBAL_GAMEPLAY_CONSOLIDATION_MVP18.md`
