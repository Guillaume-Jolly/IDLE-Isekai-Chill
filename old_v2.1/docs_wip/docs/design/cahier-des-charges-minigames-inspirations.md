# Cahier des charges — Mini-jeux & inspirations

> **Projet :** IDLE Isekai Chill / Havre des Brumes  
> **Date :** 2026-06-25  
> **Statut :** spécification design — pas de scope d’implémentation immédiat  
> **Sources :** `docs/BACKLOG.md`, `src/data/buildingActivities.ts`, `docs/traceability/assets/hub-minigames-art-brief.md`, `staging/story/`

---

## 1. Philosophie produit (non négociable)

| Principe | Signification concrète |
|----------|------------------------|
| **Zéro frustration** | Pas de timer punitif, pas de perte permanente, pas de FOMO quotidien obligatoire |
| **Chill & plaisir** | Sessions courtes (2–8 min), récompenses même en échec partiel |
| **Liens avant grind** | Compagnons, conversations, histoire > optimisation chiffres |
| **Idle honnête** | Production passive utile mais secondaire ; le joueur ne se sent jamais « en retard » |
| **Adaptation, pas clone** | Reprendre la *sensation* d’un jeu source, jamais sa pression commerciale |

**Ton cible :** cozy fantasy isekai — village paisible, Myrions mignons, affinité progressive, événements Disagrea en parodie affectueuse.

---

## 2. Jeux cités comme inspiration — inventaire

### 2.1 Mini-jeux déjà implémentés (`buildingActivities.ts`)

| Jeu source | Mini-jeu IDLE | Boucle source (cœur) | Ce qui est fun | Ce qui ne doit **pas** être importé |
|------------|---------------|----------------------|----------------|-------------------------------------|
| **Cooking Mama / Diner Dash** | Service Express (Nami) | Séquence rapide d’actions dans l’ordre sous pression temporelle | Rythme satisfaisant, feedback immédiat | Stress chronomètre serré, clients qui partent en colère |
| **Plants vs Zombies** | Herbes vs Brume (Iris) | Placement défensif + vagues prévisibles | Décisions tactiques simples, progression de vagues | Difficulté spike, échec = run perdue |
| **Stardew Valley / Hay Day** | Récolte Brumeuse, Ferme Lunaire | Timing récolte + croissance idle | Boucle récolter → replanter → améliorer | Journées limitées, fatigue, inventaire pénalisant |
| **Perfect Ironing** | Atelier rubans (Lyra) | Rythme + précision gestuelle | Flow zen, score personnel | Perfection obligatoire pour progresser |
| **Visual novel / drague** | Liens (15 compagnons) | Choix de ton → réaction personnage | Intimité narrative, rejouabilité | Routes bloquées, bad ending punissants |
| **Bubble Witch** | Bulles zen (Solene) | Pop ciblé, combos visuels | Détente, couleurs | Vies limitées, niveaux bloquants |
| **Tamagotchi / Neko Atsume** | Refuge, Nid d’Écho | Soins passifs + visites récompensées | Attachement créature, pas d’urgence | Mort du pet, négligence punie |
| **Palworld / Pokémon GO lite** | Chasse Myrions | Exploration biome + capture timing | Découverte, collection | Combat obligatoire, perte de créature |
| **Merge Dragons / 2048** | Fusion tuiles | Fusion 2→1, escalade de puissance | Satisfaction merge | Grind infini sans plafond visible |
| **Memory / Concentration** | Paires mémoire | Association + mémorisation | Accessible tous âges | Timer agressif |
| **Osu! / Guitar Hero lite** | Beat tap | Sync rythme + score | Flow musical | Miss = fail run |
| **Candy Crush / Bejeweled** | Swap match | Match-3 + cascades | Combos visuels | Vies / paywall niveaux |

### 2.2 Idées backlog (`docs/BACKLOG.md`) — futures

