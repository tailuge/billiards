import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { vec } from "../utils/utils"
import { Vector3 } from "three"

export interface RespotBody {
  id: number
  pos: Vector3
}

export class PlaceBallEvent extends GameEvent {
  pos
  respot?: RespotBody | undefined
  useStartPos?: boolean | undefined

  constructor(pos, respot?: RespotBody | undefined, useStartPos?: boolean) {
    super()
    this.pos = pos
    this.respot = respot
    this.useStartPos = useStartPos
    this.type = EventType.PLACEBALL
  }

  static fromJson(json) {
    const respot = json.respot
      ? { id: json.respot.id, pos: vec(json.respot.pos) }
      : undefined
    return new PlaceBallEvent(vec(json.pos), respot, json.useStartPos ?? false)
  }
  applyToController(controller: Controller) {
    return controller.handlePlaceBall(this)
  }
}
