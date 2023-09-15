import { WebSocketServer, WebSocket } from "ws"
import { spawnSync } from "child_process"
import { EventUtil } from "../../events/eventutil"
import { Lobby } from "./lobby"
import * as express from "express"

const lobby = new Lobby()

const port = Number(process.env.PORT || 8888)

const app = express()
app.use("/dist", express.static("dist"))

const server = app.listen(port, () =>
  console.log(
    `Webserver app started, try http://localhost:${port}/dist/multi.html`
  )
)
server.keepAliveTimeout = 60 * 1000
server.headersTimeout = 60 * 1000

console.log(`Starting websocketserver on port ${port}`)
const wss = new WebSocketServer({ noServer: true })

server.on("upgrade", (request, socket, head) => {
  console.log(`upgrade request for websocket ${request.url}`)
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request)
  })
})

console.log(`WebSocketServer on https://localhost:${port}`)
const gitpodCommand = spawnSync(`gp`, ["url", `${port}`], {
  shell: false,
}).stdout
if (gitpodCommand !== null) {
  const gitpodUrl = gitpodCommand.toString()
  console.log(`WebSocketServer is exposed on gitpod at ${gitpodUrl}`)
}

app.get("/", (_, res) => {
  res.redirect("/dist/multi.html")
})

function parse(url) {
  const params = url.split("?").pop()
  return new URLSearchParams(params)
}

wss.on("connection", function connection(ws: WebSocket, req) {
  const params = parse(req.url)
  const clientId = params.get("clientId")
  const tableId = params.get("tableId")
  const name = params.get("name") ?? "anonymous"
  const client = lobby.createClient(ws, tableId, clientId, name)
  if (!client) {
    const message =
      "Invalid: Connection request must contain tableId and clientId"
    ws.send(message)
    console.log(message, params)
    return
  }

  const event = lobby.joinTable(client, tableId)
  console.log(
    `'${name}':${clientId} requesting to join table '${tableId}. Response is ${event.type}`
  )
  ws.send(EventUtil.serialise(event))

  ws.on("message", (message) => {
    const info = lobby.handleTableMessage(client, tableId, message)
    if (!info.includes(" AIM ")) {
      console.log(info)
    }
  })

  ws.on("close", (_) => {
    lobby.handleLeaveTable(client, tableId)
    console.log(`'${name}' left table '${tableId}'`)
  })
})
