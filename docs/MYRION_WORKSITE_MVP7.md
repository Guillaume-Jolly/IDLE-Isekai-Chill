# Chantier Myrion — MVP 7 Surveillance passive (mode compact intégré)

## Objectif

Permettre une **surveillance passive PC** de la Ferme lunaire sans popup externe, sans Electron, sans gestionnaire multi-fenêtres global.

Le joueur active un **mode surveillance** intégré : UI réduite, scène compacte, production inchangée.

## Choix technique

| Option | MVP 7 |
|--------|--------|
| Popup navigateur / PiP | Non |
| Electron | Non |
| PassiveWindowManager global | Non (documenté en Future) |
| **Mode surveillance intégré** | **Oui** |

## Fonctionnement

- Toggle **« Mode surveillance »** sur la scène (vue normale).
- Bouton **« Vue normale »** dans la barre de surveillance pour revenir.
- En surveillance :
  - rail latéral / drawers masqués ;
  - barre résumé : biome, auto biome/chantier, Myrions assignés, totaux vivres/bois/pierre, éclats astraux si Mine débloquée ;
  - sélecteur rapide de biome (emoji) ;
  - scène pleine largeur, filons cliquables ;
  - décor / chibis atténués (lisibilité).

## Anti double production

- **Un seul** `setInterval` (AUTO_TICK_MS = 1000) — inchangé depuis MVP 2.
- Le mode surveillance ne duplique **ni** timer, **ni** save, **ni** tick prestige.
- `computePrestigeGrant` et `computeWorksiteAutoGrant` partagent `lastAutoTickAt`.

## Persistance UI

- `localStorage` clé `idle-isekai-chill-worksite-monitoring` via `src/data/myrionWorksiteUi.ts`.
- Hors save gameplay (`myrionWorksite`).
- Réouverture du mini-jeu restaure le dernier mode choisi.

## Audio

- Ambiance biome : gain réduit en surveillance (`startWorksiteBiomeAmbience(..., { discrete: true })`).
- Pas de son auto sur production passive.
- Clic minage manuel : sons existants inchangés.

## Future — architecture multi-fenêtres (non codé)

À prévoir plus tard :

- `PassiveWindowManager` global
- Limite **4 fenêtres** passives simultanées
- Une instance par mini-jeu ouvert
- Focus si fenêtre déjà ouverte (pas de doublon)
- Production par **timestamp** anti-abus (offline long hors scope)

## Hors scope MVP 7

- Popup externe obligatoire
- Picture-in-Picture
- Electron / dépendance lourde
- Limite 4 fenêtres
- Offline long
- Refactor save global
- Nouvelle économie / changement taux production
- Nouveaux biomes / assets

## Checklist test

- [ ] Ouvrir Ferme lunaire
- [ ] Activer mode surveillance → UI compacte, pas de drawer
- [ ] Attendre ~3 s → production passive (totaux montent)
- [ ] Désactiver → vue normale, drawers OK
- [ ] Changer biome en surveillance → pas de double gain visible
- [ ] Faille astrale + LR : pas de double production prestige (même tick)
- [ ] Reload → mode surveillance restauré si activé avant
- [ ] Console sans erreur
- [ ] `npm run build` OK

## Référence MVP 6

Test LR assignation/reload prestige : **non fait faute de LR** en save de test (voir `MYRION_WORKSITE_MVP6.md`).
