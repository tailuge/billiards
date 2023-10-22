import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RerackEvent extends GameEvent {
  ballinfo

  override applyToController(controller: Controller): Controller {
    controller.container.table.updateFromSerialised(this.ballinfo)
    return controller
  }

  constructor() {
    super()
    this.type = EventType.RERACK
  }

  static fromJson(json) {
    const event = new RerackEvent()
    event.ballinfo = json
    return event
  }
}
