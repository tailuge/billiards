import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { R } from "../../src/model/physics/constants"
import { Vector3 } from "three"
import { Ball, State } from "../../src/model/ball"
import { Aim } from "../../src/controller/aim"
import { BeginEvent } from "../../src/events/beginevent"
import { Input } from "../../src/events/input"
import { WatchEvent } from "../../src/events/watchevent"
import { RerackEvent } from "../../src/events/rerackevent"
import { Assets } from "../../src/view/assets"

initDom()

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("FourteenOne", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "fourteenone"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, Assets.localAssets(), rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    Ball.id = 0
    done()
  })

  it("Fourteenone has 16 balls", (done) => {
    expect(container.table.balls).to.be.length(5)
    done()
  })

  function bringToAimMode() {
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    container.advance(1)
    container.processEvents()
  }

  const edge =
    PocketGeometry.pockets.pocketS.pocket.pos.y +
    PocketGeometry.middleRadius +
    0.01 * R

  function setupTableWithTwoBallsRemaining() {
    const balls = container.table.balls
    for (let i = 3; i < balls.length; i++) {
      balls[i].pos.copy(PocketGeometry.pockets.pocketS.pocket.pos)
      balls[i].state = State.InPocket
    }
    balls[0].pos.copy(new Vector3(0, edge + R * 4.2, 0))
    balls[1].pos.copy(new Vector3(0, edge + R * 2.1, 0))
    balls[2].pos.copy(new Vector3(0, edge, 0))
  }

  function playShotWaitForOutcome() {
    container.table.cue.aim.angle = -Math.PI / 2
    container.table.cue.aim.power = 1
    container.table.cue.aim.pos.copy(container.table.balls[0].pos)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    container.advance(1)
    container.processEvents()
  }

  function setupPenultimateBallPot() {
    bringToAimMode()
    expect(container.controller).to.be.an.instanceof(Aim)

    setupTableWithTwoBallsRemaining()
    expect(container.table.balls.filter((b) => b.onTable())).to.be.length(3)

    playShotWaitForOutcome()
    expect(container.controller).to.be.an.instanceof(Aim)

    const watchEvent = broadcastEvents[3] as WatchEvent
    expect(watchEvent.json.rerack).to.be.true
    expect(container.recorder.shots[1].type).to.be.equal("RERACK")
  }

  it("Pot penultimate ball, causing rerack", (done) => {
    setupPenultimateBallPot()

    const rerack = container.recorder.shots[1] as RerackEvent
    const before = container.table.shortSerialise()
    rerack.applyToController(container.controller)
    const after = container.table.shortSerialise()
    expect(before).to.be.deep.equal(after)
    done()
  })

  it("play shot after rerack, check recording", (done) => {
    setupPenultimateBallPot()

    const before = JSON.stringify(container.recorder.shots[1])

    // play second pot
    container.advance(1)
    container.processEvents()
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)

    const after = JSON.stringify(container.recorder.shots[1])
    expect(before).to.be.equal(after)
    done()
  })
})
