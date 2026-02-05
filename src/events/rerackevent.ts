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
    console.log("RERACK applyBallinfoToTable ballinfo:", ballinfo)
    table.updateFromSerialised(ballinfo)
    if (ballinfo?.balls) {
      ballinfo.balls.forEach((bData) => {
        const ball = table.balls[bData.id]
        if (ball) {
          console.log("RERACK apply ball", {
            id: bData.id,
            pos: bData.pos,
          })
          ball.pos.copy(bData.pos)
          ball.setStationary()
        }
      })
    } else {
      console.log("RERACK applyBallinfoToTable: no ballinfo.balls")
    }
  }
}
