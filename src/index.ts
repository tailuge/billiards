import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"
import { SocketConnection } from "./events/socketconnection"
import { ChatEvent } from "./events/chatevent"

let id: string
let replay: string | null
let sc: SocketConnection | null = null
let container: Container
let breakState = {
  init: null,
  shots: Array<string>(),
}

initialise()

function parseParams(url) {
  const id = /id=([^& ?]*)/.exec(url)
  const wss = /websocketserver=([^ &?]*)/.exec(url)
  const replay = /state=(.*)/.exec(location.search)
  return {
    id: id ? id[1] : "",
    wss: wss ? wss[1] : null,
    replay: replay ? replay[1] : null,
  }
}

function initialise() {
  const params = parseParams(location.search)
  id = params.id
  replay = params.replay

  const canvas3d = document.getElementById("viewP1") as HTMLCanvasElement
  const keyboard = new Keyboard(canvas3d)
  container = new Container(canvas3d, console.log, keyboard, onAssetsReady)
  container.broadcast = recordingBroadcast
  if (params.wss) {
    sc = new SocketConnection(`${params.wss}?name=${id}`)
    sc.eventHandler = netEvent
    container.isSinglePlayer = false
  }
}

function onAssetsReady() {
  console.log(`${id} ready`)

  if (replay) {
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
  console.log(`${id} received ${event.type}`)
  container.eventQueue.push(event)
}

function recordingBroadcast(e: string) {
  const event = EventUtil.fromSerialised(e)
  if (event.type === EventType.BREAK) {
    breakState.init = (<BreakEvent>event).init
  }
  if (event.type === EventType.HIT) {
    recordShot((<HitEvent>event).tablejson.aim)
  }
  sc?.send(e)
}

function recordShot(e: string) {
  breakState.shots.push(e)
  const serialisedBreak = JSON.stringify(breakState)
  const uri = encodeURI(`${window.location}?state=${serialisedBreak}`)
  const link = `<a class="pill" target="_blank" href="${uri}">break of ${breakState.shots.length}</a>`
  container.eventQueue.push(new ChatEvent(id, link))
}
