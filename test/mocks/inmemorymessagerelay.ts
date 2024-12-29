import { MessageRelay } from "../../src/network/client/messagerelay"

export class InMemoryMessageRelay implements MessageRelay {
  private subscriptions: Map<string, Set<(message: string) => void>> = new Map()

  subscribe(channel: string, callback: (message: string) => void): void {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, new Set())
    }
    this.subscriptions.get(channel)!.add(callback)
  }

  publish(channel: string, message: string): void {
    const subscribers = this.subscriptions.get(channel)
    if (subscribers) {
      subscribers.forEach((callback) => callback(message))
    }
  }
}
