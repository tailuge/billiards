export type PresenceEventType = "join" | "heartbeat" | "leave"

export interface PresenceMessage {
  messageType: "presence"
  type: PresenceEventType
  userId: string
  userName: string
  locale?: string
  originUrl?: string
  ua?: string
  timestamp?: number
  ruletype?: string
  isBot?: boolean
  opponentId?: string
}

type PresenceEntry = {
  userName: string
  locale?: string
  lastSeen: number
  opponentId?: string | undefined
}

export class PresenceClient {
  private readonly users: Map<string, PresenceEntry> = new Map()
  private websocket: WebSocket | null = null
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null
  private pruneTimer: ReturnType<typeof setInterval> | null = null
  private joinTimer: ReturnType<typeof setTimeout> | null = null
  private started = false
  private isChallenged = false
  private readonly callbacks: Array<(count: number) => void> = []
  private readonly challengeCallbacks: Array<(challenged: boolean) => void> = []

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
    private readonly isBot?: boolean,
    private readonly ua?: string
  ) {}

  onCountChange(callback: (count: number) => void): void {
    this.callbacks.push(callback)
  }

  onChallengeChange(callback: (challenged: boolean) => void): void {
    this.challengeCallbacks.push(callback)
  }

  start(): void {
    if (this.started) return
    this.started = true

    this.subscribe()
    this.joinTimer = setTimeout(() => {
      this.publish("join")
      this.joinTimer = null
    }, 100)
    this.heartbeatTimer = setInterval(() => {
      this.publish("heartbeat")
    }, PresenceClient.heartbeatMs)
    this.pruneTimer = setInterval(() => {
      this.pruneAndNotify(Date.now())
    }, 1000)

    if (globalThis.window?.addEventListener !== undefined) {
      globalThis.window.addEventListener("beforeunload", this.handleUnload)
      globalThis.window.addEventListener("pagehide", this.handleUnload)
    }
  }

  stop(): void {
    if (!this.started) return
    this.started = false

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.joinTimer) {
      clearTimeout(this.joinTimer)
      this.joinTimer = null
    }
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer)
      this.pruneTimer = null
    }
    if (globalThis.window?.removeEventListener !== undefined) {
      globalThis.window.removeEventListener("beforeunload", this.handleUnload)
      globalThis.window.removeEventListener("pagehide", this.handleUnload)
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

  private readonly handleUnload = (): void => {
    this.publish("leave", true)
  }

  private subscribe(): void {
    if (typeof WebSocket === "undefined") return
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
    if (!this.started) return
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
      entry.opponentId = message.opponentId
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
      if (typeof msg.userId !== "string" || typeof msg.userName !== "string") {
        return null
      }

      if (msg.opponentId !== undefined && typeof msg.opponentId !== "string") {
        return null
      }

      if (msg.timestamp !== undefined && !Number.isFinite(msg.timestamp)) {
        return null
      }

      return msg as PresenceMessage
    } catch {
      return null
    }
  }

  private pruneAndNotify(now: number): void {
    let challenged = false
    const staleIds: string[] = []
    this.users.forEach((entry, id) => {
      if (now - entry.lastSeen > PresenceClient.ttlMs) {
        staleIds.push(id)
      } else if (entry.opponentId === this.userId) {
        challenged = true
      }
    })
    staleIds.forEach((id) => this.users.delete(id))
    this.notify(this.users.size, challenged)
  }

  private notify(count: number, challenged: boolean): void {
    this.callbacks.forEach((callback) => {
      try {
        callback(count)
      } catch {
        // Ignore UI callback failures.
      }
    })

    if (challenged !== this.isChallenged) {
      this.isChallenged = challenged
      this.challengeCallbacks.forEach((callback) => {
        try {
          callback(challenged)
        } catch {
          // Ignore UI callback failures.
        }
      })
    }
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
    if (this.ua !== undefined) {
      payload.ua = this.ua
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
