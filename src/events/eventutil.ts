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
import { NotificationEvent } from "./notificationevent"
import { ScoreEvent } from "./scoreevent"
import { StationaryEvent } from "./stationaryevent"
import { ConcedeEvent } from "./concedeevent"
import {
  decodeCoords,
  encodeCoords,
  removeZeroVectorEntries,
  reinstateZeroVectorEntries,
  wireConfig,
} from "../utils/wire-codec"

export class EventUtil {
  static serialise(event: GameEvent) {
    let result: string
    if (
      wireConfig.compactWatchBalls &&
      event.type === EventType.WATCHAIM &&
      Array.isArray((event as WatchEvent).json?.balls)
    ) {
      const json = (event as WatchEvent).json
      const coords = json.balls.flatMap((b) => [b.pos.x, b.pos.y])
      result = JSON.stringify({
        ...event,
        json: { ...json, balls: encodeCoords(coords) },
      })
    } else {
      result = JSON.stringify(event)
    }
    return removeZeroVectorEntries(result)
  }

  /** Expands a packed `balls` string back to `Array<{pos: {x, y}, id}>`. */
  private static unpackWatchBalls(json) {
    if (typeof json?.balls !== "string") {
      return json
    }
    const coords = decodeCoords(json.balls)
    const balls: { pos: { x: number; y: number }; id: number }[] = []
    for (let i = 0; i < coords.length; i += 2) {
      balls.push({ pos: { x: coords[i], y: coords[i + 1] }, id: i / 2 })
    }
    return { ...json, balls }
  }

  private static fromJson(parsed) {
    switch (parsed.type) {
      case EventType.BEGIN:
        return new BeginEvent()
      case EventType.STATIONARY:
        return new StationaryEvent()
      case EventType.AIM:
        return AimEvent.fromJson(parsed)
      case EventType.BREAK:
        return BreakEvent.fromJson(parsed)
      case EventType.WATCHAIM:
        return WatchEvent.fromJson(EventUtil.unpackWatchBalls(parsed.json))
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
        return StartAimEvent.fromJson()
      case EventType.NOTIFICATION:
        return NotificationEvent.fromJson(parsed)
      case EventType.SCORE:
        return ScoreEvent.fromJson(parsed)
      case EventType.CONCEDE:
        return new ConcedeEvent()
      default:
        throw new Error(`Unknown GameEvent: ${EventUtil.safeStringify(parsed)}`)
    }
  }

  static fromSerialised(data: string) {
    const parsed = JSON.parse(data)
    reinstateZeroVectorEntries(parsed)
    const event = EventUtil.fromJson(parsed)
    if ("sequence" in parsed) {
      event.sequence = parsed.sequence
    }
    if ("clientId" in parsed) {
      event.clientId = parsed.clientId
    }
    if ("playername" in parsed) {
      event.playername = parsed.playername
    }
    return event
  }

  private static safeStringify(value: unknown): string {
    try {
      if (typeof value === "string") return value
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
}
