import { HitEvent } from "../events/hitevent"
import { ControllerBase } from "./controllerbase"
import { AimEvent } from "../events/aimevent"
import { Controller, Input } from "./controller"
import { BreakEvent } from "../events/breakevent"
import { Aim } from "./aim"
import { GameEvent } from "../events/gameevent"
import { EventType } from "../events/eventtype"
import { RerackEvent } from "../events/rerackevent"

export class Replay extends ControllerBase {
  delay: number
  shots: GameEvent[]
  firstShot: GameEvent
  timer
  init
  constructor(container, init, shots, retry = false, delay = 1500) {
    super(container)
    this.init = init
    this.shots = [...shots]
    this.firstShot = this.shots[0]
    this.delay = delay
    this.container.table.showTraces(true)
    this.container.table.updateFromShortSerialised(this.init)
    if (retry) {
      const retryEvent = new BreakEvent(init, shots)
      retryEvent.retry = true
      this.container.eventQueue.push(retryEvent)
    } else {
      this.container.view.camera.forceMode(this.container.view.camera.topView)
      this.playNextShot(this.delay * 1.5)
    }
  }

  playNextShot(delay) {
    const shot = this.shots.shift()

    if (shot?.type === EventType.RERACK) {
      const rerack = RerackEvent.fromJson((shot as RerackEvent).ballinfo)
      rerack.applyToController(this)
      if (this.shots.length > 0) {
        this.playNextShot(delay)
      }
      return
    }
    const aim = AimEvent.fromJson(shot)
    this.container.table.cueball = this.container.table.balls[aim.i]
    this.container.table.cueball.pos.copy(aim.pos)
    this.container.table.cue.aim = aim
    this.container.table.cue.updateAimInput()
    this.container.table.cue.t = 1
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.container.eventQueue.push(new HitEvent(this.container.table.cue.aim))
      this.timer = undefined
    }, delay)
  }

  override handleHit(_: HitEvent) {
    this.hit()
    return this
  }

  override handleStationary(_) {
    if (this.shots.length > 0 && this.timer === undefined) {
      this.playNextShot(this.delay)
    }
    return this
  }

  override handleInput(input: Input): Controller {
    this.commonKeyHandler(input)
    return this
  }

  override handleBreak(event: BreakEvent): Controller {
    this.container.table.updateFromShortSerialised(event.init)
    this.shots = [...event.shots]
    this.container.table.showSpin(true)
    if (event.retry) {
      return this.retry()
    }
    this.playNextShot(this.delay)
    return this
  }

  retry() {
    clearTimeout(this.timer)
    this.timer = undefined
    this.container.table.updateFromShortSerialised(this.init)
    const aim = AimEvent.fromJson(this.firstShot)
    this.container.table.cueball = this.container.table.balls[aim.i]
    this.container.rules.cueball = this.container.table.cueball
    this.container.table.cueball.pos.copy(aim.pos)
    this.container.table.cue.aim = aim
    this.container.view.camera.forceMode(this.container.view.camera.aimView)
    return new Aim(this.container)
  }
}
