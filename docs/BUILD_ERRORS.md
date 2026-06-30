# Erreurs build TypeScript — diagnostic

> ⚠️ **Document historique** — build **OK** depuis release 2.1. Lint global ~**33** issues (non bloquant).  
> **Voir :** [`docs/traceability/project-state.md`](./traceability/project-state.md)

> Phase 1.5 — diagnostic · **Phase build fix — corrigé le 2026-06-22**  
> Commit : `fix: resolve TypeScript build errors`

## Statut final

| Élément | Statut |
|---------|--------|
| `tsc -b` | ✅ Passé |
| `vite build` | ✅ Passé (après correction CSS orpheline — voir ci-dessous) |
| `npm run lint` | ❌ Échoue (~33 erreurs préexistantes documentées fin 2.1, hors scope build) |
| Tests automatisés | ❌ Aucun framework (vitest/jest/playwright absent) |

---

## Validation (2026-06-22)

**Commande :**

```bash
npm run build
```

**Résultat :**

```
> tsc -b && vite build
✓ built in ~3.4s
exit code 0
```

**Correction CSS découverte lors de la validation (hors 12 erreurs TS) :**

| Fichier | Problème | Correction |
|---------|----------|------------|
| `Minigames.css` ~l.4570 | Propriétés CSS orphelines (sélecteur `.mg-capture-compare-overlay` manquant) | Ajout du sélecteur manquant — requis pour `vite build` |

---

## Corrections appliquées (12 erreurs TS)

| ID | Fichier | Correction appliquée | Statut |
|----|---------|----------------------|--------|
| BE-01 | `DressageGame.tsx` | Retrait import `applyCraftRecipe` | ✅ |
| BE-02 | `DressageGame.tsx` | Guard explicite `weakestDuplicate` avant usage | ✅ |
| BE-03 | `FamiliarCaptureGame.tsx` | Cascade — disparu après BE-04 | ✅ |
| BE-04 | `captureHunt.ts` + `FamiliarCaptureGame.tsx` | Export `CaptureGamePhase` ; `useState<CaptureGamePhase>` | ✅ |
| BE-05 | `FamiliarCaptureGame.tsx` | Cascade — disparu après BE-04 | ✅ |
| BE-06 | `FamiliarCaptureGame.tsx` | `MinigameSave['refugeResources']` dans type `persist` | ✅ |
| BE-07 | `FamiliarCaptureGame.tsx` | Cascade — disparu après BE-04 | ✅ |
| BE-08 | `FamiliarCaptureGame.tsx` | Cascade — disparu après BE-04 | ✅ |
| BE-09 | `myrionMvp2.ts` | Suppression variable `siblings` (code mort) | ✅ |
| BE-10 | `myrionMvp2.ts` | Suppression variable `protectFromAutoRelease` (littéraux inline conservés) | ✅ |
| BE-11 | `myrionMvp3.ts` | Guard `if (rawCompatibility === 'blocked') throw` + narrow TS | ✅ |
| BE-12 | `myrionMvp3.ts` | `void parentB` — signature API préservée | ✅ |

---

## Fichiers modifiés (build fix)

| Fichier | Nature |
|---------|--------|
| `src/data/captureHunt.ts` | Nouveau type `CaptureGamePhase` |
| `src/components/minigames/FamiliarCaptureGame.tsx` | Type phase + persist |
| `src/components/minigames/DressageGame.tsx` | Import + guard doublon |
| `src/data/myrionMvp2.ts` | Variables mortes retirées |
| `src/data/myrionMvp3.ts` | Guard reproduction + parentB |
| `src/components/minigames/Minigames.css` | Sélecteur overlay manquant (vite) |

---

## Diagnostic initial (archivé)

### Commande exécutée (Phase 1.5)

```bash
npm run build
```

### Résultat initial — exit code 2

```
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
src/data/myrionMvp3.ts(380,58): error TS6133: 'parentB' is declared but its value is never read.
```

### Classement initial (référence)

- **A — Évidentes et sûres :** BE-01, BE-02, BE-04, BE-06, BE-09, BE-12
- **B — Logique métier :** BE-10, BE-11
- **C — Risquées :** élargir `EchoEgg.compatibility` à `'blocked'` (non retenu)

---

## Anomalie Git (Phase 1)

Le commit `924b8ca` (`docs: document current project state`) contient un artefact `EOF` dans le corps du message (heredoc PowerShell). Historique **non poussé** (`ahead 3`) — amend recommandé manuellement si souhaité :

```bash
git rebase -i 20ee407   # reword 924b8ca
```

---

## Références

- État technique : `docs/TECHNICAL_STATE.md` (mettre à jour : build ✅)
- Priorité P0-01 : résolu
