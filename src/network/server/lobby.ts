import { BeginEvent } from "../../events/beginevent"
import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { Tables } from "./tables"
import { Client, TableInfo } from "./tableinfo"
import { GameEvent } from "../../events/gameevent"
import { ServerLog } from "./serverlog"
import { Rejoin } from "./rejoin"

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

  joinTable(client, tableId, clientLastSent = "", clientLastRecv = "") {
    const tableInfo = this.tables.getTable(tableId)

    if (
      tableInfo.isActive(client) &&
      clientLastSent === "" &&
      clientLastRecv === ""
    ) {
      this.sendInfo(client, tableId, "Already joined in another window")
      return false
    }

    if (tableInfo.isRejoin(client)) {
      return this.rejoin(client, tableInfo, clientLastSent, clientLastRecv)
    }

    if (tableInfo.isFull()) {
      this.sendInfo(client, tableId, "Table already full")
      return false
    }

    if (tableInfo.hasNoHistory(client) && clientLastRecv) {
      this.sendInfo(client, tableId, "Cannot rejoin empty table")
      return false
    }

    tableInfo.join(client)

    if (tableInfo.clients.length == 1) {
      this.sendInfo(client, tableId, "Waiting for opponent...")
      return true
    }

    // both players arrived
    this.notifyJoined(tableInfo)
    this.send(client, tableId, new BeginEvent())
    return true
  }

  rejoin(client: Client, tableInfo: TableInfo, clientLastSent, clientLastRecv) {
    const rejoin = new Rejoin(client, tableInfo, clientLastSent, clientLastRecv)
    const rejoinEvent = rejoin.delta()
    tableInfo.leave(client)
    tableInfo.rejoin(client)
    this.notifyOthers(client, tableInfo, `${client.name} rejoined`)
    const toReplay = rejoin.replayEvents(rejoinEvent)
    this.send(client, tableInfo.tableId, rejoinEvent)
    toReplay.forEach((e) => {
      ServerLog.log(`replay ${e.sequence} ${e.type}`)
      this.send(client, tableInfo.tableId, e)
    })
    return true
  }

  notifyOthers(client, tableInfo, message) {
    tableInfo.otherClients(client).forEach((c) => {
      this.sendInfo(c, tableInfo.tableId, message)
    })
  }

  notifyJoined(tableInfo: TableInfo) {
    const message = `${tableInfo.clients
      .map((c) => c.name)
      .join()} have joined ${tableInfo.tableId}`
    tableInfo.clients.forEach((c) => {
      this.sendInfo(c, tableInfo.tableId, message)
    })
  }

  handleTableMessage(client: Client, tableId, message) {
    const tableInfo = this.tables.getTable(tableId)
    const m = message.toString()
    const event = EventUtil.fromSerialised(m)
    tableInfo.recordRecvEvent(client, event)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, event)
    })
  }

  handleLeaveTable(client, tableId) {
    ServerLog.log(`${client.name}:${client.clientId} closed connection`)
    const tableInfo = this.tables.getTable(tableId)
    ServerLog.log(
      `current clients: ${tableInfo.clients.map((c) => c.clientId)}`
    )
  }

  seq = 1000
  private message(playerId, text) {
    const event = new ChatEvent(playerId, text)
    event.sequence = `server-${this.seq++}`
    return event
  }

  sendInfo(client, tableId, text) {
    this.send(client, tableId, this.message("info", text))
  }

  send(client, tableId, event: GameEvent) {
    if (client.ws?.readyState >= 2) {
      ServerLog.log(`not sending to ${client.name}:${client.clientId}`)
      return
    }
    this.tables.getTable(tableId).recordSentEvent(client, event)
    client.ws?.send(EventUtil.serialise(event))
    ServerLog.logEvent(`sending to ${client.name}:${client.clientId}`, event)
  }
}
