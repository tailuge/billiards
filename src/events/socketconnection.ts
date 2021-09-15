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
    this.ws.onerror = this.log
    this.ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // binary frame
        var s = String.fromCharCode.apply(null, new Uint16Array(event.data))
        console.log(s)
      } else {
        // text frame
        this.eventHandler(event.data)
      }
    }
  }

  send(e: string) {
    this.ws.send(e)
  }

  log(e) {
    console.log("socket:", e.type)
    console.log(e)
    if (e.data) {
      e.data.text().then((text) => console.log(text))
    }
  }
}
