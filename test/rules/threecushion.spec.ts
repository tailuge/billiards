import "mocha"
import { expect } from "chai"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { PlayShot } from "../../src/controller/playshot"
import { EventUtil } from "../../src/events/eventutil"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"
import { Outcome } from "../../src/model/outcome"
import { RuleFactory } from "../../src/rules/rulefactory"

describe("ThreeCushion", () => {
  let container: Container
  let broadcastEvents: GameEvent[]

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, "threecushion")
    broadcastEvents = []
    container.broadcast = (x) =>
      broadcastEvents.push(EventUtil.fromSerialised(x))
    done()
  })

  it("ThreeCushion processed", (done) => {
    container.controller = new PlayShot(container)
    container.table.balls[0].setStationary()
    container.eventQueue.push(new StationaryEvent())
    container.table.outcome.push(Outcome.pot(container.table.balls[1], 1))
    container.processEvents()
    expect(container.controller).to.be.an.instanceof(Aim)
    done()
  })

  it("ThreeCushion has 3 balls", (done) => {
    const rules = RuleFactory.create("threecushion", null)
    expect(rules.rack()).to.be.lengthOf(3)
    done()
  })

  it("ThreeCushion has no pockets", (done) => {
    const rules = RuleFactory.create("threecushion", null)
    expect(rules.table().hasPockets).to.be.false
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
