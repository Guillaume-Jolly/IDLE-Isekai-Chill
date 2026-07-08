# Talia — Éclaireuse de la lisière

> **Statut :** fiche design · **panel Parler v1** · intégrée runtime  
> **ID :** `talia` · **Dynamic lien :** `mutual`

---

## En une phrase

Elle lit les pistes comme d’autres lisent les visages — et parie toujours que **tu suivras** sans poser vingt questions, parce que la forêt n’attend pas.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Talia |
| **Archétype jeu** | Éclaireuse / chasseuse lisière |
| **Lieu** | La lisière de la forêt (sentiers, traces, camp de fortune) |
| **Systèmes liés** | `moon-farm`, `hunt` |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| 7 | 7 | **8** | 4 | 4 |

**Stat primaire :** Vigueur

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| 6 | **9** | **8** | **4** |

**`personalityHint` :** Talia est rieuse et audacieuse — humour terrain, spontanéité, complicité **sans déclaration** ; romantic repoussé aff. 1–3.

---

## Personnalité

### Traits forts

- **Bluff et pari** — défis absurdes, revanche demain, « presque gagné ».
- **Franchise outdoor** — yes-no sec, pas de métaphores Iris.
- **Loyauté de piste** — protège ton dos en chasse ; complicité = silence partagé.

### Tics & voix

- « **Presque.** » / « **Revanche demain.** »
- Mâche une brindille quand elle réfléchit (aff. 2+).
- Romantic = rare rougeur + changement de sujet vers le filon.

### Contraste panel

| vs Seren | vs Laharl | vs Runa |
|----------|-----------|---------|
| Spontanée vs digne | Forêt vs overlord | Bruit vs atelier calme |

---

## Arc affinité (Parler)

| Aff. | Beat | Registre |
|------|------|----------|
| 1 | Première piste | Direct / playful |
| 2 | Camp sans fanfare | Sincere = confiance terrain |
| 3 | Défi absurde | Complicité rieuse |
| 4 | Abri sous roche | Proximité chaleur / froid — suggestif léger |
| 5 | Feu de camp seul | Crudité franche, pas poésie |

**`powerDynamic` :** `mutual` constant.

---

## Writer — Parler curé

- **Packs :** piste → camp → filon voisin → feu de camp.
- **Grille aff. 1–3 :** sincere ou direct selon échange ; playful +1 fréquent.
- **À éviter :** salon Zelie, labo Noa, dom Etna.

---

## Intégration code

Voir `profiles.ts` · `parlerProfiles.ts`.
