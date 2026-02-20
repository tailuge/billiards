import { MessageRelay } from "../client/messagerelay"
import { Logger } from "./logger"
import { BeginEvent } from "../../events/beginevent"
import { EventUtil } from "../../events/eventutil"
import { EventType } from "../../events/eventtype"
import { BotEventHandler } from "./eventhandler"
import { Container } from "../../container/container"
import { GameEvent } from "../../events/gameevent"

export class BotRelay implements MessageRelay {
  private callback: ((message: string) => void) | null = null
  private logs: Logger
  private eventHandler: BotEventHandler

  constructor(logs: Logger, container: Container, delay: number = 2000) {
    this.logs = logs
    this.eventHandler = new BotEventHandler(
      logs,
      container,
      this.publishToPlayer.bind(this),
      delay
    )
  }

  subscribe(
    _channel: string,
    callback: (message: string) => void,
    _prefix?: string
  ): void {
    this.callback = callback
    const beginEvent = EventUtil.serialise(new BeginEvent())
    this.logs.outgoing(beginEvent)
    this.callback(beginEvent)
  }

  /**
   * This gets invoked when player sends an event.
   * In essence it is receiving an event from the player to the bot.
   * @param _channel
   * @param message
   * @param _prefix
   */
  publish(_channel: string, message: string, _prefix?: string): void {
    try {
      const event = EventUtil.fromSerialised(message)
      if (event.type !== EventType.AIM) {
        this.logs.incoming(message)
        this.eventHandler.handle(event)
      }
    } catch (e) {
      this.logs.incoming(`Error parsing event: ${e}`)
    }
  }

  publishToPlayer(event: GameEvent) {
    const message = EventUtil.serialise(event)
    this.logs.outgoing(message)
    this.callback?.(message)
  }

  async getOnlineCount(): Promise<number | null> {
    return 2
  }
}
