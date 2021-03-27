import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"

var controller1 = new Container(document.getElementById("viewP1"), (_) => {})

console.log(controller1.table.shortSerialise())

let args = /init=([^&]*)&shots=([^&]*)/.exec(location.search)
if (args !== null) {
  let init = JSON.parse(args[1])
  let shots = JSON.parse(args[2])
  console.log("Replay mode", args[1], args[2])
  controller1.eventQueue.push(new BreakEvent(init, shots))
} else {
  controller1.eventQueue.push(new BreakEvent())
}

controller1.broadcast = (e: string) => {
  let event = EventUtil.fromSerialised(e)
  if (event.type === EventType.BREAK) {
    console.log(JSON.stringify(event), null, 2)
    let uri = encodeURI(
      window.location + "?init=[" + (<BreakEvent>event).init + "]"
    )
    console.log(uri)
    console.log(uri.length)
  }
}

var keyboard = new Keyboard()

var lastTime = performance.now()

function sampleInputs() {
  var t = performance.now() - lastTime
  lastTime = performance.now()
  var inputs = keyboard.getEvents(t)
  inputs.forEach((i) => controller1.inputQueue.push(i))
  requestAnimationFrame((_) => {
    sampleInputs()
  })
}

// trigger input polling
sampleInputs()

// trigger animation loops
controller1.animate(performance.now())
