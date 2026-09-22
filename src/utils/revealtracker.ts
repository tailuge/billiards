import { Ball } from "../model/ball"
import { Outcome, OutcomeType } from "../model/outcome"

/** Minimal reveal surface the tracker drives; RevealTexture satisfies it. */
export interface RevealSurface {
  reveal(fraction: number): number
}

/**
 * Drives the ?image= cloth reveal for the solo reveal ruletype from the growing
 * shot outcome. While the balls are rolling the pot count runs ahead of the
 * authoritative score, so the cloth fills as they drop; taking the max with the
 * score keeps it in sync once the shot settles (and with replay ScoreEvents)
 * without the rules or the score funnel touching the view.
 *
 * The outcome array is replaced at the start of every shot, which is also the
 * shot boundary: that is when the pot count and baseline score reset, so a
 * settled shot's pots are never counted twice.
 */
export class RevealTracker {
  private outcomeRef: Outcome[] | null = null
  private lastIndex = 0
  private potsSoFar = 0
  private baselineScore = 0

  constructor(
    private readonly reveal: RevealSurface,
    private readonly total: number
  ) {}

  update(score: number, outcome: Outcome[], cueball: Ball): void {
    if (outcome !== this.outcomeRef) {
      this.outcomeRef = outcome
      this.lastIndex = 0
      this.potsSoFar = 0
      this.baselineScore = score
    }

    for (; this.lastIndex < outcome.length; this.lastIndex++) {
      const entry = outcome[this.lastIndex]
      // A potted cue ball is not scored, but object balls on the same shot are.
      if (entry.type === OutcomeType.Pot && entry.ballA !== cueball) {
        this.potsSoFar++
      }
    }

    const ahead = this.baselineScore + this.potsSoFar
    this.reveal.reveal(Math.max(score, ahead) / this.total)
  }
}
