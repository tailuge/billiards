import { WebSocketServer } from "ws"
import { execSync } from "child_process"
import { BeginEvent } from "../events/beginevent"
import { EventUtil } from "../events/eventutil"

const port = process.env.PORT || 8888
console.log(`Starting websocketserver on port ${port}`)
const wss = new WebSocketServer({ port: port })

wss.on("connection", function connection(ws) {
  if (wss.clients.size == 2) {
    console.log("Two connections, sending start")
    console.log(EventUtil.serialise(new BeginEvent()))
    ws.send(EventUtil.serialise(new BeginEvent()))
  }
  ws.on("message", function incoming(message) {
    console.log("received: %s", message)
    sendToOther(ws, message.toString())
  })
})

function sendToOther(ws, data: string): void {
  wss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(data)
    }
  })
}

const exposedPort = execSync(`echo $(gp url ${port})`)
console.log(
  `WebSocketServer on localhost:${port} is exposed through gitpod at ${exposedPort}`
)

/*

client:

echo $(gp url 8888)

use url in:

var ws = new WebSocket("wss://8888-beige-bobcat-bxbv4rs0.ws-eu16.gitpod.io/ws");
ws.onclose = function() { console.log("close"); };
ws.onerror = function() { console.log("error"); };
ws.onmessage = function(e) { console.log("received:",e); };
ws.onopen = function() { console.log("open"); };

ws.send("hi")
ws.close()


create game
{p1:guid, p2:guid, spectator:guid}

join guid

only listen to p1,p2
broadcast to all

*/
