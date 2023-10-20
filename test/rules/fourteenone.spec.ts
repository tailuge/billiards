import "mocha"
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

initDom()

describe("FourteenOne", () => {
  let container: Container
  let broadcastEvents: GameEvent[]
  const rule = "fourteenone"

  beforeEach(function (done) {
    container = new Container(undefined, (_) => {}, false, rule)
    broadcastEvents = []
    container.broadcast = (x) => broadcastEvents.push(x)
    done()
  })

  it("Fourteenone has 16 balls", (done) => {
    expect(container.table.balls).to.be.length(16)
    done()
  })
})
