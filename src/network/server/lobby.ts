import { BeginEvent } from "../../events/beginevent"
import { ChatEvent } from "../../events/chatevent"
import { EventUtil } from "../../events/eventutil"
import { RejoinEvent } from "../../events/rejoinevent"
import { EventType } from "../../events/eventtype"
import { Tables } from "./tables"
import { Client } from "./tableinfo"

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
      const rejoin: RejoinEvent = tableInfo.lastMessage
      rejoin.fromOther = rejoin.senderId !== client.clientId
      return rejoin
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

  notifyJoined(client, tableInfo) {
    const otherClient = tableInfo.otherClients(client)[0]
    const message = EventUtil.serialise(
      this.message(
        "lobby",
        `${client.name} and ${otherClient.name} have joined '${tableInfo.tableId}'`
      )
    )
    this.send(client, message)
    this.send(otherClient, message)
  }

  handleTableMessage(client: Client, tableId, message) {
    const tableInfo = this.tables.getTable(tableId)
    const m = message.toString()
    const json = JSON.parse(m)
    const mtype = json.type
    if (mtype === EventType.HIT) {
      tableInfo.lastMessage = new RejoinEvent(client.clientId, json)
    }
    const info = `received: ${mtype} from ${client.name}`
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, m)
    })
    return info
  }

  handleLeaveTable(client, tableId) {
    const tableInfo = this.tables.getTable(tableId)
    tableInfo.leave(client)
    const message = this.message(client.name, `${client.name} has left`)
    tableInfo.otherClients(client).forEach((c) => {
      this.send(c, EventUtil.serialise(message))
    })
  }

  send(client, message) {
    client.ws?.send(message)
  }
}
