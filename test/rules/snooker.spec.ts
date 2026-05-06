import nodeConsole from "node:console"
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
import { AimEvent } from "../../src/events/aimevent"
import { HitEvent } from "../../src/events/hitevent"
import { PlaceBall } from "../../src/controller/placeball"
import { Snooker } from "../../src/controller/rules/snooker"
import { Assets } from "../../src/view/assets"
import { Outcome } from "../../src/model/outcome"
import { Table } from "../../src/model/table"
import { zero } from "../../src/utils/three-utils"
import { Session } from "../../src/network/client/session"
import { End } from "../../src/controller/end"

initDom()

const jestConsole = console

beforeEach(() => {
  globalThis.console = nodeConsole
})

afterEach(() => {
  globalThis.console = jestConsole
})

describe("Snooker", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  let snooker: Snooker
  const rule = "snooker"
  let table: Table

  beforeEach(function (done) {
    Ball.id = 0
    Session.init("1", "Player A", "table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(rule),
      ruletype: rule,
    })
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

  function setupTableWithPot(ball: Ball) {
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
    expect(snooker.currentBreak).to.be.equal(1)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("Pot red increments score immediately", (done) => {
    bringToAimMode()

    setupTableWithPot(table.balls[7])
    playShotWaitForOutcome()

    const orderedScores = Session.getInstance().orderedScoresForHud()

    expect(orderedScores.p1).to.be.equal(1)
    expect(orderedScores.p2).to.be.equal(0)
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
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1),
      Outcome.pot(table.balls[1], 1),
    ]
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    done()
  })

  it("target colour after potting colour, when no reds remain", (done) => {
    snooker.targetIsRed = false
    markAllRedsPotted()
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1),
      Outcome.pot(table.balls[1], 1),
    ]
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("potted white goes to placeball", (done) => {
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.pot(table.cueball, 1),
    ]
    table.cueball.state = State.InPocket
    expect(snooker.update(outcome)).to.be.instanceOf(PlaceBall)
    snooker.targetIsRed = false
    table.cueball.state = State.InPocket
    expect(snooker.update(outcome)).to.be.instanceOf(PlaceBall)
    done()
  })

  it("missed pot of colour results in targetRed when reds on table", (done) => {
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1),
    ]
    snooker.targetIsRed = false
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    done()
  })

  it("missed pot of colour results in not targetRed when no reds on table", (done) => {
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1),
    ]
    markAllRedsPotted()
    snooker.targetIsRed = false
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.false
    done()
  })

  it("pot yellow and pink is foul", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1),
      Outcome.pot(table.balls[1], 1),
      Outcome.pot(table.balls[5], 1),
    ]
    table.balls[1].state = State.InPocket
    table.balls[5].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("hit pink but pot yellow is foul", (done) => {
    snooker.targetIsRed = false
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
      Outcome.pot(table.balls[1], 1),
    ]
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("hit black but pot pink is foul", (done) => {
    snooker.targetIsRed = false
    snooker.previousPotRed = true
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[6], 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
      Outcome.pot(table.balls[5], 1),
    ]
    table.balls[5].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(7)
    done()
  })

  it("potted colour when red was hit first says 'instead of red'", (done) => {
    // target colour, hit lowest colour (yellow, id=1) but pot pink (id=5)
    // yellow is lowest colour on table so legalFirstCollision passes
    snooker.targetIsRed = false
    snooker.previousPotRed = false
    // remove all colours except yellow and pink from table so yellow is lowest
    table.balls[2].state = State.InPocket // green
    table.balls[3].state = State.InPocket // brown
    table.balls[4].state = State.InPocket // blue
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[1], 1), // hit yellow (id=1)
      Outcome.pot(table.balls[5], 1), // pot pink (id=5)
    ]
    table.balls[5].state = State.InPocket
    const notifySpy = jest.spyOn(container as any, "notify")
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call.subtext).to.equal("Potted Pink instead of Yellow")
    done()
  })

  it("red potted when targeting colour says 'Red potted instead of colour'", (done) => {
    snooker.targetIsRed = false
    snooker.previousPotRed = true
    // hit black (id=6), accidentally pot a red (id=7)
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[6], 1), // hit black
      Outcome.pot(table.balls[7], 1), // pot a red
    ]
    table.balls[7].state = State.InPocket
    const notifySpy = jest.spyOn(container as any, "notify")
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call.subtext).to.equal("Red potted instead of colour")
    done()
  })

  it("target is red but hit pink is foul", (done) => {
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
    ]
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(6)
    done()
  })

  it("pot red but hit pink first is foul", (done) => {
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
      Outcome.pot(table.balls[8], 1),
    ]
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
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[8], 1),
      Outcome.pot(table.balls[8], 1),
    ]
    table.balls[8].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(snooker.foulPoints).to.be.equal(4)
    done()
  })

  it("target red but pot colour", (done) => {
    container.isSinglePlayer = false
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
      Outcome.pot(table.balls[5], 1),
    ]
    table.balls[6].state = State.InPocket
    snooker.update(outcome)
    expect(snooker.targetIsRed).to.be.true
    expect(broadcastEvents).to.be.length(3)
    done()
  })

  afterEach(() => {
    Session.reset()
  })

  it("should trigger foul notification when white potted", () => {
    const notifySpy = jest.spyOn(container as any, "notify")

    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.pot(table.cueball, 1),
    ]
    table.cueball.state = State.InPocket
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.equal({
      type: "Foul",
      title: "FOUL",
      subtext: "White potted",
      extra: "Ball in hand",
    })
  })

  it("should trigger foul notification on no ball hit", () => {
    const notifySpy = jest.spyOn(container as any, "notify")

    const outcome: Outcome[] = [Outcome.hit(table.cueball, 1)]
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      type: "Foul",
      title: "FOUL",
      subtext: "No ball hit",
    })
    expect("extra" in call).to.be.false
  })

  it("should trigger foul notification on wrong ball hit", () => {
    const notifySpy = jest.spyOn(container as any, "notify")

    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
    ]
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      type: "Foul",
      title: "FOUL",
      subtext: "Hit Pink instead of red",
    })
    expect("extra" in call).to.be.false
  })

  it("should trigger foul notification on potting multiple colours", () => {
    const notifySpy = jest.spyOn(container as any, "notify")

    snooker.targetIsRed = false
    const outcome: Outcome[] = [
      Outcome.hit(table.cueball, 1),
      Outcome.collision(table.cueball, table.balls[5], 1),
      Outcome.pot(table.balls[5], 1),
      Outcome.pot(table.balls[1], 1),
    ]
    table.balls[5].state = State.InPocket
    table.balls[1].state = State.InPocket
    snooker.update(outcome)
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      type: "Foul",
      title: "FOUL",
      subtext: "Potted Pink, Yellow",
    })
    expect("extra" in call).to.be.false
  })

  it("placeBall constrained to D", (done) => {
    expect(snooker.placeBall(zero).length()).to.be.greaterThan(0)
    done()
  })

  describe("getAmountScored", () => {
    it("returns 0 when no balls potted", () => {
      const outcome: Outcome[] = [
        Outcome.hit(table.cueball, 1),
        Outcome.collision(table.cueball, table.balls[7], 1),
      ]
      expect(snooker.getAmountScored(outcome)).to.equal(0)
    })

    it("returns 1 per red potted", () => {
      const outcome: Outcome[] = [
        Outcome.hit(table.cueball, 1),
        Outcome.collision(table.cueball, table.balls[7], 1),
        Outcome.pot(table.balls[7], 1),
        Outcome.pot(table.balls[8], 1),
      ]
      expect(snooker.getAmountScored(outcome)).to.equal(2)
    })

    it("returns colour value (id+1) for a potted colour", () => {
      // black is id=6, value=7
      const outcome: Outcome[] = [
        Outcome.hit(table.cueball, 1),
        Outcome.collision(table.cueball, table.balls[6], 1),
        Outcome.pot(table.balls[6], 1),
      ]
      expect(snooker.getAmountScored(outcome)).to.equal(7)
    })
  })

  describe("respot", () => {
    it("returns empty array when no colours potted", () => {
      const outcome: Outcome[] = [Outcome.pot(table.balls[7], 1)]
      expect(snooker.respot(outcome)).to.deep.equal([])
    })

    it("returns respotted colour balls", () => {
      // pot pink (id=5) — should be respotted
      table.balls[5].state = require("../../src/model/ball").State.InPocket
      const outcome: Outcome[] = [
        Outcome.hit(table.cueball, 1),
        Outcome.collision(table.cueball, table.balls[5], 1),
        Outcome.pot(table.balls[5], 1),
      ]
      const respotted = snooker.respot(outcome)
      expect(respotted).to.have.length(1)
      expect(respotted[0]).to.equal(table.balls[5])
    })

    it("returns both balls when blue and pink are potted", () => {
      // blue is id=4, pink is id=5
      table.balls[4].state = require("../../src/model/ball").State.InPocket
      table.balls[5].state = require("../../src/model/ball").State.InPocket
      const outcome: Outcome[] = [
        Outcome.hit(table.cueball, 1),
        Outcome.collision(table.cueball, table.balls[4], 1),
        Outcome.pot(table.balls[4], 1),
        Outcome.pot(table.balls[5], 1),
      ]
      const respotted = snooker.respot(outcome)
      expect(respotted).to.have.length(2)
      expect(respotted).to.include(table.balls[4])
      expect(respotted).to.include(table.balls[5])
    })
  })

  it("handleGameEnd determines winner by score in 2 player mode", () => {
    container.isSinglePlayer = false
    Session.init("1", "Player A", "table", false)
    const session = Session.getInstance()
    session.playerIndex = 0
    session.opponentName = "Player B"

    Session.getInstance().updateScoresFromNetwork(10, 20, 0)

    const notifySpy = jest.spyOn(container as any, "notifyLocal")

    // Player A clears the table (isWinner=true in the parameter sense)
    const nextController = snooker.handleGameEnd(true)

    expect(nextController).to.be.instanceOf(End)
    // Even though Player A cleared the table, they lost by score
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      title: "YOU LOST",
      subtext: "10 - 20",
      matchScore: `<div class="match-score-container">
        <div class="match-score-label">MATCH SCORE</div>
        <div class="match-score-value">Player A 0 — 1 Player B</div>
      </div>`,
    })

    Session.reset()
  })

  it("handleGameEnd determines winner by score in 2 player mode (as winner)", () => {
    container.isSinglePlayer = false
    Session.init("1", "Player A", "table", false)
    const session = Session.getInstance()
    session.playerIndex = 0
    session.opponentName = "Player B"

    Session.getInstance().updateScoresFromNetwork(30, 20, 0)

    const notifySpy = jest.spyOn(container as any, "notifyLocal")

    // Player B cleared the table (so Player A receives isWinner=false)
    const nextController = snooker.handleGameEnd(false)

    expect(nextController).to.be.instanceOf(End)
    // Player A won by score
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      title: "YOU WON",
      subtext: "30 - 20",
      matchScore: `<div class="match-score-container">
        <div class="match-score-label">MATCH SCORE</div>
        <div class="match-score-value">Player A 1 — 0 Player B</div>
      </div>`,
    })

    Session.reset()
  })

  it("handleGameEnd treats a draw as a win", () => {
    container.isSinglePlayer = false
    Session.init("1", "Player A", "table", false)
    const session = Session.getInstance()
    session.playerIndex = 0
    session.opponentName = "Player B"

    Session.getInstance().updateScoresFromNetwork(20, 20, 0)

    const notifySpy = jest.spyOn(container as any, "notifyLocal")

    const nextController = snooker.handleGameEnd(false)

    expect(nextController).to.be.instanceOf(End)
    // Player A wins on a draw per user request
    const call = notifySpy.mock.calls[0][0] as any
    expect(call).to.deep.include({
      title: "YOU WON",
      subtext: "20 - 20",
      matchScore: `<div class="match-score-container">
        <div class="match-score-label">MATCH SCORE</div>
        <div class="match-score-value">Player A 1 — 0 Player B</div>
      </div>`,
    })

    Session.reset()
  })

  it("nextCandidateBall logic", () => {
    // First shot should return undefined
    expect(snooker.nextCandidateBall()).to.be.undefined

    const hit = new HitEvent({} as any)

    hit.tablejson = { aim: new AimEvent() } as any
    container.recorder.record(hit)

    // Mock not first shot

    // reds on table
    expect(snooker.nextCandidateBall()).to.not.be.undefined
    expect(snooker.nextCandidateBall()!.id).to.be.greaterThan(6)

    // previous pot red, target colour
    snooker.previousPotRed = true
    const ball = snooker.nextCandidateBall()
    expect(ball!.id).to.be.within(1, 6)

    // no reds on table
    markAllRedsPotted()
    snooker.previousPotRed = false
    expect(snooker.nextCandidateBall()!.id).to.be.within(1, 6)
  })
})
