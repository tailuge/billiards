import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class WatchEvent extends GameEvent {
  table

  constructor(json) {
    super()
    this.type = EventType.WATCHAIM
    this.table = json
  }

  applyToController(controller: Controller): Controller {
    return controller.handleWatch(this)
  }

  static fromJson(json) {
    let event = new WatchEvent(json)
    return event
  }
}
