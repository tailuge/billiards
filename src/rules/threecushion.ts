import { Container } from "../container/container"
import { Aim } from "../controller/aim"
import { Controller } from "../controller/controller"
import { Outcome } from "../model/outcome"
import { Rack } from "../utils/rack"
import { Rules } from "./rules"

export class ThreeCushion implements Rules {
  readonly container: Container

  constructor(container) {
    this.container = container
  }

  rack() {
    return Rack.three()
  }

  update(_: Outcome[]): Controller {
    return new Aim(this.container)
  }
}
