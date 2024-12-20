import * as express from "express"
import { SocketServer } from "./socketserver"
import { ServerLog } from "./serverlog"

ServerLog.enable = true

const port = Number(process.env.PORT || 8888)
const socketserver = new SocketServer(port)
const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/dist", express.static("dist"))
app.get("/logs", (_, res) => {
  res.send(`<pre style="font-size: smaller;">${ServerLog.record}</pre>`)
})
app.get("/", (_, res) => {
  res.redirect("/dist/multi.html")
})

const server = app.listen(port, () =>
  ServerLog.log(`Webserver running on http://localhost:${port}/dist/multi.html`)
)
server.keepAliveTimeout = 60 * 1000
server.headersTimeout = 60 * 1000

server.on("upgrade", (request, socket, head) => {
  ServerLog.log(`upgrade request for websocket ${request.url}`)
  socketserver.wss.handleUpgrade(request, socket, head, (ws) => {
    socketserver.wss.emit("connection", ws, request)
  })
})
