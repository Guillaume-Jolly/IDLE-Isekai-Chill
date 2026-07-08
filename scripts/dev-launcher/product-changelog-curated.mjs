/** Jalons produit A.B — versions livrées avant la phase 2.2 (curaté). */

/** @type {import('./product-changelog.mjs').ReleaseBlock[]} */
export const CURATED_RELEASES_AB = [
  {
    ab: '2.1',
    semver: '2.1.0',
    title: 'Release 2.1 — Ferme lunaire étendue',
    dateStart: '2026-06-30',
    dateEnd: '2026-06-30',
    status: 'livrée',
    tag: 'v2.1.0.0',
    summary:
      'Release majeure sur main — 15 biomes, corpus liens validé, validations release gate OK.',
    source: 'VERSION-INDEX · project-state · HANDOFF_2_2',
    changes: [
      { type: 'add', category: 'minijeu', text: 'Ferme lunaire — 15 biomes, 45 filons, supervision, prestige' },
      { type: 'add', category: 'parler', text: '19 compagnons · 190 conversations de lien (corpus ~7500 entrées)' },
      { type: 'add', category: 'minijeu', text: 'Myrions — capture, refuge / promenade, dressage, reproduction' },
      { type: 'add', category: 'contenu-plus', text: 'Hub mini-jeux, gacha, inventaire, quêtes, production passive' },
      { type: 'add', category: 'dev', text: 'Pipeline validation release — bonds, corpus, tnr:baseline, build' },
      { type: 'mod', category: 'ux', text: 'Terminologie harmonisée — Promenade Myrions, Ferme lunaire (MVP 20)' },
      { type: 'info', category: 'infra', text: 'Tag git v2.1.0.0 · merge PR #3 @ 8e50e13' },
    ],
  },
  {
    ab: '2.0',
    semver: '2.0.0',
    title: 'Assets 2.0 — architecture single-root',
    dateStart: '2026-06-25',
    dateEnd: '2026-06-26',
    status: 'livrée',
    summary: 'Migration assets runtime vers `assets/` unique, cold storage, TNR baseline.',
    source: 'VERSION-INDEX · entries/2026-06-25',
    changes: [
      { type: 'add', category: 'dev', text: 'Plugin Vite `repo-assets` — pont assets/ → URLs runtime' },
      { type: 'add', category: 'assets', text: 'Arborescence cible Compagnons / Background / Myrions / Gacha / Prompts' },
      { type: 'add', category: 'infra', text: 'Scripts migrate public → old_assets · inventaire manifest' },
      { type: 'mod', category: 'ux', text: 'Chantier MVP 3–4 — déblocages, toast récompenses, polish UX, minage' },
      { type: 'mod', category: 'minijeu', text: 'Myrion MVP 2 — 3 biomes, production passive, supervision' },
      { type: 'del', category: 'infra', text: 'Miroirs public/assets retirés — cold storage `old_assets/` documenté' },
      { type: 'info', category: 'dev', text: 'TNR baseline · validate:link-corpus · build OK post-migration' },
    ],
  },
  {
    ab: '1.0',
    semver: '1.0.1',
    title: 'Baseline pré-V2 — produit jouable',
    dateStart: '2026-06-24',
    dateEnd: '2026-06-25',
    status: 'archive',
    summary: 'Fondations idle / collection avant semver 2.x et refonte assets.',
    source: 'VERSION-INDEX',
    changes: [
      { type: 'info', category: 'contenu-plus', text: 'Produit jouable navigateur — village, compagnons, mini-jeux core' },
      { type: 'add', category: 'dev', text: 'Guides agents + politique versionnement X/Y (format v1.0.1.43.xxx)' },
      { type: 'add', category: 'meta', text: 'Playbooks staging 07–11 · traçabilité docs/traceability/' },
      { type: 'mod', category: 'assets', text: 'Session dev Assets 2.0 / HMR — préparation migration 2.0' },
    ],
  },
]
