import { MessageRelay } from "../client/messagerelay"
import { Logger } from "./logger"
import { BeginEvent } from "../../events/beginevent"
import { EventUtil } from "../../events/eventutil"
import { EventType } from "../../events/eventtype"
import { BotEventHandler } from "./eventhandler"
import { Container } from "../../container/container"
import { GameEvent } from "../../events/gameevent"

/**
 * BotRelay acts as a bridge between the game engine and the bot's event handler.
 * It simulates a network relay for a local bot opponent.
 */
export class BotRelay implements MessageRelay {
  private static readonly QUEUE_PROCESS_DELAY = 500
  private static readonly DEFAULT_SEQUENCE_DELAY = 300

  private readonly messageQueue: string[] = []
  private queueTimeoutId: ReturnType<typeof setTimeout> | null = null
  private sequenceTimeoutId: ReturnType<typeof setTimeout> | null = null
  private callback: ((message: string) => void) | null = null
  private readonly logs: Logger
  private readonly eventHandler: BotEventHandler

  constructor(logs: Logger, container: Container) {
    this.logs = logs
    this.eventHandler = new BotEventHandler(
      logs,
      container,
      (events, delay) => this.publishSequenceToPlayer(events, delay),
      (message) => this.enqueueMessage(message)
    )
  }

  /**
   * Subscribes the game engine to the bot's messages.
   */
  public subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = ""
  ): void {
    this.callback = callback
    console.log(`BotRelay subscribed to ${prefix}${channel}`)

    // Start the game by sending a BEGIN event
    const beginEvent = EventUtil.serialise(new BeginEvent())
    this.logs.outgoing(beginEvent)
    this.callback(beginEvent)
  }

  /**
   * Adds a message to the processing queue.
   */
  public enqueueMessage(message: string): void {
    this.messageQueue.push(message)
    this.queueTimeoutId ??= setTimeout(
      () => this.processQueue(),
      BotRelay.QUEUE_PROCESS_DELAY
    )
  }

  /**
   * Receives an event from the player and forwards it to the bot.
   */
  public publish(_channel: string, message: string, _prefix?: string): void {
    try {
      const event = EventUtil.fromSerialised(message)
      // Bot doesn't need to process every real-time AIM event
      if (event.type !== EventType.AIM) {
        this.logs.incoming(message)
        this.enqueueMessage(message)
      }
    } catch (e) {
      this.logs.incoming(`Error parsing message: ${message} - ${e}`)
    }
  }

  /**
   * Processes the next message in the queue.
   */
  private processQueue(): void {
    this.queueTimeoutId = null
    const message = this.messageQueue.shift()

    if (message) {
      try {
        const event = EventUtil.fromSerialised(message)
        this.eventHandler.handle(event)
      } catch (e) {
        this.logs.incoming(`Error handling message: ${message} - ${e}`)
      }
    }

    if (this.messageQueue.length > 0) {
      this.queueTimeoutId = setTimeout(
        () => this.processQueue(),
        BotRelay.QUEUE_PROCESS_DELAY
      )
    }
  }

  /**
   * Sends a sequence of events to the player with a delay between each.
   */
  public publishSequenceToPlayer(
    events: GameEvent[],
    delay = BotRelay.DEFAULT_SEQUENCE_DELAY
  ): void {
    if (events.length === 0) {
      return
    }

    if (this.sequenceTimeoutId) {
      clearTimeout(this.sequenceTimeoutId)
    }

    this.sequenceTimeoutId = setTimeout(() => {
      this.sequenceTimeoutId = null

      const [currentEvent, ...remainingEvents] = events
      const message = EventUtil.serialise(currentEvent)

      this.logs.outgoing(message)
      this.callback?.(message)

      if (remainingEvents.length > 0) {
        this.publishSequenceToPlayer(remainingEvents, delay)
      }
    }, delay)
  }

  public async getOnlineCount(): Promise<number> {
    return 2
  }
}
