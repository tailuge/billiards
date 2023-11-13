import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class StartAimEvent extends GameEvent {
  foul = 0

  constructor(foul = 0) {
    super()
    this.type = EventType.STARTAIM
    this.foul = foul
  }

  applyToController(controller: Controller) {
    return controller.handleStartAim(this)
  }

  static fromJson(json) {
    return new StartAimEvent(json.foul)
  }
}
