import { MessagingClient, Table } from "@tailuge/messaging"
import { MessageRelay } from "./messagerelay"
import { Session } from "./session"
import { NetworkLogger } from "../../utils/network-logger"

export class MessagingMessageRelay implements MessageRelay {
  private table: Table | null = null
  private pendingCallbacks: Array<(message: string) => void> = []

  constructor() {}

  /**
   * Connect to the table channel using the library's Table class.
   * Spectators use spectateTable() so their departure does not trigger
   * onOpponentLeft on player clients.
   * Registers onOpponentLeft immediately after join to avoid missing the
   * one-shot notification (the library's Table watchdog may fire before
   * a separately-registered callback runs).
   */
  async connect(
    messagingClient: MessagingClient,
    tableId: string,
    onOpponentLeft?: () => void
  ): Promise<void> {
    if (this.table) return
    const session = Session.getInstance()
    this.table = session.spectator
      ? await messagingClient.spectateTable(tableId, session.clientId)
      : await messagingClient.joinTable(tableId, session.clientId)
    this.table.onOpponentLeft(() => {
      NetworkLogger.logGame(`opponent left: table ${tableId}`)
      onOpponentLeft?.()
    })
    this.table.onMessage((msg) => {
      if (msg.type !== "table:leave") {
        const data = JSON.stringify(msg.data)
        for (const cb of this.pendingCallbacks) cb(data)
      }
    })
  }

  subscribe(
    _channel: string,
    callback: (message: string) => void,
    _prefix?: string
  ): void {
    this.pendingCallbacks.push(callback)
  }

  publish(_channel: string, message: string, _prefix?: string): void {
    if (!this.table) return
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
    this.table.publish(type, data).catch((error) => {
      console.error("Publication error for table", _channel, error)
    })
  }
}
