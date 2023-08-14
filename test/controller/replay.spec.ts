import "mocha"
import { expect } from "chai"
import { Container } from "../../src/controller/container"
import { EventUtil } from "../../src/events/eventutil"
import { BreakEvent } from "../../src/events/breakevent"
import { GameEvent } from "../../src/events/gameevent"
import { Replay } from "../../src/controller/replay"
import { PlaceBall } from "../../src/controller/placeball"
import {
  Controller,
  HitEvent,
  Input,
  StationaryEvent,
} from "../../src/controller/controller"
import { Aim } from "../../src/controller/aim"
import { controllerName } from "../../src/controller/util"
import { End } from "../../src/controller/end"

describe("Controller Replay", () => {
  let container: Container
  let broadcastEvents: GameEvent[]

  const state = {
    init: [
      -11, 0, 10.727, 0.007, 11.721, 0.532, 11.683, -0.536, 12.632, -0.008,
      12.672, -1.114, 12.677, 1.108, 13.613, 0.572, 13.593, -0.57, 14.547,
      0.007,
    ],
    shots: [
      {
        type: "AIM",
        verticalOffset: 0,
        sideOffset: 0,
        angle: 0,
        power: 1,
        pos: { x: -11, y: 0, z: 0 },
      },
    ],
  }

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {})
    container.isSinglePlayer = true
    broadcastEvents = []
    container.broadcast = (x) =>
      broadcastEvents.push(EventUtil.fromSerialised(x))
    done()
  })

  it("controllerName", (done) => {
    expect(controllerName(new End(container))).to.be.equals("End")
    expect(controllerName(undefined)).to.be.equals("UNKNOWN")
    done()
  })

  it("BreakEvent takes Init to PlaceBall", (done) => {
    container.eventQueue.push(new BreakEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    done()
  })

  it("BreakEvent with state takes Init to Replay", (done) => {
    container.eventQueue.push(new BreakEvent(state.init, state.shots))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("HitEvent takes Replay to Replay", (done) => {
    const controller: Controller = new Replay(container, state.shots, 0)
    const event: GameEvent = new HitEvent(container.table.serialise())
    expect(event.applyToController(controller)).to.be.an.instanceof(Replay)
    done()
  })

  it("Replay handles inputs", (done) => {
    container.controller = new Replay(container, state.shots, 0)
    container.inputQueue.push(new Input(0.1, "KeyOUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("Stationary takes Replay to Replay", (done) => {
    container.controller = new Replay(container, state.shots, 0)
    container.table.balls[0].setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("PlaceBall moves to Aim on spacebar", (done) => {
    container.controller = new PlaceBall(container)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("PlaceBall handles inputs", (done) => {
    container.controller = new PlaceBall(container)
    container.inputQueue.push(new Input(0.1, "ArrowLeft"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    container.inputQueue.push(new Input(0.1, "ArrowRight"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    container.inputQueue.push(new Input(0.1, "movementXUp"))
    container.processEvents()
    container.inputQueue.push(new Input(0.1, "ShiftArrowLeft"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    done()
  })
})
