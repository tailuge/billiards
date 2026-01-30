import { MessageRelay } from "./messagerelay"
import fetch from "cross-fetch"

export class NchanMessageRelay implements MessageRelay {
  private readonly websockets: Map<string, WebSocket> = new Map()

  constructor(
    private readonly baseURL: string = "billiards-network.onrender.com"
  ) { }

  subscribe(
    channel: string,
    callback: (message: string) => void,
    prefix = "table"
  ): void {
    const url = `wss://${this.baseURL}/subscribe/${prefix}/${channel}`
    const ws = new WebSocket(url)
    console.log("Subscribed to ", url)
    ws.onmessage = (event: MessageEvent) => {
      try {
        const message = event.data
        callback(message)
      } catch (e) {
        console.error("Error parsing message:", e)
      }
    }

    ws.onerror = (error: Event) => {
      console.error("WebSocket error:", error)
    }

    ws.onopen = () => {
      console.log(`Connected to ${url}`)
    }

    ws.onclose = (event: CloseEvent) => {
      console.log(`Disconnected from ${url}:`, event.reason)
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
      const response = await fetch(`https://${this.baseURL}/basic_status`)
      const text = await response.text()
      const match = text.match(/Active connections:\s+(\d+)/)
      return match ? parseInt(match[1], 10) - 1 : null
    } catch {
      return null
    }
  }
}
