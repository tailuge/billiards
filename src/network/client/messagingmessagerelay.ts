import { MessagingClient, Table } from "@tailuge/messaging"
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
    if (!session.spectator && typeof this.table.onBothJoined === "function") {
      this.table.onBothJoined(() => {
        this.table
          ?.publish("joined", { id: session.clientId })
          .catch((error) => {
            console.error(
              "Failed to republish joined message on bothJoined",
              error
            )
          })
      })
    }
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
