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

  from(list: GameEvent[], sequenceId) {
    const index = list.findIndex((e) => e.sequence === sequenceId)
    return list.slice(index)
  }

  nextId(list: GameEvent[], sequenceId) {
    const index = list.findIndex((e) => e.sequence === sequenceId)
    if (index < list.length - 1) {
      return list[index + 1].sequence
    }
    return ""
  }
}
