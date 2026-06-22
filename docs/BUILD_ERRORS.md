# Erreurs build TypeScript — diagnostic

> Phase 1.5 — diagnostic uniquement, **aucune correction appliquée**.  
> Dernière exécution : 2026-06-22

## 1. Commande exécutée

```bash
npm run build
```

Équivalent interne : `tsc -b && vite build` (voir `package.json`).

## 2. Résultat

**Exit code : 2** — la compilation TypeScript échoue ; Vite n’est pas atteint.

```
> idle-isekai-chill-game@0.0.0 build
> tsc -b && vite build

src/components/minigames/DressageGame.tsx(50,10): error TS6133: 'applyCraftRecipe' is declared but its value is never read.
src/components/minigames/DressageGame.tsx(496,10): error TS18048: 'comparison.weakestDuplicate' is possibly 'undefined'.
src/components/minigames/FamiliarCaptureGame.tsx(35,3): error TS6133: 'resolveAutoCaptureDecision' is declared but its value is never read.
src/components/minigames/FamiliarCaptureGame.tsx(63,1): error TS6133: 'HuntAutoDecisionSettingsPanel' is declared but its value is never read.
src/components/minigames/FamiliarCaptureGame.tsx(150,38): error TS2304: Cannot find name 'Phase'.
src/components/minigames/FamiliarCaptureGame.tsx(218,32): error TS18048: 'minigameSave' is possibly 'undefined'.
src/components/minigames/FamiliarCaptureGame.tsx(231,53): error TS2304: Cannot find name 'huntAutoDecision'.
src/components/minigames/FamiliarCaptureGame.tsx(238,7): error TS2304: Cannot find name 'huntAutoDecision'.
src/data/myrionMvp2.ts(559,9): error TS6133: 'siblings' is declared but its value is never read.
src/data/myrionMvp2.ts(568,9): error TS6133: 'protectFromAutoRelease' is declared but its value is never read.
src/data/myrionMvp3.ts(277,5): error TS2322: Type 'Compatibility' is not assignable to type '"strong" | "normal" | "unstable"'.
  Type '"blocked"' is not assignable to type '"strong" | "normal" | "unstable"'.
src/data/myrionMvp3.ts(380,58): error TS6133: 'parentB' is declared but its value is never read.
```

**Note :** l’audit Phase 1 documentait **8 erreurs**. Le build actuel en signale **12** — 4 erreurs supplémentaires dans `FamiliarCaptureGame.tsx` (type `Phase` manquant + effets en cascade probables).

---

## 3. Tableau des erreurs

| ID | Fichier | Ligne | Code TS | Message | Cause probable | Criticité | Correction recommandée | Risque régression |
|----|---------|-------|---------|---------|----------------|-----------|------------------------|-------------------|
| BE-01 | `DressageGame.tsx` | 50 | TS6133 | `applyCraftRecipe` importé, jamais lu | Import résiduel ; le craft passe par `RefugeCraftPanel` → `handleCraftResult` (l.371) sans appeler `applyCraftRecipe` directement | P0 | Retirer `applyCraftRecipe` de l’import ; conserver `CraftResult` | **Faible** — import mort |
| BE-02 | `DressageGame.tsx` | 496 | TS18048 | `comparison.weakestDuplicate` possibly undefined | Garde l.481 (`if (!pendingHatch?.comparison.weakestDuplicate) return`) ; destructuring l.482 ne propage pas le narrowing pour l.496 | P0 | Utiliser `comparison.weakestDuplicate!.name` (comme l.483 pour `.id`) ou variable locale après garde | **Faible** — garde runtime déjà présente |
| BE-03 | `FamiliarCaptureGame.tsx` | 35 | TS6133 | `resolveAutoCaptureDecision` unused | Probable **faux positif en cascade** : utilisé l.369 dans `finishCapture` | P0 | Corriger BE-04 d’abord ; si persiste, vérifier que le callback est bien typé | **Faible** si cascade |
| BE-04 | `FamiliarCaptureGame.tsx` | 150 | TS2304 | Cannot find name `Phase` | Type `Phase` jamais défini ni importé ; valeurs utilisées : `'explore' \| 'hunt' \| 'result'` (l.334, 467, 495) ; `HuntPhase` existe dans `captureHunt.ts` | **P0** | Ajouter `type CaptureGamePhase = 'explore' \| 'hunt' \| 'result'` localement ou exporter depuis `captureHunt.ts` | **Faible** — typage manquant |
| BE-05 | `FamiliarCaptureGame.tsx` | 63 | TS6133 | `HuntAutoDecisionSettingsPanel` unused | Probable **faux positif en cascade** : utilisé l.766 dans drawer `objectives` | P0 | Corriger BE-04 d’abord | **Faible** si cascade |
| BE-06 | `FamiliarCaptureGame.tsx` | 218 | TS18048 | `minigameSave` possibly undefined | Type du patch `persist` : `typeof minigameSave.refugeResources` évalue `minigameSave` (prop optionnelle `MinigameProps`) en position de type | P0 | Remplacer par `MinigameSave['refugeResources']` ou type explicite importé | **Faible** — type-only |
| BE-07 | `FamiliarCaptureGame.tsx` | 231 | TS2304 | Cannot find name `huntAutoDecision` | Probable **cascade BE-04** ; `huntAutoDecision` est bien déclaré l.120 | P0 | Disparaît probablement après BE-04 ; sinon vérifier ordre des hooks | **Faible** si cascade |
| BE-08 | `FamiliarCaptureGame.tsx` | 238 | TS2304 | Cannot find name `huntAutoDecision` | Idem BE-07 (tableau deps `useCallback`) | P0 | Idem BE-07 | **Faible** si cascade |
| BE-09 | `myrionMvp2.ts` | 559 | TS6133 | `siblings` unused | Variable calculée mais jamais lue ; `findWeakestDuplicate` fait le même filtrage en interne | P1 | Supprimer la ligne `siblings` | **Faible** — code mort |
| BE-10 | `myrionMvp2.ts` | 568 | TS6133 | `protectFromAutoRelease` unused | Variable calculée l.568–569 ; branches retour utilisent des littéraux `true`/`false` inline (l.622–705) au lieu de la variable | P1 | Supprimer la variable **ou** refactoriser les retours pour l’utiliser (préférer suppression — moins de diff) | **Faible** si suppression ; **moyen** si refactor pour DRY |
| BE-11 | `myrionMvp3.ts` | 277 | TS2322 | `Compatibility` inclut `'blocked'`, `EchoEgg.compatibility` non | `getBreedingCompatibility` retourne `'blocked'` ; `EchoEgg` (`minigameSave.ts` l.85) n’accepte que `'strong' \| 'normal' \| 'unstable'` ; `createEchoEgg` assigne directement | **P0** | **Option A (sûre)** : assert/narrow après garde `validateBreeding` (appelant) ; dans `createEchoEgg`, typer retour compatibilité sans `'blocked'` ou cast après check. **Option B** : élargir `EchoEgg.compatibility` — **déconseillé** (œuf blocked n’a pas de sens métier) | **Moyen** — vérifier que `validateBreeding` est toujours appelé avant `createEchoEgg` |
| BE-12 | `myrionMvp3.ts` | 380 | TS6133 | `parentB` unused | `breedingResourceBiome` ne retourne que le biome de `parentA` | P1 | Préfixer `_parentB` ou retirer le paramètre si l’API le permet | **Faible** — signature publique à préserver si exportée |

