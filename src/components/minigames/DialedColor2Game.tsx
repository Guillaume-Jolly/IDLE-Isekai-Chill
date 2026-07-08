import type { MinigameProps } from './MinigameFrame'
import { DialedColorGameCore } from './dialedColor/DialedColorGameCore'

/** Color Toon — teintes Disagrea depuis mémoire (inspiré Dialed Color²). */
export function DialedColor2Game(props: MinigameProps) {
  return <DialedColorGameCore {...props} variant="toon" />
}
