import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class StationaryEvent extends GameEvent {
  constructor() {
    super()
    this.type = EventType.STATIONARY
  }

  applyToController(controller: Controller): Controller {
    return controller.handleStationary(this)
  }
}
