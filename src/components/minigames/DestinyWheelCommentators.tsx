import type { CSSProperties } from 'react'
import type { CompanionEmotionId } from '../../data/companionAssets'
import { rarityBubbleTheme } from '../../data/destinyWheel/rarityRevealAnimations.ts'
import type { CommentatorBucket, CommentatorLine } from '../../data/destinyWheel/types'
import {
  sceneDialogueBubbleStyle,
  sceneLayerTransform,
  type DestinyWheelSceneLayoutCalibration,
  type SceneCalLayer,
} from '../../data/destinyWheel/destinyWheelSceneLayoutCalibration.ts'
import { CompanionPortrait } from '../CompanionPortrait'

type Anchor = 'laharl' | 'etna' | 'flonne'

type Props = {
  comment?: CommentatorLine
  resultRarity?: string
  speakerNames?: {
    laharl: string
    etna: string
    flonne: string
  }
  sceneLayout?: DestinyWheelSceneLayoutCalibration
  devLayoutPreview?: boolean
}

const DEV_PREVIEW_LAHARL: CommentatorLine = {
  speaker: 'laharl',
  text: 'Prévisualisation bulle Laharl — réduis la largeur pour voir le texte passer à la ligne automatiquement.',
  bucket: 'neutral',
}

const DEV_PREVIEW_RIGHT: CommentatorLine = {
  speaker: 'etna',
  text: 'Prévisualisation bulle droite — même test : largeur réduite, texte multiligne.',
  bucket: 'positive',
}

function sceneLayerStyle(layer?: SceneCalLayer): CSSProperties | undefined {
  if (!layer) return undefined
  if (!layer.visible) return { display: 'none' }
  return { transform: sceneLayerTransform(layer) }
}

function bubbleRarityProps(rarity?: string): { className: string; style?: CSSProperties } {
  const theme = rarityBubbleTheme(rarity)
  return {
    className: theme.className,
    style: theme.style,
  }
}

export function DestinyWheelCommentators({
  comment,
  resultRarity,
  speakerNames,
  sceneLayout,
  devLayoutPreview = false,
}: Props) {
  const laharlName = speakerNames?.laharl ?? 'Laharl'
  const etnaName = speakerNames?.etna ?? 'Etna'
  const flonneName = speakerNames?.flonne ?? 'Flonne'

  const effectiveComment = devLayoutPreview ? DEV_PREVIEW_LAHARL : comment
  const showRightPreview = devLayoutPreview || (comment?.speaker === 'etna' || comment?.speaker === 'flonne')
  const showLaharlBubble = devLayoutPreview || effectiveComment?.speaker === 'laharl'
  const activeResultRarity = devLayoutPreview ? 'mythic' : resultRarity

  const COMMENTATORS: { id: Anchor; name: string }[] = [
    { id: 'laharl', name: laharlName },
    { id: 'etna', name: etnaName },
    { id: 'flonne', name: flonneName },
  ]

  const rightSpeaker = devLayoutPreview
    ? 'etna'
    : comment?.speaker === 'etna' || comment?.speaker === 'flonne'
      ? comment.speaker
      : null
  const rightName = rightSpeaker === 'etna' ? etnaName : flonneName
  const rightComment = devLayoutPreview ? DEV_PREVIEW_RIGHT : comment
  const laneLayer = sceneLayout?.commentBubbleLane
  const laharlBubbleLayer = sceneLayout?.laharlBubble
  const laharlBubbleText = devLayoutPreview
    ? DEV_PREVIEW_LAHARL.text
    : effectiveComment?.speaker === 'laharl'
      ? effectiveComment.text
      : undefined
  const useSceneBubbleLayout = !!sceneLayout
  const laharlRarity = bubbleRarityProps(showLaharlBubble ? activeResultRarity : undefined)
  const laneRarity = bubbleRarityProps(showRightPreview && rightComment ? activeResultRarity : undefined)

  return (
    <div className="dw-commentators" aria-live="polite">
      {showLaharlBubble && laharlBubbleText && laharlBubbleLayer?.visible !== false ? (
        <div
          className={[
            'dw-commentator-bubble',
            'dw-commentator-bubble--laharl',
            'dw-commentator-bubble--scene-root',
            useSceneBubbleLayout ? 'dw-commentator-bubble--calibrated' : '',
            devLayoutPreview ? 'dw-commentator-bubble--dev-preview' : '',
            laharlRarity.className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            ...(useSceneBubbleLayout ? sceneDialogueBubbleStyle(laharlBubbleLayer, 'laharl') : undefined),
            ...laharlRarity.style,
          }}
        >
          <span className="dw-commentator-bubble-speaker">{laharlName}</span>
          <p className="dw-commentator-bubble-text">{laharlBubbleText}</p>
        </div>
      ) : null}

      {showRightPreview && rightComment && laneLayer?.visible !== false ? (
        <div
          className={[
            'dw-commentator-bubble-lane',
            'dw-commentator-bubble--scene-root',
            useSceneBubbleLayout ? 'dw-commentator-bubble--calibrated' : '',
            devLayoutPreview ? 'dw-commentator-bubble--dev-preview' : '',
            laneRarity.className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            ...(useSceneBubbleLayout ? sceneDialogueBubbleStyle(laneLayer, 'lane') : undefined),
            ...laneRarity.style,
          }}
        >
          <span className="dw-commentator-bubble-speaker">{rightName}</span>
          <p className="dw-commentator-bubble-text">{rightComment.text}</p>
        </div>
      ) : null}

      {COMMENTATORS.map((speaker) => {
        const layer =
          speaker.id === 'laharl'
            ? sceneLayout?.laharl
            : speaker.id === 'etna'
              ? sceneLayout?.etna
              : sceneLayout?.flonne
        if (layer && !layer.visible) return null
        return (
          <CommentatorSlot
            key={speaker.id}
            anchor={speaker.id}
            name={speaker.name}
            comment={effectiveComment}
            resultRarity={activeResultRarity}
            sceneStyle={sceneLayerStyle(layer)}
            useSceneBubbleLayout={useSceneBubbleLayout}
          />
        )
      })}
    </div>
  )
}

