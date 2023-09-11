import { Container } from "./container/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { SocketConnection } from "./events/socketconnection"
import { ChatEvent } from "./events/chatevent"

let name: string
let replay: string | null
let sc: SocketConnection | null = null
let container: Container
let breakState = {
  init: null,
  shots: Array<string>(),
}

initialise()

function initialise() {
  const params = new URLSearchParams(location.search)
  const wss = params.get("websocketserver")
  const table = params.get("table") ?? "default"
  name = params.get("name") ?? ""
  replay = params.get("state")
  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  const keyboard = new Keyboard(canvas3d)
  container = new Container(
    canvas3d,
    console.log,
    keyboard,
    onAssetsReady,
    name
  )
  container.broadcast = recordingBroadcast
  if (wss) {
    sc = new SocketConnection(`${wss}?name=${name}&table=${table}`)
    sc.eventHandler = netEvent
    container.isSinglePlayer = false
  }
}

function onAssetsReady() {
  console.log(`${name} ready`)

  if (replay) {
    container.table.cue.aimInputs.setButtonText("↻")
    container.table.cue.aimInputs.cueHitElement?.addEventListener(
      "click",
      () => {
        location.reload()
      }
    )
    breakState = JSON.parse(decodeURI(replay))
    container.eventQueue.push(new BreakEvent(breakState.init, breakState.shots))
  }

  if (!sc) {
    container.eventQueue.push(new BreakEvent())
  }

  // trigger animation loops
  container.animate(performance.now())
}

function netEvent(e: string) {
  const event = EventUtil.fromSerialised(e)
  console.log(`${name} received ${event.type}`)
  container.eventQueue.push(event)
}

function recordingBroadcast(e: string) {
  const event = EventUtil.fromSerialised(e)
  if (event.type === EventType.HIT) {
    recordShot()
  }
  sc?.send(e)
}

function recordShot() {
  const prefix = `${window.location}?state=`
  const serialisedShot = JSON.stringify(container.recoder.replayLastShot())
  const shotUri = encodeURI(`${prefix}${serialisedShot}`)
  const serialisedBreak = JSON.stringify(container.recoder.replayGame())
  const breakUri = encodeURI(`${prefix}${serialisedBreak}`)
  const breakLink = `<a class="pill" target="_blank" href="${breakUri}">break ⚆...</a>`
  const shotLink = `<a class="pill" target="_blank" href="${shotUri}">shot ⚆</a>`
  container.eventQueue.push(new ChatEvent("share", `${shotLink} ${breakLink}`))
}
