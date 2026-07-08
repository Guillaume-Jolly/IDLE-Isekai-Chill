# Manifeste cleanup 2.2.1 — archive (pass 2)

**Date :** 2026-07-08  
**Règle :** **aucune suppression** — uniquement `git mv` / `Move-Item` vers dossiers **gitignorés**.

## Arborescence archive

| Chemin | Rôle |
|--------|------|
| `old_2_2/` | Racine archive phase 2.2 (gitignoré) |
| `old_2_2/old_2_2_1/` | Archive patch 2.2.1 (nested) |
| `old_2_2/old_2_2_1/annule/` | Lots **annulés** (Maeve/Runa, parler-scenarios, havre-parler) |
| `old_2_2/old_2_2_1/reliquats/` | Scratch dev (`.tmp-*`) |
| `old_2_2/old_2_2_1/mini jeu lien/` | Reliquats **mini-jeu Lien** par compagnon |
| `old_2_2/old_2_2_1/mini jeu lien/maeve/` | Sorties validate Maeve |
| `old_2_2/old_2_2_1/mini jeu lien/runa/` | Sorties validate Runa |
| `old_2_2/old_2_2_1/mini jeu lien/lyra/` | Lyra aff.3 (essai archivé) |
| `old_2_2/old_2_2_1/mini jeu lien/outils/` | Outils parler multi-compagnon (lot Maeve/Runa) |
| `old_2_2/old_2_2_1/mini jeu lien/code/` | `stagingParlerCorpus.ts` (auto-load staging — obsolète) |
| `old_2_2/old_2_2_1/mini jeu lien/skills-cursor/` | Skills Cursor parler (comm IA externe) |

## Staging entamé

| Chemin | Rôle |
|--------|------|
| `staging/mini jeu/color 2/` | **Color Toon** — masques, scripts, exports (lab `:5174`) |
| `staging/playbooks/parler-smoke.md` | Smoke Lyra aff.5 |
| `staging/companion-visual-pack/` | Cutouts émotion v3 Lyra (WIP village) |

## Actif (ne pas archiver)

- Lyra aff. 1, 2, 4, 5 curés (`scripts/.../lyra-aff*-curated-12*.json`)
- Lanceur, Roue, lab minigames (`src/minigame-lab/`, `:5174`)
- Profils compagnons v1 (`docs/traceability/companions/*_PROFILE.md`)

## Scripts

- Pass 1 : `node scripts/archive-cleanup-2_2_1.mjs`
- Pass 2 : `node scripts/reorg-archive-2_2_1-pass2.mjs`
- Journaux : `old_2_2/old_2_2_1/archive-run-log.json`, `reorg-pass2-log.json`

## Backlog 2.2.2 (hors archive)

| Item | Fichier(s) | Note |
|------|------------|------|
| QoL purge cache Cursor | `scripts/purge-cursor-cache.ps1` | Indépendant IDLE — à pipeline en 2.2.2 |
| Corpus clean JSON | `scripts/references/link-corpus/companion_link_conversations.v2.clean.json` | Idem |

---

*Purge disque : Guillaume seul.*
