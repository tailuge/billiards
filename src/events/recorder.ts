import { Container } from "../controller/container"
import { EventType } from "./eventtype"
import { HitEvent } from "./hitevent"

export class Recorder {
  container: Container
  shots: string[] = []
  states: number[][] = []
  constructor(container: Container) {
    this.container = container
  }

  record(event) {
    if (event.type === EventType.HIT) {
      this.states.push(this.container.table.shortSerialise())
      this.shots.push((<HitEvent>event).tablejson.aim)
    }
  }

  replayGame() {
    return this.state(this.states[0], this.shots)
  }

  replayLastShot() {
    const last = this.states.length - 1
    return this.state(this.states[last], [this.shots[last]])
  }

  private state(init, events) {
    return {
      init: init,
      shots: events,
    }
  }
}
