import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { NotificationData } from "../view/notification"

export class NotificationEvent extends GameEvent {
  data: NotificationData | string
  duration?: number | undefined

  constructor(data: NotificationData | string, duration?: number | undefined) {
    super()
    this.data = data
    this.duration = duration
    this.type = EventType.NOTIFICATION
  }

  applyToController(controller: Controller) {
    return controller.handleNotification(this)
  }

  static fromJson(json: any) {
    return new NotificationEvent(json.data, json.duration)
  }
}
