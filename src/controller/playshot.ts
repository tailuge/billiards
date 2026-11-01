import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { Session } from "../network/client/session"
import { Outcome } from "../model/outcome"

const CAROM_RULES = ["sagu", "threecushion", "libre"]

/**
 * PlayShot starts balls rolling using cue state, applies rules to outcome
 *
 */
export class PlayShot extends ControllerBase {
  override get name() {
    return "PlayShot"
  }
  constructor(container) {
    super(container)
    this.hit()
  }

  override onFirst() {
    this.container.table.cue.aimInputs?.animateSliderHit()
  }

  override handleStationary(_) {
    const table = this.container.table
    const outcome = table.outcome

    // Speedrun failure check must run BEFORE rules.update() mutates state
    // (snooker's update() changes targetIsRed/previousPotRed which foulReason reads)
    // The break the run ended on also has to be read here: update() calls
    // startTurn() on a failed shot, which zeroes currentBreak.
    let speedrunEnd: string | null = null
    let speedrunBreak = 0
    if (Session.isSpeedrunMode()) {
      speedrunEnd = this.speedrunEndReason(outcome)
      speedrunBreak = this.container.rules.currentBreak
    }

    const nextController = this.container.rules.update(outcome)
    const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()

    const b = this.container.rules.currentBreak
    const active = this.container.inferActivePlayer(nextController)
    this.container.sendScoreUpdate(s1, s2, b, active, nextController.name)

    const isPartOfBreak = this.container.rules.isPartOfBreak(outcome)
    const isEndOfGame = this.container.rules.isEndOfGame(outcome)
    this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame)
    table.cue?.aimAtNext(
      table.cueball,
      this.container.rules.nextCandidateBall()
    )

    if (globalThis.parent !== (globalThis as any)) {
      globalThis.parent.postMessage(
        {
          type: "stationary",
          outcome: this.container.table.outcome.map((o) => o.serialise()),
          table: this.container.table.serialise(),
        },
        "*"
      )
    }

    if (speedrunEnd) {
      globalThis.parent?.postMessage(
        {
          type: "speedrun-result",
          status: "fail",
          reason: speedrunEnd,
          break: speedrunBreak,
          score: Session.getInstance().myScore(),
        },
        "*"
      )
    }

    return nextController
  }

  /** Why this shot ended a speedrun attempt, or null while the run continues. */
  private speedrunEndReason(outcome: Outcome[]): string | null {
    const foul = this.container.rules.foulReason(outcome)
    if (foul) {
      return foul
    }
    // Carom rules have no pockets, so there is nothing to pot and the run ends
    // when the scoring break ends instead.
    if (CAROM_RULES.includes(this.container.rules.rulename)) {
      return this.container.rules.isPartOfBreak(outcome) ? null : "Break over"
    }
    return Outcome.potCount(outcome) === 0 ? "No pot" : null
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
