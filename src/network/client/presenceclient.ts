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

export interface ChallengerInfo {
  userId: string
  userName: string
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
  private challenger: ChallengerInfo | null = null
  private readonly callbacks: Array<(count: number) => void> = []
  private readonly challengeCallbacks: Array<
    (challenger: ChallengerInfo | null) => void
  > = []

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

  onChallengeChange(
    callback: (challenger: ChallengerInfo | null) => void
  ): void {
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
      } catch (err) {
        console.error("Failed to close WebSocket:", err)
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
    if (globalThis.WebSocket === undefined) return
    try {
      const socket = new globalThis.WebSocket(PresenceClient.subscribeURL)
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
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        return null
      }

      const msg = parsed as Partial<PresenceMessage>
      if (this.isValidPresenceMessage(msg)) {
        return msg as PresenceMessage
      }
    } catch {
      // Ignore parse failures
    }
    return null
  }

  private isValidPresenceMessage(msg: Partial<PresenceMessage>): boolean {
    if (msg.messageType !== "presence") return false
    if (
      msg.type !== "join" &&
      msg.type !== "heartbeat" &&
      msg.type !== "leave"
    ) {
      return false
    }
    if (typeof msg.userId !== "string" || typeof msg.userName !== "string") {
      return false
    }

    return (
      this.validateOptionalFields(msg) &&
      (msg.timestamp === undefined || Number.isFinite(msg.timestamp))
    )
  }

  private validateOptionalFields(msg: Partial<PresenceMessage>): boolean {
    if (msg.opponentId !== undefined && typeof msg.opponentId !== "string") {
      return false
    }
    if (msg.locale !== undefined && typeof msg.locale !== "string") return false
    if (msg.originUrl !== undefined && typeof msg.originUrl !== "string") {
      return false
    }
    if (msg.ruletype !== undefined && typeof msg.ruletype !== "string") {
      return false
    }
    if (msg.isBot !== undefined && typeof msg.isBot !== "boolean") return false
    if (msg.ua !== undefined && typeof msg.ua !== "string") return false

    return true
  }

  private pruneAndNotify(now: number): void {
    let challenger: ChallengerInfo | null = null
    const staleIds: string[] = []
    this.users.forEach((entry, id) => {
      if (now - entry.lastSeen > PresenceClient.ttlMs) {
        staleIds.push(id)
      } else if (entry.opponentId === this.userId) {
        challenger = { userId: id, userName: entry.userName }
      }
    })
    staleIds.forEach((id) => this.users.delete(id))
    this.notify(this.users.size, challenger)
  }

  private notify(count: number, challenger: ChallengerInfo | null): void {
    // Create copies of the callback arrays to prevent modification during iteration.
    const currentCallbacks = [...this.callbacks]
    const currentChallengeCallbacks = [...this.challengeCallbacks]

    currentCallbacks.forEach((callback) => {
      try {
        callback(count)
      } catch {
        // Ignore UI callback failures.
      }
    })

    const challengerChanged =
      (challenger === null) !== (this.challenger === null) ||
      (challenger !== null &&
        this.challenger !== null &&
        (challenger.userId !== this.challenger.userId ||
          challenger.userName !== this.challenger.userName))

    if (challengerChanged) {
      this.challenger = challenger
      currentChallengeCallbacks.forEach((callback) => {
        try {
          callback(challenger)
        } catch {
          // Ignore UI callback failures.
        }
      })
    }
  }

  private publish(type: PresenceEventType, keepalive = false): void {
    if (typeof globalThis.fetch !== "function") return

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

    globalThis
      .fetch(PresenceClient.publishURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        keepalive,
        body: JSON.stringify(payload),
      })
      .catch(() => {})
  }
}
