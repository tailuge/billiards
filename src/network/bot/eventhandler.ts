import { GameEvent } from "../../events/gameevent";
import { Logger } from "./logger";

export class BotEventHandler {
  private logs: Logger;

  constructor(logs: Logger) {
    this.logs = logs;
  }

  handle(event: GameEvent): void {
    this.logs.info(`Bot handling event: ${event.type}`);
  }
}
