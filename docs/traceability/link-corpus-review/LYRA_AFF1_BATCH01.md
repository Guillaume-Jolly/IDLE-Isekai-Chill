# Lyra — affinité 1 — lot 01 (audit)

**Date :** 2026-07-01  
**Profil :** réservée, intellectuelle — `toneWeights`: sincere > direct > romantic > playful  
**Périmètre :** 100 scénarios (`minAffinity` 1, palier découverte)

## Audit automatique

```bash
node scripts/audit-link-corpus-tone.mjs lyra --affinity 1 --limit 20
node scripts/audit-link-corpus-tone.mjs lyra --limit 15
```

| Check | Résultat |
|-------|----------|
| Scénarios palier 1 | 100 |
| Scénarios Lyra total | 500 |
| Bonne réponse hors top-2 tons (sincere/direct) | **0** |
| `validate:link-corpus` | OK |

## Relecture humaine (prochaine passe)

Échantillon à lire à l’œil (10 ids palier 1) :

- `lyra-aff1-001` — Visite imprévue — Ressource rare
- `lyra-aff1-002` — Visite imprévue — Myrion lié
- `lyra-aff1-003` — Visite imprévue — Cadeau préféré
- `lyra-aff1-004` — Visite imprévue — Biome familier
- `lyra-aff1-005` — Visite imprévue — Lieu du village
- `lyra-aff1-006` — Visite imprévue — Mini-jeu de lien
- `lyra-aff1-007` — Visite imprévue — Faveur de chasse
- `lyra-aff1-008` — Visite imprévue — Œuf Écho
- `lyra-aff1-009` — Visite imprévue — Rumeur du campement
- `lyra-aff1-010` — Visite imprévue — Projet commun

## Corrections appliquées

_Aucune dans ce lot — audit structurel + tons OK._

## Suite

- Lot 02 : relecture humaine 10 scénarios + corrections ciblées si besoin
- Puis Lyra affinité 2, ou passage Maeve
