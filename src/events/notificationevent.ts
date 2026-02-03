import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class NotificationEvent extends GameEvent {
  message: string
  duration?: number | undefined

  constructor(message: string, duration?: number | undefined) {
    super()
    this.message = message
    this.duration = duration
    this.type = EventType.NOTIFICATION
  }

  applyToController(controller: Controller) {
    return controller.handleNotification(this)
  }

  static fromJson(json: any) {
    return new NotificationEvent(json.message, json.duration)
  }
}
