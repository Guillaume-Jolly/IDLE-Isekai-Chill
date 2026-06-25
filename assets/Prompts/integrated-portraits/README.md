# Portraits intégrés — pipeline global

Scènes **100 % originales** (personnage + décor peints ensemble).  
Style : **Talia** (`public/assets/companions/talia/affinity-1.png`) = ancre de rendu uniquement.

Prompts : `src/data/integratedPortraitPrompts.ts`

## Périmètre

| Pack | Compagnons | Niveaux | Total | Statut |
|------|------------|---------|-------|--------|
| **Event Disagrea** | 4 | 1–5 | 20 | Validé `scene-originale-v1` |
| **Village** | 15 | 1–5 | 75 | À produire |

**Exceptions :**
- **Etna L5** — variante finale custom (lit, impatiente)
- **Pleinair L2–5** — backlog `docs/BACKLOG.md` (enfant → proximité parentale)

## Règles

1. Pas de collage — une seule illustration peinte
2. Pas de ref visuelle des anciens `affinity-*.png`
3. Disagrea — même tenue L1→5
4. Blocage IA — relancer en `soft`

## Dossiers

```text
assets/event-disagrea/integrated/companions/<id>/   # Disagrea
assets/integrated-portraits/village/<id>/           # Village staging
public/assets/companions/<id>/affinity-<n>.png      # Cible jeu
```

## Lots recommandés

1. Village L1 × 15
2. Village L2–3 × 15
3. Village L4–5 × 15 (soft si refus)
4. Disagrea L5 custom Flonne + Laharl (optionnel)
5. Pleinair L2–5 repensé (backlog)

Export jobs : `node scripts/export-integrated-portrait-prompts.mjs village`