function CommentatorSlot({
  anchor,
  name,
  comment,
  resultRarity,
  sceneStyle,
  useSceneBubbleLayout,
}: {
  anchor: Anchor
  name: string
  comment?: CommentatorLine
  resultRarity?: string
  sceneStyle?: CSSProperties
  useSceneBubbleLayout?: boolean
}) {
  const active = comment?.speaker === anchor
  const emotion = active && comment ? bucketToEmotion(comment.bucket) : 'neutral'
  const showLegacyLaharlBubble =
    !useSceneBubbleLayout && anchor === 'laharl' && active && comment
  const legacyRarity = bubbleRarityProps(showLegacyLaharlBubble ? resultRarity : undefined)

  return (
    <div className={`dw-commentator-slot dw-commentator-slot--${anchor}`} style={sceneStyle}>
      <div
        className={['dw-commentator', active ? 'dw-commentator--speaking' : ''].filter(Boolean).join(' ')}
      >
        {showLegacyLaharlBubble ? (
          <div
            className={['dw-commentator-bubble', 'dw-commentator-bubble--laharl', legacyRarity.className]
              .filter(Boolean)
              .join(' ')}
            style={legacyRarity.style}
          >
            <span className="dw-commentator-bubble-speaker">{name}</span>
            <p className="dw-commentator-bubble-text">{comment.text}</p>
          </div>
        ) : null}
        <div className="dw-commentator-portrait">
          <CompanionPortrait
            companionId={anchor}
            level={1}
            alt={name}
            cutoutOnly
            fitContain
            emotion={emotion}
            className={['dw-commentator-cutout', active ? '' : 'dw-commentator-cutout--idle']
              .filter(Boolean)
              .join(' ')}
          />
        </div>
      </div>
    </div>
  )
}

function bucketToEmotion(bucket: CommentatorBucket): CompanionEmotionId {
  switch (bucket) {
    case 'positive':
      return 'happy'
    case 'negative':
      return 'annoyed'
    case 'contradiction':
      return 'surprised'
    default:
      return 'neutral'
  }
}
