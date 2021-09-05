import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8888 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('something');
  });

});


console.log('WebSocketServer is running');

/*
server:

tsc src/server/server.ts 
node src/server/server.js 

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