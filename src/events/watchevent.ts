import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class WatchEvent extends GameEvent {
  json

  constructor(json) {
    super()
    this.type = EventType.WATCHAIM
    this.json = json
  }

  applyToController(controller: Controller): Controller {
    return controller.handleWatch(this)
  }

  static fromJson(json) {
    const event = new WatchEvent(json)
    return event
  }
}
