# 03 — Projets ponctuels

Updated: 2026-06-25

Guideline pour imports, events, packs **one-shot** — distincts des pipelines systématiques futurs.

---

## Quand c'est « ponctuel »

- Import event terminé (Disagrea 2026)
- Pack Talia, corpus zip unique
- Regénération cutouts v3 compagnon par compagnon (stoppée — cleanup prioritaire)
- Script one-shot sans playbook dédié

**Pas besoin** de manifest complet tant que le user n'a pas demandé systématisation.

---

## Checklist minimum (ponctuel)

### Avant

- [ ] Lire script existant (`scripts/import-*.mjs`, `promote-*.mjs`)
- [ ] Vérifier chemins post Assets 2.0 (`assets/`, pas `public/assets/`)
- [ ] Sources présentes localement (souvent gitignorées dans `assets/*-import/`)

### Pendant

- [ ] Staging d'abord si visuel (`staging/`, `assets/event-*`)
- [ ] Promote seulement après validation user si DA sensible (NSFW, identité)
- [ ] Archiver remplacés → `old_assets/` (même arborescence)

### Après

- [ ] TNR build + smoke zone touchée
- [ ] Entrée [`docs/traceability/changelog`](../traceability/changelog/) avec version UI
- [ ] Note dans `.ai/current-state.md` si impact roadmap
- [ ] **Ne pas** créer 5 nouveaux `.md` — une note dans planning/ suffit

---

## Ce qu'on documente pour refaire plus tard

Même ponctuel, noter dans l'entrée changelog :

| Champ | Exemple |
|-------|---------|
| **Inputs** | zip, dossier source, refs images |
| **Scripts** | `npm run import:disagrea` |
| **Outputs** | chemins `assets/Compagnons/etna/...` |
| **Décisions user** | « Etna NSFW = batch5-v5, pas L6 générique » |
| **Non reproductible** | itérations IA non déterministes |

---

## Ponctuels connus (référence rapide)

| Projet | Script / doc | Manifest |
|--------|--------------|----------|
| Disagrea intégrés | `import-disagrea-assets.mjs` | `VALIDATED_MANIFEST.json` |
| Gacha cinéma Disagrea | `import-disagrea-gacha-cinema.mjs` | `assets/gacha/event/disagrea/manifest.json` |
| Link corpus v2 | `import-link-corpus-v2.mjs` | zip externe + README |
| Cutouts v3 | `regenerate-emotion-cutouts.mjs` | `emotions.json`, `CUTOUT_V3_REGENERATION.md` |
| Myrions import | `import:myrions` | `myrions-name-manifest.mjs` partiel |
| Village panorama | `import:village` | — |

→ Détails : `docs/traceability/audits/orphan-dead-files-audit.md`

---

## Distinction vs pipeline systématique (backlog)

Les pipelines **à systématiser plus tard** (manifest end-to-end) :

1. Nouveau compagnon (guideline + images → tout)
2. Nouvel event
3. Nouvel environnement Myrion
4. Skinline épique / NSFW (gate validation)
5. Modification launcher PROD

Voir `docs/traceability/audits/backlog-systematic-pipelines.md`.

**Ne pas mélanger** : un agent sur ponctuel n'implémente pas le manifest systématique sans demande.
