import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { PlayShot } from "../../src/controller/playshot"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"
import { Outcome } from "../../src/model/outcome"
import { RuleFactory } from "../../src/controller/rules/rulefactory"
import { WatchAim } from "../../src/controller/watchaim"
import { initDom } from "../view/dom"
import { Assets } from "../../src/view/assets"
import { TableGeometry } from "../../src/view/tablegeometry"

initDom()

describe("ThreeCushion", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "threecushion"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, Assets.localAssets(), rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
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
    container.table.outcome.push(Outcome.cushion(balls[0], 1))
    container.table.outcome.push(Outcome.cushion(balls[0], 1))
    container.table.outcome.push(Outcome.cushion(balls[0], 1))
    container.table.outcome.push(Outcome.collision(balls[0], balls[1], 1))
    container.table.outcome.push(Outcome.collision(balls[0], balls[2], 1))
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
    const outcomes: Outcome[] = []
    outcomes.push(Outcome.collision(oppononetBall, cueBall, 1))
    outcomes.push(Outcome.cushion(cueBall, 1))
    outcomes.push(Outcome.cushion(cueBall, 1))
    outcomes.push(Outcome.cushion(cueBall, 1))
    outcomes.push(Outcome.collision(cueBall, redBall, 1))
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.true
    done()
  })

  it("Invalid threecushion outcome", (done) => {
    const outcomes: Outcome[] = []
    outcomes.push(Outcome.collision(cueBall, oppononetBall, 1))
    outcomes.push(Outcome.cushion(cueBall, 1))
    outcomes.push(Outcome.cushion(cueBall, 1))
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.false
    outcomes.push(Outcome.collision(cueBall, redBall, 1))
    expect(Outcome.isThreeCushionPoint(cueBall, outcomes)).to.be.false
    done()
  })
})
