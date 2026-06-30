# TNR — Event Disagrea (assets + câblage)

Checklist pour validation manuelle après import `npm run import:disagrea`.

## Automatisé (OK si build passe)

- [x] `npm run import:disagrea` — 102 fichiers, 0 manquant
- [x] `npm run validate:link-corpus` — OK
- [ ] `npm run build` — **bloqué** par erreur préexistante `affinityArtwork` dans `ConversationGame.tsx` (hors scope Disagrea)
- [ ] `npm run lint` — 1 erreur préexistante + warnings hooks (hors scope Disagrea)

## Assets importés — chemins runtime

### Compagnons (×4 : etna, flonne, laharl, pleinair)

| Type | Chemin | Mapping |
|------|--------|---------|
| Cutout L1–5 | `public/assets/companions/<id>/cutout-<n>.png` | Détourage #CFCFCF appliqué |
| Background L1–3 | `.../background-<n>.png` | Mobile portrait, groupe affinité 01–03 |
| Background L4–5 | `.../background-<n>.png` | Mobile portrait, groupe affinité 04–05 |
| Background wide | `.../background-<n>-wide.png` | PC paysage, même groupes |
| Chibi | `.../chibi.png` | Miniature inventaire |

### Myrions event (×17 dont chimerelle LR)

| Type | Chemin |
|------|--------|
| Cutout chasse | `public/assets/minigames/capture/myrions/cutout/<id>.png` |
| Chibi dressage | `public/assets/minigames/dressage/myrions/chibi/<id>.png` |

### Fonds mini-jeux event

| Scène | Mobile (portrait) | PC (wide) |
|-------|-------------------|-----------|
| Chasse | `capture/biomes/disagrea-event-portrait.png` | `capture/biomes/disagrea-event.png` |
| Dressage | `dressage/enclosures/disagrea-event-portrait.png` | `dressage/enclosures/disagrea-event.png` |

## Validation manuelle in-game (demain)

### Portraits compagnons (nécessite compagnons branchés en data gameplay)

1. Ouvrir galerie / fiche compagnon event (quand IDs `etna|flonne|laharl|pleinair` seront débloquables).
2. Vérifier mode **layered** : cutout + background superposés (pas de halo gris #CFCFCF).
3. Palier 1–3 vs 4–5 : changement de décor (01–03 vs chambre intime 04–05).
4. **Mobile** (≤767px) : fond portrait ; **Desktop** : fond `-wide` si présent.
5. Chibi en miniature inventaire (`COMPANIONS_WITH_CHIBI`).

### Myrions (nécessite entrée catalogue + event actif)

1. Chasse : cutout event visible (pas silhouette fallback) pour espèces Disagrea.
2. Dressage : chibi event dans l'enclos.
3. Chimerelle LR : cutout + chibi fusion 4 univers.

### Mini-jeux event (nécessite câblage biome `disagrea-event`)

1. Chasse : fond `disagrea-event` / `-portrait` selon viewport.
2. Dressage : enclos event idem.

## Non testé automatiquement

- Intégration gacha / économie event
- `myrionsCatalog.generated.ts` — espèces Disagrea **non** ajoutées (pas de changement gameplay)
- Silhouettes chasse pour myrions event (non générées par l'import)
- Références IA staging `assets/event-disagrea/generated/` (reste source re-import)

## Re-import

```bash
npm run import:disagrea
```

Sources : `assets/event-disagrea/generated/` + `assets/event-disagrea/backgrounds/`.
