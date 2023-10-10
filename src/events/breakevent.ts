import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class BreakEvent extends GameEvent {
  init
  shots
  retry
  constructor(init?, shots?) {
    super()
    this.init = init
    this.shots = shots
    this.type = EventType.BREAK
  }

  applyToController(controller: Controller) {
    return controller.handleBreak(this)
  }

  static fromJson(json) {
    return new BreakEvent(json.init, json.shots)
  }
}
