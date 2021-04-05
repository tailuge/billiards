import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"

console.log(window.location + "/?&state=")

var controller1
var state = {
  init: null,
  shots: Array<any>(),
}
var keyboard = new Keyboard()
var lastTime = performance.now()

playReplay(/state=(.*)/.exec(location.search))

function playReplay(args) {
  controller1 = new Container(document.getElementById("viewP1"), (_) => {})

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
    }
  }

  // trigger input polling
  sampleInputs()

  // trigger animation loops
  controller1.animate(performance.now())
}

function sampleInputs() {
  var t = performance.now() - lastTime
  lastTime = performance.now()
  var inputs = keyboard.getEvents(t)
  inputs.forEach((i) => controller1.inputQueue.push(i))
  requestAnimationFrame((_) => {
    sampleInputs()
  })
}
