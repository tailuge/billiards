import { RejoinEvent } from "../../events/rejoinevent"
import { Client, TableInfo } from "./tableinfo"
import { ServerLog } from "./serverlog"
import { GameEvent } from "../../events/gameevent"
import { EventHistory } from "../../events/eventhistory"

export class Rejoin {
  client: Client
  tableInfo: TableInfo
  clientLastSent
  clientLastRecv
  history: EventHistory

  constructor(
    client: Client,
    tableInfo: TableInfo,
    clientLastSent,
    clientLastRecv
  ) {
    this.client = client
    this.tableInfo = tableInfo
    this.clientLastSent = clientLastSent
    this.clientLastRecv = clientLastRecv
    this.history = this.tableInfo.history(this.client)
  }

  delta(): RejoinEvent {
    const rejoin: RejoinEvent = new RejoinEvent()
    const lastSent = this.history.lastSent()
    const lastRecv = this.history.lastRecv()
    ServerLog.log(`Calculate rejoin actions for ${this.client.name} 
      with clientLastSent=${this.clientLastSent}
       lastRecvFromClient=${lastRecv?.sequence}
           clientLastRecv=${this.clientLastRecv}
         lastSentToClient=${lastSent?.sequence}`)
    if (lastSent) {
      if (!this.clientLastRecv) {
        // resend everything
        rejoin.serverResendFrom = this.history.sent[0].sequence
      } else if (lastSent.sequence !== this.clientLastRecv) {
        rejoin.serverResendFrom = this.history.nextId(
          this.history.sent,
          this.clientLastRecv
        )
      }
    }
    if (this.clientLastSent !== "") {
      if (!lastRecv) {
        // request all messages
        rejoin.clientResendFrom = "*"
      } else if (lastRecv.sequence !== this.clientLastSent) {
        rejoin.clientResendFrom = lastRecv.sequence
      }
    }
    return rejoin
  }

  replayEvents(rejoinEvent): GameEvent[] {
    if (rejoinEvent.serverResendFrom) {
      const toReplay = this.history.from(
        this.history.sent,
        rejoinEvent.serverResendFrom
      )
      return toReplay
    }
    return []
  }
}
