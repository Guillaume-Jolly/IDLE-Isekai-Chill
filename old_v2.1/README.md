# Quarantaine post-release 2.1

Archive locale **non destructive** créée par MVP 21.1 (2026-06-30).

Aucun fichier n’a été supprimé : tout a été **déplacé** depuis la racine du dépôt vers `old_v2.1/<catégorie>/`.

| Dossier | Contenu |
|---------|---------|
| `assets_wip/` | Assets compagnons/hub non intégrés release 2.1 |
| `story_wip/` | Story, scene generator, hooks associés (non branchés) |
| `staging/` | Staging mvp15 généré, manifests JSON temporaires, samples story |
| `ai_work/` | Dossier `.ai/` historique (coordination agent pré-21.2) |

**Stub actif (MVP 21.2) :** `.ai/` à la racine du dépôt — voir `.ai/README.md`.
| `temp/` | Logs build temporaires |
| `docs_wip/` | Docs MVP drift + notes hors release active |
| `legacy/` | Ajouts untracked `old_assets/`, scripts archive |
| `manifests/` | CSV/JSON des déplacements |
| `notes/` | Notes d’inventaire |

Restaurer un élément : `git mv` ou `mv` inverse vers le chemin d’origine documenté dans `docs/CLEANUP_2_1_MOVE_MANIFEST.md`.
