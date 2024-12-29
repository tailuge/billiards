import { MessageRelay } from "./messagerelay"
import fetch from "cross-fetch"

export class NchanMessageRelay implements MessageRelay {
  private readonly websockets: Map<string, WebSocket> = new Map()

  constructor(
    private readonly baseURL: string = "billiards-network.onrender.com"
  ) {}

  subscribe(channel: string, callback: (message: string) => void): void {
    const url = `wss://${this.baseURL}/subscribe/table/${channel}`
    const ws = new WebSocket(url)
    console.log("Subscribed to ", url)
    ws.onmessage = (event: MessageEvent) => {
      try {
        console.log("Received message:", event)
        console.log("data:", event.data)
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
    }

    this.websockets.set(channel, ws)
  }

  publish(channel: string, message: string): void {
    const url = `https://${this.baseURL}/publish/table/${channel}`
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
}
