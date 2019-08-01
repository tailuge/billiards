import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class HitEvent extends GameEvent {
  json

  constructor(json) {
    super()
    this.type = EventType.HIT
    this.json = json
  }

  applyToController(controller: Controller): Controller {
    return controller.handleHit(this)
  }

  static fromJson(json) {
    let event = new HitEvent(json)
    return event
  }
}
