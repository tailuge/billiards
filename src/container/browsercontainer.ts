import { Container } from "./container"
import { Keyboard } from "../events/keyboard"
import { EventUtil } from "../events/eventutil"
import { BreakEvent } from "../events/breakevent"
import { SocketConnection } from "../network/client/socketconnection"
import { GameEvent } from "../events/gameevent"
import { bounceHan, bounceHanBlend } from "../model/physics/physics"
import JSONCrush from "jsoncrush"
import { Assets } from "../view/assets"

/**
 * Integrate game container into HTML page
 */
export class BrowserContainer {
  container: Container
  canvas3d
  tableId
  clientId
  wss
  ruletype
  playername: string
  replay: string | null
  sc: SocketConnection | null = null
  breakState = {
    init: null,
    shots: Array<string>(),
    now: 0,
    score: 0,
  }
  cushionModel
  assets: Assets
  now
  constructor(canvas3d, params) {
    this.now = Date.now()
    this.playername = params.get("name") ?? ""
    this.tableId = params.get("tableId") ?? "default"
    this.clientId = params.get("clientId") ?? "default"
    this.replay = params.get("state")
    this.ruletype = params.get("ruletype") ?? "nineball"
    this.wss = params.get("websocketserver")
    this.canvas3d = canvas3d
    this.cushionModel =
      params.get("cushionModel") === "bounceHan" ? bounceHan : bounceHanBlend
  }

  start() {
    this.assets = new Assets(this.ruletype)
    this.assets.loadFromWeb(() => {
      this.onAssetsReady()
    })
  }

  onAssetsReady() {
    console.log(`${this.playername} assets ready`)
    this.container = new Container(
      this.canvas3d,
      console.log,
      this.assets,
      this.ruletype,
      new Keyboard(this.canvas3d),
      this.playername
    )
    this.container.broadcast = (e) => {
      this.broadcast(e)
    }
    this.container.table.cushionModel = this.cushionModel
    this.setReplayLink()
    if (this.wss) {
      const params = `name=${this.playername}&tableId=${this.tableId}&clientId=${this.clientId}`
      this.container.isSinglePlayer = false
      this.sc = new SocketConnection(`${this.wss}?${params}`, this.clientId)
      this.networkButton()
      this.sc.eventHandler = (e) => {
        this.netEvent(e)
      }
    }

    if (this.replay) {
      this.startReplay(this.replay)
    } else if (!this.sc) {
      this.container.eventQueue.push(new BreakEvent())
    }

    // trigger animation loops
    this.container.animate(performance.now())
  }

  netEvent(e: string) {
    const event = EventUtil.fromSerialised(e)
    console.log(`${this.playername} received ${event.type}`)
    this.container.eventQueue.push(event)
  }

  networkButton() {
    document.getElementById("network")!.onclick = () => {
      this.sc?.close()
    }
  }

  broadcast(event: GameEvent) {
    this.sc?.send(event)
  }

  setReplayLink() {
    const url = window.location.href.split("?")[0]
    const prefix = `${url}?ruletype=${this.ruletype}&state=`
    this.container.recorder.replayUrl = prefix
  }

  startReplay(replay) {
    this.breakState = this.parse(decodeURIComponent(replay))
    console.log(this.breakState)
    if (Date.now() - this.breakState.now < 5000) {
      console.log("upload")
      this.offerUpload()
    }
    const breakEvent = new BreakEvent(
      this.breakState.init,
      this.breakState.shots
    )
    this.container.eventQueue.push(breakEvent)
    this.container.menu.replayMode(window.location.href, breakEvent)
  }

  parse(s) {
    try {
      return JSON.parse(s)
    } catch (_) {
      return JSON.parse(JSONCrush.uncrush(s))
    }
  }

  offerUpload() {
    this.container.chat.showMessage(
      `<a class="pill" target="_blank" href="https://tailuge-billiards.cyclic.app/hiscore.html${location.search}"> upload high score </a`
    )
  }
}
