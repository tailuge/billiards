export interface MessageRelay {
  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void
  publish(channel: string, message: string, prefix?: string): void
  getOnlineCount(): Promise<number | null>
}
