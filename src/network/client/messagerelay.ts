export interface MessageRelay<T> {
  subscribe(channel: string, callback: (message: T) => void): void
  publish(channel: string, message: T): void
}
