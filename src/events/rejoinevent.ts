import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RejoinEvent extends GameEvent {
  clientToResendLast = ""
  serverWillResendLast = ""

  constructor(clientToResendLast, serverWillResendLast) {
    super()
    this.type = EventType.REJOIN
    this.clientToResendLast = clientToResendLast
    this.serverWillResendLast = serverWillResendLast
  }

  applyToController(controller: Controller): Controller {
    return controller.handleRejoin(this)
  }

  static fromJson(json) {
    const event = new RejoinEvent(
      json.clientToResendLast,
      json.serverWillResendLast
    )
    return event
  }
}
