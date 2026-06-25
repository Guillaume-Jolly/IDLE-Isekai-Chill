# Candidats remplacement artwork affinité (v1–v3)

Les variantes **v1, v2, v3** de ce dossier peuvent remplacer les artwork affinité actuels en prod.

**Les v4** ont été déplacées vers [`staging/skinline-premium/`](../../skinline-premium/) — skins déblocables à part, ne pas promouvoir en affinité standard.

## Cible prod suggérée

| Round | Usage | Cible |
|-------|--------|--------|
| **v3** | Recommandé par défaut (push pose / tenue) | `public/assets/companions/{id}/affinity-5.png` |
| **v2** | Alternative si v3 trop poussée | `affinity-4.png` ou `-nsfw` Disagrea |
| **v1** | Base univers + pose classique | `affinity-4.png` |

Disagrea Etna : variantes `allfours/`, `side/`, `wide/` dans ce dossier (pas skinline premium).

## Promotion (à faire compagnon par compagnon)

1. Choisir v1 / v2 / v3 par compagnon dans la galerie dev.
2. Archiver l’ancien PNG → `old_assets/companion-affinity-replaced/{id}/`.
3. Copier le candidat vers `public/assets/companions/{id}/affinity-{4|5}.png`.

Pas de script auto — validation visuelle requise.
