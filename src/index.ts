import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"
import { SocketConnection } from "./events/socketconnection"

var sc: SocketConnection | null
var container: Container
var state = {
  init: null,
  shots: Array<any>(),
}

initialise()

function netEvent(e) {
  let event = EventUtil.fromSerialised(e)
  container.eventQueue.push(event)
}

function initialise() {
  const websocketserver = /websocketserver=([^ &?]*)/.exec(location.search)
  sc = websocketserver ? new SocketConnection(websocketserver[1]) : null
  container = new Container(
    document.getElementById("viewP1"),
    (_) => {},
    new Keyboard(document.getElementById("viewP1")),
    onAssetsReady
  )
  if (sc) {
    sc.eventHandler = netEvent
  }
}

function onAssetsReady() {
  const args = /state=(.*)/.exec(location.search)

  if (args !== null) {
    state = JSON.parse(decodeURI(args[1]))
    container.eventQueue.push(new BreakEvent(state.init, state.shots))
  } else {
    container.eventQueue.push(new BreakEvent())
  }

  container.broadcast = (e: string) => {
    let event = EventUtil.fromSerialised(e)
    if (event.type === EventType.BREAK) {
      state.init = (<BreakEvent>event).init
    }
    if (event.type === EventType.HIT) {
      state.shots.push((<HitEvent>event).json)
      console.log("break of " + state.shots.length)
      let uri = encodeURI(`${window.location}?&state=${JSON.stringify(state)}`)
      console.log(uri)

      sc?.send(e)
    }
  }

  // trigger animation loops
  container.animate(performance.now())
}
