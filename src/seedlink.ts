/**
 * Seed handoff between the live game and the standalone analysis page.
 *
 * The drill panel encodes the pre-shot state (balls + cue + shot + model) into a
 * URL query param and opens `aimsensitivity.html?init=...` in a new tab — the
 * same JSONCrush path the replay links use (see src/view/link-formatter.ts), so
 * the game page is never disturbed. The analysis page decodes it back.
 */
import JSONCrush from "jsoncrush"
import { ReplayEncoder } from "./utils/replay-encoder"
import { BallPos, ShotParams } from "./sensitivity"

/** Everything the analysis page needs to reproduce and explore a shot. */
export interface AnalysisSeed {
  balls: BallPos[]
  cueBallId: number
  shot: ShotParams
  ruleType: string
  cushionModel: string
}

/** Default page the analysis opens in. */
export const ANALYSIS_PAGE = "aimsensitivity.html"

/** Encode a seed into a URL-safe query value (JSONCrush + full URI encoding). */
export function encodeAnalysisSeed(seed: AnalysisSeed): string {
  const json = JSON.stringify(seed)
  return ReplayEncoder.fullyEncodeURI(ReplayEncoder.crush(json))
}

/** Full `aimsensitivity.html?init=...` URL for a seed. */
export function buildAnalysisUrl(seed: AnalysisSeed, page = ANALYSIS_PAGE): string {
  return `${page}?init=${encodeAnalysisSeed(seed)}`
}

/**
 * Decode the `init` query value back into a seed. In normal use the value comes
 * from URLSearchParams.get (already percent-decoded), but we also accept a still
 * URI-encoded value and plain JSON, so the decode is symmetric with
 * encodeAnalysisSeed regardless of who un-percent-encoded it.
 */
export function decodeAnalysisSeed(initParam: string): AnalysisSeed {
  let uriDecoded = initParam
  try {
    uriDecoded = decodeURIComponent(initParam)
  } catch {
    // already decoded (or contains a stray %) — fall through with the original
  }
  for (const candidate of [initParam, uriDecoded]) {
    try {
      return JSON.parse(candidate) as AnalysisSeed
    } catch {
      /* not plain JSON */
    }
    try {
      return JSON.parse(JSONCrush.uncrush(candidate)) as AnalysisSeed
    } catch {
      /* not crushed in this form */
    }
  }
  throw new Error("unrecognised init payload")
}
