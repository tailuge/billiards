const WebSocket = require('ws');

const port = process.env.PORT || 8888;
console.log(`Starting websocketserver on port ${port}`);

const wss = new WebSocket.Server({ port: port });

wss.on("connection", function connection(ws) {
  console.log("connection");
  if (wss.clients.size == 2) {
    console.log("Two connections, sending start");
    const start=`{"type":"BEGIN"}`;
    console.log(start);
    ws.send(start);
  }
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    sendToOther(ws, message.toString());
  })
})

function sendToOther(ws, data) {
  console.log("Send to others");
  wss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(data);
    }
  });
}

console.log("WebsocketServer started")
console.log("https://tailuge.github.io/billiards/dist/?websocketserver=wss://billiardsserver.herokuapp.com/ws")
console.log("https://dashboard.heroku.com/apps/billiardsserver/logs")
