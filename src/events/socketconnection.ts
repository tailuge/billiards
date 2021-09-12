/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket
  eventHandler

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.ws.onopen = this.log
    this.ws.onclose = this.log
    this.ws.onerror = this.log
    this.ws.onmessage = (e) => {
      console.log(this.eventHandler)
      e.data.text().then((text) => {
        console.log(text)
        this.eventHandler(text)
      })
    }
  }

  send(e) {
    this.ws.send(e)
  }

  log(e) {
    console.log("socket:", e.type)
    if (e.data) {
      e.data.text().then((text) => console.log(text))
    }
  }
}
