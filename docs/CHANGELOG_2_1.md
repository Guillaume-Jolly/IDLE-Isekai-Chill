# Havre des Brumes 2.1 — Ferme lunaire étendue et liens compagnons

**Produit :** Havre des Brumes (IDLE Isekai Chill)  
**Semver :** 2.1.0  
**Branche (historique, mergée dans `main` v2.1.0.0) :** `feature/myrion-worksite-mvp2`  
**Date :** 2026-06-30

---

## 1. Nouvelles features majeures

- **Ferme lunaire complète** — hub de production Myrions avec tap, production passive et supervision.
- **15 biomes** — prairie de départ + 14 biomes extension débloquables par progression.
- **45 filons actifs** — 3 filons par biome, placement data-driven.
- **Assets backgrounds et filons** — visuels par biome, registry centralisé.
- **Mode surveillance** — vue compacte multi-biomes pour suivre la production.
- **Prestige LR** — éclats astraux et Faille astrale (ressource interne Ferme lunaire).
- **Conversations de lien** — 190 dialogues narratifs (19 compagnons × 5 paliers × 2).
- **Guidance globale** — « À faire maintenant » priorisée sur la boucle Myrions / Ferme lunaire.

---

## 2. Gameplay

- Progression biomes par seuils de production et ressources produites.
- Production clic + passive par filon ; assignation Myrions aux filons.
- Équilibrage centralisé (`myrionWorksiteBalance.ts`).
- Mapping ressources temporaire documenté (vivres / bois / minerais par biome starter).
- Soutien compagnon léger sur systèmes clés (Ferme lunaire, Chasse, Liens).

---

## 3. Compagnons / Liens

- **19 compagnons** jouables dans l’onglet Liens.
- **190 conversations de lien** — lecture gratuite par palier d’affinité.
- **5 paliers** — Découverte → Confiance → Complicité → Confidence → Lien profond.
- Distinction claire **Mini-jeu Parler** (session à choix, récompenses) vs **Conversations de lien** (onglet Liens).

---

## 4. UI / UX

- Onboarding **« Que faire maintenant »** — priorité Ferme lunaire, Chasse, assignation, Gacha, Liens.
- Hub mini-jeux clarifié — Ferme lunaire, Chasse aux Myrions, Refuge, Promenade Myrions.
- Terminologie harmonisée — **Myrions**, **Ferme lunaire** (plus « Chantier Myrion » / « Familiers » en UI joueur).
- Inventaire — note explicite : éclats astraux sur la Ferme lunaire, pas dans l’inventaire global.
- Améliorations mobile — drawer Biomes, surveillance, pas de scroll horizontal massif signalé en TNR 390 px.

---

## 5. Assets

- Backgrounds worksite par biome (MVP 9–15).
- Filons et composants visuels extension (MVP 15–16).
- Faille astrale / prestige LR.
- Registry : `src/data/myrionWorksiteAssetRegistry.ts` + manifest traceability.

---

## 6. Qualité

- Validations : `validate:companion-bonds`, `validate:link-corpus`, `tnr:baseline`, `build`.
- TNR release documenté : [`TNR_RELEASE_2_1_MVP20.md`](./TNR_RELEASE_2_1_MVP20.md).
- Corrections TNR MVP 20 :
  - « Refuge des Familiers » → **Promenade Myrions**
  - Inventaire : « sur le chantier » → **Ferme lunaire**

---

## 7. Réserves connues

| Réserve | Détail |
|---------|--------|
| Lint ESLint | 33 problèmes préexistants (non bloquants build) |
| TNR 45 filons preview prod | Validation complète nécessite save avancée ou `npm run dev` + flags dev |
| Dev unlock preview | `worksiteDevUnlock` / `worksitePlacementDebug` inactifs en build production |
| Asset `ruines-lierre-ancien.png` | Silhouette légère ; emoji fallback si chargement échoue |
| Chunk size | Warning Vite > 500 kB sur bundle principal |
| Corpus Parler B1–B3 | Relecture fine reportée post-2.1 |
| Wording quêtes | Libellés « Chantier du havre » encore présents dans objectifs onboarding |

---

## Références

- MVP worksite : `docs/MYRION_WORKSITE_MVP*.md`
- Consolidation gameplay : `docs/GLOBAL_GAMEPLAY_CONSOLIDATION_MVP18.md`
- Relecture contenu : `docs/CONTENT_REVIEW_MVP19.md`
- Index versions : `docs/traceability/changelog/VERSION-INDEX.md`
