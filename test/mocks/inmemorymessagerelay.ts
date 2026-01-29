import { MessageRelay } from "../../src/network/client/messagerelay"

export class InMemoryMessageRelay implements MessageRelay {
  private subscriptions: Map<string, Set<(message: string) => void>> = new Map()

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = "table"
  ): void {
    const fullChannel = `${prefix}/${channel}`
    if (!this.subscriptions.has(fullChannel)) {
      this.subscriptions.set(fullChannel, new Set())
    }
    this.subscriptions.get(fullChannel)!.add(callback)
  }

  publish(channel: string, message: string, prefix = "table"): void {
    const fullChannel = `${prefix}/${channel}`
    const subscribers = this.subscriptions.get(fullChannel)
    if (subscribers) {
      subscribers.forEach((callback) => callback(message))
    }
  }

  async getOnlineCount(): Promise<number | null> {
    return 1
  }
}
