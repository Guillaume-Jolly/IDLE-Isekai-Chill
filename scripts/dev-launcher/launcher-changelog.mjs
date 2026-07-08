/** Historique court du lanceur dev — but et utilité par version (plus récent en tête). */
export const LAUNCHER_CHANGELOG = [
  {
    version: '1.2.70',
    title: 'Monitoring — onglet Téléphone LAN',
    lines: [
      'Sous-onglet Téléphone LAN (comme Jeu / Lab) : état, URL réseau, Ouvrir/Démarrer/Redémarrer/Arrêter.',
      'Panneau Jeu allégé — accès téléphone déplacé vers l’onglet dédié.',
    ],
  },
  {
    version: '1.2.69',
    title: 'Historique — filtre non documentés + sync DEV_LOG X',
    lines: [
      'Case à cocher Afficher non documentés (synthèse, À COMPLÉTER, plages hook) — modal + onglet.',
      'Scripts append-missing-dev-log-x / backfill corrigés (marqueur Template section).',
    ],
  },
  {
    version: '1.2.68',
    title: 'Historique X — synthèse build-revision + maj page récente',
    lines: [
      'Segment X : entrée synthèse si X courant > dernier ### DEV_LOG (ex. X=634…675).',
      'Maj historique remet la pagination à la page la plus récente (offset 0).',
    ],
  },
  {
    version: '1.2.67',
    title: 'Téléphone LAN — mêmes boutons que Jeu / Lab',
    lines: [
      'Carte Téléphone : Ouvrir, Démarrer, Redémarrer, Arrêter (comme :5173 / :5174).',
      'Démarrer = LAN + jeu si besoin · Arrêter = désactiver --host · API /api/open-phone.',
    ],
  },
  {
    version: '1.2.66',
    title: 'Historique modif — pleine largeur + maj forcée',
    lines: [
      'Onglet Historique modif : contenu sur toute la largeur (liste scrollable adaptative).',
      'Bouton Maj historique — relit app + lanceur depuis le disque.',
    ],
  },
  {
    version: '1.2.65',
    title: 'Accueil compact — 3 rubriques sur un écran',
    lines: [
      'Grille Builds | Serveurs dev | Session & outils côte à côte (≥960px).',
      'App et lanceur en deux colonnes dans Builds · libellés et espacements réduits.',
    ],
  },
  {
    version: '1.2.64',
    title: 'Onglet Historique modif (app + lanceur)',
    lines: [
      'Nouvel onglet Historique modif avec sous-onglets App A.B.C.X.Y et Lanceur.',
      'Même contenu que les panneaux info (i) du tableau de bord, intégré en pleine page.',
    ],
  },
  {
    version: '1.2.63',
    title: 'Accueil compact + monitoring par serveur',
    lines: [
      'Accueil : petites cartes Jeu / Lab / Téléphone (LAN) avec raccourcis uniquement.',
      'Lab : ouverture racine http://localhost:5174/ (sans sous-URL activity).',
      'Monitoring : 3 sous-onglets Lanceur :9221, Jeu :5173, Lab :5174 — détails + mêmes actions.',
    ],
  },
  {
    version: '1.2.62',
    title: 'Logs — reprise Vite en jaune (pas rouge)',
    lines: [
      '« Reprise Vite impossible » = info normale si :5173 fermé lors d’une maj lanceur — couleur alerte (jaune).',
    ],
  },
  {
    version: '1.2.61',
    title: 'Logs — ordre récent, onglets fix, Tout, couleurs',
    lines: [
      'Plus récent en haut · pagination Récent / Ancien.',
      'Fix onglets : chaque canal charge ses propres lignes (plus de pollution Lanceur).',
      'Onglet Tout : fusion chrono de tous les canaux techniques.',
      'Couleurs : démarrage (vert), arrêt (ambre), redémarrage (violet), plantage (rouge), alerte (jaune).',
    ],
  },
  {
    version: '1.2.60',
    title: 'Logs — fusion Dashboard → Lanceur + fix affichage vide',
    lines: [
      'Onglet Dashboard retiré : événements navigateur ([dashboard]) visibles dans Lanceur.',
      'Fix : changement d’onglet réinitialise le panneau (plus d’écran vide / contenu d’un autre onglet).',
      'Lanceur charge launcher + dashboard depuis state.json (historique 24 h).',
    ],
  },
  {
    version: '1.2.59',
    title: 'Moins de bruit — sondes maj lanceur',
    lines: [
      'Plus de ligne serveur par GET /api/health pendant la mise à jour (poll ~4/s inutile).',
      'Journal Dashboard : 1 entrée / 2,5 s max + jalons (essai 1, 10, 20… · port libéré · succès).',
      'Intervalles sonde : 700 ms (coupure port) · 800 ms (attente remplaçant).',
    ],
  },
  {
    version: '1.2.58',
    title: 'Logs par canal — fin de l’onglet Verbose',
    lines: [
      'Onglets techniques : Lanceur · Vite jeu · Vite lab · Build · Dashboard (+ Utilisateur inchangé).',
      'Chaque canal : 4000 lignes max · historique 24 h · persistance state.json.',
      'Vite jeu/lab séparés — sortie taguée par serveur (:5173 / :5174).',
    ],
  },
  {
    version: '1.2.57',
    title: 'Historique logs entre sessions',
    lines: [
      'Redémarrage normal : journal restauré depuis .dev-session/state.json (24 h max).',
      'Autosave session toutes les 2 min + snapshot à la fermeture.',
      'Mise à jour lanceur : même historique, sans perte si Vite arrêté.',
    ],
  },
  {
    version: '1.2.56',
    title: 'Rétention logs — 1 jour',
    lines: [
      'Journaux mémoire + state.json : entrées > 24 h purgées (horodatage YYYY-MM-DD HH:MM:SS).',
      'Fichiers .dev-session/*.log obsolètes → move old_2_2/launcher-logs/ (pas de suppression disque).',
      'Purge au démarrage + toutes les heures · vite.log horodaté pour filtrage.',
    ],
  },
  {
    version: '1.2.55',
    title: 'Logs conservés après mise à jour lanceur',
    lines: [
      'Reprise : journal session + restart-gen-N.log importés même si Vite arrêté.',
      'Sondes [dashboard] survivent au rechargement (sessionStorage → Verbose).',
      'Parent sauvegarde state.json avant de quitter.',
    ],
  },
  {
    version: '1.2.54',
    title: 'Fix critique — mise à jour lanceur (EBUSY console.log)',
    lines: [
      'restartLauncher plantait sur console.log verrouillé (VBS >>) — aucun processus remplaçant.',
      'Logs remplaçant : .dev-session/restart-gen-N.log · échec spawn = parent conservé.',
    ],
  },
  {
    version: '1.2.53',
    title: 'Sondes dashboard dans Verbose + redémarrage plus fiable',
    lines: [
      'Journal [dashboard] : chaque GET /api/health (live + onglet Verbose), même quand le serveur est mort.',
      'Flush vers /api/client-log quand le nouveau lanceur répond.',
      'Processus remplaçant : attente lock jusqu’à 25 s · parent ne tue plus le port au timeout 4 s.',
    ],
  },
  {
    version: '1.2.52',
    title: 'Progression — stats lisibles + fil live',
    lines: [
      'Bas de panneau : Écoulé · Étape · Avancement (3/6) · Reste estimé — plus de « débit %/s ».',
      'Commentaire live sous l’étape (ex. GET /api/health essai N, connexion refusée…).',
    ],
  },
  {
    version: '1.2.51',
    title: 'Un seul onglet dashboard au démarrage',
    lines: [
      'start-launcher.vbs ne ouvre plus le navigateur après le lancement Node (server.mjs le fait déjà).',
      'Corrige les deux onglets :9221 au double-clic .bat / raccourci.',
    ],
  },
  {
    version: '1.2.50',
    title: 'Progression — plan d’étapes dépliable + ETA historique',
    lines: [
      'Menu ▸ à gauche de l’action en cours : étapes fait / en cours / à venir.',
      'ETA « reste estimé » basée sur les durées passées (localStorage) + défauts par étape.',
      'Mise à jour lanceur : plan détaillé (sonde, coupure :9221, attente, reload).',
    ],
  },
  {
    version: '1.2.49',
    title: 'Icône Lyra + raccourci barre des tâches',
    lines: [
      'Icône Havre (Lyra chibi + badge DEV 40 %) : scripts/dev-launcher/launcher-icon.ico',
      'npm run launcher:shortcut — raccourci bureau + racine repo, épinglable à la barre des tâches.',
    ],
  },
  {
    version: '1.2.48',
    title: 'Mise à jour lanceur — ne plus tuer le remplaçant',
    lines: [
      'Fix : le timeout parent tuait le nouveau processus sur :9221 après « Mettre à jour le lanceur ».',
      'Logs du processus remplaçant appendés dans .dev-session/console.log.',
    ],
  },
  {
    version: '1.2.47',
    title: 'Messages recovery sans fenêtre .bat',
    lines: [
      'Dashboard : plus de consigne « fermez le .bat » — le lanceur tourne en arrière-plan.',
      'Reliquats silencieux / start-hidden archivés sous old_2_2/launcher-entry-archive/.',
    ],
  },
  {
    version: '1.2.46',
    title: 'Un seul lanceur sans fenêtre cmd',
    lines: [
      'Havre Dev Launcher.bat délègue à start-launcher.vbs (probe, cleanup, démarrage caché).',
      'Suppression entrée « silencieux » — un seul chemin pour éviter les régressions.',
      'Logs processus : scripts/dev-launcher/.dev-session/console.log',
    ],
  },
  {
    version: '1.2.45',
    title: 'Mise à jour lanceur — fiabilité + erreur claire',
    lines: [
      'Redémarrage : plus de tentatives port :9221, libération forcée si parent bloqué.',
      'Échec mise à jour : plus de barre à 100 % trompeuse · bouton Réessayer connexion.',
      'Instructions recovery : relancer le .bat si API injoignable.',
    ],
  },
  {
    version: '1.2.44',
    title: 'Vite jeu/lab unifié + progression détaillée',
    lines: [
      'Mêmes boutons jeu :5173 et lab :5174 — Ouvrir, Copier, Démarrer, Redémarrer, Arrêter.',
      'Redémarrer : stop + relance + ouverture navigateur · Arrêter : tous les PID sur le port.',
      'Barre de progression : étapes à venir, débit %/s, ETA, détail port/PID.',
    ],
  },
  {
    version: '1.2.43',
    title: 'Build app / lanceur empilés',
    lines: [
      'Panneau versions : Build app au-dessus, Build lanceur en dessous (pleine largeur).',
      'Fini les dates et empreintes coupées sur deux colonnes étroites.',
    ],
  },
  {
    version: '1.2.42',
    title: 'Dashboard — lisibilité & scroll page',
    lines: [
      'Priorité lisibilité : polices plus grandes, textes qui s’enroulent (plus de nowrap coupé).',
      'Grille : meta + outils pleine largeur ; 4 colonnes seulement ≥1520px.',
      'Ascenseur vertical page rétabli · hints outils visibles.',
    ],
  },
  {
    version: '1.2.30',
    title: 'Boutons Maj backlog / changelog / état du jeu',
    lines: [
      'Maj backlog — relit docs/BACKLOG.md.',
      'Maj changelog — compile DEV_LOG + curaté → PRODUCT_CHANGELOG.md/.json.',
      'Maj état du jeu — compile snapshot → GAME_STATE_SNAPSHOT.md/.json.',
    ],
  },
  {
    version: '1.2.29',
    title: 'Scroll dans les accordéons',
    lines: [
      'Corps des blocs dépliés scrollable (max ~52vh) — header fixe.',
      'Changelog + État du jeu : plus de contenu masqué hors écran.',
    ],
  },
  {
    version: '1.2.28',
    title: 'Accordéons Changelog & État du jeu',
    lines: [
      'Blocs repliables via <details>/<summary> natif — plus de re-render au clic.',
      'Chevron ▸/▾ synchronisé · état open mémorisé entre filtres.',
      'État du jeu : Terminées seule ouverte par défaut.',
    ],
  },
  {
    version: '1.2.27',
    title: 'Onglet État du jeu',
    lines: [
      'Vue produit : terminées · commencées · envisagées.',
      'Curaté 2.1/2.2 + backlog + DEV_LOG — tri par catégories backlog.',
      'Filtres maturité et catégorie · blocs repliables.',
    ],
  },
  {
    version: '1.2.26',
    title: 'Changelog · catégories backlog',
    lines: [
      'Entrées classées par catégorie backlog (UI, UX, QoL, dev, contenu, parler…).',
      'Filtre catégorie + regroupement par release · badge type (+/~/!/…) sur chaque ligne.',
      'DEV_LOG auto via inferChangeCategory · jalons 2.1/2.0/1.0 avec category explicite.',
    ],
  },
  {
    version: '1.2.25',
    title: 'Onglet Changelog produit A.B',
    lines: [
      'Nouvel onglet Changelog — ajouts / modifs / suppressions par version A.B.',
      '2.2 auto depuis DEV_LOG · 2.1 / 2.0 / 1.0 curatés · version actuelle en tête.',
      'Filtres version + type · blocs repliables par release.',
    ],
  },
  {
    version: '1.2.24',
    title: 'Backlog · catégories normalisées',
    lines: [
      'Statut = cycle de vie court (idée, actif, backlog…) — plus de pavés dans le filtre.',
      'Catégorie = tri (UI, UX, QoL, dev, contenu, mini-jeu, parler, assets, infra, event).',
      'Liste groupée par catégorie · filtres statut + catégorie · migration docs/BACKLOG.md.',
    ],
  },
  {
    version: '1.2.23',
    title: 'Onglet Backlog produit',
    lines: [
      'Nouvel onglet Backlog : lecture / édition de docs/BACKLOG.md.',
      'CRUD : ajouter, éditer notes Markdown, statut, niveau ##/###, supprimer, dupliquer, réordonner.',
      'Filtres recherche + statut · sections modèle en pied de fichier préservées.',
    ],
  },
  {
    version: '1.2.22',
    title: 'Historique Y · prompts multi-tâches',
    lines: [
      'Segment Y : masqué si le prompt X n’a qu’une seule tâche (ex. 305.1 seul).',
      'Dès que max(Y)≥2 sur un X, toutes les Y de ce prompt sont listées (ex. 307.0→307.3).',
    ],
  },
  {
    version: '1.2.21',
    title: 'Historique app · taille de page',
    lines: [
      'Sélecteur 10 / 50 / 100 entrées par page (préférence mémorisée).',
      'Modale historique app refaite en flex — pagination et « Aller à » toujours visibles.',
    ],
  },
  {
    version: '1.2.20',
    title: 'Audit : faux positifs retirés',
    lines: [
      '« Audit freeze » renommé « Audit diagnostic » — plus classé comme erreur.',
      'Section « Logs erreur récents » masquée s’il n’y a que le journal d’audit.',
    ],
  },
  {
    version: '1.2.19',
    title: 'Monitoring sans blocage',
    lines: [
      'Inventaire processus mis en cache 4 s — fini le blocage Node pendant audit/monitoring.',
      'Plus de fausse alerte « API injoignable » si le status répondait il y a < 45 s.',
    ],
  },
  {
    version: '1.2.18',
    title: 'Refresh découplé des logs',
    lines: [
      'Status et logs séparés — plus de faux « API injoignable » si seuls les logs timeout.',
      'Poll léger : 300 lignes user · verbose (4000) chargé uniquement onglet Verbose.',
    ],
  },
  {
    version: '1.2.17',
    title: 'Démarrage .bat non bloquant',
    lines: [
      'probe-health : timeout 4 s — plus de fenêtre CMD figée si :9221 ne répond pas.',
      '.bat : étapes [1/3][2/3][3/3] visibles · nettoyage fantômes avant chaque démarrage.',
    ],
  },
  {
    version: '1.2.16',
    title: 'Audit & monitoring fiables',
    lines: [
      'Audit : timeout 45s (sondes Vite jusqu’à 8s), indicateur de progression, spawn-audit dans le rapport.',
      'Monitoring : timeout 30s · messages d’erreur explicites (plus « signal aborted »).',
    ],
  },
  {
    version: '1.2.15',
    title: 'Sync UI cohérente',
    lines: [
      'Un seul critère pour bandeau rouge, état lanceur et « Dernière maj fenêtre ».',
      'Rechargement auto si la fenêtre HTML est plus vieille que le processus Node.',
    ],
  },
  {
    version: '1.2.14',
    title: 'Logs Verbose brut + Utilisateur synthèse',
    lines: [
      'Verbose : sortie intégrale sans filtre (Vite, npm build, lanceur) — 4000 lignes.',
      'Utilisateur : grille synthèse (versions, git, ports, sync) + alertes + fil récent.',
    ],
  },
  {
    version: '1.2.13',
    title: 'Logs en deux onglets',
    lines: [
      'Onglet Utilisateur : état, versions, actions et erreurs utiles sans le bruit technique.',
      'Onglet Verbose : 300 lignes par page, copie (tout / 1000 / 100 / erreurs).',
      'Historique serveur porté à 1500 lignes pour les exports.',
    ],
  },
  {
    version: '1.2.12',
    title: 'Changelog relu à l’ouverture',
    lines: [
      'DEV_LOG et historique lanceur reparsés depuis le disque à chaque ouverture du « i ».',
      'Horodatage « relu à HH:MM:SS » sous le titre.',
    ],
  },
  {
    version: '1.2.10',
    title: 'Relance .bat fiable',
    lines: [
      'Le .bat détecte un lanceur obsolète (version disque ≠ processus) et le remplace au lieu d’ouvrir l’ancien.',
      'Mise à jour : ignore les réponses de l’ancien processus · arrêt parent forcé si le port reste bloqué.',
    ],
  },
  {
    version: '1.2.9',
    title: 'Changelog app A.B.C.X.Y',
    lines: [
      'Icône « i » sur Version & build (serveur dev) : historique paginé par segment A/B/C/X/Y.',
      'Navigation : 10 par page, premier/dernier, aller à une version (ex. 528 ou 2.2.0.528.1).',
    ],
  },
  {
    version: '1.2.8',
    title: 'Jeu manuel',
    lines: [
      'Plus d’ouverture automatique du jeu au démarrage Vite — utilisez « Ouvrir le jeu ».',
    ],
  },
  {
    version: '1.2.7',
    title: 'Mise à jour fiable',
    lines: [
      'Correction du bouton « Mettre à jour le lanceur » qui échouait parfois (timeout).',
      'Logs détaillés à chaque étape de redémarrage (gen, PID, port 9221).',
    ],
  },
  {
    version: '1.2.6',
    title: 'Historique des versions',
    lines: [
      'Icône « i » : changelog intégré pour comprendre chaque version sans lire le code.',
    ],
  },
  {
    version: '1.2.5',
    title: 'Robustesse & remplacement auto',
    lines: [
      'Remplace automatiquement un lanceur obsolète sur le port 9221 au redémarrage.',
      'Bandeau d’erreur si l’API ne répond plus — fini l’écran vide sur « Initialisation… ».',
      'Ctrl+F5 ne suffit pas : message clair + bouton « Mettre à jour le lanceur ».',
    ],
  },
  {
    version: '1.2.4',
    title: 'Mise à jour en un clic',
    lines: [
      '« Mettre à jour le lanceur » redémarre le processus et recharge la page automatiquement.',
      'Plus besoin de Ctrl+F5 manuel après une modif du lanceur.',
    ],
  },
  {
    version: '1.2.3',
    title: 'Sync version lanceur',
    lines: [
      'Panneau dédié : empreinte disque vs processus, dates de modif sources et fenêtre.',
      'Alerte visuelle si l’UI affichée est plus vieille que les fichiers sur disque.',
    ],
  },
  {
    version: '1.2.2',
    title: 'Logs lisibles',
    lines: [
      'Filtre le bruit (lignes « vite » / « launcher » vides ou redondantes).',
      'Journal orienté actions : boutons, audit, redémarrages, avec version app.',
    ],
  },
  {
    version: '1.2.1',
    title: 'HTML toujours à jour',
    lines: [
      'Le tableau de bord est relu depuis le disque à chaque chargement (no-cache).',
      'Bouton Audit freeze pour diagnostiquer un Vite bloqué.',
    ],
  },
  {
    version: '1.2.0',
    title: 'Monitoring & audit',
    lines: [
      'Onglet Monitoring : conso RAM/CPU, fantômes, kill individuel par PID.',
      'Audit freeze : sonde HTTP Vite, logs erreur, inventaire processus.',
      'Serveur téléphone (--host) activable depuis le dashboard.',
    ],
  },
  {
    version: '1.1.0',
    title: 'Première base',
    lines: [
      'Tableau de bord local (:9221) pour Vite, logs, build et actions courantes.',
      'Reprise de session Vite, nettoyage fantômes ports 9221 / 5173.',
    ],
  },
]
