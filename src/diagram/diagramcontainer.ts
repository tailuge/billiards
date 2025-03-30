import { Container } from "../container/container"
import { Keyboard } from "../events/keyboard"
import { BreakEvent } from "../events/breakevent"
import { CameraTop } from "../view/cameratop"
import { bounceHan } from "../model/physics/physics"
import { Assets } from "../view/assets"
import { RealOverlay } from "./real/realoverlay"

/**
 * Integrate billiards container into diagram html page
 */
export class DiagramContainer {
  container: Container
  canvas3d
  ruletype
  replay: string
  cushionModel
  breakState = {
    init: null,
    shots: Array<string>(),
  }

  realOverlay

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
      Assets.localAssets(this.ruletype),
      this.ruletype,
      keyboard,
      "diagram"
    )
    if (this.cushionModel) {
      this.container.table.cushionModel = this.cushionModel
    }
    this.onAssetsReady()
  }

  onAssetsReady = () => {
    console.log(`diagram ready`)
    const replaybutton = document.getElementById("replay")! as HTMLButtonElement
    this.replayButton(replaybutton)
    const overlayCanvas = document.getElementById(
      "overlaycanvas"
    ) as HTMLCanvasElement
    if (overlayCanvas) {
      this.realOverlay = new RealOverlay(overlayCanvas, this.container)
    } else {
      this.breakState = JSON.parse(decodeURIComponent(this.replay))
      this.container.eventQueue.push(
        new BreakEvent(this.breakState.init, this.breakState.shots)
      )
    }
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
      this.realOverlay?.start()
    })
  }

  static fromDiamgramElement(diagram): DiagramContainer {
    const containerDiv = diagram?.getElementsByClassName("topview")[0]
    const stateUrl = containerDiv?.getAttribute("data-state")
    const params = new URLSearchParams(stateUrl)
    const p = diagram?.getElementsByClassName("description")[0]
    const common = document.getElementById("common")
    const editlink = document.createElement("a")
    editlink.href = `../${stateUrl}`
    editlink.innerHTML = "⬀"
    editlink.target = "_blank"
    p?.appendChild(editlink)
    common?.appendChild(editlink)
    const replaybutton = document.createElement("button")
    p?.appendChild(replaybutton)
    const diagramcontainer = new DiagramContainer(
      containerDiv,
      params.get("ruletype"),
      params.get("state")
    )
    diagramcontainer.replayButton(replaybutton)
    if (params.get("cushionModel") == "bounceHan") {
      diagramcontainer.cushionModel = bounceHan
    }
    return diagramcontainer
  }
}
