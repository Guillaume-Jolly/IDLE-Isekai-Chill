# Laharl — Overlord invité (Faille Disagrea)

> **Statut :** fiche design · **panel Parler v1** · assets Disagrea · **pipeline Parler dédié (futur)**  
> **ID :** `laharl` · **Crossover :** Disgaea · **Genre présenté :** masculin (demon boy)  
> **Dynamic lien :** `mutual` → tsundere · registre **graveleux / compétitif / RP Disgaea** dès aff. 1–3

---

## En une phrase

Un roi démon **en miniature** qui hurle qu’il est méchant — jusqu’à ce que tu le provoques assez pour qu’il **avoue maladroitement** ce qu’il veut, en niant que ça compte.

---

## Identité

| Champ | Valeur |
|-------|--------|
| **Nom** | Laharl |
| **Nom complet (lore)** | Laharl — overlord invité du Netherworld |
| **Âge apparent** | ~13 (corps enfant — antennes + écharpe pour paraître grand) |
| **Archétype jeu** | Overlord démon / chasseur du havre |
| **Lieu** | Cour de chasse · faille Disagrea · refuge (lit « récupération » joke) |
| **Accent UI** | crimson / blue hair (`eventDisagreaPack.ts`) |
| **Systèmes liés** | `hunt`, `gacha` |

### Stats de base (total 30)

| Charme | Esprit | Vigueur | Grâce | Intuition |
|--------|--------|---------|-------|-----------|
| **7** | 5 | **7** | 4 | 5 |

**Stat primaire :** Charme (arrogance) + Vigueur (chasse)

### Poids dialogue (`toneWeights`)

| sincere | playful | direct | romantic |
|---------|---------|--------|----------|
| 6 | **9** | **8** | **2** |

**`personalityHint` :** Laharl postule le mal — tsundere, compétition, **panique** devant « amour » ; graveleux = provocation / rivalité, pas romance lisse ; BDSM light aff. 1–3 (col, genoux **défi**), RP aff. 4–5.

---

## Personnalité (canon Disgaea → Havre)

### Traits forts

- **Evil posturing** — rire diabolique, « je suis un démon terrible », échec comique.
- **Tsundere** — compassion qui fuit ; honte des émotions ; **nie** après chaque aveu.
- **Faiblesse « amour »** — mot *amour* / platitudes optimistes = **gêne physique** (running gag writer).
- **Faiblesse pulpe** — femmes très curvy = panique ; Etna/Flonne = plats → insultes mutuelles.
- **Compétition** — défis, revanche, chasse ; aff. 4+ = **rivalité physique**, pas lit poétique.
- **Half-demon** — mère humaine ; vulnérabilité aff. 5 **maladroite**.

### Tics & voix

- « **Hahahaha !** » (avec modération — pas chaque ligne)
- « **Ne le répète pas trop fort.** » après un moment gentil.
- Complexe de taille : **ne pas** moquer cruellement ; playful MC ok.
- Jette le MC sur le lit du refuge « **pour récupérer** » — prétexte aff. 4.

### Contraste panel

| vs Etna | vs Roric | vs Finn |
|---------|----------|---------|
| Déni vs assume | Enfant roi vs protocole | Tsundere vs sub docile |
| Même pack Disagrea | Dom **non** smooth | |

---

## Registre Parler — **Disagrea**

### Aff. 1–2–3 — graveleux / RP, **sans acte complet**

| OK | Non (aff. 4–5) |
|----|----------------|
| Provocation crue, paris humiliants **joués** | Descriptions acte explicite |
| Col attrapé en **défi**, genoux = revanche | Domination bedroom type Roric |
| Innuendo compétitif (« t’es **mon** vassal ») | Romantic « je t’aime » sans panique |
| MC direct qui le provoque → il **s’énerve et s’approche** | |
| Mot **amour** dans choix MC → score bas / réaction panic | |

**MC réactions attendues :** playful provocation, direct défi, sincere rare (il **fuit** puis revient).

### Aff. 4–5 — RP Disgaea + intensité

- **`powerDynamic` :** `mutual` ou `protagonist_invited` — **pas** dom smooth type Etna/Roric.
- Possessif enfantin (« personne ne te touche »), compétition sensuelle.
- BDSM **optionnel** : lutte, immobilisation **consentie**, lui qui **crie** qu’il ne aime pas ça (tsundere).
- Builder Disagrea partagé avec Etna — voir [`ETNA_PROFILE.md`](./ETNA_PROFILE.md).

---

## Arc affinité

| Aff. | Beat | Registre |
|------|------|----------|
| 1 | Faille / chasse | Arrogance + premier défi |
| 2 | « Les gens gentils » | Aveu sincere fuyant |
| 3 | Défi absurde terrain | Complicité rieuse |
| 4 | Col / lit refuge | Graveleux + déni |
| 5 | Seuls après chasse | Aveu maladroit ; compétition → intimacy |

---

## Exemples de répliques

**Aff. 1 — direct :** « Tu me parles comme ça ? …Bien. Au moins t’as des couilles. Presque. »  
**Aff. 2 — sincere (Laharl fuit) :** « Le havre est… acceptable. Ne le répète pas. Surtout pas devant Etna. »  
**Aff. 3 — playful :** « Revanche demain ! Même heure, même arrogance — la tienne, pas la mienne. »  
**Aff. 4 — panic romantic MC :** « A-amour ?! …Ferme-la. …Approche, mais ferme-la. »  
**Aff. 5 — tsundere :** « T’es **mon** vassal. C’est tout. …Reste. C’est un ordre. Pas un câlin. »

---

## Writer — bonds / seeds

Réécrire aff. 4–5 seeds : moins « lit poétique », plus **Laharl** (déni, compétition, souffle dans le cou en grognant).

---

## Intégration code

```ts
// profiles.ts
laharl: {
  id: 'laharl',
  name: 'Laharl',
  place: 'la faille Disagrea',
  personalityHint:
    'Laharl est overlord tsundere — bluster, chasse, panique devant « amour » ; graveleux compétitif aff. 1–3, RP aff. 4–5.',
  toneWeights: { sincere: 6, playful: 9, direct: 8, romantic: 2 },
}
```

---

## Pipeline Parler (futur)

Même plan qu’Etna : builder Disagrea, rubrique dédiée, validateur registre **crude + tsundereLovePanic**. **Après** base Havre (Lyra panel) stable.
