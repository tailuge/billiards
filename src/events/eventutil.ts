import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"
import { AimEvent } from "./aimevent"
import { WatchEvent } from "./watchevent"
import { HitEvent } from "./hitevent"
import { AbortEvent } from "./abortevent"
import { BreakEvent } from "./breakevent"
import { BeginEvent } from "./beginevent"
import { ChatEvent } from "./chatevent"
import { PlaceBallEvent } from "./placeballevent"

export class EventUtil {
  static serialise(event: GameEvent) {
    return JSON.stringify(event)
  }

  static fromSerialised(data: string) {
    const parsed = JSON.parse(data)
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
      case EventType.ABORT:
        return new AbortEvent()
      case EventType.PLACEBALL:
        return PlaceBallEvent.fromJson(parsed)
      default:
        throw Error("Unknown GameEvent :" + data)
    }
  }
}
