# Cutouts émotion v3 — régénération

## Problème v2
Tous les cutouts utilisaient `EMOTION_CUTOUT_STYLE` verrouillé sur **Etna affinity-01** → mélange d’identités (magenta, ailes, etc.).

## Correctif
- `scripts/staging/companion-visual-pack-data.mjs` : ancre **affinity-1 par compagnon** + `identityLock` explicite (NOT Etna sauf Etna).
- Sortie staging : `companion-{id}-emotion-{emotion}-cutout-v3.png`
- Promotion prod : `node scripts/regenerate-emotion-cutouts.mjs promote {id}`

## Commandes
```bash
node scripts/regenerate-emotion-cutouts.mjs list
node scripts/regenerate-emotion-cutouts.mjs archive-obsolete --all-pending   # v2 public → old_assets
node scripts/regenerate-emotion-cutouts.mjs migrate-legacy-archives
node scripts/regenerate-emotion-cutouts.mjs promote lyra maeve
```

## Archive obsolete (jamais supprimer)

`old_assets/companions/{id}/cutouts/emotion-{emotion}.png`

Les v2 retirés de `public/` y sont **déplacés** (rename), pas copiés puis effacés.

## Statut (2026-06-24)
| Compagnon | v3 prod |
|-----------|---------|
| lyra | ✓ 8/8 |
| maeve | ✓ 8/8 |
| autres (17) | ○ 0/8 |

Total : 16/152 — suite compagnon par compagnon (priorité : kael, noa, sora, asha, elwen, puis Disagrea).
