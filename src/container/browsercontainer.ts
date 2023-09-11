import { Container } from "./container"
import { Keyboard } from "../events/keyboard"
import { EventUtil } from "../events/eventutil"
import { EventType } from "../events/eventtype"
import { BreakEvent } from "../events/breakevent"
import { SocketConnection } from "../events/socketconnection"
import { ChatEvent } from "../events/chatevent"

/**
 * Integrate game container into HTML page
 */
export class BrowserContainer {
  container: Container
  canvas3d
  tablename
  wss
  ruletype
  playername: string
  replay: string | null
  sc: SocketConnection | null = null
  breakState = {
    init: null,
    shots: Array<string>(),
  }

  constructor(ruletype, playername, tablename, replay, wss, canvas3d) {
    this.playername = playername
    this.tablename = tablename
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
      this.sc = new SocketConnection(
        `${this.wss}?name=${this.playername}&table=${this.tablename}`
      )
      this.sc.eventHandler = (e) => {
        this.netEvent(e)
      }
      this.container.isSinglePlayer = false
    }
  }

  onAssetsReady() {
    console.log(`${this.playername} ready`)

    if (this.replay) {
      this.container.table.cue.aimInputs.setButtonText("↻")
      this.container.table.cue.aimInputs.cueHitElement?.addEventListener(
        "click",
        () => {
          location.reload()
        }
      )
      this.breakState = JSON.parse(decodeURI(this.replay))
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

  recordingBroadcast(e: string) {
    const event = EventUtil.fromSerialised(e)
    if (event.type === EventType.HIT) {
      this.shotReplayLink()
    }
    this.sc?.send(e)
  }

  shotReplayLink() {
    const url = window.location.href.split("?")[0]
    const prefix = `${url}?state=`
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