| Jeu source | Idée projet | Boucle source | Garder pour IDLE | Rejeter / adoucir |
|------------|-------------|---------------|------------------|-------------------|
| **Top War** | Plateformes aléatoires / donjon | Merge instant + expansion 4X + PvP serveur | Choix binaire explorer / passer, rencontres courtes | PvP, timers longs, pay-to-win, meta alliance |
| **Capybara Go** | Aventure RP chapitres | Auto-combat + choix upgrade roguelite + meta gear | Chapitres courts, choix narratifs, récompenses même si « jour raté » | Energy gate strict, reset run punissant, 60 jours obligatoires |
| **War Thunder + idle evolution** | Tir latéral vagues | Positionnement + DPS + upgrade entre vagues | Vagues courtes, ligne évolution humoristique (poisson→capybara) | Simulation réaliste, grind véhicules |
| **Mario Kart / Chocobo FF** | Course Myrion | Sprint + items + obstacles | 30–60 s, contrôles 1 main, pas de classement global | Ranked compétitif, blue shell frustration |
| **Nintendogs** | Papouillage Myrion | Caresse zone + feedback émotionnel | Cozy pur, jauge confort, pas de score | Myrion qui « meurt de solitude » |
| **Pokémon / WWM criquets** | Combat Myrion 1v1 | Tour par tour type / feinte / stat | 4 moves max, pas de KO permanent | Nuzlocke, IV grind, type chart opaque |
| **Teamfight Tactics** | Auto-battler | Draft + placement + résolution auto | Synergies biome lisibles, run 10 min PvE | Ladder, économie reroll stressante |
| **Raid MMO mobile** | Boss compagnons | Party 3–5 vs boss phases | Composition rôles, cinématique cozy | DPS check strict, wipe = loot perdu |
| **Vampire Survivors / Brotato** | Mode horde | Déplacement seul, attaques auto, level-up choix | 15 min max, courbe puissance | Mort = zero reward, addiction slot-machine |
| **Theme Hospital / Two Point** | Auberge / zoo Myrions | Assigner staff → timers → upgrade | Timers doux, événements texte | Clients furieux, faillite |

### 2.3 Références visuelles / ton (pas mini-jeux)

- **Gacha mobile cozy** — rendu portraits Disagrea (`eventDisagreaPack.ts`) : lumière douce, pas cel-shading dur.
- **Disgaea** — parodie et invités event, **pas** mécaniques grind niveau 9999.

---

## 3. Cartographie inspiration → cible IDLE

```
                    PLaisir immédiat
                          ▲
                          │
     Nintendogs ──────────┼────────── Visual novel Liens
     Caresse Myrion       │          Chapitres story
                          │
     Stardew récolte ─────┼────────── Capybara Go RP
     (timing doux)        │          (choix, pas auto-combat)
                          │
  ────────────────────────┼────────────────────────► Profondeur / session longue
                          │
     Pokémon combat ──────┼────────── TFT / Raid boss
     (simplifié)          │          (PvE auto seulement)
                          │
     VS horde ────────────┼────────── Top War exploration
     (session 15 min)     │          (choix, pas 4X)
                          │
                          ▼
                    Stress / compétition
              ═══ ZONE INTERDITE pour MVP ═══
```

**Règle de filtrage :** toute mécanique source qui pousse le joueur vers le quadrant bas (stress, sessions forcées, punition) est **rejetée** ou **adoucie** jusqu’à devenir optionnelle / cosmétique.

---

## 4. Mini-jeux cibles à implémenter (priorisés)

### Phase A — Polish existant (0.10–0.11)

| ID | Mini-jeu | Scope | Art IA | Effort |
|----|----------|-------|--------|--------|
| A1 | **Liens + cutouts** | Finaliser B4, 3 rounds, émotions par beat | 8 émotions × compagnon (152 cutouts v3) | Code ✅, QA manuel |
| A2 | **Hub présentation** | Carte bâtiment + stage avant lancement | 13× presentation + 13× stage (`hub-minigames-art-brief.md`) | Art pipeline |
| A3 | **Chapitres story déclaratifs** | Lecteur scène auto (≤10 beats) | Fond biome + cutout existant | Schema + lecteur |

### Phase B — Refuge Myrions (0.12)

| ID | Mini-jeu | Inspiration | Scope MVP | Art IA |
|----|----------|-------------|-----------|--------|
| B1 | **Papouillage** | Nintendogs | 1 zone caressable, jauge confort, 60 s max | Main UI overlay ; chibi Myrion existant |
| B2 | **Course enclos** | Mario Kart lite | 1 piste biome, tap sprint, 30 s, 2 CPU | Fond dressage dérivé ; pas de items agressifs |
| B3 | **Duel Myrion** | Pokémon lite | 3 skills, 5 tours max, humeur pas PV | Arena chibi ; VFX simples CSS |

**Règle rareté (backlog) :** N/SR = fenêtres larges ; LR = plus exigeant mais récompense +++ — **jamais** bloquant pour progression village.

### Phase C — Modes session (0.13+)

| ID | Mode | Inspiration | Scope | Limite anti-frustration |
|----|------|-------------|-------|-------------------------|
| C1 | **Aventure RP** | Capybara Go | Chapitre 5–8 choix, 1 run / jour optionnel | Skip beat, récompense partielle |
| C2 | **Exploration plateformes** | Top War | 5 salles, oui/non explorer, 5–10 min | Abandon = loot partiel sauvegardé |
| C3 | **Horde cozy** | Vampire Survivors | 1 stage biome, 12 min cap, auto-fire | Mort = 70 % récompenses |
| C4 | **Auto-battler PvE** | TFT | 8 manches vs CPU, pas de reroll timer | Préset équipe recommandé |

