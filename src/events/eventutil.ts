import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"
import { AimEvent } from "./aimevent"
import { WatchEvent } from "./watchevent"
import { HitEvent } from "./hitevent"
import { AbortEvent } from "./abortevent"
import { BreakEvent } from "./breakevent"
import { BeginEvent } from "./beginevent"
import { ChatEvent } from "./chatevent"
import { RejoinEvent } from "./rejoinevent"
import { PlaceBallEvent } from "./placeballevent"
import { RerackEvent } from "./rerackevent"
import { StartAimEvent } from "./startaimevent"

export class EventUtil {
  static serialise(event: GameEvent) {
    return JSON.stringify(event)
  }

  private static fromJson(parsed) {
    switch (parsed.type) {
      case EventType.BEGIN:
        return new BeginEvent()
      case EventType.AIM:
        return AimEvent.fromJson(parsed)
      case EventType.BREAK:
        return BreakEvent.fromJson(parsed)
      case EventType.WATCHAIM:
        return WatchEvent.fromJson(parsed.json)
      case EventType.HIT:
        return HitEvent.fromJson(parsed)
      case EventType.CHAT:
        return ChatEvent.fromJson(parsed)
      case EventType.REJOIN:
        return RejoinEvent.fromJson(parsed)
      case EventType.ABORT:
        return new AbortEvent()
      case EventType.PLACEBALL:
        return PlaceBallEvent.fromJson(parsed)
      case EventType.RERACK:
        return RerackEvent.fromJson(parsed)
      case EventType.STARTAIM:
        return StartAimEvent.fromJson(parsed)
      default:
        throw Error("Unknown GameEvent :" + parsed)
    }
  }

  static fromSerialised(data: string) {
    const parsed = JSON.parse(data)
    const event = EventUtil.fromJson(parsed)
    if ("sequence" in parsed) {
      event.sequence = parsed.sequence
    }
    return event
  }
}
