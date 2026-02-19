import { MessageRelay } from "./messagerelay"
import { BotDebugOverlay } from "../bot/overlay"

export class BotMessageRelay implements MessageRelay {
  private messageQueue: string[] = []
  private callback: ((message: string) => void) | null = null
  private debugOverlay: BotDebugOverlay | null = null

  constructor(debugOverlay?: BotDebugOverlay) {
    this.debugOverlay = debugOverlay ?? null
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void {
    this.callback = callback
    this.debugOverlay?.info(`BotMessageRelay subscribed to ${prefix || ""}${channel}`)

    // Process any queued messages
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message && this.callback) {
        this.callback(message)
      }
    }
  }

  publish(channel: string, message: string, prefix?: string): void {
    this.debugOverlay?.outgoing(`Publish to ${prefix || ""}${channel}: ${message.substring(0, 50)}...`)

    // In bot mode, we queue the message for the bot to process
    // The bot will process it immediately (simulated)
    this.messageQueue.push(message)

    // If we have a callback (bot listener), trigger it
    if (this.callback) {
      setTimeout(() => {
        this.callback?.(message)
      }, 0)
    }
  }

  async getOnlineCount(): Promise<number | null> {
    // In bot mode, there's always at least 2 players (human + bot)
    return 2
  }

  queueMessage(message: string): void {
    this.messageQueue.push(message)
    this.debugOverlay?.incoming(`Queued: ${message.substring(0, 50)}...`)
  }
}
