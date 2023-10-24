import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"
import { BeginEvent } from "../../src/events/beginevent"
import { Input } from "../../src/events/input"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { R } from "../../src/model/physics/constants"
import { Ball } from "../../src/model/ball"
import { Vector3 } from "three"
import { PlayShot } from "../../src/controller/playshot"
import { Aim } from "../../src/controller/aim"
import { PlaceBall } from "../../src/controller/placeball"

initDom()

const jestConsole = console

beforeEach(() => {
  global.console = require("console")
})

afterEach(() => {
  global.console = jestConsole
})

describe("Snooker", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "snooker"

  beforeEach(function (done) {
    Ball.id = 0
    container = new Container(undefined, (_) => {}, false, rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  function bringToAimMode() {
    container.eventQueue.push(new BeginEvent())
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlaceBall)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    container.advance(1)
    container.processEvents()
  }

  const edge =
    PocketGeometry.pockets.pocketS.pocket.pos.y +
    PocketGeometry.middleRadius +
    0.01 * R

  function setupTableWithPot(ball) {
    container.table.cueball.pos.copy(new Vector3(0, edge + R * 2.1, 0))
    ball.pos.copy(new Vector3(0, edge, 0))
  }

  function playShotWaitForOutcome() {
    container.table.cue.aim.angle = -Math.PI / 2
    container.table.cue.aim.power = 1
    container.table.cue.aim.pos.copy(container.table.balls[0].pos)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    container.advance(1)
    container.processEvents()
  }

  it("Snooker has 6 colours and 6 reds", (done) => {
    expect(container.table.balls).to.be.length(13)
    done()
  })

  it("Pot red", (done) => {
    bringToAimMode()
    expect(container.controller).to.be.an.instanceof(Aim)

    setupTableWithPot(container.table.balls[7])
    playShotWaitForOutcome()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.recoder.shots).to.be.length(1)
    done()
  })

  it("Pot colour is respotted", (done) => {
    bringToAimMode()
    expect(container.controller).to.be.an.instanceof(Aim)

    setupTableWithPot(container.table.balls[6])
    playShotWaitForOutcome()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.recoder.shots).to.be.length(2)
    done()
  })
})
