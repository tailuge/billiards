import "mocha"
import { expect } from "chai"
import { Controller, HitEvent, Input } from "../../src/controller/controller"
import { Container } from "../../src/container/container"
import { Aim } from "../../src/controller/aim"
import { WatchAim } from "../../src/controller/watchaim"
import { PlayShot } from "../../src/controller/playshot"
import { End } from "../../src/controller/end"
import { AbortEvent } from "../../src/events/abortevent"
import { EventUtil } from "../../src/events/eventutil"
import { AimEvent } from "../../src/events/aimevent"
import { BeginEvent } from "../../src/events/beginevent"
import { WatchEvent } from "../../src/events/watchevent"
import { StationaryEvent } from "../../src/events/stationaryevent"
import { GameEvent } from "../../src/events/gameevent"
import { WatchShot } from "../../src/controller/watchshot"
import { Outcome } from "../../src/model/outcome"
import { PlaceBall } from "../../src/controller/placeball"
import { ChatEvent } from "../../src/events/chatevent"
import { PlaceBallEvent } from "../../src/events/placeballevent"
import { zero } from "../../src/utils/utils"
import { BreakEvent } from "../../src/events/breakevent"
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
})
