# Conversation V2 — Fix Backlog

Updated: 2026-06-25 00:26 +02:00  
Source findings: corpus audit + voice bible deltas

---

## Blocking

| ID | Scope | Task | Risk | Validation |
|----|-------|------|------|------------|
| B1 | All 7500 scenarios R2/R3 | Add companion-specific `context[2]` line per round (not only R1) | Large edit — script-assisted regen | Manual sample 5/companion + playtest |
| B2 | Transition pool ~15 lines | Replace corpus-wide transitions with companion-voice variants (min 8 per companion) | Generator change | grep repeat count → <50 per line |
| B3 | Player choices | De-duplicate choice `text` — currently 870+ repeats across companions | Import pipeline | validate-link-corpus + diff stats |
| B4 | ConversationGame UI | Wire `emotion-{emotion}.png` cutouts to round tone / reaction sentiment | Runtime code — **not staging** | Visual smoke Liens tab |

---

## Important

| ID | Scope | Task | Risk | Validation |
|----|-------|------|------|------------|
| I1 | aff1 openings | Remove shared « moment étrange » template | Medium | Voice bible check |
| I2 | roundToneHints | Enforce tonal arc (not 3× identical) per scenario design rules | Import script | Stats on hint diversity |
| I3 | ctx[0] locations | Fix double-location grammar (« retrouves X à la bibliothèque » ×2) | Generator QA | Lint script on ctx[0] |
| I4 | Title variety | Reduce « Visite imprévue — » prefix monotony | Content pass | User-facing variety review |
| I5 | Affinity 4–5 | Audit 9 remaining companions (seren…elwen) same as lyra pass | Time | Extend audit doc |
| I6 | Bundle size | Code-split `linkCorpusV2.json` (~39 Mo) | Architecture | build size check |

---

## Polish

| ID | Scope | Task | Risk | Validation |
|----|-------|------|------|------------|
| P1 | Reactions | Shorten repetitive « Asha accepte la nuance… » patterns | Low | Readability |
| P2 | Myrion mentions | Random Myrion name drops in transitions feel forced | Low | Lore review |
| P3 | Topic/scenario titles | Align title with actual topic noun in R1 | Low | Spot check 100 |
| P4 | Cutout v3 promos | After 152/152, smoke each companion emotion in gallery | Low | Browser |

---

## Suggested commit boundaries (future)

1. `docs(staging): corpus audit reports` — staging/ only  
2. `fix(corpus): transition dedup pass` — import regen  
3. `feat(conversation): emotion cutout display` — src/ + public assets  
4. `chore(corpus): voice-specific R2/R3 regen` — linkCorpusV2.json regen  

**Do not combine** corpus regen + runtime UI in one commit.

---

## Priority order for overnight staging (Cursor)

1. ✅ Audit + voice bible + backlog (this file)  
2. ✅ Emotion cutout usage map  
3. ✅ Chapter seed pack  
4. ⏳ Extend audit to 9 remaining companions (pass 2)  
5. ⏳ Asset taxonomy proposal  

---

## Out of scope tonight (per Codex protocol)

- Physical asset moves  
- `src/` edits unless user wakes and authorizes  
- Commits / push  
