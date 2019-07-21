import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RackEvent extends GameEvent {
  table

  constructor(json) {
    super()
    this.type = EventType.RACK
    this.table = json
  }

  applyToController(controller: Controller): Controller {
    return controller.handleRack(this)
  }

  static fromJson(json) {
    let event = new RackEvent(json)
    return event
  }
}
