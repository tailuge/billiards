import { MessageRelay } from "./messagerelay"

export class NchanMessageRelay implements MessageRelay {
  private readonly websockets: Map<string, WebSocket> = new Map()
  private readonly lastProcessedTimestamps: Map<string, number> = new Map()
  private readonly reconnectionTimers: Map<
    string,
    ReturnType<typeof setTimeout>
  > = new Map()

  constructor(
    private readonly baseURL: string = "billiards-network.onrender.com"
  ) {}

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = "table"
  ): void {
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

    console.log(`Subscribed to ${url} (backoff: ${backoffDelay}ms)`)

    ws.onmessage = async (event: MessageEvent) => {
      try {
        const decoded = await this.decodeMessage(event.data)
        if (decoded === null) return

        const parsed = JSON.parse(decoded)
        const timestamp = parsed.meta?.ts

        if (typeof timestamp === "number") {
          const lastTs = this.lastProcessedTimestamps.get(key) ?? 0
          if (timestamp <= lastTs) {
            // console.log("Discarding duplicate message with timestamp", timestamp)
            return
          }
          this.lastProcessedTimestamps.set(key, timestamp)
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
      console.log(`Connected to ${url}`)
      this.reconnectionTimers.delete(key)
    }

    ws.onclose = (event: CloseEvent) => {
      console.warn(
        `Disconnected from ${url}:`,
        this.stringifyLog({
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        })
      )

      if (this.websockets.get(key) === ws) {
        const nextDelay = Math.min(backoffDelay * 2, 30000)
        const timer = setTimeout(() => {
          this.connect(channel, callback, prefix, nextDelay)
        }, backoffDelay)
        this.reconnectionTimers.set(key, timer)
      }
    }

    this.websockets.set(key, ws)
  }

  publish(channel: string, message: string, prefix = "table"): void {
    const url = `https://${this.baseURL}/publish/${prefix}/${channel}`
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
      console.warn("Failed to fetch online count from", url, error)
      return null
    }
  }

  private async decodeMessage(data: unknown): Promise<string | null> {
    if (typeof data === "string") return data
    if (data instanceof Blob) {
      return data.text()
    }
    if (data instanceof ArrayBuffer) {
      return new TextDecoder().decode(data)
    }
    if (ArrayBuffer.isView(data)) {
      return new TextDecoder().decode(data.buffer)
    }
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
    const constructorName = (target as { constructor?: { name?: string } })
      ?.constructor?.name
    if (!target || typeof constructorName !== "string") {
      return null
    }
    return constructorName ?? null
  }

  private normalizeError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }
    return { message: String(error) }
  }

  private stringifyLog(value: unknown): string {
    try {
      if (typeof value === "string") return value
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
}
