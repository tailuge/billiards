import {Server} from 'ws';
var port = 8888
// initialize the WebSocket server instance
const server = new Server({ port: port });


console.log('Server is running on port', port, server);