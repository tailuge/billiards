import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class ChatEvent extends GameEvent {
  sender
  message
  constructor(sender, message) {
    super()
    this.sender = sender
    this.message = message
    this.type = EventType.CHAT
  }

  applyToController(controller: Controller) {
    return controller.handleChat(this)
  }

  static fromJson(json) {
    return new ChatEvent(json.sender, json.message)
  }
}
