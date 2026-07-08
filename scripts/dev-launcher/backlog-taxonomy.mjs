/** Taxonomie backlog — statut (cycle de vie) vs catégorie (tri). */

export const BACKLOG_CATEGORIES = [
  { id: 'ui', label: 'UI' },
  { id: 'ux', label: 'UX' },
  { id: 'qol', label: 'Qualité de vie' },
  { id: 'dev', label: 'Dev / outillage & debug' },
  { id: 'contenu-plus', label: 'Contenu additionnel' },
  { id: 'contenu-modif', label: 'Modif contenu' },
  { id: 'minijeu', label: 'Mini-jeu / mode' },
  { id: 'parler', label: 'Parler / dialogue' },
  { id: 'assets', label: 'Assets / visuel' },
  { id: 'infra', label: 'Infra / repo' },
  { id: 'event', label: 'Event / invité' },
  { id: 'meta', label: 'Meta / doc' },
]

export const BACKLOG_STATUS_PRESETS = [
  'idée',
  'à affiner',
  'actif',
  'backlog',
  'reporté',
  'abandonné',
  'done',
]

/** @param {string} [id] */
export function categoryLabel(id) {
  if (!id) return 'Sans catégorie'
  return BACKLOG_CATEGORIES.find((row) => row.id === id)?.label ?? id
}

/** @param {unknown} raw */
export function normalizeStatusValue(raw) {
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s) return ''
  if (/^(idée|idee)\b/.test(s)) return 'idée'
  if (/à affiner|^a affiner/.test(s)) return 'à affiner'
  if (/^actif\b/.test(s)) return 'actif'
  if (/^backlog\b/.test(s)) return 'backlog'
  if (/^reporté|^reporte\b/.test(s)) return 'reporté'
  if (/^abandonné|^abandonne\b/.test(s)) return 'abandonné'
  if (/^(done|terminé|termine)\b/.test(s)) return 'done'
  if (/^maybe\b/.test(s)) return 'maybe'
  return ''
}

/** @param {unknown} raw */
export function normalizeCategoryValue(raw) {
  const s = String(raw ?? '').trim().toLowerCase()
  if (!s) return ''
  const byId = BACKLOG_CATEGORIES.find((row) => row.id === s)
  if (byId) return byId.id
  const byLabel = BACKLOG_CATEGORIES.find((row) => row.label.toLowerCase() === s)
  if (byLabel) return byLabel.id
  if (/^dev|tech/.test(s)) return 'dev'
  if (/^ui\b/.test(s)) return 'ui'
  if (/^ux\b/.test(s)) return 'ux'
  if (/qualité|qualite|qol/.test(s)) return 'qol'
  if (/additionnel|contenu-plus/.test(s)) return 'contenu-plus'
  if (/modif/.test(s)) return 'contenu-modif'
  if (/mini|jeu|game|mode/.test(s)) return 'minijeu'
  if (/parler|dialogue|corpus/.test(s)) return 'parler'
  if (/asset|visuel|skin|portrait/.test(s)) return 'assets'
  if (/infra|repo|archive/.test(s)) return 'infra'
  if (/event|invité|invite|disagrea/.test(s)) return 'event'
  if (/meta|doc/.test(s)) return 'meta'
  return ''
}

/**
 * Découpe un ancien **Statut :** verbeux en statut court + note éventuelle.
 * @param {string} raw
 */
export function splitLegacyStatus(raw) {
  const text = String(raw ?? '').trim()
  if (!text) return { status: '', note: '' }

  const direct = normalizeStatusValue(text)
  if (direct) {
    const rest = text.replace(/^(idée|idee|à affiner|a affiner|actif|backlog|reporté|reporte|abandonné|abandonne|done|maybe)\s*[—–-]?\s*/i, '').trim()
    return { status: direct, note: rest && rest !== text ? rest : '' }
  }

  const prefix = text.match(/^([a-zàâäéèêëïîôùûüç0-9.+\s]+?)(?:\s*[—–(-]|$)/i)
  if (prefix) {
    const head = prefix[1].trim()
    const fromHead = normalizeStatusValue(head)
    if (fromHead) {
      const note = text.slice(prefix[0].length).replace(/^[—–(-\s]+/, '').trim()
      return { status: fromHead, note: note || text }
    }
  }

  return { status: '', note: text }
}

/**
 * Catégorie backlog alignée — heuristique sur texte + contexte section DEV_LOG.
 * @param {string} text
 * @param {{ sectionTitle?: string, source?: string }} [hints]
 */
export function inferChangeCategory(text, hints = {}) {
  const blob = `${text} ${hints.sectionTitle ?? ''} ${hints.source ?? ''}`.toLowerCase()

  if (/parler|corpus|lyra|ma[eë]ve|runa|aff\s*\d|relecture|writer|intimate|link-corpus|curated|conversation|dialogue de lien/.test(blob)) {
    return 'parler'
  }
  if (
    /lanceur|launcher|dev-launcher|audit|monitoring|hook|validate:|npm run|debug|version:prompt|version:task|dev_log|changelog|backlog-store|product-changelog|stack a\.b|semver|build-revision|cursor/.test(
      blob,
    )
  ) {
    return 'dev'
  }
  if (/disagrea|event.invit|compagnons invit|pleinair|skinline|skin premium|bannière event/.test(blob)) {
    return 'event'
  }
  if (/mini-jeu|minijeu|refuge|dressage|myrion|combat|gacha|ferme lunaire|biome|filon|wheel|destiny|chantier|chasse|roue du/.test(blob)) {
    return 'minijeu'
  }
  if (/png|asset|portrait|manifest|webp|visual|chibi|background|splash|skinline|warmup|cache.*asset|chargement asset/.test(blob)) {
    return 'assets'
  }
  if (/wording|tutorial|onboarding|quête|quest|hub|navigation|toast|popover|ux\b|flux joueur/.test(blob)) {
    return 'ux'
  }
  if (/css|layout|fullscreen|écran|loading|menu |bouton|modal|panel|ui\b|label ui|badge|onglet/.test(blob)) {
    return 'ui'
  }
  if (/fluidif|perf|qualit[eé] de vie|qol|warmup|cache navigateur|pr[eé]charg|confort|passif/.test(blob)) {
    return 'qol'
  }
  if (/old_assets|archive|gitignore|repo|infra|migrate|cleanup|kickoff|agent-guide|handoff|traceabilit|docs\//.test(blob)) {
    return 'infra'
  }
  if (/meta|template|comment ajouter|convention|politique version/.test(blob)) {
    return 'meta'
  }
  if (/nouveau|additionnel|extension|onglets ferme|skinline|contenu addition|feature|impl[eé]ment/.test(blob)) {
    return 'contenu-plus'
  }
  if (/modif|harmon|wording|corpus|bond|compagnon|contenu|mise à jour|maj\b/.test(blob)) {
    return 'contenu-modif'
  }
  return 'meta'
}
