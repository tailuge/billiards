import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { Vector3 } from "three"

function toVec2(value) {
  return Array.isArray(value)
    ? new Vector3(value[0] ?? 0, value[1] ?? 0, 0)
    : new Vector3(value?.x ?? 0, value?.y ?? 0, value?.z ?? 0)
}

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

  toJSON() {
    const { pos, offset, elevation, i, ...rest } = this
    return {
      ...rest,
      pos: [pos.x, pos.y],
      ...(offset && (offset.x !== 0 || offset.y !== 0)
        ? { offset: [offset.x, offset.y] }
        : {}),
      ...(elevation === 0 ? {} : { elevation }),
      ...(i === 0 ? {} : { i }),
    }
  }

  static fromJson(json) {
    const event = new AimEvent()
    event.pos = toVec2(json.pos)
    event.angle = json.angle ?? 0
    if (json.offset) {
      event.offset = toVec2(json.offset)
    }
    event.power = json.power ?? 0
    event.elevation = json.elevation ?? 0
    if (json.i) {
      event.i = json.i
    }
    return event
  }

  copy(): AimEvent {
    return AimEvent.fromJson(this)
  }
}
