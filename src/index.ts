import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { SocketConnection } from "./events/socketconnection"

var sc: SocketConnection | null
var container: Container
var state = {
  init: null,
  shots: Array<any>(),
}
var id

initialise()

function netEvent(e) {
  let event = EventUtil.fromSerialised(e)
  console.log(`${id} received ${event.type}`)
  container.eventQueue.push(event)
}

function initialise() {
  id = /id=([^& ?]*)/.exec(location.search)
  id = id ? id[1] : ""
  const websocketserver = /websocketserver=([^ &?]*)/.exec(location.search)
  sc = websocketserver ? new SocketConnection(websocketserver[1]) : null
  container = new Container(
    document.getElementById("viewP1"),
    (message) => {
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
    let event = EventUtil.fromSerialised(e)
    if (event.type === EventType.BREAK) {
      state.init = (<BreakEvent>event).init
    }
    if (event.type === EventType.HIT) {
      //      state.shots.push((<HitEvent>event).json)
      //      console.log("break of " + state.shots.length)
      //      let uri = encodeURI(`${window.location}?&state=${JSON.stringify(state)}`)
      //      console.log(uri)
    }
    //    console.log(`${id} sending ${event.type}`)
    sc?.send(e)
  }

  // trigger animation loops
  container.animate(performance.now())
}
