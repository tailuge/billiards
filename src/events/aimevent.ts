import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { vec, roundVec } from "../utils/three-utils"
import { Vector3 } from "three"

export class AimEvent extends GameEvent {
  offset = new Vector3(0, 0, 0)
  angle = 0
  power = 0
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
    event.pos = roundVec(vec(json.pos))
    event.angle = Math.fround(json.angle)
    event.offset = roundVec(vec(json.offset))
    event.power = Math.fround(json.power)
    if (json.i) {
      event.i = json.i
    }
    return event
  }

  copy(): AimEvent {
    return AimEvent.fromJson(this)
  }
}
