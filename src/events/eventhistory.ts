import { GameEvent } from "./gameevent"

export class EventHistory {
  sent: GameEvent[] = []
  recv: GameEvent[] = []

  private last(list: GameEvent[]): GameEvent {
    return list[list.length - 1]
  }

  lastSent() {
    return this.last(this.sent)
  }

  lastRecv() {
    return this.last(this.recv)
  }

  after(list: GameEvent[], sequenceId) {
    const index = list.findIndex((e) => e.sequence === sequenceId) + 1
    return list.slice(index)
  }

  nextId(list: GameEvent[], sequenceId) {
    const after = this.after(list, sequenceId)
    if (after.length > 0) {
      return after[0].sequence
    }
    return ""
  }
}
