import { ChatEvent } from "./chatevent"
import { EventUtil } from "./eventutil"

/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket
  eventHandler

  constructor(url: string) {
    console.log("connecting to " + url)
    this.ws = new WebSocket(url)
    this.ws.onopen = this.log
    this.ws.onclose = this.log
    this.ws.onerror = (e) => {
      console.log(e)
    }
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
    }
    this.ws.onerror = (event) => {
      this.notifyClient(`error with connection: ${JSON.stringify(event)}`)
    }
  }

  notifyClient(message) {
    console.log(message)
    this.eventHandler(EventUtil.serialise(new ChatEvent("network", message)))
  }

  send(e: string) {
    this.ws.send(e)
  }

  log(e) {
    console.log("socket:", e.type)
    if (e.data) {
      e.data.text().then((text) => console.log(text))
    }
  }
}
