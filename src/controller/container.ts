import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { StationaryEvent } from "../events/stationaryevent"
import { Controller } from "./controller"
import { Table } from "../model/table"
import { View } from "../view/view"
import { Init } from "./init"
import { Rack } from "../utils/rack"
import { EventUtil } from "../events/eventutil"
import { AimInputs } from "../view/aiminputs"
import { Keyboard } from "../events/keyboard"
import { Sound } from "../view/sound"
import { controllerName } from "./util"
import { Chat } from "../view/chat"
import { ChatEvent } from "../events/chatevent"

/**
 * Model, View, Controller container.
 */
export class Container {
  table: Table
  view: View
  controller: Controller
  inputQueue: Input[] = []
  eventQueue: GameEvent[] = []
  aimInputs: AimInputs
  keyboard: Keyboard
  sound: Sound
  chat: Chat
  isSinglePlayer: boolean

  last = performance.now()
  readonly step = 0.002

  broadcast: (event: string) => void
  log: (text: string) => void

  constructor(element, log, keyboard?, ready?) {
    this.log = log
    this.table = new Table(Rack.diamond())
    this.view = new View(element, ready)
    this.aimInputs = new AimInputs(this)
    this.keyboard = keyboard
    this.sound = new Sound(this.view.camera.camera)
    this.chat = new Chat(this.sendChat)
    this.table.balls.forEach((b) => {
      this.view.addMesh(b.ballmesh.mesh)
      this.view.addMesh(b.ballmesh.shadow)
      //      this.view.addMesh(b.ballmesh.spinAxisArrow)
    })
    this.view.addMesh(this.table.cue.mesh)
    this.view.addMesh(this.table.cue.helperMesh)
    this.view.table = this.table
    this.updateController(new Init(this))
  }

  sendChat = (msg) => {
    this.sendEvent(new ChatEvent("->", msg))
  }

  sendEvent(event) {
    this.broadcast(EventUtil.serialise(event))
  }

  advance(elapsed) {
    const steps = Math.floor(elapsed / this.step)
    const computedElapsed = steps * this.step
    const stateBefore = this.table.allStationary()
    for (var i = 0; i < steps; i++) {
      this.table.advance(this.step)
    }
    this.table.updateBallMesh(computedElapsed)
    this.view.update(computedElapsed, this.table.cue.aim)
    this.table.cue.update(computedElapsed)
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent())
    } else {
      if (this.table.outcome.length > 0) {
        //this.sound.eventToSounds(this.table.outcome.shift())
      }
    }
  }

  processEvents() {
    if (this.keyboard) {
      var inputs = this.keyboard.getEvents()
      inputs.forEach((i) => this.inputQueue.push(i))
    }

    while (this.inputQueue.length > 0) {
      const input = this.inputQueue.shift()
      input && this.updateController(this.controller.handleInput(input))
    }

    const event = this.eventQueue.shift()
    event && this.updateController(event.applyToController(this.controller))
  }

  animate(timestamp): void {
    this.advance((timestamp - this.last) / 1000)
    this.last = timestamp
    this.processEvents()
    this.view.render()
    requestAnimationFrame((t) => {
      this.animate(t)
    })
  }

  updateController(controller) {
    if (controller !== this.controller) {
      this.log("Transition to " + controllerName(controller))
      this.controller = controller
      this.controller.onFirst()
    }
    this.controller = controller
  }
}
