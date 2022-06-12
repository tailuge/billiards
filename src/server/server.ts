import { WebSocketServer } from "ws"
import { execSync } from "child_process"
import { BeginEvent } from "../events/beginevent"
import { EventUtil } from "../events/eventutil"

const port = Number(process.env.PORT || 8888)
console.log(`Starting websocketserver on port ${port}`)
const wss = new WebSocketServer({ port: port })

const clientId = new Map<Object, number>()
const clientToRoom = new Map<Object, number>()
const rooms: Array<Array<any>> = [[]]
let pendingRoom = 0
let clientIdFountain = 0

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
    // send begin event
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

const exposedPort = execSync(`echo $(gp url ${port})`)
console.log(
  `WebSocketServer on localhost:${port} is exposed through gitpod at ${exposedPort}`
)
