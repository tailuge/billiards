import { WebSocketServer } from "ws"
import { execSync } from "child_process"

const port = 8888
const wss = new WebSocketServer({ port: port })

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message)
    sendToOther(ws, message)
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

*/
