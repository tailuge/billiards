import { BeginEvent } from "../../events/beginevent"
import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { RejoinEvent } from "../../events/rejoinevent"
import { Tables } from "./tables"
import { Client } from "./tableinfo"
import { GameEvent } from "../../events/gameevent"

export class Lobby {
  readonly tables = new Tables()

  createClient(ws, tableId, clientId, name): Client | undefined {
    if (!tableId || !clientId) {
      return undefined
    }
    return { ws: ws, name: name, clientId: clientId }
  }

  private message(playerId, text) {
    return new ChatEvent(playerId, text)
  }

  joinTable(client, tableId) {
    const tableInfo = this.tables.getTable(tableId)

    if (tableInfo.isActive(client)) {
      return this.message(client.name, "Already joined in another window")
    }

    if (tableInfo.isRejoin(client)) {
      return this.rejoin(client, tableId)
    }
    if (tableInfo.isFull()) {
      return this.message(client.name, "Table already full")
    }

    tableInfo.join(client)

    if (tableInfo.clients.length == 1) {
      return this.message(client.name, "Waiting for opponent...")
    }

    // both players arrived
    this.notifyJoined(client, tableInfo)
    return new BeginEvent()
  }

  rejoin(client, tableId) {
    const tableInfo = this.tables.getTable(tableId)
    const history = tableInfo.eventHistory.get(client.clientId)
    console.log("sentTo  :" + history?.sentTo.length)
    console.log("recvFrom:" + history?.recvFrom.length)
    const rejoin: RejoinEvent = new RejoinEvent(null, null)
    rejoin.fromOther = rejoin.senderId !== client.clientId
    return rejoin
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
    tableInfo.recordRecvEvent(client, event)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, event)
    })
    return info
  }

  handleLeaveTable(client, tableId) {
    const tableInfo = this.tables.getTable(tableId)
    tableInfo.leave(client)
    const message = this.message(client.name, `${client.name} has left`)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, tableId, message)
    })
  }

  send(client, tableId, event: GameEvent) {
    this.tables.getTable(tableId).recordSentEvent(client, event)
    client.ws?.send(EventUtil.serialise(event))
  }
}
