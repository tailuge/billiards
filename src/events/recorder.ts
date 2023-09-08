import { Container } from "../controller/container"

export class Recorder {
  container: Container
  events: Event[] = []
  states = []
  constructor(container: Container) {
    this.container = container
  }

  record(event) {
    this.events.push(event)
  }

  replayGame() {
    // generate replay data (for game/break/shot)
    // will only be initial state + aim/placeball events
    const replayState = {
      init: null,
      events: Array<Event>(),
    }
    return replayState
  }
}
