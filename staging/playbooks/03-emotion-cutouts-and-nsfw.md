# 03 — Cutouts émotion & NSFW

Version courante : **v3** (ancre par compagnon). v2 obsolète → `old_assets/`.

---

## Émotions standard (8)

`neutral`, `happy`, `shy`, `annoyed`, `sad`, `surprised`, `playful`, `romantic`

Définition prompts : `staging/companion-visual-pack/data/emotions.json`  
Style verrouillé : `staging/companion-visual-pack/CUTOUT_STYLE.md`

---

## Règles DA cutout

1. **Full body**, pieds visibles, fond `#CFCFCF` plat
2. **Tenue L1 inchangée** — seule expression/pose varie
3. **Ancre** = `public/assets/companions/{id}/affinity-1.png` (PAS Etna sauf Etna)
4. **Painterly gacha** — pas cel-shading Disgaea dur
5. Nom staging : `companion-{id}-emotion-{emotion}-cutout-v3.png`

---

## Commandes

```bash
# File d'attente
node scripts/regenerate-emotion-cutouts.mjs list
node scripts/regenerate-emotion-cutouts.mjs list lyra

# Prompt pour génération IA
node scripts/regenerate-emotion-cutouts.mjs prompt lyra happy

# Archiver v2 public → old_assets (avant promote v3)
node scripts/regenerate-emotion-cutouts.mjs archive-obsolete lyra

# Promote staging → public (chroma key)
node scripts/regenerate-emotion-cutouts.mjs promote lyra
node scripts/regenerate-emotion-cutouts.mjs promote --all
```

Chroma : `scripts/chroma-key-png.mjs`  
Queue print : `node scripts/staging/print-emotion-cutout-queue.mjs`

---

## Chemins

| Étape | Chemin |
|-------|--------|
| Staging v3 | `staging/companion-visual-pack/village/{id}/cutouts/` |
| Staging Disagrea | `staging/companion-visual-pack/disagrea/{id}/cutouts/` |
| Runtime | `public/assets/companions/{id}/emotion-{emotion}.png` |
| Archive | `old_assets/companions/{id}/cutouts/emotion-{emotion}.png` |
| Cible 2.0 | `assets/Compagnons/{id}/cutouts/` |

---

## NSFW affinité (palier 4)

Pattern runtime actuel :
- `affinity-4-nsfw.png` + `affinity-4.png` (SFW)
- Disagrea integrated : `assets/event-disagrea/integrated/companions/{id}/`

Promote NSFW : script archivé `old_v2.1/scripts_legacy/promote-companion-visual-pack.mjs` ou `promote-disagrea-integrated-affinity.mjs`

**Staging batch naming :**
```
assets/Compagnons/{id}/NSFW/
  ou
assets/Compagnons/{id}/Autres/Etna Essai NSFW v5/
```

Toujours garder trace du batch source dans le nom dossier `Autres/`.

---

## v4 / regénération future

Avant v4 :
1. Documenter **pourquoi** v3 insuffisant (1 paragraphe dans staging)
2. Archiver v3 → `old_assets/` via promote archive flow
3. Incrémenter version dans `companion-visual-pack-data.mjs` (`cutoutOutputPath(..., 'v4')`)
4. Regénérer **compagnon par compagnon**, jamais all-in sans TNR

---

## Fichiers code (si branchement UI conversation)

| Fichier | Action |
|---------|--------|
| `src/components/minigames/ConversationGame.tsx` | Affichage cutout par round (backlog B4) |
| `staging/story/emotion-cutout-usage-map.md` | Mapping émotion → cutout |

---

## Fichiers data prompts

| Fichier | Rôle |
|---------|------|
| `scripts/staging/companion-visual-pack-data.mjs` | DNA, identityLock, prompts v3 |
| `staging/companion-visual-pack/data/emotions.json` | 8 émotions |
| `staging/companion-visual-pack/CUTOUT_STYLE.md` | DA — **attention conflit v2/v3**, suivre pack-data |

---

## Checklist promote

- [ ] 8/8 staging v3 présents pour le compagnon
- [ ] `archive-obsolete` si anciens `emotion-*.png` en public
- [ ] `promote {id}` → vérifier dimensions PNG headers
- [ ] smoke visuel galerie / Liens
- [ ] mettre à jour `staging/companion-visual-pack/data/CUTOUT_V3_REGENERATION.md`

---

## STOP conditions

- Ne pas promote si style ≠ ancre compagnon (identity drift)
- Ne pas écraser sans archive
- User a stoppé v3 mass promote — reprendre seulement avec playbook + TNR explicite
