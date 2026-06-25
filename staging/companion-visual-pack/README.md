# Companion Visual Pack — Staging

Répertoire **hors `assets/`** pour valider avant promotion vers production.

## Structure

```
staging/companion-visual-pack/
  data/                    # JSON (émotions, dialogues, histoire, queue)
  disagrea/
    {etna,flonne,laharl,pleinair}/
      cutouts/             # 8 émotions × tenue L1 (v2)
      backgrounds/         # copies depuis assets/event-disagrea/backgrounds
      integrated/          # L6 intimité peak-plus
  village/
    {lyra,...}/
      cutouts/             # 8 émotions × tenue L1 (v2)
      chibi/               # 1 mascotte chibi détourée (v1)
```

## Style cutout v2

Verrouillé sur `assets/event-disagrea/integrated/companions/etna/companion-etna-affinity-01-scene-originale-v1.png`  
→ Voir `CUTOUT_STYLE.md`

## Scripts

```bash
node scripts/staging/setup-companion-visual-pack.mjs   # backgrounds + queue
node scripts/staging/copy-generated-visual.mjs <src> <dest-rel>
```

## Promotion vers prod (après validation)

```bash
npm run promote:companion-visual-pack
```

1. Cutouts émotion → `public/assets/companions/{id}/emotion-{emotion}.png` (détourés)
2. Chibis village → `public/assets/companions/{id}/chibi.png`
3. Scènes peak-plus (ex-L6) → `assets/event-disagrea/integrated/companions/{id}/companion-{id}-affinity-04-nsfw-scene-v1.png`
4. Fichiers non promus → `data/PROMOTION_LEFTOVERS.json`

Option **NSFW** : Paramètres → `nsfwContent` (désactivé par défaut).

## Backlog

- **Etna L5 tests** (`etna/tests/`) — à regénérer avec validation manuelle
