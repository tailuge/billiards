import { HitEvent } from "../events/hitevent"
import { ControllerBase } from "./controllerbase"
import { AimEvent } from "../events/aimevent"
import { AbortEvent, Controller, Input } from "./controller"
import { BreakEvent } from "../events/breakevent"
import { Aim } from "./aim"
import { GameEvent } from "../events/gameevent"
import { EventType } from "../events/eventtype"
import { RerackEvent } from "../events/rerackevent"
import { PlaceBallEvent } from "../events/placeballevent"
import { End } from "./end"
import { ScoreEvent } from "../events/scoreevent"
import { ChatEvent } from "../events/chatevent"
import { share, shorten } from "../utils/shorten"
import { gameOverButtons } from "../utils/gameover"
import { anglesAlign } from "../utils/three-utils"
import { Rematch } from "../network/client/rematch"

export class Replay extends ControllerBase {
  override get name() {
    return "Replay"
  }
  delay: number
  shots: GameEvent[]
  firstShot: GameEvent
  currentActive: 0 | 1 | 2 = 1
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
    console.log(`shots: ${this.shots.length}`)
    console.log(`shots: ${JSON.stringify(this.shots)}`)
    if (retry) {
      const retryEvent = new BreakEvent(init, shots)
      retryEvent.retry = true
      this.container.eventQueue.push(retryEvent)
    } else {
      this.container.view.camera.forceMode(
        this.container.view.camera.spectatorView
      )
      this.playNextShot(this.delay * 1.5)
    }
  }

  override onFirst() {
    this.container.table.cue.aimInputs.setDisabled(true)
    const shareButton = this.container.menu.share
    if (shareButton) {
      shareButton.onclick = () => {
        shorten(globalThis.location.href, (url) => {
          const response = share(url)
          this.container.eventQueue.push(new ChatEvent(null, response))
        })
      }
    }
  }

  private rerackShot(shot: GameEvent, delay: number): boolean {
    if (shot?.type !== EventType.RERACK) {
      return false
    }
    const rerack = RerackEvent.fromJson((shot as RerackEvent).ballinfo)
    RerackEvent.applyBallinfoToTable(this.container.table, rerack.ballinfo)
    if (this.shots.length > 0) {
      this.playNextShot(delay)
    }
    return true
  }

  private placeBallShot(shot: GameEvent, delay: number): boolean {
    if (shot?.type !== EventType.PLACEBALL) {
      return false
    }
    const place = PlaceBallEvent.fromJson(shot)
    this.container.table.cueball.pos.copy(place.pos)
    this.container.table.cueball.setStationary()
    if (place.respot) {
      const ball = this.container.table.balls[place.respot.id]
      if (ball) {
        ball.pos.copy(place.respot.pos)
        ball.setStationary()
      }
    }
    if (this.shots.length > 0) {
      this.playNextShot(delay)
    }
    return true
  }

  private scoreShot(shot: GameEvent, delay: number): boolean {
    if (shot?.type !== EventType.SCORE) {
      return false
    }
    const score = ScoreEvent.fromJson(shot)
    score.applyToController(this)
    if (score.active !== 0) {
      this.currentActive = score.active
    }
    if (this.shots.length > 0) {
      this.playNextShot(delay)
    }
    return true
  }

  playNextShot(delay) {
    const shot = this.shots.shift()
    if (!shot) {
      return
    }
    if (
      this.rerackShot(shot, delay) ||
      this.placeBallShot(shot, delay) ||
      this.scoreShot(shot, delay)
    ) {
      return
    }

    const aim = AimEvent.fromJson(shot)
    this.container.setHudActivePlayer(this.currentActive)
    this.container.table.cueball = this.container.table.balls[aim.i]
    console.log(this.container.table.cueball.pos.distanceTo(aim.pos))

    const canPan =
      anglesAlign(this.container.table.cue.aim.angle, aim.angle, 0.8) ||
      this.container.view.camera.mode === this.container.view.camera.topView
    this.container.table.cueball.pos.copy(aim.pos)
    this.container.table.cue.aim = aim
    this.container.table.cue.updateAimInput()
    this.container.table.cue.t = 1
    this.container.view.camera.suggestMode(
      canPan
        ? this.container.view.camera.spectatorView
        : this.container.view.camera.topView
    )
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
    if (this.shots.length === 0 && this.timer === undefined) {
      this.container.notifyLocal(
        {
          type: "Info",
          title: "Replay Complete",
          extra: gameOverButtons.replay + gameOverButtons.lobby,
        },
        0,
        { lobby: () => Rematch.redirectToLobby(undefined, undefined) }
      )
      return new End(this.container)
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

  override handleAbort(_: AbortEvent): Controller {
    clearTimeout(this.timer)
    this.timer = undefined
    return new End(this.container)
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
