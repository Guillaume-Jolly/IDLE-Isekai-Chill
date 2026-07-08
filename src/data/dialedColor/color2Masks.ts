/**
 * Masques PNG offline — actifs in-game seulement si approuvés manuellement.
 * Génération : `npm run color-toon:masks -- laharl`
 * Validation : ouvrir `staging/mini jeu/color 2/masks/{id}/_debug-{zone}.png`
 */

/** promptId → URL runtime. Vide = pas de teintage masqué (portrait + pastille seulement). */
const APPROVED_MASKS: Record<string, string> = {
  // Ex. après validation humaine :
  // 'laharl-hair': '/assets/companions/laharl/mask-hair.png',
}

export function getColor2MaskSrc(promptId: string): string | undefined {
  return APPROVED_MASKS[promptId]
}

export function hasApprovedColor2Mask(promptId: string): boolean {
  return promptId in APPROVED_MASKS
}
