# Cleanup 2.1 — État après MVP 21.1

**Date :** 2026-06-30  
**HEAD avant :** `16dc8be`  
**HEAD après :** *(voir commit cleanup local)*

---

## git status après déplacement

### Renames staged (git mv)

- `.ai/**` → `old_v2.1/ai_work/.ai/**` (18 fichiers tracked + README untracked)
- `docs/MYRION_WORKSITE_*.md` et docs drift → `old_v2.1/docs_wip/docs/**` (16 fichiers)

### Nouveaux untracked à versionner

- `old_v2.1/**` (archive complète, 454 fichiers)
- `docs/CLEANUP_2_1_*.md` (inventaire)

### Reste dirty (volontairement non archivé)

| Fichier | Raison |
|---------|--------|
| `scripts/mvp9-install-worksite-assets.py` | Script pipeline assets release 2.1 |
| `scripts/worksite-remove-white-bg.py` | Script pipeline worksite |
| `src/audio/worksiteAudio.ts` | Code actif minigames (diff vide / CRLF) |
| `src/components/minigames/Worksite*.tsx` (3) | Code actif |
| `src/data/myrion*.ts` (5) | Data worksite active |
| `src/hooks/useEnclosureWanderers.ts` | Hook refuge actif |

Aucun diff de contenu détecté sur les fichiers `src/` (uniquement métadonnées CRLF).

---

## Éléments déplacés (résumé)

| Catégorie | Opérations | Fichiers approx. |
|-----------|------------|------------------|
| assets_wip | 6 | ~120 (5 compagnons + hub) |
| story_wip | 8 | ~15 |
| staging | 6 | ~130 |
| temp | 1 | 1 |
| docs_wip | 22 | ~25 |
| ai_work | 1 | 19 |
| legacy | 26 | ~140 |
| **Total opérations** | **70** | **454 fichiers** dans `old_v2.1/` |

---

## Éléments non déplacés (volontaire)

- Release 2.1 docs et code worksite actif
- `staging/playbooks/**` (tracked, référence agents)
- `staging/manifests/myrion-worksite-mvp15.json` (tracked)
- Corps `old_assets/**` versionné (712 fichiers) — seuls ajouts untracked déplacés
- `skineline-premium`, `companion-visual-pack` dans staging (tracked)

---

## Risques

1. **AGENTS.md** référence `.ai/project-context.md` — dossier désormais sous `old_v2.1/ai_work/.ai/`. Restaurer ou recréer un stub `.ai/` minimal en MVP 21.2 si besoin agents.
2. **Liens docs** internes vers `docs/MYRION_WORKSITE_*.md` — chemins changés ; docs archivées mais accessibles sous `old_v2.1/docs_wip/`.
3. **Fichiers src dirty CRLF** — bruit git status ; `git checkout --` ou normalisation en 21.2 si souhaité.

---

## Vérifications effectuées

- [x] Aucune suppression (`rm` / `del`) utilisée
- [x] 70/70 destinations présentes, sources absentes
- [x] `old_v2.1/` contient 454 fichiers
- [x] Pas de déplacement de `public/assets/minigames/myrion-worksite/**`
- [x] Pas de déplacement de catalogues bonds / corpus validés

---

## Actions recommandées — MVP 21.2

1. ~~`npm run build` — confirmer build 2.1 intact post-archivage~~ **Fait** — voir [`CLEANUP_2_1_VALIDATION_21_2.md`](./CLEANUP_2_1_VALIDATION_21_2.md)
2. ~~Décider : restaurer `.ai/` minimal à la racine~~ **Fait** — stub `.ai/` créé (MVP 21.2)
3. ~~Traiter bruit CRLF sur `src/` et `scripts/`~~ **Fait** — `git checkout --` (diff vide)
4. Commit cleanup local — voir MVP 21.2
5. **Ne pas push** avant validation Guillaume

## Actions recommandées — MVP 21.3

1. Push branche cleanup (`d4bb3d0` + commits 21.2) si validé
2. Créer / mettre à jour PR release 2.1 + cleanup
3. Rebuild preview pour smoke post-commit

---

## Références

- Avant : [`CLEANUP_2_1_STATUS_BEFORE.md`](./CLEANUP_2_1_STATUS_BEFORE.md)
- Manifeste : [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md)
- Archive : [`../old_v2.1/README.md`](../old_v2.1/README.md)
