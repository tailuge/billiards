import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { AimEvent, Controller } from "../controller/controller"

export class HitEvent extends GameEvent {
  json
  aim
  constructor(json) {
    super()
    this.type = EventType.HIT
    this.json = json
    this.aim = AimEvent.fromJson(json)
  }

  applyToController(controller: Controller): Controller {
    return controller.handleHit(this)
  }

  static fromJson(json) {
    let event = new HitEvent(json)
    return event
  }
}
