import { Container } from "./container"
import { Keyboard } from "../events/keyboard"
import { EventUtil } from "../events/eventutil"
import { EventType } from "../events/eventtype"
import { BreakEvent } from "../events/breakevent"
import { SocketConnection } from "../network/client/socketconnection"
import { ChatEvent } from "../events/chatevent"
import { GameEvent } from "../events/gameevent"

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
  }

  constructor(ruletype, playername, tableId, clientId, replay, wss, canvas3d) {
    this.playername = playername
    this.tableId = tableId
    this.clientId = clientId
    this.replay = replay
    this.ruletype = ruletype
    this.wss = wss
    this.canvas3d = canvas3d
  }

  start() {
    const keyboard = new Keyboard(this.canvas3d)
    this.container = new Container(
      this.canvas3d,
      console.log,
      this.ruletype,
      keyboard,
      () => {
        this.onAssetsReady()
      },
      this.playername
    )
    this.container.broadcast = (e) => {
      this.recordingBroadcast(e)
    }
    if (this.wss) {
      const params = `name=${this.playername}&tableId=${this.tableId}&clientId=${this.clientId}`
      this.container.isSinglePlayer = false
      this.sc = new SocketConnection(`${this.wss}?${params}`)
      this.networkButton()
      this.sc.eventHandler = (e) => {
        this.netEvent(e)
      }
    }
  }

  onAssetsReady() {
    console.log(`${this.playername} ready`)

    if (this.replay) {
      this.container.table.cue.aimInputs.setButtonText("↻")
      this.breakState = JSON.parse(decodeURI(this.replay))
      this.container.table.cue.aimInputs.cueHitElement?.addEventListener(
        "click",
        () => {
          //location.reload()
          this.container.eventQueue.push(
            new BreakEvent(this.breakState.init, this.breakState.shots)
          )
        }
      )
      this.container.eventQueue.push(
        new BreakEvent(this.breakState.init, this.breakState.shots)
      )
    }

    if (!this.sc) {
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

  recordingBroadcast(event: GameEvent) {
    if (event.type === EventType.HIT) {
      this.shotReplayLink()
    }
    this.sc?.send(event)
  }

  shotReplayLink() {
    const url = window.location.href.split("?")[0]
    const prefix = `${url}?ruletype=${this.ruletype}&state=`
    const serialisedShot = JSON.stringify(
      this.container.recoder.replayLastShot()
    )
    const shotUri = encodeURI(`${prefix}${serialisedShot}`)
    const serialisedBreak = JSON.stringify(this.container.recoder.replayGame())
    const breakUri = encodeURI(`${prefix}${serialisedBreak}`)
    const breakLink = `<a class="pill" target="_blank" href="${breakUri}">break ⚆...</a>`
    const shotLink = `<a class="pill" target="_blank" href="${shotUri}">shot ⚆</a>`
    this.container.eventQueue.push(
      new ChatEvent("share", `${shotLink} ${breakLink}`)
    )
  }
}
