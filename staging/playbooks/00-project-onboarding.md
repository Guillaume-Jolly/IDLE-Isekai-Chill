# 00 — Onboarding projet

Updated: 2026-06-25

---

## Produit

**IDLE Isekai Chill** — idle / gacha / collection : compagnons, Myrions, biomes, conversations Lien, chasse, dressage, production passive, gacha.

Stack : React 19, TypeScript, Vite, saves locales, PNG/SVG.

---

## Architecture code (zones sensibles)

| Zone | Rôle | Prudence |
|------|------|----------|
| `src/App.tsx` | Shell principal, onglets | Gros fichier — ne pas étendre sans découper |
| `src/data/*.ts` | Données gameplay | IDs stables, pas de rename sans grep |
| `src/data/linkCorpusV2.json` | 7500 conversations (~39 Mo) | Split futur — ne pas dupliquer |
| `src/components/minigames/` | Liens, chasse, dressage | CSS lourd `Minigames.css` |
| `src/data/companionAssets.ts` | Chemins portraits/cutouts | Toujours via `publicAssetUrl()` |
| `vite.config.ts` | Rewrites `/companions`, dev-assets | Casser = images 404 silencieuses |
| `scripts/*` | Import, promote, validate | Lire le script avant d'inventer |

---

## Architecture assets (transition → 2.0)

**Aujourd'hui :**
- Runtime jouable : `public/assets/companions/`, `public/assets/minigames/`, `public/gacha/`, `public/village/`
- Legacy rewrite : `public/companions/` → éviter d'ajouter ici
- Sources : `assets/event-disagrea/`, `assets/minigames/`
- WIP : `staging/companion-visual-pack/`, `staging/skinline-premium/`
- Archive : `old_assets/`

**Demain (single `assets/`) :** voir `05-assets-2.0-migration.md`.

---

## Règles non négociables

1. **Jamais supprimer** un asset — déplacer vers `old_assets/` + noter dans manifest.
2. **Ne pas toucher** `Input chatgpt/` ni supprimer dans `staging/`.
3. **Pas de commit sur `main`** sans validation user explicite pour 2.0.
4. **Pas de rename d'ID** compagnon/biome/Myrion sans grep complet.
5. **Saves** : pas de changement format sans migration.
6. **Un writer à la fois** sur le working tree.

---

## Validation obligatoire

```bash
npm run build
npm run lint
npm run validate:link-corpus   # si corpus touché
```

Smoke visuel manuel après tout changement de chemin image :
- Liens (1 conversation)
- Chasse (1 biome)
- Dressage (1 Myrion)
- Gacha (1 pull si event)
- Compagnon portrait galerie

Checklist détaillée : `06-tnr-checklist.md`.

---

## Erreurs silencieuses connues

| Symptôme | Cause probable |
|----------|----------------|
| Portrait blanc / absent | Chemin `public/` vs rewrite vite ; legacy `public/companions/` |
| Conversation sans texte | Corpus V2 vide pour affinité → fallback legacy |
| Image 404 sans crash | `publicAssetUrl` + `<img onError>` — vérifier Network tab |
| Double chemins legacy + new | `*PathCandidates` arrays — les deux doivent exister ou code mis à jour |
| Cutout style incohérent | mauvaise ancre ref — voir CUTOUT_STYLE.md |

---

## Où documenter son travail

| Type | Emplacement |
|------|-------------|
| Plan / audit | `staging/planning/` ou `staging/reviews/` |
| Story seeds | `staging/story/` |
| Playbooks | `staging/playbooks/` |
| État agent | `.ai/current-state.md` |
| Backlog produit | `docs/BACKLOG.md` |

---

## Initiative en cours

**Assets 2.0 cleanup** — Phase 1 playbooks (ce dossier). Phase 2 = moves physiques.

Backup : commit `06961a1` sur `origin/Backup`.
