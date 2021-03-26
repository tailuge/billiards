import { Container } from "./controller/container"
import { BeginEvent } from "./events/beginevent"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"

var controller1 = new Container(document.getElementById("viewP1"), (_) => {})

let a = /init=([^&]*)&shots=([^&]*)/.exec(location.search)
if (a !== null) {
  console.log("Replaymode")
  console.log(a[1])
  console.log(a[2])
}

controller1.broadcast = (e: string) => {
  let event = EventUtil.fromSerialised(e)
  if (event.type == EventType.HIT) {
    console.log(event)
  }
}

controller1.eventQueue.push(new BeginEvent())

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
