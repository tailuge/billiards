import { WebSocketServer, WebSocket } from "ws"
import { Lobby } from "./lobby"
import { ServerLog } from "./serverlog"

export class SocketServer {
  readonly port
  readonly wss = new WebSocketServer({ noServer: true })
  readonly lobby = new Lobby()
  constructor(port) {
    this.port = port
    ServerLog.log(`WebSocketServer running on port ${port}`)
    this.wss.on("connection", (ws: WebSocket, req) => {
      this.connection(ws, req)
    })
  }

  private parse(url) {
    const params = url.split("?").pop()
    return new URLSearchParams(params)
  }

  connection(ws: WebSocket, req) {
    const params = this.parse(req.url)
    const clientId = params.get("clientId")
    const tableId = params.get("tableId")
    const sent = params.get("sent") ?? ""
    const recv = params.get("recv") ?? ""
    const name = params.get("name") ?? "anonymous"

    ServerLog.log(`${name}:${clientId} requesting to join ${tableId}`)

    const client = this.lobby.createClient(ws, tableId, clientId, name)
    if (!client) {
      return
    }

    if (params.has("spectator")) {
      this.lobby.spectateTable(client, tableId)

      ws.on("close", (_) => {
        this.lobby.handleUnspectateTable(client, tableId)
      })
      return
    }

    if (!this.lobby.joinTable(client, tableId, sent, recv)) {
      return
    }

    ws.on("message", (message) => {
      this.lobby.handleTableMessage(client, tableId, message)
    })

    ws.on("close", (_) => {
      this.lobby.handleLeaveTable(client, tableId)
    })
  }
}
