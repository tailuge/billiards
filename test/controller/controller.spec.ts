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
import { WatchEvent } from "../../src/events/watchevent"
import { HitEvent } from "../../src/events/hitevent"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"

describe("Controller", () => {
  var container: Container
  var broadcastEvents: GameEvent[]

  beforeEach(function(done) {
    container = new Container(undefined, _ => {})
    broadcastEvents = []
    container.broadcast = x => broadcastEvents.push(x)
    done()
  })

  it("Abort takes Aim to End", done => {
    let controller: Controller = new Aim(container)
    let event: GameEvent = new AbortEvent()
    expect(event.applyToController(controller)).to.be.an.instanceof(End)
    done()
  })

  it("Begin takes Init to Aim", done => {
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(broadcastEvents.pop()).to.be.an.instanceof(WatchEvent)
    done()
  })

  it("WatchEvent takes Init to WatchAim", done => {
    container.eventQueue.push(new WatchEvent(container.table.serialise()))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("HitEvent takes WatchAim to PlayShot", done => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new HitEvent(container.table.serialise()))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    done()
  })

  it("AimEvent takes WatchAim to WatchAim", done => {
    container.controller = new WatchAim(container)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("AimEvent takes PlayShot to Aim when all stationary", done => {
    let playShot = new PlayShot(container, true)
    playShot.allStationary = true
    container.controller = playShot
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("AimEvent does not take PlayShot to Aim when not stationary", done => {
    container.controller = new PlayShot(container, true)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    done()
  })

  it("StationaryEvent takes isWatching PlayShot to PlayShot", done => {
    container.controller = new PlayShot(container, true)
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    done()
  })

  it("StationaryEvent takes active PlayShot to WatchAim if no pot", done => {
    container.controller = new PlayShot(container, false)
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("StationaryEvent takes active PlayShot to Aim if pot", done => {
    container.controller = new PlayShot(container, false)
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push({ type: "pot" })
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("End handles all events", done => {
    container.controller = new End(container)
    container.eventQueue.push(new AbortEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new AimEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new HitEvent(container.table))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new WatchEvent(container.table))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    container.inputQueue.push(new Input(0.1, "ArrowLeft"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    done()
  })

  it("Aim handles all inputs", done => {
    container.controller = new Aim(container)
    container.inputQueue.push(new Input(0.1, "A"))
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
    container.processEvents()
    expect(container.inputQueue.length).to.equal(0)
    done()
  })

  it("advance generates no event", done => {
    container.advance(0.1)
    expect(container.eventQueue.length).to.equal(0)
    done()
  })

  it("advance generates StationaryEvent and end of shot", done => {
    container.controller = new PlayShot(container, true)
    container.table.balls[0].vel.x = 0.001
    container.advance(0.01)
    expect(container.eventQueue.length).to.equal(1)
    done()
  })
})
