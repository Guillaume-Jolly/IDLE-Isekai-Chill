# Changelog phase 2.2.1 — kickoff patch (post-clôture C)

**Date :** 2026-07-08  
**Branche :** `feature/2.2` (semver **`2.2.1`** au prochain push C)  
**Précédent :** [`CHANGELOG_2_2.md`](./CHANGELOG_2_2.md) — clôture inventaire 2.2.0  

---

## Objectif 2.2.1

Patch de **stabilisation et mise au propre** après clôture 2.2.0 — pas de feature majeure.

| Axes | Contenu |
|------|---------|
| **Fix** | Crash cutouts Roue du Destin |
| **Staging** | Color Toon lab `:5174` (pas de promo `:5173` sans go) |
| **Archive** | Annulés → `old_2_2/` · reliquats terminés → `old_2_2_1/` |
| **Hygiène** | Reset X/Y UI, `project-state.md`, release gate |

---

## Priorités

| P | Lot | Action |
|---|-----|--------|
| **P0** | Crash personnages Roue du Destin | Fix `CompanionPortrait` / cutouts · smoke Disgaea + Havre |
| **P1** | Archive annulés | Move (jamais delete) corpus V2 ChatGPT + Maeve Phase A/B → `old_2_2/` · manifeste |
| **P1** | Archive reliquats terminés | Move docs/scripts WIP obsolètes → `old_2_2_1/` |
| **P1** | Triage git | Lots commitables : lanceur / roue / lab / parler **curé Lyra aff.5** — sans pression merge |
| **P2** | Reset X/Y kickoff patch | X≈704 trop élevé — reset compteur UI ([`07-kickoff-nouvelle-version.md`](../../agent-guide/07-kickoff-nouvelle-version.md) adapté **patch**) |
| **P2** | Smoke Parler Lyra aff.5 (staging) | Partie 2 modop — **optionnel** si temps ; pas le corpus V2 annulé |
| **P3** | Color Toon | Continuer lab · calque v3 verrouillé |
| **P3** | Dark mode / quêtes 10 j | Backlog si bande passante |

**Retiré des priorités (annulé) :** Phase C corpus V2 ChatGPT · pipeline Maeve/Runa Phase A/B · intégration Maeve en jeu.

---

## Rituel clôture C → `2.2.1`

```bash
npm run build
npm run validate:companion-bonds
npm run validate:link-corpus
npm run validate:destiny-wheel
npm run validate:curated-parler:aff5:both   # si touché Parler curé
npm run audit:dev-log-coverage
```

| # | Action |
|---|--------|
| 1 | Release gate ci-dessus |
| 2 | [`project-state.md`](../project-state.md) à jour |
| 3 | Exécuter moves archive + [`CLEANUP_2_2_1_MANIFEST.md`](../../CLEANUP_2_2_1_MANIFEST.md) |
| 4 | DEV_LOG : jalon 2.2.1 · reset X/Y si kickoff |
| 5 | `git push` branche → **C+1** → semver `2.2.1` |

---

## Ce qui reste où (runtime)

| Zone | Rôle 2.2.1 |
|------|------------|
| `:5173` | Jeu principal — Roue, hub, Parler **curé** Lyra aff.5 |
| `:5174` | **Lab WIP** — Color Toon, alignement calques |
| `staging/` | Parler curé validé auto · smoke in-game **à compléter** |
| `old_2_2/` | Annulés (V2 ChatGPT, Maeve pipeline) |
| `old_2_2_1/` | Reliquats post-lots terminés |

---

## Risques

- Moves archive **sans** manifeste = confusion agents — toujours lister avant `mv`
- Ne pas confondre **Parler curé Lyra aff.5** (terminé auto) et **corpus V2 ChatGPT** (annulé)
- Label UI : reset X/Y recommandé pour lisibilité

---

## Liens

| Document | Rôle |
|----------|------|
| [`CHANGELOG_2_2.md`](./CHANGELOG_2_2.md) | Inventaire clôture 2.2.0 |
| [`CLEANUP_2_2_1_MANIFEST.md`](../../CLEANUP_2_2_1_MANIFEST.md) | Moves archive planifiés |
| [`HANDOFF_2_2_AGENT_BRIEF.md`](../../HANDOFF_2_2_AGENT_BRIEF.md) | Brief phase (historique) |

---

*Kickoff 2.2.1 — décisions Guillaume 2026-07-08.*
