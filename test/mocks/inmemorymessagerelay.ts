import { MessageRelay } from "../../src/network/client/messagerelay"

export class InMemoryMessageRelay<T> implements MessageRelay<T> {
    private subscriptions: Map<string, Set<(message: T) => void>> = new Map()

    subscribe(channel: string, callback: (message: T) => void): void {
        if (!this.subscriptions.has(channel)) {
            this.subscriptions.set(channel, new Set())
        }
        this.subscriptions.get(channel)!.add(callback)
    }

    publish(channel: string, message: T): void {
        const subscribers = this.subscriptions.get(channel)
        if (subscribers) {
            subscribers.forEach((callback) => callback(message))
        }
    }
}
