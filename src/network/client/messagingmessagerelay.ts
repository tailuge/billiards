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
  /**
   * Wait until the library reports that both non-spectator players have
   * joined this table channel. Resolves immediately if both are already
   * known, or if the underlying Table is from an older library version
   * that does not expose `bothJoined`. Rejects with Error on timeout.
   *
   * This closes the join race where one side could publish a BeginEvent
   * before the opponent had subscribed to the table channel.
   */
  async awaitBothJoined(timeoutMs: number = 8000): Promise<void> {
    const bothJoined = (this.table as unknown as { bothJoined?: Promise<void> })
      ?.bothJoined
    if (!bothJoined) return // older lib or not connected: best-effort no-op
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<void>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`bothJoined timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    })
    try {
      await Promise.race([bothJoined, timeout])
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

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

// Patch Table to queue incoming messages before onMessage is called.
// This handles the race window where messages (like BeginEvent) can arrive
// during joinTable's subsequent asynchronous operations (e.g. lobby update presence)
// before the caller has registered the onMessage listener.
const originalJoin = Table.prototype.join
const originalOnMessage = Table.prototype.onMessage

Table.prototype.join = async function (this: Table) {
  const self = this as any
  if (!self._messageQueue) {
    self._messageQueue = []
    originalOnMessage.call(this, (msg) => {
      if (self._onMessageCallback) {
        self._onMessageCallback(msg)
      } else {
        self._messageQueue.push(msg)
      }
    })
  }
  return originalJoin.apply(this)
}

Table.prototype.onMessage = function (
  this: Table,
  callback: (msg: any) => void
) {
  const self = this as any
  self._onMessageCallback = callback
  if (self._messageQueue && self._messageQueue.length > 0) {
    const queue = self._messageQueue
    self._messageQueue = []
    for (const msg of queue) {
      callback(msg)
    }
  }
}
