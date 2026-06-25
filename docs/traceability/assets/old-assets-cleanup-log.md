# old_assets cleanup log

Dedup rule: **never delete.** Never archive a mirror if the same bytes are the active file in `assets/`. If disk space is needed → dedup + in-repo sort first, then move to `D:\Isekai-slow-life\Archiive\Old_assets` (not delete).


---

## Session 2026-06-25

| From | To | Reason | Status |
|------|-----|--------|--------|
| `public/village/buildings-map/arcane-library-sil.png` | `old_assets/public-mirror/village/buildings-map/arcane-library-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/arcane-library.png` | `old_assets/public-mirror/village/buildings-map/arcane-library.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/clear-spring-sil.png` | `old_assets/public-mirror/village/buildings-map/clear-spring-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/clear-spring.png` | `old_assets/public-mirror/village/buildings-map/clear-spring.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/inn-sil.png` | `old_assets/public-mirror/village/buildings-map/inn-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/inn.png` | `old_assets/public-mirror/village/buildings-map/inn.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/mist-garden-sil.png` | `old_assets/public-mirror/village/buildings-map/mist-garden-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/mist-garden.png` | `old_assets/public-mirror/village/buildings-map/mist-garden.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/moon-farm-sil.png` | `old_assets/public-mirror/village/buildings-map/moon-farm-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/moon-farm.png` | `old_assets/public-mirror/village/buildings-map/moon-farm.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/ribbon-workshop-sil.png` | `old_assets/public-mirror/village/buildings-map/ribbon-workshop-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/ribbon-workshop.png` | `old_assets/public-mirror/village/buildings-map/ribbon-workshop.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/star-market-sil.png` | `old_assets/public-mirror/village/buildings-map/star-market-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/star-market.png` | `old_assets/public-mirror/village/buildings-map/star-market.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/traveler-theater-sil.png` | `old_assets/public-mirror/village/buildings-map/traveler-theater-sil.png` | Village orphan — not referenced in src runtime | done |
| `public/village/buildings-map/traveler-theater.png` | `old_assets/public-mirror/village/buildings-map/traveler-theater.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-ai.png` | `old_assets/public-mirror/village/panorama-ai.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-stage-0.png` | `old_assets/public-mirror/village/panorama-stage-0.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-stage-1.png` | `old_assets/public-mirror/village/panorama-stage-1.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-stage-2.png` | `old_assets/public-mirror/village/panorama-stage-2.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-stage-3.png` | `old_assets/public-mirror/village/panorama-stage-3.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama-stage-4.png` | `old_assets/public-mirror/village/panorama-stage-4.png` | Village orphan — not referenced in src runtime | done |
| `public/village/panorama.png` | `old_assets/public-mirror/village/panorama.png` | Village orphan — not referenced in src runtime | done |

### Reste légitime dans `public/`

| Chemin | Pourquoi |
|--------|----------|
| `public/village/` (3 fichiers actifs) | Runtime village — pas de doublon dans `assets/` |
| `public/live2d/` | Demo Live2D Haru |
| `public/assets/**` README | Redirects post-migration |
| `public/gacha/README.md` | Redirect → `assets/Gacha/` |
| `favicon.svg`, `icons.svg`, `manifest.webmanifest` | Shell PWA |


---

## Session 2026-06-25 — migrate-public-to-old-assets

| From | To | Reason | Status |
|------|-----|--------|--------|
| `public/assets/companions/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/biomes/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/companions/talia/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/myrions/cutout/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/myrions/silhouette/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/dressage/enclosures/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/dressage/myrions/chibi/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/hub/presentations/.gitkeep` | `` | non-image extension | skip-extension |
| `public/assets/minigames/hub/stages/.gitkeep` | `` | non-image extension | skip-extension |
| `public/gacha/README.md` | `` | README redirect | skip-readme |

### Stats

```json
{
  "moved": 0,
  "skip-dedup-assets": 0,
  "skip-dedup-remove-public": 0,
  "skip-dest-exists": 0,
  "conflicts": 0,
  "skip-readme": 8,
  "skip-extension": 2,
  "errors": 0
}
```


### Reste légitime dans `public/`

| Chemin | Pourquoi |
|--------|----------|
| `public/village/` (3 fichiers actifs) | Runtime village |
| `public/live2d/` | Demo Live2D Haru |
| `public/assets/**` README | Redirects post-migration |
| `public/gacha/README.md` | Redirect → `assets/Gacha/` |
| `favicon.svg`, `icons.svg`, `manifest.webmanifest` | Shell PWA |


---

## Session 2026-06-25 — migrate-public-to-old-assets

| From | To | Reason | Status |
|------|-----|--------|--------|
| `public/assets/companions/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/biomes/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/companions/talia/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/myrions/cutout/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/capture/myrions/silhouette/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/dressage/enclosures/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/dressage/myrions/chibi/README.md` | `` | README redirect | skip-readme |
| `public/assets/minigames/hub/presentations/.gitkeep` | `` | non-image extension | skip-extension |
| `public/assets/minigames/hub/stages/.gitkeep` | `` | non-image extension | skip-extension |
| `public/assets/README.md` | `` | README redirect | skip-readme |
| `public/gacha/README.md` | `` | README redirect | skip-readme |
| `public/generated-backup/asha-affinity-1.png` | `assets/Compagnons/asha/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/asha-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/asha-affinity-2.png` | `assets/Compagnons/asha/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/asha-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/asha-affinity-3.png` | `assets/Compagnons/asha/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/asha-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/asha-affinity-4.png` | `assets/Compagnons/asha/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/asha-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/asha-affinity-5.png` | `assets/Compagnons/asha/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/asha-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/elwen-affinity-1.png` | `assets/Compagnons/elwen/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/elwen-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/elwen-affinity-2.png` | `assets/Compagnons/elwen/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/elwen-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/elwen-affinity-3.png` | `assets/Compagnons/elwen/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/elwen-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/elwen-affinity-4.png` | `assets/Compagnons/elwen/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/elwen-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/elwen-affinity-5.png` | `assets/Compagnons/elwen/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/elwen-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/iris-affinity-1.png` | `assets/Compagnons/iris/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/iris-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/iris-affinity-2.png` | `assets/Compagnons/iris/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/iris-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/iris-affinity-3.png` | `assets/Compagnons/iris/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/iris-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/iris-affinity-4.png` | `assets/Compagnons/iris/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/iris-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/iris-affinity-5.png` | `assets/Compagnons/iris/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/iris-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/kael-affinity-1.png` | `assets/Compagnons/kael/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/kael-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/kael-affinity-2.png` | `assets/Compagnons/kael/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/kael-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/kael-affinity-3.png` | `assets/Compagnons/kael/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/kael-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/kael-affinity-4.png` | `assets/Compagnons/kael/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/kael-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/kael-affinity-5.png` | `assets/Compagnons/kael/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/kael-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/lyra-affinity-1.png` | `assets/Compagnons/lyra/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/lyra-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/lyra-affinity-2.png` | `assets/Compagnons/lyra/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/lyra-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/lyra-affinity-3.png` | `assets/Compagnons/lyra/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/lyra-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/lyra-affinity-4.png` | `assets/Compagnons/lyra/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/lyra-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/lyra-affinity-5.png` | `assets/Compagnons/lyra/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/lyra-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/maeve-affinity-1.png` | `assets/Compagnons/maeve/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/maeve-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/maeve-affinity-2.png` | `assets/Compagnons/maeve/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/maeve-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/maeve-affinity-3.png` | `assets/Compagnons/maeve/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/maeve-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/maeve-affinity-4.png` | `assets/Compagnons/maeve/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/maeve-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/maeve-affinity-5.png` | `assets/Compagnons/maeve/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/maeve-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/mira-affinity-1.png` | `assets/Compagnons/mira/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/mira-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/mira-affinity-2.png` | `assets/Compagnons/mira/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/mira-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/mira-affinity-3.png` | `assets/Compagnons/mira/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/mira-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/mira-affinity-4.png` | `assets/Compagnons/mira/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/mira-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/mira-affinity-5.png` | `assets/Compagnons/mira/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/mira-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/nami-affinity-1.png` | `assets/Compagnons/nami/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/nami-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/nami-affinity-2.png` | `assets/Compagnons/nami/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/nami-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/nami-affinity-3.png` | `assets/Compagnons/nami/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/nami-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/nami-affinity-4.png` | `assets/Compagnons/nami/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/nami-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/nami-affinity-5.png` | `assets/Compagnons/nami/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/nami-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/noa-affinity-1.png` | `assets/Compagnons/noa/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/noa-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/noa-affinity-2.png` | `assets/Compagnons/noa/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/noa-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/noa-affinity-3.png` | `assets/Compagnons/noa/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/noa-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/noa-affinity-4.png` | `assets/Compagnons/noa/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/noa-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/noa-affinity-5.png` | `assets/Compagnons/noa/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/noa-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/runa-affinity-1.png` | `assets/Compagnons/runa/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/runa-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/runa-affinity-2.png` | `assets/Compagnons/runa/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/runa-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/runa-affinity-3.png` | `assets/Compagnons/runa/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/runa-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/runa-affinity-4.png` | `assets/Compagnons/runa/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/runa-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/runa-affinity-5.png` | `assets/Compagnons/runa/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/runa-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/seren-affinity-1.png` | `assets/Compagnons/seren/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/seren-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/seren-affinity-2.png` | `assets/Compagnons/seren/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/seren-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/seren-affinity-3.png` | `assets/Compagnons/seren/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/seren-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/seren-affinity-4.png` | `assets/Compagnons/seren/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/seren-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/seren-affinity-5.png` | `assets/Compagnons/seren/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/seren-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/solene-affinity-1.png` | `assets/Compagnons/solene/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/solene-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/solene-affinity-2.png` | `assets/Compagnons/solene/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/solene-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/solene-affinity-3.png` | `assets/Compagnons/solene/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/solene-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/solene-affinity-4.png` | `assets/Compagnons/solene/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/solene-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/solene-affinity-5.png` | `assets/Compagnons/solene/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/solene-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/sora-affinity-1.png` | `assets/Compagnons/sora/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/sora-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/sora-affinity-2.png` | `assets/Compagnons/sora/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/sora-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/sora-affinity-3.png` | `assets/Compagnons/sora/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/sora-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/sora-affinity-4.png` | `assets/Compagnons/sora/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/sora-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/sora-affinity-5.png` | `assets/Compagnons/sora/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/sora-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/talia-affinity-1.png` | `assets/Compagnons/talia/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/talia-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/talia-affinity-2.png` | `assets/Compagnons/talia/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/talia-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/talia-affinity-3.png` | `assets/Compagnons/talia/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/talia-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/talia-affinity-4.png` | `assets/Compagnons/talia/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/talia-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/talia-affinity-5.png` | `assets/Compagnons/talia/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/talia-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/zelie-affinity-1.png` | `assets/Compagnons/zelie/affinite/affinity-1.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/zelie-affinity-1.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/zelie-affinity-2.png` | `assets/Compagnons/zelie/affinite/affinity-2.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/zelie-affinity-2.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/zelie-affinity-3.png` | `assets/Compagnons/zelie/affinite/affinity-3.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/zelie-affinity-3.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/zelie-affinity-4.png` | `assets/Compagnons/zelie/affinite/affinity-4.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/zelie-affinity-4.png` | `` | removed redundant public mirror | skip-dedup-remove-public |
| `public/generated-backup/zelie-affinity-5.png` | `assets/Compagnons/zelie/affinite/affinity-5.png` | duplicate of active assets file | skip-dedup-assets |
| `public/generated-backup/zelie-affinity-5.png` | `` | removed redundant public mirror | skip-dedup-remove-public |

