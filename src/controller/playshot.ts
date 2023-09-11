import { Controller, Input } from "./controller"
import { ControllerBase } from "./controllerbase"
import { Rules } from "../rules/rules"
import { NineBall } from "../rules/nineball"

/**
 * PlayShot starts balls rolling using cue state, applies rules to outcome
 *
 */
export class PlayShot extends ControllerBase {
  rules: Rules

  constructor(container) {
    super(container)
    this.rules = new NineBall(container)
    this.hit()
  }

  override handleStationary(_) {
    const table = this.container.table
    return this.rules.update(table.outcome)
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
