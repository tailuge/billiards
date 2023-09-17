import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RejoinEvent extends GameEvent {
  clientResendFrom
  serverResendFrom

  constructor(clientResendFrom = "", serverResendFrom = "") {
    super()
    this.type = EventType.REJOIN
    this.clientResendFrom = clientResendFrom
    this.serverResendFrom = serverResendFrom
  }

  applyToController(controller: Controller): Controller {
    return controller.handleRejoin(this)
  }

  static fromJson(json) {
    const event = new RejoinEvent(json.clientResendFrom, json.serverResendFrom)
    return event
  }
}
