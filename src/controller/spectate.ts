import { ControllerBase } from "./controllerbase"
import { AimEvent, Controller, HitEvent, Input } from "./controller"
import { MessageRelay } from "../network/client/messagerelay"
import { EventUtil } from "../events/eventutil"
import { GameEvent } from "../events/gameevent"

export class Spectate extends ControllerBase {
  messageRelay: MessageRelay
  tableId: string
  messages: GameEvent[] = []
  constructor(container, messageRelay, tableId) {
    super(container)
    this.messageRelay = messageRelay
    this.tableId = tableId
    this.messageRelay.subscribe(this.tableId, (message) => {
      console.log(message)
      const event = EventUtil.fromSerialised(message)
      this.messages.push(event)
      if (event instanceof HitEvent || event instanceof AimEvent) {
        this.container.eventQueue.push(event)
      }
    })
    console.log("Spectate")
  }

  override handleAim(event: AimEvent) {
    this.container.table.cue.aim = event
    this.container.table.cueball.pos.copy(event.pos)
    return this
  }

  override handleHit(event: HitEvent) {
    console.log("Spectate Hit")
    this.container.table.updateFromSerialised(event.tablejson)
    this.container.table.outcome = []
    this.container.table.hit()
    return this
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }
}
