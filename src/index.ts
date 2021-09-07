import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"

var controller1
var state = {
  init: null,
  shots: Array<any>(),
}
var ws

playReplay()

function playReplay() {
  controller1 = new Container(
    document.getElementById("viewP1"),
    (_) => {},
    new Keyboard(document.getElementById("viewP1")),
    onAssetsReady
  )
}

function onAssetsReady() {
  const wss = /websocketserver=([^ &?]*)/.exec(location.search)
  if (wss !== null) {
    console.log(`Websocket server is ${wss[1]}`)
    ws = new WebSocket(wss[1])
    ws.onclose = function () {
      console.log("connection closed")
    }
    ws.onerror = function (e) {
      console.log("error", e)
    }
    ws.onmessage = function (e) {
      console.log("received:", e)
    }
    ws.onopen = function () {
      console.log("connected ok")
    }
  }
  const args = /state=(.*)/.exec(location.search)

  if (args !== null) {
    state = JSON.parse(decodeURI(args[1]))
    controller1.eventQueue.push(new BreakEvent(state.init, state.shots))
  } else {
    controller1.eventQueue.push(new BreakEvent())
  }

  controller1.broadcast = (e: string) => {
    let event = EventUtil.fromSerialised(e)
    if (event.type === EventType.BREAK) {
      state.init = (<BreakEvent>event).init
    }
    if (event.type === EventType.HIT) {
      state.shots.push((<HitEvent>event).json)
      console.log("break of " + state.shots.length)
      let uri = encodeURI(`${window.location}?&state=${JSON.stringify(state)}`)
      console.log(uri)

      if (ws) {
        ws.send(e)
      }
    }
  }

  // trigger animation loops
  controller1.animate(performance.now())
}
