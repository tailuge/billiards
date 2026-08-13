import { Scene } from "three"
import { Session } from "../network/client/session"
import { Portrait } from "./portrait"
import {
  MINUS_X_WALL,
  PLUS_X_WALL,
  PORTRAIT_SCALE,
  PortraitPlacement,
} from "./portraitplacements"

export const DEFAULT_EMOJI = "📺"

export interface PortraitMode {
  roomVisible: boolean
  singlePlayer: boolean
}

export interface PortraitSpec {
  emoji: string
  name?: string
  placement: PortraitPlacement
  scale?: number
}

/**
 * Decides which portraits to show for the current mode, separated from how
 * they are rendered. `mine` is always on the +X wall and the opponent on the
 * −X wall. Emoji is optional at every level (falls back to DEFAULT_EMOJI);
 * names are optional (the plaque hides when empty), so replay/spectator modes
 * work even though their emoji data is absent.
 */
export function portraitSpecs(
  mode: PortraitMode,
  session: Session
): PortraitSpec[] {
  if (!mode.roomVisible) return []

  // Spectators watch two other players; their own emoji/name are irrelevant
  // and the watched players' emojis are not transported, so names come from
  // the spectated fields and emojis fall back to the default.
  if (session.spectator) {
    return [
      {
        emoji: DEFAULT_EMOJI,
        name: session.spectatedP1Name || undefined,
        placement: PLUS_X_WALL,
      },
      {
        emoji: DEFAULT_EMOJI,
        name: session.spectatedP2Name || undefined,
        placement: MINUS_X_WALL,
      },
    ]
  }

  const mine: PortraitSpec = {
    emoji: session.customParams["emoji"] || DEFAULT_EMOJI,
    name: session.playername || undefined,
    placement: PLUS_X_WALL,
  }
  if (mode.singlePlayer) return [mine]

  return [
    mine,
    {
      emoji: session.opponentParams["emoji"] || DEFAULT_EMOJI,
      name: session.opponentName || undefined,
      placement: MINUS_X_WALL,
    },
  ]
}

/**
 * Builds and owns the game's portraits. `refresh()` re-reads Session so
 * late-arriving names (replay players, spectated players) appear without
 * rebuilding the meshes.
 */
export class Portraits {
  readonly list: Portrait[]

  constructor(
    scene: Scene,
    private readonly mode: PortraitMode
  ) {
    this.list = portraitSpecs(mode, Session.getInstance()).map(
      (spec) =>
        new Portrait(scene, {
          emoji: spec.emoji,
          name: spec.name,
          position: spec.placement.position,
          orientation: spec.placement.orientation,
          scale: spec.scale ?? PORTRAIT_SCALE,
        })
    )
  }

  refresh(): void {
    const specs = portraitSpecs(this.mode, Session.getInstance())
    specs.forEach((spec, i) => {
      this.list[i]?.setState({ emoji: spec.emoji, name: spec.name ?? "" })
    })
  }
}
