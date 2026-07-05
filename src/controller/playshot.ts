import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { Session } from "../network/client/session"
import { Outcome } from "../model/outcome"

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
    let speedrunFoul: string | null = null
    let speedrunNoPot = false
    if (Session.isSpeedrunMode()) {
      speedrunFoul = this.container.rules.foulReason(outcome)
      if (!speedrunFoul && Outcome.potCount(outcome) === 0) {
        speedrunNoPot = true
      }
    }

    const nextController = this.container.rules.update(outcome)
    const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()

    const b = this.container.rules.currentBreak
    const active = this.container.inferActivePlayer(nextController)
    this.container.sendScoreUpdate(s1, s2, b, active)

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

    if (speedrunFoul) {
      globalThis.parent?.postMessage(
        { type: "speedrun-result", status: "fail", reason: speedrunFoul },
        "*"
      )
    } else if (speedrunNoPot) {
      globalThis.parent?.postMessage(
        { type: "speedrun-result", status: "fail", reason: "No pot" },
        "*"
      )
    }

    return nextController
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
