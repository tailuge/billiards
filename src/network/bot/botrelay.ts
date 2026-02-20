import { MessageRelay } from "../client/messagerelay"
import { Logger } from "./logger"
import { BeginEvent } from "../../events/beginevent"
import { EventUtil } from "../../events/eventutil"
import { EventType } from "../../events/eventtype"
import { BotEventHandler } from "./eventhandler"
import { Container } from "../../container/container"

export class BotRelay implements MessageRelay {
  private messageQueue: string[] = []
  private callback: ((message: string) => void) | null = null
  private logs: Logger
  private eventHandler: BotEventHandler

  constructor(logs: Logger, container: Container) {
    this.logs = logs
    this.eventHandler = new BotEventHandler(logs, container)
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void {
    this.callback = callback
    this.logs.info(`BotRelay subscribed to ${prefix || ""}${channel}`)

    const beginEvent = EventUtil.serialise(new BeginEvent())
    this.logs.outgoing(`Bot joining: BeginEvent`)
    this.callback(beginEvent)
  }

  publish(_channel: string, message: string, _prefix?: string): void {
    try {
      const event = EventUtil.fromSerialised(message)
      if (event.type !== EventType.AIM) {
        this.logs.incoming(`${message}`)
        this.messageQueue.push(message)
        this.eventHandler.handle(event)
      }
    } catch {
      this.logs.incoming(`unknown: ${message}`)
    }
  }

  async getOnlineCount(): Promise<number | null> {
    return 2
  }

  queueMessage(message: string): void {
    this.messageQueue.push(message)
    this.logs.incoming(`Queued: ${message}`)
  }
}
