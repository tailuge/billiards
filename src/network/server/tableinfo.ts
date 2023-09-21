import { EventHistory } from "../../events/eventhistory"

export type Client = { ws; name: string; clientId: string }

export class TableInfo {
  readonly tableId: string
  readonly owningClientIds: string[] = []
  clients: Client[] = []

  eventHistory: Map<string, EventHistory> = new Map()

  constructor(tableId) {
    this.tableId = tableId
  }

  history(client): EventHistory {
    if (!this.eventHistory.has(client.clientId)) {
      this.eventHistory.set(client.clientId, new EventHistory())
    }
    return this.eventHistory.get(client.clientId)!
  }

  hasNoHistory(client) {
    return this.history(client).sent.length == 0 && !this.history(client).recv
  }

  recordSentEvent(client, event) {
    const clientHistory = this.history(client)
    clientHistory.sent.push(event)
  }

  recordRecvEvent(client, event) {
    const clientHistory = this.history(client)
    clientHistory.recv = event
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
