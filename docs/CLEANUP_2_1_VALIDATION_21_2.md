# Cleanup 2.1 — Validation MVP 21.2

**Date :** 2026-06-30  
**Objectif :** Valider le dépôt après quarantaine `old_v2.1/`, corriger références agent cassées, stabiliser bruit CRLF.

---

## 1. Objectif

Confirmer que la release 2.1 reste buildable et jouable après archivage MVP 21.1, sans suppression définitive.

---

## 2. État initial

| Élément | Valeur |
|---------|--------|
| Branche | `feature/myrion-worksite-mvp2` |
| HEAD | `d4bb3d0` — chore(cleanup): archive post-2.1 out-of-scope files |
| Fichiers M | 11 (scripts + src worksite) |

---

## 3. Fichiers M analysés

| Fichier | Diff contenu | Décision |
|---------|--------------|----------|
| `scripts/mvp9-install-worksite-assets.py` | vide | `git checkout --` (bruit) |
| `scripts/worksite-remove-white-bg.py` | vide | idem |
| `src/audio/worksiteAudio.ts` | vide | idem |
| `src/components/minigames/WorksiteLifeChibi.tsx` | vide | idem |
| `src/components/minigames/WorksiteMineBursts.tsx` | vide | idem |
| `src/components/minigames/WorksiteMyrionLifeLayer.tsx` | vide | idem |
| `src/data/myrionRefuge.ts` | vide | idem |
| `src/data/myrionWorksiteAssignment.ts` | vide | idem |
| `src/data/myrionWorksiteDefs.ts` | vide | idem |
| `src/data/myrionWorksiteLife.ts` | vide | idem |
| `src/data/myrionWorksiteUi.ts` | vide | idem |
| `src/hooks/useEnclosureWanderers.ts` | vide | idem |

`git diff --numstat` et `git diff --ignore-space-at-eol` : **aucune ligne** sur les 11 fichiers — uniquement métadonnées working tree (CRLF).

---

## 4. Analyse CRLF / whitespace

- **Traité :** oui — `git checkout --` sur les 11 fichiers sans perte de contenu.
- **Aucune modification réelle** écrasée.

---

## 5. Décision AGENTS.md / `.ai`

**Option retenue :** stub minimal à la racine (recommandée).

| Fichier créé | Rôle |
|--------------|------|
| `.ai/README.md` | Pointeur archive + release 2.1 |
| `.ai/project-context.md` | Contexte actif compact |
| `.ai/current-state.md` | État post-quarantaine |
| `.ai/next-task.md` | Placeholder |

**AGENTS.md :** une ligne ajoutée — stub actif + chemin archive `old_v2.1/ai_work/.ai/`.

**Non restauré :** dossier `.ai/` complet (reste dans `old_v2.1/ai_work/.ai/`).

---

## 6. Validations lancées

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline   # inclut build
```

---

## 7. Résultats

| Commande | Résultat | Détail |
|----------|----------|--------|
| `validate:companion-bonds` | **OK** | 19 compagnons, 190 conversations |
| `validate:link-corpus` | **OK** | 7500 conversations |
| `tnr:baseline` | **OK** | build + manifest assets |
| `build` (via tnr) | **OK** | `v2.1.0.128` (d4bb3d0) |

Aucune erreur liée à un chemin archivé manquant.

**Manifest assets :** régénéré par tnr (1801 images) — reflète arborescence post-quarantaine.

---

## 8. Corrections appliquées

1. Stub `.ai/` à la racine (4 fichiers).
2. Note archive dans `AGENTS.md`.
3. Nettoyage CRLF — 11 fichiers restaurés à HEAD.
4. Mise à jour `docs/traceability/assets/asset-manifest.json` (tnr).

**Suppressions définitives :** **aucune**.

---

## 9. Smoke court (preview `http://127.0.0.1:4175/`)

| Écran | Résultat |
|-------|----------|
| Village | OK |
| Hub mini-jeux | OK — Ferme lunaire, **Promenade Myrions** |
| Liens | OK — conversations de lien visibles |
| Inventaire | non ouvert (hub + liens suffisants pour smoke) |
| Ferme lunaire | non ouvert séparément (présent hub) |

Pas de crash observé.

---

## 10. Éléments encore hors scope

- Contenu intégral dans `old_v2.1/` (454 fichiers archivés)
- `staging/playbooks/**` actif à la racine
- Lint global non traité

---

## 11. Risques pour MVP 21.3

1. **Commits cleanup locaux** non poussés (`d4bb3d0` + 21.2) — synchroniser avec remote après validation Guillaume.
2. **Preview** peut servir un build antérieur — rebuild preview si libellés à revalider.
3. **Codex report paths** dans `AGENTS.md` (`.ai/codex-report.md`) — fichiers créés à la demande ; archive historique sous `old_v2.1/`.

---

## Références

- [`CLEANUP_2_1_STATUS_AFTER_21_1.md`](./CLEANUP_2_1_STATUS_AFTER_21_1.md)
- [`CLEANUP_2_1_MOVE_MANIFEST.md`](./CLEANUP_2_1_MOVE_MANIFEST.md)
- [`../old_v2.1/README.md`](../old_v2.1/README.md)
