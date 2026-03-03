import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"

/**
 * Throttle AIM events.
 */
export class Throttle {
  period: number
  sentTime: number = 0
  apply = (_) => {}

  constructor(period, apply) {
    this.period = period
    this.apply = apply
  }

  send(event: GameEvent) {
    if (event.type !== EventType.AIM) {
      this.apply(event)
      return
    }

    if (performance.now() > this.sentTime + this.period) {
      this.apply(event)
      this.sentTime = performance.now()
    }
  }
}
