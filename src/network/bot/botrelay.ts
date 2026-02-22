import { MessageRelay } from "../client/messagerelay"
import { Logger } from "./logger"
import { BeginEvent } from "../../events/beginevent"
import { EventUtil } from "../../events/eventutil"
import { EventType } from "../../events/eventtype"
import { BotEventHandler } from "./eventhandler"
import { Container } from "../../container/container"
import { GameEvent } from "../../events/gameevent"

export class BotRelay implements MessageRelay {
  private readonly messageQueue: string[] = []
  private timeoutId: ReturnType<typeof setTimeout> | null = null
  private sequenceTimeoutId: ReturnType<typeof setTimeout> | null = null
  private callback: ((message: string) => void) | null = null
  private readonly logs: Logger
  private readonly eventHandler: BotEventHandler

  constructor(logs: Logger, container: Container) {
    this.logs = logs
    this.eventHandler = new BotEventHandler(
      logs,
      container,
      this.publishSequenceToPlayer.bind(this),
      this.enqueueMessage.bind(this)
    )
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void {
    this.callback = callback
    console.log(`BotRelay subscribed to ${prefix || ""}${channel}`)
    const beginEvent = EventUtil.serialise(new BeginEvent())
    this.logs.outgoing(beginEvent)
    this.callback(beginEvent)
  }

  /**
   * This gets invoked when player sends an event (to the bot).
   * In essence it is receiving an event from the player to the bot.
   * @param _channel
   * @param message
   * @param _prefix
   */
  enqueueMessage(message: string): void {
    this.messageQueue.push(message)
    this.timeoutId ??= setTimeout(() => this.processQueue(), 500)
  }

  publish(_channel: string, message: string, _prefix?: string): void {
    try {
      const event = EventUtil.fromSerialised(message)
      if (event.type !== EventType.AIM) {
        this.logs.incoming(`${message}`)
        this.enqueueMessage(message)
      }
    } catch (e) {
      this.logs.incoming(`unknown: ${message} ${e}`)
    }
  }

  private processQueue(): void {
    this.timeoutId = null
    const message = this.messageQueue.shift()
    if (message) {
      try {
        const event = EventUtil.fromSerialised(message)
        this.eventHandler.handle(event)
      } catch (e) {
        this.logs.incoming(`unknown: ${message} ${e}`)
        this.logs.incoming(`${e}`)
      }
    }
    if (this.messageQueue.length > 0) {
      this.timeoutId = setTimeout(() => this.processQueue(), 500)
    }
  }

  publishSequenceToPlayer(events: GameEvent[], delay = 300) {
    if (events.length === 0) return
    if (this.sequenceTimeoutId) {
      clearTimeout(this.sequenceTimeoutId)
    }
    this.sequenceTimeoutId = setTimeout(() => {
      this.sequenceTimeoutId = null
      const event = events[0]
      const message = EventUtil.serialise(event)
      this.logs.outgoing(`${message}`)
      this.callback?.(message)
      if (events.length > 1) {
        this.publishSequenceToPlayer(events.slice(1), delay)
      }
    }, delay)
  }

  async getOnlineCount(): Promise<number | null> {
    return 2
  }
}
