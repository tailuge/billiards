import { BeginEvent } from "../../events/beginevent"
import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { RejoinEvent } from "../../events/rejoinevent"
import { Tables } from "./tables"
import { Client } from "./tableinfo"
import { GameEvent } from "../../events/gameevent"
import { ServerLog } from "./serverlog"
import { EventType } from "../../events/eventtype"

export class Lobby {
  readonly tables = new Tables()

  createClient(ws, tableId, clientId, name): Client | undefined {
    if (!tableId || !clientId) {
      const message =
        "Invalid: Connection request must contain tableId and clientId"
      ServerLog.log(message)
      ws.send(message)
      return undefined
    }
    return { ws: ws, name: name, clientId: clientId }
  }

  private message(playerId, text) {
    return new ChatEvent(playerId, text)
  }

  joinTable(client, tableId, clientSentCount = 0, clientRecvCount = 0) {
    const tableInfo = this.tables.getTable(tableId)

    if (tableInfo.isActive(client)) {
      this.sendInfo(client, tableId, "Already joined in another window")
      return false
    }

    if (tableInfo.isFull()) {
      this.sendInfo(client, tableId, "Table already full")
      return false
    }

    if (tableInfo.isRejoin(client)) {
      return this.rejoin(client, tableInfo, clientSentCount, clientRecvCount)
    }

    tableInfo.join(client)

    if (tableInfo.clients.length == 1) {
      this.sendInfo(client, tableId, "Waiting for opponent...")
      return true
    }

    // both players arrived
    this.notifyJoined(client, tableInfo)
    this.send(client, tableId, new BeginEvent())
    return true
  }

  rejoin(client, tableInfo, clientSentCount, clientRecvCount) {
    const history = tableInfo.eventHistory.get(client.clientId)
    const sentToClient = history.sentTo.length
    const recvFromClient = history.recvFrom.length
    const rejoin: RejoinEvent = new RejoinEvent(
      clientSentCount - recvFromClient,
      sentToClient - clientRecvCount
    )
    tableInfo.rejoin(client)
    this.send(client, tableInfo.tableId, rejoin)
    return true
  }

  notifyJoined(client, tableInfo) {
    const otherClient = tableInfo.otherClients(client)[0]
    const message = this.message(
      "lobby",
      `${client.name} and ${otherClient.name} have joined '${tableInfo.tableId}'`
    )
    this.send(client, tableInfo.tableId, message)
    this.send(otherClient, tableInfo.tableId, message)
  }

  handleTableMessage(client: Client, tableId, message) {
    const tableInfo = this.tables.getTable(tableId)
    const m = message.toString()
    const event = EventUtil.fromSerialised(m)
    const json = JSON.parse(m)
    const mtype = json.type
    const info = `received: ${mtype} from ${client.name}`
    ServerLog.log(info)
    tableInfo.recordRecvEvent(client, event)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, event)
    })
  }

  handleLeaveTable(client, tableId) {
    const tableInfo = this.tables.getTable(tableId)
    tableInfo.leave(client)
    const message = this.message(client.name, `${client.name} has left`)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, message)
    })
  }

  sendInfo(client, tableId, text) {
    this.send(client, tableId, this.message("info", text))
  }

  send(client, tableId, event: GameEvent) {
    if (event.type !== EventType.AIM) {
      ServerLog.log(`sending to ${client.name} event ${event.type}`)
    }
    this.tables.getTable(tableId).recordSentEvent(client, event)
    client.ws?.send(EventUtil.serialise(event))
  }
}
