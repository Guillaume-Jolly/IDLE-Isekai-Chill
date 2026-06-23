# Backlog — idées d'amélioration

Liste informelle d'idées à explorer **plus tard**. Rien ici n'est planifié ni priorisé :
on note pour ne pas oublier, on trie quand on voudra en faire une vraie feature.

Pour le travail en cours et les tâches priorisées, voir aussi
[`TODO_PRIORITIZED.md`](./TODO_PRIORITIZED.md).

---

## Comment ajouter une entrée

Copier le bloc modèle en bas de fichier, remplir, laisser le statut à `idée`.

---

## Idées mini-jeux / modes de jeu

### Top War–like — plateformes aléatoires

**Statut :** idée  
**Inspiration :** Top War (exploration / choix de rencontres)

**Pitch :** le joueur avance sur une plateforme. En avançant, il tombe au hasard
sur d'autres plateformes qui proposent soit une amélioration, soit un combat.
À chaque rencontre : **explorer oui / non** (passer son chemin).

**Pistes de design :**

- Carte ou lane horizontale / verticale simple.
- Types de plateformes : buff, ressource, combat obligatoire si accepté, shop, événement rare.
- Boucle : avancer → choix → conséquence → avancer.
- Lien possible avec le village (renom, ressources, tickets) ou mode autonome type « run ».

**Questions ouvertes :**

- Persistance entre sessions ou run roguelite ?
- Lien avec un compagnon guide (Talia exploratrice ?) ?
- Énergie / limite de runs par jour ?

---

### Capybara Go–like — aventure RP

**Statut :** idée  
**Inspiration :** Capybara Go (aventure narrative légère)

**Pitch :** mode aventure **RP** : le joueur progresse dans une histoire avec
choix, rencontres, récompenses et montée de stats / compagnons / Myrions.
Ton cozy, sessions courtes, peu de punition.

**Pistes de design :**

- Chapitres ou « jours » d'aventure avec événements aléatoires pondérés.
- Choix de dialogue + conséquences légères (ressources, affinité, objet).
- Carte du monde simplifiée (biomes du refuge ? villages ?).
- Réutiliser le système de tons des conversations Liens (`sincere`, `playful`, etc.).

**Questions ouvertes :**

- Héros = joueur seul ou compagnon + Myrion lié ?
- Idle entre deux étapes ou 100 % actif ?
- Lien avec la chasse / le refuge existants ?

---

### War Thunder–like — tir latéral + vagues + évolution

**Statut :** idée  
**Inspiration :** War Thunder (action) + variante **évolution** (type idle evolution)

**Pitch :** déplacement **gauche / droite**, tir **tout droit** (shoot'em up horizontal
simplifié). Entre les vagues, choix exclusif (ou prioritaire) :

1. **Reculer la vague** — repousser / retarder l'assaut ennemi.
2. **Améliorer les armes** — dégâts, cadence, portée.
3. **Améliorer les unités** — vie, vitesse, nombre.

**Variante évolution (aimée) :** ligne d'évolution visuelle et ludique, par exemple :

`poisson → crocodile → dragon → capybara` (ou autres lignées par biome / compagnon)

Chaque palier change le sprite et les stats ; le capybara (ou forme finale) =
payoff humoristique / cozy aligné avec le ton du jeu.

**Pistes de design :**

- Vagues courtes, mobile-friendly (touch gauche/droite + bouton tir auto optionnel).
- Boss tous les N cycles ; récompenses village (bois, pierre, cristaux).
- Compagnon associé possible : Runa (forge / armes), Kael (théâtre / spectacle de bataille).

**Questions ouvertes :**

- Vue pure arcade ou intégrée à un bâtiment (théâtre, forge, ferme) ?
- Coop idle (unités continuent hors écran) ou session fermée ?
- Plusieurs lignées d'évolution (une par biome Myrion) ?

---

## Autres idées (template)

<!--
### [Titre court]

**Statut :** idée | à affiner | maybe | abandonné
**Inspiration :** …

**Pitch :** …

**Pistes :** …

**Questions :** …
-->

---

## Modèle pour nouvelle entrée

```markdown
### [Titre]

**Statut :** idée
**Inspiration :** …

**Pitch :** …

**Pistes de design :** …

**Questions ouvertes :** …
```
