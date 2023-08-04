import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"
import { SocketConnection } from "./events/socketconnection"
import { ChatEvent } from "./events/chatevent"

let sc: SocketConnection | null
let container: Container
let state = {
  init: null,
  shots: Array<string>(),
}
let id: string

initialise()

function netEvent(e: string) {
  const event = EventUtil.fromSerialised(e)
  console.log(`${id} received ${event.type}`)
  container.eventQueue.push(event)
}

function initialise() {
  const result = /id=([^& ?]*)/.exec(location.search)
  id = result ? result[1] : ""
  const websocketserver = /websocketserver=([^ &?]*)/.exec(location.search)
  sc = websocketserver ? new SocketConnection(websocketserver[1]) : null
  container = new Container(
    document.getElementById("viewP1"),
    (message: string) => {
      console.log(`${id} ${message}`)
    },
    new Keyboard(document.getElementById("viewP1")),
    onAssetsReady
  )
  if (sc) {
    sc.eventHandler = netEvent
  }
}

/**
 * If websocket server present wait for message to start otherwise start 1 player game (play or replay)
 */
function onAssetsReady() {
  console.log(`${id} ready`)
  const replay = /state=(.*)/.exec(location.search)

  if (replay !== null) {
    container.isSinglePlayer = true
    state = JSON.parse(decodeURI(replay[1]))
    container.eventQueue.push(new BreakEvent(state.init, state.shots))
  } else {
    if (!sc) {
      container.isSinglePlayer = true
      container.eventQueue.push(new BreakEvent())
    }
  }

  container.broadcast = (e: string) => {
    const event = EventUtil.fromSerialised(e)
    if (event.type === EventType.BREAK) {
      state.init = (<BreakEvent>event).init
    }
    if (event.type === EventType.HIT) {
      recordBreak((<HitEvent>event).tablejson.aim)
    }
    sc?.send(e)
  }

  // trigger animation loops
  container.animate(performance.now())
}

function recordBreak(e: string) {
  state.shots.push(e)
  const uri = encodeURI(`${window.location}?state=${JSON.stringify(state)}`)
  container.eventQueue.push(
    new ChatEvent(
      id,
      `<a class="pill" target="_blank" href="${uri}">break of ${state.shots.length}</a>`
    )
  )
}
