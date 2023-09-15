import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { GameEvent } from "../../events/gameevent"

/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket
  eventHandler
  retryCount = 0
  retryDelay = 1000
  readonly url
  constructor(url: string) {
    this.url = url
    this.connect()
  }

  connect() {
    console.log("connecting to " + this.url)
    this.ws = new WebSocket(this.url)
    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // binary frame
        const s = String.fromCharCode.apply(
          null,
          Array.from(new Uint16Array(event.data))
        )
        console.log(s)
      } else {
        // text frame
        this.eventHandler(event.data)
      }
    }
    this.ws.onclose = (event) => {
      this.notifyClient(`connection closed: ${JSON.stringify(event)}`)
      this.reconnect()
    }
    this.ws.onerror = (event) => {
      this.notifyClient(`error with connection: ${JSON.stringify(event)}`)
      this.ws.close()
    }
  }

  reconnect() {
    console.log(
      `reconnecting (${this.retryCount}) after ${this.retryDelay / 1000}s`
    )
    if (this.retryCount++ < 25) {
      setTimeout(() => {
        this.connect()
      }, this.retryDelay)
      this.retryDelay += 1000
    }
  }

  notifyClient(message) {
    console.log(message)
    this.eventHandler(EventUtil.serialise(new ChatEvent("network", message)))
  }

  send(event: GameEvent) {
    this.ws.send(EventUtil.serialise(event))
  }

  close() {
    console.log("Force close socket")
    this.ws.close()
  }
}
