import type { MinigameProps } from './MinigameFrame'
import { DialedColorGameCore } from './dialedColor/DialedColorGameCore'

/** Mémoire des teintes — pastilles abstraites (inspiré Dialed Color). */
export function DialedColorGame(props: MinigameProps) {
  return <DialedColorGameCore {...props} variant="abstract" />
}
