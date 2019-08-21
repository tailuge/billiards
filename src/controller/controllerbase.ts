import { AbortEvent } from "../events/abortevent"
import { Container } from "./container"
import { Controller, BeginEvent } from "./controller"
import { End } from "./end"
import { Init } from "./init";

export abstract class ControllerBase extends Controller {
  container: Container

  constructor(container: Container) {
    super(container)
  }

  handleAbort(_: AbortEvent): Controller {
    return new End(this.container)
  }

  handleBegin(_: BeginEvent): Controller {
    return new Init(this.container)
  }

}
