/**
 * Handle websocket connection to server
 */
export class SocketConnection {
  ws: WebSocket

  constructor(url: string) {
    this.ws = new WebSocket(url)
    this.ws.onclose = this.log
    this.ws.onerror = this.log
    this.ws.onmessage = this.log
    this.ws.onopen = this.log
  }

  send(e: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this.ws.send(e)
  }

  log(e: any) {
    console.log(e)
  }
}
