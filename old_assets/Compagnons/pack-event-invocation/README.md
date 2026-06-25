# pack_event_invocation — snapshot event « Choisis ton invocation »

Import ponctuel depuis `Input chatgpt/pack_event_invocation`. **Non runtime** — les visuels prod vivent sous `assets/Compagnons/` et `assets/Myrions/` si promus.

---

## Structure (37 fichiers)

| Dossier | Contenu |
|---------|---------|
| `01_compagnons/` | Bases + affinité 5 : Guillaume, Kumiko, Lea, Metashine (versions « finales » du snapshot) |
| `01_compagnons/replaced-copy-paste-v1/` | Itération copy-paste rejetée |
| `01_compagnons/replaced-v3-too-different/` | Itération v3 trop éloignée du style |
| `01_compagnons/replaced-v4-photo-paste/` | Itération photo-paste |
| `02_myrions/` | Sprites myrion normal + chibi (mêmes personnages) |
| `03_promo/` | Bannières event (`event_choisis_ton_invocation*.png`) |

---

## Dedup (2026-06-25)

Scan `scan-old-assets-duplicates.mjs` : **0 byte-identique** vs `assets/` ou interne.

Les sous-dossiers `replaced-*` sont des **itérations bytes différentes** — garder en cold storage pour historique pipeline ; ne pas fusionner sans revue manuelle.

---

## Promotion

Pas de script de promotion automatique. Pour remonter un visuel vers prod : pipeline asset standard + log dans `docs/traceability/assets/old-assets-cleanup-log.md`.