---

## 5. Besoins art IA (par lot)

| Lot | Assets | Prompt anchor | Ratio |
|-----|--------|---------------|-------|
| Hub mini-jeux | `presentations/{buildingId}.png` | Cozy fantasy, lieu vide, tiers bas pour UI | 16:9 |
| Hub stages | `stages/{buildingId}.png` | Même lieu, espace dock dialogue | 9:16 / 16:9 |
| Chapitres story | Fond par `scene.backgroundId` | Biome palette existante | portrait + wide |
| Course Myrion | Piste par biome | Enclos + obstacles stylisés | wide |
| Disagrea chapitres | Affinité paliers invités | `eventDisagreaPack` style anchor | déjà en prod/staging |

**Ne pas générer sans validation :** skins premium (`staging/skinline-premium/`), remplacement affinité 4–5 bed-batch déjà promu.

---

## 6. Principes UX transverses

1. **Entrée ≤ 2 taps** depuis hub ou bâtiment.
2. **Sortie toujours claire** — bouton quitter sans pénalité (sauf run C3 en cours = confirm doux).
3. **Feedback positif par défaut** — échec = « pas grave », compagnon rassure (réaction Liens).
4. **Mobile first** — zones touch 44px, dock dialogue tiers bas, cutout 9:16.
5. **Pas de tutoriel bloquant** — Talia guide optionnel (seed chapitre 7 staging).
6. **Cohérence émotionnelle** — ton corpus → cutout (voir `companionConversationVisuals.ts`).

---

## 7. Ce qu’il ne faut **PAS** faire

| Interdit | Pourquoi |
|----------|----------|
| Timers payants / énergie bloquante | Casse le chill idle |
| PvP obligatoire ou ladder | Stress + hors lore havre |
| Mort / perte permanente Myrion | Trahison attachement |
| Grind 30+ min sans variété | Capybara Go / VS piège |
| Clone Candy Crush vies | Frustration mobile classique |
| Routes Liens irréversibles punies | Visual novel hardcore |
| Animation manuelle par ligne dialogue | Non scalable (7500 scénarios) |
| Auto-promote staging → assets | Règle projet |
| FOMO event sans rattrapage | Disagrea = fenêtre, pas punition |

---

## 8. Système chapitres & générateur de scène (aperçu)

Objectif : **personnage + humeur + phrase + fond → scène animée automatiquement**, sans keyframe par réplique.

| Couche | Rôle |
|--------|------|
| **Schéma déclaratif** | JSON/YAML chapitres (`docs/design/scene-generator-schema.md`) |
| **Moteur résolution** | `src/data/sceneGenerator/` — map mood/tone → émotion, fond, FX CSS |
| **Runtime Liens** | Extension `ConversationGame.tsx` — beats au lieu de rounds fixes optionnel |
| **Runtime Disagrea** | Extension `disagreaStory.ts` — pages → beats unifiés |
| **Corpus V2** | Migration progressive : rounds existants = sous-ensemble du schéma |

**Contrainte utilisateur :** ≤ 10 échanges par scène ; arcs courts.

→ Détail technique : [`scene-generator-schema.md`](./scene-generator-schema.md)

---

## 9. Métriques de succès (design)

- Session Liens : ≥ 80 % des joueurs test atteignent l’écran résultat sans abandon.
- Échec choix dialogue : 100 % des cas donnent une réaction personnage (pas d’écran vide).
- Chapitre story : lecture complète ≤ 4 min mobile.
- Aucun mini-jeu MVP ne requiert plus de 3 inputs simultanés.

---

## 10. Prochaines étapes recommandées

1. Valider ce cahier des charges (priorités Phase A vs B).
2. Implémenter lecteur `SceneChapter` sur 1 chapitre Lyra (staging).
3. Produire 3 presentations hub (bibliothèque, ferme, théâtre) en session IA.
4. Décider si B1 Papouillage remplace ou complète le bouton Câliner actuel.
5. Corpus V2 : regen B1–B3 backlog sans toucher runtime en même temps.

---

## Références repo

- `docs/BACKLOG.md` — idées futures
- `src/data/buildingActivities.ts` — mini-jeux actuels + champ `inspiration`
- `staging/story/chapter-seed-pack-emotion-cutouts.md` — seeds narratifs
- `staging/story/emotion-cutout-usage-map.md` — mapping ton → émotion
- `docs/traceability/assets/hub-minigames-art-brief.md` — art hub
