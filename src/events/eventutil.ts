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
import { decodeCoords, encodeCoords, wireConfig } from "../utils/wire-codec"

/**
 * Live AIM is an advisory preview, superseded within 250 ms and always by HIT,
 * so it carries reduced precision. HIT, WATCHAIM, replay shots and resume
 * snapshots keep full precision because they stringify their AimEvents
 * directly and never come through `serialise`.
 */
const AIM_ANGLE_DP = 4
const AIM_POWER_DP = 2
const AIM_POS_DP = 5

const roundTo = (v: number, places: number) =>
  Math.round(v * 10 ** places) / 10 ** places

export class EventUtil {
  static serialise(event: GameEvent) {
    if (event.type === EventType.AIM) {
      const json = { ...(event as AimEvent).toJSON() }
      // No handler reads the name on AIM: a spectator's names come from BEGIN
      // and WATCHAIM, so the chattiest message does not carry it.
      delete json.playername
      return JSON.stringify({
        ...json,
        angle: roundTo(json.angle, AIM_ANGLE_DP),
        power: roundTo(json.power, AIM_POWER_DP),
        pos: json.pos.map((v) => roundTo(v, AIM_POS_DP)),
      })
    }
    if (
      wireConfig.compactWatchBalls &&
      event.type === EventType.WATCHAIM &&
      Array.isArray((event as WatchEvent).json?.balls)
    ) {
      const json = (event as WatchEvent).json
      const coords = json.balls.flatMap((b) => [b.pos.x, b.pos.y])
      return JSON.stringify({
        ...event,
        json: { ...json, balls: encodeCoords(coords) },
      })
    }
    return JSON.stringify(event)
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
