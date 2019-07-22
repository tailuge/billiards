import "mocha"
import { expect } from "chai"
import { Controller, Input } from "../../src/controller/controller"
import { Container } from "../../src/controller/container"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { PlayShot } from "../../src/controller/playshot"
import { End } from "../../src/controller/end"
import { AbortEvent } from "../../src/events/abortevent"
import { AimEvent } from "../../src/events/aimevent"
import { BeginEvent } from "../../src/events/beginevent"
import { RackEvent } from "../../src/events/rackevent"
import { HitEvent } from "../../src/events/hitevent"
import { GameEvent } from "../../src/events/gameevent"

describe("Controller", () => {
  it("Abort takes Aim to End", done => {
    let container = new Container(undefined, _ => {})
    let controller: Controller = new Aim(container)
    let event: GameEvent = new AbortEvent()
    expect(event.applyToController(controller)).to.be.an.instanceof(End)
    done()
  })

  it("Begin takes Init to Aim", done => {
    let container = new Container(undefined, _ => {})
    let broadcastEvents: GameEvent[] = []
    container.broadcast = x => broadcastEvents.push(x)

    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(broadcastEvents.pop()).to.be.an.instanceof(RackEvent)
    done()
  })

  it("RackEvent takes Init to WatchAim", done => {
    let container = new Container(undefined, _ => {})

    container.eventQueue.push(new RackEvent(container.table.serialise()))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("HitEvent takes WatchAim to PlayShot", done => {
    let container = new Container(undefined, _ => {})
    container.controller = new WatchAim(container)
    container.eventQueue.push(new HitEvent(container.table.serialise()))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    done()
  })

  it("AimEvent takes WatchAim to WatchAim", done => {
    let container = new Container(undefined, _ => {})
    container.controller = new WatchAim(container)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("Aim handles all inputs", done => {
    let container = new Container(undefined, _ => {})
    let broadcastEvents: GameEvent[] = []
    container.broadcast = x => broadcastEvents.push(x)

    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    container.inputQueue.push(new Input(0.1, "ArrowLeft"))
    container.inputQueue.push(new Input(0.1, "ArrowRight"))
    container.inputQueue.push(new Input(0.1, "ShiftArrowLeft"))
    container.inputQueue.push(new Input(0.1, "ShiftArrowRight"))
    container.inputQueue.push(new Input(0.1, "ArrowUp"))
    container.inputQueue.push(new Input(0.1, "ArrowDown"))
    container.inputQueue.push(new Input(0.1, "Space"))
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    container.processEvents()
    container.processEvents()
    container.processEvents()
    container.processEvents()
    container.processEvents()
    container.processEvents()
    container.processEvents()
    expect(container.inputQueue.length).to.equal(0)
    done()
  })
})
