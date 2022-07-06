import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class HitEvent extends GameEvent {
  tablejson

  constructor(tablejson) {
    super()
    this.type = EventType.HIT
    this.tablejson = tablejson
  }

  applyToController(controller: Controller): Controller {
    return controller.handleHit(this)
  }

  static fromJson(json) {
    const event = new HitEvent(json.tablejson)
    return event
  }
}
