import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class PlaceBallEvent extends GameEvent {
  constructor() {
    super()
    this.type = EventType.PLACEBALL
  }

  applyToController(controller: Controller) {
    return controller.handleBegin(this)
  }
}
