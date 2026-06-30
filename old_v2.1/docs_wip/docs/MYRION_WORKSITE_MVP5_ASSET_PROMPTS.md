# Chantier Myrion — Prompts assets wide MVP 5

> **Date :** 2026-06-26  
> **Objectif :** remplacer les fonds 1536×1024 actuels par de vrais panoramas wide  
> **Format cible :** PNG IA, **2560×960** (recommandé) ou **1920×720** minimum

## État actuel (lot 4B)

| Fichier | Dimensions | Verdict MVP 5 |
|---------|------------|---------------|
| `backgrounds/prairie.png` | 1536×1024 | **Utilisable provisoirement** — CSS `object-position` + scale |
| `backgrounds/forest.png` | 1536×1024 | **Utilisable provisoirement** |
| `backgrounds/mine.png` | 1536×1024 | **Utilisable provisoirement** |

Les fonds actuels restent actifs (`available: true`). Les variantes wide remplaceront les fichiers **uniquement** si meilleures en jeu.

## Procédure de remplacement

1. Générer le PNG wide avec le prompt ci-dessous
2. Sauvegarder l’ancien : `backgrounds/variants/prairie-lot4b.png` (etc.)
3. Remplacer `backgrounds/prairie.png` (même nom pour éviter de toucher le code)
4. Vérifier mobile portrait + filons cliquables
5. Mettre à jour `MYRION_WORKSITE_ASSET_GENERATION_LOG.md`

---

## Prairie — `backgrounds/prairie.png`

```
wide panoramic background of a peaceful fantasy moon farm worksite prairie, soft green grass, gentle mist, small dirt paths, cozy village-adjacent atmosphere, three readable resource areas, subtle magical moonlight mixed with soft daylight, clean open layout for UI and clickable deposits, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism
```

**Cadrage :** horizon bas, tiers inférieur dégagé pour 3 filons, ciel doux en haut.

---

## Forêt — `backgrounds/forest.png`

```
wide panoramic background of a gentle fantasy forest moon farm worksite, soft trees, mossy ground, small clearings, readable open areas for three resource deposits, subtle sun rays through leaves, cozy magical atmosphere, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism
```

**Cadrage :** clairière centrale-basse, arbres sur les bords.

---

## Mine — `backgrounds/mine.png`

```
wide panoramic background of a calm fantasy mine moon farm worksite, shallow cave entrance, soft stone walls, wooden supports, lantern glow, readable open areas for three mineral deposits, safe cozy mining atmosphere, soft anime fantasy game background, matte soft rendering, polished 2D game art, mobile game friendly, no characters, no text, no logo, no watermark, no photorealism
```

**Cadrage :** paroi et sol visibles en bas, profondeur modérée, pas de noir pur.

---

## Spots — regénération si halo blanc

Format cible : PNG transparent, **1024×1024** (icône centrée, marge alpha).

Prompt générique spot :

```
single fantasy game resource deposit object for [NOM], soft anime fantasy style, matte soft rendering, centered composition, clean silhouette, transparent background, no text, no logo, no watermark, mobile game icon, cozy idle game asset
```

Post-traitement : `python scripts/worksite-remove-white-bg.py` (seuil 245).

---

## Icônes ressources — regénération

Format : **512×512** transparent, objet centré, lisible à 24px.

Exemple bois :

```
single fantasy game resource icon of wood logs, soft anime style, matte rendering, centered, clean silhouette, transparent background, no text, no logo, readable at small size
```
