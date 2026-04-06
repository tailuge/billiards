import { MessageRelay } from "./messagerelay"

export class NchanMessageRelay implements MessageRelay {
  private readonly websockets = new Map<string, WebSocket>()
  private readonly lastProcessedTimestamps = new Map<string, number>()
  private readonly reconnectionTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >()

  constructor(
    private readonly baseURL: string = "billiards-network.onrender.com"
  ) {}

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = "table"
  ): void {
    const key = `${prefix}/${channel}`
    this.cleanup(key) // Ensure no duplicate sockets or timers exist for this key
    this.connect(channel, callback, prefix, 1000)
  }

  private connect(
    channel: string,
    callback: (message: string) => void,
    prefix: string,
    backoffDelay: number
  ): void {
    const key = `${prefix}/${channel}`
    const url = `wss://${this.baseURL}/subscribe/${key}`
    const ws = new WebSocket(url)

    this.websockets.set(key, ws)

    ws.onmessage = async (event: MessageEvent) => {
      try {
        const decoded = await this.decodeMessage(event.data)
        if (decoded === null) return

        try {
          const parsed = JSON.parse(decoded)
          const timestamp = parsed.meta?.ts

          if (typeof timestamp === "number") {
            const lastTs = this.lastProcessedTimestamps.get(key) ?? -1
            // Use < instead of <= to prevent stalling on multi-message ticks
            if (timestamp < lastTs) return
            this.lastProcessedTimestamps.set(key, timestamp)
          }
        } catch {
          // Not JSON; treat as raw message
        }

        callback(decoded)
      } catch (error) {
        console.warn(
          "WebSocket message handling failed:",
          this.stringifyLog({
            error: this.normalizeError(error),
            message: event.data,
          })
        )
      }
    }

    ws.onerror = (error: Event) => {
      console.warn(
        "WebSocket error:",
        this.stringifyLog(this.normalizeEvent(error))
      )
    }

    ws.onopen = () => {
      this.clearTimer(key)
      console.log(`Connected to ${url}`)
    }

    ws.onclose = (event: CloseEvent) => {
      console.log("Disconnected event", event)
      // Only trigger reconnect if this specific instance is still the active one
      if (this.websockets.get(key) === ws) {
        this.websockets.delete(key)
        console.warn(`Disconnected from ${url}. Reconnecting...`)

        const nextDelay = Math.min(backoffDelay * 2, 30000)
        const timer = setTimeout(() => {
          this.connect(channel, callback, prefix, nextDelay)
        }, backoffDelay)
        this.reconnectionTimers.set(key, timer)
      }
    }
  }

  publish(channel: string, message: string, prefix = "table"): void {
    const url = `https://${this.baseURL}/publish/${prefix}/${channel}`
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: message,
    }).catch((error) => {
      console.error("Publication error for", url, error)
    })
  }

  async getOnlineCount(): Promise<number | null> {
    const url = `https://${this.baseURL}/publish/presence/lobby`
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { Accept: "application/json" },
      })
      const data = await response.json()
      return typeof data.subscribers === "number" ? data.subscribers : null
    } catch (error) {
      console.warn("Failed to fetch online count", error)
      return null
    }
  }

  private cleanup(key: string): void {
    this.clearTimer(key)
    const existingWs = this.websockets.get(key)
    if (existingWs) {
      // Remove listener to prevent it from triggering a reconnect loop on close()
      existingWs.onclose = null
      existingWs.close()
      this.websockets.delete(key)
    }
  }

  private clearTimer(key: string): void {
    const timer = this.reconnectionTimers.get(key)
    if (timer) {
      clearTimeout(timer)
      this.reconnectionTimers.delete(key)
    }
  }

  private async decodeMessage(data: unknown): Promise<string | null> {
    if (typeof data === "string") return data
    if (data instanceof Blob) return data.text()
    if (data instanceof ArrayBuffer) return new TextDecoder().decode(data)
    if (ArrayBuffer.isView(data)) return new TextDecoder().decode(data.buffer)
    return null
  }

  private normalizeEvent(event: Event): Record<string, unknown> {
    return {
      type: event.type,
      timeStamp: event.timeStamp,
      target: this.describeTarget(event.target),
    }
  }

  private describeTarget(target: EventTarget | null): string | null {
    return (
      (target as { constructor?: { name?: string } })?.constructor?.name ?? null
    )
  }

  private normalizeError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return { name: error.name, message: error.message, stack: error.stack }
    }
    return { message: String(error) }
  }

  private stringifyLog(value: unknown): string {
    try {
      return typeof value === "string" ? value : JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
}
