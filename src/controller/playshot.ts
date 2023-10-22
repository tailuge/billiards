import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"

/**
 * PlayShot starts balls rolling using cue state, applies rules to outcome
 *
 */
export class PlayShot extends ControllerBase {
  constructor(container) {
    super(container)
    this.hit()
  }

  override handleStationary(_) {
    const table = this.container.table
    const outcome = table.outcome
    table.cue.aimAtNext(table)
    const nextController = this.container.rules.update(outcome)
    this.container.recoder.updateBreak(outcome)
    return nextController
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
