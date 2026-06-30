# 10 — QA visuelle & TNR normalisé

Liste **normalisée** des checks — compléter au fur et à mesure.  
Automatique : [`06-tnr-checklist.md`](./06-tnr-checklist.md) + `npm run tnr:baseline`.

---

## Commande baseline

```bash
npm run validate:companion-bonds
npm run validate:link-corpus
npm run tnr:baseline    # bonds + corpus + build + manifest
npm run build
npm run lint            # optionnel — ~33 erreurs préexistantes connues
```

---

## Core — chaque session significative (5–10 min)

| ID | Zone | Action | OK |
|----|------|--------|-----|
| C1 | Boot | Accueil charge, version UI visible haut-gauche | ☐ |
| C2 | Village | Panorama / map labels sans crash | ☐ |
| C3 | Ressources | Compteurs strip visibles | ☐ |
| C4 | Liens | Conversation Lyra aff1 — texte + portrait | ☐ |
| C5 | Chasse | Biome `prairie-solaire` — fond + 1 Myrion cutout | ☐ |
| C6 | Dressage | Enclos — 1 chibi visible | ☐ |
| C7 | Gacha | UI ouvre — bannière event si actif | ☐ |
| C8 | Inventaire | Ouvrir panel — icônes ressources | ☐ |

---

## Assets — après promote / migration / archive

| ID | Check | Comment |
|----|-------|---------|
| A1 | **404 PNG/WebP** | DevTools Network, filtrer `png` |
| A2 | Compagnon `talia` | aff 1–3 layered portrait |
| A3 | Compagnon test village | `lyra` emotion-neutral si cutouts promus |
| A4 | Myrion | `moussprout` cutout + chibi dressage |
| A5 | Biome fond | capture + dressage même biome |
| A6 | Gacha cinéma | frames event si touché |
| A7 | Talia guide | overlay chasse si guides touchés |
| A8 | Legacy URL | `/companions/` rewrite (vieux bookmark) |
| A9 | Disagrea event | D1–D4 ci-dessous si event actif |

---

## Disagrea event (si scope)

| ID | Check |
|----|-------|
| D1 | Bannière event accueil |
| D2 | Portraits guests etna/flonne/laharl/pleinair |
| D3 | Capture biome `disagrea-event` |
| D4 | Chibi dressage Disagrea |

Doc : `docs/TNR_EVENT_DISAGREA.md`

---

## Biomes — après playbook 09 / 11

| ID | Check |
|----|-------|
| B1 | Nouveau biomeId sur carte chasse |
| B2 | Wide + portrait capture |
| B3 | Wide + portrait dressage |
| B4 | Gradient fallback si image fail |
| B5 | Unlock progression cohérent (`biomeProgression.ts`) |

---

## Compagnon — après playbook 01

| ID | Check |
|----|-------|
| P1 | Galerie dev — tous assets ID |
| P2 | Portrait layered aff 1–5 |
| P3 | 8 emotions en galerie (si promus) |
| P4 | Chibi dressage/refuge |
| P5 | Conversation aff1 corpus V2 |
| P6 | Fragment gacha icon si pool |

Route dev : Companion Visual Dev Gallery.

---

## Gacha event — après playbook 02

| ID | Check |
|----|-------|
| G1 | Bannière + dates |
| G2 | Cinéma 10 frames sans 404 |
| G3 | 10 pulls simulés — rates plausibles |
| G4 | Pity / featured si implémenté |
| G5 | Pas régression gacha village |

---

## Prod stable — après playbook 07

| ID | Check |
|----|-------|
| S1 | Launcher démarre |
| S2 | Build prod ≠ dev-only flags |
| S3 | Save load OK |
| S4 | Dashboard 8789 |

---

## Code grep — régression silencieuse

```bash
rg "public/assets" src --glob "*.{ts,tsx}"
rg "public/companions" src --glob "*.{ts,tsx}"
```

Hits autorisés : commentaires, dev explorer, prompt strings — **pas** URLs runtime HTTP.

---

## Rapport

Template : `docs/traceability/tnr/tnr-YYYY-MM-DD.md`  
Entrée micro : `docs/traceability/changelog/entries/`

---

## Ajouter un check

Quand un bug visuel est trouvé en prod → ajouter une ligne ici avec ID permanent pour ne plus oublier.
