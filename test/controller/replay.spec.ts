import { expect } from "chai"
import { Container } from "../../src/container/container"
import { BreakEvent } from "../../src/events/breakevent"
import { GameEvent } from "../../src/events/gameevent"
import { Replay } from "../../src/controller/replay"
import { PlaceBall } from "../../src/controller/placeball"
import {
  AbortEvent,
  Controller,
  HitEvent,
  Input,
  StationaryEvent,
} from "../../src/controller/controller"
import { Aim } from "../../src/controller/aim"
import { controllerName } from "../../src/controller/util"
import { End } from "../../src/controller/end"
import { canvas3d, initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { Init } from "../../src/controller/init"

initDom()

jest.useFakeTimers()
jest.spyOn(global, "setTimeout")

describe("Controller Replay", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  let replayController: Replay

  const state = {
    init: [
      -11, 0, 10.727, 0.007, 11.721, 0.532, 11.683, -0.536, 12.632, -0.008,
      12.672, -1.114, 12.677, 1.108, 13.613, 0.572, 13.593, -0.57, 14.547,
      0.007,
    ],
    shots: [
      {
        type: "AIM",
        offset: { x: -0.1, y: 0.1, z: 0 },
        angle: 0,
        power: 1,
        pos: { x: -11, y: 0, z: 0 },
      },
    ],
  }

  beforeEach(function (done) {
    const mockKeyboard = { getEvents: () => [] }
    container = new Container(
      canvas3d,
      (_) => {},
      Assets.localAssets(),
      "nineball",
      mockKeyboard,
      () => {}
    )
    container.isSinglePlayer = true
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    replayController = new Replay(container, state.init, state.shots, false, 0)
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

  it("Replay and retry moves to Aim", (done) => {
    container.controller = new Replay(container, state.init, state.shots, true)
    expect(container.eventQueue.length).to.be.equal(1)
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("BreakEvent takes Aim to Replay", (done) => {
    container.controller = new Aim(container)
    container.eventQueue.push(new BreakEvent(state.init, state.shots))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("HitEvent takes Replay to Replay", (done) => {
    const controller: Controller = replayController
    const event: GameEvent = new HitEvent(container.table.serialise())
    expect(event.applyToController(controller)).to.be.an.instanceof(Replay)
    done()
  })

  it("Replay handles inputs", (done) => {
    container.controller = replayController
    container.inputQueue.push(new Input(0.1, "KeyOUp"))
    container.inputQueue.push(new Input(0.1, "KeyDUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("Stationary takes Replay to Replay", (done) => {
    container.controller = replayController
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Replay)
    done()
  })

  it("BreakEvent takes Replay to Replay", (done) => {
    container.controller = new Replay(
      container,
      state.init,
      state.shots,
      false,
      0
    )
    container.table.cueball.setStationary()
    container.eventQueue.push(new BreakEvent(state.init, state.shots))
    container.processEvents()
    jest.advanceTimersByTime(1000)
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

  it("Abort takes Replay to Init", (done) => {
    container.controller = replayController
    container.eventQueue.push(new AbortEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    done()
  })
})
