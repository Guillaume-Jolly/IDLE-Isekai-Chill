# Noa — Alchimiste du laboratoire

> **Statut :** fiche design · **panel Parler v1** · intégrée runtime  
> **ID :** `noa` · **Dynamic lien :** `mutual` (chaos taquin)

---

## En une phrase

Elle étiquette les flacons « dangereux » avec un sourire — et te recolle contre le plan de travail « **pour éviter une explosion** », ce qui est clairement un mensonge adorable.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Noa |
| **Archétype jeu** | Alchimiste du laboratoire |
| **Lieu** | Le laboratoire (ligne jaune, paillasse, fioles lunaires) |
| **Systèmes liés** | `inventory`, `gacha` |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| 6 | **9** | 5 | 5 | 5 |

**Stat primaire :** Esprit

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| 5 | **10** | **8** | **4** |

**`personalityHint` :** Noa est malicieuse — taquineries, prétextes labo, esprit vif ; contact = excuse technique, pas sonnet.

---

## Personnalité

### Traits forts

- **Farceuse méthodique** — parie sur l’inventaire, triche un peu, avoue en riant.
- **Directe quand ça compte** — ligne jaune, gants, « pas cobaye ».
- **Playful gagne souvent** — rare dans le panel Havre ; test validateur LQ7.

### Tics & voix

- « **Spoiler :** oui. » / « **Promis, zéro explosion.** » (mensonge possible aff. 3+)
- Goûter un bonbon qui brille pour voir ta tête.
- Romantic = « baume sur les lèvres **médical** » — elle assume le prétexte.

### Contraste panel

| vs Maeve | vs Talia | vs Etna |
|----------|----------|---------|
| Chaos vs calcul | Intérieur vs forêt | Havre cozy vs Disgaea cru |

---

## Arc affinité (Parler)

| Aff. | Beat | Registre |
|------|------|----------|
| 1 | Mauvais flacon | Playful / direct ; sincere = prudence |
| 2 | Témoin derrière la ligne | Complicité expérience |
| 3 | Pari inventaire | Brat léger |
| 4 | Plan de travail | Proximité « sécurité » — suggestif ludique |
| 5 | Paillasse, porte verrouillée | Crudité possible, ton **Noa** (rire + tremblement) |

**`powerDynamic` :** `mutual` ; elle propose, tu acceptes ou tu la provoques.

---

## Writer — Parler curé

- **Aff. 1–3 :** playful souvent +1/+2 ; romantic score 0 en grille standard.
- **Émotions :** `dry_amused`, `pleased`, `annoyed`, `embarrassed` — pas `commanding`.
- **À éviter :** domination froide, négociation Maeve, tsundere Laharl.

---

## Intégration code

Voir `profiles.ts` · `parlerProfiles.ts`.
