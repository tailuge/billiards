import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class RejoinEvent extends GameEvent {
  senderId
  hiteventjson
  fromOther?: boolean

  constructor(senderId, hiteventjson) {
    super()
    this.type = EventType.REJOIN
    this.senderId = senderId
    this.hiteventjson = hiteventjson
  }

  applyToController(controller: Controller): Controller {
    return controller.handleRejoin(this)
  }

  static fromJson(json) {
    const event = new RejoinEvent(json.senderId, json.hiteventjson)
    if ("fromOther" in json) {
      event.fromOther = json.fromOther
    }
    return event
  }
}
