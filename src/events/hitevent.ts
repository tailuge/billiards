import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class HitEvent extends GameEvent {
  table

  constructor(json) {
    super()
    this.type = EventType.RACK
    this.table = json
  }

  applyToController(controller: Controller): Controller {
    return controller.handleHit(this)
  }

  static fromJson(json) {
    let event = new HitEvent(json)
    return event
  }
}
