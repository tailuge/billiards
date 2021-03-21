import { Container } from "./controller/container"
import { BeginEvent } from "./events/beginevent"
import { Keyboard } from "./events/keyboard"

function component() {
  const element = document.createElement("div")
var e = document.getElementById("viewP1")
  element.innerHTML = "Hi Hello world" + e

  return element
}

document.body.appendChild(component())

var controller1 = new Container(document.getElementById("viewP1"), (_) => {})

controller1.broadcast = (_) => {}
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
