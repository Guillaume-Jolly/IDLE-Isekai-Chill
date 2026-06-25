# event-disagrea — snapshot cold storage

Snapshots legacy de l’event Disagrea (layered portraits, backups NSFW). **Non servi en jeu.**

Runtime prod : `assets/Compagnons/Autres/disagrea-integrated/`, `assets/Background/disagrea-event/`, dev gallery `/dev-assets/event-disagrea/…` (`vite.config.ts`).

Scripts : `promote-disagrea-integrated-affinity.mjs`, `organize-disagrea-validated.mjs`, `composite-disagrea-portraits.mjs`.

---

## Contenu actuel (20 fichiers)

| Sous-dossier | Fichiers | Rôle |
|--------------|--------:|------|
| `public-layered-legacy/etna/` | 4 | Cutouts layered `cutout-1` … `cutout-4` (legacy `public/` avant promotion integrated) |
| `public-layered-legacy/flonne/` | 5 | Idem |
| `public-layered-legacy/laharl/` | 5 | Idem |
| `public-layered-legacy/pleinair/` | 5 | Idem |
| `nsfw-replaced/` | 1 | Backup NSFW Etna affinity peak (`etna-affinity-4-nsfw-peak-plus-backup.png`) |

Les backgrounds layered et `cutout-5` (Etna) ont été **dedup byte-identiques** vers `old_assets/archive/` (phase 3). Voir ci-dessous.

---

## Déjà archivé (dedup 2026-06-25)

| Destination | Contenu |
|-------------|---------|
| `archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/*/` | 40× backgrounds (`background-*.png`, `*-wide.png`) — identiques à `assets/Background/disagrea-event/` |
| `archive/2026-06-25-dedup-internal/event-disagrea/` | `cutout-5.png` (Etna), doublon NSFW vs `nsfw-replaced/` |

Scan dry-run post-phase 4 : **0 mouvement** supplémentaire (`scan-old-assets-duplicates.mjs`).

Les cutouts restants ici sont **bytes différents** des integrated prod — cold storage intentionnel.

---

## Sous-dossiers

- [`public-layered-legacy/`](./public-layered-legacy/) — calques source event (réf. `scripts/promote-disagrea-integrated-affinity.mjs`)
- [`nsfw-replaced/`](./nsfw-replaced/) — backup avant remplacement NSFW prod
