# Emotion Cutout Usage Map

Updated: 2026-06-25 00:27 +02:00  
Cutouts target: `public/assets/companions/{id}/emotion-{emotion}.png` (v3 promotion in progress)  
Corpus tones: `sincere`, `playful`, `direct`, `romantic` (not 1:1 with emotions)

---

## Tone → cutout mapping (recommended runtime)

| Corpus tone | Primary cutout | Secondary (reaction fail) | Notes |
|-------------|----------------|---------------------------|-------|
| sincere | neutral → happy | sad | Trust-building beats |
| playful | playful | annoyed | Teasing; avoid on heavy lore topics at low aff |
| direct | neutral | annoyed | Kael/Asha strong fit |
| romantic | romantic | shy | Gate behind aff ≥3 for most village companions |

---

## By conversation round type

| Round | Typical beat | Suggested cutout sequence |
|-------|--------------|---------------------------|
| R1 setup | Surprise / topic intro | neutral or surprised |
| R2 pressure | Intimacy or conflict test | sincere, annoyed, or shy |
| R3 close | Trust or soft landing | happy, romantic, or neutral |

Currently **ConversationGame does not swap cutouts** — static portrait. Backlog item B4.

---

## By companion (v3 promos status ~96/152)

| Companion | v3 public | Best cutout anchors per audit |
|-----------|-----------|-------------------------------|
| lyra | ✅ 8/8 | neutral (carnet), shy (aff1), romantic (aff5) |
| maeve | ✅ 8/8 | playful, happy, annoyed |
| kael | ✅ 8/8 | playful, romantic, surprised |
| nami | ✅ 8/8 | playful, happy, shy |
| seren | ✅ 8/8 | shy, sincere, romantic |
| iris | ✅ 8/8 | neutral, sad, romantic |
| runa | ✅ 8/8 | sincere, annoyed, happy |
| mira | ⏳ pending | neutral, playful |
| asha | ⏳ pending | annoyed, direct→neutral |
| elwen | ⏳ pending | sincere, happy |
| noa | ⏳ pending | shy, playful |
| sora | ⏳ pending | surprised, happy |
| solene | ⏳ pending | romantic, sad |
| talia | ⏳ pending | happy, playful |
| zelie | ⏳ pending | romantic, neutral |

Disagrea guests (etna, flonne, laharl, pleinair): separate cutout pipeline — not in Link Corpus V2 set.

---

## Scenario topic → emotion opportunities

| Topic bucket (title pattern) | Emotion beats |
|------------------------------|---------------|
| Ressource rare | neutral → sincere → happy |
| Myrion lié | surprised → sincere → playful |
| Cadeau préféré | happy → shy → romantic |
| Mini-jeu de lien | annoyed → playful → happy |
| Rumeur du campement | sad → sincere → romantic |
| Projet commun (aff5) | romantic → happy → romantic |

---

## Weak / missing pairings

| Issue | Recommendation |
|-------|----------------|
| romantic tone at aff1 | Use neutral/shy cutout until aff≥3 |
| R2/R3 no companion line | Cutout cannot reflect dialogue — fix corpus first |
| Same cutout entire 3-round game | Implement per-round swap on tone hint + outcome |
| sad underused in corpus | More aff2–3 failure branches → sad cutout |
| surprised rare in hints | Use for Myrion/rumour topics |

---

## Production dependency chain

1. Finish v3 cutout promotion (152/152)  
2. Implement cutout resolver in conversation/minigame UI  
3. Map `roundToneHints[i]` + choice outcome → emotion id  
4. QA 3 scenarios × 15 companions in browser  

---

## QA checklist (when runtime wired)

- [ ] aff1 sincere scenario shows neutral, not romantic  
- [ ] failed playful choice shows annoyed or neutral downgrade  
- [ ] high-aff romantic scenario shows romantic cutout on R3  
- [ ] no wrong companion identity (v3 anchor per companion)  
- [ ] mobile Liens tab layout with 9:16 cutout  
