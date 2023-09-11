import { Input } from "../events/input"
import { GameEvent } from "../events/gameevent"
import { StationaryEvent } from "../events/stationaryevent"
import { Controller } from "../controller/controller"
import { Table } from "../model/table"
import { View } from "../view/view"
import { Init } from "../controller/init"
import { EventUtil } from "../events/eventutil"
import { AimInputs } from "../view/aiminputs"
import { Keyboard } from "../events/keyboard"
import { Sound } from "../view/sound"
import { controllerName } from "../controller/util"
import { Chat } from "../view/chat"
import { ChatEvent } from "../events/chatevent"
import { Throttle } from "../events/throttle"
import { Sliders } from "../view/sliders"
import { Recorder } from "../events/recorder"
import { Rules } from "../rules/rules"
import { RuleFactory } from "../rules/rulefactory"

/**
 * Model, View, Controller container.
 */
export class Container {
  table: Table
  view: View
  controller: Controller
  inputQueue: Input[] = []
  eventQueue: GameEvent[] = []
  keyboard: Keyboard
  sound: Sound
  chat: Chat
  sliders: Sliders
  recoder: Recorder
  id: string = ""
  isSinglePlayer: boolean = true
  rules: Rules

  last = performance.now()
  readonly step = 0.001953125 * 1

  broadcast: (event: string) => void
  log: (text: string) => void

  constructor(element, log, ruletype?, keyboard?, ready?, id?) {
    this.log = log
    this.rules = RuleFactory.create(ruletype, this)
    this.table = this.rules.table()
    this.view = new View(element, ready, this.table)
    this.table.cue.aimInputs = new AimInputs(this)
    this.keyboard = keyboard
    this.sound = new Sound(this.view.camera.camera)
    this.chat = new Chat(this.sendChat)
    this.sliders = new Sliders()
    this.recoder = new Recorder(this)
    this.id = id
    this.table.balls.forEach((b) => {
      this.view.addMesh(b.ballmesh.mesh)
      this.view.addMesh(b.ballmesh.shadow)
      this.view.addMesh(b.ballmesh.spinAxisArrow)
    })
    this.view.addMesh(this.table.cue.mesh)
    this.view.addMesh(this.table.cue.helperMesh)
    this.view.addMesh(this.table.cue.placerMesh)
    this.updateController(new Init(this))
  }

  sendChat = (msg) => {
    this.sendEvent(new ChatEvent(this.id, msg))
  }

  throttle = new Throttle(250, (event) => {
    this.recoder.record(event)
    this.broadcast(EventUtil.serialise(event))
  })

  sendEvent(event) {
    this.throttle.send(event)
  }

  advance(elapsed) {
    const steps = Math.floor(elapsed / this.step)
    const computedElapsed = steps * this.step
    const stateBefore = this.table.allStationary()
    for (let i = 0; i < steps; i++) {
      this.table.advance(this.step)
    }
    this.table.updateBallMesh(computedElapsed)
    this.view.update(computedElapsed, this.table.cue.aim)
    this.table.cue.update(computedElapsed)
    if (!stateBefore && this.table.allStationary()) {
      this.eventQueue.push(new StationaryEvent())
    }
    this.sound.processOutcomes(this.table.outcome)
  }

  processEvents() {
    if (this.keyboard) {
      const inputs = this.keyboard.getEvents()
      inputs.forEach((i) => this.inputQueue.push(i))
    }

    while (this.inputQueue.length > 0) {
      this.lastEventTime = this.last
      const input = this.inputQueue.shift()
      input && this.updateController(this.controller.handleInput(input))
    }

    // only process events when stationary
    if (this.table.allStationary()) {
      const event = this.eventQueue.shift()
      if (event) {
        this.lastEventTime = performance.now()
        this.updateController(event.applyToController(this.controller))
      }
    }
  }

  lastEventTime = performance.now()

  animate(timestamp): void {
    this.advance((timestamp - this.last) / 1000)
    this.last = timestamp
    this.processEvents()
    const needsRender =
      timestamp < this.lastEventTime + 10000 ||
      !this.table.allStationary() ||
      this.view.sizeChanged()
    if (needsRender) {
      this.view.render()
    }
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
  }
}
