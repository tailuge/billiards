import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export interface LineData {
  p1: { x: number; y: number }
  p2: { x: number; y: number }
  colour: string
}

export class ChatEvent extends GameEvent {
  sender
  message
  line?: LineData

  constructor(sender, message, line?: LineData) {
    super()
    this.sender = sender
    this.message = message
    this.line = line
    this.type = EventType.CHAT
  }

  applyToController(controller: Controller) {
    return controller.handleChat(this)
  }

  static fromJson(json) {
    return new ChatEvent(json.sender, json.message, json.line)
  }
}
