# Cleanup Report — Phase 2

> **Date :** 2026-06-22  
> **HEAD :** `60fbc11` — `chore: remove legacy palmon svg assets`  
> **Working tree :** propre (commit-only)

## Fichiers nettoyés / commités

| Action | Fichiers | Commit |
|--------|----------|--------|
| Suppression SVG legacy Palmon (24 espèces démo) | 50 fichiers `public/minigames/palmons/**/*.svg` + 4 PNG legacy | `60fbc11` |
| Fichiers helper orphelins supprimés localement | `InventoryChip.tsx`, `inventoryIcons.ts` (jamais trackés, logique inlinée Lot C) | — |
| Revert preview dev | `public/minigames/_preview/index.html` | — (non commité, ignoré via `.gitignore`) |

## Fichiers exclus (volontaire)

| Chemin | Raison |
|--------|--------|
| `.tmp/` | Temporaire — ignoré `.gitignore` |
| `assets/*-import/` | Sources import locales — ignoré |
| `assets/village-layout/` | Layout intermédiaire — ignoré |
| `public/minigames/_preview/` | Preview dev — ignoré |

## Suppressions effectuées

- **50 assets legacy** remplacés par PNG Myrions (`dcfeccf`, 255 fichiers).
- Code runtime (`PalmonSprite.tsx`) : chemins PNG uniquement — aucune référence aux SVG supprimés.

## Risques

| Risque | Niveau | Mitigation |
|--------|--------|------------|
| Stash `rewrite-git-temp-stash` redondant | P2 | Conservé — ne pas drop sans revue manuelle |
| Lint 36 problèmes préexistants | P2 | Hors périmètre Phase 2 |
| Flags dev `DEV_UNLIMITED_GACHA`, `DEV_UNLOCK_ALL_MINIGAMES` | P1 | Commités `91e4d2f` — désactiver avant prod |
| CSS inventaire dupliqué dans `App.css` | P3 | Styles dédiés existent (`InventoryPanel.css`) |

## Validations

```text
npm run build  → exit 0
npm run lint   → exit 1 (36 problems, préexistants)
git status     → clean
```

## Commandes lancées

- Découpage WT lots B/C/D/G/H/I + Phase 2 SVG
- `npm run build`, `npm run lint`
- Smoke test navigateur (village, hub, inventaire, compagnons)

## Reste à nettoyer plus tard

- Corriger lint préexistant (minigames hooks, `villageMap.ts` unused var)
- Dédoublonner CSS inventaire dans `App.css`
- Revoir stash après validation utilisateur
- Phase 3 TNR gameplay approfondi
