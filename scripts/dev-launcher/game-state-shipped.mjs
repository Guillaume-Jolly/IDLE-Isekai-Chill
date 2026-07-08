/**
 * Fonctionnalités livrées — état jouable du Havre des Brumes (curaté).
 * Complété par le backlog (statut done) et le DEV_LOG phase 2.2 (sections complètes).
 */

/** @typedef {import('./game-state.mjs').GameFeature} GameFeature */

/** @type {GameFeature[]} */
export const SHIPPED_FEATURES = [
  // ——— Mini-jeu / mode ———
  {
    id: 'village-panorama',
    title: 'Village panorama & bâtiments',
    category: 'minijeu',
    summary: '8+ bâtiments, production passive, améliorations par stade.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'hub-minijeux',
    title: 'Hub mini-jeux',
    category: 'minijeu',
    summary: 'Accès central aux activités par bâtiment et compagnon.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'farm-worksite',
    title: 'Chantier du havre',
    category: 'minijeu',
    summary: 'Mini-jeu worksite — progression ressources village.',
    since: '2.1',
    source: 'buildingActivities',
  },
  {
    id: 'farm-capture',
    title: 'Chasse aux Myrions',
    category: 'minijeu',
    summary: 'Capture de Myrions en exploration.',
    since: '2.1',
    source: 'buildingActivities',
  },
  {
    id: 'farm-dressage',
    title: 'Refuge des Myrions (dressage)',
    category: 'minijeu',
    summary: 'Dressage et soin des Myrions capturés.',
    since: '2.1',
    source: 'buildingActivities',
  },
  {
    id: 'ferme-lunaire',
    title: 'Ferme lunaire',
    category: 'minijeu',
    summary: '15 biomes, 45 filons, supervision, prestige.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'myrions-refuge-promenade',
    title: 'Promenade Myrions',
    category: 'minijeu',
    summary: 'Refuge, reproduction, gestion du parc Myrions.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'gacha',
    title: 'Gacha compagnons & récompenses',
    category: 'minijeu',
    summary: 'Tirages, ouverture animée, tickets et cadeaux.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'destiny-wheel',
    title: 'Roue du destin (Disagrea)',
    category: 'minijeu',
    summary: 'Mini-jeu event — roue et récompenses spéciales.',
    since: '2.1',
    source: 'buildingActivities',
  },
  {
    id: 'legacy-minigames',
    title: 'Mini-jeux legacy par bâtiment',
    category: 'minijeu',
    summary: 'Service express, jardin TD, atelier, bibliothèque, théâtre… (~20 activités).',
    since: '2.1',
    source: 'buildingActivities',
  },

  // ——— Parler ———
  {
    id: 'parler-hub',
    title: 'Parler — hub village',
    category: 'parler',
    summary: 'Échanges à choix, affinité, récompenses cadeaux / mana / stardust.',
    since: '2.1',
    source: 'buildingActivities',
  },
  {
    id: 'parler-19-compagnons',
    title: '19 compagnons · 190 liens',
    category: 'parler',
    summary: 'Corpus validé ~7500 entrées, 5 paliers affinité.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'parler-curated-mode',
    title: 'Parler curé (CURATED_PARLER_ONLY)',
    category: 'parler',
    summary: 'Dialogues JSON curés — pas de génération procédurale en prod.',
    since: '2.1',
    source: 'curatedCorpus',
  },
  {
    id: 'parler-lyra-aff5',
    title: 'Lyra — corpus curé aff. 1–2, 4–5',
    category: 'parler',
    summary: 'Piste B curée — validateurs auto OK ; aff. 3 archivé (essai).',
    since: '2.2',
    source: 'link-corpus',
  },

  // ——— Contenu ———
  {
    id: 'inventaire',
    title: 'Inventaire & ressources',
    category: 'contenu-plus',
    summary: '12 ressources, stock, coûts bâtiments et récompenses.',
    since: '2.1',
    source: 'App.tsx',
  },
  {
    id: 'quetes',
    title: 'Quêtes & objectifs infinis',
    category: 'contenu-plus',
    summary: 'Tableau de quêtes, tutorial, guide prochaine étape.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'production-passive',
    title: 'Production passive & offline',
    category: 'contenu-plus',
    summary: 'Gain hors ligne plafonné, tick village.',
    since: '2.1',
    source: 'App.tsx',
  },
  {
    id: 'companions-collection',
    title: 'Collection compagnons',
    category: 'contenu-plus',
    summary: 'Affinité, stats, portraits, bonds.',
    since: '2.1',
    source: 'project-state',
  },

  // ——— UX / UI ———
  {
    id: 'wording-hub',
    title: 'Terminologie hub harmonisée',
    category: 'ux',
    summary: 'Chantier du havre, Chasse aux Myrions, Refuge des Myrions, Bâtiments du havre.',
    since: '2.2',
    source: 'project-state',
  },
  {
    id: 'tutorial-onboarding',
    title: 'Tutorial & objectifs guidés',
    category: 'ux',
    summary: 'Étapes déblocage, récompenses, navigation contextuelle.',
    since: '2.1',
    source: 'tutorialObjectives',
  },
  {
    id: 'next-step-guidance',
    title: 'Guide prochaine étape',
    category: 'ux',
    summary: 'Suggestion gameplay + conseil compagnon.',
    since: '2.1',
    source: 'App.tsx',
  },
  {
    id: 'save-migrations',
    title: 'Sauvegarde localStorage migrée',
    category: 'ux',
    summary: 'Migrations versionnées, compatibilité inter-versions.',
    since: '2.1',
    source: 'project-state',
  },

  // ——— QoL ———
  {
    id: 'asset-warmup',
    title: 'Préchargement assets (warmup)',
    category: 'qol',
    summary: 'Splash + village + gacha + myrions + hub + compagnons.',
    since: '2.2',
    source: 'gameWarmupPaths',
  },

  // ——— Assets ———
  {
    id: 'assets-2-root',
    title: 'Assets 2.0 — single root',
    category: 'assets',
    summary: 'Arborescence assets/ unique, plugin Vite repo-assets.',
    since: '2.0',
    source: 'VERSION-INDEX',
  },
  {
    id: 'companion-portraits',
    title: 'Portraits compagnons & backgrounds',
    category: 'assets',
    summary: 'Compagnons, backgrounds mini-jeux, gacha, village.',
    since: '2.1',
    source: 'assets/',
  },

  // ——— Dev / infra (joueur indirect) ———
  {
    id: 'validate-pipeline',
    title: 'Pipeline validation release',
    category: 'dev',
    summary: 'bonds, link-corpus, tnr:baseline, build.',
    since: '2.1',
    source: 'project-state',
  },
  {
    id: 'versionnement-xy',
    title: 'Versionnement UI X/Y',
    category: 'dev',
    summary: 'Hooks Cursor, DEV_LOG, build-revision.',
    since: '2.2',
    source: 'agent-guide',
  },
]
