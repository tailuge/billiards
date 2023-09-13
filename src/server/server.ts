import { WebSocketServer, WebSocket } from "ws"
import { spawnSync } from "child_process"
import { EventUtil } from "../events/eventutil"
import { Client, Lobby } from "./lobby"
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
  console.log("upgrade request for websocket")
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
  const tableId = params.get("table") ?? "default"
  const name = params.get("name") ?? "anonymous"
  const client: Client = { ws: ws, name: name }

  console.log(`'${name}' joined table '${tableId}'`)
  const event = lobby.joinTable(client, tableId)
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
