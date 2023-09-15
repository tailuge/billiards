import { RejoinEvent } from "../../events/rejoinevent"
import { WebSocket } from "ws"

export type Client = { ws?: WebSocket; name: string; clientId: string }

export class TableInfo {
  readonly tableId: string
  readonly owningClientIds: string[] = []
  clients: Client[] = []
  lastMessage = new RejoinEvent(null, null)

  constructor(tableId) {
    this.tableId = tableId
  }

  join(client: Client) {
    this.owningClientIds.push(client.clientId)
    this.clients.push(client)
  }

  leave(client: Client) {
    this.clients = this.clients.filter((c) => c === client)
  }

  otherClients(client): Client[] {
    return this.clients.filter((c) => c !== client)
  }

  isRejoin(client: Client) {
    return this.owningClientIds.includes(client.clientId)
  }

  isFull() {
    return this.owningClientIds.length == 2
  }
}
