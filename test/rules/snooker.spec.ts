import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { GameEvent } from "../../src/events/gameevent"
import { initDom } from "../view/dom"
import { BeginEvent } from "../../src/events/beginevent"
import { Input } from "../../src/events/input"
import { PocketGeometry } from "../../src/view/pocketgeometry"
import { R } from "../../src/model/physics/constants"
import { Ball, State } from "../../src/model/ball"
import { Vector3 } from "three"
import { PlayShot } from "../../src/controller/playshot"
import { Aim } from "../../src/controller/aim"
import { PlaceBall } from "../../src/controller/placeball"
import { Snooker } from "../../src/controller/rules/snooker"
import { Assets } from "../../src/view/assets"

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
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets(rule),
      rule
    )
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
    const rule = container.rules as Snooker
    expect(rule.previousPotRed).to.be.true
    done()
  })

  it("Pot colour is respotted after red", (done) => {
    bringToAimMode()
    // pot red
    setupTableWithPot(container.table.balls[7])
    playShotWaitForOutcome()

    // pot black
    setupTableWithPot(container.table.balls[6])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    const rule = container.rules as Snooker
    expect(rule.previousPotRed).to.be.false
    expect(container.table.balls[6].onTable()).to.be.true
    done()
  })

  it("Pot colour is not respotted when not after red", (done) => {
    bringToAimMode()
    const rule = container.rules as Snooker
    expect(rule.previousPotRed).to.be.false

    // pot yellow
    setupTableWithPot(container.table.balls[1])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(rule.previousPotRed).to.be.false
    expect(container.table.balls[1].onTable()).to.be.false
    done()
  })

  it("Pot black before yellow gets respotted", (done) => {
    bringToAimMode()
    const rule = container.rules as Snooker
    expect(rule.previousPotRed).to.be.false

    // all reds potted
    container.table.balls
      .filter((b) => b.id > 6)
      .forEach((b) => b.state === State.InPocket)

    // pot black
    setupTableWithPot(container.table.balls[6])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(rule.previousPotRed).to.be.false
    expect(container.table.balls[6].onTable()).to.be.true
    done()
  })

  it("green after yellow is not respotted", (done) => {
    bringToAimMode()
    const rule = container.rules as Snooker
    expect(rule.previousPotRed).to.be.false

    // all reds potted
    container.table.balls
      .filter((b) => b.id > 6)
      .forEach((b) => b.state === State.InPocket)

    // yellow potted
    container.table.balls[1].state = State.InPocket

    // pot green
    setupTableWithPot(container.table.balls[2])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(rule.previousPotRed).to.be.false
    expect(container.table.balls[2].onTable()).to.be.false
    done()
  })
})
