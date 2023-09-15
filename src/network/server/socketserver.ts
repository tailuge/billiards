import { WebSocketServer, WebSocket } from "ws"
import { spawnSync } from "child_process"

import { EventUtil } from "../../events/eventutil"
import { Lobby } from "./lobby"

export class SocketServer {
  readonly port
  readonly wss = new WebSocketServer({ noServer: true })
  readonly lobby = new Lobby()

  constructor(port) {
    this.port = port
    console.log(`WebSocketServer running on port ${port}`)
    const gitpodCommand = spawnSync(`gp`, ["url", `${port}`], {
      shell: false,
    }).stdout
    if (gitpodCommand !== null) {
      const gitpodUrl = gitpodCommand.toString()
      console.log(`WebSocketServer is exposed on gitpod at ${gitpodUrl}`)
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
    const name = params.get("name") ?? "anonymous"
    const client = this.lobby.createClient(ws, tableId, clientId, name)
    if (!client) {
      const message =
        "Invalid: Connection request must contain tableId and clientId"
      ws.send(message)
      console.log(message, params)
      return
    }

    const event = this.lobby.joinTable(client, tableId)
    const json = JSON.stringify(event)
    console.log(
      `'${name}':${clientId} requesting to join table => '${tableId}' response is ${json}`
    )
    ws.send(EventUtil.serialise(event))
    // needs to close if not admitted and client needs to not retry
    
    ws.on("message", (message) => {
      const info = this.lobby.handleTableMessage(client, tableId, message)
      if (!info.includes(" AIM ")) {
        console.log(info)
      }
    })

    ws.on("close", (_) => {
      this.lobby.handleLeaveTable(client, tableId)
      console.log(`'${name}' left table '${tableId}'`)
    })
  }
}
