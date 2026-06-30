# Conversations de liens compagnons — MVP 17

Base data-driven pour les échanges relationnels dans l’onglet **Liens** (Havre des Brumes).

## Format data

Fichiers :

| Fichier | Rôle |
|---------|------|
| `scripts/companion-bond-seeds.mjs` | Source éditoriale (graines par compagnon / palier) |
| `scripts/generate-companion-bond-catalog.mjs` | Génère le catalogue TypeScript |
| `src/data/companionBondCatalog.generated.ts` | Catalogue auto-généré (ne pas éditer à la main) |
| `src/data/companionBondConversations.ts` | Types, labels, helpers |

Chaque entrée `CompanionBondConversation` :

- `companionId` — ID compagnon existant
- `affinityTier` — 1 à 5
- `conversationId` — ex. `lyra_t1_c01`
- `prompt` — question du joueur
- `companionReply` — réponse du compagnon
- `tone` — `sincere` \| `playful` \| `direct` \| `romantic`
- `relatedSystems` — optionnel, aligné sur `companionSupport.ts`
- `tags` — mots-clés courts
- `intimacyLevel` — égal au palier
- `repeatable` — réversible ou unique
- `unlockHint` — optionnel (paliers > 1)

## Volume MVP 17

- **19 compagnons** (liste `COMPANION_BOND_IDS`)
- **5 paliers** d’affinité par compagnon
- **2 conversations** par palier
- **190 conversations** au total

Paliers :

| Niveau | Label | Ton attendu |
|--------|-------|-------------|
| 1 | Découverte | Présentation douce, Havre, goûts simples |
| 2 | Confiance | Habitudes, systèmes du jeu, début de complicité |
| 3 | Complicité | Souvenirs, humour, activités communes |
| 4 | Confidence | Doutes légers, attachement au Havre, vulnérabilité modérée |
| 5 | Lien profond | Confiance forte, appartenance, intimité émotionnelle non explicite |

## Règles anti-incohérence

Éviter :

- Répliques hors contexte (météo, mer, événements absents)
- Contradictions avec le rôle du compagnon
- Copier-coller identique entre compagnons
- Ton trop moderne ou sexualisation
- Bonus chiffrés compagnon

Autorisé :

- Havre des Brumes, Ferme lunaire, Refuge, Chasse, Village, Gacha, Inventaire, Prestige (avec prudence)
- Humour léger, progression émotionnelle douce

Validation : `npm run validate:companion-bonds`

Contrôles :

- `companionId` valide
- paliers 1–5 présents par compagnon
- `relatedSystems` connus
- champs obligatoires non vides
- volume minimum (≥ 1 conv. / palier / compagnon)
- termes bannis simples (mer, pluie, contenu explicite, etc.)

## Intégration UI

- Onglet **Liens** (`App.tsx`, vue `companions`)
- Composant `CompanionBondPanel` sous chaque carte compagnon
- Déverrouillage selon `game.companions[id].affinity` (1–5)
- Clic sur une question → affichage de la réponse
- Paliers verrouillés : hint + libellé « Verrouillé »
- Le mini-jeu **Parler** (3 rounds) reste inchangé pour les 15 compagnons concernés

## Commandes

```bash
npm run generate:companion-bonds   # régénère le catalogue depuis les graines
npm run validate:companion-bonds   # validation anti-incohérence
npm run build
```

## Limites connues

- Pas de persistance « lu / non lu » en sauvegarde (état UI session)
- Pas de récompense économique liée aux conversations bond
- 4 invités Disagrea (etna, flonne, laharl, pleinair) : pas de bouton « Parler » minigame, mais conversations bond disponibles
- Contenu mature des scènes d’affinité 4–5 inchangé (placeholders existants)

## Extension future

1. Ajouter des graines dans `companion-bond-seeds.mjs` (objectif long terme : plus de variantes par palier)
2. `npm run generate:companion-bonds`
3. `npm run validate:companion-bonds`
4. Option : persistance des conversations vues dans la save joueur
5. Option : filtrage par `relatedSystems` ou tags en UI

## Prochaine étape

**MVP 18** — consolidation gameplay global (boucles, cohérence inter-systèmes, polish).
