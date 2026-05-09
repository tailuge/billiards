import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class StartAimEvent extends GameEvent {
  constructor() {
    super()
    this.type = EventType.STARTAIM
  }

  applyToController(controller: Controller) {
    return controller.handleStartAim(this)
  }

  static fromJson() {
    return new StartAimEvent()
  }
}
