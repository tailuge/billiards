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
import { Outcome } from "../../src/model/outcome"
import { Table } from "../../src/model/table"
import { zero } from "../../src/utils/utils"

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
  let snooker: Snooker
  const rule = "snooker"
  let table: Table

  beforeEach(function (done) {
    Ball.id = 0
    container = new Container(
      undefined,
      (_) => {},
      Assets.localAssets(rule),
      rule
    )
    snooker = container.rules as Snooker
    table = container.table
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  function markAllRedsPotted() {
    table.balls
      .filter((b) => b.id > 6)
      .forEach((b) => (b.state = State.InPocket))
  }

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
    table.cueball.pos.copy(new Vector3(0, edge + R * 2.1, 0))
    ball.pos.copy(new Vector3(0, edge, 0))
  }

  function playShotWaitForOutcome() {
    table.cue.aim.angle = -Math.PI / 2
    table.cue.aim.power = 1
    table.cue.aim.pos.copy(table.balls[0].pos)
    container.inputQueue.push(new Input(0.1, "SpaceUp"))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(PlayShot)
    container.advance(1)
    container.processEvents()
  }

  it("Snooker has 6 colours and 15 reds", (done) => {
    expect(table.balls).to.be.length(22)
    done()
  })

  it("Pot red", (done) => {
    bringToAimMode()
    expect(container.controller).to.be.an.instanceof(Aim)

    setupTableWithPot(table.balls[7])
    playShotWaitForOutcome()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.recorder.shots).to.be.length(1)
    expect(snooker.currentBreak).to.be.equal(1)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("Pot colour is respotted after red", (done) => {
    bringToAimMode()
    // pot red
    setupTableWithPot(table.balls[7])
    playShotWaitForOutcome()

    // pot black
    setupTableWithPot(table.balls[6])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(snooker.previousPotRed).to.be.false
    expect(table.balls[6].onTable()).to.be.true
    done()
  })

  it("Pot colour is not respotted when not after red", (done) => {
    bringToAimMode()
    snooker.targetIsRed = false
    snooker.previousPotRed = false

    markAllRedsPotted()

    // pot yellow
    setupTableWithPot(table.balls[1])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(snooker.targetIsRed).to.be.false
    expect(table.balls[1].onTable()).to.be.false
    done()
  })

  it("Pot black before yellow gets respotted", (done) => {
    bringToAimMode()
    expect(snooker.previousPotRed).to.be.false

    markAllRedsPotted()

    // pot black
    setupTableWithPot(table.balls[6])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(snooker.previousPotRed).to.be.false
    expect(table.balls[6].onTable()).to.be.true
    done()
  })

  it("green after yellow is not respotted", (done) => {
    bringToAimMode()
    snooker.targetIsRed = false

    markAllRedsPotted()

    // yellow potted
    table.balls[1].state = State.InPocket

    // pot green
    setupTableWithPot(table.balls[2])
    playShotWaitForOutcome()
    container.advance(1)
    container.processEvents()

    expect(container.controller).to.be.an.instanceof(Aim)
    expect(snooker.targetIsRed).to.be.false
    expect(table.balls[2].onTable()).to.be.false
    done()
  })

  it("target red after potting colour, when reds remain", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[1], 1))
    outcome.push(Outcome.pot(table.balls[1], 1))
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    done()
  })

  it("target colour after potting colour, when no reds remain", (done) => {
    snooker.targetIsRed = false
    markAllRedsPotted()
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[1], 1))
    outcome.push(Outcome.pot(table.balls[1], 1))
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("potted white goes to placeball", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.pot(table.cueball, 1))
    table.cueball.state = State.InPocket
    expect(snooker.update(outcome)).to.be.instanceOf(PlaceBall)
    snooker.targetIsRed = false
    table.cueball.state = State.InPocket
    expect(snooker.update(outcome)).to.be.instanceOf(PlaceBall)
    done()
  })

  it("missed pot of colour results in targetRed when reds on table", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[1], 1))
    snooker.targetIsRed = false
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    done()
  })

  it("missed pot of colour results in not targetRed when no reds on table", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[1], 1))
    markAllRedsPotted()
    snooker.targetIsRed = false
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("pot yellow and pink is foul", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[1], 1))
    outcome.push(Outcome.pot(table.balls[1], 1))
    outcome.push(Outcome.pot(table.balls[5], 1))
    table.balls[1].state = State.InPocket
    table.balls[5].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("hit pink but pot yellow is foul", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[5], 1))
    outcome.push(Outcome.pot(table.balls[1], 1))
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("hit black but pot pink is foul", (done) => {
    snooker.targetIsRed = false
    snooker.previousPotRed = true
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[6], 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[5], 1))
    outcome.push(Outcome.pot(table.balls[5], 1))
    table.balls[5].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(7)
    done()
  })

  it("target is red but hit pink is foul", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[5], 1))
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("pot red but hit pink first is foul", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[5], 1))
    outcome.push(Outcome.pot(table.balls[8], 1))
    table.balls[8].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("no ball hit is foul", (done) => {
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(4)
    snooker.targetIsRed = false
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(4)
    done()
  })

  it("target colour but pot red", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[8], 1))
    outcome.push(Outcome.pot(table.balls[8], 1))
    table.balls[8].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(4)
    done()
  })

  it("target red but pot colour", (done) => {
    container.isSinglePlayer = false
    const outcome: Outcome[] = []
    outcome.push(Outcome.hit(table.cueball, 1))
    outcome.push(Outcome.collision(table.cueball, table.balls[5], 1))
    outcome.push(Outcome.pot(table.balls[5], 1))
    table.balls[6].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    console.log(broadcastEvents)
    expect(broadcastEvents).to.be.length(2)
    done()
  })

  it("placeBall constrained to D", (done) => {
    expect(snooker.placeBall(zero).length()).to.be.greaterThan(0)
    done()
  })
})
