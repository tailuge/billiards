import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class ConcedeEvent extends GameEvent {
  constructor() {
    super()
    this.type = EventType.CONCEDE
  }

  applyToController(controller: Controller): Controller {
    return controller.handleConcede(this)
  }
}
