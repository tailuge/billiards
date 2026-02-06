import { GameEvent } from "./gameevent"
import { EventType } from "./eventtype"
import { Controller } from "../controller/controller"
import { Table } from "../model/table"

export class RerackEvent extends GameEvent {
  ballinfo

  override applyToController(controller: Controller): Controller {
    RerackEvent.applyBallinfoToTable(controller.container.table, this.ballinfo)
    return controller
  }

  constructor() {
    super()
    this.type = EventType.RERACK
  }

  static fromJson(json) {
    const event = new RerackEvent()
    event.ballinfo = json.ballinfo ?? json
    return event
  }

  static applyBallinfoToTable(table: Table, ballinfo) {
    table.updateFromSerialised(ballinfo)
    if (ballinfo?.balls) {
      ballinfo.balls.forEach((bData) => {
        const ball = table.balls[bData.id]
        if (ball) {
          ball.pos.copy(bData.pos)
          ball.setStationary()
        }
      })
    }
  }
}
