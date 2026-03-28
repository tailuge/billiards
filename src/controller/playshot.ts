import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { Session } from "../network/client/session"

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

  override handleStationary(_) {
    const table = this.container.table
    const outcome = table.outcome
    const nextController = this.container.rules.update(outcome)
    const { p1: s1, p2: s2 } = Session.getInstance().orderedScoresForHud()

    const b = this.container.rules.currentBreak
    const active = this.container.inferActivePlayerFromControllerName(
      nextController.name
    )
    this.container.sendScoreUpdate(s1, s2, b, active)

    const isPartOfBreak = this.container.rules.isPartOfBreak(outcome)
    const isEndOfGame = this.container.rules.isEndOfGame(outcome)
    this.container.recorder.updateBreak(outcome, isPartOfBreak, isEndOfGame)
    table.cue.aimAtNext(table.cueball, this.container.rules.nextCandidateBall())

    return nextController
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
