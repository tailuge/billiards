import { MessagingClient, Table, TableMessage } from "@tailuge/messaging"
import { MessageRelay } from "./messagerelay"
import { Session } from "./session"
import { NetworkLogger } from "../../utils/network-logger"

/**
 * MessageRelay backed by @tailuge/messaging.
 *
 * The library now owns the transport details this relay previously worked
 * around:
 *  - `onMessage`/`onBothJoined` are construction-time options, so no messages
 *    are dropped during the join handshake.
 *  - `Table.publish()` buffers into a bounded outbox that waits for socket
 *    readiness, sends in order, and retries transient failures.
 *  - Reconnect buffer replays are deduplicated internally via server `msgId`
 *    (never by `meta.ts`, which is only event time).
 *  - `joined`/`table:leave` are handled internally and filtered from
 *    `onMessage`; use `onOpponentLeft`/`onOpponentRejoined` for lifecycle.
 *  - `table.bothJoined` is a one-shot promise for the two-player handshake.
 */
export class MessagingMessageRelay implements MessageRelay {
  private table: Table | null = null
  private subscribers: Array<(message: string) => void> = []

  constructor() {}

  /** Resolves once both players have joined the table (one-shot handshake). */
  async awaitBothJoined(): Promise<void> {
    if (!this.table) return
    await this.table.bothJoined
  }

  async connect(
    messagingClient: MessagingClient,
    tableId: string,
    onOpponentLeft?: () => void,
    onOpponentRejoined?: () => void
  ): Promise<void> {
    if (this.table) return
    const session = Session.getInstance()
    // onMessage/onBothJoined must be registered on the first call that creates
    // the table; later joinTable() calls reuse the existing Table and do not
    // add or replace listeners.
    const onMessage = (msg: TableMessage) => {
      const data = JSON.stringify(msg.data)
      for (const cb of this.subscribers) cb(data)
    }
    const onBothJoined = () => {
      NetworkLogger.logGame(`net: both joined table ${tableId}`)
    }
    this.table = session.spectator
      ? await messagingClient.spectateTable(tableId, session.clientId, {
          onMessage,
          onBothJoined,
        })
      : await messagingClient.joinTable(tableId, session.clientId, {
          onMessage,
          onBothJoined,
        })
    this.table.onOpponentLeft(() => {
      NetworkLogger.logGame(`opponent left: table ${tableId}`)
      onOpponentLeft?.()
    })
    this.table.onOpponentRejoined(() => {
      NetworkLogger.logGame(`opponent rejoined: table ${tableId}`)
      onOpponentRejoined?.()
    })
  }

  subscribe(
    _channel: string,
    callback: (message: string) => void,
    _prefix?: string
  ): void {
    this.subscribers.push(callback)
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
    // Safe immediately: joinTable() returns the session before its background
    // handshake completes, and the library outbox holds publishes until the
    // subscription is live.
    this.table.publish(type, data).catch((error) => {
      console.error("Publication error for table", _channel, error)
    })
  }
}
