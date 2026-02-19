import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"

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
    const [s1, s2] = this.container.rules.getScores()
    const b = this.container.rules.currentBreak
    this.container.sendScoreUpdate(s1, s2, b)

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
