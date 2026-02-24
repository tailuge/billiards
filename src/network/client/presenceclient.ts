export type PresenceEventType = "join" | "heartbeat" | "leave"

export interface PresenceMessage {
  messageType: "presence"
  type: PresenceEventType
  userId: string
  userName: string
  locale?: string
  originUrl?: string
  timestamp?: number
  ruletype?: string
  isBot?: boolean
}

type PresenceEntry = {
  userName: string
  locale?: string
  lastSeen: number
}

export class PresenceClient {
  private readonly users: Map<string, PresenceEntry> = new Map()
  private websocket: WebSocket | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private pruneTimer: ReturnType<typeof setInterval> | null = null
  private started = false
  private readonly callbacks: Array<(count: number) => void> = []

  static readonly subscribeURL =
    "wss://billiards-network.onrender.com/subscribe/presence/lobby"
  static readonly publishURL =
    "https://billiards-network.onrender.com/publish/presence/lobby"
  static readonly ttlMs = 90 * 1000
  static readonly heartbeatMs = 60 * 1000

  constructor(
    private readonly userId: string,
    private readonly userName: string,
    private readonly locale?: string,
    private readonly originUrl?: string,
    private readonly ruletype?: string,
    private readonly isBot?: boolean
  ) {}

  onCountChange(callback: (count: number) => void): void {
    this.callbacks.push(callback)
  }

  start(): void {
    if (this.started) return
    this.started = true

    this.subscribe()
    this.publishLater("join", 100)
    this.heartbeatTimer = setInterval(() => {
      this.publish("heartbeat")
    }, PresenceClient.heartbeatMs)
    this.pruneTimer = setInterval(() => {
      this.pruneAndNotify(Date.now())
    }, 1000)

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("beforeunload", this.handleUnload)
      window.addEventListener("pagehide", this.handleUnload)
    }
  }

  stop(): void {
    if (!this.started) return
    this.started = false

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer)
      this.pruneTimer = null
    }
    if (typeof window !== "undefined" && window.removeEventListener) {
      window.removeEventListener("beforeunload", this.handleUnload)
      window.removeEventListener("pagehide", this.handleUnload)
    }
    if (this.websocket) {
      try {
        this.websocket.close()
      } catch {
        // Ignore close failures to avoid affecting gameplay.
      }
      this.websocket = null
    }
    this.publish("leave", true)
  }

  private handleUnload = (): void => {
    this.publish("leave", true)
  }

  private subscribe(): void {
    try {
      const socket = new WebSocket(PresenceClient.subscribeURL)
      socket.onmessage = (event: MessageEvent) => {
        this.handleIncoming(event.data)
      }
      socket.onerror = () => {}
      socket.onclose = () => {}
      this.websocket = socket
    } catch {
      // Ignore subscription failures; indicator falls back silently.
    }
  }

  private handleIncoming(data: unknown): void {
    const message = this.tryParseMessage(data)
    if (!message) return

    const seenAt = message.timestamp ?? Date.now()
    if (message.type === "leave") {
      this.users.delete(message.userId)
    } else {
      const entry: PresenceEntry = {
        userName: message.userName,
        lastSeen: seenAt,
      }
      if (message.locale !== undefined) {
        entry.locale = message.locale
      }
      this.users.set(message.userId, entry)
    }

    this.pruneAndNotify(Date.now())
  }

  private tryParseMessage(data: unknown): PresenceMessage | null {
    if (typeof data !== "string") return null

    try {
      const parsed: unknown = JSON.parse(data)
      if (!parsed || typeof parsed !== "object") return null

      const msg = parsed as Partial<PresenceMessage>
      if (msg.messageType !== "presence") return null
      if (
        msg.type !== "join" &&
        msg.type !== "heartbeat" &&
        msg.type !== "leave"
      ) {
        return null
      }
      if (!msg.userId || !msg.userName) return null

      return msg as PresenceMessage
    } catch {
      return null
    }
  }

  private pruneAndNotify(now: number): void {
    this.users.forEach((entry, id) => {
      if (now - entry.lastSeen > PresenceClient.ttlMs) {
        this.users.delete(id)
      }
    })
    this.notify(this.users.size)
  }

  private notify(count: number): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(count)
      } catch {
        // Ignore UI callback failures.
      }
    })
  }

  private publishLater(type: PresenceEventType, delayMs: number): void {
    setTimeout(() => this.publish(type), delayMs)
  }

  private publish(type: PresenceEventType, keepalive = false): void {
    if (typeof fetch !== "function") return

    const payload: PresenceMessage = {
      messageType: "presence",
      type,
      userId: this.userId,
      userName: this.userName,
      timestamp: Date.now(),
    }
    if (this.locale !== undefined) {
      payload.locale = this.locale
    }
    if (this.originUrl !== undefined) {
      payload.originUrl = this.originUrl
    }
    if (this.ruletype !== undefined) {
      payload.ruletype = this.ruletype
    }
    if (this.isBot !== undefined) {
      payload.isBot = this.isBot
    }

    fetch(PresenceClient.publishURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      keepalive,
      body: JSON.stringify(payload),
    }).catch(() => {})
  }
}
