export interface MessageRelay {
  subscribe(
    channel: string,
    callback: (message: string, msgId?: string) => void,
    prefix?: string
  ): void
  publish(channel: string, message: string, prefix?: string): void
}
