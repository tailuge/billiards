import { WebSocketServer, WebSocket } from "ws"
import { spawnSync } from "child_process"
import { BeginEvent } from "../events/beginevent"
import { EventUtil } from "../events/eventutil"
import * as express from "express"

const port = Number(process.env.PORT || 8888)

const app = express()

const server = app.listen(port, () =>
  console.log(`Webserver app listening on port ${port}!`)
)
server.keepAliveTimeout = 60 * 1000
server.headersTimeout = 60 * 1000

console.log(`Starting websocketserver on port ${port}`)
const wss = new WebSocketServer({ noServer: true })

const clientId = new Map<WebSocket, number>()
const clientToRoom = new Map<WebSocket, number>()
const rooms: Array<Array<WebSocket>> = [[]]
let pendingRoom = 0
let clientIdFountain = 0

server.on("upgrade", (request, socket, head) => {
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

app.get("/", (req, res) => {
  const host = req.headers.host
  const html = `<p>Billiards</p>
  <ul>
    <li><a href="https://tailuge.github.io/billiards/dist/">single player</a></li>
    <li><a href="https://tailuge.github.io/billiards/dist/?websocketserver=wss://${host}/ws">wait for pairing</a></li>
  </ul>`
  res.type("html").send(html)
})

wss.on("connection", function connection(ws) {
  const id = clientIdFountain++
  clientId.set(ws, id)
  console.log(`Client with id:${id} has joined`)
  rooms[pendingRoom].push(ws)
  clientToRoom.set(ws, pendingRoom)
  console.log(
    `Room ${pendingRoom} has ${rooms[pendingRoom].length} partcipants`
  )

  if (rooms[pendingRoom].length == 2) {
    // create pair and make new pending room
    pendingRoom++
    rooms[pendingRoom] = []
    console.log(`Sending begin event to client id:${clientId.get(ws)}`)
    ws.send(EventUtil.serialise(new BeginEvent()))
  }

  ws.on("message", function incoming(message) {
    const m = JSON.parse(message.toString())
    console.log(`received: ${m.type} from client id:${clientId.get(ws)}`)
    sendToOthersInRoom(ws, message.toString())
  })

  ws.on("close", function incoming(_) {
    console.log(
      `close from ${clientId.get(ws)}, closing room ${clientToRoom.get(ws)}`
    )
    const roomId = clientToRoom.get(ws)
    if (roomId) {
      rooms[roomId] = []
    }
  })
})

function sendToOthersInRoom(ws, data: string): void {
  const roomId = clientToRoom.get(ws)
  console.log(`Sending message in room ${roomId}`)

  if (roomId !== undefined) {
    const room = rooms[roomId]
    room.forEach((client) => {
      const participantId = clientId.get(client)
      if (participantId !== clientId.get(ws)) {
        console.log(`Sending message in room ${roomId} to ${participantId}`)
        client.send(data)
      }
    })
  }
}
