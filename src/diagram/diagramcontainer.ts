import { Container } from "../container/container"
import { Keyboard } from "../events/keyboard"
import { BreakEvent } from "../events/breakevent"

/**
 * Integrate container into diagram
 */
export class DiagramContainer {
  container: Container
  canvas3d
  ruletype
  replay: string
  breakState = {
    init: null,
    shots: Array<string>(),
  }

  constructor(canvas3d, ruletype, replay) {
    this.replay = replay
    this.ruletype = ruletype
    this.canvas3d = canvas3d
  }

  start() {
    const keyboard = new Keyboard(this.canvas3d)
    this.container = new Container(
      this.canvas3d,
      console.log,
      this.ruletype,
      keyboard,
      this.onAssetsReady,
      "diagram"
    )
  }

  onAssetsReady = () => {
    console.log(`diagram ready`)
    this.breakState = JSON.parse(decodeURI(this.replay))
    const replaybutton = document.getElementById("replay")! as HTMLButtonElement
    replaybutton.innerHTML = "↻"
    replaybutton.addEventListener("click", () => {
      if (this.container.eventQueue.length == 0) {
        this.container.eventQueue.push(
          new BreakEvent(this.breakState.init, this.breakState.shots)
        )
      }
    })
    this.container.eventQueue.push(
      new BreakEvent(this.breakState.init, this.breakState.shots)
    )
    // trigger animation loops
    this.container.animate(performance.now())
  }
}
