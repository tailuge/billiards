export interface MessageRelay {
  subscribe(channel: string, callback: (message: string) => void): void
  publish(channel: string, message: string): void
}
