# Chapter Seed Pack — Emotion Cutouts

Updated: 2026-06-25 00:28 +02:00  
Derived from: corpus audit findings + v3 cutout emotions (8 states)

---

## Seed 1 — Lyra : La page qu'on ne partage qu'une fois

**Companion focus:** lyra  
**Premise:** Player finds Lyra annotating a forbidden marginalia in the library; she must decide if player is worth sharing the margin.  
**Affinity gate:** 3+  
**Scene beats:**
1. Neutral — Lyra caught mid-annotation, defensive (`emotion-neutral`)
2. Player sincere choice — she reads aloud a half-finished line (`emotion-shy`)
3. Player playful deflect — she snaps carnet shut (`emotion-annoyed`)
4. Trust branch — shared reading, shoulder almost touch (`emotion-romantic`)
5. Close — she bookmarks the page with player's name (`emotion-happy`)

**Required cutouts:** neutral, shy, annoyed, romantic, happy  
**Assets:** library BG, carnet prop optional  
**Production deps:** corpus R2/R3 companion lines; cutout swap in ConversationGame  
**Risks:** romantic too early if aff gate ignored  
**QA:** verify tone hints sincere→romantic arc

---

## Seed 2 — Maeve : La pièce qui ne vaut pas ce qu'elle coûte

**Companion focus:** maeve  
**Premise:** Maeve offers a trade that sounds fair but hides sentimental value — player must read the subtext.  
**Affinity gate:** 2+  
**Scene beats:**
1. Playful haggle opening (`playful`)
2. Player undervalues item — frost (`annoyed`)
3. Player sincere ask about origin — guard drops (`neutral`)
4. Reveal: gift from someone she won't name (`sad`)
5. Accept fair trade without exploiting — partnership (`happy`)

**Required cutouts:** playful, annoyed, neutral, sad, happy  
**Assets:** market lanterns BG  
**Risks:** sad cutout not yet used in corpus templates — new writing needed

---

## Seed 3 — Kael : Coulisses après la chute

**Companion focus:** kael  
**Premise:** After a failed minigame, Kael performs bravado backstage; player sees the rehearsal not the show.  
**Affinity gate:** 2+  
**Scene beats:**
1. Playful mask (`playful`)
2. Player calls out the act — surprise (`surprised`)
3. Sincere silence — slumped posture (`sad`)
4. Direct challenge to stop performing — vulnerability (`sincere`→ neutral)
5. Mutual promise to rehearse together (`happy`)

**Required cutouts:** playful, surprised, sad, neutral, happy  
**Ties to corpus:** mirrors lyra-aff3-042 minigame-fail topic with Kael voice

---

## Seed 4 — Asha : Garde basse, cristaux intacts

**Companion focus:** asha  
**Premise:** Crystal inventory dispute; Asha thinks player wants resource — actually wants her trust.  
**Affinity gate:** 1–3  
**Scene beats:**
1. Direct confrontation (`neutral` + guarded stance)
2. Player pushy — block (`annoyed`)
3. Player patient — crystal explanation (`sincere`)
4. Aff3+ — admits fear of village loss (`sad`)
5. Close — loyalty pledge (`happy`)

**Required cutouts:** neutral, annoyed, sad, happy  
**Disagrea note:** Asha also guest — keep village Asha voice separate from event pack

---

## Seed 5 — Zelie : Invitation au salon

**Companion focus:** zelie  
**Premise:** Formal invitation to private salon; etiquette test with romantic undertone at aff5.  
**Affinity gate:** 4+  
**Scene beats:**
1. Neutral courtesy (`neutral`)
2. Wrong register (too casual) — frost (`annoyed`)
3. Correct etiquette — warmth (`happy`)
4. Vulnerability — glove removal beat (`shy`)
5. Romantic close — not explicit (`romantic`)

**Required cutouts:** neutral, annoyed, happy, shy, romantic  
**QA:** SFW gacha bar

---

## Seed 6 — Multi-companion : Rumeur du campement (chain)

**Companion focus:** lyra → maeve → runa (3 linked seeds)  
**Premise:** Same rumour reaches three companions; player hears conflicting accounts.  
**Scene beats:** investigation arc across 3 conversations  
**Required cutouts:** surprised, annoyed, sincere per companion  
**Production deps:** shared lore bible entry; not single scenario  
**Risk:** scope creep — ship as 3 optional side stories

---

## Seed 7 — Cutout gallery tutorial

**Companion focus:** talia (explorer guides player)  
**Premise:** Meta-light tutorial where Talia explains emotion portraits in Liens minigame.  
**Scene beats:** showcase each of 8 emotions with one line  
**Required cutouts:** all 8 for talia (pending v3 promo)  
**Production deps:** B4 UI wiring + talia v3 complete  
**Priority:** after 152/152 cutouts

---

## Implementation notes

- Seeds are **draft** — no production corpus rewrite yet  
- Each seed = 1 future `ScenarioScript` or visual novel chapter outline  
- Pair with `emotion-cutout-usage-map.md` for runtime mapping  
- Prioritize seeds 1–3 (companions with v3 cutouts already promoted)

---

## Next seeds to draft (pass 2)

- Seren healer shy arc  
- Nami market playful chain  
- Iris oracle surprised prophecy beat  
- Disagrea event Etna/Flonne cross-promo (separate file when event live)
