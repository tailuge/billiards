import { AbortEvent } from "../events/abortevent"
import { Container } from "./container"
import { Controller } from "./controller"
import { End } from "./end"

export class ControllerBase extends Controller {
  container: Container

  constructor(container: Container) {
    super(container)
  }

  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }
}
