# Compagnons — Soutien systèmes MVP 11

> **Date :** 2026-06-26  
> **Branche (historique, mergée) :** `feature/myrion-worksite-mvp2` → `main` @ `v2.1.0.0`

## Objectif

Premier lien léger entre compagnons et systèmes du jeu : contexte, hints, recommandations — **sans bonus économique** et sans compagnon obligatoire.

## Config ajoutée

| Fichier | Rôle |
|---------|------|
| `src/data/companionSupport.ts` | Profils `systems`, `supportLine`, `roleLine` par compagnon |
| `src/components/CompanionGameplaySupport.tsx` | Badge fiche Liens |
| `src/components/minigames/WorksiteCompanionSupport.tsx` | Carte conseil Ferme lunaire |

## Systèmes associés

| ID | Label affiché |
|----|----------------|
| `moon-farm` | Ferme lunaire |
| `refuge` | Refuge |
| `hunt` | Chasse |
| `village` | Village |
| `gacha` | Gacha |
| `inventory` | Inventaire |
| `prestige` | Prestige astral |

Chaque compagnon : 1 à 3 systèmes. Exemples Ferme lunaire : Iris, Nami, Sora, Talia, Solene, Runa.

## Effets retenus

- **Hints** : phrase courte + rôle conseil
- **Badges** : « Compagnon conseillé » (hôte du mini-jeu) ou « Soutien du jour » (rotation journalière)
- **Fiche Liens** : ligne « Affinités gameplay : … »
- **Hub mini-jeux** : tooltip Chantier Myrion liste les compagnons liés

## Effets reportés

- Bonus chiffrés (+1 % à +3 %)
- Perks cumulables
- Obligation compagnon pour débloquer
- Intégration Refuge / Chasse / Gacha (hors hint data-only)
- Nouveaux assets / dialogues

## Risques d'équilibrage

- **Faible** : aucune modification production / économie
- Rotation « Soutien du jour » peut surprendre si mal lue — badge explicite
- Lore provisoire sur profils — à affiner sans casser les IDs

## Intégrations

| Zone | Statut |
|------|--------|
| Ferme lunaire (chantier) | Carte overlay scène |
| Onglet Liens (fiche) | Affinités gameplay |
| Hub mini-jeux | Tooltip Chantier Myrion |

## Checklist test

- [x] `npm run build` OK
- [ ] Ferme lunaire : carte conseil visible (Sora = compagnon conseillé)
- [ ] Liens : affinités gameplay sur fiches
- [ ] Hub : tooltip compagnons liés Chantier
- [ ] Mobile : carte repositionnée (bas scène)
- [ ] Console sans erreur
- [ ] Aucun bonus invisible

## Prochaine étape (MVP 12+)

- Hints contextuels Refuge / Chasse avec même config
- Bonus QoL optionnel +1 % plafonné si telemetry OK
- Lier affinité compagnon (niveau) au texte du conseil
