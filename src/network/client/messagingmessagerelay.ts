import { MessagingClient, Table, TableMessage } from "@tailuge/messaging"
import { MessageRelay } from "./messagerelay"
import { Session } from "./session"
import { NetworkLogger } from "../../utils/network-logger"

export class MessagingMessageRelay implements MessageRelay {
  private table: Table | null = null
  private pendingCallbacks: Array<(message: string) => void> = []

  constructor() {}

  async awaitBothJoined(timeoutMs: number = 8000): Promise<void> {
    if (!this.table || !this.table.bothJoined) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<void>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`bothJoined timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    })
    try {
      await Promise.race([this.table.bothJoined, timeout])
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
    // Register the message listener before join() subscribes so that messages
    // arriving during the join handshake are not dropped to an empty listener
    // array. Requires @tailuge/messaging >= 1.36.0 (onMessage in options).
    const onMessage = (msg: TableMessage) => {
      if (msg.type !== "table:leave") {
        const data = JSON.stringify(msg.data)
        for (const cb of this.pendingCallbacks) cb(data)
      }
    }
    this.table = session.spectator
      ? await messagingClient.spectateTable(tableId, session.clientId, {
          onMessage,
        })
      : await messagingClient.joinTable(tableId, session.clientId, {
          onMessage,
        })
    this.table.onOpponentLeft(() => {
      NetworkLogger.logGame(`opponent left: table ${tableId}`)
      onOpponentLeft?.()
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
    this.table.publish(type, data).catch((error) => {
      console.error("Publication error for table", _channel, error)
    })
  }
}
