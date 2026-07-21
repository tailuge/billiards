import { NchanClient } from "@tailuge/messaging"
import { MessageRelay } from "./messagerelay"
import { Session } from "./session"

export class MessagingMessageRelay implements MessageRelay {
  private readonly nchan: NchanClient
  private readonly subscriptions = new Map<
    string,
    ReturnType<NchanClient["subscribeTable"]>
  >()

  constructor(server = "wss://billiards-network.onrender.com") {
    const url = server.replace(/^(https?|wss?):\/\//, "")
    const httpProtocol =
      server.startsWith("ws://") || server.startsWith("http://")
        ? "http"
        : "https"
    this.nchan = new NchanClient(`${httpProtocol}://${url}`)
  }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix?: string
  ): void {
    const key = `${prefix ?? "table"}/${channel}`
    // Clean up any existing subscription first
    this.subscriptions.get(key)?.stop()
    const sub = this.nchan.subscribeTable(channel, (rawString: string) => {
      // Unwrap TableMessage envelope
      try {
        const envelope = JSON.parse(rawString)
        // envelope = { type, senderId, data, meta }
        if (envelope && envelope.data !== undefined) {
          callback(JSON.stringify(envelope.data))
        } else {
          callback(rawString)
        }
      } catch {
        // Not JSON or unexpected format, pass through as-is
        callback(rawString)
      }
    })
    this.subscriptions.set(key, sub)
  }

  publish(channel: string, message: string, _prefix?: string): void {
    const session = Session.getInstance()
    let type = "unknown"
    let data: unknown = message
    try {
      const parsed = JSON.parse(message)
      type = parsed.type || "unknown"
      data = parsed
    } catch {
      // Raw string, pass as data
    }
    // Fire-and-forget (matches current behavior where publish doesn't await)
    this.nchan
      .publishTable(channel, { type, data }, session.clientId)
      .catch((error) => {
        console.error("Publication error for table", channel, error)
      })
  }
}
