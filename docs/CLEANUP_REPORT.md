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
| Flags dev `DEV_UNLIMITED_GACHA`, `DEV_UNLOCK_ALL_MINIGAMES` | P1 | Gated via `import.meta.env.DEV` (`830415f`) |

## Panorama village — optimisation asset (2026-06-22)

| | Avant | Après |
|---|---|---|
| Chemin HEAD | `public/village/panorama-base.png` | `public/village/panorama-base.webp` |
| Taille | 86.16 MB (90 344 968 o) | 1.57 MB (1 642 102 o) |
| Dimensions | 12800×4263 | 12800×4263 |
| Format | PNG non progressif | WebP q85 |
| Commit | `5dd5ab9` | `ab0c97b` |
| Références | `villageMap.ts` → `PANORAMA_BASE_ASSET` | idem (`.webp`) |

**Blob historique :** le PNG 86 MB reste dans l'historique de la branche (`5dd5ab9`). Un merge dans `main` l'introduirait une fois dans l'historique GitHub. HEAD et futurs clones n'utilisent que le WebP.

**Recommandation Git :** merge acceptable pour le runtime ; optionnel `git filter-repo` sur la branche avant merge si on veut un historique sans gros blob. Git LFS non requis pour l'instant (WebP < 2 MB).
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
