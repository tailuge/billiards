import { GameEvent } from "../../events/gameevent"
import { WebSocket } from "ws"

export type Client = { ws?: WebSocket; name: string; clientId: string }

export class TableInfo {
  readonly tableId: string
  readonly owningClientIds: string[] = []
  clients: Client[] = []

  eventHistory: Map<string, { sentTo: GameEvent[]; recvFrom: GameEvent[] }> =
    new Map()

  constructor(tableId) {
    this.tableId = tableId
  }

  recordSentEvent(client, event) {
    if (!this.eventHistory.has(client.clientId)) {
      this.eventHistory.set(client.clientId, { sentTo: [], recvFrom: [] })
    }
    const clientHistory = this.eventHistory.get(client.clientId)
    clientHistory?.sentTo.push(event)
    //    console.log(clientHistory?.sent)
  }

  recordRecvEvent(client, event) {
    if (!this.eventHistory.has(client.clientId)) {
      this.eventHistory.set(client.clientId, { sentTo: [], recvFrom: [] })
    }
    const clientHistory = this.eventHistory.get(client.clientId)
    clientHistory?.recvFrom.push(event)
    //  console.log(clientHistory?.recv)
  }

  join(client: Client) {
    this.owningClientIds.push(client.clientId)
    this.clients.push(client)
  }

  rejoin(client: Client) {
    this.clients.push(client)
  }

  leave(client: Client) {
    this.clients = this.otherClients(client)
  }

  otherClients(client): Client[] {
    return this.clients.filter((c) => c !== client)
  }

  isRejoin(client: Client) {
    return (
      this.owningClientIds.includes(client.clientId) && !this.isActive(client)
    )
  }

  isActive(client: Client): boolean {
    return this.clients.some((c) => c.clientId === client.clientId)
  }

  isFull() {
    return this.clients.length == 2
  }
}
