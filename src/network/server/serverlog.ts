import { EventType } from "../../events/eventtype"
import { GameEvent } from "../../events/gameevent"

export class ServerLog {
  static record = ""
  static enable = false
  static log(text: string) {
    ServerLog.enable && console.log(text)
    const formatted = `${new Date().toISOString()} ${text}`
    ServerLog.record += `${formatted}\n`
  }

  static logEvent(message, event: GameEvent) {
    if (event.type === EventType.AIM) {
      return
    }
    if (event.type === EventType.CHAT || event.type === EventType.REJOIN) {
      ServerLog.log(`${message} ${JSON.stringify(event)}`)
      return
    }
    ServerLog.log(`${message} ${event.type}`)
  }
}
