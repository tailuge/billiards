import { GameEvent } from "../../events/gameevent"

export class BotEventHandler {
  handle(event: GameEvent): void {
    console.log(`Bot handling event: ${event.type}`)
  }
}
