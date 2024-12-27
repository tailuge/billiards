import { MessageRelay } from "./messagerelay"

export class NchanMessageRelay<T> implements MessageRelay<T> {

  private websockets: Map<string, WebSocket> = new Map()

  constructor(private readonly baseURL: string) { }

  subscribe(channel: string, callback: (message: T) => void): void {
    const url = `${this.baseURL}/subscribe/${channel}`
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as T
        callback(message)
      } catch (e) {
        console.error('Error parsing message:', e)
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    };

    this.websockets.set(channel, ws)
  }

  publish(channel: string, message: T): void {
    const url = `${this.baseURL}/publish/${channel}`
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .catch((error) => {
        console.error('Publication error:', error)
      });
  }
}