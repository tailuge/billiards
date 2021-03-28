import { Container } from "./controller/container"
import { Keyboard } from "./events/keyboard"
import { EventUtil } from "./events/eventutil"
import { EventType } from "./events/eventtype"
import { BreakEvent } from "./events/breakevent"
import { HitEvent } from "./events/hitevent"

var example =
  window.location +
  "/?&state=%7B%22init%22:%5B-11,6.004,7.003,0.006,7.892,0.515,7.906,-0.524,8.809,0.01,8.792,-1.045,8.807,1.035,9.696,0.523,9.696,-0.529,10.613,-0.004%5D,%22shots%22:%5B%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:-0.35,%22power%22:5,%22pos%22:%7B%22x%22:-11,%22y%22:6.004,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0,%22sideOffset%22:0,%22angle%22:2.035,%22power%22:1.701,%22pos%22:%7B%22x%22:4.309,%22y%22:-4.324,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.217,%22sideOffset%22:0,%22angle%22:4.342,%22power%22:2.399,%22pos%22:%7B%22x%22:-6.431,%22y%22:5.464,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.217,%22sideOffset%22:0,%22angle%22:3.569,%22power%22:1.65,%22pos%22:%7B%22x%22:-0.668,%22y%22:0.804,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0.3,%22sideOffset%22:0,%22angle%22:5.715,%22power%22:5,%22pos%22:%7B%22x%22:-7.004,%22y%22:0.079,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0.3,%22sideOffset%22:0,%22angle%22:6.071,%22power%22:5,%22pos%22:%7B%22x%22:-10.654,%22y%22:3.637,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0.033,%22sideOffset%22:0,%22angle%22:9.523,%22power%22:1.802,%22pos%22:%7B%22x%22:11.361,%22y%22:-2.843,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:-0.085,%22sideOffset%22:0,%22angle%22:6.959,%22power%22:2.851,%22pos%22:%7B%22x%22:0.04,%22y%22:-2.824,%22z%22:0%7D,%22type%22:3%7D,%7B%22verticalOffset%22:0.3,%22sideOffset%22:0,%22angle%22:5.192,%22power%22:5,%22pos%22:%7B%22x%22:6.532,%22y%22:6.297,%22z%22:0%7D,%22type%22:3%7D%5D%7D"

console.log(example)

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
