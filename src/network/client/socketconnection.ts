import { ChatEvent } from "../../events/chatevent"
import { EventHistory } from "../../events/eventhistory"
import { EventUtil } from "../../events/eventutil"
import { GameEvent } from "../../events/gameevent"
import { RejoinEvent } from "../../events/rejoinevent"

/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket
  id: string
  eventHandler
  retryCount = 0
  retryDelay = 500
  lastSentIdentifier = ""
  lastRecvIdentifier = ""
  sequenceId = 1000
  sent: GameEvent[] = []
  readonly url
  constructor(url: string, id: string) {
    this.url = url
    this.id = id
    this.connect()
  }

  connect() {
    const encoded = encodeURI(
      `${this.url}&sent=${this.lastSentIdentifier}&recv=${this.lastRecvIdentifier}`
    )
    console.log("connecting to " + encoded)
    this.ws = new WebSocket(encoded)
    this.ws.onopen = () => {
      this.retryCount = 0
      this.retryDelay = 500
      this.notifyClient(`✓`)
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
        this.preprocess(event.data)
        this.eventHandler(event.data)
      }
    }
    this.ws.onclose = (_) => {
      console.log(`close`)
      this.reconnect()
    }
    this.ws.onerror = (_) => {
      this.notifyClient(`🗲`)
    }
  }

  preprocess(data) {
    const event = EventUtil.fromSerialised(data)
    this.lastRecvIdentifier = event.sequence ?? ""
    if (event instanceof RejoinEvent) {
      if (event.clientResendFrom) {
        EventHistory.after(this.sent, event.clientResendFrom).forEach((e) => {
          console.log(`Replaying ${e.sequence} ${e.type}`)
          this.ws.send(EventUtil.serialise(e))
        })
      }
    }
  }

  reconnect() {
    if (this.ws.readyState === 1) {
      console.log("already connected")
      return
    }
    this.notifyClient(`↺`)
    if (this.retryCount++ < 10) {
      setTimeout(() => {
        this.connect()
      }, this.retryDelay)
      this.retryDelay += 2000
    } else {
      this.notifyClient("cannot reconnect")
    }
  }

  notifyClient(message) {
    console.log(message)
    this.eventHandler(EventUtil.serialise(new ChatEvent("💻", message)))
  }

  send(event: GameEvent) {
    this.lastSentIdentifier = `${this.id}-${this.sequenceId++}`
    event.sequence = this.lastSentIdentifier
    this.ws.send(EventUtil.serialise(event))
    this.sent.push(event)
  }

  close() {
    console.log("Force close socket")
    this.ws.close()
  }
}
