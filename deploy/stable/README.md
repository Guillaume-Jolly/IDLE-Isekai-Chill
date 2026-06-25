# Serveur stable isolé — IDLE Isekai Chill

Version **figée** du jeu, séparée du `npm run dev` (port 5173).  
Build dans `deploy/stable/dist/` — **jamais rebuild automatiquement**.  
Publication PROD volontaire uniquement : `npm run build:stable:prod` (après commit + push GitHub).

## Démarrage rapide (PC hôte)

```powershell
cd "C:\Dev\Project\IDLE Isekai Chill"
powershell -ExecutionPolicy Bypass -File scripts\serve-stable.ps1
```

1. Copie `env.example` → `.env.stable.local` (auto au 1er lancement)
2. **Change `STABLE_AUTH_PASS`** dans `.env.stable.local`
3. Ouvre l’URL **https://** affichée (identifiant + mot de passe demandés)

Au premier lancement, un **certificat auto-signé** est généré (`deploy/stable/certs/`).

### Avertissement « tentative de vol d'identité »

**Normal et attendu** — ce n'est pas une attaque. Ton navigateur ne fait pas confiance aux certificats créés chez toi (seuls les certificats d'autorités publiques type Let's Encrypt sont reconnus automatiquement).

**Sur PC (supprimer l'avertissement) :**

```powershell
npm run trust:stable
```

Ferme toutes les fenêtres du navigateur, rouvre `https://127.0.0.1:8787/`.  
Si l'avertissement persiste : PowerShell **administrateur**, puis :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\trust-stable-tls.ps1 -LocalMachine
```

**Sur mobile (une seule fois, marche aussi en 4G après) :**

1. Télécharge `ca-mobile.cer` (Wi‑Fi maison : `https://192.168.x.x:8787/setup/ca-mobile.cer`, ou envoie le fichier depuis le PC)
2. **Paramètres Android → Installer certificat → Certificat AC** (pas VPN/utilisateur)
3. Fichier : `ca-mobile.cer`

---

## Jouer en 4G / réseau mobile (depuis l'extérieur)

C'est le cas d'usage principal : **HTTPS + CA sur le téléphone** (pas HTTP — mot de passe et session seraient visibles sur Internet).

### Checklist (à faire une fois)

| Étape | Action |
|-------|--------|
| 1 | **PC allumé** + serveur stable lancé (`npm run serve:stable`) |
| 2 | **IP publique** : va sur [whatismyip.com](https://whatismyip.com) depuis le PC |
| 3 | Dans `.env.stable.local` : `STABLE_PUBLIC_HOST=TON_IP_PUBLIQUE` (ou `monjeu.duckdns.org` si IP dynamique) |
| 4 | Regénère le cert : `npm run tls:stable` puis relance le serveur |
| 5 | **Box** : redirection port **8787** → IP locale du PC (`192.168.1.18:8787`) |
| 6 | **Pare-feu Windows** : autorise le port 8787 entrant |
| 7 | **Téléphone** : installe `ca-mobile.cer` comme **Certificat AC** (voir ci-dessus) |
| 8 | **Favori Brave** : `https://TON_IP_PUBLIQUE:8787/` — login `metashine` / mot de passe |

Si ton IP publique change (box classique), mets à jour `STABLE_PUBLIC_HOST` + `npm run tls:stable`, ou utilise un **DNS dynamique** gratuit (DuckDNS, No-IP).

**CGNAT :** si ta box n'a pas de vraie IP publique (IP box ≠ IP whatismyip), la redirection de port ne marchera pas — il faudra une offre « IP fixe » ou un tunnel.

### Wi‑Fi maison vs 4G

| | Wi‑Fi maison | 4G / extérieur |
|---|--------------|----------------|
| URL | `https://192.168.1.18:8787/` | `https://IP_PUBLIQUE:8787/` |
| Certificat mobile | `ca-mobile.cer` (1×) | même CA, déjà installé |
| Chiffrement | HTTPS | HTTPS |

---

## Téléphone / autre PC (même Wi‑Fi)

Le script affiche des URLs du type `https://192.168.x.x:8787/`.  
Utilise le **même login / mot de passe** que sur le PC.

Pare-feu Windows : autorise Node.js sur le port `8787` si le téléphone ne charge pas.

Regénérer le certificat (nouvelle IP LAN) :

```bash
npm run tls:stable
```

## Accès depuis Internet (extérieur)

Le serveur écoute en **HTTPS** avec **auth Basic + rate limit**.

### Redirection de port (box / routeur)

1. Redirige le port externe (ex. 8787) vers `IP_du_PC:8787`
2. **Mot de passe fort obligatoire** dans `.env.stable.local`
3. Accès : `https://TON_IP_PUBLIQUE:8787/` (avertissement certificat à accepter une fois)

### Cloudflare Tunnel (optionnel)

Si tu utilises un tunnel, pointe-le vers `https://127.0.0.1:8787` (ou `http` si tu désactives TLS avec `STABLE_TLS=0`).

## Sécurité incluse

| Mesure | Détail |
|--------|--------|
| Auth HTTP Basic | Utilisateur + mot de passe (fichier local non versionné) |
| Rate limit | Requêtes / IP / minute |
| Anti brute-force | Limite d’échecs auth / IP |
| Méthodes | GET / HEAD uniquement |
| URL | Longueur max 2048 |
| En-têtes | `nosniff`, `SAMEORIGIN`, `Referrer-Policy` |

## Commandes npm

```bash
npm run build:stable:prod  # PROD volontaire (git propre + push GitHub requis)
npm run tls:stable         # regénère CA + cert (après changement IP publique/LAN)
npm run trust:stable       # fait confiance à la CA sur le PC
npm run serve:stable       # serveur (ne rebuild jamais)
npm run launcher:stable    # lanceur + tableau de bord graphique
```

### Publier une nouvelle version PROD

1. Dev stable, tests OK
2. `git commit` + `git push`
3. `npm run build:stable:prod`
4. Relance `Launch Stable Server.cmd`

Le lanceur, `serve:stable` et un redémarrage PC **ne rebuildent jamais**.

## Isolation du dev

| | Dev | Stable |
|---|-----|--------|
| Commande | `npm run dev` | `npm run serve:stable` |
| Port | 5173 | 8787 (configurable) |
| Dossier servi | sources Vite | `deploy/stable/dist` |
| Hot reload | oui | non |
| Sauvegarde | `idle-isekai-chill-game-v1` | `idle-isekai-chill-stable-v1` |

La build stable démarre avec une **sauvegarde démo** (village stade max, bâtiments niv. 10, ressources généreuses, tuto terminé).  
Pour repartir de zéro sur la démo : `http://…:8787/?fresh=1`

Les assets JS/images se chargent **sans re-saisir le mot de passe** (auth uniquement sur la page d’entrée).

### Plein écran (PC + mobile)

- **Navigateur** : écran « Jouer » au lancement → plein écran (nécessite un tap/clic).
- **Mobile (recommandé)** : Brave → menu → **Ajouter à l’écran d’accueil** → icône « Havre » → lance en **plein écran** sans barre du navigateur.
- **PC Chrome/Edge** : icône **Installer l’application** dans la barre d’adresse (HTTPS requis).

Après publication PROD : `npm run build:stable:prod` puis relance le serveur stable.

Les anciennes builds stable sont **archivées** dans `deploy/stable/archive/` (jamais supprimées automatiquement).
