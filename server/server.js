const WebSocket = require('ws');

const port = process.env.PORT || 8888;
console.log(`Starting websocketserver on port ${port}`);

const wss = new WebSocket.Server({ port: port });

wss.on("connection", function connection(ws) {
  if (wss.clients.size == 2) {
    console.log("Two connections, sending start");
    console.log(EventUtil.serialise(new BeginEvent()));
    ws.send(EventUtil.serialise(new BeginEvent()));
  }
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    sendToOther(ws, message.toString());
  })
})

function sendToOther(ws, data) {
  wss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(data);
    }
  });
}

console.log("WebsocketServer started")


