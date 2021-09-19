import { WebSocketServer } from "ws"
import { execSync } from "child_process"
import { BeginEvent } from "../events/beginevent"
import { EventUtil } from "../events/eventutil"

const port = process.env.PORT || 8888
console.log(`Starting websocketserver on port ${port}`)
const wss = new WebSocketServer({ port: port })

const clientToRoom: Array<any> = []
const rooms: Array<Array<any>> = [[]]
var pendingRoom = 0
var idFountain = 300
wss.on("connection", function connection(ws) {
  ws.id = idFountain++
  rooms[pendingRoom].push(ws)
  clientToRoom[ws.id] = pendingRoom
  console.log(
    `Room ${pendingRoom} has ${rooms[pendingRoom].length} partcipants`
  )

  if (rooms[pendingRoom].length == 2) {
    // create pair and make new pending room
    pendingRoom++
    rooms[pendingRoom] = []
    // send begin event
    console.log("Sending begin event")
    ws.send(EventUtil.serialise(new BeginEvent()))
  }

  ws.on("message", function incoming(message) {
    const m = JSON.parse(message)
    console.log(`received: ${m.type} from ${ws.id}`)
    sendToOthersInRoom(ws, message.toString())
  })

  ws.on("close", function incoming(_) {
    console.log(`close from ${ws.id}, closing room ${clientToRoom[ws.id]}`)
    rooms[clientToRoom[ws.id]] = []
  })
})

function sendToOthersInRoom(ws, data: string): void {
  const room = rooms[clientToRoom[ws.id]]
  room.forEach((client) => {
    if (client.id !== ws.id) {
      console.log(
        `Sending message in room ${clientToRoom[ws.id]} to ${client.id}`
      )
      client.send(data)
    }
  })
}

const exposedPort = execSync(`echo $(gp url ${port})`)
console.log(
  `WebSocketServer on localhost:${port} is exposed through gitpod at ${exposedPort}`
)
