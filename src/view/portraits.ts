import { Scene } from "three"
import { Session } from "../network/client/session"
import { Portrait } from "./portrait"
import {
  minusXWall,
  plusXWall,
  PORTRAIT_SCALE,
  PortraitPlacement,
} from "./portraitplacements"

export const DEFAULT_EMOJI = "📺"

// Regional-indicator symbol for "A" (U+1F1E6); the letters A–Z are contiguous.
const REGIONAL_INDICATOR_A = 0x1f1e6

/**
 * Best-effort flag emoji for the player's browser locale (e.g. "en-GB" →
 * 🇬🇧). Reads the BCP 47 region subtag from `navigator.language` and converts
 * it to a pair of regional-indicator symbols; falls back to `DEFAULT_EMOJI`
 * when the locale carries no usable two-letter region.
 */
export function localeFlagEmoji(): string {
  if (typeof navigator === "undefined") return DEFAULT_EMOJI
  const locale = navigator.language
  // en-US is a near-universal OS default that rarely reflects the player's
  // real country, so show a globe instead of a misleading 🇺🇸.
  if (locale.toLowerCase() === "en-us") return "🌎"
  const region = locale.split("-").pop()?.toUpperCase() ?? ""
  if (!/^[A-Z]{2}$/.test(region)) return DEFAULT_EMOJI
  return String.fromCodePoint(
    REGIONAL_INDICATOR_A + (region.charCodeAt(0) - 65),
    REGIONAL_INDICATOR_A + (region.charCodeAt(1) - 65)
  )
}

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
 * −X wall. Emoji is optional at every level (falls back to a locale flag, or
 * DEFAULT_EMOJI when the browser exposes no region); names are optional (the
 * plaque hides when empty), so replay/spectator modes work even though their
 * emoji data is absent.
 */
export function portraitSpecs(
  mode: PortraitMode,
  session: Session,
  wallX: number
): PortraitSpec[] {
  if (!mode.roomVisible) return []

  // Spectators watch two other players; their own emoji/name are irrelevant
  // and the watched players' emojis are not transported, so names come from
  // the spectated fields and emojis fall back to the default.
  if (session.spectator) {
    return [
      {
        emoji: localeFlagEmoji(),
        name: session.spectatedP1Name || undefined,
        placement: plusXWall(wallX),
      },
      {
        emoji: localeFlagEmoji(),
        name: session.spectatedP2Name || undefined,
        placement: minusXWall(wallX),
      },
    ]
  }

  const mine: PortraitSpec = {
    emoji: session.customParams["emoji"] || localeFlagEmoji(),
    name: session.playername || undefined,
    placement: plusXWall(wallX),
  }
  if (mode.singlePlayer) return [mine]

  return [
    mine,
    {
      emoji: session.opponentParams["emoji"] || localeFlagEmoji(),
      name: session.opponentName || undefined,
      placement: minusXWall(wallX),
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
    private readonly mode: PortraitMode,
    private readonly wallX: number
  ) {
    this.list = portraitSpecs(mode, Session.getInstance(), wallX).map(
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
    const specs = portraitSpecs(this.mode, Session.getInstance(), this.wallX)
    specs.forEach((spec, i) => {
      this.list[i]?.setState({ emoji: spec.emoji, name: spec.name ?? "" })
    })
  }
}
