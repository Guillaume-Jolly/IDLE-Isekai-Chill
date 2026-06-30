# Release notes — Havre des Brumes 2.1

**Date :** 2026-06-30  
**Version :** 2.1.0

---

## Résumé

Havre des Brumes 2.1 livre la **Ferme lunaire** comme pilier de progression idle : 15 biomes, 45 filons, production douce, prestige LR, et un filet de **conversations de lien** pour les 19 compagnons. La guidance et la terminologie ont été harmonisées pour une boucle claire : Village → Chasse → Refuge → Ferme lunaire → Liens.

---

## Ce qui change pour le joueur

- **Ferme lunaire** remplace l’ancien « chantier » dans l’interface : assignez vos Myrions, tapez les filons, débloquez de nouveaux biomes.
- **15 biomes** à explorer progressivement ; mode **surveillance** pour suivre plusieurs zones.
- **Chasse aux Myrions** et **Refuge des Myrions** — terminologie unifiée ; **Promenade Myrions** pour l’enclos Sora (ex-« Refuge des Familiers »).
- **Onglet Liens** — 19 compagnons, conversations de lien gratuites par palier d’affinité.
- **Mini-jeu Parler** — distinct des conversations de lien : session courte à choix avec récompenses.
- **« À faire maintenant »** — indique la prochaine étape utile (Ferme lunaire, capture, assignation…).
- **Inventaire** — les éclats astraux du prestige restent sur la Ferme lunaire, pas dans l’inventaire global.

---

## Ce qui change côté dev

- Semver `package.json` : **2.1.0**
- Scripts de validation : `validate:companion-bonds`, `validate:link-corpus`, `tnr:baseline`
- Catalogues générés : `companionBondCatalog.generated.ts`
- Registry assets worksite + manifest traceability
- Règles agent : `.cursor/rules/00-idle-isekai-core.mdc` (Havre des Brumes, pas Wonderland)

---

## Réserves connues

- ESLint non vert (33 issues préexistantes) — n’empêche pas le build.
- Flags dev Ferme lunaire (`worksiteDevUnlock`) réservés au mode `npm run dev`.
- Asset `ruines-lierre-ancien.png` à surveiller visuellement.
- Bundle JS volumineux — optimisation reportée.

---

## Validation effectuée

| Check | Résultat |
|-------|----------|
| `validate:companion-bonds` | OK |
| `validate:link-corpus` | OK |
| `tnr:baseline` | OK |
| `build` | OK |
| TNR MVP 20 | Ready avec réserves — voir [`TNR_RELEASE_2_1_MVP20.md`](./TNR_RELEASE_2_1_MVP20.md) |

---

## Liens

- Changelog détaillé : [`CHANGELOG_2_1.md`](./CHANGELOG_2_1.md)
- Rapport livraison : [`RELEASE_2_1_DELIVERY_REPORT.md`](./RELEASE_2_1_DELIVERY_REPORT.md)
