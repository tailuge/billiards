import { Controller } from "../controller/controller"

export class Recorder {
  controller: Controller
  all: Event[] = []

  constructor(controller: Controller) {
    this.controller = controller
  }

  // some way to remove consectutive aim,placeball events
  record(event) {
    this.all.push(event)
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
