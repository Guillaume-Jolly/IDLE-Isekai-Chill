# Mobile UI Validation Report

> **Date :** 2026-06-23  
> **Branche :** `main`  
> **HEAD audité :** `8a09bc6` (`fix(ui): improve mobile fullscreen shell and minigame layouts`)  
> **Commit précédent lié :** `09d2712` (`fix(ui): make app shell responsive with collapsible sidebar`)

---

## 1. État Git (Phase 0)

| | |
|---|---|
| Branche | `main` |
| HEAD | `8a09bc6` |
| Working tree | **propre** au démarrage |
| Staged / unstaged | aucun |
| Ahead origin | 5 commits (non pushés) |

### Commits UI mobile audités

```
8a09bc6 fix(ui): improve mobile fullscreen shell and minigame layouts
09d2712 fix(ui): make app shell responsive with collapsible sidebar
```

### Processus terminal

| Port | PID | Action |
|------|-----|--------|
| 5173 | 16716 | Serveur Vite actif — conservé pour validation |
| 4173 | — | libre |

---

## 2. Validation technique (Phase 1)

| Commande | Exit | Détail |
|----------|------|--------|
| `npm run build` | **0** | 203 modules, chunk index ~5,5 MB (warning taille préexistant) |
| `npm run lint` | **0** | 0 errors, 9 warnings préexistants |
| `npm test` | N/A | script absent |
| `npm run preview` | non lancé | dev server suffisant pour validation visuelle |

### Warnings lint (dette, non bloquants)

- `react-hooks/exhaustive-deps` : Live2DDemo, ConversationGame, DressageGame, FamiliarCaptureGame, hooks wanderers
- `unused eslint-disable` : `companionScenarios.generated.ts`

---

## 3. Fichiers audités (Phase 2)

| Fichier | Points vérifiés |
|---------|-----------------|
| `src/App.tsx` | drawer mobile, toast auto-dismiss, `effectiveMobileNavOpen`, pas de setState dans effect |
| `src/App.css` | `shell--mobile`, drawer, toast compact, gacha mobile grid |
| `src/components/AppNav.tsx` | mode drawer, ressources dans sidebar |
| `src/components/ResourceStrip.tsx` | layout vertical / compact |
| `src/components/minigames/FamiliarCaptureGame.tsx` | classes phase explore/hunt/result |
| `src/components/minigames/Minigames.css` | rail bas mobile, debug masqué, biome/capture/refuge |

### Audit code — résultats

| Critère | Résultat |
|---------|----------|
| Scroll horizontal mobile (390px) | `scrollW === clientW === 390` |
| Sidebar permanente mobile | **Non** — `shell--mobile-nav-closed`, `--sidebar-width: 0` |
| Drawer fermeture | OK — backdrop, navigation, × |
| Toast bloquant | **Non** — `pointer-events: none`, auto-clear 3,2 s, absent au chargement |
| Debug refuge mobile | **Masqué** CSS `@media (max-width:767px) .mg-myrion-debug { display:none }` |
| z-index | drawer 95, backdrop 90, menu fab 30, minigame overlay 40 |
| Boucles React | aucune observée en session |
| useEffect setState | corrigé en amont (listeners media query uniquement) |

---

## 4. Serveur local (Phase 3)

```text
npm run dev -- --host 0.0.0.0
```

| | |
|---|---|
| Port | **5173** |
| Local | http://localhost:5173/ |
| Network (test téléphone) | **http://192.168.1.18:5173/** |
| Erreur terminal initiale | aucune |

---

## 5. Validation desktop (Phase 4)

**Niveau :** navigateur desktop 1280×800 (CDP)

| Écran | Résultat |
|-------|----------|
| Chargement | OK |
| Village | OK — sidebar expanded, panorama visible |
| Navigation | OK — 8 onglets + ressources sidebar |
| Bâtiments / Collecter | OK (spot check village) |
| Inventaire / Liens / Event / Hub | OK (navigation programmatique) |
| Mini-jeu Chasse | OK — overlay plein écran |
| Reload | OK |
| Console critique | aucune capturée |

**Régression desktop :** non observée. Sidebar expanded par défaut ≥1024px, pas de bouton ☰.

---

## 6. Validation responsive simulée (Phase 5)

**Niveau :** DevTools CDP — viewports 390×844 (mobile), 1280×800 (desktop)

### A. Shell / menu

| Viewport | Sidebar permanente | Menu ☰ | Drawer | Compression |
|----------|-------------------|--------|--------|-------------|
| 390×844 | **Non** | Oui | Ouvre/ferme OK | Non |
| 1280×800 | Rail expanded | Non | N/A | Non |

### B. Ressources

| Viewport | Topbar | Drawer |
|----------|--------|--------|
| Mobile | absente | liste complète |
| Desktop | absente si sidebar open | dans sidebar |

