import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"

export class BeginEvent extends GameEvent {
  ruletype?: string
  tableSize?: number

  constructor(init?: { ruletype?: string; tableSize?: number }) {
    super()
    this.type = EventType.BEGIN
    if (init) {
      Object.assign(this, init)
    }
  }

  static fromJson(parsed): BeginEvent {
    return new BeginEvent({
      ruletype: parsed.ruletype,
      tableSize: parsed.tableSize,
    })
  }

  applyToController(controller: Controller) {
    return controller.handleBegin(this)
  }
}
