# Fiches compagnons — design & intégration

Profils **writer** pour Parler curé, bonds et intégration future. Assets / `App.tsx` : voir checklist par fiche.

---

## Panel Parler v1 (validé 2026-07-04)

| ID | Nom | Axe | Dynamic | Registre aff. 1–3 | Fiche |
|----|-----|-----|---------|-------------------|-------|
| `lyra` | Lyra | Intellect | mutual → dom | Havre sobre | *(corpus en cours — pas de fiche séparée)* |
| `maeve` | Maeve | Marché / deal | invite | Négociation, romantic bas | [`MAEVE_PROFILE.md`](./MAEVE_PROFILE.md) |
| `noa` | Noa | Labo / chaos | mutual | Playful, prétexte technique | [`NOA_PROFILE.md`](./NOA_PROFILE.md) |
| `talia` | Talia | Forêt / pari | mutual | Bluff outdoor | [`TALIA_PROFILE.md`](./TALIA_PROFILE.md) |
| `runa` | Runa | Atelier / concret | mutual | Sincere, romantic minimal | [`RUNA_PROFILE.md`](./RUNA_PROFILE.md) |
| `etna` | Etna | Disgaea dom / bombe | dom | **Graveleux + BDSM tease** | [`ETNA_PROFILE.md`](./ETNA_PROFILE.md) |
| `laharl` | Laharl | Disgaea tsundere | mutual | **Graveleux compétitif** | [`LAHARL_PROFILE.md`](./LAHARL_PROFILE.md) |
| `roric` | Roric | Dom M protocole | dom | Havre BDSM sobre | [`RORIC_PROFILE.md`](./RORIC_PROFILE.md) |
| `finn` | Finn | Sub M permission | MC-led | Sincere / aftercare | [`FINN_PROFILE.md`](./FINN_PROFILE.md) |

**Hors panel v1 (lot 2) :** Seren, Iris, Zelie, Kael, Flonne, Pleinair, etc.

---

## Deux pipelines Parler

| Pipeline | Compagnons | Builder | Rubrique |
|----------|------------|---------|----------|
| **Havre** | Lyra, Maeve, Noa, Talia, Runa, Roric, Finn | JSON hand / `build-intimate-action-corpora` (aff. 4–5 Lyra) | `CURATED_EXCHANGE_RUBRIC.md` |
| **Disagrea** *(après base Havre solide)* | Etna, Laharl | `build-disagrea-parler-corpora.mjs` *(à créer)* | `CURATED_EXCHANGE_RUBRIC_DISAGREA.md` *(à créer)* |

Etna / Laharl : **graveleux + RP Disgaea dès aff. 1–3** (tease, MC réactif — surtout Etna « bombe ») ; acte complet aff. 4–5. Ne pas les forcer dans la grille Lyra sans adaptateur validateur.

---

## Statut intégration

| ID | `profiles.ts` | `parlerProfiles.ts` | Assets | `App.tsx` |
|----|---------------|---------------------|--------|-----------|
| lyra | oui | oui | oui | oui |
| maeve, noa, talia, runa | oui | oui | oui | oui |
| etna, laharl | oui | oui | Disagrea | event |
| roric, finn | oui | oui | **non** | **non** |

---

## Checklist intégration (nouveau compagnon)

1. Fiche `docs/traceability/companions/{ID}_PROFILE.md`
2. `src/data/conversations/profiles.ts` + `parlerProfiles.ts`
3. `companionStats.ts` · `companionSupport.ts` · `companion-bond-seeds.mjs`
4. `App.tsx` · assets `assets/Compagnons/{id}/`
5. Corpus Parler : JSON curated + validate + golden

Index doc agent : [`docs/DOC_AGENT_INDEX.md`](../../DOC_AGENT_INDEX.md).
