const WebSocket = require('ws');

const port = process.env.PORT || 8888;
console.log(`Starting websocketserver on port ${port}`);

const wss = new WebSocket.Server({ port: port });

const start=`{"type":"BEGIN"}`;
const clientToRoom = [];
const rooms = [[]];
var pendingRoom = 0;
var idFountain = 3000;
wss.on("connection", function connection(ws) {

  ws.id = idFountain++;
  rooms[pendingRoom].push(ws);
  clientToRoom[ws.id] = pendingRoom;
  console.log(`Room ${pendingRoom} has ${rooms[pendingRoom].length} partcipants`);
  
  if (rooms[pendingRoom].length == 2) {

    // create pair and mkae new pending room
    console.log(`Room ${pendingRoom} has ${rooms[pendingRoom].length} partcipants`);
    pendingRoom++;
    rooms[pendingRoom] = [];

    // send begin event
    console.log("Sending begin event");
    ws.send(start);
  } 


  ws.on("message", function incoming(message) {
    const m = JSON.parse(message);
    console.log(`received: ${m.type} from ${ws.id}`);
    sendToOthersInRoom(ws, message.toString());
  });
});

function sendToOthersInRoom(ws, data) {
  const room = rooms[clientToRoom[ws.id]];
  room.forEach((client) => {
    if (client.id !== ws.id) {
      console.log(`Sending message in room ${clientToRoom[ws.id]} to ${client.id}`);
      client.send(data);
    }
  })
}


console.log("WebsocketServer started")
console.log("https://tailuge.github.io/billiards/dist/?websocketserver=wss://billiardsserver.herokuapp.com/ws")
console.log("https://dashboard.heroku.com/apps/billiardsserver/logs")
