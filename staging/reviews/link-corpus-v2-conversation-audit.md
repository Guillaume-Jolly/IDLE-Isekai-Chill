# Link Corpus V2 — Conversation Audit (granular)

Updated: 2026-06-25 00:25 +02:00  
Source read-only: `src/data/linkCorpusV2.json` (7500 scenarios, 15 companions)  
Reviewer: Cursor (staging-only autonomous pass)

---

## Scope inspected

| Companion | IDs sampled | Affinity tiers | Depth |
|-----------|-------------|----------------|-------|
| lyra | aff1-001, aff3-042, aff5-099 | 1, 3, 5 | Deep (3 full scenarios) |
| maeve | aff1-001 | 1 | Deep |
| kael | aff1-001 | 1 | Deep |
| talia | aff1-001 | 1 | Deep |
| zelie | aff5-050 | 5 | Deep |
| asha | aff1-001 (prior read) | 1 | Medium |
| All 15 | title + repetition stats | 1–5 | Quantitative sweep |

Corpus-wide automated pass: repeated lines, duplicate titles, structural patterns.

---

## lyra — aff1-001 « Visite imprévue — Ressource rare »

**Source:** `lyra-aff1-001`  
**Theme:** unexpected visit, rare resource, library setting  
**Voice consistency:** 6/10 — opening companion line fits scholar/carnet archetype; rounds 2–3 collapse into generic transitions.  
**Affinity progression:** N/A (aff 1 only in sample); tone hints `sincere,sincere,sincere` — no tonal arc within scenario.  
**Emotional beats:** R1 establishes setting + wariness; R2–R3 have **no unique companion dialogue** (only narrator transitions).  
**Repetition:** R2 uses corpus-wide line « Un silence s'installe… » (~1478×); R3 « Un Myrion passe au loin… » (~1520×).  
**Weak prompts:** R2/R3 prompts identical across entire corpus (« Quelle réponse respecte… », « Comment termines-tu… »).  
**Lore risks:** « bibliothèque » + « carnet » consistent with Lyra; OK.  
**Cutout opportunities:** R1 → `neutral` or `shy`; R2 → `sincere`; R3 → `happy` if bond improves — currently no runtime emotion display in ConversationGame.  
**Rewrite direction:** Keep R1 structure; write 2 companion-specific lines for R2/R3; vary transition text per companion.

---

## lyra — aff3-042 « Rumeur — Myrion lié »

**Theme:** failed minigame, Myrion rumour, library  
**Voice consistency:** 7/10 — « Ne réponds pas vite. Réponds juste. » is strong Lyra.  
**Affinity progression:** Title topic changes vs aff1; structure still 3-round template.  
**Emotional beats:** romantic hints in tone hints but R2–R3 remain generic.  
**Repetition:** Same transition pool; player choice texts shared with other companions.  
**Cutout opportunities:** `annoyed` at R1 (minigame fail), `sincere` R2, `romantic` R3.

---

## lyra — aff5-099 « Au revoir — Rumeur du campement »

**Theme:** camp rumour, intimate farewell  
**Voice consistency:** 8/10 on R1 companion line (« Reste encore… »).  
**Lore/continuity bug:** ctx[0] says « tu retrouves Lyra **à la bibliothèque** » twice in same sentence — location stacking error.  
**Affinity progression:** High-aff intimacy line appropriate; R2/R3 still template.  
**Cutout opportunities:** `romantic`, `shy`, `happy`.

---

## maeve — aff1-001

**Voice consistency:** 6/10 — market/coin imagery fits merchant vibe; opening « Tu as choisi un moment étrange… » is **shared template** with Talia, Asha, etc.  
**Distinctive trait:** « jauge ton silence comme une offre au marché » — good, keep.  
**Issue:** roundToneHints `playful,playful,playful` — no modulation; same as many aff1 scenarios regardless of topic.  
**Cutout opportunities:** `playful` R1, `annoyed` if player too direct, `happy` close.

---

## kael — aff1-001

**Voice consistency:** 7/10 — theatre/entrance bow imagery fits.  
**Distinctive:** « sourit trop vite pour qu'on croie qu'il est sûr de lui » — strong character tell.  
**Issue:** romantic tone hints on aff1 resource topic feel early for affinity 1.  
**Cutout opportunities:** `playful` R1, `sincere` R2, `surprised` if player direct.

---

## talia — aff1-001

**Voice consistency:** 6/10 — forest/map explorer setup OK.  
**Issue:** shares exact opening template with Maeve/Lyra variants; R2/R3 transitions only.  
**Cutout opportunities:** `neutral`, `happy`, `playful`.

---

## zelie — aff5-050 « Rumeur — Projet commun »

**Voice consistency:** 8/10 — guest duchess register (« salon des invités », gloves, refined smile).  
**Affinity progression:** High-aff line « Tu connais assez mes défenses… » appropriate for aff 5.  
**Issue:** R2/R3 still generic; romantic triple tone hints limit failure-state variety.  
**Cutout opportunities:** `romantic`, `shy`, `neutral`.

---

## Corpus-wide quantitative findings

| Issue | Scale | Severity |
|-------|-------|----------|
| Identical transition lines R2/R3 | ~1500 uses each across 7500 scenarios | **Blocking** for immersion |
| Shared player choice texts | 870–935 repeats per line | **Important** |
| Title prefix « Visite imprévue — » | 100 scenarios/companion/topic bucket | **Important** (monotony) |
| Opening « Tu as choisi un moment étrange… » | Many companions aff1 | **Important** |
| R2/R3 missing companion dialogue | ~majority of sampled scenarios | **Blocking** |
| Location duplication in ctx[0] | spotted lyra-aff5-099; likely more | **Polish** |
| roundToneHints homogenous (3× same) | common at aff1 | **Important** |
| Topic titles reused 5× per affinity band | by design (100 convs/topic) | OK if body varies — **body often does not** |

---

## Emotion / cutout linkage (preview)

Runtime `ConversationGame` does not yet swap `emotion-*.png` cutouts by round outcome. Corpus tones (`sincere`, `playful`, `direct`, `romantic`) map loosely to cutout emotions — see `staging/story/emotion-cutout-usage-map.md`.

---

## Recommended next production tasks (summary)

1. Regenerate or patch R2/R3 `context` with companion-specific lines (per companion voice bible).
2. Deduplicate transition pool — at least 10–15 variants per companion.
3. Vary player choice phrasing per companion (not shared library).
4. Fix location grammar bugs in ctx[0] generator.
5. Wire conversation UI to display `emotion-{id}.png` based on round tone / reaction sentiment.

---

## Review status

- **Deep-reviewed scenarios:** 8  
- **Companions with voice notes:** 6 (+ quantitative all 15)  
- **Remaining for pass 2:** seren, nami, iris, runa, solene, mira, noa, sora, elwen (aff 2–4 grids)
