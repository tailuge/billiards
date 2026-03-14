import { MessageRelay } from "./messagerelay"

export class NchanMessageRelay implements MessageRelay {
  private readonly websockets: Map<string, WebSocket> = new Map()

  constructor(
    private readonly baseURL: string = "billiards-network.onrender.com"
  ) {}

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = "table"
  ): void {
    const url = `wss://${this.baseURL}/subscribe/${prefix}/${channel}`
    const ws = new WebSocket(url)
    console.log("Subscribed to ", url)
    ws.onmessage = async (event: MessageEvent) => {
      let decoded: string | null = null
      try {
        decoded = await this.decodeMessage(event.data)
        if (decoded === null) {
          console.warn("WebSocket message ignored (unsupported type):", {
            type: typeof event.data,
            constructor: (event.data as { constructor?: { name?: string } })
              ?.constructor?.name,
          })
          return
        }
        callback(decoded)
      } catch (error) {
        console.warn("WebSocket message handling failed:", {
          error,
          message: decoded ?? event.data,
        })
      }
    }

    ws.onerror = (error: Event) => {
      console.warn("WebSocket error:", error)
    }

    ws.onopen = () => {
      console.log(`Connected to ${url}`)
    }

    ws.onclose = (event: CloseEvent) => {
      console.warn(`Disconnected from ${url}:`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      })
      // Reconnect if needed could be added here
    }

    this.websockets.set(`${prefix}/${channel}`, ws)
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
      console.error("Publication error:", error)
    })
  }

  async getOnlineCount(): Promise<number | null> {
    try {
      const response = await fetch(
        `https://${this.baseURL}/publish/presence/lobby`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        }
      )
      const data = await response.json()
      return typeof data.subscribers === "number" ? data.subscribers : null
    } catch {
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
}
