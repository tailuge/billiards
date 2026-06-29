import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { vec } from "../utils/three-utils"
import { Vector3 } from "three"

export class AimEvent extends GameEvent {
  offset = new Vector3(0, 0, 0)
  angle = 0
  power = 0
  elevation = 0
  pos = new Vector3(0, 0, 0)
  i = 0

  constructor() {
    super()
    this.type = EventType.AIM
  }

  applyToController(controller: Controller) {
    return controller.handleAim(this)
  }

  static fromJson(json) {
    const event = new AimEvent()
    if (json.pos) {
      event.pos = vec(json.pos)
    }
    event.angle = json.angle
    if (json.offset) {
      event.offset = vec(json.offset)
    }
    event.power = json.power
    event.elevation = json.elevation || 0
    if (json.i !== undefined) {
      event.i = json.i
    } else if (json.cueBallId !== undefined) {
      event.i = json.cueBallId
    }
    return event
  }

  copy(): AimEvent {
    return AimEvent.fromJson(this)
  }
}
