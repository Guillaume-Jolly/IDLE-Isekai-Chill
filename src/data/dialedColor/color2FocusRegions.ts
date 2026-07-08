/**
 * Zones de focus (clip-path %) pour Color Toon — portraits affinity-1 centrés.
 * Coordonnées en pourcentage de la boîte image.
 */
const FOCUS_CLIPS: Record<string, string> = {
  hair: 'polygon(16% 0%, 84% 0%, 90% 38%, 10% 38%)',
  eyes: 'ellipse(50% 24% 24% 7%)',
  wings: 'polygon(0% 12%, 32% 8%, 34% 58%, 0% 62%, 100% 12%, 68% 8%, 66% 58%, 100% 62%)',
  boots: 'polygon(10% 76%, 90% 76%, 94% 100%, 6% 100%)',
  belt: 'polygon(26% 46%, 74% 46%, 76% 56%, 24% 56%)',
  ribbon: 'polygon(6% 6%, 38% 2%, 40% 30%, 8% 34%, 62% 2%, 94% 6%, 92% 34%, 60% 30%)',
  tunic: 'polygon(20% 30%, 80% 30%, 84% 64%, 16% 64%)',
  cross: 'polygon(40% 36%, 60% 36%, 60% 56%, 40% 56%)',
  scarf: 'polygon(18% 26%, 82% 26%, 86% 44%, 14% 44%)',
  pants: 'polygon(22% 50%, 78% 50%, 82% 94%, 18% 94%)',
  buckle: 'polygon(43% 49%, 57% 49%, 57% 59%, 43% 59%)',
  bow: 'polygon(28% 0%, 72% 0%, 78% 24%, 22% 24%)',
  dress: 'polygon(16% 34%, 84% 34%, 90% 80%, 10% 80%)',
  trim: 'polygon(10% 34%, 24% 34%, 26% 78%, 12% 78%, 76% 34%, 90% 34%, 88% 78%, 74% 78%)',
}

export function getColor2FocusClipPath(promptId: string): string {
  const part = promptId.includes('-') ? promptId.split('-').slice(1).join('-') : promptId
  return FOCUS_CLIPS[part] ?? 'ellipse(50% 38% 36% 28%)'
}
