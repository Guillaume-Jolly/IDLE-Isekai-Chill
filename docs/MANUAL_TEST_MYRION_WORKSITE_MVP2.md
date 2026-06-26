# Checklist — tests manuels Chantier Myrion MVP 2

## Prérequis

- Avoir au moins 2 Myrions capturés (chasse).
- Ouvrir le bâtiment Chantier Myrion depuis le hub.

## Navigation biomes

- [ ] Drawer « Biomes » en première section.
- [ ] Les 3 biomes listés : Prairie, Forêt, Mine.
- [ ] Biome actif surligné ; badge « Supervision +15% » sur le panneau principal.
- [ ] Changer de biome met à jour titre, panorama (couleur), markers de spots.
- [ ] Drawer « Spots » ne montre que les spots du biome actif.

## Spots et assignation

- [ ] Prairie : bosquet / pierrier / champs.
- [ ] Forêt : sous-bois / clairiere-herbes / source-claire.
- [ ] Mine : pierrier-profond / veine-brute / charbonniere.
- [ ] Assigner un Myrion sur un spot ; impossible sur deux spots (message « Ailleurs »).
- [ ] Retirer un Myrion fonctionne.

## Production passive multi-biomes

- [ ] Assigner des Myrions sur des spots dans **deux biomes différents**.
- [ ] Rester sur un biome ; attendre ~5 s : les deux biomes produisent (totaux ressources augmentent).
- [ ] Spot du biome **affiché** produit ~15 % de plus qu’un spot identique hors biome actif (supervision).

## Clic

- [ ] Clic n’affecte que le spot sélectionné du biome actif.
- [ ] Changer de spot ou de biome change la ressource du bouton Collecter.

## Sauvegarde / migration

- [ ] Partir d’une save MVP 1 (si disponible) : prairie conservée, assignations migrées.
- [ ] Fermer / rouvrir le chantier : biomes, spots, assignations persistés.

## Mobile (≤767px)

- [ ] Drawer fermé par défaut au chargement.
- [ ] FAB ouvre le menu ; biomes accessibles.

## Aide

- [ ] Texte aide MVP 2 présent (passif tous biomes, supervision biome affiché, clic faible).

## Régression

- [ ] `npm run build` OK.
- [ ] Pas de double production visible au changement d’onglet rapide.
