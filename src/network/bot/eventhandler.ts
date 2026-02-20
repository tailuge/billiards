import { GameEvent } from "../../events/gameevent"
import { Logger } from "./logger"
import { Container } from "../../container/container"
import { EventType } from "../../events/eventtype"

export class BotEventHandler {
  private logs: Logger
  private container: Container

  constructor(logs: Logger, container: Container) {
    this.logs = logs
    this.container = container
  }

  handle(event: GameEvent): void {
    this.logs.info(`Bot handling event: ${event.type}`)
    if (event.type === EventType.STARTAIM) {
      this.logs.info(`Ball at ${this.container.table.balls[0].pos}`)
    }
  }
}