### Stats

```json
{
  "moved": 0,
  "skip-dedup-assets": 75,
  "skip-dedup-remove-public": 75,
  "skip-dest-exists": 0,
  "conflicts": 0,
  "skip-readme": 9,
  "skip-extension": 2,
  "errors": 0
}
```


### Reste légitime dans `public/`

| Chemin | Pourquoi |
|--------|----------|
| `public/village/` (3 fichiers actifs) | Runtime village |
| `public/live2d/` | Demo Live2D Haru |
| `public/assets/**` README | Redirects post-migration |
| `public/gacha/README.md` | Redirect → `assets/Gacha/` |
| `favicon.svg`, `icons.svg`, `manifest.webmanifest` | Shell PWA |


---

## Session 2026-06-25 — migrate-public-to-old-assets

| From | To | Reason | Status |
|------|-----|--------|--------|


### Stats

```json
{
  "moved": 0,
  "skip-dedup-assets": 0,
  "skip-dedup-old-assets": 0,
  "skip-dedup-remove-public": 0,
  "skip-dest-exists": 0,
  "conflicts": 0,
  "skip-readme": 0,
  "skip-extension": 0,
  "skip-keep": 0,
  "skip-junction": 0,
  "sort-moved": 0,
  "sort-dedup": 0,
  "sort-conflicts": 0,
  "errors": 0
}
```


### Reste légitime dans `public/`

| Chemin | Pourquoi |
|--------|----------|
| `public/village/` (3 fichiers actifs) | Runtime village |
| `public/live2d/` | Demo Live2D Haru |
| `public/assets/**` README | Redirects post-migration |
| `public/gacha/README.md` | Redirect → `assets/Gacha/` |
| `favicon.svg`, `icons.svg`, `manifest.webmanifest` | Shell PWA |


---

## Session 2026-06-25 — scan-old-assets-duplicates

