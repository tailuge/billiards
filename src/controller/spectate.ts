import { ControllerBase } from "./controllerbase"
import { Controller, Input } from "./controller"

export class Spectate extends ControllerBase {
  constructor(container) {
    super(container)
    console.log("Spectate")
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
