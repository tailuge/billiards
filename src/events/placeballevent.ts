import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { vec } from "../utils/utils"

export class PlaceBallEvent extends GameEvent {
  pos
  allTable: boolean

  constructor(pos, allTable) {
    super()
    this.pos = pos
    this.allTable = allTable
    this.type = EventType.PLACEBALL
  }

  static fromJson(json) {
    return new PlaceBallEvent(vec(json.pos), json.allTable)
  }
  applyToController(controller: Controller) {
    return controller.handlePlaceBall(this)
  }
}
