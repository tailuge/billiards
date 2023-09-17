import { GameEvent } from "../../events/gameevent"

export type Client = { ws; name: string; clientId: string }

export class TableInfo {
  readonly tableId: string
  readonly owningClientIds: string[] = []
  clients: Client[] = []

  eventHistory: Map<string, { sentTo: GameEvent[]; recvFrom: GameEvent[] }> =
    new Map()

  constructor(tableId) {
    this.tableId = tableId
  }

  getClientHistory(client) {
    if (!this.eventHistory.has(client.clientId)) {
      this.eventHistory.set(client.clientId, { sentTo: [], recvFrom: [] })
    }
    return this.eventHistory.get(client.clientId)
  }

  recordSentEvent(client, event) {
    const clientHistory = this.getClientHistory(client)
    clientHistory?.sentTo.push(event)
  }

  recordRecvEvent(client, event) {
    const clientHistory = this.getClientHistory(client)
    clientHistory?.recvFrom.push(event)
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
    return this.clients.filter((c) => c.clientId !== client.clientId)
  }

  isRejoin(client: Client) {
    return this.owningClientIds.includes(client.clientId)
  }

  isActive(client: Client): boolean {
    return this.clients.some((c) => c.clientId === client.clientId)
  }

  isFull() {
    return this.clients.length == 2
  }
}
