import { MessageRelay } from "../client/messagerelay"
import { BotDebugOverlay } from "./overlay"
import { BeginEvent } from "../../events/beginevent"
import { EventUtil } from "../../events/eventutil"
import { EventType } from "../../events/eventtype"
import { BotEventHandler } from "./eventhandler"

export class BotMessageRelay implements MessageRelay {
  private messageQueue: string[] = []
  private callback: ((message: string) => void) | null = null
  private logs: BotDebugOverlay
  private eventHandler: BotEventHandler

  constructor() {
    this.logs = new BotDebugOverlay()
    this.eventHandler = new BotEventHandler()
  }

  private isAimEvent(message: string): boolean {
    try {
      const event = EventUtil.fromSerialised(message)
      return event.type === EventType.AIM
    } catch {
      return false
    }
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void {
    this.callback = callback
    this.logs.info(`BotMessageRelay subscribed to ${prefix || ""}${channel}`)

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message && this.callback) {
        this.callback(message)
      }
    }

    setTimeout(() => {
      const beginEvent = EventUtil.serialise(new BeginEvent())
      this.logs.outgoing(`Bot joining: BeginEvent`)
      callback(beginEvent)
    }, 0)
  }

  publish(_channel: string, message: string, _prefix?: string): void {
    if (!this.isAimEvent(message)) {
      this.logs.incoming(`Incoming: ${message}`)
    }

    try {
      const event = EventUtil.fromSerialised(message)
      this.eventHandler.handle(event)
    } catch {
      // not a valid event
    }

    this.messageQueue.push(message)
  }

  async getOnlineCount(): Promise<number | null> {
    return 2
  }

  queueMessage(message: string): void {
    this.messageQueue.push(message)
    if (!this.isAimEvent(message)) {
      this.logs.incoming(`Queued: ${message}`)
    }
  }
}