| From | To | Reason | Kind |
|------|-----|--------|------|
| `old_assets/Background/disagrea-event/minigame/myrion_hunt_mobile.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Background/disagrea-event/minigame/myrion_hunt_mobile.png` | byte-identical to assets/Background/disagrea-event/capture-portrait.png | vs-assets |
| `old_assets/Background/disagrea-event/minigame/myrion_hunt_pc.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Background/disagrea-event/minigame/myrion_hunt_pc.png` | byte-identical to assets/Background/disagrea-event/capture-wide.png | vs-assets |
| `old_assets/Background/disagrea-event/minigame/myrion_training_enclosure_mobile.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Background/disagrea-event/minigame/myrion_training_enclosure_mobile.png` | byte-identical to assets/Background/disagrea-event/dressage-portrait.png | vs-assets |
| `old_assets/Background/disagrea-event/minigame/myrion_training_enclosure_pc.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Background/disagrea-event/minigame/myrion_training_enclosure_pc.png` | byte-identical to assets/Background/disagrea-event/dressage-wide.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-01-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-01-scene-originale-v1.png` | byte-identical to assets/Compagnons/etna/affinite/affinity-1.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-02-flirt-proche-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-02-flirt-proche-scene-originale-v1.png` | byte-identical to assets/Compagnons/etna/affinite/affinity-2.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-03-vulnerable-complicite-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-03-vulnerable-complicite-scene-originale-v1.png` | byte-identical to assets/Compagnons/etna/affinite/affinity-3.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-04-intime-soft-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-04-intime-soft-scene-originale-v1.png` | byte-identical to assets/Compagnons/etna/affinite/affinity-4.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-04-nsfw-scene-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-04-nsfw-scene-v1.png` | byte-identical to assets/Compagnons/etna/NSFW/affinity-4-nsfw.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-05-peak-bond-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/etna/Autres/disagrea-integrated/companion-etna-affinity-05-peak-bond-scene-originale-v1.png` | byte-identical to assets/Compagnons/etna/affinite/affinity-5.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-01-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-01-scene-originale-v1.png` | byte-identical to assets/Compagnons/flonne/affinite/affinity-1.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-02-flirt-proche-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-02-flirt-proche-scene-originale-v1.png` | byte-identical to assets/Compagnons/flonne/affinite/affinity-2.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-03-vulnerable-complicite-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-03-vulnerable-complicite-scene-originale-v1.png` | byte-identical to assets/Compagnons/flonne/affinite/affinity-3.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-04-intime-soft-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-04-intime-soft-scene-originale-v1.png` | byte-identical to assets/Compagnons/flonne/affinite/affinity-4.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-04-nsfw-scene-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-04-nsfw-scene-v1.png` | byte-identical to assets/Compagnons/flonne/NSFW/affinity-4-nsfw.png | vs-assets |
| `old_assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-05-peak-bond-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/flonne/Autres/disagrea-integrated/companion-flonne-affinity-05-peak-bond-scene-originale-v1.png` | byte-identical to assets/Compagnons/flonne/affinite/affinity-5.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-01-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-01-scene-originale-v1.png` | byte-identical to assets/Compagnons/laharl/affinite/affinity-1.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-02-flirt-proche-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-02-flirt-proche-scene-originale-v1.png` | byte-identical to assets/Compagnons/laharl/affinite/affinity-2.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-03-vulnerable-complicite-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-03-vulnerable-complicite-scene-originale-v1.png` | byte-identical to assets/Compagnons/laharl/affinite/affinity-3.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-04-intime-soft-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-04-intime-soft-scene-originale-v1.png` | byte-identical to assets/Compagnons/laharl/affinite/affinity-4.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-04-nsfw-scene-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-04-nsfw-scene-v1.png` | byte-identical to assets/Compagnons/laharl/NSFW/affinity-4-nsfw.png | vs-assets |
| `old_assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-05-peak-bond-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/laharl/Autres/disagrea-integrated/companion-laharl-affinity-05-peak-bond-scene-originale-v1.png` | byte-identical to assets/Compagnons/laharl/affinite/affinity-5.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-01-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-01-scene-originale-v1.png` | byte-identical to assets/Compagnons/pleinair/affinite/affinity-1.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-02-flirt-proche-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-02-flirt-proche-scene-originale-v1.png` | byte-identical to assets/Compagnons/pleinair/affinite/affinity-2.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-03-vulnerable-complicite-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-03-vulnerable-complicite-scene-originale-v1.png` | byte-identical to assets/Compagnons/pleinair/affinite/affinity-3.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-04-intime-soft-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-04-intime-soft-scene-originale-v1.png` | byte-identical to assets/Compagnons/pleinair/affinite/affinity-4.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-04-nsfw-scene-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-04-nsfw-scene-v1.png` | byte-identical to assets/Compagnons/pleinair/NSFW/affinity-4-nsfw.png | vs-assets |
| `old_assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-05-peak-bond-scene-originale-v1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/pleinair/Autres/disagrea-integrated/companion-pleinair-affinity-05-peak-bond-scene-originale-v1.png` | byte-identical to assets/Compagnons/pleinair/affinite/affinity-5.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-annoyed-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-annoyed-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-annoyed.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-happy-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-happy-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-happy.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-neutral-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-neutral-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-neutral.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-romantic-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-romantic-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-romantic.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-sad-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-sad-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-sad.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-shy-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-shy-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-shy.png | vs-assets |
| `old_assets/Compagnons/solene/cutouts/emotion-surprised-v2-archived.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/Compagnons/solene/cutouts/emotion-surprised-v2-archived.png` | byte-identical to assets/Compagnons/solene/cutouts/emotion-surprised.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-1-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-1-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-2-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-2-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-3-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-3-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-1.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-2.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-2.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-3.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-3.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-4-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-4-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-5-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-5-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-4.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-4.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/etna/background-5.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/etna/background-5.png` | byte-identical to assets/Background/disagrea-event/affinity/Etna/Etna_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-1-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-1-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-2-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-2-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-3-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-3-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-1.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-2.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-2.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-3.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-3.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-4-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-4-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-5-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-5-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-4.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-4.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/flonne/background-5.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/flonne/background-5.png` | byte-identical to assets/Background/disagrea-event/affinity/Flonne/Flonne_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-1-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-1-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-2-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-2-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-3-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-3-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-1.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-2.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-2.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-3.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-3.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-4-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-4-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-5-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-5-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-4.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-4.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/laharl/background-5.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/laharl/background-5.png` | byte-identical to assets/Background/disagrea-event/affinity/Laharl/Laharl_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-1-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-1-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-2-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-2-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-3-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-3-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-1.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-1.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-2.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-2.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-3.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-3.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_01_03_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-4-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-4-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-5-wide.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-5-wide.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_04_05_pc.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-4.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-4.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_04_05_mobile.png | vs-assets |
| `old_assets/event-disagrea/public-layered-legacy/pleinair/background-5.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/event-disagrea/public-layered-legacy/pleinair/background-5.png` | byte-identical to assets/Background/disagrea-event/affinity/Pleinair/Pleinair_affinity_04_05_mobile.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/intermediate.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/intermediate.png` | byte-identical to assets/gacha/cinema/disagrea/intermediate.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-lr.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-lr.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-lr.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-multi.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-multi.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-multi.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-n.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-n.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-n.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-sr.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-sr.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-sr.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-ssr.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-ssr.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-ssr.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/reveal-ur.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/reveal-ur.png` | byte-identical to assets/gacha/cinema/disagrea/reveal-ur.png | vs-assets |
| `old_assets/gacha-event-disagrea-source-2026-06-25/start.png` | `old_assets/archive/2026-06-25-dedup-vs-assets/gacha-event-disagrea-source-2026-06-25/start.png` | byte-identical to assets/gacha/cinema/disagrea/start.png | vs-assets |
| `old_assets/Compagnons/etna/Autres/guide/point-disagrea-event.png` | `old_assets/archive/2026-06-25-dedup-internal/Compagnons/etna/Autres/guide/point-disagrea-event.png` | internal duplicate of old_assets/Compagnons/etna/Autres/guide/point.png | internal |
| `old_assets/event-disagrea/public-layered-legacy/etna/cutout-5.png` | `old_assets/archive/2026-06-25-dedup-internal/event-disagrea/public-layered-legacy/etna/cutout-5.png` | internal duplicate of old_assets/Compagnons/etna/Autres/guide/point.png | internal |
| `old_assets/event-disagrea/nsfw-replaced/companion-etna-affinity-04-nsfw-scene-v1-peak-plus-backup.png` | `old_assets/archive/2026-06-25-dedup-internal/event-disagrea/nsfw-replaced/companion-etna-affinity-04-nsfw-scene-v1-peak-plus-backup.png` | internal duplicate of old_assets/event-disagrea/nsfw-replaced/etna-affinity-4-nsfw-peak-plus-backup.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/aventureuse_magique_et_accueillante.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/aventureuse_magique_et_accueillante.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/aventureuse_magique_et_accueillante.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_magique_et_son_compagnon_glacial.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_magique_et_son_compagnon_glacial.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/aventuriÃ¨re_magique_et_son_compagnon_glacial.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/a_clean_isolated_character_illustration_on_a_tran_1.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/a_clean_isolated_character_illustration_on_a_tran_1.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/a_clean_isolated_character_illustration_on_a_tran_1.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/exploratrice_de_la_forÃªt_et_son_renard.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/exploratrice_de_la_forÃªt_et_son_renard.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/exploratrice_de_la_forÃªt_et_son_renard.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/exploratrice_tropicale_et_sa_tortue.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/exploratrice_tropicale_et_sa_tortue.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/exploratrice_tropicale_et_sa_tortue.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/herboriste_accueillante_et_son_lapin.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/herboriste_accueillante_et_son_lapin.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/herboriste_accueillante_et_son_lapin.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/mage_et_hibou_magique_Ã©toilÃ©.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/mage_et_hibou_magique_Ã©toilÃ©.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/mage_et_hibou_magique_Ã©toilÃ©.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/magicienne_de_feu_et_son_compagnon.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/magicienne_de_feu_et_son_compagnon.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/magicienne_de_feu_et_son_compagnon.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/chibis-9-pack/prompt_detourage_cursor_python.txt` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/chibis-9-pack/prompt_detourage_cursor_python.txt` | internal duplicate of old_assets/prompts-archive/imports/talia-import/chibis_9_pack_cutout/prompt_detourage_cursor_python.txt | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/01_Moussprout.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/01_Moussprout.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/01_Moussprout.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/02_Pepitouffe.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/02_Pepitouffe.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/02_Pepitouffe.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/03_Florelievre.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/03_Florelievre.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/03_Florelievre.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/04_Bourdilune.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/04_Bourdilune.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/04_Bourdilune.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/05_Grainocorne.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/05_Grainocorne.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/05_Grainocorne.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/06_Solhermine.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/06_Solhermine.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/06_Solhermine.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/07_Mielpique.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/07_Mielpique.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/07_Mielpique.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/08_Treflaon.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/08_Treflaon.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/08_Treflaon.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/09_Floracroc.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/09_Floracroc.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/09_Floracroc.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/10_Rosalynx.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/10_Rosalynx.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/10_Rosalynx.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/11_Aubepineon.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/11_Aubepineon.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/11_Aubepineon.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/12_Cerfaurore.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/12_Cerfaurore.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/12_Cerfaurore.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/13_Solarcheval.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/13_Solarcheval.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/13_Solarcheval.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/14_Paladigrain.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/14_Paladigrain.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/14_Paladigrain.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/01_Mouscarotte.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/01_Mouscarotte.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/01_Mouscarotte.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/02_Noisecureuil.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/02_Noisecureuil.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/02_Noisecureuil.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/03_Champi_Chaton.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/03_Champi_Chaton.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/03_Champi_Chaton.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/04_Brindhibou.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/04_Brindhibou.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/04_Brindhibou.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/05_Limafleur.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/05_Limafleur.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/05_Limafleur.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/06_Sylvarat.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/06_Sylvarat.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/06_Sylvarat.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/07_Fongours.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/07_Fongours.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/07_Fongours.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/08_Luciferne.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/08_Luciferne.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/08_Luciferne.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/09_Lianaconda.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/09_Lianaconda.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/09_Lianaconda.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/01_Glucrapaud.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/01_Glucrapaud.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/01_Glucrapaud.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/02_Nenuphant.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/02_Nenuphant.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/02_Nenuphant.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/03_Bourbecaille.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/03_Bourbecaille.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/03_Bourbecaille.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/04_Moustikroa.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/04_Moustikroa.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/04_Moustikroa.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/05_Vasardille.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/05_Vasardille.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/05_Vasardille.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/06_Croacendre.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/06_Croacendre.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/06_Croacendre.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/07_Vipervase.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/07_Vipervase.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/07_Vipervase.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/08_Nebularve.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/08_Nebularve.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/08_Nebularve.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/09_Tourbapince.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/09_Tourbapince.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/09_Tourbapince.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/01_Cailloubic.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/01_Cailloubic.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/01_Cailloubic.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/02_Givrimoineau.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/02_Givrimoineau.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/02_Givrimoineau.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/03_Cristaloupin.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/03_Cristaloupin.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/03_Cristaloupin.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/04_Pikroc.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/04_Pikroc.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/04_Pikroc.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/05_Gemlimace.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/05_Gemlimace.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/05_Gemlimace.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/06_Avalanchevre.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/06_Avalanchevre.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/06_Avalanchevre.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/07_Glacimarmotte.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/07_Glacimarmotte.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/07_Glacimarmotte.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/08_Quartzard.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/08_Quartzard.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/08_Quartzard.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/09_Rocorbeau.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/09_Rocorbeau.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/09_Rocorbeau.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/01_Sablitou.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/01_Sablitou.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/01_Sablitou.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/02_Cactouris.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/02_Cactouris.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/02_Cactouris.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/03_Scorpiquet.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/03_Scorpiquet.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/03_Scorpiquet.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/04_Mirajackal.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/04_Mirajackal.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/04_Mirajackal.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/05_Dunecaille.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/05_Dunecaille.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/05_Dunecaille.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/06_Dromaglyphe.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/06_Dromaglyphe.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/06_Dromaglyphe.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/07_Vautourune.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/07_Vautourune.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/07_Vautourune.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/08_Cobrambre.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/08_Cobrambre.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/08_Cobrambre.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/09_Fenneflamme.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/09_Fenneflamme.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/09_Fenneflamme.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/01_Coquichat.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/01_Coquichat.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/01_Coquichat.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/02_Pincelot.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/02_Pincelot.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/02_Pincelot.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/03_Bullorbe.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/03_Bullorbe.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/03_Bullorbe.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/04_Algouette.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/04_Algouette.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/04_Algouette.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/05_Sablapin.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/05_Sablapin.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/05_Sablapin.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/06_Corailynx.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/06_Corailynx.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/06_Corailynx.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/07_Meduflore.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/07_Meduflore.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/07_Meduflore.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/08_Tortecume.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/08_Tortecume.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/08_Tortecume.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/09_Hippocampearl.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/09_Hippocampearl.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/09_Hippocampearl.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/01_Charbouvier.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/01_Charbouvier.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/01_Charbouvier.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/02_Flamurmulot.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/02_Flamurmulot.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/02_Flamurmulot.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/03_Cendroquet.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/03_Cendroquet.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/03_Cendroquet.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/04_Lavacroa.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/04_Lavacroa.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/04_Lavacroa.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/05_Obsidigriffe.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/05_Obsidigriffe.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/05_Obsidigriffe.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/06_Magmardillo.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/06_Magmardillo.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/06_Magmardillo.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/07_Cendreloup.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/07_Cendreloup.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/07_Cendreloup.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/08_Fumhibou.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/08_Fumhibou.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/08_Fumhibou.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/09_Pyrocorne.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/09_Pyrocorne.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/09_Pyrocorne.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/01_Stellapin.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/01_Stellapin.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/01_Stellapin.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/02_Astromouche.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/02_Astromouche.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/02_Astromouche.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/03_Lunacorne.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/03_Lunacorne.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/03_Lunacorne.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/04_Comechat.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/04_Comechat.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/04_Comechat.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/05_Glyphibou.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/05_Glyphibou.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/05_Glyphibou.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/06_Nebuloup.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/06_Nebuloup.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/06_Nebuloup.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/07_Selenard.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/07_Selenard.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/07_Selenard.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/08_Runescarab.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/08_Runescarab.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/08_Runescarab.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/09_Orbicrabe.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/09_Orbicrabe.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/09_Orbicrabe.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/MANIFEST.txt` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/MANIFEST.txt` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/MANIFEST.txt | internal |
| `old_assets/prompts-archive/minigames/chibi-sources/Prompt_Cursor_Detourage_Chibis.txt` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/chibi-sources/Prompt_Cursor_Detourage_Chibis.txt` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrions_chibis_individuels/Prompt_Cursor_Detourage_Chibis.txt | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/01_marais.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/01_marais.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/01_marais.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/02_prairie.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/02_prairie.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/02_prairie.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/03_foret_enchantee.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/03_foret_enchantee.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/03_foret_enchantee.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/04_montagne_cristal_glace.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/04_montagne_cristal_glace.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/04_montagne_cristal_glace.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/05_desert_ruines.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/05_desert_ruines.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/05_desert_ruines.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/06_plage_tropicale.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/06_plage_tropicale.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/06_plage_tropicale.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/07_volcan_lave.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/07_volcan_lave.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/07_volcan_lave.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/08_astral_celeste.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/08_astral_celeste.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/08_astral_celeste.png | internal |
| `old_assets/prompts-archive/minigames/talia-sources/companion-pack/09_chibi.png` | `old_assets/archive/2026-06-25-dedup-internal/prompts-archive/minigames/talia-sources/companion-pack/09_chibi.png` | internal duplicate of old_assets/prompts-archive/imports/talia-import/myrion_companion_pack/09_chibi.png | internal |
### Stats

```json
{
  "scannedAssets": 712,
  "scannedOldAssets": 626,
  "movedVsAssets": 83,
  "movedInternal": 109,
  "conflicts": 152,
  "skipped": 0,
  "errors": 0
}
```


### Conflicts → To check manually/old-assets-dedup-conflicts/

- `old_assets/Compagnons/asha/cutouts/emotion-annoyed.png` vs `assets/Compagnons/asha/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/asha/cutouts/emotion-happy.png` vs `assets/Compagnons/asha/cutouts/emotion-happy.png`
- `old_assets/Compagnons/asha/cutouts/emotion-neutral.png` vs `assets/Compagnons/asha/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/asha/cutouts/emotion-playful.png` vs `assets/Compagnons/asha/cutouts/emotion-playful.png`
- `old_assets/Compagnons/asha/cutouts/emotion-romantic.png` vs `assets/Compagnons/asha/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/asha/cutouts/emotion-sad.png` vs `assets/Compagnons/asha/cutouts/emotion-sad.png`
- `old_assets/Compagnons/asha/cutouts/emotion-shy.png` vs `assets/Compagnons/asha/cutouts/emotion-shy.png`
- `old_assets/Compagnons/asha/cutouts/emotion-surprised.png` vs `assets/Compagnons/asha/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-annoyed.png` vs `assets/Compagnons/elwen/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-happy.png` vs `assets/Compagnons/elwen/cutouts/emotion-happy.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-neutral.png` vs `assets/Compagnons/elwen/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-playful.png` vs `assets/Compagnons/elwen/cutouts/emotion-playful.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-romantic.png` vs `assets/Compagnons/elwen/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-sad.png` vs `assets/Compagnons/elwen/cutouts/emotion-sad.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-shy.png` vs `assets/Compagnons/elwen/cutouts/emotion-shy.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-surprised.png` vs `assets/Compagnons/elwen/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/etna/cutouts/emotion-annoyed.png` vs `assets/Compagnons/etna/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/etna/cutouts/emotion-happy.png` vs `assets/Compagnons/etna/cutouts/emotion-happy.png`
- `old_assets/Compagnons/etna/cutouts/emotion-neutral.png` vs `assets/Compagnons/etna/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/etna/cutouts/emotion-playful.png` vs `assets/Compagnons/etna/cutouts/emotion-playful.png`
- `old_assets/Compagnons/etna/cutouts/emotion-romantic.png` vs `assets/Compagnons/etna/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/etna/cutouts/emotion-sad.png` vs `assets/Compagnons/etna/cutouts/emotion-sad.png`
- `old_assets/Compagnons/etna/cutouts/emotion-shy.png` vs `assets/Compagnons/etna/cutouts/emotion-shy.png`
- `old_assets/Compagnons/etna/cutouts/emotion-surprised.png` vs `assets/Compagnons/etna/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-annoyed.png` vs `assets/Compagnons/flonne/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-happy.png` vs `assets/Compagnons/flonne/cutouts/emotion-happy.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-neutral.png` vs `assets/Compagnons/flonne/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-playful.png` vs `assets/Compagnons/flonne/cutouts/emotion-playful.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-romantic.png` vs `assets/Compagnons/flonne/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-sad.png` vs `assets/Compagnons/flonne/cutouts/emotion-sad.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-shy.png` vs `assets/Compagnons/flonne/cutouts/emotion-shy.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-surprised.png` vs `assets/Compagnons/flonne/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/iris/cutouts/emotion-annoyed.png` vs `assets/Compagnons/iris/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/iris/cutouts/emotion-happy.png` vs `assets/Compagnons/iris/cutouts/emotion-happy.png`
- `old_assets/Compagnons/iris/cutouts/emotion-neutral.png` vs `assets/Compagnons/iris/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/iris/cutouts/emotion-playful.png` vs `assets/Compagnons/iris/cutouts/emotion-playful.png`
- `old_assets/Compagnons/iris/cutouts/emotion-romantic.png` vs `assets/Compagnons/iris/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/iris/cutouts/emotion-sad.png` vs `assets/Compagnons/iris/cutouts/emotion-sad.png`
- `old_assets/Compagnons/iris/cutouts/emotion-shy.png` vs `assets/Compagnons/iris/cutouts/emotion-shy.png`
- `old_assets/Compagnons/iris/cutouts/emotion-surprised.png` vs `assets/Compagnons/iris/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/kael/cutouts/emotion-annoyed.png` vs `assets/Compagnons/kael/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/kael/cutouts/emotion-happy.png` vs `assets/Compagnons/kael/cutouts/emotion-happy.png`
- `old_assets/Compagnons/kael/cutouts/emotion-neutral.png` vs `assets/Compagnons/kael/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/kael/cutouts/emotion-playful.png` vs `assets/Compagnons/kael/cutouts/emotion-playful.png`
- `old_assets/Compagnons/kael/cutouts/emotion-romantic.png` vs `assets/Compagnons/kael/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/kael/cutouts/emotion-sad.png` vs `assets/Compagnons/kael/cutouts/emotion-sad.png`
- `old_assets/Compagnons/kael/cutouts/emotion-shy.png` vs `assets/Compagnons/kael/cutouts/emotion-shy.png`
- `old_assets/Compagnons/kael/cutouts/emotion-surprised.png` vs `assets/Compagnons/kael/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-annoyed.png` vs `assets/Compagnons/laharl/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-happy.png` vs `assets/Compagnons/laharl/cutouts/emotion-happy.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-neutral.png` vs `assets/Compagnons/laharl/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-playful.png` vs `assets/Compagnons/laharl/cutouts/emotion-playful.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-romantic.png` vs `assets/Compagnons/laharl/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-sad.png` vs `assets/Compagnons/laharl/cutouts/emotion-sad.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-shy.png` vs `assets/Compagnons/laharl/cutouts/emotion-shy.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-surprised.png` vs `assets/Compagnons/laharl/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-annoyed.png` vs `assets/Compagnons/lyra/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-happy.png` vs `assets/Compagnons/lyra/cutouts/emotion-happy.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-neutral.png` vs `assets/Compagnons/lyra/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-playful.png` vs `assets/Compagnons/lyra/cutouts/emotion-playful.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-romantic.png` vs `assets/Compagnons/lyra/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-sad.png` vs `assets/Compagnons/lyra/cutouts/emotion-sad.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-shy.png` vs `assets/Compagnons/lyra/cutouts/emotion-shy.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-surprised.png` vs `assets/Compagnons/lyra/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-annoyed.png` vs `assets/Compagnons/maeve/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-happy.png` vs `assets/Compagnons/maeve/cutouts/emotion-happy.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-neutral.png` vs `assets/Compagnons/maeve/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-playful.png` vs `assets/Compagnons/maeve/cutouts/emotion-playful.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-romantic.png` vs `assets/Compagnons/maeve/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-sad.png` vs `assets/Compagnons/maeve/cutouts/emotion-sad.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-shy.png` vs `assets/Compagnons/maeve/cutouts/emotion-shy.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-surprised.png` vs `assets/Compagnons/maeve/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/mira/cutouts/emotion-annoyed.png` vs `assets/Compagnons/mira/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/mira/cutouts/emotion-happy.png` vs `assets/Compagnons/mira/cutouts/emotion-happy.png`
- `old_assets/Compagnons/mira/cutouts/emotion-neutral.png` vs `assets/Compagnons/mira/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/mira/cutouts/emotion-playful.png` vs `assets/Compagnons/mira/cutouts/emotion-playful.png`
- `old_assets/Compagnons/mira/cutouts/emotion-romantic.png` vs `assets/Compagnons/mira/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/mira/cutouts/emotion-sad.png` vs `assets/Compagnons/mira/cutouts/emotion-sad.png`
- `old_assets/Compagnons/mira/cutouts/emotion-shy.png` vs `assets/Compagnons/mira/cutouts/emotion-shy.png`
- `old_assets/Compagnons/mira/cutouts/emotion-surprised.png` vs `assets/Compagnons/mira/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/nami/cutouts/emotion-annoyed.png` vs `assets/Compagnons/nami/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/nami/cutouts/emotion-happy.png` vs `assets/Compagnons/nami/cutouts/emotion-happy.png`
- `old_assets/Compagnons/nami/cutouts/emotion-neutral.png` vs `assets/Compagnons/nami/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/nami/cutouts/emotion-playful.png` vs `assets/Compagnons/nami/cutouts/emotion-playful.png`
- `old_assets/Compagnons/nami/cutouts/emotion-romantic.png` vs `assets/Compagnons/nami/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/nami/cutouts/emotion-sad.png` vs `assets/Compagnons/nami/cutouts/emotion-sad.png`
- `old_assets/Compagnons/nami/cutouts/emotion-shy.png` vs `assets/Compagnons/nami/cutouts/emotion-shy.png`
- `old_assets/Compagnons/nami/cutouts/emotion-surprised.png` vs `assets/Compagnons/nami/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/noa/cutouts/emotion-annoyed.png` vs `assets/Compagnons/noa/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/noa/cutouts/emotion-happy.png` vs `assets/Compagnons/noa/cutouts/emotion-happy.png`
- `old_assets/Compagnons/noa/cutouts/emotion-neutral.png` vs `assets/Compagnons/noa/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/noa/cutouts/emotion-playful.png` vs `assets/Compagnons/noa/cutouts/emotion-playful.png`
- `old_assets/Compagnons/noa/cutouts/emotion-romantic.png` vs `assets/Compagnons/noa/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/noa/cutouts/emotion-sad.png` vs `assets/Compagnons/noa/cutouts/emotion-sad.png`
- `old_assets/Compagnons/noa/cutouts/emotion-shy.png` vs `assets/Compagnons/noa/cutouts/emotion-shy.png`
- `old_assets/Compagnons/noa/cutouts/emotion-surprised.png` vs `assets/Compagnons/noa/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-annoyed.png` vs `assets/Compagnons/pleinair/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-happy.png` vs `assets/Compagnons/pleinair/cutouts/emotion-happy.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-neutral.png` vs `assets/Compagnons/pleinair/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-playful.png` vs `assets/Compagnons/pleinair/cutouts/emotion-playful.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-romantic.png` vs `assets/Compagnons/pleinair/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-sad.png` vs `assets/Compagnons/pleinair/cutouts/emotion-sad.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-shy.png` vs `assets/Compagnons/pleinair/cutouts/emotion-shy.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-surprised.png` vs `assets/Compagnons/pleinair/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/runa/cutouts/emotion-annoyed.png` vs `assets/Compagnons/runa/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/runa/cutouts/emotion-happy.png` vs `assets/Compagnons/runa/cutouts/emotion-happy.png`
- `old_assets/Compagnons/runa/cutouts/emotion-neutral.png` vs `assets/Compagnons/runa/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/runa/cutouts/emotion-playful.png` vs `assets/Compagnons/runa/cutouts/emotion-playful.png`
- `old_assets/Compagnons/runa/cutouts/emotion-romantic.png` vs `assets/Compagnons/runa/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/runa/cutouts/emotion-sad.png` vs `assets/Compagnons/runa/cutouts/emotion-sad.png`
- `old_assets/Compagnons/runa/cutouts/emotion-shy.png` vs `assets/Compagnons/runa/cutouts/emotion-shy.png`
- `old_assets/Compagnons/runa/cutouts/emotion-surprised.png` vs `assets/Compagnons/runa/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/seren/cutouts/emotion-annoyed.png` vs `assets/Compagnons/seren/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/seren/cutouts/emotion-happy.png` vs `assets/Compagnons/seren/cutouts/emotion-happy.png`
- `old_assets/Compagnons/seren/cutouts/emotion-neutral.png` vs `assets/Compagnons/seren/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/seren/cutouts/emotion-playful.png` vs `assets/Compagnons/seren/cutouts/emotion-playful.png`
- `old_assets/Compagnons/seren/cutouts/emotion-romantic.png` vs `assets/Compagnons/seren/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/seren/cutouts/emotion-sad.png` vs `assets/Compagnons/seren/cutouts/emotion-sad.png`
- `old_assets/Compagnons/seren/cutouts/emotion-shy.png` vs `assets/Compagnons/seren/cutouts/emotion-shy.png`
- `old_assets/Compagnons/seren/cutouts/emotion-surprised.png` vs `assets/Compagnons/seren/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/solene/cutouts/emotion-annoyed.png` vs `assets/Compagnons/solene/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/solene/cutouts/emotion-happy.png` vs `assets/Compagnons/solene/cutouts/emotion-happy.png`
- `old_assets/Compagnons/solene/cutouts/emotion-neutral.png` vs `assets/Compagnons/solene/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/solene/cutouts/emotion-playful.png` vs `assets/Compagnons/solene/cutouts/emotion-playful.png`
- `old_assets/Compagnons/solene/cutouts/emotion-romantic.png` vs `assets/Compagnons/solene/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/solene/cutouts/emotion-sad.png` vs `assets/Compagnons/solene/cutouts/emotion-sad.png`
- `old_assets/Compagnons/solene/cutouts/emotion-shy.png` vs `assets/Compagnons/solene/cutouts/emotion-shy.png`
- `old_assets/Compagnons/solene/cutouts/emotion-surprised.png` vs `assets/Compagnons/solene/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/sora/cutouts/emotion-annoyed.png` vs `assets/Compagnons/sora/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/sora/cutouts/emotion-happy.png` vs `assets/Compagnons/sora/cutouts/emotion-happy.png`
- `old_assets/Compagnons/sora/cutouts/emotion-neutral.png` vs `assets/Compagnons/sora/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/sora/cutouts/emotion-playful.png` vs `assets/Compagnons/sora/cutouts/emotion-playful.png`
- `old_assets/Compagnons/sora/cutouts/emotion-romantic.png` vs `assets/Compagnons/sora/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/sora/cutouts/emotion-sad.png` vs `assets/Compagnons/sora/cutouts/emotion-sad.png`
- `old_assets/Compagnons/sora/cutouts/emotion-shy.png` vs `assets/Compagnons/sora/cutouts/emotion-shy.png`
- `old_assets/Compagnons/sora/cutouts/emotion-surprised.png` vs `assets/Compagnons/sora/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/talia/cutouts/emotion-annoyed.png` vs `assets/Compagnons/talia/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/talia/cutouts/emotion-happy.png` vs `assets/Compagnons/talia/cutouts/emotion-happy.png`
- `old_assets/Compagnons/talia/cutouts/emotion-neutral.png` vs `assets/Compagnons/talia/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/talia/cutouts/emotion-playful.png` vs `assets/Compagnons/talia/cutouts/emotion-playful.png`
- `old_assets/Compagnons/talia/cutouts/emotion-romantic.png` vs `assets/Compagnons/talia/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/talia/cutouts/emotion-sad.png` vs `assets/Compagnons/talia/cutouts/emotion-sad.png`
- `old_assets/Compagnons/talia/cutouts/emotion-shy.png` vs `assets/Compagnons/talia/cutouts/emotion-shy.png`
- `old_assets/Compagnons/talia/cutouts/emotion-surprised.png` vs `assets/Compagnons/talia/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-annoyed.png` vs `assets/Compagnons/zelie/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-happy.png` vs `assets/Compagnons/zelie/cutouts/emotion-happy.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-neutral.png` vs `assets/Compagnons/zelie/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-playful.png` vs `assets/Compagnons/zelie/cutouts/emotion-playful.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-romantic.png` vs `assets/Compagnons/zelie/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-sad.png` vs `assets/Compagnons/zelie/cutouts/emotion-sad.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-shy.png` vs `assets/Compagnons/zelie/cutouts/emotion-shy.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-surprised.png` vs `assets/Compagnons/zelie/cutouts/emotion-surprised.png`


---

## Session 2026-06-25 — scan-old-assets-duplicates

| From | To | Reason | Kind |
|------|-----|--------|------|
| _none_ | | | |
### Stats

```json
{
  "scannedAssets": 712,
  "scannedOldAssets": 517,
  "movedVsAssets": 0,
  "movedInternal": 0,
  "conflicts": 152,
  "skipped": 0,
  "errors": 0
}
```


### Conflicts → To check manually/old-assets-dedup-conflicts/

- `old_assets/Compagnons/asha/cutouts/emotion-annoyed.png` vs `assets/Compagnons/asha/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/asha/cutouts/emotion-happy.png` vs `assets/Compagnons/asha/cutouts/emotion-happy.png`
- `old_assets/Compagnons/asha/cutouts/emotion-neutral.png` vs `assets/Compagnons/asha/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/asha/cutouts/emotion-playful.png` vs `assets/Compagnons/asha/cutouts/emotion-playful.png`
- `old_assets/Compagnons/asha/cutouts/emotion-romantic.png` vs `assets/Compagnons/asha/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/asha/cutouts/emotion-sad.png` vs `assets/Compagnons/asha/cutouts/emotion-sad.png`
- `old_assets/Compagnons/asha/cutouts/emotion-shy.png` vs `assets/Compagnons/asha/cutouts/emotion-shy.png`
- `old_assets/Compagnons/asha/cutouts/emotion-surprised.png` vs `assets/Compagnons/asha/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-annoyed.png` vs `assets/Compagnons/elwen/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-happy.png` vs `assets/Compagnons/elwen/cutouts/emotion-happy.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-neutral.png` vs `assets/Compagnons/elwen/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-playful.png` vs `assets/Compagnons/elwen/cutouts/emotion-playful.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-romantic.png` vs `assets/Compagnons/elwen/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-sad.png` vs `assets/Compagnons/elwen/cutouts/emotion-sad.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-shy.png` vs `assets/Compagnons/elwen/cutouts/emotion-shy.png`
- `old_assets/Compagnons/elwen/cutouts/emotion-surprised.png` vs `assets/Compagnons/elwen/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/etna/cutouts/emotion-annoyed.png` vs `assets/Compagnons/etna/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/etna/cutouts/emotion-happy.png` vs `assets/Compagnons/etna/cutouts/emotion-happy.png`
- `old_assets/Compagnons/etna/cutouts/emotion-neutral.png` vs `assets/Compagnons/etna/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/etna/cutouts/emotion-playful.png` vs `assets/Compagnons/etna/cutouts/emotion-playful.png`
- `old_assets/Compagnons/etna/cutouts/emotion-romantic.png` vs `assets/Compagnons/etna/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/etna/cutouts/emotion-sad.png` vs `assets/Compagnons/etna/cutouts/emotion-sad.png`
- `old_assets/Compagnons/etna/cutouts/emotion-shy.png` vs `assets/Compagnons/etna/cutouts/emotion-shy.png`
- `old_assets/Compagnons/etna/cutouts/emotion-surprised.png` vs `assets/Compagnons/etna/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-annoyed.png` vs `assets/Compagnons/flonne/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-happy.png` vs `assets/Compagnons/flonne/cutouts/emotion-happy.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-neutral.png` vs `assets/Compagnons/flonne/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-playful.png` vs `assets/Compagnons/flonne/cutouts/emotion-playful.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-romantic.png` vs `assets/Compagnons/flonne/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-sad.png` vs `assets/Compagnons/flonne/cutouts/emotion-sad.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-shy.png` vs `assets/Compagnons/flonne/cutouts/emotion-shy.png`
- `old_assets/Compagnons/flonne/cutouts/emotion-surprised.png` vs `assets/Compagnons/flonne/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/iris/cutouts/emotion-annoyed.png` vs `assets/Compagnons/iris/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/iris/cutouts/emotion-happy.png` vs `assets/Compagnons/iris/cutouts/emotion-happy.png`
- `old_assets/Compagnons/iris/cutouts/emotion-neutral.png` vs `assets/Compagnons/iris/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/iris/cutouts/emotion-playful.png` vs `assets/Compagnons/iris/cutouts/emotion-playful.png`
- `old_assets/Compagnons/iris/cutouts/emotion-romantic.png` vs `assets/Compagnons/iris/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/iris/cutouts/emotion-sad.png` vs `assets/Compagnons/iris/cutouts/emotion-sad.png`
- `old_assets/Compagnons/iris/cutouts/emotion-shy.png` vs `assets/Compagnons/iris/cutouts/emotion-shy.png`
- `old_assets/Compagnons/iris/cutouts/emotion-surprised.png` vs `assets/Compagnons/iris/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/kael/cutouts/emotion-annoyed.png` vs `assets/Compagnons/kael/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/kael/cutouts/emotion-happy.png` vs `assets/Compagnons/kael/cutouts/emotion-happy.png`
- `old_assets/Compagnons/kael/cutouts/emotion-neutral.png` vs `assets/Compagnons/kael/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/kael/cutouts/emotion-playful.png` vs `assets/Compagnons/kael/cutouts/emotion-playful.png`
- `old_assets/Compagnons/kael/cutouts/emotion-romantic.png` vs `assets/Compagnons/kael/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/kael/cutouts/emotion-sad.png` vs `assets/Compagnons/kael/cutouts/emotion-sad.png`
- `old_assets/Compagnons/kael/cutouts/emotion-shy.png` vs `assets/Compagnons/kael/cutouts/emotion-shy.png`
- `old_assets/Compagnons/kael/cutouts/emotion-surprised.png` vs `assets/Compagnons/kael/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-annoyed.png` vs `assets/Compagnons/laharl/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-happy.png` vs `assets/Compagnons/laharl/cutouts/emotion-happy.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-neutral.png` vs `assets/Compagnons/laharl/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-playful.png` vs `assets/Compagnons/laharl/cutouts/emotion-playful.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-romantic.png` vs `assets/Compagnons/laharl/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-sad.png` vs `assets/Compagnons/laharl/cutouts/emotion-sad.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-shy.png` vs `assets/Compagnons/laharl/cutouts/emotion-shy.png`
- `old_assets/Compagnons/laharl/cutouts/emotion-surprised.png` vs `assets/Compagnons/laharl/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-annoyed.png` vs `assets/Compagnons/lyra/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-happy.png` vs `assets/Compagnons/lyra/cutouts/emotion-happy.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-neutral.png` vs `assets/Compagnons/lyra/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-playful.png` vs `assets/Compagnons/lyra/cutouts/emotion-playful.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-romantic.png` vs `assets/Compagnons/lyra/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-sad.png` vs `assets/Compagnons/lyra/cutouts/emotion-sad.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-shy.png` vs `assets/Compagnons/lyra/cutouts/emotion-shy.png`
- `old_assets/Compagnons/lyra/cutouts/emotion-surprised.png` vs `assets/Compagnons/lyra/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-annoyed.png` vs `assets/Compagnons/maeve/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-happy.png` vs `assets/Compagnons/maeve/cutouts/emotion-happy.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-neutral.png` vs `assets/Compagnons/maeve/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-playful.png` vs `assets/Compagnons/maeve/cutouts/emotion-playful.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-romantic.png` vs `assets/Compagnons/maeve/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-sad.png` vs `assets/Compagnons/maeve/cutouts/emotion-sad.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-shy.png` vs `assets/Compagnons/maeve/cutouts/emotion-shy.png`
- `old_assets/Compagnons/maeve/cutouts/emotion-surprised.png` vs `assets/Compagnons/maeve/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/mira/cutouts/emotion-annoyed.png` vs `assets/Compagnons/mira/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/mira/cutouts/emotion-happy.png` vs `assets/Compagnons/mira/cutouts/emotion-happy.png`
- `old_assets/Compagnons/mira/cutouts/emotion-neutral.png` vs `assets/Compagnons/mira/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/mira/cutouts/emotion-playful.png` vs `assets/Compagnons/mira/cutouts/emotion-playful.png`
- `old_assets/Compagnons/mira/cutouts/emotion-romantic.png` vs `assets/Compagnons/mira/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/mira/cutouts/emotion-sad.png` vs `assets/Compagnons/mira/cutouts/emotion-sad.png`
- `old_assets/Compagnons/mira/cutouts/emotion-shy.png` vs `assets/Compagnons/mira/cutouts/emotion-shy.png`
- `old_assets/Compagnons/mira/cutouts/emotion-surprised.png` vs `assets/Compagnons/mira/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/nami/cutouts/emotion-annoyed.png` vs `assets/Compagnons/nami/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/nami/cutouts/emotion-happy.png` vs `assets/Compagnons/nami/cutouts/emotion-happy.png`
- `old_assets/Compagnons/nami/cutouts/emotion-neutral.png` vs `assets/Compagnons/nami/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/nami/cutouts/emotion-playful.png` vs `assets/Compagnons/nami/cutouts/emotion-playful.png`
- `old_assets/Compagnons/nami/cutouts/emotion-romantic.png` vs `assets/Compagnons/nami/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/nami/cutouts/emotion-sad.png` vs `assets/Compagnons/nami/cutouts/emotion-sad.png`
- `old_assets/Compagnons/nami/cutouts/emotion-shy.png` vs `assets/Compagnons/nami/cutouts/emotion-shy.png`
- `old_assets/Compagnons/nami/cutouts/emotion-surprised.png` vs `assets/Compagnons/nami/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/noa/cutouts/emotion-annoyed.png` vs `assets/Compagnons/noa/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/noa/cutouts/emotion-happy.png` vs `assets/Compagnons/noa/cutouts/emotion-happy.png`
- `old_assets/Compagnons/noa/cutouts/emotion-neutral.png` vs `assets/Compagnons/noa/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/noa/cutouts/emotion-playful.png` vs `assets/Compagnons/noa/cutouts/emotion-playful.png`
- `old_assets/Compagnons/noa/cutouts/emotion-romantic.png` vs `assets/Compagnons/noa/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/noa/cutouts/emotion-sad.png` vs `assets/Compagnons/noa/cutouts/emotion-sad.png`
- `old_assets/Compagnons/noa/cutouts/emotion-shy.png` vs `assets/Compagnons/noa/cutouts/emotion-shy.png`
- `old_assets/Compagnons/noa/cutouts/emotion-surprised.png` vs `assets/Compagnons/noa/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-annoyed.png` vs `assets/Compagnons/pleinair/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-happy.png` vs `assets/Compagnons/pleinair/cutouts/emotion-happy.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-neutral.png` vs `assets/Compagnons/pleinair/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-playful.png` vs `assets/Compagnons/pleinair/cutouts/emotion-playful.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-romantic.png` vs `assets/Compagnons/pleinair/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-sad.png` vs `assets/Compagnons/pleinair/cutouts/emotion-sad.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-shy.png` vs `assets/Compagnons/pleinair/cutouts/emotion-shy.png`
- `old_assets/Compagnons/pleinair/cutouts/emotion-surprised.png` vs `assets/Compagnons/pleinair/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/runa/cutouts/emotion-annoyed.png` vs `assets/Compagnons/runa/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/runa/cutouts/emotion-happy.png` vs `assets/Compagnons/runa/cutouts/emotion-happy.png`
- `old_assets/Compagnons/runa/cutouts/emotion-neutral.png` vs `assets/Compagnons/runa/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/runa/cutouts/emotion-playful.png` vs `assets/Compagnons/runa/cutouts/emotion-playful.png`
- `old_assets/Compagnons/runa/cutouts/emotion-romantic.png` vs `assets/Compagnons/runa/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/runa/cutouts/emotion-sad.png` vs `assets/Compagnons/runa/cutouts/emotion-sad.png`
- `old_assets/Compagnons/runa/cutouts/emotion-shy.png` vs `assets/Compagnons/runa/cutouts/emotion-shy.png`
- `old_assets/Compagnons/runa/cutouts/emotion-surprised.png` vs `assets/Compagnons/runa/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/seren/cutouts/emotion-annoyed.png` vs `assets/Compagnons/seren/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/seren/cutouts/emotion-happy.png` vs `assets/Compagnons/seren/cutouts/emotion-happy.png`
- `old_assets/Compagnons/seren/cutouts/emotion-neutral.png` vs `assets/Compagnons/seren/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/seren/cutouts/emotion-playful.png` vs `assets/Compagnons/seren/cutouts/emotion-playful.png`
- `old_assets/Compagnons/seren/cutouts/emotion-romantic.png` vs `assets/Compagnons/seren/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/seren/cutouts/emotion-sad.png` vs `assets/Compagnons/seren/cutouts/emotion-sad.png`
- `old_assets/Compagnons/seren/cutouts/emotion-shy.png` vs `assets/Compagnons/seren/cutouts/emotion-shy.png`
- `old_assets/Compagnons/seren/cutouts/emotion-surprised.png` vs `assets/Compagnons/seren/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/solene/cutouts/emotion-annoyed.png` vs `assets/Compagnons/solene/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/solene/cutouts/emotion-happy.png` vs `assets/Compagnons/solene/cutouts/emotion-happy.png`
- `old_assets/Compagnons/solene/cutouts/emotion-neutral.png` vs `assets/Compagnons/solene/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/solene/cutouts/emotion-playful.png` vs `assets/Compagnons/solene/cutouts/emotion-playful.png`
- `old_assets/Compagnons/solene/cutouts/emotion-romantic.png` vs `assets/Compagnons/solene/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/solene/cutouts/emotion-sad.png` vs `assets/Compagnons/solene/cutouts/emotion-sad.png`
- `old_assets/Compagnons/solene/cutouts/emotion-shy.png` vs `assets/Compagnons/solene/cutouts/emotion-shy.png`
- `old_assets/Compagnons/solene/cutouts/emotion-surprised.png` vs `assets/Compagnons/solene/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/sora/cutouts/emotion-annoyed.png` vs `assets/Compagnons/sora/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/sora/cutouts/emotion-happy.png` vs `assets/Compagnons/sora/cutouts/emotion-happy.png`
- `old_assets/Compagnons/sora/cutouts/emotion-neutral.png` vs `assets/Compagnons/sora/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/sora/cutouts/emotion-playful.png` vs `assets/Compagnons/sora/cutouts/emotion-playful.png`
- `old_assets/Compagnons/sora/cutouts/emotion-romantic.png` vs `assets/Compagnons/sora/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/sora/cutouts/emotion-sad.png` vs `assets/Compagnons/sora/cutouts/emotion-sad.png`
- `old_assets/Compagnons/sora/cutouts/emotion-shy.png` vs `assets/Compagnons/sora/cutouts/emotion-shy.png`
- `old_assets/Compagnons/sora/cutouts/emotion-surprised.png` vs `assets/Compagnons/sora/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/talia/cutouts/emotion-annoyed.png` vs `assets/Compagnons/talia/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/talia/cutouts/emotion-happy.png` vs `assets/Compagnons/talia/cutouts/emotion-happy.png`
- `old_assets/Compagnons/talia/cutouts/emotion-neutral.png` vs `assets/Compagnons/talia/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/talia/cutouts/emotion-playful.png` vs `assets/Compagnons/talia/cutouts/emotion-playful.png`
- `old_assets/Compagnons/talia/cutouts/emotion-romantic.png` vs `assets/Compagnons/talia/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/talia/cutouts/emotion-sad.png` vs `assets/Compagnons/talia/cutouts/emotion-sad.png`
- `old_assets/Compagnons/talia/cutouts/emotion-shy.png` vs `assets/Compagnons/talia/cutouts/emotion-shy.png`
- `old_assets/Compagnons/talia/cutouts/emotion-surprised.png` vs `assets/Compagnons/talia/cutouts/emotion-surprised.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-annoyed.png` vs `assets/Compagnons/zelie/cutouts/emotion-annoyed.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-happy.png` vs `assets/Compagnons/zelie/cutouts/emotion-happy.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-neutral.png` vs `assets/Compagnons/zelie/cutouts/emotion-neutral.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-playful.png` vs `assets/Compagnons/zelie/cutouts/emotion-playful.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-romantic.png` vs `assets/Compagnons/zelie/cutouts/emotion-romantic.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-sad.png` vs `assets/Compagnons/zelie/cutouts/emotion-sad.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-shy.png` vs `assets/Compagnons/zelie/cutouts/emotion-shy.png`
- `old_assets/Compagnons/zelie/cutouts/emotion-surprised.png` vs `assets/Compagnons/zelie/cutouts/emotion-surprised.png`


---

## Session 2026-06-25 — phases 2–3 cleanup (Cursor)

### Phase 2 — tri taxonomique

| From | To | Reason | Status |
|------|-----|--------|--------|
| `old_assets/companion-emotion-cutouts-replaced/` (vide) | `old_assets/archive/2026-06-25-empty-stubs/companion-emotion-cutouts-replaced/` | stub vide | done |
| `old_assets/companions/` | — | README seul | verified |

### Phase 3 — dedup

| Lot | Count | Destination |
|-----|------:|-------------|
| Byte-identique vs `assets/` | 83 | `archive/2026-06-25-dedup-vs-assets/` |
| Doublons internes | 109 | `archive/2026-06-25-dedup-internal/` |
| Miroirs bytes différents (report-only) | 152 | `To check manually/old-assets-dedup-conflicts/manifest.json` |

Script : `scripts/scan-old-assets-duplicates.mjs`

### Inventaire final (hors archive)

| Dossier | Fichiers |
|---------|--------:|
| `Compagnons/` | 153 |
| `prompts-archive/` | 261 |
| `pack_event_invocation/` | 37 |
| `public-mirror/` | 23 |
| `public-references/` | 10 |
| `event-disagrea/` | 20 |
| `companion-chibis-replaced/` | 6 |
| `companions/` | 1 |
| `gacha-event-disagrea-source-2026-06-25/` | 1 |
| `Background/` | 0 |

---

## Session 2026-06-25 — phase 4 snapshots event (direct)

### Tri taxonomique (fin)

| From | To | Reason | Status |
|------|-----|--------|--------|
| `old_assets/companions/{id}/` (19 dossiers vides) | `archive/2026-06-25-empty-stubs/companions-empty-subdirs/` | stub post-tri Compagnons | done |
| `old_assets/Background/` (vide) | `archive/2026-06-25-empty-stubs/Background-empty/` | stub vide post-dedup | done |

### Phase 4 — snapshots event

| Lot | Action | Résultat |
|-----|--------|----------|
| `event-disagrea/` | Inventaire + README (`README.md`, `public-layered-legacy/`, `nsfw-replaced/`) | 20 PNG cold storage ; 42 fichiers déjà en `archive/` (phase 3) |
| `pack_event_invocation/` | Inventaire + README | 37 fichiers ; 0 dedup byte-identique |
| `gacha-event-disagrea-source-2026-06-25/` | MAJ README (index seul) | 8 PNG déjà archivés vs `assets/gacha/cinema/disagrea/` |

Scan dry-run : 0 mouvement supplémentaire.

**En attente user :** 152 cutouts émotion (`To check manually/old-assets-dedup-conflicts/`).


---

## Session 2026-06-25 — archivage cutouts émotion legacy (go user)

Déplacement de **152** fichiers `old_assets/Compagnons/*/cutouts/emotion-*.png` → `old_assets/archive/2026-06-25-cutouts-emotion-legacy/Compagnons/…`

Décision : prod `assets/` = cutouts v3 corrects ; legacy (dont Maeve/Etna mix public/) en cold storage.

Skipped: 0, errors: 0

---

## Session 2026-06-25 — consolidation 5 dossiers old_assets

Moves: **403** (2 errors). Top-level dirs: Background, Compagnons, Gacha, Live2D, Myrions

---

## Session 2026-06-25 — flatten old_assets architecture

Moves: **469** (0 errors). Cible profondeur ≤4.

---

## Session 2026-06-25 — finalisation old_assets

- **152 cutouts** → `Compagnons/{id}/cutouts-legacy/` (`promote-cutouts-legacy-flat.mjs`)
- Event layered → `Compagnons/{id}/layered-legacy/`
- Baseline disque : `docs/traceability/assets/repo-disk-baseline.md`
- README `old_assets/` mis à jour (schéma aligné assets)
- **Reste :** export `D:\Isekai-slow-life\Archiive\Old_assets` (go user)

---

## Session 2026-06-25 — finalize + dedup interne

- `finalize-old-assets.mjs` : **45** moves, **193** dirs vides supprimés, `Compagnons/Autres/` et `Myrions/Autres/` éliminés
- `scan-old-assets-duplicates.mjs --execute` : **106** PNG chibi-sources → `Background/_archive/2026-06-25-dedup-internal/`
- TNR : `npm run build` OK, `validate:link-corpus` OK

---

## Session 2026-06-25 — finalize old_assets

Moves: **45** (0 errors). Empty dirs removed: **193**.


---

## Session 2026-06-25 — scan-old-assets-duplicates

| From | To | Reason | Kind |
|------|-----|--------|------|
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/01_Moussprout.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/01_Moussprout.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/01_Moussprout.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/02_Pepitouffe.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/02_Pepitouffe.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/02_Pepitouffe.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/03_Florelievre.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/03_Florelievre.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/03_Florelievre.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/04_Bourdilune.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/04_Bourdilune.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/04_Bourdilune.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/05_Grainocorne.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/05_Grainocorne.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/05_Grainocorne.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/06_Solhermine.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/06_Solhermine.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/06_Solhermine.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/07_Mielpique.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/07_Mielpique.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/07_Mielpique.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/08_Treflaon.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/08_Treflaon.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/08_Treflaon.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/09_Floracroc.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/09_Floracroc.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/09_Floracroc.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/10_Rosalynx.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/10_Rosalynx.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/10_Rosalynx.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/11_Aubepineon.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/11_Aubepineon.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/11_Aubepineon.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/12_Cerfaurore.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/12_Cerfaurore.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/12_Cerfaurore.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/13_Solarcheval.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/13_Solarcheval.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/13_Solarcheval.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/14_Paladigrain.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/14_Paladigrain.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/14_Paladigrain.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/01_Prairie_Solaire/15_Equilux_Gardien_de_l_Aube.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/01_Mouscarotte.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/01_Mouscarotte.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/01_Mouscarotte.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/02_Noisecureuil.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/02_Noisecureuil.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/02_Noisecureuil.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/03_Champi_Chaton.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/03_Champi_Chaton.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/03_Champi_Chaton.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/04_Brindhibou.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/04_Brindhibou.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/04_Brindhibou.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/05_Limafleur.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/05_Limafleur.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/05_Limafleur.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/06_Sylvarat.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/06_Sylvarat.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/06_Sylvarat.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/07_Fongours.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/07_Fongours.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/07_Fongours.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/08_Luciferne.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/08_Luciferne.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/08_Luciferne.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/09_Lianaconda.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/09_Lianaconda.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/09_Lianaconda.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/02_Foret_Ancienne/10_Orvalis_Coeur_de_la_Foret.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/01_Glucrapaud.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/01_Glucrapaud.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/01_Glucrapaud.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/02_Nenuphant.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/02_Nenuphant.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/02_Nenuphant.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/03_Bourbecaille.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/03_Bourbecaille.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/03_Bourbecaille.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/04_Moustikroa.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/04_Moustikroa.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/04_Moustikroa.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/05_Vasardille.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/05_Vasardille.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/05_Vasardille.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/06_Croacendre.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/06_Croacendre.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/06_Croacendre.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/07_Vipervase.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/07_Vipervase.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/07_Vipervase.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/08_Nebularve.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/08_Nebularve.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/08_Nebularve.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/09_Tourbapince.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/09_Tourbapince.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/09_Tourbapince.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/03_Marais_Brumeux/10_Mirelith_Roi_du_Marais_Sans_Fond.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/01_Cailloubic.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/01_Cailloubic.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/01_Cailloubic.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/02_Givrimoineau.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/02_Givrimoineau.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/02_Givrimoineau.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/03_Cristaloupin.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/03_Cristaloupin.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/03_Cristaloupin.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/04_Pikroc.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/04_Pikroc.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/04_Pikroc.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/05_Gemlimace.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/05_Gemlimace.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/05_Gemlimace.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/06_Avalanchevre.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/06_Avalanchevre.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/06_Avalanchevre.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/07_Glacimarmotte.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/07_Glacimarmotte.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/07_Glacimarmotte.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/08_Quartzard.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/08_Quartzard.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/08_Quartzard.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/09_Rocorbeau.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/09_Rocorbeau.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/09_Rocorbeau.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/04_Montagnes_Cristallines/10_Krysalor_Dragon_des_Cimes.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/01_Sablitou.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/01_Sablitou.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/01_Sablitou.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/02_Cactouris.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/02_Cactouris.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/02_Cactouris.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/03_Scorpiquet.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/03_Scorpiquet.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/03_Scorpiquet.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/04_Mirajackal.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/04_Mirajackal.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/04_Mirajackal.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/05_Dunecaille.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/05_Dunecaille.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/05_Dunecaille.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/06_Dromaglyphe.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/06_Dromaglyphe.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/06_Dromaglyphe.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/07_Vautourune.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/07_Vautourune.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/07_Vautourune.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/08_Cobrambre.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/08_Cobrambre.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/08_Cobrambre.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/09_Fenneflamme.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/09_Fenneflamme.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/09_Fenneflamme.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/05_Desert_Rouge/10_Amonraxis_Mirage_Royal.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/01_Coquichat.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/01_Coquichat.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/01_Coquichat.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/02_Pincelot.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/02_Pincelot.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/02_Pincelot.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/03_Bullorbe.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/03_Bullorbe.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/03_Bullorbe.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/04_Algouette.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/04_Algouette.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/04_Algouette.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/05_Sablapin.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/05_Sablapin.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/05_Sablapin.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/06_Corailynx.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/06_Corailynx.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/06_Corailynx.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/07_Meduflore.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/07_Meduflore.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/07_Meduflore.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/08_Tortecume.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/08_Tortecume.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/08_Tortecume.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/09_Hippocampearl.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/09_Hippocampearl.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/09_Hippocampearl.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/06_Rivage_Corallien/10_Thalassor_Seigneur_du_Lagon.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/01_Charbouvier.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/01_Charbouvier.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/01_Charbouvier.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/02_Flamurmulot.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/02_Flamurmulot.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/02_Flamurmulot.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/03_Cendroquet.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/03_Cendroquet.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/03_Cendroquet.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/04_Lavacroa.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/04_Lavacroa.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/04_Lavacroa.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/05_Obsidigriffe.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/05_Obsidigriffe.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/05_Obsidigriffe.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/06_Magmardillo.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/06_Magmardillo.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/06_Magmardillo.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/07_Cendreloup.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/07_Cendreloup.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/07_Cendreloup.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/08_Fumhibou.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/08_Fumhibou.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/08_Fumhibou.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/09_Pyrocorne.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/09_Pyrocorne.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/09_Pyrocorne.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/07_Volcan_Noir/10_Vulkarion_Coeur_du_Volcan_Noir.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/01_Stellapin.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/01_Stellapin.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/01_Stellapin.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/02_Astromouche.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/02_Astromouche.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/02_Astromouche.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/03_Lunacorne.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/03_Lunacorne.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/03_Lunacorne.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/04_Comechat.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/04_Comechat.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/04_Comechat.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/05_Glyphibou.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/05_Glyphibou.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/05_Glyphibou.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/06_Nebuloup.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/06_Nebuloup.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/06_Nebuloup.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/07_Selenard.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/07_Selenard.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/07_Selenard.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/08_Runescarab.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/08_Runescarab.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/08_Runescarab.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/09_Orbicrabe.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/09_Orbicrabe.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/09_Orbicrabe.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/08_Ruines_Astrales/10_Asterion_Gardien_des_Ruines_Celestes.png | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/MANIFEST.txt` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/MANIFEST.txt` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/MANIFEST.txt | internal |
| `old_assets/Background/prompts/minigames/chibi-sources/Prompt_Cursor_Detourage_Chibis.txt` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/chibi-sources/Prompt_Cursor_Detourage_Chibis.txt` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrions_chibis_individuels/Prompt_Cursor_Detourage_Chibis.txt | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/aventureuse_magique_et_accueillante.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/aventureuse_magique_et_accueillante.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/aventureuse_magique_et_accueillante.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/aventuriÃ¨re_du_dÃ©sert_et_son_compagnon.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_magique_et_son_compagnon_glacial.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/aventuriÃ¨re_magique_et_son_compagnon_glacial.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/aventuriÃ¨re_magique_et_son_compagnon_glacial.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/a_clean_isolated_character_illustration_on_a_tran_1.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/a_clean_isolated_character_illustration_on_a_tran_1.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/a_clean_isolated_character_illustration_on_a_tran_1.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/exploratrice_de_la_forÃªt_et_son_renard.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/exploratrice_de_la_forÃªt_et_son_renard.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/exploratrice_de_la_forÃªt_et_son_renard.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/exploratrice_tropicale_et_sa_tortue.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/exploratrice_tropicale_et_sa_tortue.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/exploratrice_tropicale_et_sa_tortue.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/herboriste_accueillante_et_son_lapin.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/herboriste_accueillante_et_son_lapin.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/herboriste_accueillante_et_son_lapin.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/mage_et_hibou_magique_Ã©toilÃ©.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/mage_et_hibou_magique_Ã©toilÃ©.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/mage_et_hibou_magique_Ã©toilÃ©.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/magicienne_de_feu_et_son_compagnon.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/magicienne_de_feu_et_son_compagnon.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/magicienne_de_feu_et_son_compagnon.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/chibis-9-pack/prompt_detourage_cursor_python.txt` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/chibis-9-pack/prompt_detourage_cursor_python.txt` | internal duplicate of old_assets/Compagnons/imports/talia-import/chibis_9_pack_cutout/prompt_detourage_cursor_python.txt | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/01_marais.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/01_marais.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/01_marais.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/02_prairie.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/02_prairie.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/02_prairie.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/03_foret_enchantee.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/03_foret_enchantee.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/03_foret_enchantee.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/04_montagne_cristal_glace.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/04_montagne_cristal_glace.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/04_montagne_cristal_glace.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/05_desert_ruines.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/05_desert_ruines.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/05_desert_ruines.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/06_plage_tropicale.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/06_plage_tropicale.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/06_plage_tropicale.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/07_volcan_lave.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/07_volcan_lave.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/07_volcan_lave.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/08_astral_celeste.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/08_astral_celeste.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/08_astral_celeste.png | internal |
| `old_assets/Background/prompts/minigames/talia-sources/companion-pack/09_chibi.png` | `old_assets/Background/_archive/2026-06-25-dedup-internal/Background/prompts/minigames/talia-sources/companion-pack/09_chibi.png` | internal duplicate of old_assets/Compagnons/imports/talia-import/myrion_companion_pack/09_chibi.png | internal |
### Stats

```json
{
  "scannedAssets": 712,
  "scannedOldAssets": 621,
  "movedVsAssets": 0,
  "movedInternal": 106,
  "conflicts": 0,
  "skipped": 0,
  "errors": 0
}
```

