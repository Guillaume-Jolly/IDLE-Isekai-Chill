# TNR — statut checklists (2026-06-25)

Automatisé exécuté le 2026-06-25 :

| Check | Résultat |
|-------|----------|
| `npm run build` | OK |
| `npm run validate:link-corpus` | OK (7500) |
| `npm run tnr:baseline` | OK |
| `npm run lint` | FAIL — 8 erreurs pré-existantes |

## Checklists manuelles — à faire en session jeu (non exécutables par agent)

Les fichiers ci-dessous restent des **grilles QA humaines**. Cocher après une session dev stable :

- [`docs/MANUAL_TEST_REFUGE_HUNT_INVENTORY.md`](../../MANUAL_TEST_REFUGE_HUNT_INVENTORY.md)
- [`docs/MANUAL_TEST_LINK_CORPUS.md`](../../MANUAL_TEST_LINK_CORPUS.md)
- [`docs/MOBILE_UI_VALIDATION.md`](../../MOBILE_UI_VALIDATION.md)
- [`docs/TNR_NATURAL_PROGRESSION_0_10.md`](../../TNR_NATURAL_PROGRESSION_0_10.md)
- [`docs/TNR_EVENT_DISAGREA.md`](../../TNR_EVENT_DISAGREA.md)
- [`staging/playbooks/06-tnr-checklist.md`](../../../staging/playbooks/06-tnr-checklist.md)

## Nouveau depuis cette session (code)

- [ ] Conversation Liens : cutouts émotion changent par échange/réaction
- [ ] Fond de scène biome visible derrière le cutout
- [ ] Affinité 4/5 bed-batch en galerie dev
- [ ] VillageStoryPanel : hub mini-jeux → scènes débloquées par affinité
- [ ] Bouton « Histoire » onglet Liens → mini-jeux
- [ ] 4 nouveaux compagnons (brann, thorne, nyx, marin) portraits + Liens starter corpus
- [ ] Disagrea : 3 scènes interactives (Etna, Flonne×2, Laharl)

## Build overnight 2026-06-25

| Check | Résultat |
|-------|----------|
| `npm run build` | OK (après merge registry 18 chapitres) |
| Chapitres story shippés | 18 JSON + registry |

## Baseline repo

- `main` @ Assets 2.0 — semver `2.0.0`
- Prod stable : `npm run build:stable:prod` après push
