import { GameEvent } from "../events/gameevent"
import { EventType } from "../events/eventtype"

export function logNetEvent(
  playername: string,
  event: GameEvent,
  verb: string
) {
  if (event.type === EventType.AIM) {
    return
  }
  console.log(`${playername} ${verb} ${event.type} : ${event.clientId}`)
}
