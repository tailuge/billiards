import { WebSocketServer, WebSocket } from "ws"
import { spawnSync } from "child_process"
import { Lobby } from "./lobby"
import { ServerLog } from "./serverlog"

export class SocketServer {
  readonly port
  readonly wss = new WebSocketServer({ noServer: true })
  readonly lobby = new Lobby()
  constructor(port) {
    this.port = port
    ServerLog.log(`WebSocketServer running on port ${port}`)
    const gitpodCommand = spawnSync(`gp`, ["url", `${port}`], {
      shell: false,
    }).stdout
    if (gitpodCommand !== null) {
      const gitpodUrl = gitpodCommand.toString()
      ServerLog.log(`WebSocketServer is exposed on gitpod at ${gitpodUrl}`)
    }

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
    const sent = Number(params.get("sent"))
    const recv = Number(params.get("recv"))
    const name = params.get("name") ?? "anonymous"
    const client = this.lobby.createClient(ws, tableId, clientId, name)
    if (!client) {
      const message =
        "Invalid: Connection request must contain tableId and clientId"
      ws.send(message)
      ServerLog.log(message + params)
      return
    }

    const event = this.lobby.joinTable(client, tableId, sent, recv)
    const json = JSON.stringify(event)
    ServerLog.log(
      `'${name}':${clientId} requesting to join table => '${tableId}' response is ${json}`
    )
    this.lobby.send(client, tableId, event)
    // needs to close if not admitted and client needs to not retry

    ws.on("message", (message) => {
      const info = this.lobby.handleTableMessage(client, tableId, message)
      if (!info.includes(" AIM ")) {
        ServerLog.log(info)
      }
    })

    ws.on("close", (_) => {
      this.lobby.handleLeaveTable(client, tableId)
      ServerLog.log(`'${name}' left table '${tableId}'`)
    })
  }
}
