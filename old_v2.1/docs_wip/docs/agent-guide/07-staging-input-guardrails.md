# Garde-fous — `staging/` et `Input chatgpt/`

**Règle projet (2026-06-25)** : ces dossiers sont des **espaces de travail temporaires**.  
Aucun script de migration / promote / archive ne doit y puiser ou y envoyer des fichiers **tant qu’un lot n’est pas validé et terminé** par Guillaume.

## Interdit sans validation explicite

- Copier automatiquement `staging/**` → `assets/` ou `old_assets/`
- Copier automatiquement `Input chatgpt/**` → `assets/` ou `old_assets/`
- Inclure `staging/` ou `Input chatgpt/` dans un commit baseline « prod » sans tri

## Flux attendu

1. Génération / itération dans `staging/` ou `Input chatgpt/`
2. Revue visuelle + smoke en jeu
3. **Promote manuel ou script dédié** avec `--execute` explicite (ex. `promote-intime-bed-affinity.mjs`)
4. Archivage des remplacés → `old_assets/` (jamais supprimer)

## Scripts prod-safe

Pointent uniquement vers `assets/`, `old_assets/`, `scripts/references/` — **pas** vers `staging/` sauf scripts nommés `promote-*` ou `import-*` lancés volontairement.

## Agents

Ne pas utiliser `.ai/` pour la coordination (désactivé). Voir `.ai/README.md`.