### C. Village (mobile 390)

| Critère | Résultat |
|---------|----------|
| Plein écran | OK |
| Labels bâtiments | OK |
| Collecter | visible |
| Toast bienvenue | **absent** au chargement |

### D. Chasse / Capture (mobile 390)

| Critère | Résultat |
|---------|----------|
| Overlay plein écran | OK |
| Menu app ☰ masqué | OK |
| Carte biomes | header lisible, cartes non recouvertes |
| Rail latéral permanent | **Non** — barre basse icônes |
| Debug | non présent dans DOM overlay |

### E. Gacha (mobile 390)

| Critère | Résultat |
|---------|----------|
| Colonne mot-à-mot | **Non** — `epW: 374` sur viewport 390 |
| Boutons Tirer | visibles (grille 2×2) |
| Toast | absent |

> Note : les captures MCP montrent parfois une marge blanche **hors viewport émulé** (artefact panneau navigateur Cursor). Mesures DOM : contenu utilise bien la largeur viewport.

### F. Compagnons / Refuge

| Écran | Simulé | Note |
|-------|--------|------|
| Compagnons | partiel | toggle renommé « scènes avancées » (commit 8a09bc6) |
| Refuge debug | CSS audit | masqué ≤767px ; visible desktop dev (attendu) |
| Mini-jeu Lien | **non rejoué** | conversation non ouverte cette session |

---

## 7. Validation téléphone réel (Phase 6)

| | |
|---|---|
| **Niveau agent** | ❌ pas de téléphone physique accessible |
| **URL fournie** | http://192.168.1.18:5173/ |
| **Validation utilisateur** | **requise** — comparer aux captures pré-correction (2026-06-23 matin) |

### Checklist à confirmer sur téléphone

- [ ] Village plein écran sans rail
- [ ] ☰ → drawer → ressources
- [ ] Chasse : barre outils en bas, pas de chevauchement HUD
- [ ] Gacha lisible
- [ ] Refuge sans « Debug test »
- [ ] Reload

---

## 8. Bugs corrigés pendant validation

**Aucun** — session validation pure, working tree resté propre.

---

## 9. Bugs restants / risques

| ID | Sévérité | Description | Recommandation |
|----|----------|-------------|----------------|
| R1 | Faible | Tablette 768–1023px : rail sidebar collapsed (52px), pas drawer mobile | Acceptable ; ajuster si retours utilisateur |
| R2 | Faible | Drawer fermé reste dans l'arbre a11y (off-screen) | `aria-hidden` sur drawer fermé |
| R3 | Info | Debug refuge visible en **desktop dev** (`import.meta.env.DEV`) | Normal ; preview prod pour test sans debug |
| R4 | Info | Mini-jeu Lien / capture résultat / Nid d'Écho non TNR complet agent | TNR manuel utilisateur |
| R5 | Info | `npm run dev` = flags dev actifs | Utiliser `npm run preview` pour progression prod |

---

## 10. Checklist par écran

| Écran | Automatisé | Desktop simulé | Mobile simulé | Téléphone réel |
|-------|------------|----------------|---------------|----------------|
| Village | build OK | OK | OK | à confirmer |
| Menu/drawer | code OK | OK | OK | à confirmer |
| Ressources | code OK | OK | OK (drawer) | à confirmer |
| Bâtiments | — | spot | non testé | à confirmer |
| Inventaire | — | nav OK | non testé | à confirmer |
| Compagnons | — | non testé | non testé | à confirmer |
| Mini-jeu Lien | — | non testé | non testé | à confirmer |
| Chasse/Capture | — | overlay OK | OK (carte) | à confirmer |
| Carte biomes | — | — | OK | à confirmer |
| Refuge/Nid | CSS audit | — | non testé | à confirmer |
| Gacha/Festival | — | — | OK (DOM) | à confirmer |

---

## 11. Recommandations prochaine passe

1. **TNR téléphone réel** sur http://192.168.1.18:5173/ (checklist §7).
2. **`npm run preview -- --host 0.0.0.0`** pour valider sans flags dev.
3. Parcours **Refuge + Nid d'Écho + résultat capture** sur mobile réel.
4. Optionnel : drawer aussi pour 768–900px si le rail gêne encore.
5. Optionnel : `aria-hidden` sur `.shell-nav-drawer` fermé.

---

## 12. Verdict

| | |
|---|---|
| **Build/lint** | ✅ Stables |
| **Corrections UI mobile** | ✅ Techniquement saines |
| **Régression desktop** | ✅ Non observée |
| **Problèmes pré-correction** | ✅ Corrigés en simulation (sidebar, toast, gacha DOM, biome map, debug CSS) |
| **Validation complète** | ⚠️ Partielle — **téléphone réel requis** pour clôture |
