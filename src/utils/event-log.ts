import { GameEvent } from "../events/gameevent"
import { EventType } from "../events/eventtype"
import { NetworkLogger } from "./network-logger"
import { Session } from "../network/client/session"

export function logNetEvent(
  playername: string,
  event: GameEvent,
  verb: string
) {
  // Only record events for live multiplayer games; skip bot and
  // spectator sessions. (Replay never reaches this path because it has
  // no message relay; practice/exam are orthogonal to networking and
  // intentionally allowed through so snooker multiplayer still logs.)
  const session = Session.getInstance()
  if (session.botMode || session.spectator) {
    return
  }
  if (event.type === EventType.AIM) {
    return
  }
  NetworkLogger.logGame(
    `net: ${playername} ${verb} ${event.type} : ${event.clientId}`
  )
}
