import { Container } from "../container/container"
import { Keyboard } from "../events/keyboard"
import { BreakEvent } from "../events/breakevent"
import { CameraTop } from "../view/cameratop"

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
    CameraTop.zoomFactor = 0.88
  }

  start() {
    const keyboard = new Keyboard(this.canvas3d)
    this.container = new Container(
      this.canvas3d,
      console.log,
      false,
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
    this.replayButton(replaybutton)
    this.container.eventQueue.push(
      new BreakEvent(this.breakState.init, this.breakState.shots)
    )
    this.container.animate(performance.now())
  }

  replayButton(replaybutton) {
    replaybutton.innerHTML = "↻"
    replaybutton.addEventListener("click", () => {
      if (this.container.eventQueue.length == 0) {
        this.container.eventQueue.push(
          new BreakEvent(this.breakState.init, this.breakState.shots)
        )
      }
    })
  }

  static fromDiamgramElement(diagram): DiagramContainer {
    const containerDiv = diagram?.getElementsByClassName("topview")[0]
    const stateUrl = containerDiv?.getAttribute("data-state")
    const params = new URLSearchParams(stateUrl)
    const p = diagram?.getElementsByClassName("description")[0]
    const editlink = document.createElement("a")
    editlink.href = `../${stateUrl}`
    editlink.innerHTML = "⬀"
    editlink.target = "_blank"
    p?.appendChild(editlink)
    const replaybutton = document.createElement("button")
    p?.appendChild(replaybutton)
    const diagramcontainer = new DiagramContainer(
      containerDiv,
      params.get("ruletype"),
      params.get("state")
    )
    diagramcontainer.replayButton(replaybutton)
    return diagramcontainer
  }
}
