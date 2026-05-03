import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { PlayShot } from "../../src/controller/playshot"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { AimEvent } from "../../src/events/aimevent"
import { HitEvent } from "../../src/events/hitevent"
import { GameEvent } from "../../src/events/gameevent"
import { Outcome } from "../../src/model/outcome"
import { RuleFactory } from "../../src/controller/rules/rulefactory"
import { WatchAim } from "../../src/controller/watchaim"
import { ThreeCushionConfig } from "../../src/utils/threecushionconfig"
import { End } from "../../src/controller/end"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { TableGeometry } from "../../src/view/tablegeometry"
import { Session } from "../../src/network/client/session"

initDom()

describe("ThreeCushion", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "threecushion"

  beforeEach(function (done) {
    Session.init("test-client", "TestPlayer", "test-table", false)
    container = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: rule,
    })
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  afterEach(() => {
    Session.reset()
  })

  it("ThreeCushion no point switch player", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.cushion(container.table.balls[1], 1))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(WatchAim)
    done()
  })

  it("ThreeCushion score point transition to Aim", (done) => {
    container.controller = new PlayShot(container)
    container.isSinglePlayer = false
    container.table.balls[0].setStationary()
    container.eventQueue.push(new StationaryEvent())
    const balls = container.table.balls
    container.table.outcome.push(
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.collision(balls[0], balls[1], 1),
      Outcome.collision(balls[0], balls[2], 1)
    )
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("ThreeCushion no point single player switch ball", (done) => {
    container.controller = new PlayShot(container)
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.cushion(container.table.balls[1], 1))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    expect(container.rules.cueball).to.be.equal(container.table.balls[1])
    done()
  })

  it("ThreeCushion has 3 balls", (done) => {
    const rules = RuleFactory.create(rule, container)
    expect(rules.rack()).to.be.lengthOf(3)
    done()
  })

  it("ThreeCushion has no pockets", (done) => {
    const rules = RuleFactory.create(rule, container)
    rules.tableGeometry()
    expect(TableGeometry.hasPockets).to.be.false
    done()
  })

  it("ThreeCushion second player uses second cueball", (done) => {
    const rules = RuleFactory.create(rule, container)
    rules.secondToPlay()
    expect(rules.cueball).to.equal(container.table.balls[1])
    done()
  })

  const cueBall = {}
  const oppononetBall = {}
  const redBall = {}

  it("Valid threecushion outcome", (done) => {
    const outcomes: Outcome[] = [
      Outcome.collision(oppononetBall, cueBall, 1),
      Outcome.cushion(cueBall, 1),
      Outcome.cushion(cueBall, 1),
      Outcome.cushion(cueBall, 1),
      Outcome.collision(cueBall, redBall, 1),
    ]
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.true
    done()
  })

  it("Invalid threecushion outcome", (done) => {
    const outcomes: Outcome[] = [
      Outcome.collision(oppononetBall, cueBall, 1),
      Outcome.cushion(cueBall, 1),
      Outcome.cushion(cueBall, 1),
    ]
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.false
    outcomes.push(Outcome.collision(cueBall, redBall, 1))
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.false
    done()
  })

  it("isEndOfGame returns false before raceTo reached", (done) => {
    const rules = RuleFactory.create(rule, container) as any
    Session.getInstance().updateScoresFromNetwork(3, 2, 0)
    expect(rules.isEndOfGame([])).to.be.false
    done()
  })

  it("isEndOfGame returns true when raceTo reached", (done) => {
    const rules = RuleFactory.create(rule, container) as any
    Session.getInstance().updateScoresFromNetwork(
      ThreeCushionConfig.raceTo,
      2,
      0
    )
    expect(rules.isEndOfGame([])).to.be.true
    done()
  })

  it("update returns End when raceTo reached", (done) => {
    container.controller = new PlayShot(container)
    Session.getInstance().updateScoresFromNetwork(
      ThreeCushionConfig.raceTo - 1,
      0,
      0
    )
    container.table.cueball.setStationary()
    container.eventQueue.push(new StationaryEvent())
    const balls = container.table.balls
    container.table.outcome.push(
      Outcome.collision(balls[0], balls[1], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.cushion(balls[0], 1),
      Outcome.collision(balls[0], balls[2], 1)
    )
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(End)
    done()
  })

  it("ThreeCushion properties and simple methods", (done) => {
    const rules = RuleFactory.create(rule, container)
    expect(rules.asset()).to.equal("models/threecushion.min.gltf")
    const pb = rules.placeBall()
    expect(pb.x).to.equal(0)
    expect(pb.y).to.equal(0)
    expect(pb.z).to.equal(0)
    rules.startTurn() // Should not throw
    done()
  })

  it("ThreeCushion otherPlayersCueBall and nextCandidateBall", (done) => {
    const rules = RuleFactory.create(rule, container)
    rules.cueball = container.table.balls[0]
    expect(rules.otherPlayersCueBall()).to.equal(container.table.balls[1])
    rules.cueball = container.table.balls[1]
    expect(rules.otherPlayersCueBall()).to.equal(container.table.balls[0])

    const hit = new HitEvent({} as any)
    hit.tablejson = { aim: new AimEvent() } as any
    container.recorder.record(hit)

    expect(rules.nextCandidateBall()).to.not.be.undefined
    done()
  })

  it("Proximity outcome emitted when cue ball within 4R in practice mode", (done) => {
    // Initialize session with practice mode
    Session.reset()
    Session.init("test-client", "TestPlayer", "test-table", false, false, true)

    const practiceContainer = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: rule,
      practiceMode: true,
    })

    const balls = practiceContainer.table.balls
    const cueball = balls[0]
    const target = balls[1]

    // Set up: cue ball and one other ball in motion, third ball stationary
    const State = require("../../src/model/ball").State
    cueball.vel.set(1, 0, 0)
    cueball.state = State.Rolling
    target.vel.set(-1, 0, 0)
    target.state = State.Rolling
    balls[2].vel.set(0, 0, 0)
    balls[2].state = State.Stationary

    // Position cue ball within 4R of stationary ball
    const R = require("../../src/model/physics/constants").R
    cueball.pos.set(0, 0, 0)
    balls[2].pos.set(3 * R, 0, 0) // Within 4R

    // First advance: show indicator and set target
    practiceContainer.table.advance(0.01)

    // Verify indicator is shown
    expect(practiceContainer.table.proximityIndicator.group.visible).to.be.true
    expect(practiceContainer.table.proximityIndicator.target).to.equal(balls[2])

    // Add 3 cushion outcomes to meet requirement
    const Outcome = require("../../src/model/outcome").Outcome
    practiceContainer.table.outcome.push(
      Outcome.cushion(cueball, 1),
      Outcome.cushion(cueball, 1),
      Outcome.cushion(cueball, 1)
    )

    // Second advance: check proximity and emit outcome
    practiceContainer.table.advance(0.01)

    // Verify proximity outcome was emitted
    const proximityOutcomes = practiceContainer.table.outcome.filter(
      (o) => o.type === "Proximity"
    )
    expect(proximityOutcomes).to.have.lengthOf(1)

    const proximityOutcome = proximityOutcomes[0]
    expect(proximityOutcome.ballA).to.equal(cueball)
    expect(proximityOutcome.ballB).to.equal(balls[2])
    // Distance should be less than 4R and positive
    expect(proximityOutcome.incidentSpeed).to.be.lessThan(4 * R)
    expect(proximityOutcome.incidentSpeed).to.be.greaterThan(0)

    done()
  })

  it("Proximity indicator does not update after cue ball hits target before 3 cushions", (done) => {
    Session.reset()
    Session.init("test-client", "TestPlayer", "test-table", false, false, true)

    const practiceContainer = new Container({
      element: undefined,
      log: (_) => {},
      assets: Assets.localAssets(),
      ruletype: rule,
      practiceMode: true,
    })

    const balls = practiceContainer.table.balls
    const cueball = balls[0]
    const State = require("../../src/model/ball").State
    const Outcome = require("../../src/model/outcome").Outcome
    const R = require("../../src/model/physics/constants").R

    cueball.vel.set(1, 0, 0)
    cueball.state = State.Rolling
    balls[1].vel.set(-1, 0, 0)
    balls[1].state = State.Rolling
    balls[2].vel.set(0, 0, 0)
    balls[2].state = State.Stationary
    cueball.pos.set(0, 0, 0)
    balls[2].pos.set(3 * R, 0, 0)

    practiceContainer.table.advance(0.01)
    const indicator = practiceContainer.table.proximityIndicator

    // Only 2 cushions then collision with target (invalid shot)
    practiceContainer.table.outcome.push(
      Outcome.cushion(cueball, 1),
      Outcome.cushion(cueball, 1),
      Outcome.collision(cueball, balls[2], 1)
    )
    practiceContainer.table.advance(0.01)

    expect(indicator.hitTarget).to.be.true
    expect(indicator.threeCushionsMet).to.be.false

    // Now 3rd cushion arrives - indicator should not update visually
    practiceContainer.table.outcome.push(Outcome.cushion(cueball, 1))
    practiceContainer.table.advance(0.01)

    expect(indicator.threeCushionsMet).to.be.true
    // No proximity outcome should have been emitted (invalid shot)
    const proximityOutcomes = practiceContainer.table.outcome.filter(
      (o) => o.type === "Proximity"
    )
    expect(proximityOutcomes).to.have.lengthOf(0)

    done()
  })
})
