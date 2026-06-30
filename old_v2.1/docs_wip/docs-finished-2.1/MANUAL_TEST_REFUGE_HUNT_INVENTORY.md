# Checklist test manuel — Refuge / Chasse / Inventaire

> Dernière mise à jour : 2026-06-23  
> À exécuter après `npm run dev -- --host 0.0.0.0` — desktop + téléphone (URL réseau).

## A. Démarrage

- [ ] `npm run dev -- --host 0.0.0.0` démarre sans erreur
- [ ] Desktop : page charge, pas d'écran blanc
- [ ] Mobile (URL réseau) : page charge
- [ ] Reload conserve l'état localStorage

## B. Shell mobile

- [ ] Menu fermé par défaut en mini-jeu
- [ ] Bouton menu visible (village)
- [ ] Drawer ouvre / ferme
- [ ] Ressources lisibles (flyout)
- [ ] Navigation : Village, Bâtiments, Quêtes, Mini-jeux, Event, Inventaire, Compagnons, Outils
- [ ] Pas de rail permanent en mini-jeu mobile
- [ ] Pas de scroll horizontal parasite

## C. Village

- [ ] Village plein écran mobile
- [ ] Labels bâtiments lisibles
- [ ] Collecter ressource
- [ ] Améliorer un bâtiment
- [ ] Ressources mises à jour
- [ ] Reload conserve état

## D. Chasse

- [ ] Ouvrir mini-jeu chasse
- [ ] Carte des biomes visible
- [ ] Biome débloqué cliquable
- [ ] Biome verrouillé : condition affichée
- [ ] Lancer capture
- [ ] HUD mobile lisible (grille 2×2)
- [ ] Bouton Capturer utilisable
- [ ] Résultat capture affiché
- [ ] Politique capture (panneau)
- [ ] Captures en attente (si applicable)
- [ ] Relancer rencontre
- [ ] Fermer mini-jeu
- [ ] Reload conserve captures / stats

## E. Refuge / Dressage

- [ ] Ouvrir refuge
- [ ] Fond enclos adapté (portrait mobile / paysage desktop)
- [ ] Menu biomes (miniatures)
- [ ] Onglet Récapitulatif
- [ ] Clic chibi → soins
- [ ] PC : panneau Soins dans le rail (pas de popup)
- [ ] Mobile : popover soins compact
- [ ] Action soin (nourrir / câliner / jouer / observer)
- [ ] Animation réaction chibi
- [ ] Navigation Enclos ‹ › (espèces)
- [ ] Navigation Exemplaire ‹ › (doublons)
- [ ] Relâcher : double validation
- [ ] Debug Myrion : chasse uniquement (mode dev), absent du refuge
- [ ] Reload conserve état pets / ressources refuge

## F. Inventaire

- [ ] Onglet Inventaire accessible
- [ ] Section Familiers : sous-groupes par biome
- [ ] Doublons regroupés par espèce (badge quantité)
- [ ] Tri : biome → rareté (LR→N) → nom
- [ ] Chibis 26×26 visibles
- [ ] Pas de milliers de puces individuelles
- [ ] Performances acceptables avec gros stock

## G. Régressions

- [ ] Compagnons / Liens accessibles
- [ ] Gacha accessible
- [ ] Mini-jeu Lien accessible
- [ ] Ressources cohérentes entre vues
- [ ] Pas d'erreur console critique
- [ ] Pas de « Maximum update depth exceeded »

## Résultat session 2026-06-23

| Zone | Desktop | Mobile | Notes |
|------|---------|--------|-------|
| Build/lint | ✅ | — | `npm run build` + `npm run lint` OK |
| Tests manuels | ⏸ | ⏸ | Non exécutés automatiquement — checklist à remplir |
