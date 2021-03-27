import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"

var controller1 = new Container(document.getElementById("viewP1"), (_) => {})

var example =
  window.location +
  "/?&state=%7B%22init%22:%5B-11,0.334100000327453,7.008,0.002,7.908,0.511,7.896,-0.527,8.802,0.002,8.792,-1.031,8.798,1.046,9.698,0.517,9.711,-0.526,10.595,-0.008%5D,%22shots%22:%5B%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:-0.05,%22power%22:3.752,%22pos%22:%7B%22x%22:-11,%22y%22:0.334,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:-1.462,%22power%22:1.404,%22pos%22:%7B%22x%22:9.745,%22y%22:5.67,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:-3.596,%22power%22:4.752,%22pos%22:%7B%22x%22:9.77,%22y%22:-1.257,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:-4.291,%22power%22:3.751,%22pos%22:%7B%22x%22:8.55,%22y%22:-0.434,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0.3,%22sideOffset%22:0,%22angle%22:-3.792,%22power%22:1.65,%22pos%22:%7B%22x%22:3.152,%22y%22:-0.277,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.3,%22sideOffset%22:0,%22angle%22:-2.375,%22power%22:1.8,%22pos%22:%7B%22x%22:-2.912,%22y%22:5.691,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.3,%22sideOffset%22:0,%22angle%22:-1.714,%22power%22:2.75,%22pos%22:%7B%22x%22:-9.509,%22y%22:4.18,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.3,%22sideOffset%22:0,%22angle%22:-0.21,%22power%22:5,%22pos%22:%7B%22x%22:7.168,%22y%22:-0.256,%22z%22:0%7D,%22type%22:3%7D%5D%7D"

console.log(example)
console.log(example.length)

var state = {
  init: null,
  shots: Array<any>(),
}

let args = /state=(.*)/.exec(location.search)
if (args !== null) {
  state = JSON.parse(decodeURI(args[1]))
  console.log(state)
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
    console.log(state)
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
