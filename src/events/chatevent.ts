import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class ChatEvent extends GameEvent {
  sender
  message
  voiceType?: "VOICE_REQUEST" | "VOICE_SIGNAL"
  voiceData?: any

  constructor(
    sender,
    message,
    voiceType?: "VOICE_REQUEST" | "VOICE_SIGNAL",
    voiceData?: any
  ) {
    super()
    this.sender = sender
    this.message = message
    this.voiceType = voiceType
    this.voiceData = voiceData
    this.type = EventType.CHAT
  }

  applyToController(controller: Controller) {
    return controller.handleChat(this)
  }

  static fromJson(json) {
    return new ChatEvent(
      json.sender,
      json.message,
      json.voiceType,
      json.voiceData
    )
  }
}