---

## 4. Classement des corrections

### A — Évidentes et sûres (priorité immédiate)

| ID | Action |
|----|--------|
| BE-01 | Retirer import `applyCraftRecipe` |
| BE-02 | Non-null assertion ou variable locale après garde |
| BE-04 | Définir type `Phase` / `CaptureGamePhase` |
| BE-06 | Typer `refugeResources` sans référencer prop optionnelle |
| BE-09 | Supprimer `siblings` |
| BE-12 | Renommer `parentB` → `_parentB` |

**Effet attendu :** BE-03, BE-05, BE-07, BE-08 devraient disparaître (cascade).

### B — Nécessitent lecture logique métier

| ID | Action |
|----|--------|
| BE-10 | Choisir : supprimer variable morte vs unifier les retours avec `protectFromAutoRelease` |
| BE-11 | Confirmer le contrat : `createEchoEgg` ne doit jamais recevoir une paire `blocked` ; ajouter narrow TypeScript cohérent avec `validateBreeding` |

**Vérification manuelle TNR :** reproduction / éclosion (`EchoNursery`), remplacement doublon éclosion (`DressageGame.handleReplaceWeakestHatch`), auto-capture chasse.

### C — Risquées / à valider

| ID | Risque |
|----|--------|
| BE-11 (option B) | Élargir `EchoEgg.compatibility` à `'blocked'` polluerait le modèle de données et les saves |
| BE-10 (refactor DRY) | Changer la logique `protectFromAutoRelease` pourrait modifier le comportement auto-release chasse |

---

## 5. Ordre de correction recommandé

1. **BE-04** — type `Phase` (débloque FamiliarCaptureGame)
2. **BE-06** — type `refugeResources` dans `persist`
3. **BE-01, BE-02, BE-09, BE-12** — nettoyage ciblé
4. **BE-11** — alignement types reproduction
5. **BE-10** — suppression variable (minimal) ou refactor (optionnel)
6. Relancer `npm run build` — confirmer 0 erreur

Estimation : **~15–30 min**, 4 fichiers touchés, diff < 30 lignes si approche minimale.

---

## 6. Commit futur proposé

```
fix: resolve TypeScript build errors
```

**Périmètre strict :**

- `src/components/minigames/DressageGame.tsx`
- `src/components/minigames/FamiliarCaptureGame.tsx`
- `src/data/myrionMvp2.ts`
- `src/data/myrionMvp3.ts`
- Éventuellement `src/data/captureHunt.ts` (si export du type `CaptureGamePhase`)
- Éventuellement `docs/BUILD_ERRORS.md` (marquer résolu)

**Hors périmètre :** flags dev, assets, nettoyage général Phase 2, refactor `App.tsx`.

---

## 7. Impact projet

| Domaine | Impact si non corrigé |
|---------|----------------------|
| CI / release | Build impossible |
| Dev | `npm run build` et preview prod bloqués ; `npm run dev` fonctionne (Vite sans tsc strict en dev) |
| Gameplay runtime | Aucun — erreurs compile-time uniquement |
| Saves | Aucun impact direct des corrections proposées |

---

## 8. Références

- État build documenté initialement : `docs/TECHNICAL_STATE.md` (8 erreurs — à mettre à jour après fix)
- Priorité backlog : `docs/TODO_PRIORITIZED.md` P0-01
