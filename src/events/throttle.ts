import { EventType } from "./eventtype"
import { GameEvent } from "./gameevent"

/**
 * Throttle AIM events.
 */
export class Throttle {
  period: number
  pending: GameEvent | null = null
  sentTime: number = 0
  apply = (_) => {}

  constructor(period, apply) {
    this.period = period
    this.apply = apply
  }

  flush() {
    if (this.pending) {
      this.apply(this.pending)
      this.pending = null
    }
  }

  send(event: GameEvent) {
    if (
      performance.now() > this.sentTime + this.period ||
      event.type !== EventType.AIM
    ) {
      this.flush()
      this.apply(event)
      this.sentTime = performance.now()
      return
    }
    this.pending = event
  }
}
